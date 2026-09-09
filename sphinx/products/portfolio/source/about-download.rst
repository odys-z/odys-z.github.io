Download Portfolio
==================

Check `Portfolio 0.8 downlaod page <https://odys-z.github.io/landings/portfolio-0.8/>`_.

About
=====

Portfolio is a system for managing, synchronizing personal documents, including
multiple deployed storage nodes and clients.

If you think keeping, saving and managing and sorting your documents on your own
computer is essential, then Portfolio is the solution for you!

Portfolio is currently a demo version. Users must take care of their files
uploaded to the server, usually a personal computer.

The Topology
------------

The v 0.8.# Demo version can only support a fixed structure, to synchronize files in the user's domain.

::

        -------------------
        |    domain-hub    |
        |    ^       ^     |
        |    |       |     |
        | node-1    node-1 |
        -------------------
            ^         ^
            |         |
        mobile-1   device-2 ...

..

 - domain-hub: The server can be accessed via public IP

 - node 1 & 2: The private file storage, typically a personal computer. 

This structure is based on an Edge Computing backbone, and the developer(s) is planning to
extend this to peer-peer nodes without any network topology restriction.  

.. _about-volume:

About Volume
------------

A volume is a folder within the server's file system, which is specified by the user
while setting up the service node. uploaded files and data are saved here.

.. warning::

    Don't change data in the volume folder. Moving, modification of files
    will cause unspecified results.

Also, do not switch volume to another location although in v 0.7.0 the service can
still run. 

Call for Testers
================

The Portfolio 0.8 Demo's Android client is under Google Play's *Closed Testing* phase.
Had you would like to vote Portolio 0.8 pass the tester's verification, please mail to the
author at `odys.zhou@gmail.com <mailto:odys.zhou@gmail.com>`_, and an opt-in link will
follow up. Thank you for your thumb up! 

All the latest resources can be download at Semantic-jserv, the Edge Computing backbone's
`release selection <https://github.com/odys-z/semantic-jserv/releases/tag/portfolip-0.8/>`_.
