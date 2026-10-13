提示
====

下载 JRE 卡住（中国大陆）
-------------------------

Portfolio 使用 JRE 17，安装时会从 GitHub 下载。

使用 Wget、Curl 等工具或程序从 GitHub 下载资源时，经常会被阻断，下载进度可能一直停在 0%。

.. image:: ../../imgs/05-jre-downloading-halt.png
    :width: 32em

如果可以通过浏览器或其他方式从 GitHub 下载文件，请下载后放入 jre-temp 文件夹，重新启动 setup-gui 即可解决。

要下载正确的 JRE，请在终端窗口中找到下载链接，例如::

    JRE: ('OpenJDK17U-jre_x64_linux_hotspot_17.0.17_10.tar.gz', False, False, 'jdk-17.0.17+10-jre')
    Downloading JRE for Linux x86_64
    https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.17%2B10/OpenJDK17U-jre_x64_linux_hotspot_17.0.17_10.tar.gz 

把下载的文件（例如 *OpenJDK17U-jre_x64_linux_hotspot_17.0.17_10.tar.gz*）放入 jre-temp 文件夹，重新启动安装程序后会跳过下载。

如果其他方式也无法下载，请联系作者。
