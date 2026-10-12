/**
 * Credits: genterated by Claude.ai
 * 
 * Renders the manifest.json resource tree into a container, flush-left,
 * as:
 *
 *   Android
 *     [download] Portfolio 0.8.0 for Android
 *
 *   MARKET: alpha
 *     COMMUNITY: pmking
 *       [download] Desktop 0.8.0
 *       [download] Synode 0.8.0 (jre17)
 *     COMMUNITY: some-other-org
 *       [download] Desktop 0.8.0
 *
 * Expects a manifest shaped like:
 * {
 *   "android": [{ "file": "...", "version": "..." }],
 *   "docs":    [{ "file": "...", "version": "...", "lang": "en" }],
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
 * Documents (mf.docs) are NOT part of the resource tree. They are rendered
 * into a separate container (docsContainerId), one link per language found
 * in the manifest, labelled with LANG_NAMES from lang-switcher.js.
 *
 * Requires: lang-switcher.js loaded on the same page (for LANG_NAMES). Without
 * it the manuals are still listed, labelled with the raw language code.
 */

// Language names (manifest "lang" field, from file names like
// portfolio-0.8-zh-CN.pdf) come from LANG_NAMES in lang-switcher.js, the one
// list of languages for the landing pages. Read at call time, so script order
// does not matter.
function langNames() {
  return (typeof LANG_NAMES !== 'undefined') ? LANG_NAMES : {};
}

// ---------------------------------------------------------------------------
// Data: UI labels per page language (<html lang>). Languages not listed fall
// back to "en". Add an entry here when adding a landing page language.
// ---------------------------------------------------------------------------
const TREE_TEXT = {
  "en": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v} for Android`,
    market:    (m) => `MARKET: ${m}`,
    community: (o) => `COMMUNITY: ${o}`,
    desktop:   (v) => `Desktop ${v}`,
    synode:    (v) => `Synode ${v}`,
    documents: "Documents",
    manual:    (v, lang) => lang ? `Portfolio ${v} Manual (PDF, ${lang})` : `Portfolio ${v} Manual (PDF)`
  },
  "zh-CN": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v}（Android 版）`,
    market:    (m) => `发布渠道：${m}`,
    community: (o) => `社区：${o}`,
    desktop:   (v) => `桌面端 ${v}`,
    synode:    (v) => `Synode ${v}`,
    documents: "文档",
    manual:    (v, lang) => lang ? `Portfolio ${v} 用户手册（PDF，${lang}）` : `Portfolio ${v} 用户手册（PDF）`
  },
  "zh-TW": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v}（Android 版）`,
    market:    (m) => `發佈渠道：${m}`,
    community: (o) => `社群：${o}`,
    desktop:   (v) => `桌面端 ${v}`,
    synode:    (v) => `Synode ${v}`,
    documents: "文件",
    manual:    (v, lang) => lang ? `Portfolio ${v} 使用手冊（PDF，${lang}）` : `Portfolio ${v} 使用手冊（PDF）`
  }
};

function treeText() {
  return TREE_TEXT[normalizeLang(document.documentElement.lang || 'en')] || TREE_TEXT.en;
}

/**
 * @param containerId     element for the resource tree (Android + markets)
 * @param distBaseUrl     folder holding the manifest and the artifacts
 * @param manifestUrl     manifest file name, relative to distBaseUrl
 * @param docsContainerId optional element for the document downloads; its
 *                        existing content (e.g. a static link) is kept
 */
function renderResourceTree(containerId, distBaseUrl, manifestUrl, docsContainerId) {
  distBaseUrl = (distBaseUrl || '') + '/';
  manifestUrl = distBaseUrl + (manifestUrl || 'manifest.json');
  const container = document.getElementById(containerId);
  if (!container) return;
  const docsContainer = docsContainerId ? document.getElementById(docsContainerId) : null;

  fetch(manifestUrl, { cache: 'no-store' })
    .then(resp => {
      if (!resp.ok) throw new Error(`manifest fetch failed: ${resp.status}`);
      return resp.json();
    })
    .then(mf => {
      buildTree(container, mf, distBaseUrl);
      if (docsContainer) buildDocs(docsContainer, mf, distBaseUrl);
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

function langName(code) {
  const norm = normalizeLang(code);
  return langNames()[norm] || norm;
}

/**
 * Appends the document downloads (one row per language) to docsContainer,
 * keeping whatever the page already put there. The language matching the
 * page's <html lang> comes first; the rest follow in LANG_NAMES order, then
 * any language not in LANG_NAMES.
 */
function buildDocs(docsContainer, mf, distBaseUrl) {
  const docs = (mf.docs || []).slice();
  if (!docs.length) return;

  const resolveUrl = urlResolver(distBaseUrl);
  const pageLang = normalizeLang(document.documentElement.lang || 'en');
  const known = Object.keys(langNames());
  const rank = (d) => {
    const l = normalizeLang(d.lang);
    if (l === pageLang) return -1;
    const i = known.indexOf(l);
    return i < 0 ? known.length : i;
  };
  docs.sort((a, b) => rank(a) - rank(b));

  const T = treeText();
  const box = document.createElement('div');
  box.className = 'doc-downloads';
  box.appendChild(sectionHeading(T.documents));
  docs.forEach(d => {
    const label = T.manual(d.version, d.lang ? langName(d.lang) : '');
    box.appendChild(resourceRow(label, resolveUrl(d.file), 1));
  });
  docsContainer.appendChild(box);
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
          resourceRow(T.desktop(node.desktop.version), resolveUrl(node.desktop.file), 2)
        );
      }
      
      if (node.synode) {
        const synodes = Array.isArray(node.synode) ? node.synode : [node.synode];
        for (const item of synodes) {
          const label = item.jre
            ? `${T.synode(item.version)} (${item.jre})`
            : T.synode(item.version);

          root.appendChild(resourceRow(label, resolveUrl(item.file), 2));
        }
      }
    });
  });
  container.appendChild(root);
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

// A single downloadable resource row.
function resourceRow(label, href, level) {
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
  div.appendChild(i);
  return div;
}
