Windows 桌面端演示版
====================

Portfolio Windows 桌面端是在个人电脑上管理和同步文件的客户端。

.. a screenshot is needed

安装桌面端
----------

Portfolio 0.8 仅提供 Windows 桌面客户端，需要 Windows 10 及以上版本。

在 Windows 上安装 Synode 服务时会默认安装 Portfolio 桌面端；也可以单独下载并安装独立的桌面端。

无论采用哪种安装方式，都需要设置这台电脑的身份。

设置 Portfolio 桌面端
---------------------

新安装的 Portfolio 桌面端会直接显示设置页面。

    .. image:: ../imgs/02-desktop-settings.png
        :height: 18em

在上面的页面中，请勿更改注册中心（registry）的 URL；在 v0.8 中，注册中心账号也无法更改。

文件节点（即 Synode）由 社区 / 域 / synode-id 确定。只需选择你在 :ref:`Synode 安装一节 <setup-synode>` 中启动的 Synode 即可。

设备（Device）字段是你为这台电脑取的名称，不能为空。用户登录 Synode 后，设备名称会在整个域内保存，并自动同步到域中的所有节点。

启动 / 运行桌面端（Windows）
----------------------------

在解压后的文件夹中双击 album-gui.exe 即可；也可以在命令行终端中进入解压后的桌面端文件夹运行。

0.8 演示版不会创建快捷方式或开始菜单项（因此也无需卸载）。

如果出现找不到 *.ast.json* 或设置文件的错误，说明当前工作目录不是 album-gui.exe 所在的文件夹。

关于卷（Volume）
----------------

主页提供了一个快捷入口，可在文件资源管理器中打开本机 Synode 的卷。

如果 Portfolio 桌面端是作为独立应用安装、本机没有 Synode，则卷快捷入口不可用。

    .. image:: ../imgs/02-desktop-home.png
        :height: 18em

.. warning::

    请勿改动卷文件夹中的数据或文件。移动或修改其中的文件会导致不可预知的结果。
