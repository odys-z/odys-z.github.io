Nginx & Https
=============

Let's encrypt certificate expired
---------------------------------

- Add PPA, install Certbot

::
    sudo apt-get update
    sudo apt-get install software-properties-common
    sudo add-apt-repository universe
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install certbot python-certbot-nginx
..

- update cert

::
    sudo certbot --nginx

Deploy to Maven Central
-----------------------

Follow this tutorial.

Tips:

Maven GPG plugin can fail without these steps finished.

- intall GPG and generate a certificate::

   gpg --gen-key

- publish public key

::

   pgp --send-keys <key-id>

To find out key Ids::

    gpg --fingerprint

- Setup repository's login in maven settings.xml,

.. code-block:: xml

    <settings>
    <servers>
        <server>
            <id>ossrh</id>
            <username>usr-id</username>
            <password>...</password>
        </server>
    </servers>
    </settings>
..

For gpg 2.1.1, maven plugin needs an additional parameter for using local cert.

This is `a nice explanation <https://myshittycode.com/2017/08/07/maven-gpg-plugin-prevent-signing-prompt-or-gpg-signing-failed-no-such-file-or-directory-error/>`_.

.. code-block:: xml

    <configuration>
        <gpgArguments>
                <arg>--pinentry-mode</arg>
                <arg>loopback</arg>
        </gpgArguments>
    </configuration>


To verify gpg config::

    mvn verify

See `manve document: Usage - Sign artifacts with GnuPG <https://maven.apache.org/plugins/maven-gpg-plugin/usage.html>`_.
