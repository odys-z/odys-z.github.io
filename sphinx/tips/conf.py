# Configuration file for the Sphinx documentation builder.
project = "Ody's Tips"
copyright = '2023, Ody Zhou'
author = 'Ody Zelenskyy'

release = '1.0'

extensions = [
    'sphinx.ext.mathjax',
    'sphinx_rtd_theme',
]

templates_path = ['_templates']

exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

html_theme = 'sphinx_rtd_theme'
html_favicon = 'favicon.ico'

html_static_path = ['_static']

html_copy_source = False
html_show_sourcelink = False
