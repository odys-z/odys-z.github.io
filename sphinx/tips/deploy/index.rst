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

Compile Python
==============

Install Python 3.9 on Centos 7
------------------------------

Backgroud:

`Centos 7 need python2.7 as default and won't support newer python3 <https://forums.centos.org/viewtopic.php?t=72223>`_.

- Centos packages

::

    Python 2.7
    gcc 4.8.5
    openssl 1.0.2

All this packages are obstacles to install newer version of Python, including
`reasonable drop of openssl1.0.2 <https://github.com/urllib3/urllib3/issues/2168>`_.

List options for python configuration::

    ./configure --help

`Install gcc on Centos <https://superuser.com/a/1758987>`_, latest
`install is v8 <https://www.softwarecollections.org/en/scls/rhscl/devtoolset-8/>`_.
Also note that reload after relogin::
    yum install centos-release-scl
    sudo yum-config-manager --enable rhel-server-rhscl-7-rpms
    sudo yum install devtoolset-8
    scl enable devtoolset-8 bash

Enable sqlite for Pyhthon3::

    ./configure --enable-loadable-sqlite-extensions

::

    ./configure ...
    make
    make altinstall

Addtional Information

`Install development tools on Centos 7 <https://stackoverflow.com/a/70840635/7362888>`_.

This error can be a good sign or using gcc 4.8.5 on Centos 7::

    gcc -pthread -c -Wno-unused-result -Wsign-compare -DNDEBUG -g -fwrapv -O3 -Wall    -std=c99 -Wextra -Wno-unused-result -Wno-unused-parameter -Wno-missing-field-initializers -Werror=implicit-function-declaration -fvisibility=hidden -fprofile-use -fprofile-correction -I./Include/internal  -I. -I./Include    -DPy_BUILD_CORE -o Objects/bytes_methods.o Objects/bytes_methods.c
    Objects/bytes_methods.c: In function ‘find_internal’:
    Objects/bytes_methods.c:524:31: warning: ‘subobj’ may be used uninitialized in this function [-Wmaybe-uninitialized]
             if (PyObject_GetBuffer(subobj, &subbuf, PyBUF_SIMPLE) != 0)
                                   ^
    Objects/bytes_methods.c: In function ‘_Py_bytes_find’:
    Objects/bytes_methods.c:524:31: warning: ‘subobj’ may be used uninitialized in this function [-Wmaybe-uninitialized]
    Objects/bytes_methods.c:511:15: note: ‘subobj’ was declared here
         PyObject *subobj;
                   ^
    Objects/bytes_methods.c: In function ‘_Py_bytes_rfind’:
    Objects/bytes_methods.c:524:31: warning: ‘subobj’ may be used uninitialized in this function [-Wmaybe-uninitialized]
             if (PyObject_GetBuffer(subobj, &subbuf, PyBUF_SIMPLE) != 0)
                                   ^
    Objects/bytes_methods.c:511:15: note: ‘subobj’ was declared here
         PyObject *subobj;
                   ^

..

Openssl depending error::

    ImportError: urllib3 v2.0 only supports OpenSSL 1.1.1+, currently the 'ssl'
    module is compiled with 'OpenSSL 1.0.2k-fips  26 Jan 2017'. See:
    https://github.com/urllib3/urllib3/issues/2168


A brutal way to make sure included h file is v 1.1.1::

    cat /usr/local/include/openssl/* | grep OPENSSL_VERSION_TEXT

Result should be exactly equals to::

    openssl version

To check where is OpenSSL dir,

::

    openssl version -d

If not the required version, install one like `this <https://gist.github.com/Bill-tran/5e2ab062a9028bf693c934146249e68c>`_.

Configure Python3.9 to make sure the make process won't report error like::

    Could not build the ssl module!
    Python requires an OpenSSL 1.0.2 or 1.1 compatible libssl with X509_VERIFY_PARAM_set1_host().
    LibreSSL 2.6.4 and earlier do not provide the necessary APIs, https://github.com/libressl-portable/portable/issues/381

To check version of ssl Pyhthon3 is using::

    $ python3.9
    >>> import ssl
    >>> ssl.OPENSSL_VERSION
    'OpenSSL 1.0.2k-fips  26 Jan 2017'

To install openssl higer version and compile with python3.9, download source, say
openssl-1.1.1v.tar.gz, copy to say /usr/local/open-1.1.1v, and run make.

In Python3.9, configure like::

    ./configure --enable-loadable-sqlite-extensions --enable-optimizations \
    --with-openssl=/usr/local/openssl-1.1.1v --with-ssl-default-suites=openssl \
    CFLAGS="-I/usr/local/openssl-1.1.1v/include" LDFLAGS="-L/usr/local/openssl-1.1.1v"
    exoprt LD_LIBRARY_PATH=/usr/local/openssl-1.1.1v:$LD_LIBRARY_PATH
    make
    make altinstall

Reference: `The answer by Ham <https://stackoverflow.com/a/61093456/7362888>`_
