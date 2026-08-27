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
 */
function renderResourceTree(containerId, manifestUrl, distBaseUrl) {
  distBaseUrl |= '';
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch(manifestUrl, { cache: 'no-store' })
    .then(resp => {
      if (!resp.ok) throw new Error(`manifest fetch failed: ${resp.status}`);
      return resp.json();
    })
    .then(mf => buildTree(container, mf, distBaseUrl))
    .catch(err => {
      console.error('renderResourceTree:', err);
    });
}

function buildTree(container, mf, distBaseUrl) {
  container.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'resource-tree';

  // --- Android section (flat, no market/community) ---
  if (mf.android && mf.android.length) {
    root.appendChild(sectionHeading('Android'));
    mf.android.forEach(a => {
      root.appendChild(
        resourceRow(`Portfolio ${a.version} for Android`, distBaseUrl + a.file, 1)
      );
    });
  }

  // --- market -> community -> desktop/synode ---
  const markets = Object.keys(mf.tree || {}).sort();
  markets.forEach(market => {
    root.appendChild(sectionHeading(`MARKET: ${market}`));

    const orgs = Object.keys(mf.tree[market]).sort();
    orgs.forEach(org => {
      root.appendChild(subHeading(`COMMUNITY: ${org}`, 1));

      const node = mf.tree[market][org];
      if (node.desktop) {
        root.appendChild(
          resourceRow(`Desktop ${node.desktop.version}`, distBaseUrl + node.desktop.file, 2)
        );
      }
      if (node.synode) {
        const label = node.synode.jre
          ? `Synode ${node.synode.version} (${node.synode.jre})`
          : `Synode ${node.synode.version}`;
        root.appendChild(resourceRow(label, distBaseUrl + node.synode.file, 2));
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
