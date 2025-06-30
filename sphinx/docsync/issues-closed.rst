Closed Issues
=============

[closed]Enable CORS for Jetty 12
--------------------------------

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


[closed] To be verified: Different configurations of Ext-filev2
---------------------------------------------------------------

VERIFIED: 2024-12-31

$VOLUME_HUB

.. code-block:: xml

    <s>
        <id>pho.extfile</id>
        <smtc>ef2.0</smtc>
        <tabl>h_photos</tabl>
        <pk>pid</pk>
        <args>$VOLUME_HUB,uri,family,shareby,folder,docname</args>
    </s>


$VOLUME_PRV

.. code-block:: xml

    <s>
        <id>pho.extfile</id>
        <smtc>ef2.0</smtc>
        <tabl>h_photos</tabl>
        <pk>pid</pk>
        <args>$VOLUME_PRV,uri,shareby,folder,docname</args>
    </s>

Different saving paths should still working.

[closed] Jetty NoSuchMethodError: ByteBufferPool.removeAndRelease
-----------------------------------------------------------------

::

    java.lang.NoSuchMethodError: 'boolean org.eclipse.jetty.io.ByteBufferPool.removeAndRelease(org.eclipse.jetty.io.RetainableByteBuffer)'
	at org.eclipse.jetty.ee8.nested.HttpOutput.lockedReleaseBuffer(HttpOutput.java:593)
	at org.eclipse.jetty.ee8.nested.HttpOutput.onWriteComplete(HttpOutput.java:302)
	at org.eclipse.jetty.ee8.nested.HttpOutput.flush(HttpOutput.java:657)
	at io.odysz.anson.Anson.toEnvelope(Anson.java:132)

.. image:: imgs/x-00-jetty-no-such-method.png
    :height: 12em

Jetty HttpOutput class:

.. code-block:: java

    private void lockedReleaseBuffer(boolean failure) {
        assert _channelState.isLockHeldByCurrentThread();
        if (_aggregate != null) {
            if (failure && _pool != null)
                _pool.removeAndRelease(_aggregate);
            else
                _aggregate.release();
            _aggregate = null;
            _pool = null;
        }
    }

Where this._pool is an instance of 

    `org.eclipse.jetty.io.ArrayByteBufferPool <https://javadoc.jetty.org/jetty-12/org/eclipse/jetty/io/ArrayByteBufferPool.html>`_

For `Jetty Server 12.0.16 <https://mvnrepository.com/artifact/org.eclipse.jetty/jetty-server/12.0.16>`_,
ArrayByteBufferPool comes with the method removeAndRelease(...).

Solved with (not verified - break ponts not reached any more)::

    org.eclipse.jetty: jetty-server: jetty-ee8-webapp: 12.0.16 (Dec 11, 2024)
    org.eclipse.jetty: jetty-server: jetty-server    : 12.0.16 (Dec 11, 2024)

[closed] Album.jserv Denpendencies
----------------------------------

Thu Dec 12 12:41:54 2024 +0800

Refactor: move DocsException to semantic.jserv, in the package io...tier.docs, shared by anclient and docsync.

::

        --> albumtier
        ^    |     |
        .    |     +-- anclient.java
        .    |     |    +--[Doclientier,  ...]
        .    |     |    +--[SessionClient ...]
        .    |     |    +--------------------------+
       test  |     |                               |
        ^    +-------- syndoclib (jserv-album-lib) |
        .    |     |    | (protocol: AlbumReq)     |
        .    |     |    +--------------------------+-- semantic.jserv
       jserv-alubm |                                     +-- [DocsException, ExpSyncDoc, ...]
          |        |
          |        |
          +----- docysync (SynssionPeer ...)

[closed] Design Synssion and SyncUser:
--------------------------------------

commit f7c7c8d6bbd3f383d5d4d295059dfabeeb9f861e

Date:   Tue Oct 29 19:41:16 2024 -0400

::

    √ 0. Docsync 0.2.0: config.xml/class-IUser for IUser object used at serverside,
        SynodeConfig by syntity.json's user id is used for Synssion client side, which
        is injected into sysconn while install;
        A SyncUser, admin, is used for domain wide in 0.2.0.
    √ 1. SynDomanager extends SyndomContext, and SyndomContext.load() is called by Syngleton
    √ 2. SynDomanager.loadomx() -> call SyndomContext.loadStampNv(), from which also initializing local robot.
    √ 3. ExpDoctier uses DocUser to represent session's IUser object
    √ 4. SynodeTier also uses a DocUser for initiate a synssion, which is not the same to the
        syn-context's local user, and will trigger unlockx() when logging out.
    √ 5. SyndomContext is responsible for synlock managing.
    √ 6. Simplify Syngleton.syndomanagers
