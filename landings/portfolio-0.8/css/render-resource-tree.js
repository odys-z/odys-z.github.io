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
    market:    (m) => `MARKET: ${m}`,
    community: (o) => `COMMUNITY: ${o}`,
    desktop:   (v) => `Desktop ${v}`,
    synode:    (v) => `Synode ${v}`
  },
  "zh-CN": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v}（Android 版）`,
    market:    (m) => `发布渠道：${m}`,
    community: (o) => `社区：${o}`,
    desktop:   (v) => `桌面端 ${v}`,
    synode:    (v) => `Synode ${v}`
  },
  "zh-TW": {
    android:   "Android",
    apk:       (v) => `Portfolio ${v}（Android 版）`,
    market:    (m) => `發佈渠道：${m}`,
    community: (o) => `社群：${o}`,
    desktop:   (v) => `桌面端 ${v}`,
    synode:    (v) => `Synode ${v}`
  }
};

function treeText() {
  return TREE_TEXT[normalizeLang(document.documentElement.lang || 'en')] || TREE_TEXT.en;
}

/**
 * @param containerId     element for the resource tree (Android + markets)
 * @param distBaseUrl     folder holding the manifest and the artifacts
 * @param manifestUrl     manifest file name, relative to distBaseUrl
 */
function renderResourceTree(containerId, distBaseUrl, manifestUrl) {
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
