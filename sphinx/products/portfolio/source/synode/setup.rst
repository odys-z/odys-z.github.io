.. _setup-synode:

Install Portfolio-synode
========================

.. note:: This document is the 0.7.0 demo version. Some function in the UI is still in developing.
..

**Prerequisit** Portfolio-synode requires Python 3.9 and JDK 17.

Install Steps
-------------

#. Download `synode registry, registry.zip <https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/registry.zip>`_
   from `the project's releas page <https://github.com/odys-z/semantic-jserv/releases/tag/portfolio-synode-0.7.0>`_.

   Unzip the Synode registry.

   *Portfolio Synode 0.7.0 can only work as a stand alone service node. Registry is
   used in the future for synchronizing register.*

#. Download `jserv-album-0.7.0.zip <https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/jserv-album-0.7.0.zip>`_
   or check lastest version at
   `the project's releas page <https://github.com/odys-z/semantic-jserv/releases/tag/portfolio-synode-0.7.0>`_.

#. Unzip in a floder, say, *protfolio-synode*

#. Setup Portfolio-synode' Python module

    in *portfolio-synode*, run:

    ::

        pip install portfolio_synode-#.#.#-py3-non-any.whl

    To check if it's installed successfully, run:

    ::

        pip show portfolio-synode
    
#. Start Portfolio-synode

    **Don't run this in VS Code Termnial in Linux. See**
    :ref:`the issue<trouble-vscode-linux>` & :ref:`troubleshootings<trouble-vscode-linux>`
    **if you have to, while it's recommended to run this in VS Code in Windows.**

    Run ::

        python3 -m portfolio-synode

    - Click the top button for opening registry dir.

      *User Id, password and Login function are not available in demo version.*

    - Click *Setup* if everything is OK.
 
    - Click *Start*. The data service should be running now.

      Or run "java -jar bin/jserv-album-#.#.#.jar" in the folder.
     
    There should be a QR Code showing in the GUI. You can scan with a Portfolio
    client, e.g. the Portfolio Android, to connect to this service node.

    .. image:: ../imgs/00-portfolio-synode.png
        :width: 300px

#. Check firewall configurations

    Protfolio-synode by default will listening on TCP port 8964, the data service,
    and port 8900, the web page server.

#. Open the webpage in a browser

    Open the home page for listing uploaded files, e.g.::

        url: http://127.0.0.1:8900

    There should be the files once are uploaded with Portfolio Android.

    .. image:: ../../../album/source/imgs/07-portfolio-web.png
        :width: 300px
