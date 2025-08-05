.. _setup-synode:

Install Portfolio-synode
========================

**This document is the 0.7.0 demo version. Some function in the UI is still in developing.**

Prerequisit
-----------

Portfolio-synode requires Python 3.9 and JDK 17.

For Linux, please also install *Exiftool*.

Follow the `document <https://exiftool.org/install.html#Unix>`_ or use *apt* to install::

    sudo apt install exiftool

And make sure "exiftool -ver" is running.

The services are acturally started by command::

    java -jar bin/jserv-album-0.7.0.jar
    java -jar bin/html-service-0.1.1.jar

Please make sure your JDK will not be auto-updated by Linux, 
see also :ref:`trouble by auto-update on Ubuntu <trouble-exiftool-by-auto-update>`

Setting up Synodes
------------------

#. Download `synode registry, registry.zip <https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/registry.zip>`_
   from `the project's releas page <https://github.com/odys-z/semantic-jserv/releases/tag/portfolio-synode-0.7.0>`_.

   Unzip the Synode registry.

   *Portfolio Synode 0.7.0 can only work as a stand alone service node. Registry is
   used in the future for synchronizing register.*

#. Download `jserv-album-0.7.1.zip <https://github.com/odys-z/semantic-jserv/releases/download/portfolio-synode-0.7.0/jserv-album-0.7.0.zip>`_
   or check lastest version at
   `the project's releas page <https://github.com/odys-z/semantic-jserv/releases/tag/portfolio-synode-0.7.0>`_.

#. Unzip into a floder, say, *protfolio-synode*

#. Setup Portfolio-synode's Python module

    in *portfolio-synode*, run:

    ::

        pip install bin/synode_py3-0.7-py3-non-any.whl

    To check if it's installed successfully, run:

    ::

        pip show synode.py3
    
#. Start Portfolio Data Service Nodes

    **Don't run this in VS Code Termnial in Linux. See**
    :ref:`the issue<trouble-vscode-linux>` & :ref:`troubleshootings<trouble-vscode-linux>`
    **if you have to, while it's recommended to run this in VS Code Bash terminal in Windows.**

    Portfolio runs on a network of Synode, the Data Synchronzation Service Nodes.

    A synchronization domain includes a hub synode, with a static IP visible to other synodes,
    and multiple synodes working in their private network. The hub synode is only necessary
    when setuping the network, while the others are (designed) to be able to share data between
    each others. 

    Run ::

        python3 -m src.synodepy3
    
    - Click the *...* folder button for opening registry dir.

      *User Id, password and Login function are not available in demo version. Leave the fields untouched.*
    
    - Setup local web page service port and data service port, e.g. 8900/8964. The local Ip is detected autmatically.

      Check reverse proxy only if the host is mapped from a public Internet address. 
    
    - Modify Jservs' URL

      If is setting a public address, say central hub node, leave *Sync-in* as 0 seconds.
      No need to care about jservs, but make sure the reverse proxy is set correctly, e.g. ::

        10.0.0.1   8900 / 8964

      If is setting a local service node, say your private storage device,
      set *Sync-in* to typically 30 seconds, while 0 will make the machine too busy.
      And setup the hub nodes IP to it's public address, using the data service
      port, e.g. ::

        X29: <tab>  http://10.0.0.1:8964/jserv-album

      **Do not change the line format**

    - Click *Save* if everything is OK.
 
    - Click *Test Run*. The data service (Synode) should be running now.

      Or run "java -jar bin/jserv-album-#.#.#.jar" in the folder.
     
    There should be a QR Code showing in the GUI. You can scan with a Portfolio
    client, e.g. the Portfolio Android, to connect to this service node.

    .. image:: ../imgs/00-portfolio-synode.png
        :width: 24em

#. Test Run

    * Check firewall configurations

        Protfolio-synode by default will listening on TCP port 8964, the data service,
        and port 8900, the web page server.

    * Open the webpage in a browser

        Open the home page for listing uploaded files, e.g.::

            url: http://127.0.0.1:8900

        There should be the files once are uploaded with Portfolio Android.

    .. image:: ../../../album/source/imgs/07-portfolio-web.png
        :width: 24em

#. Install Windows Services

    *Portfolio-Synode* must be installed as Windows serices if is running in Windows. Click the *install
    Windows Service* button to install. This process requires administrator permission, which will asks for
    4 times, 2 separate service for Web pages and data service, each requires a *install* and a *start*
    permissions.

    Please also be aware of the permission confirmation's dialogs can be hidden behind current Window.

Test in Browser
===============

Visit 

    http://127.0.0.1:8900/login.html

It will access a json data service at

    http://127.0.0.1:8964/jserv-album

if no default arguments were changed during installation.

**And this is the time to download and scan with the Android client for login**.
:ref:`It also needs some setup <setup_android>`.

Uninstall Portfolio-synode
==========================

* Uninstall Services for Windows:

In CMD Termnial, or VS Code Bash Termnial,

::

    # cd portfolio-synode 
    synode-uninstall-srv

This will uninstall the Windows services.

Then uninstall python packages:

::

    pip uninstall synode.py3
    pip uninstall anson.py3

Now it's safe to delete the *portfolio-synode* folder, where the zip file is unzipped.
The files saving location is specified by the *volume* path. You can delete the
folder if you don't need the uploaded files anymore.

Uninstall Windows Service Manually
----------------------------------

**This is not recommended**

If you have to uninstall the Windows service manually, please follow the steps below:

#. From the Startup Menu, open the Windows Service Control Panel to check the two service name,
   which should like::

    Synode.web-0.7.2-X29
    Synode-0.7.2-X29

#. Open CMD terminal as administrator, go to the install folder.
#. Run the command below to uninstall the service (replace version numbers and synode ID):

   .. code-block:: shell

      py -m src.synodepy3.cli uninstall-srvname Synode.web-#.#.#-ID 
      py -m src.synodepy3.cli uninstall-srvname Synode-#.#.#-ID 

#. Refresh the Windows Service Control Panel if needed.

**tip**

If the WEB-INF/settings.json file is not found, reinstall the Portfolio-synode
and change winsrv.synode and winsrv.web accordingly.

Sample::

    "envars": {
        "WEBROOT_201": "Y201",
        "winsrv.synode": "Synode-0.7.5-Y201",
        "winsrv.web": "Synode.web-0.4.1-Y201"
    },
