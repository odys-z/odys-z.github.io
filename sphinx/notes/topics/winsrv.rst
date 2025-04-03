Registering Py / Jar as Windows Service
=======================================

About Windows Service
---------------------

Which is scheduled at the system booting, according to Registry Key, 

::

    HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\<serice name>

where ImagePath is the executable path.

The service program has it's design, see

#. `Service Configuration Program Tasks <https://learn.microsoft.com/en-us/windows/win32/services/service-configuration-program-tasks>`_, Windows App Development

#. `CreateServiceW function (winsvc.h) <https://learn.microsoft.com/en-us/windows/win32/api/winsvc/nf-winsvc-createservicew>`

.. code-block:: c++

    SC_HANDLE CreateServiceW(
        [in]            SC_HANDLE hSCManager,
        [in]            LPCWSTR   lpServiceName,
        [in, optional]  LPCWSTR   lpDisplayName,
        [in]            DWORD     dwDesiredAccess,
        [in]            DWORD     dwServiceType,
        [in]            DWORD     dwStartType,
        [in]            DWORD     dwErrorControl,
        [in, optional]  LPCWSTR   lpBinaryPathName,
        [in, optional]  LPCWSTR   lpLoadOrderGroup,
        [out, optional] LPDWORD   lpdwTagId,
        [in, optional]  LPCWSTR   lpDependencies,
        [in, optional]  LPCWSTR   lpServiceStartName,
        [in, optional]  LPCWSTR   lpPassword
    );

where the lpBinaryPathName is the executable name, with args.

Pywin32
-------

`Home page <https://github.com/mhammond/pywin32>`_

`Pywin32 Sevice Demo <https://github.com/mhammond/pywin32/tree/main/win32/Demos/service>`_

* Install Service

.. code-block:: python3

    def install(cls):

        pythonClassStr = f"{__name__}.{cls.__name__}"
        exeArg = f'"{os.path.abspath(__file__)}" run'

        print('pythonClassStr', pythonClassStr)
        print('exeArgs', exeArg, 'len =', len(exeArg))

        try:
            log_dir = os.path.dirname(Config.LOG_FILE)
            if log_dir and not os.path.exists(log_dir):
                os.makedirs(log_dir)
            win32serviceutil.InstallService(
                pythonClassString = pythonClassStr,  # Just the Windows Registry class name
                serviceName       = web_srvname,
                displayName       = 'Album-web Service',
                startType         = win32service.SERVICE_AUTO_START,  # Auto-start at boot
                errorControl      = win32service.SERVICE_ERROR_NORMAL,  # Default error control
                bRunInteractive   = 0,  # Do not run interactively
                serviceDeps       = [],  # No dependencies
                userName          = None,  # Run as SYSTEM (default)
                password          = None,  # No password for SYSTEM
                exeName           = f'{sys.executable} -m',  # Path to Python interpreter
                exeArgs           = exeArg,  # Script and run argument
                description       = 'Album-web Windows Service',
                delayedstart      = False  # No delayed start
            )
            print(f"Album-web service installed successfully.")
        except Exception as e:
            print(f"Failed to install service: {e}")

Where InstallService will use a C++ API for the task.

.. code-block:: python3

    def InstallService(pythonClassString, sercieName, ...):
        hs = win32service.CreateService(...)
        InstallPythonClassString(pythonClassString, serviceName)

where *win32service.CreateService()* is the API.

.. code-block:: python3

    def CreateService(*args, **kwargs): # real signature unknown
        pass # Yes

    def InstallPythonClassString(pythonClassString, serviceName):
        key = win32api.RegCreateKey(
            win32con.HKEY_LOCAL_MACHINE,
            "System\\CurrentControlSet\\Services\\%s\\PythonClass" % serviceName,
        )
        win32api.RegSetValue(key, None, win32con.REG_SZ, pythonClassString)

**Problem**

Service installation succeed with problem: can't start the service:

::

    sc start Album-Web
    Error 1053: Error starting service: The service did not respond to the start or control request in a timely fashion

like `the issue <https://github.com/mhammond/pywin32/issues/2056>`_
and `question <https://stackoverflow.com/q/41200068/7362888>`_.

NSSM
----

`nssm <https://nssm.cc/>`_ also features a graphical service installation and removal facility.

`Souce is available at git://git.nssm.cc/nssm/nssm.git. <https://nssm.cc/download>`_

Also errors when starting services.

Rais UAC Level by Python3
-------------------------

`User Acount Control <https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/>`_
can be rasied level in Python3 like 1c5f59302092d18fea50f4c16d27a9eb5105846e:

.. code-block:: python3

    if __name__ == '__main__':

        if cmd == 'install-web' or cmd == 'i-web':
            import win32api
            import win32com.shell.shell as shell

            print(1, cmd)

            if platform.system() == "Windows" and not is_winadmin():
                py_args = '-m src.synodepy3.cli i-web'
                print(2, f"Requesting administrative privileges for {py_args}...")
                shell.ShellExecuteEx(
                    lpVerb="runas",
                    lpFile=sys.executable,
                    lpParameters=py_args,
                    nShow=1  # Show the window
                )
            else: # goes here in another window
                input(3)
                exe_cmd = f'{" ".join(sys.argv)}'
                print(exe_cmd)
                print('===========================')
                AlbumWeb.install()
                input('pausing elevated...')

This code will be removed in the future.

