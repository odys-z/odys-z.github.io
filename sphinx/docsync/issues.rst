Issues
======

Injecting *jservs* at runtime
-----------------------------

When the application server is installed, it should know peer jservs
through dictionary.json, wich is version controlled in source.

The test uses a simple cheap way to setup this.

.. code-block:: java

    public static SynotierJettyApp main_(String vol_home,
        String[] args, PrintstreamProvider ... oe) {

        // @Option(name="-peer-jservs",
        // usage=only for test, e. g.
        // "X:http://127.0.0.1:8964/album-jserv Y:http://127.0.0.1/album-jserv")
        // public String CliArgs.jservs;
        CliArgs cli = new CliArgs();

        CmdLineParser parser = new CmdLineParser(cli);
        parser.parseArgument(args);

        if (!isblank(cli.installkey)) {
            YellowPages.load(FilenameUtils.concat(
                new File(".").getAbsolutePath(),
                webinf,
                EnvPath.replaceEnv(vol_home)));
            AppSettings.setupdb(cfg, webinf, vol_home, "config.xml", cli.installkey,
                    // inject jservs args to the peers' configuration
                    cli.jservs);
        }
    }
..

Where the *jservs* for peers are injected into SynodeConfig, and then updated into
table *syn_nodes*, planning future extension for providing *jservs* in a separate json. 

Only one syn-worker thread
--------------------------

Multiple synodes cannot work in one (test) running.

commit: 2079991c2cfda1a46ac532b94ebb836e41590377

See ExpSynodetier.syncIns().

Overhaul: sending exception to client
-------------------------------------

Re-design ServPort.err(MsgCode code, Exceptiion e);

How long will the syn-worker can work without clean buffered data
-----------------------------------------------------------------

The maximum distance between stamps in syn-change and synode's stamp is half of
Nyquence range, Long.MAX_VALUE, 2 ^ 63 -1 in Java. Each time the stamp will be
increased by 1 for a syn-workers looping. The longest buffering is the difference
of the earliest buffered change logs and the latest stamp.

If each interval is one second, a year has 3.15 * 10 ^ 7 seconds, the longest time
can be correctly buffered is approx. 300 billion years.

Enable CORS for Jetty 12
------------------------

::

    Dec 31, 2024

`Jetty EE10 deprecated CrossOriginFilter <https://javadoc.jetty.org/jetty-12/org/eclipse/jetty/ee10/servlets/CrossOriginFilter.html>`_,
but Jetty 12 together with EE8 is not likely will be supported in the near future::

    It is now possible to add handles after ee10 ServletContextHandler.

    However for ee8/9 it might be a bit more fiddly to insert a core handler in the right location

See `Jetty.project #10220 <https://github.com/jetty/jetty.project/issues/10220>`_.

And Semantic.jserv is built upon Servlet 3.1, and
`can only depends on EE8 <https://stackoverflow.com/a/66368511/7362888>`_.

:: 

    mvn dependency:tree

    [INFO] --- dependency:3.6.0:tree (default-cli) @ docsync.jserv ---
    [INFO] io.github.odys-z:docsync.jserv:jar:0.2.0
    [INFO] +- javax.servlet:javax.servlet-api:jar:3.1.0:compile
    [INFO] +- io.github.odys-z:semantic.DA:jar:1.5.8:compile
    [INFO] |  +- io.github.odys-z:semantics.transact:jar:1.5.53:compile
    [INFO] |  |  \- io.github.odys-z:antson:jar:0.9.104:compile
    [INFO] +- io.github.odys-z:anclient.java:jar:0.5.6:compile
    [INFO] |  \- io.github.odys-z:semantic.jserv:jar:1.5.6:compile
    [INFO] +- io.github.odys-z:synodict-jclient:jar:0.0.9:compile
    [INFO] +- org.eclipse.jetty:jetty-server:jar:12.0.10:test
    [INFO] |  +- org.eclipse.jetty:jetty-http:jar:12.0.10:test
    [INFO] |  |  \- org.eclipse.jetty:jetty-util:jar:12.0.10:test
    [INFO] |  +- org.eclipse.jetty:jetty-io:jar:12.0.10:test
    [INFO] +- org.eclipse.jetty.ee8:jetty-ee8-webapp:jar:12.0.11:test
    [INFO] |  +- org.eclipse.jetty:jetty-ee:jar:12.0.11:test
    [INFO] |  +- org.eclipse.jetty:jetty-xml:jar:12.0.11:test
    [INFO] |  \- org.eclipse.jetty.ee8:jetty-ee8-servlet:jar:12.0.11:test
    [INFO] |     +- org.eclipse.jetty.ee8:jetty-ee8-nested:jar:12.0.11:test
    [INFO] |     |  +- org.eclipse.jetty:jetty-security:jar:12.0.11:test
    [INFO] |     |  +- org.eclipse.jetty:jetty-session:jar:12.0.11:test
    [INFO] |     |  \- org.eclipse.jetty.toolchain:jetty-servlet-api:jar:4.0.6:test
    [INFO] |     \- org.eclipse.jetty.ee8:jetty-ee8-security:jar:12.0.11:test
    [INFO] \- io.github.odys-z:syndoc-lib:jar:0.5.7:test

FIY

    The jetty source project has tests of `CrosOriginHandler <https://github.com/jetty/jetty.project/blob/jetty-12.0.11/jetty-core/jetty-server/src/test/java/org/eclipse/jetty/server/handler/CrossOriginHandlerTest.java#L101>`_
    which can be the example. The start() method explains details.

    .. code-block:: java

        public void start(CrossOriginHandler crossOriginHandler) throws Exception
        {
            server = new Server();
            connector = new LocalConnector(server);
            server.addConnector(connector);
            ContextHandler context = new ContextHandler("/");
            server.setHandler(context);
            context.setHandler(crossOriginHandler);
            crossOriginHandler.setHandler(new ApplicationHandler());
            server.start();
        }

See `CrossOriginFilter <https://javadoc.jetty.org/jetty-12/org/eclipse/jetty/ee10/servlets/CrossOriginFilter.html>`_.
document.

Using CrossOriginFilter:

.. code-block:: java

    private SynotierJettyApp allowCors(ServletContextHandler context) {
      CrossOriginFilter.synode(syngleton().synode());

      FilterHolder holder = new FilterHolder(CrossOriginFilter.class);
      holder.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*");
      holder.setInitParameter(CrossOriginFilter.ACCESS_CONTROL_ALLOW_ORIGIN_HEADER, "*");
      holder.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,POST,HEAD");
      holder.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "X-Requested-With,Content-Type,Accept,Origin");
      holder.setName("cross-origin");
      FilterMapping fm = new FilterMapping();
      fm.setFilterName("cross-origin");
      fm.setPathSpec("*");
      
      context.addFilter(holder, "/*", EnumSet.of(DispatcherType.REQUEST));
      
      return this;
    }
..

TIP
    
For error::

    Status Code: 405 Method Not Allowed

The possible reason is that the incorrect request URL is handled by the default handler,
by which the POST method is not allowed by the server.

References:

#. `Jetty test: CrossOriginHandlerTest <https://github.com/jetty/jetty.project/blob/jetty-12.0.11/jetty-core/jetty-server/src/test/java/org/eclipse/jetty/server/handler/CrossOriginHandlerTest.java#L101>`_
   (Jan 1, 2025)

#. `Cross Origin Filter with embedded Jetty <https://stackoverflow.com/questions/28190198/cross-origin-filter-with-embedded-jetty>`_

