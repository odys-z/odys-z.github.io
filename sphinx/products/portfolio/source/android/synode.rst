About File Synchronization
==========================

Portfolio is designed to automatically synchronize database and resources (files)
between nodes, called Synodes, and can be working in offline mode.

Devices must be Identically Registered
--------------------------------------

The resources, files from mobile devices, are distinguishd by their device name and
full path. A device's file is considered as a new resource if the device is changed 
its ID. Also, if a device has restored its used ID, all files' synchronization can
be restored.

**Restoring a device name can only happen if a client has been reinstalled.**