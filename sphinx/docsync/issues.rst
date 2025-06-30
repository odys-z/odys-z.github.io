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

**Update 2025-06-27**

comments on da2330dae3e085860d637b0e6c077e3cf6992667::

    2. Winsrv cannot update local Ip if changed Wifi settings
    (reboot works, but won't work if booting while wifi is disabled) 

This issue should be considered as a requirements to registration infrastructure.

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

Using CrossOriginFilter, with
`source <https://github.com/odys-z/semantic-jserv/blob/one-step/jserv-album/src/main/java/io/oz/syntier/serv/CrossOriginFilter.java>`_:

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

The possible reason is that the incorrect request URL is handled by the default
Jetty handler, by which the POST method is not allowed by the server.

References:

#. `Jetty test: CrossOriginHandlerTest <https://github.com/jetty/jetty.project/blob/jetty-12.0.11/jetty-core/jetty-server/src/test/java/org/eclipse/jetty/server/handler/CrossOriginHandlerTest.java#L101>`_
   (Jan 1, 2025)

#. `Cross Origin Filter with embedded Jetty <https://stackoverflow.com/questions/28190198/cross-origin-filter-with-embedded-jetty>`_

Android PreferenceEdit Saves Violate OOP Encapsulation Principle
----------------------------------------------------------------

::

    CompileSDK 34
    TargetSDK 34
    Virtual Device: Pixel 2 API 26
    Tue 07 Jan 2025

When modified PreferenceEdit, the changes are saved to the xml storage after user's
confirmation. To discard the dirty changes next time, the initial value must be reloaded,
which is already lost.

.. image:: imgs/00-android-prefs-edit.png
   :height: 5em

.. image:: imgs/00-android-prefs-saving.jpg
   :height: 5em

Current solution: use an Anson object to by pass the behavior and only save as needed.

Different FileSystem Providers of JDK 1.8, Windows & Android
------------------------------------------------------------

::

    Jan 05, 2025
    Semantic.DA 1.5.13

Loading text file for jar requires a zip file system provider. This is implemented differently
in JDK 1.8 (Semantic.DA dependency) and Android environment. 

At least API 26, the Zip file system provider is
`not available on Android <https://issuetracker.google.com/issues/153773248?pli=1>`_.

::

    Response from the engineering team:
    =================================

    The missing implementation is com.sun.nio.zipfs.ZipFileSystemProvider, which
    is not available on Android. We recommend using ZipInputStream, which is not
    a replacement but can be used to achieve similar functionality.

Current fixing for loading files from jar package:

TODO Add Tests 2025-01-25 (Antson 0.9.113)::

    1. In deployed server side (Windows), separatlly load zip file within another branch.
    2. In Android, avoid loading zip file.

References

#. Answer by Google AI of search results of "java proper path string format for jdk.zipfs.ZipFileSystem"

    .. code-block:: java

        import java.io.IOException;
        import java.io.InputStream;
        import java.nio.file.*;
        import java.util.HashMap;
        import java.util.Map;

        public class ZipFileExample {

            public static void main(String[] args) throws IOException {
                String zipFilePath = "/path/to/your/zipfile.zip";
                String entryPath = "path/to/file/inside/zip.txt";

                try (FileSystem zipfs = FileSystems.newFileSystem(Paths.get(zipFilePath), null)) {
                    Path pathInZip = zipfs.getPath(entryPath);

                    try (InputStream is = Files.newInputStream(pathInZip)) {
                        // Process the InputStream
                        // ...
                    }
                }
            }
        }

#. Java Documentation, `Zip File System Provider <https://docs.oracle.com/javase/8/docs/technotes/guides/io/fsp/zipfilesystemprovider.html>`_,
Java SE 8 Documentation, Oracle.

#. by Qusay H. Mahmoud, `Compressing and Decompressing Data Using Java APIs <https://web.archive.org/web/20110427091148/http://java.sun.com/developer/technicalArticles/Programming/compression/>`_,
with contributions from Konstantin Kladko, February 2002,
SDN Home / Java Technology / Reference / Technical Articles and Tips
retrieved on 2025-01-25.

TODO To be edit (replace with loadTxt()):

.. code-block:: java

    protected static String loadSqlite(Class<?> clzz, String filename) {
        try {
            // https://stackoverflow.com/a/46468788/7362888
            // URI uri = Paths.get(clzz.getResource(filename).toURI()).toUri();
            URI uri = clzz.getResource(filename).toURI();
            if (
                !eq(uri.getScheme(), "file") &&
                zipfs == null)
                try {
                    Map<String, String> env = new HashMap<>(); 
                    env.put("create", "true");
                    zipfs = FileSystems.newFileSystem(uri, env);
                }
                catch (Exception e) {
                    Utils.warnT(new Object() {},
                        "File %s shouldn't be load in the runtime environment.\ntarget URI: %s",
                        filename, uri);
                    e.printStackTrace();
                    return null;
                }

            uri = Paths.get(uri).toUri();

            return Files.readAllLines(
                Paths.get(uri), Charset.defaultCharset())
                .stream().collect(Collectors.joining("\n"));
        } catch (Exception e) {
            Utils.warnT(new Object() {},
                "File %s can't be loaded in the runtime environment.\n%s",
                filename, e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

Shoud forcing Radix-32 for syn-uids
-----------------------------------

To be verified:

Auto-key will generate Radix 64 number in Linux automatically for syn-uids,
which shouldn't be confused across different platforms. 