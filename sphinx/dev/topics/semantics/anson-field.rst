Implementing NoSql with Anson
=============================

This is a way of persisting unstructured data with a relational database.
For general idea of NoSql & pros and cons, see :ref:`[1]<ref-ibm-nosql>`.

- Save

To persist a structured object in to database, e.g. to insert / update a db field,
text type for sqlite, simply set an instance of sub-class of AnDbField with nv().

.. code-block:: java

    T_PhotoCSS anson = new T_PhotoCSS(w, h);

    st.insert("a_funcs")
        .nv("funcId", "a01")
        .nv("funcName", anson)
        .nv("uri", ExprPart.constStr(null))
        .commit(sqls);

    // The object anson is serialized to a string value.
    assertEquals(
    "insert into a_funcs  (funcId, funcName, uri) values ('a01', '{\"type\": \"io.odysz.transact.sql.parts.T_PhotoCSS\", \"size\": [4, 3]}\n', null)",
    sqls.get(0));
..

See semantic-transact test case,
`AnsonFieldTest <https://github.com/odys-z/semantic-transact/blob/master/semantic.transact/src/test/java/io/odysz/transact/sql/parts/AnsonFieldTest.java>`_.

- Load

To load an instance of Anson from db text at server side (java), use AnResultSet#<T>getAnson().
This function will deserialize the instance.

.. code-block:: java

    AnResultset rs = ((AnResultset) st.select("b_alarms")
            .col("remarks")
            .whereEq("typeId", "02-photo")
            .rs(s0)          // commit query
            .rs(0))          // results[0]
            .nxt();          // row 1

    T_PhotoCSS anson = rs.<T_PhotoCSS>getAnson("remarks");
    assertEquals(16, anson.w());
    assertEquals( 9, anson.h());
..

See Semantic-DA test case, method
`‎DASemantextTest::testAnsonField <https://github.com/odys-z/semantic-DA/blob/327e040707f1037caa6ad9f9116ce6c443513bfe/semantic.DA/src/test/java/io/odysz/semantic/DASemantextTest.java#L730>`_.

To convert a JSON string to object at client in typescript with tslint support,
use Protocol.registerFactory().

.. code-block:: typescript

    class Profiles extends AnsonBody {
        home: string;
        maxUsers: number;
        servtype: number;

        constructor (obj: { servtype: number; maxUsers: number; home: string }) {
            super( { type: 'io.oz.album.tier.Profiles' } );
            this.home = obj.home;
            this.maxUsers = obj.maxUsers;
            this.servtype = obj.servtype;
        }
    }

    Protocol.registerBody('io.oz.album.tier.Profiles', (jsonBd) => { return new Profiles(jsonBd); });
..

See Anclient test case, `admin-tier.ts <https://github.com/odys-z/Anclient/blob/master/examples/example.js/album/src/admin-tier.ts>`_
class *Profiles*.

Reference
---------

.. _ref-ibm-nosql:

[1] IBM, `What is a NoSQL database? <https://www.ibm.com/topics/nosql-databases#:~:text=NoSQL%2C%20also%20referred%20to%20as,structures%20found%20in%20relational%20databases.>`_,
Retrieved on Aug 2, 2023.
