提示
====

下載 JRE 卡住（中國大陸）
-------------------------

Portfolio 使用 JRE 17，安裝時會從 GitHub 下載。

使用 Wget、Curl 等工具或程式從 GitHub 下載資源時，經常會被阻斷，下載進度可能一直停在 0%。

.. image:: ../../imgs/05-jre-downloading-halt.png
    :width: 32em

如果可以透過瀏覽器或其他方式從 GitHub 下載檔案，請下載後放入 jre-temp 資料夾，重新啟動 setup-gui 即可解決。

要下載正確的 JRE，請在終端視窗中找到下載連結，例如::

    JRE: ('OpenJDK17U-jre_x64_linux_hotspot_17.0.17_10.tar.gz', False, False, 'jdk-17.0.17+10-jre')
    Downloading JRE for Linux x86_64
    https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.17%2B10/OpenJDK17U-jre_x64_linux_hotspot_17.0.17_10.tar.gz 

把下載的檔案（例如 *OpenJDK17U-jre_x64_linux_hotspot_17.0.17_10.tar.gz*）放入 jre-temp 資料夾，重新啟動安裝程式後會跳過下載。

如果其他方式也無法下載，請聯絡作者。
