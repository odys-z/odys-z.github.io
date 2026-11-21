#!/usr/bin/env python3
"""
Credits
=======

Entierly generted by Claude.ai.

About
=====
gen_manifest.py

Scans a "res/dist" folder for published Portfolio build artifacts and
writes a manifest.json describing four resource types:

  1. apk      - portfolio-<version>[-<anything>].apk or .aab
                (no market/org — flat "Android" section)
  2. desktop  - desktop-<version>-<market>-<org>.zip
  3. synode   - synode-<version>-<jre>-<market>-<org>.zip
                (has an extra "jre" segment between version and market)
  4. docs     - portfolio-<version>-<lang>.pdf  (e.g. portfolio-0.8-en.pdf)
                (flat "Documents" section, one entry per language)

Output shape:

{
  "generated_at": "...",
  "android": [
    {"file": "portfolio-0.8.0-android.apk", "version": "0.8.0"}
  ],
  "docs": [
    {"file": "portfolio-0.8-en.pdf", "version": "0.8", "lang": "en"}
  ],
  "tree": {
    "<market>": {
      "<org>": {
        "desktop": {"file": "...", "version": "..."},
        "synode":  {"file": "...", "version": "...", "jre": "..."}
      }
    }
  }
}

If both a desktop and synode zip exist for the same market/org but at
different versions, both are kept as-is (per-artifact version, not a
single global version) since builds may ship on independent cadences.

Page URL (for the QR codes)
---------------------------
  "page_url": "https://odys-z.github.io/landings/portfolio-0.8/"

is the public URL of the landing root (the "en" page). The landing pages
use it to draw, in the browser (render-resource-tree.js), the QR code of
each language page and the download QR codes of the Android packages.
Set it with --page-url. Without it, the script queries public IP echo
services (falling back to --iface, default eth0), prompts for the port,
and guesses the full example artifact URL down to the APK file so you can
edit/confirm the full URL before saving manifest.json.

Download links (--base-url)
---------------------------
By default each artifact's "file" is its bare file name, so the page
downloads it from the res/dist folder next to the manifest (the private
servers). The GitHub site does not hold the packages: they are assets of
a GitHub release. For it, give --base-url, the release's download folder,
and write manifest.github.json, which the pages load on odys-z.github.io
(see MANIFEST_BY_HOST in render-resource-tree.js):

    python gen_manifest.py --dist <folder holding the packages> \
        --out portfolio-0.8/res/dist/manifest.github.json \
        --base-url https://github.com/odys-z/semantic-jserv/releases/download/portfolip-0.8/ \
        --page-url https://odys-z.github.io/landings/portfolio-0.8/

The packages' file names must be the release's asset names. The PDF
manuals ("docs") are kept as bare names: they are in res/dist on every
site, GitHub's included.

Usage:
    python gen_manifest.py --dist ../web/res/dist --out ../web/res/dist/manifest.json
    python gen_manifest.py --dist portfolio-0.8/res/dist \
        --page-url https://odys-z.github.io/landings/portfolio-0.8/
    python gen_manifest.py --dist portfolio-0.8/res/dist --iface eth0 --port 8888
"""

import argparse
import ipaddress
import json
import re
import socket
import struct
import sys
import urllib.error
import urllib.request
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urlsplit, urlunsplit

APK_RE = re.compile(
    r'^portfolio-(?P<version>[\d.]+)(?:-[^.]+)?\.(?P<ext>apk|aab)$', re.IGNORECASE)

DOC_RE = re.compile(
    r'^portfolio-(?P<version>[\d.]+)-(?P<lang>[a-z]{2}(?:[-_][a-z]{2})?)\.pdf$', re.IGNORECASE)

# desktop/synode filenames use '-' both as the field separator AND inside
# org ids (e.g. "pm-4"), so a plain regex can't tell them apart. We
# instead split on '-' positionally: market is always a single token right
# after version (no hyphens in market names), and org is "everything
# remaining before the extension", rejoined with '-'.
DESKTOP_PREFIX_RE = re.compile(r'^desktop-(?P<version>[\d.]+)-', re.IGNORECASE)
SYNODE_PREFIX_RE = re.compile(r'^synode-(?P<version>[\d.]+)-', re.IGNORECASE)

IPV4_RE = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')

# Public IPv4 echo endpoints (AWS checkip services first, then ipify fallback).
IP_ECHO_URLS = (
    "https://checkip.amazonaws.com",
    "https://checkip.global.api.aws",
    "https://api.ipify.org",
)


def file_meta(f: Path) -> dict:
    return {
        "size_bytes": f.stat().st_size,
        "modified_at": datetime.fromtimestamp(
            f.stat().st_mtime, tz=timezone.utc
        ).isoformat(timespec="seconds"),
    }


def parse_desktop(stem: str):
    """desktop-<version>-<market>-<org...>  (org may contain '-')"""
    m = DESKTOP_PREFIX_RE.match(stem + '-')
    if not m:
        return None
    rest = stem[m.end() - 1:].lstrip('-')  # tokens after version-
    parts = rest.split('-')
    if len(parts) < 2:
        return None
    market, org = parts[0], '-'.join(parts[1:])
    return {"version": m["version"], "market": market, "org": org}


def parse_synode(stem: str):
    """synode-<version>-<jre>-<market>-<org...>  (org may contain '-')"""
    m = SYNODE_PREFIX_RE.match(stem + '-')
    if not m:
        return None
    rest = stem[m.end() - 1:].lstrip('-')
    parts = rest.split('-')

    # while parts[-1] in ['.tar', '.tar.gz', '.gz', '.zip', '.7z']:
    # #     parts = parts[:-1]
    # 
    # print(parts, '-'.join(parts[2:]))

    if len(parts) < 3:
        return None
    jre, market, org = parts[0], parts[1], '-'.join(parts[2:])
    return {"version": m["version"], "jre": jre, "market": market, "org": org}


def remove_suffixes(filepath: str) -> str:
    path = Path(filepath)
    filename = path.name

    # Collect all suffixes (e.g. ['.tar', '.gz'])
    suffixes = ['.tar', '.tar.gz', '.gz', '.zip', '.7z']

    # Strip suffixes from the end of the filename string
    for suffix in reversed(suffixes):
        if filename.endswith(suffix):
            filename = filename[: -len(suffix)]

    return str(path.parent / filename) if path.parent != Path(".") else filename


def build_manifest(dist_dir: Path, base_url: str = "") -> dict:
    """base_url, if given, prefixes the packages' "file" (not the docs')."""
    def link(name: str) -> str:
        return base_url + name if base_url else name

    android = []
    docs = []
    tree: dict[str, dict[str, dict]] = {}
    unmatched = []

    for f in sorted(dist_dir.iterdir()):
        if not f.is_file():
            continue

        # our own output, not an artifact
        if f.suffix.lower() in ('.json', '.tmp'):
            continue

        apk_m = APK_RE.match(f.name)
        if apk_m:
            android.append({
                "file": link(f.name), "version": apk_m["version"],
                "ext": apk_m["ext"].lower(), **file_meta(f)
            })
            continue

        doc_m = DOC_RE.match(f.name)
        if doc_m:
            docs.append({
                "file": f.name, "version": doc_m["version"],
                "lang": doc_m["lang"], **file_meta(f)
            })
            continue

        stem = remove_suffixes(f.name)

        if f.name.lower().startswith('desktop-'):
            info = parse_desktop(stem)
            if info:
                node = tree.setdefault(info["market"], {}).setdefault(info["org"], {})
                node["desktop"] = {"file": link(f.name), "version": info["version"], **file_meta(f)}
                continue

        if f.name.lower().startswith('synode-'):
            info = parse_synode(stem)
            if info:
                node = tree.setdefault(info["market"], {}).setdefault(info["org"], {})
                if not hasattr(node, "synode") and not "synode" in node:
                    node["synode"] = []
                node["synode"].append({
                    "file": link(f.name), "version": info["version"], "jre": info["jre"],
                    **file_meta(f)
                })
                continue

        unmatched.append(f.name)

    if not android and not docs and not tree:
        print(f"warning: no recognized artifacts found in {dist_dir}", file=sys.stderr)
    for name in unmatched:
        print(f"note: skipped unrecognized file: {name}", file=sys.stderr)

    # Keep android's newest build first (helps the JS pick a "latest" link
    # trivially if you only ever want to show one).
    android.sort(key=lambda a: a["modified_at"], reverse=True)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "android": android,
        "docs": docs,
        "tree": tree,
    }


def iface_ipv4(iface: str):
    """IPv4 address of a network interface (Linux), or None."""
    try:
        import fcntl
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            packed = fcntl.ioctl(s.fileno(), 0x8915,  # SIOCGIFADDR
                                 struct.pack('256s', iface[:15].encode()))
        return socket.inet_ntoa(packed[20:24])
    except (ImportError, OSError):
        return None


def outbound_ipv4():
    """IPv4 address of the default route's interface (no packet is sent)."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("10.255.255.255", 1))
            return s.getsockname()[0]
    except OSError:
        return None


def public_ipv4(timeout: float = 3.0):
    """Public IPv4 from AWS/ipify echo services, or (None, None)."""
    for url in IP_ECHO_URLS:
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "curl/8.0"}
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                body = resp.read().decode("utf-8", errors="ignore").strip()
                m = IPV4_RE.search(body)
                if not m:
                    continue
                ip_obj = ipaddress.IPv4Address(m.group(0))
                if ip_obj.is_global:
                    return str(ip_obj), url
        except (urllib.error.URLError, TimeoutError, ValueError, OSError):
            continue
    return None, None


def guess_landing_dir_path(dist_dir: Path, out_path: Path) -> str:
    """Guess landing directory path (where index.html sits) from dist/manifest path."""
    # Prefer the directory above .../res/dist when present, or the parent of the manifest directory.
    target_dir = out_path.parent
    if target_dir.name == "dist" and target_dir.parent.name == "res":
        landing_dir = target_dir.parent.parent
    elif dist_dir.name == "dist" and dist_dir.parent.name == "res":
        landing_dir = dist_dir.parent.parent
    else:
        landing_dir = target_dir.parent

    parts = landing_dir.parts
    for marker in ("products", "product", "landings"):
        if marker in parts:
            idx = parts.index(marker)
            return "/" + "/".join(parts[idx:]) + "/"

    folder_name = landing_dir.name.strip("/")
    return f"/{folder_name}/" if folder_name else "/"


def sample_apk_name(manifest: dict, dist_dir: Path) -> str:
    """Pick an APK filename from the built manifest or dist_dir for display/editing."""
    if manifest.get("android"):
        first_file = manifest["android"][0]["file"]
        return Path(urlsplit(first_file).path).name
    for f in sorted(dist_dir.iterdir()):
        if f.is_file() and APK_RE.match(f.name):
            return f.name
    return "portfolio-0.8.apk"


def derive_page_url_from_full_url(full_url: str, apk_name: str, dist_dir: Path, out_path: Path) -> str:
    """Extract the landing page_url (containing index.html) from the full artifact URL."""
    parts = urlsplit(full_url)
    scheme = parts.scheme or "https"
    netloc = parts.netloc
    path = parts.path or "/"

    # Strip trailing APK filename if present
    if apk_name and path.endswith("/" + apk_name):
        path = path[: -len(apk_name)]
    elif path.lower().endswith(".apk") or path.lower().endswith(".aab"):
        path = path.rsplit("/", 1)[0] + "/"

    # Strip manifest directory tail (e.g. res/dist/ or <out_dir_name>/) if the user left it in
    dist_tail = "res/dist/"
    out_tail = out_path.parent.name.strip("/") + "/" if out_path.parent.name.strip("/") else ""
    if path.endswith("/" + dist_tail):
        path = path[: -len(dist_tail)]
    elif out_tail and path.endswith("/" + out_tail):
        path = path[: -len(out_tail)]

    if not path.startswith("/"):
        path = "/" + path
    if not path.endswith("/"):
        path = path + "/"

    return urlunsplit((scheme, netloc, path, "", ""))


def prompt_port(default_port: int) -> int:
    """Pause and require a port (Enter accepts default_port)."""
    while True:
        raw = input(f"Enter port [{default_port}]: ").strip()
        if not raw:
            return default_port
        try:
            port = int(raw)
            if 1 <= port <= 65535:
                return port
        except ValueError:
            pass
        print("Invalid port. Enter a number between 1 and 65535.", file=sys.stderr)


def prompt_full_apk_url(ip: str, port: int, dist_dir: Path, out_path: Path, manifest: dict) -> str:
    """Show full URL down to the APK and let the user edit/confirm before saving."""
    landing_path = guess_landing_dir_path(dist_dir, out_path)
    apk_name = sample_apk_name(manifest, dist_dir)
    default_full_url = f"https://{ip}:{port}{landing_path}res/dist/{apk_name}"

    raw = input(f"Full APK URL [{default_full_url}]: ").strip()
    chosen_full_url = raw or default_full_url
    return derive_page_url_from_full_url(chosen_full_url, apk_name, dist_dir, out_path)


def auto_page_url(iface: str, port: int, dist_dir: Path, out_path: Path, manifest: dict) -> str:
    ip, source = public_ipv4()
    if not ip:
        ip = iface_ipv4(iface) or outbound_ipv4()
        print(f"note: public IP lookup failed, using local IP {ip or '127.0.0.1'} "
              "(see --iface)", file=sys.stderr)
    else:
        print(f"detected public IP {ip} via {source}")

    chosen_port = prompt_port(port)
    return prompt_full_apk_url(ip or "127.0.0.1", chosen_port, dist_dir, out_path, manifest)


def main():
    parser = argparse.ArgumentParser(description="Generate resource-tree manifest.json.")
    parser.add_argument("--dist", required=True, type=Path)
    parser.add_argument("--out", type=Path, default=None,
                         help="Defaults to <dist>/manifest.json if omitted.")
    parser.add_argument("--page-url", default=None,
                         help="Public URL of the landing root page, written as "
                              "\"page_url\" for the pages' QR codes; default: "
                              "derived from the full APK URL prompt.")
    parser.add_argument("--base-url", default=None,
                         help="URL prefixed to the packages' file names, e.g. a GitHub "
                              "release's download folder; default: bare file names, "
                              "served from the manifest's own folder.")
    parser.add_argument("--iface", default="eth0",
                         help="Network interface fallback for page_url (default: eth0).")
    parser.add_argument("--port", type=int, default=8888,
                         help="Default port prompt value for page_url (default: 8888).")
    args = parser.parse_args()

    dist_dir = args.dist.resolve()
    if not dist_dir.is_dir():
        print(f"error: dist folder not found: {dist_dir}", file=sys.stderr)
        sys.exit(1)

    base_url = args.base_url
    if base_url and not base_url.endswith('/'):
        base_url += '/'
    manifest = build_manifest(dist_dir, base_url or "")

    out_path = (args.out if args.out is not None else args.dist / "manifest.json").resolve()

    page_url = args.page_url or auto_page_url(args.iface, args.port, dist_dir, out_path, manifest)
    # first key after "generated_at", easy to find
    manifest = {"generated_at": manifest["generated_at"], "page_url": page_url,
                **{k: v for k, v in manifest.items() if k != "generated_at"}}
    print(f"page_url: {page_url}")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = out_path.with_suffix(out_path.suffix + ".tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    tmp_path.replace(out_path)

    print(f"wrote {out_path}")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
