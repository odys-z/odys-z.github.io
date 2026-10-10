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
 * in the manifest, labelled with the names in DOC_LANGS below.
 */

// ---------------------------------------------------------------------------
// Data: display names for document language codes (manifest "lang" field,
// taken from file names like portfolio-0.8-zh-CN.pdf). Codes not listed here
// are shown as the raw code.
// ---------------------------------------------------------------------------
const DOC_LANGS = {
  "en": "English",
  "zh-CN": "Chinese (simplified)"
};

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
  return DOC_LANGS[norm] || norm;
}

/**
 * Appends the document downloads (one row per language) to docsContainer,
 * keeping whatever the page already put there. The language matching the
 * page's <html lang> comes first; the rest follow in DOC_LANGS order, then
 * any language not in DOC_LANGS.
 */
function buildDocs(docsContainer, mf, distBaseUrl) {
  const docs = (mf.docs || []).slice();
  if (!docs.length) return;

  const resolveUrl = urlResolver(distBaseUrl);
  const pageLang = normalizeLang(document.documentElement.lang || 'en');
  const known = Object.keys(DOC_LANGS);
  const rank = (d) => {
    const l = normalizeLang(d.lang);
    if (l === pageLang) return -1;
    const i = known.indexOf(l);
    return i < 0 ? known.length : i;
  };
  docs.sort((a, b) => rank(a) - rank(b));

  const box = document.createElement('div');
  box.className = 'doc-downloads';
  box.appendChild(sectionHeading('Documents'));
  docs.forEach(d => {
    const label = d.lang
      ? `Portfolio ${d.version} Manual (PDF, ${langName(d.lang)})`
      : `Portfolio ${d.version} Manual (PDF)`;
    box.appendChild(resourceRow(label, resolveUrl(d.file), 1));
  });
  docsContainer.appendChild(box);
}

function buildTree(container, mf, distBaseUrl) {
  // --- market -> community -> desktop/synode ---
  const resolveUrl = urlResolver(distBaseUrl);

  container.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'resource-tree';

  // --- Android section (flat, no market/community) ---
  if (mf.android && mf.android.length) {
    root.appendChild(sectionHeading('Android'));
    mf.android.forEach(a => {
      root.appendChild(
        resourceRow(`Portfolio ${a.version} for Android`, resolveUrl(a.file), 1)
      );
    });
  }

  const markets = Object.keys(mf.tree || {}).sort();
  markets.forEach(market => {
    root.appendChild(sectionHeading(`MARKET: ${market}`));

    const orgs = Object.keys(mf.tree[market]).sort();
    orgs.forEach(org => {
      root.appendChild(subHeading(`COMMUNITY: ${org}`, 1));

      const node = mf.tree[market][org];
      
      if (node.desktop) {
        root.appendChild(
          resourceRow(`Desktop ${node.desktop.version}`, resolveUrl(node.desktop.file), 2)
        );
      }
      
      if (node.synode) {
        const synodes = Array.isArray(node.synode) ? node.synode : [node.synode];
        for (const item of synodes) {
          const label = item.jre
            ? `Synode ${item.version} (${item.jre})`
            : `Synode ${item.version}`;

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
