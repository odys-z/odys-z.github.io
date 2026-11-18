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
 *     COMMUNITY: some-other-org
 *       [download] Desktop 0.8.0
 *
 * Expects a manifest shaped like:
 * {
 *   "page_url": "https://.../portfolio-0.8/",   (optional, the landing root)
 *   "android": [{ "file": "...", "version": "..." }],
 *   "tree": {
 *     "<market>": {
 *       "<org>": {
 *         "desktop": { "file": "...", "version": "..." },
 *         "synode":  { "file": "...", "version": "...", "jre": "..." }
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
 *   - the header shows the QR of this page: "page_url" + this language's
 *     folder (SITE_LANGS in lang-switcher.js), e.g. ".../portfolio-0.8/zh-CN/";
 *   - each Android package gets a download QR with a download sign in the
 *     middle, encoding the package's URL resolved against that page URL.
 * Without "page_url" the page's own address is used (fine when deployed,
 * but a local test server's address won't open on a phone).
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
    synodeNote:  "- with desktop"
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
    synodeNote:  "- 含桌面端"
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
    synodeNote:  "- 含桌面端"
  }
};

function treeText() {
  return TREE_TEXT[normalizeLang(document.documentElement.lang || 'en')] || TREE_TEXT.en;
}

/**
 * @param containerId     element for the resource tree (Android + markets)
 * @param distBaseUrl     folder holding the manifest and the artifacts
 * @param manifestUrl     manifest file name, relative to distBaseUrl
 * @param qrElemId        element to show the page's QR code on (as a
 *                        right-aligned background, see css class .qr),
 *                        default "qrh1"
 */
function renderResourceTree(containerId, distBaseUrl, manifestUrl, qrElemId) {
  distBaseUrl = (distBaseUrl || '') + '/';
  manifestUrl = distBaseUrl + (manifestUrl || 'manifest.json');
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch(manifestUrl, { cache: 'no-store' })
    .then(resp => {
      if (!resp.ok) throw new Error(`manifest fetch failed: ${resp.status}`);
      return resp.json();
    })
    .then(mf => {
      buildTree(container, mf, distBaseUrl);
      renderPageQr(qrElemId || 'qrh1', mf);
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
      root.appendChild(
        resourceRow(T.apk(a.version), resolveUrl(a.file), 1)
      );
      // download QR, below the link text
      const qrImg = qrDataUrl(absoluteUrl(resolveUrl(a.file), mf), true);
      if (qrImg) {
        root.appendChild(qrRow(qrImg, resolveUrl(a.file), 1, T.scanApk));
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
    });
  });
  container.appendChild(root);
}

// ---------------------------------------------------------------------------
// QR codes
// ---------------------------------------------------------------------------

/**
 * This page's public URL: mf.page_url (the landing root) + this language's
 * folder from SITE_LANGS; without page_url, the page's own address.
 */
function pageUrl(mf) {
  if (!mf.page_url) return location.href.split('#')[0];

  const root = mf.page_url.replace(/\/*$/, '/');
  const lang = normalizeLang(document.documentElement.lang || 'en');
  const site = (typeof SITE_LANGS !== 'undefined')
    ? SITE_LANGS.find(l => normalizeLang(l.code) === lang) : null;
  return new URL(site ? site.dir : '', root).href;
}

/** A link of this page (e.g. "../res/dist/x.apk") as a full public URL. */
function absoluteUrl(href, mf) {
  return new URL(href, pageUrl(mf)).href;
}

/** Shows this page's QR code as the element's right-aligned background. */
function renderPageQr(elemId, mf) {
  const el = document.getElementById(elemId);
  if (!el) return;
  const url = pageUrl(mf);
  const img = qrDataUrl(url, false);
  if (!img) return;

  el.classList.add('qr');
  el.style.backgroundImage = `url("${img}")`;
  el.title = url;
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
