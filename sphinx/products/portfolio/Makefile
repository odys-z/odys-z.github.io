# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = source
BUILDDIR      = build

PAGEDIR       = ../../../products/portfolio
DISTDIR       = ../../../landings/portfolio-0.8/res/dist
PDFPREFIX     = portfolio-0.8

# Translations: every folder in source/ named like a language code (zh-CN,
# zh-TW, ja, pt-BR ...) holds translated copies of the English .rst files.
# They are found automatically; each is built with source/conf.py and the
# tag -t <code> (zh-CN -> zh_CN), which selects the language in DOC_LANGS.
#   English  source/        -> $(PAGEDIR)/          $(PDFPREFIX)-en.pdf
#   zh-CN    source/zh-CN/  -> $(PAGEDIR)/zh-CN/    $(PDFPREFIX)-zh-CN.pdf
# Override to build fewer: make pdf LANGS=zh-TW
LANGS        ?= $(shell cd $(SOURCEDIR) && ls -d */ 2>/dev/null | tr -d / | grep -E '^[a-z]{2,3}(-[A-Za-z0-9]{2,4})?$$')
srcdir        = $(if $(filter en,$(1)),$(SOURCEDIR),$(SOURCEDIR)/$(1))
langopts      = $(if $(filter en,$(1)),,-c $(SOURCEDIR) -t $(subst -,_,$(1)))

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
	@echo "Portfolio targets:"
	@echo "  ghpage     build HTML for English + $(LANGS) into $(PAGEDIR)"
	@echo "  pdf        build the PDF manual for every language into $(DISTDIR)"
	@echo "  pdf-<lang> build one PDF: pdf-en, $(addprefix pdf-,$(LANGS))"
	@echo "  langs      list the language folders found: en $(LANGS)"

ghpage:
	@rm -rf $(PAGEDIR)
	@rm -rf $(BUILDDIR)
	@mkdir $(BUILDDIR)
	@$(SPHINXBUILD) -b html -d "$(BUILDDIR)/doctrees" "$(SOURCEDIR)" "$(BUILDDIR)/html" $(SPHINXOPTS) $(O)
	@cp -a $(BUILDDIR)/html/. $(PAGEDIR)
	@for l in $(LANGS); do \
	    echo "== HTML $$l -> $(PAGEDIR)/$$l"; \
	    $(SPHINXBUILD) -b html -c "$(SOURCEDIR)" -t $$(echo $$l | tr - _) -d "$(BUILDDIR)/doctrees-$$l" "$(SOURCEDIR)/$$l" "$(BUILDDIR)/html-$$l" $(SPHINXOPTS) $(O) || exit 1; \
	    mkdir -p $(PAGEDIR)/$$l; \
	    cp -a $(BUILDDIR)/html-$$l/. $(PAGEDIR)/$$l; \
	    rm -f $(PAGEDIR)/$$l/.buildinfo; \
	    python3 dedup_static.py $(PAGEDIR) $(PAGEDIR)/$$l || exit 1; \
	done
	@touch $(PAGEDIR)/.nojekyll

# Build the PDF manuals (English + every language folder) and publish them
# to the landing page's dist folder.
pdf: pdf-en $(addprefix pdf-,$(LANGS))

langs:
	@echo en $(LANGS)

pdf-%:
	@rm -rf $(BUILDDIR)/latex-$*
	@$(SPHINXBUILD) -M latexpdf "$(call srcdir,$*)" "$(BUILDDIR)/latex-$*" $(call langopts,$*) $(SPHINXOPTS) $(O)
	@mkdir -p $(DISTDIR)
	@mv $(BUILDDIR)/latex-$*/latex/portfolio.pdf $(DISTDIR)/$(PDFPREFIX)-$*.pdf
	@echo "PDF published: $(DISTDIR)/$(PDFPREFIX)-$*.pdf"

.PHONY: help ghpage pdf langs Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
