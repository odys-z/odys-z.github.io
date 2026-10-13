#!/usr/bin/env python3
"""Share static files between the English and translated HTML builds.

Usage: dedup_static.py <english-build-dir> <translated-build-dir>

Every file under <translated>/_static and <translated>/_images that is
byte-identical to the same path under <english> (theme fonts and CSS,
screenshots, videos) is deleted, and links to it in the translated HTML
pages are rewritten to the English copy one level up. Files that differ
per language (search translations, documentation_options.js) are kept.

The translated build must sit directly inside the English one, e.g.
products/portfolio/zh-CN/.
"""
import filecmp
import os
import re
import sys
from pathlib import Path

DIRS = ('_static', '_images')


def main(en: Path, tr: Path) -> None:
    shared = set()
    saved = 0
    for d in DIRS:
        root = tr / d
        if not root.is_dir():
            continue
        for f in sorted(p for p in root.rglob('*') if p.is_file()):
            rel = f.relative_to(tr).as_posix()
            src = en / rel
            if src.is_file() and filecmp.cmp(f, src, shallow=False):
                saved += f.stat().st_size
                f.unlink()
                shared.add(rel)
        # drop folders left empty
        for p in sorted(root.rglob('*'), key=lambda p: -len(p.parts)):
            if p.is_dir() and not any(p.iterdir()):
                p.rmdir()

    # ((../)*)(_static|_images)/path  -> ../\1\2/path, for shared files only
    pat = re.compile(r'((?:\.\./)*)((?:%s)/[^"\'?#)\s]+)' % '|'.join(DIRS))

    def fix(m):
        return ('../' + m.group(1) + m.group(2)) if m.group(2) in shared else m.group(0)

    pages = 0
    for page in tr.rglob('*.html'):
        text = page.read_text(encoding='utf-8')
        new = pat.sub(fix, text)
        if new != text:
            page.write_text(new, encoding='utf-8')
            pages += 1

    print(f'dedup {tr}: {len(shared)} shared files, {saved // 1024} KiB saved, {pages} pages relinked')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())
