.. _setup-synode:

安裝 Portfolio-synode
=====================

    請在 `Portfolio 主頁 <https://odys-z.github.io/landings/portfolio-0.8/zh-TW/>`_ 按目標作業系統下載對應的 Synode 安裝包。

經驗證的推薦安裝步驟
--------------------

#. 安裝中樞節點

    前提條件：

    - Python 3.12

    Portfolio-synode 需要 Python 3.12。這意味著如果要在 Windows 上部署 Synode，需要 Windows 10 或更高版本。

    - Exiftool

    在 Linux 上還需安裝 *Exiftool*。

    按照 `官方文件 <https://exiftool.org/install.html#Unix>`_ 安裝，或使用 *apt* 安裝::

        sudo apt install exiftool

    並確認 "exiftool -ver" 可以正常執行。

    - 關於 JDK 17

    Portfolio 0.8 會下載並安裝自帶的 JDK 17。如果系統中已安裝其他 JDK，請留意這一點。

    請按照以下影片安裝中樞節點。

        .. only:: html

            .. video:: ../../imgs/00-synode-x64_linux-0.8.0-pic-motion.mp4
                :width: 600

        .. only:: latex

            .. image:: ../../imgs/00-synode-x64_linux-0.8.0-poster.png
                :width: 80%
                :target: https://odys-z.github.io/products/portfolio/synode/setup.html

            線上觀看影片：https://odys-z.github.io/products/portfolio/zh-TW/synode/setup.html

#. 設定對等節點
   
   - 下載並解壓到一個資料夾中。

   Windows：下載 zip 檔案，解壓後執行 *setup-gui.exe*。
   
   Linux：下載 tar 包，解壓後執行 *synode-gui*。

   執行後應看到如下介面：

   .. image:: ../../imgs/00-synode-x64_windows-0.8.0.png
       :width: 24em

   - 選擇在 *中樞節點* 步驟中建立的網域。

   - 設定本機網頁服務連接埠和資料服務連接埠，例如 8964/8965。

    僅當主機由公網位址對映而來時，才勾選反向代理（reverse proxy）。

    本機 IP 會被自動檢測。
    
   - 修改 Jservs 的 URL

    如果設定的是公網位址（即中樞節點），請將 *Sync-in* 保持為 0 秒。無需關心 jservs，但要確保反向代理設定正確，例如 ::

        10.0.0.1   8964 / 8965

    如果設定的是本地服務節點（例如私人儲存裝置或電腦），通常將 *Sync-in* 設為 60 秒；設為 0 則該機器將不再存取中樞節點。

    如果手動修改中樞節點的 URL，請嚴格遵循以下格式::

        http://10.0.0.1:8964/jserv-album

    - 確認無誤後，點選 *Save*。
 
    此時應顯示一個 QR 碼。稍後可以用 Portfolio 客戶端（例如 Portfolio Android）掃描它，連線到這個服務節點。

    - 安裝服務
    
    Windows
    
        點選 *Install Windows Serivce*，啟動 2 個 Windows 服務。

        每個服務的安裝和啟動都需要以管理員權限確認，共需確認 4 次。

        **注意：權限確認對話方塊可能被當前視窗遮擋。**

    Linux
    
    複製生成的服務模板檔案，以設定系統服務。

    服務設定檔案按 [synode-id][.service] 和 [synode-id][.web-service] 的格式命名。例如::

        closed-test-1-hub.service
        closed-test-1-hub.web.service

#. 在瀏覽器中測試

    * 檢查防火牆設定

        Portfolio-synode 預設監聽 TCP 連接埠 8965（如上例，為資料服務）和連接埠 8964（網頁服務）。

    * 在瀏覽器中開啟網頁

        開啟列出已上傳檔案的主頁，例如::

            url: http://127.0.0.1:8964/login.html

        用 Portfolio Android 上傳過的檔案應會顯示在這裡。

    .. image:: ../../../../album/source/imgs/07-portfolio-web.png
        :width: 24em


**現在可以下載 Android 客戶端，並掃碼登入了。** :ref:`Android 客戶端也需要一些設定 <setup_android>`。

解除安裝 Synode
---------------

在 Windows 上解除安裝 Portfolio-synode
______________________________________

* 解除安裝 Windows 服務：

在 CMD 終端或 VS Code 的 Bash 終端中執行：

::

    # cd portfolio-synode 
    synode-uninstall-srv

這會解除安裝 Windows 服務。

之後就可以安全刪除解壓 zip 檔案得到的 *portfolio-synode* 資料夾了。檔案的儲存位置由 *磁碟區（Volume）* 路徑指定；如果不再需要已上傳的檔案，也可以刪除該資料夾。

* 如果檔案損壞導致服務無法解除安裝，可以 :ref:`手動解除安裝 Windows 服務 <uninstall_winsrv_manually>`。

在 Linux 上解除安裝 Portfolio-synode
____________________________________

以下命令模板用於解除安裝 Synode ID 為 *closed-test-1-hub* 的服務：

.. code-block:: bash

   sudo systemctl stop closed-test-1-hub.service closed-test-1-hub.web.service
   sudo systemctl disable closed-test-1-hub.service closed-test-1-hub.web.service
   sudo rm /etc/systemd/system/closed-test-1-hub.service
   sudo rm /etc/systemd/system/closed-test-1-hub.web.service
   sudo systemctl daemon-reload
   sudo systemctl reset-failed
