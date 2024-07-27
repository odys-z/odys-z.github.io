Extending default semantics plugin
----------------------------------

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