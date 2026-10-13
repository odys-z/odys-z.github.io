# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))

# -- Project information -----------------------------------------------------

project = 'Portfolio 0.8 Documents'
copyright = '2027, Odys Zhou'
author = 'Odys Zhou'

# The full version, including alpha/beta/rc tags
release = '1.0'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx_rtd_theme',
    'sphinxcontrib.video'
]

# -- Languages --------------------------------------------------------------
# source/ is English. Each translation is a folder of translated copies of
# the same .rst files, named by language code: source/zh-CN/, source/zh-TW/.
# The Makefile finds those folders and builds each one with this conf.py and
# a build tag made from the folder name (zh-CN -> -t zh_CN):
#   sphinx-build -c source -t zh_CN source/zh-CN build/html-zh-CN
#
# To add a language: add source/<folder>/ and one line here. That's all;
# `make ghpage` and `make pdf` pick it up.
#   (Sphinx language code, name in the dropdown, folder, document title)
DOC_LANGS = [
    ('en',    'English',  '',       'Portfolio 0.8 Documents'),
    ('zh_CN', '简体中文', 'zh-CN/', 'Portfolio 0.8 文档'),
    ('zh_TW', '繁體中文', 'zh-TW/', 'Portfolio 0.8 文件'),
]

language = 'en'
for _code, _name, _folder, _title in DOC_LANGS[1:]:
    if tags.has(_code):
        language = _code
        project = _title
        html_title = project

# Language dropdown, placed in each index.rst as |lang-select|.
_up = '' if language == 'en' else '../'
_options = ''.join(
    '<option value="%s%sindex.html"%s>%s</option>'
    % (_up, folder, ' selected' if code == language else '', name)
    for code, name, folder, _title in DOC_LANGS)
rst_prolog = '''
.. |lang-select| raw:: html

   <select class="lang-select" aria-label="Language" onchange="location.href=this.value">%s</select>
''' % _options

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
# Translation folders are separate builds (see Languages above).
exclude_patterns = [folder.rstrip('/') for _c, _n, folder, _t in DOC_LANGS if folder]


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['static']

# https://stackoverflow.com/a/62061439
html_show_sourcelink = False
html_copy_source = False

# -- Options for LaTeX/PDF output -------------------------------------------
# pdflatex can't print these characters, used in code blocks, by default.
latex_elements = {
    'preamble': r'''
\DeclareUnicodeCharacter{2500}{-}
\DeclareUnicodeCharacter{2570}{\ensuremath{\llcorner}}
\DeclareUnicodeCharacter{25B6}{\ensuremath{\blacktriangleright}}
''',
}

# Same file name for every language: build/.../latex/portfolio.pdf
latex_documents = [
    ('index', 'portfolio.tex', project, author, 'manual'),
]


# Languages that need xelatex + xeCJK for the PDF, and their Noto CJK
# region (glyph style). Other languages use the default pdflatex setup.
CJK_FONT_REGION = {'zh_CN': 'SC', 'zh_TW': 'TC', 'ja': 'JP', 'ko': 'KR'}

if language in CJK_FONT_REGION:
    # CJK PDFs: xelatex + xeCJK with Noto CJK in the language's glyph style.
    latex_engine = 'xelatex'
    latex_elements = {
        'fontpkg': r'''
\setmainfont{DejaVu Serif}
\setsansfont{DejaVu Sans}
\setmonofont{DejaVu Sans Mono}
''',
        'preamble': r'''
\setCJKmainfont{Noto Serif CJK %(r)s}
\setCJKsansfont{Noto Sans CJK %(r)s}
\setCJKmonofont{Noto Sans Mono CJK %(r)s}
\XeTeXlinebreaklocale "zh"
%% Chapter labels: "第 1 章" instead of babel's English "Chapter 1".
%% \@chappos is the suffix Sphinx's page headers already support.
\makeatletter
\def\portfoliochapname{\renewcommand{\chaptername}{第}}
\@ifundefined{captionsenglish}{}{\expandafter\addto\csname captionsenglish\endcsname{\portfoliochapname}}
\portfoliochapname
\def\@chappos{章}
\@ifundefined{DOCH}{}{%%
  \renewcommand{\DOCH}{\raggedleft\CNV\FmN{\@chapapp}\space\CNoV\thechapter
    \space\CNV\FmN{\@chappos}\par\nobreak\vskip 40\p@}}
\makeatother
''' % {'r': CJK_FONT_REGION[language]},
    }


def _fix_zh_search(app):
    """Sphinx's Chinese search ships the English stemmer but emits
    "window.Stemmer = ChineseStemmer", which is undefined, so search on the
    zh pages throws. Name it after the stemmer it actually ships."""
    try:
        from sphinx.search.zh import SearchChinese
    except ImportError:
        return
    if (getattr(SearchChinese, 'js_stemmer_rawcode', '') == 'english-stemmer.js'
            and SearchChinese.language_name != 'English'):
        class SearchChineseFixed(SearchChinese):
            language_name = 'English'
        app.add_search_language(SearchChineseFixed)


def setup(app):
    app.add_css_file('custom.css')
    _fix_zh_search(app)
