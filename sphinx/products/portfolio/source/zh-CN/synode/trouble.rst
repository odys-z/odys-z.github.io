故障排除
========

- 外部管理环境错误（PEP 668）

使用以下命令安装 Portfolio 时::

  pip install bin/synode_py3-0.7-py3-none-any.whl 

可能会出现 externally-managed-environment 错误。以下是 Ubuntu 24.04、Python 3.12（Pip 24）下的示例：

::

  error: externally-managed-environment

  × This environment is externally managed
  ╰─> To install Python packages system-wide, try apt install
      python3-xyz, where xyz is the package you are trying to
      install.
      
      If you wish to install a non-Debian-packaged Python package,
      create a virtual environment using python3 -m venv path/to/venv.
      Then use path/to/venv/bin/python and path/to/venv/bin/pip. Make
      sure you have python3-full installed.
      
      If you wish to install a non-Debian packaged Python application,
      it may be easiest to use pipx install xyz, which will manage a
      virtual environment for you. Make sure you have pipx installed.
      
      See /usr/share/doc/python3.12/README.venv for more information.

  note: If you believe this is a mistake, please contact your Python
  installation or OS distribution provider. You can override this, at
  the risk of breaking your Python installation or OS, by passing
  --break-system-packages.

  hint: See PEP 668 for the detailed specification.

这是 Pip 在提示不要把 Portfolio 安装到系统的 python3 路径中。请创建虚拟环境后再安装::

   sudo apt install python3.12-venv # replace the version number
   python3 -m venv .env
   source .env/bin/activate

Portfolio 0.7.6 只在安装时需要 Python3；安装完成后就不再需要 Python 环境。

.. _uninstall_winsrv_manually:

- 手动卸载 Windows 服务

**不推荐这样做**

服务应当使用上文的命令卸载。如果必须手动卸载 Windows 服务，请按以下步骤操作：

#. 复制并备份 *WEB-INF/settings.json*

#. 如果有文件损坏，请把 Portfolio-synode 重新安装到同一文件夹，并确保版本号与之前安装的相同。

#. 从开始菜单打开 Windows 服务控制面板，查看两个服务的名称，应类似于::

    Synode.web-0.8.0-X29
    Synode-0.8.0-X29

  打开 *WEB-INF/settings.json* 文件，把 Synode ID 填入 *"envars"* 部分，例如::

    "envars": {
        "winsrv.web": "Synode.web-0.8.0-X29",
        "winsrv.synode": "Synode-0.8.0-X29"
        ...
    }

#. 以管理员身份打开 CMD 终端，进入安装文件夹。

#. 运行 synode-uninstall.exe

#. 如有需要，刷新 Windows 服务控制面板。


- PIP 无法为 Python 3.12 或更高版本解析 Pillow 版本

错误信息类似::

  $ pip install bin/synode_py3-0.7-py3-none-any.whl 
  Processing ./bin/synode_py3-0.7-py3-none-any.whl
  ...
  INFO: pip is looking at multiple versions of synode-py3 to determine which
  version is compatible with other requirements. This could take a while.
  ERROR: Ignored the following versions that require a different python version: 6.0.0
  Requires-Python >=3.6, <3.10; 6.0.0a1.dev1606911628 Requires-Python >=3.6, <3.10;
  6.0.1 Requires-Python >=3.6, <3.10; 6.0.2 Requires-Python >=3.6, <3.10;
  6.0.3 Requires-Python >=3.6, <3.10; 6.0.4 Requires-Python >=3.6, <3.10;
  ...
  6.5.2 Requires-Python <3.12,>=3.7; 6.5.3 Requires-Python <3.12,>=3.7
  ERROR: Could not find a version that satisfies the requirement psutil
  (from synode-py3) (from versions: none)
  ERROR: No matching distribution found for psutil 

这可能是因为 pip 版本过旧。

在解决这个问题时，我们又遇到了另一个网络问题::

  ERROR: Exception:
  Traceback (most recent call last):
  File "...env-m7/lib/python3.12/site-packages/pip/_vendor/urllib3/response.py", line 438, in _error_catcher
    yield
  File "...env-m7/lib/python3.12/site-packages/pip/_vendor/urllib3/response.py", line 561, in read
    data = self._fp_read(amt) if not fp_closed else b""
           ^^^^^^^^^^^^^^^^^^
  ...
  File "...env-m7/lib/python3.12/site-packages/pip/_vendor/urllib3/response.py", line 443, in _error_catcher
    raise ReadTimeoutError(self._pool, None, "Read timed out.")
  pip._vendor.urllib3.exceptions.ReadTimeoutError: HTTPSConnectionPool(host='files.pythonhosted.org', port=443): Read timed out.

Grok 很肯定这是防火长城（GFW）导致的问题。请使用镜像源安装。

::

    pip install bin/synode_py3-0.7-py3-none-any.whl -i https://pypi.tuna.tsinghua.edu.cn/simple
    
另外，你还有其他选择，例如向网络服务提供商投诉。

- Windows 网络防火墙 / Defender

在启用了防火墙的 Windows 上，请确保防火墙设置允许你所配置的端口。

`Microsoft 文档 <https://learn.microsoft.com/zh-cn/sql/reporting-services/report-server/configure-a-firewall-for-report-server-access?view=sql-server-ver15#opening-ports-in-windows-firewall>`_

.. image:: ../../../../album/source/imgs/windows-firewall-0.png
    :width: 200px

.. image:: ../../../../album/source/imgs/windows-firewall-1.png
    :width: 200px

.. image:: ../../../../album/source/imgs/windows-firewall-2.png
    :width: 200px

.. _trouble-vscode-linux:

- 在 Linux 的 VS Code 中运行

**仅在 Ubuntu 24.04 上测试过**

在 Ubuntu / Linux 的 VS Code 终端中运行 Portfolio-synode，会出现类似 `问题报告 #179274 <https://github.com/microsoft/vscode/issues/179274>`_ 的错误。

.. image:: ../../imgs/04-portfolio-vscode-issue.png
    :width: 36em

可以这样运行来避免该错误::

    export GTK_PATH= && python3 -m portfolio-synode

但由于未经充分测试，强烈不建议这样做。

.. _trouble-exiftool-by-auto-update:

Ubuntu 自动更新导致的问题
-------------------------

**仅发生在启用了自动更新的 Linux 上**

如果在 Linux（在 Ubuntu 24.04 上测试）上配置的系统服务使用的是由系统自动更新管理的 JDK，那么当正在运行的服务的 JDK 版本与最新版本不同时，就会出错。

服务日志如下::

  Incorrect Java version: 21.0.7+6-Ubuntu-0ubuntu124.04
  jspawnhelper version 21.0.8+9-Ubuntu-0ubuntu124.04.1
  This command is not for general use and should only be run as the result of a call to
  ProcessBuilder.start() or Runtime.exec() in a java application
  java.io.IOException: Cannot run program "exiftool": error=0, Failed to exec spawn helper: pid: >
    at java.base/java.lang.ProcessBuilder.start(ProcessBuilder.java:1170)
    at java.base/java.lang.ProcessBuilder.start(ProcessBuilder.java:1089)
    at java.base/java.lang.Runtime.exec(Runtime.java:681)
    at java.base/java.lang.Runtime.exec(Runtime.java:530)
    at io.oz.album.helpers.Exiftool.parse(Exiftool.java:117)
    at io.oz.album.helpers.Exiftool.parseExif(Exiftool.java:62)
    at io.oz.syntier.serv.DocreateHandler.onCreate(DocreateHandler.java:57)
    at io.oz.jserv.docs.syn.ExpDoctier.lambda$endBlock$1(ExpDoctier.java:417)
    at java.base/java.lang.Thread.run(Thread.java:1583)
  Caused by: java.io.IOException: error=0, Failed to exec spawn helper: pid: 546376, exit value: 1
    at java.base/java.lang.ProcessImpl.forkAndExec(Native Method)
    at java.base/java.lang.ProcessImpl.<init>(ProcessImpl.java:295)
    at java.base/java.lang.ProcessImpl.start(ProcessImpl.java:225)
    at java.base/java.lang.ProcessBuilder.start(ProcessBuilder.java:1126)
    ... 8 more

正在运行的 JDK 是旧版本 20.0.7_6，它会用较新的 21.0.8+9 版本来派生进程。由于 jspawnhelper 加强了版本检查 [1]，启动 *exiftool* 进程会失败。

Apt 更新日志::

  openjdk-21 (21.0.8+9~us1-0ubuntu1~24.04.1) noble-security; urgency=medium

    * Upload to Ubuntu 24.04.
    * CVEs:
      - CVE-2025-50059, 8350991: Improve HTTP client header handling
      - CVE-2025-30749, 8348989: Better Glyph drawing
      - CVE-2025-50106, 8360147: Better Glyph drawing redux
      - CVE-2025-30754, 8349594: Enhance TLS protocol support
    * Security fixes:
      - 8349111: Enhance Swing supports
      - 8345625: Better HTTP connections

  -- Vladimir Petko <vladimir.petko@canonical.com>  Thu, 17 Jul 2025 09:55:59 +1200

  ...

  openjdk-21 (21.0.7+6-1) unstable; urgency=high

    * OpenJDK 21.0.7 release, build 6.
      - Addresses CVE-2025-30698, CVE-2025-30691, CVE-2025-21587.

    * Honour DEB_BUILD_OPTIONS=parallel=N while running jtreg tests (Helmut
      Grohne). Addresses: #1095920.

  -- Matthias Klose <doko@ubuntu.com>  Thu, 24 Apr 2025 01:57:46 +0200

[1] *Improve jspawnhelper version checks*，JDK-8325621，影响版本：11、17、21、22、23，
    https://bugs.openjdk.org/browse/JDK-8325621

.. _install-anson-py3:

- 安装 portfolio-synode 失败
  
  [已在 Portfolio 0.7.6 中解决]

  错误::

    ERROR: Could not find a version that satisfies the requirement anson.py3 (from portfolio-synode) (from versions: none)

  Portfolio-synode 依赖一个尚未发布到 PyPI 的模块。请使用以下命令安装：

    pip install --index-url https://test.pypi.org/simple --extra-index-url https://pypi.org/simple anson.py3

  如果需要移除由旧版 Python（例如 python 3.9）安装的包，请用以下命令卸载::

    pip3.9 uninstall portfolio-synode 
