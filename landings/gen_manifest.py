#!/usr/bin/env python3
"""
gen_manifest.py

Scans a "res/dist" folder for published Portfolio build artifacts and
writes a manifest.json describing three resource types:

  1. apk      - portfolio-<version>[-<anything>].apk or .aab
                (no market/org — flat "Android" section)
  2. desktop  - desktop-<version>-<market>-<org>.zip
  3. synode   - synode-<version>-<jre>-<market>-<org>.zip
                (has an extra "jre" segment between version and market)

Output shape:

{
  "generated_at": "...",
  "android": [
    {"file": "portfolio-0.8.0-android.apk", "version": "0.8.0"}
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

Usage:
    python gen_manifest.py --dist ../web/res/dist --out ../web/res/dist/manifest.json
"""

import argparse
import json
import re
import sys
from pathlib import Path
from datetime import datetime, timezone

APK_RE = re.compile(
    r'^portfolio-(?P<version>[\d.]+)(?:-[^.]+)?\.(?P<ext>apk|aab)$', re.IGNORECASE)

# desktop/synode filenames use '-' both as the field separator AND inside
# org ids (e.g. "pm-4"), so a plain regex can't tell them apart. We
# instead split on '-' positionally: market is always a single token right
# after version (no hyphens in market names), and org is "everything
# remaining before the extension", rejoined with '-'.
DESKTOP_PREFIX_RE = re.compile(r'^desktop-(?P<version>[\d.]+)-', re.IGNORECASE)
SYNODE_PREFIX_RE = re.compile(r'^synode-(?P<version>[\d.]+)-', re.IGNORECASE)


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
    if len(parts) < 3:
        return None
    jre, market, org = parts[0], parts[1], '-'.join(parts[2:])
    return {"version": m["version"], "jre": jre, "market": market, "org": org}


def build_manifest(dist_dir: Path) -> dict:
    android = []
    tree: dict[str, dict[str, dict]] = {}
    unmatched = []

    for f in sorted(dist_dir.iterdir()):
        if not f.is_file():
            continue

        apk_m = APK_RE.match(f.name)
        if apk_m:
            android.append({
                "file": f.name, "version": apk_m["version"],
                "ext": apk_m["ext"].lower(), **file_meta(f)
            })
            continue

        stem = f.name[:-len(f.suffix)] if f.suffix else f.name  # strip .zip

        if f.name.lower().startswith('desktop-'):
            info = parse_desktop(stem)
            if info:
                node = tree.setdefault(info["market"], {}).setdefault(info["org"], {})
                node["desktop"] = {"file": f.name, "version": info["version"], **file_meta(f)}
                continue

        if f.name.lower().startswith('synode-'):
            info = parse_synode(stem)
            if info:
                node = tree.setdefault(info["market"], {}).setdefault(info["org"], {})
                node["synode"] = {
                    "file": f.name, "version": info["version"], "jre": info["jre"],
                    **file_meta(f)
                }
                continue

        unmatched.append(f.name)

    if not android and not tree:
        print(f"warning: no recognized artifacts found in {dist_dir}", file=sys.stderr)
    for name in unmatched:
        print(f"note: skipped unrecognized file: {name}", file=sys.stderr)

    # Keep android's newest build first (helps the JS pick a "latest" link
    # trivially if you only ever want to show one).
    android.sort(key=lambda a: a["modified_at"], reverse=True)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "android": android,
        "tree": tree,
    }


def main():
    parser = argparse.ArgumentParser(description="Generate resource-tree manifest.json.")
    parser.add_argument("--dist", required=True, type=Path)
    parser.add_argument("--out", type=Path, default=None,
                         help="Defaults to <dist>/manifest.json if omitted.")
    args = parser.parse_args()

    dist_dir = args.dist.resolve()
    if not dist_dir.is_dir():
        print(f"error: dist folder not found: {dist_dir}", file=sys.stderr)
        sys.exit(1)

    manifest = build_manifest(dist_dir)

    out_path = (args.out if args.out is not None else args.dist / "manifest.json").resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = out_path.with_suffix(out_path.suffix + ".tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    tmp_path.replace(out_path)

    print(f"wrote {out_path}")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
