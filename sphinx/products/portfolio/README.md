# Portfolio documents

| Folder           | Language | HTML output                 | PDF |
|------------------|----------|-----------------------------|-----|
| `source/`        | English  | `products/portfolio/`       | `portfolio-0.8-en.pdf` |
| `source/zh-CN/`  | 简体中文 | `products/portfolio/zh-CN/` | `portfolio-0.8-zh-CN.pdf` |
| `source/zh-TW/`  | 繁體中文 | `products/portfolio/zh-TW/` | `portfolio-0.8-zh-TW.pdf` |

`source/zh-CN/` and `source/zh-TW/` are plain translated copies of the
English `.rst` files, same names and structure. There is one `conf.py`
(`source/conf.py`). The Makefile finds every folder in `source/` named like
a language code and builds it with that `conf.py` and a build tag
(`zh-CN` -> `-t zh_CN`), which picks the language's line in `DOC_LANGS`.
The English build ignores those folders.

The language dropdown at the top of each `index.rst` (`|lang-select|`) is
generated from `DOC_LANGS` too.

## Adding a language

1. Copy a translation folder, e.g. `source/zh-TW/` to `source/ja/`, and
   translate the `.rst` files.
2. Add one line to `DOC_LANGS` in `conf.py`:
   `('ja', '日本語', 'ja/', 'Portfolio 0.8 ドキュメント'),`

`make ghpage` and `make pdf` pick it up; `make langs` lists what they will
build. Chinese, Japanese and Korean PDFs use xelatex with Noto CJK fonts
(`CJK_FONT_REGION` in `conf.py`); other languages use the default setup.
Also add the language to the landing pages (`css/lang-switcher.js`).

| Command          | Result |
|------------------|--------|
| `make ghpage`    | HTML for English and every language folder |
| `make pdf`       | the PDF for every language into `landings/portfolio-0.8/res/dist/` |
| `make pdf-zh-TW` | one PDF (`pdf-en`, `pdf-zh-CN`, `pdf-zh-TW`) |
| `make langs`     | list the languages that will be built |

Then run `landings/gen_manifest.py` so the landing pages list the PDFs.

## Editing

- Change a page in all three folders. Keep labels (`.. _setup-synode:`),
  directives and code blocks the same; only the text is translated.
- Images and videos are shared from `source/imgs/`, so paths in the
  translated files have one more `../` (e.g. `../../imgs/x.png`).
- Title underlines must be at least as wide as the title; a Chinese
  character counts as 2 (`关于` needs `====`).
- reST inline markup next to Chinese text needs a space before it:
  `命名为 *Synode*。`

## Notes

- The translated HTML builds share `_static/` and `_images/` with the English
  build (`dedup_static.py`), so fonts, screenshots and the setup video are
  stored once.
- `source/conf.py` works around a Sphinx bug where search on Chinese pages
  fails with "ChineseStemmer is not defined".
- Install `jieba`, or Chinese words can't be found by the docs search.
