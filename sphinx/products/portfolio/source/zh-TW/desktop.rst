Windows 桌面版示範版
====================

Portfolio Windows 桌面版是在個人電腦上管理和同步檔案的客戶端。

.. a screenshot is needed

安裝桌面版
----------

Portfolio 0.8 僅提供 Windows 桌面客戶端，需要 Windows 10 及以上版本。

在 Windows 上安裝 Synode 服務時會預設安裝 Portfolio 桌面版；也可以單獨下載並安裝獨立的桌面版。

無論採用哪種安裝方式，都需要設定這台電腦的身份。

設定 Portfolio 桌面版
---------------------

新安裝的 Portfolio 桌面版會直接顯示設定頁面。

    .. image:: ../imgs/02-desktop-settings.png
        :height: 18em

在上面的頁面中，請勿更改註冊中心（registry）的 URL；在 v0.8 中，註冊中心賬號也無法更改。

檔案節點（即 Synode）由 社群 / 網域 / synode-id 確定。只需選擇你在 :ref:`Synode 安裝一節 <setup-synode>` 中啟動的 Synode 即可。

裝置（Device）欄位是你為這台電腦取的名稱，不能為空。使用者登入 Synode 後，裝置名稱會在整個網域內儲存，並自動同步到網域中的所有節點。

啟動 / 執行桌面版（Windows）
----------------------------

在解壓後的資料夾中雙擊 album-gui.exe 即可；也可以在命令列終端中進入解壓後的桌面版資料夾執行。

0.8 示範版不會建立快捷方式或開始選單項（因此也無需解除安裝）。

如果出現找不到 *.ast.json* 或設定檔案的錯誤，說明當前工作目錄不是 album-gui.exe 所在的資料夾。

關於磁碟區（Volume）
--------------------

主頁提供了一個快捷入口，可在檔案資源管理器中開啟本機 Synode 的磁碟區。

如果 Portfolio 桌面版是作為獨立應用安裝、本機沒有 Synode，則磁碟區快捷入口不可用。

    .. image:: ../imgs/02-desktop-home.png
        :height: 18em

.. warning::

    請勿改動磁碟區資料夾中的資料或檔案。移動或修改其中的檔案會導致不可預知的結果。
