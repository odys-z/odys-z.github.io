What's DASemantics for?
=======================

Well, the word semantics is a computer science term. The author doesn't want to
redefine this word, but here is some explanation of what semantic-DA with
semantic-transact is trying to support.

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

DA Semantics Handlers
=====================

About automatic semantics handling
----------------------------------

`Semantic.DA <https://github.com/odys-z/semantic-DA>`_ has a few semantics
handler for automatically handling data structure while operating CRUD.

See `Semantics handlers' API documents <https://odys-z.github.io/javadoc/semantic.DA/io/odysz/semantic/DASemantics.smtype.html>`_ .

* Auto Key Format

  The manage a table for generating varchar type key for entities' primitive key.
  See ::

    smtype.autoInc

  The generataed key is a Radix 64 integer encoded with Base 64 charactors, and can
  be used for name of files and folders, so must be careful when configure for Windows,
  on which the file path is case insensitive.

  Semantic.DA accepts configurations form the xml file::

    config.xml,

  which is usually located in web applications' root folder, e. g. WEB-INF for servlet.
  To generate auto-key for Windows, configure the *file-sys* like 

  .. code-block:: xml

    <configs>
      <t id="default" pk="k" columns="k,v">
        <c>
            <k>file-sys</k>
            <v>windows</v>
        </c>
      </t>
    </config>
  ..
  
  The Id generator, DASemantext#genIdPrefix(), will generate string of radix 32 integer.

Extending default handler plugin
--------------------------------

Semantic.DA implements a default handler, DASemantics, which can be replaced by
subclasses of it. 2.0.0 has provided another plugin, and the docsync.jserv
Syntier.start() can be a good example for extending DASEmantics. 

First load the semantics configured in the xml file from which the new semantics
cannot be explained by the default static loader, then create a new transaction 
builder depending on it, i. e. DBSyntableBuilder.  

.. code-block:: java

    SemanticsMap ss = DATranscxt.initConfigs(conn, DATranscxt.loadSemantics(conn),
        (c) -> new DBSyntableBuilder.SynmanticsMap(synode, c));
		
    doctrb =  new DBSyntableBuilder(domain, myconn, synode, mod);
..

The extending type, SynmanticsMap, will have initConfigs() depending on new parser
providen by DBSyntableBuilder.

.. code-block:: java

    public class DBSyntableBuilder extends DATranscxt {
        public static class SynmanticsMap extends SemanticsMap {
            String synode;
        
            public SynmanticsMap(String synode, String conn) {
                super(conn);
                this.synode = synode;
            }
        
            @Override
            public DASemantics createSemantics(Transcxt trb, String tabl, String pk, boolean debug) {
                return new DBSynmantics(trb, synode, tabl, pk, debug);
            }
        }
    }

    public class DBSynmantics extends DASemantics {

        @Override
        public SemanticHandler parseHandler(Transcxt tsx, String tabl, smtype smtp,
                String pk, String[] args) throws SemanticException {
            if (smtype.synChange == smtp)
                try {
                    return new DBSynmantics.ShSynChange(tsx, synode, tabl, pk, args);
                } catch (TransException | SQLException | SAXException | IOException e) {
                    e.printStackTrace();
                    return null;
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }
            else
                return super.parseHandler(tsx, tabl, smtp, pk, args);
        }
    }
..