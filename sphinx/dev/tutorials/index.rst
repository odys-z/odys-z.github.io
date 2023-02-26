Semantic-* Tutorials
====================

About Semantic-*
----------------

The semantic-* is a cross platform enterprise B/S application framework. It
includes 3 major modules working together to be used as a web application of
which the server runs on servlet 3.1.

There are (planned) multiple clients. For main dev stream quick start, it's
better starting from the typescript ReactJS client, see anclient/js/EasyUI quick
start.

Semantic-* includes:

- The semantic-transact

A structured API for building SQL.

- The semantic-DA,

A JDBC based datasource access layer, manages JDBC database connections and handles typical semantic data processing patterns.

- The semantic-jserv
  
A servlet server framework for implementing web applications.

It provides a protocol layer using json as data package as well as parsers based
on `Antlr4 <https://www.antlr.org/>`_ which is wrapped by `Antson <https://github.com/odys-z/antson>`_,
for handling (de)serialize structured data of java and c# (and c++ Python in the
future) to / from json.

Semantic-* also including some extensions such as a cheap workflow engine (deprecated
& would be refactored in the future), or a file automatic synchronizing infrastructure
of which files are not only handled in the ways of creating & transfer, but also
linked back into relational database for business usages.

In addition to the library and extensions, there is also a maven sample project,
*jserv-sample*, showing how to use semantic-* that is embedded into it as a native
module.

It's recommended clone and use this project as a web server project template which
should be a good starting point.

Tutorials
---------

- Semantic-* sample projects

`jsample server (test project, managed session) <https://github.com/odys-z/semantic-jserv/tree/master/jserv-sample>`_
& `jsample AnClient(?) <https://github.com/odys-z/Anclient/tree/master/js/test/tsample>`_

- TS client (front end) samples

`sandbox server (sessionless) <https://github.com/odys-z/semantic-jserv/tree/master/jserv-sandbox>`_
& `Typescript + React.js front end <https://github.com/odys-z/Anclient/tree/master/js/test/sessionless>`_
    
- Spreadsheet (Ag-grid) front end example

`AnSpreadsheet(ag-grid wrapper) <https://github.com/odys-z/semantic-jserv/tree/master/jserv-sandbox>`_
& `Spreadsheet Tier (Semantier subclass) <a href="https://github.com/odys-z/Anclient/blob/master/examples/example.js/curriculum/views/north/kypci/tier.tsx>`_
