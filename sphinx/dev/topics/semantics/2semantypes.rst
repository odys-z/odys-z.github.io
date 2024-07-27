DA Semantics Handlers
=====================

Configure Semantics Handlers
----------------------------

Handlers can be configured in xml file of which the path is defined in config.xml.

connects.xml

.. code-block:: xml

  	<c>
  		<id>local-sqlite</id>
  		<type>sqlite</type>
  		<isdef>true</isdef>
  		<!-- For sqlite, src = relative path from this configure file.
  			So connection string can be: jdbc:sqlite:WEB-INF/remote.db -->
  		<src>semantic-DA.db</src>
  		<usr>test</usr>
  		<pswd>test</pswd>
  		<!-- enable sql printing -->
  		<dbg>true</dbg>
  		<smtcs>semantics.xml</smtcs>
  	</c>
..

semantics.xml

.. code-block:: xml

    <semantics>
        <t id="semantics" pk="id" columns="id,smtc,tabl,pk,args">
        <!-- smtc: semantics type, e.g. auto: auto increase key.
                see javadoc: https://odys-z.github.io/javadoc/semantic.DA/io/odysz/semantic/DASemantics.smtype.html
            tabl: database table name
            pk:
            args: arguments for sementics handlers. For args for different handlers, see above javadoc link.
        -->
            <s>
                <id>01</id>
                <smtc>pk</smtc>
                <tabl>a_functions</tabl>
                <pk>funcId</pk>
                <args>funcId</args>
            </s>
            <s>
                <id>02</id>
                <smtc>fullpath</smtc>
                <tabl>a_functions</tabl>
                <pk>funcId</pk>
                <args>parentId,sibling,fullpath</args>
            </s>
        </t>
    </semantics>
..

Auto Key
--------

  The manage a table for generating varchar type key for entities' primitive key.
  See

    smtype: `autoInc <https://odys-z.github.io/javadoc/semantic.DA/io/odysz/semantic/DASemantics.smtype.html#autoInc>`_ 

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

External File Field
-------------------

  smtype: `extfilev2 <https://odys-z.github.io/javadoc/semantic.DA/io/odysz/semantic/DASemantics.smtype.html>`_

  Save a special field as file from file system.
  
  This handler can manage subfolder in path, configered in xml as field name of data table.
  The file content providen with *uri* should be a Base 64 encoded block.

  This semantics only used for handling small files. If the file is large, there are an
  example in Semantic.jserv which uses a block sequence for uploading files.

  semantics.xml

  .. code-block:: xml

    <semantics>
        <t id="semantics" pk="id" columns="id,smtc,tabl,pk,args">
            <s>
                <id>53</id>
                <smtc>ef</smtc>
                <tabl>a_attaches</tabl>
                <pk>attId</pk>
                <!-- Try delete, save to ./uploads/[busiTbl]/[uri],
                    in table attches, pk attId.
                 -->
                <args>uploads,uri,busiTbl,busiId,attName</args>
            </s>
        </t>
    </semantics>
  ..

  To load the file, use function *exfFile()* provided in Semantic.transact.

  .. code-block:: java

    // read the field
    assertEquals(String.format("uploads/zsu.ua/ody/2022-10/%s Sun Yet-sen.jpg", pid),
                 DAHelper.getValstr(st, connId, phm, phm.uri, phm.pk, pid));

    // read the file
    assertEquals(content64, DAHelper.getExprstr(st, connId, phm,
          Funcall.extfile(phm.uri), phm.uri,
          phm.pk, pid));
  ..
