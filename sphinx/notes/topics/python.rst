Python Namespace and Anson Packages
===================================

A Brief Overview of Python Namespaces
-------------------------------------

Grok, May 8th 2025

.. code-block:: text

    I have two library project. I need install them into one location,
    so another project can import both packages.
    What's the structure should like?

**Key Points About the Structure**

Namespace Package Levels:

* src, io, and oz are namespace packages (or hybrid packages) that form the shared prefix src.io.oz.
* Each can have an empty __init__.py to mark it as a package, ensuring compatibility with older Python
  versions and tools (e.g., linters, IDEs).
* Per PEP 420, __init__.py files are optional for pure namespace packages, but including empty ones
  is safer for broader compatibility.

Subpackages p1 and p2:

* p1 and p2 are regular subpackages under src.io.oz, each with their own __init__.py (empty or minimal).
* p1 contains jclient.py (with Clients class).
* p2 contains its modules (e.g., some_module.py).

Installation Target:

* Both projects install their contents into site-packages/src/io/oz, merging p1 and p2 under the same oz directory.
* The namespace package structure ensures src.io.oz.p1 and src.io.oz.p2 are distinct and importable.

1. Packaging Configuration

Each project needs a packaging configuration to install its contents into site-packages/src/io/oz.

Project 1 (pyproject.toml)::

    [project]
    name = "project1"
    version = "1.0.0"
    description = "Library providing src.io.oz.p1"
    dependencies = []

    [tool.setuptools.packages.find]
    where = ["src"]
    include = ["src.io.oz.p1*"]  # Install only src.io.oz.p1
    namespaces = true  # Enable namespace package support

    [tool.setuptools.package-dir]
    "src.io.oz.p1" = "src/io/oz/p1"

Project 2 (pyproject.toml)::

    [project]
    name = "project2"
    version = "1.0.0"
    description = "Library providing src.io.oz.p2"
    dependencies = []

    [tool.setuptools.packages.find]
    where = ["src"]
    include = ["src.io.oz.p2*"]  # Install only src.io.oz.p2
    namespaces = true  # Enable namespace package support

    [tool.setuptools.package-dir]
    "src.io.oz.p2" = "src/io/oz/p2"

2. Installation

::

    site-packages/
    └── src/
        ├── __init__.py
        └── io/
            ├── __init__.py
            └── oz/
                ├── __init__.py
                ├── p1/
                │   ├── __init__.py
                │   └── jclient.py
                └── p2/
                    ├── __init__.py
                    └── some_module.py

**Citations**

#. Python Documentation on Modules and Packages:

    Source: Python Official Documentation
    URL: https://docs.python.org/3/tutorial/modules.html
    Relevance: Explains Python’s module and package system, including the role of
    __init__.py for regular packages and how modules are resolved via sys.path.
    This forms the basis for understanding regular package behavior and sys.path
    precedence.

#. PEP 420 – Implicit Namespace Packages:

    Source: Python Enhancement Proposals (PEP)
    URL: https://peps.python.org/pep-0420/
    Relevance: Defines namespace packages, introduced in Python 3.3, which allow multiple directories to contribute to a single namespace without requiring __init__.py. This is central to the recommendation for structuring src.io.oz as a namespace package to combine p1 and p2.

#. Python Documentation on Namespace Packages:

    Source: Python Official Documentation
    URL: https://docs.python.org/3/reference/import.html#namespace-packages
    Relevance: Details how namespace packages work, including their behavior with or without __init__.py and how Python merges submodules from multiple directories. This supports the explanation of why src.io.oz.p1 and src.io.oz.p2 can coexist.

#. Setuptools Documentation on Namespace Packages:

    Source: Setuptools Documentation
    URL: https://setuptools.pypa.io/en/latest/userguide/package_discovery.html#namespace-packages
    Relevance: Describes how to configure namespace packages using setuptools (e.g., find_namespace_packages or namespaces = true in pyproject.toml). This informed the packaging configuration for installing project1 and project2 into site-packages/src/io/oz.

#. Python Packaging User Guide:

    Source: Python Packaging Authority (PyPA)
    URL: https://packaging.python.org/en/latest/guides/creating-and-discovering-packages/
    Relevance: Provides best practices for structuring and packaging Python projects, including the use of pyproject.toml and setup.py. This guided the recommended pyproject.toml configurations for project1 and project2.

#. Python Documentation on sys.path and Module Search Path:

    Source: Python Official Documentation
    URL: https://docs.python.org/3/library/sys.html#sys.path
    Relevance: Explains how Python searches for modules and packages, which is critical for understanding sys.path order and potential collisions in regular packages versus namespace package merging.

#. PEP 518 - Specifying Minimum Build System Requirements for Python Projects:

    Source: Python Enhancement Proposals (PEP)
    URL: https://peps.python.org/pep-0518/
    Relevance: Defines the pyproject.toml format, which was used in the recommended packaging configurations for project1 and project2.

#. How These Were Applied

**Namespace vs. Regular Packages:**

PEP 420 and the Python documentation on namespace packages informed the distinction between regular packages (requiring __init__.py, single directory) and namespace packages (merging multiple directories). This was key to recommending a namespace package structure for src.io.oz to combine p1 and p2.

**Directory Structure:**

The Python Packaging User Guide and Setuptools documentation guided the recommended structure (site-packages/src/io/oz/p1 and p2) and the use of empty __init__.py files for compatibility.

**Packaging Configuration:**

Setuptools documentation and PEP 518 supported the pyproject.toml examples, ensuring project1 and project2 install correctly into site-packages/src/io/oz with namespace package support.

**Import Resolution:**

The Python documentation on modules and sys.path explained why regular packages cause collisions (first src in sys.path wins) and how namespace packages avoid this, directly addressing your initial import issue with src.io.odysz.jclient.

Anclient.py3 Tests Summary
--------------------------

To install *io.odysz.anson.py* and *io.odysz.semantic.jprotocol.py* is out of the
question since this structure will beweildered the python interpretor and PyCharm.

Look like whenever there is a package with the same name in the project directory,
which is the way of java protocal packages, it will stop continuing to search for
the next path, and then report package not found.

And debugging with python 3.9, Windows, shows that the site package path in sys.path
is *lib/site-packages*, in lower case, is not working for finding *anson* packages.

Anson Packages Namespace
------------------------

*Decision on May 8th 2025*

Have Anclient.py3 distributed with the protocol runtime, copied to application's Source
location when initialized.

::

    anson.py3/
    └── anson/  [the src equivalent]
        ├── __init__.py
        └── io/
            ├── __init__.py
            └── odysz/
                ├── __init__.py
                ├── anson.py   [Anson, AnsonField]
                ├── common.py  [LangExt, Utils]
                └── anson/
                    ├── __init__.py
                    └── x.py       [AnsonException]


Anclient.py3 with the protocol layer::

    anclient.py3/
    ├── io/
    │   ├── __init__.py
    │   └── odysz/
    │       ├── __init__.py
    │       ├── semantics.py        [SessionInf, SemanticObject]
    │       └── semantic/
    │           ├── __init__.py
    │           ├── jprotocol.py/   [AnsonHeader, AnsonBody, AnsonMsg, AnsonReq, AnsonResp]
    │           └── jserv/
    │               ├── __init__.py
    │               └── echo.py     [EchoReq]
    └── src/
        └── anclient/
            ├── __init__.py
            └── io/
                ├── __init__.py
                └── odysz/
                    ├── __init__.py
                    └── jclient.py  [Clients, SessionClient, InsecueClient, Ping()]

Synode.py3 with the docsync protocol layer::

    synode.py3/
    ├── io/ (copied)
    │   ├── __init__.py
    │   └── odysz/
    │       ├── __init__.py
    │       ├── semantics.py        [SessionInf, SemanticObject]
    │       └── semantic/
    │           ├── __init__.py
    │           ├── jprotocol.py/   [AnsonHeader, AnsonBody, AnsonMsg, AnsonReq, AnsonResp]
    │           └── jserv/
    │               ├── __init__.py
    │               └── echo.py     [EchoReq]
    └── src/
        └── synode/
            ├── __init__.py
            ├── __main__.py
            ├── installer.py
            └── ...
                    
See `Implementation Reference <https://grok.com/chat/8c910b33-2987-4a2d-925a-4d5e3446d68c>`_.