/**
 * Credits: genterated by Claude.ai
 * 
 * Renders the manifest.json resource tree into a container, flush-left,
 * as:
 *
 *   Android
 *     [download] Portfolio 0.8.0 for Android
 *     [QR code]  (download QR, drawn here)
 *
 *   MARKET: alpha
 *     COMMUNITY: pmking
 *       [download] Desktop 0.8.0 (stand alone)
 *       [download] Synode 0.8.0 (x64_linux) - with desktop
 *       [download] Synode Upgrade 0.8.3 (Windows) - for an installed Synode
 *     COMMUNITY: some-other-org
 *       [download] Desktop 0.8.0
 *
 * Expects a manifest shaped like:
 * {
 *   "page_url": "http://182.150.29.34:2000/",   (optional root path)
 *   "android": [{ "file": "...", "version": "..." }],
 *   "tree": {
 *     "<market>": {
 *       "<org>": {
 *         "desktop": { "file": "...", "version": "..." },
 *         "synode":  { "file": "...", "version": "...", "jre": "..." },
 *         "upgrade-windows": { "file": "...", "version": "..." }
 *       }
 *     }
 *   }
 * }
 *
 * All rows are plain <div>s (not nested <ul>/<li>) with left/right padding
 * set explicitly per level, rather than relying on list-nesting indent, so
 * everything stays flush to the container's left edge regardless of depth.
 *
 * QR codes are drawn in the browser with qrcode.js (Kazuhiko Arase, MIT),
 * which the page must load before this script:
 *   - the header shows the QR of the current page (location.href without hash);
 *   - each Android package gets a download QR with a download sign in the
 *     middle, built from the package's <a href> resolved against the current
 *     page address.
 *
 * The PDF manuals are not listed here: each landing page links its own
 * language's manual directly (res/dist/portfolio-<version>-<lang>.pdf).
 */

// ---------------------------------------------------------------------------
// Data: UI labels per page language (<html lang>). Languages not listed fall
// back to "en". Add an entry here when adding a landing page language.
// ---------------------------------------------------------------------------
const TREE_TEXT = {
  "en": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v} for Android`,
    scanApk:   "Scan to download",
    market:    (m) => `MARKET: ${m}`,
    community: (o) => `COMMUNITY: ${o}`,
    desktop:   (v) => `Desktop ${v}`,
    synode:    (v) => `Synode ${v}`,
    // Desktop is only needed where no Synode is installed (a Synode includes it)
    desktopNote: "(stand alone)",
    synodeNote:  "- with desktop",
    upgrade:     (v, os) => `Synode Upgrade ${v} (${os})`,
    upgradeNote: "- for an installed Synode"
  },
  "zh-CN": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v}（Android 版）`,
    scanApk:   "扫码下载",
    market:    (m) => `发布渠道：${m}`,
    community: (o) => `社区：${o}`,
    desktop:   (v) => `桌面端 ${v}`,
    synode:    (v) => `Synode ${v}`,
    desktopNote: "（单独安装）",
    synodeNote:  "- 含桌面端",
    upgrade:     (v, os) => `Synode 升级程序 ${v}（${os}）`,
    upgradeNote: "- 升级已安装的 Synode"
  },
  "zh-TW": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v}（Android 版）`,
    scanApk:   "掃碼下載",
    market:    (m) => `發佈渠道：${m}`,
    community: (o) => `社群：${o}`,
    desktop:   (v) => `桌面端 ${v}`,
    synode:    (v) => `Synode ${v}`,
    desktopNote: "（單獨安裝）",
    synodeNote:  "- 含桌面端",
    upgrade:     (v, os) => `Synode 升級程式 ${v}（${os}）`,
    upgradeNote: "- 升級已安裝的 Synode"
  }
};

function treeText() {
  return TREE_TEXT[normalizeLang(document.documentElement.lang || 'en')] || TREE_TEXT.en;
}

/**
 * @param containerId     element for the resource tree (Android + markets)
 * @param distBaseUrl     folder holding the manifest and the artifacts
 * @param manifestUrl     manifest file name, relative to distBaseUrl
 * @param qrElemId        element to show the page's QR code after (see css
 *                        class .page-qr), default "qrh1"
 */
// ---------------------------------------------------------------------------
// Data: the manifest each host loads instead of the one the page names. The
// GitHub site links the packages to a GitHub release (manifest.github.json,
// written by gen_manifest.py --base-url); the private servers serve them from
// res/dist (manifest.json, bare file names).
// ---------------------------------------------------------------------------
const MANIFEST_BY_HOST = {
  "odys-z.github.io": "manifest.github.json"
};

function renderResourceTree(containerId, distBaseUrl, manifestUrl, qrElemId) {
  distBaseUrl = (distBaseUrl || '') + '/';
  manifestUrl = distBaseUrl
      + (MANIFEST_BY_HOST[location.hostname] || manifestUrl || 'manifest.json');
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch(manifestUrl, { cache: 'no-store' })
    .then(resp => {
      if (!resp.ok) throw new Error(`manifest fetch failed: ${resp.status}`);
      return resp.json();
    })
    .then(mf => {
      buildTree(container, mf, distBaseUrl);
      renderPageQr(qrElemId || 'qrh1');
    })
    .catch(err => {
      console.error('renderResourceTree:', err);
    });
}

function urlResolver(distBaseUrl) {
  return (filePath) =>
    /^(?:https?|wss?|ftps?|file|content):\/\//i.test(filePath)
      ? filePath
      : distBaseUrl + filePath;
}

/** "zh_cn" / "ZH-CN" -> "zh-CN"; "EN" -> "en" */
function normalizeLang(code) {
  const [lang, region] = String(code || '').split(/[-_]/);
  return region ? `${lang.toLowerCase()}-${region.toUpperCase()}` : lang.toLowerCase();
}

function buildTree(container, mf, distBaseUrl) {
  // --- market -> community -> desktop/synode ---
  const resolveUrl = urlResolver(distBaseUrl);
  const T = treeText();

  container.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'resource-tree';

  // --- Android section (flat, no market/community) ---
  if (mf.android && mf.android.length) {
    root.appendChild(sectionHeading(T.android));
    mf.android.forEach(a => {
      const row = resourceRow(T.apk(a.version), resolveUrl(a.file), 1);
      root.appendChild(row);
      const anchor = row.querySelector('a');
      // Compose APK QR URL from <a href> and the current page address
      const apkUrl = new URL(anchor ? anchor.getAttribute('href') : resolveUrl(a.file), location.href).href;
      const qrImg = qrDataUrl(apkUrl, true);
      if (qrImg) {
        root.appendChild(qrRow(qrImg, anchor ? anchor.getAttribute('href') : resolveUrl(a.file), 1, T.scanApk));
      }
    });
  }

  const markets = Object.keys(mf.tree || {}).sort();
  markets.forEach(market => {
    root.appendChild(sectionHeading(T.market(market)));

    const orgs = Object.keys(mf.tree[market]).sort();
    orgs.forEach(org => {
      root.appendChild(subHeading(T.community(org), 1));

      const node = mf.tree[market][org];
      
      if (node.desktop) {
        root.appendChild(
          resourceRow(T.desktop(node.desktop.version), resolveUrl(node.desktop.file), 2, T.desktopNote)
        );
      }
      
      if (node.synode) {
        const synodes = Array.isArray(node.synode) ? node.synode : [node.synode];
        for (const item of synodes) {
          const label = item.jre
            ? `${T.synode(item.version)} (${item.jre})`
            : T.synode(item.version);

          root.appendChild(resourceRow(label, resolveUrl(item.file), 2, T.synodeNote));
        }
      }

      // the Synode upgrade tools, last: manifest keys "upgrade-<os>"
      const upgradeOs = { "upgrade-windows": "Windows" };
      Object.keys(upgradeOs).forEach(key => {
        const upg = node[key];
        if (upg) {
          root.appendChild(rowRule(2));
          root.appendChild(
            resourceRow(T.upgrade(upg.version, upgradeOs[key]), resolveUrl(upg.file), 2, T.upgradeNote));
        }
      });
    });
  });
  container.appendChild(root);
}

// ---------------------------------------------------------------------------
// QR codes
// ---------------------------------------------------------------------------

/**
 * Shows this page's QR code as <img class="page-qr"> right after the element
 * (h1#qrh1); the page's CSS places it (top-right, or under the title on
 * phones).
 */
function renderPageQr(elemId) {
  const el = document.getElementById(elemId);
  if (!el) return;
  const url = location.href.split('#')[0];
  const src = qrDataUrl(url, false);
  if (!src) return;

  let img = document.querySelector('img.page-qr');
  if (!img) {
    img = document.createElement('img');
    img.className = 'page-qr';
    el.insertAdjacentElement('afterend', img);
  }
  img.src = src;
  img.alt = img.title = url;
}

// Download arrow over a tray, in a 24x24 box.
const QR_DOWNLOAD_ICON =
  '<g fill="none" stroke="#3f51b5" stroke-width="2.6" ' +
  'stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M12 3v11"/><path d="M7 10l5 5 5-5"/><path d="M4 16v4h16v-4"/></g>';

/**
 * QR code of text as an SVG data URL, black on white, or null if qrcode.js
 * isn't loaded. With downloadIcon, a download sign covers the centre; the
 * code then uses error correction level H (30%) so it still scans.
 */
function qrDataUrl(text, downloadIcon) {
  if (typeof qrcode === 'undefined') {
    console.warn('QR codes need css/qrcode.js loaded before render-resource-tree.js');
    return null;
  }
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  const qr = qrcode(0, downloadIcon ? 'H' : 'M');   // 0: smallest version that fits
  qr.addData(text, 'Byte');
  qr.make();

  const n = qr.getModuleCount(), border = 2, size = n + 2 * border;
  let d = '';
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) d += `M${c + border} ${r + border}h1v1h-1z`;

  let icon = '';
  if (downloadIcon) {
    const box = size * 0.24, x0 = (size - box) / 2;
    icon = `<rect x="${x0}" y="${x0}" width="${box}" height="${box}" ` +
           `rx="${box * 0.18}" fill="#fff"/>` +
           `<g transform="translate(${x0 + box * 0.1},${x0 + box * 0.1}) ` +
           `scale(${box * 0.8 / 24})">${QR_DOWNLOAD_ICON}</g>`;
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" ` +
    `shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/>` +
    `<path d="${d}" fill="#000"/><g shape-rendering="auto">${icon}</g></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/**
 * A download QR code under a resource row; clicking it downloads too.
 *   [QR image]
 *   Scan to download
 */
function qrRow(qrSrc, href, level, caption) {
  const div = document.createElement('div');
  div.className = 'resource-qr';
  div.style.paddingLeft = (level * 16) + 'px';
  div.style.margin = '6px 0 10px 0';

  const a = document.createElement('a');
  a.setAttribute('download', '');
  a.href = href;
  a.title = caption || '';

  const img = document.createElement('img');
  img.src = qrSrc;
  img.alt = caption || 'QR';
  img.width = 128;
  img.height = 128;
  img.style.display = 'block';
  a.appendChild(img);
  div.appendChild(a);

  if (caption) {
    const small = document.createElement('small');
    small.className = 'w3-text-grey';
    small.textContent = caption;
    div.appendChild(small);
  }
  return div;
}

// Top-level section label: "Android" / "MARKET: alpha"
function sectionHeading(text) {
  const div = document.createElement('div');
  div.className = 'w3-blue w3-padding-small resource-section';
  div.style.marginTop = '12px';
  const strong = document.createElement('strong');
  strong.textContent = text;
  div.appendChild(strong);
  return div;
}

// Second-level label: "COMMUNITY: pmking"
function subHeading(text, level) {
  const div = document.createElement('div');
  div.className = 'resource-subsection';
  div.style.paddingLeft = (level * 16) + 'px';
  div.style.marginTop = '6px';
  const strong = document.createElement('strong');
  strong.textContent = text;
  div.appendChild(strong);
  return div;
}

// A rule between rows, indented like the rows: <hr> above the upgrade tools.
function rowRule(level) {
  const hr = document.createElement('hr');
  hr.className = 'resource-rule';
  hr.style.margin = '6px 0 6px ' + (level * 16) + 'px';
  return hr;
}

// A single downloadable resource row, with an optional plain-text note
// after the link, e.g. "(stand alone)".
function resourceRow(label, href, level, note) {
  const div = document.createElement('div');
  div.className = 'resource-row';
  div.style.paddingLeft = (level * 16) + 'px';

  const i = document.createElement('i');
  i.className = 'fa fa-download w3-text-indigo';

  const a = document.createElement('a');
  a.setAttribute('download', '');
  a.href = href;
  a.textContent = ' ' + label;

  i.appendChild(a);
  if (note) i.appendChild(document.createTextNode(' ' + note));
  div.appendChild(i);
  return div;
}
