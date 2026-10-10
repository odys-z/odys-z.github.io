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
PDFNAME       = portfolio-0.8-en.pdf

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

ghpage:
	@rm -rf $(PAGEDIR)
	@rm -r $(BUILDDIR)
	@mkdir $(BUILDDIR)
	@make html
	@cp -a $(BUILDDIR)/html/. $(PAGEDIR)
	@touch $(PAGEDIR)/.nojekyll

# Build the PDF manual and publish it to the landing page's dist folder.
pdf:
	@rm -rf $(BUILDDIR)/latex
	@$(SPHINXBUILD) -M latexpdf "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
	@mkdir -p $(DISTDIR)
	@mv $(BUILDDIR)/latex/portfolio08documents.pdf $(DISTDIR)/$(PDFNAME)
	@echo "PDF published: $(DISTDIR)/$(PDFNAME)"

.PHONY: help pdf Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
