#!/usr/bin/env python3
"""
gen_manifest.py

Scans a "res/dist" folder for published Portfolio build artifacts (APK,
Synode zip) and writes a manifest.json that index.html's JS
(renderDownloadLinks) reads to build the download links dynamically.

Intended to live OUTSIDE the web root, e.g.:

    project/
      scripts/gen_manifest.py   <- this file
      web/index.html
      web/res/dist/             <- scanned folder
          portfolio-0.8-android.apk
          portfolio-0.8-synode.zip
          portfolio-0.7-android.apk   (older builds ignored if versioned)

Usage:
    python gen_manifest.py --dist ../web/res/dist --out ../web/res/dist/manifest.json
    python gen_manifest.py --dist ../web/res/dist --out ../web/res/dist/manifest.json --version 0.8

Can also be run on a schedule (cron / CI) to keep manifest.json in sync
whenever new artifacts are dropped into res/dist.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from datetime import datetime, timezone

# Filename patterns to recognize each artifact type.
# Adjust these if your build/CI naming convention differs.
APK_PATTERN = re.compile(r'.*\.apk$', re.IGNORECASE)
SYNODE_PATTERN = re.compile(r'.*synode.*\.(zip|tar\.gz|tgz)$', re.IGNORECASE)

# Optional: pull a version number like "0.8" or "1.2.3" out of a filename.
VERSION_PATTERN = re.compile(r'(\d+(?:\.\d+){1,2})')


def find_latest(dist_dir: Path, pattern: re.Pattern):
    """Return the most recently modified file matching pattern, or None."""
    candidates = [f for f in dist_dir.iterdir() if f.is_file() and pattern.match(f.name)]
    if not candidates:
        return None
    return max(candidates, key=lambda f: f.stat().st_mtime)


def guess_version(filename: str, fallback: str) -> str:
    m = VERSION_PATTERN.search(filename)
    return m.group(1) if m else fallback


def build_manifest(dist_dir: Path, version_override: str | None) -> dict:
    apk_file = find_latest(dist_dir, APK_PATTERN)
    synode_file = find_latest(dist_dir, SYNODE_PATTERN)

    if not apk_file and not synode_file:
        print(f"warning: no apk or synode files found in {dist_dir}", file=sys.stderr)

    # Prefer an explicit --version, else derive from whichever file we found.
    default_version = version_override
    if not default_version:
        for f in (apk_file, synode_file):
            if f:
                default_version = guess_version(f.name, "0.0")
                break
        else:
            default_version = "0.0"

    manifest = {
        "version": default_version,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }

    if apk_file:
        manifest["apk"] = {
            "file": apk_file.name,
            "size_bytes": apk_file.stat().st_size,
            "modified_at": datetime.fromtimestamp(
                apk_file.stat().st_mtime, tz=timezone.utc
            ).isoformat(timespec="seconds"),
        }

    if synode_file:
        manifest["synode"] = {
            "file": synode_file.name,
            "size_bytes": synode_file.stat().st_size,
            "modified_at": datetime.fromtimestamp(
                synode_file.stat().st_mtime, tz=timezone.utc
            ).isoformat(timespec="seconds"),
        }

    return manifest


def main():
    parser = argparse.ArgumentParser(description="Generate manifest.json for Portfolio downloads.")
    parser.add_argument("--dist", required=True, type=Path,
                         help="Path to the res/dist folder to scan.")
    parser.add_argument("--out", required=True, type=Path,
                         help="Path to write manifest.json to.")
    parser.add_argument("--version", default=None,
                         help="Override the version string instead of guessing from filenames.")
    args = parser.parse_args()

    dist_dir = args.dist.resolve()
    if not dist_dir.is_dir():
        print(f"error: dist folder not found: {dist_dir}", file=sys.stderr)
        sys.exit(1)

    manifest = build_manifest(dist_dir, args.version)

    out_path = args.out.resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Write atomically-ish: write to temp then replace, so JS never sees a
    # half-written file if this runs while the site is being served.
    tmp_path = out_path.with_suffix(out_path.suffix + ".tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    tmp_path.replace(out_path)

    print(f"wrote {out_path}")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
