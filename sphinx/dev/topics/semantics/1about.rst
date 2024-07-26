What's DASemantics for?
=======================

The word semantics is a computer science term. The author doesn't want to redefine
this term, but here are some explanations for what semantic-DA with semantic-transact
is trying to support.

In a typical relational database based application, the main operation of data is
CRUD. And most often such data operations can be abstracted to some operation
pattern, and they are always organized as a database transaction/batch operation
described in SQL.

Take the "book-author" relation for example, the author's ID is also the parent
referenced by book's author FK. If trying to delete an author in DB, there are 2
typical policies that can be applied by the application. The first is delete all
books by the author accordingly; the second is warning and denying the operation
if some books are referencing the author. Both of these must/can be organized
into a transact/batch operation, with the second transact as check-then-delete.

In this case, the FK relationship can be handled in a generalized operation,
through parameterizing some variables like table name, child referencing column
name and parent ID.

Take the DASemantics.smtype.parentChildrenOnDel for example, it automatically
supports "deleting all children when deleting parent" semantics. What the user
(application developer) needs to do is configure a semantics item then delete the
parent directly.

Now we understand what the "parentChildrenOnDel" is for. Semantic-DA abstract and
hide these patterns, automatically be wrapped then be committed in a transaction.
That's how semantics-DA facilitate development and tablize applications.

`Semantic.DA <https://github.com/odys-z/semantic-DA>`_ has a few semantics
handler for automatically handling data structure while operating CRUD.

See `Semantics handlers' API documents <https://odys-z.github.io/javadoc/semantic.DA/io/odysz/semantic/DASemantics.smtype.html>`_ .

