About
=====

Portfolio is a system for manage, synchronizing personal documents, including an
Android client App and multiple deployed server nodes.

Protfolio is currently a demo version. Users must take care of their files
uploaded to the server, usually a personal computer.

The Topology
------------

Typically, there should be a central hub node, which is a public server
accessible from the Internet, and multiple service nodes, which are private servers
running in local networks. The hub node is used for synchronizing data between service nodes,
and the service nodes are used for storing data uploaded by clients. The hub node
is usually available with ristricated storage space. 

There are also mobile clients, such as the Portfolio Android App, which can
connect to any service nodes and upload files. Files is autmatically synchronized in background.

With a backbone of relational database synchronization mechanism, Portfolio
can running in an unrealiable network environment. 

In 0.7.#, the demo version, there is only one synchronization domain, 'zsu', available,
and only 2 Synodes, X29 as the hub node and Y201 as the local node can be setup.

About Volume
------------

A volume is a folder within the server's file system, which is specified by the user
while setting up the service node. uploaded files and data are saved here.

.. warning::

    Don't change data in the volume folder. Moving, modification of files
    will cause unspecified results.

Also, do not switch volume to another location although in v 0.7.0 the service can
still run. 

Download
========

You can agree license and download the software at
`here <https://odys-z.github.io/landings/portfolio-0.7/>`_.

.. _about-volume:

