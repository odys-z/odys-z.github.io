/**
 * Credits: genterated by Claude.ai
 * 
 * Renders the manifest.json resource tree into a container as:
 *
 *   Android
 *     - Portfolio 0.8.0 for Android (apk)
 *   <market>
 *     <org>
 *       - Desktop 0.8.0
 *       - Synode 0.8.0 (jre17)
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
 */
function renderResourceTree(containerId, manifestUrl, distBaseUrl) {
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
  const root = document.createElement('ul');
  root.className = 'w3-ul resource-tree';

  // --- Android section (flat, no market/org) ---
  if (mf.android && mf.android.length) {
    root.appendChild(sectionHeader('Android'));
    const androidList = document.createElement('ul');
    androidList.className = 'w3-ul';
    mf.android.forEach(a => {
      androidList.appendChild(
        leafItem(`Portfolio ${a.version} for Android`, distBaseUrl + a.file)
      );
    });
    root.appendChild(wrapNested(androidList));
  }

  // --- market -> org -> desktop/synode ---
  const markets = Object.keys(mf.tree || {}).sort();
  markets.forEach(market => {
    root.appendChild(sectionHeader(market));
    const orgList = document.createElement('ul');
    orgList.className = 'w3-ul';

    const orgs = Object.keys(mf.tree[market]).sort();
    orgs.forEach(org => {
      const orgItem = document.createElement('li');
      const orgLabel = document.createElement('strong');
      orgLabel.textContent = org;
      orgItem.appendChild(orgLabel);

      const resList = document.createElement('ul');
      resList.className = 'w3-ul';

      const node = mf.tree[market][org];
      if (node.desktop) {
        resList.appendChild(
          leafItem(`Desktop ${node.desktop.version}`, distBaseUrl + node.desktop.file)
        );
      }
      if (node.synode) {
        const label = node.synode.jre
          ? `Synode ${node.synode.version} (${node.synode.jre})`
          : `Synode ${node.synode.version}`;
        resList.appendChild(leafItem(label, distBaseUrl + node.synode.file));
      }

      orgItem.appendChild(resList);
      orgList.appendChild(orgItem);
    });

    root.appendChild(wrapNested(orgList));
  });

  container.appendChild(root);
}

function sectionHeader(text) {
  const li = document.createElement('li');
  li.className = 'w3-blue';
  const strong = document.createElement('strong');
  strong.textContent = text;
  li.appendChild(strong);
  return li;
}

function wrapNested(ul) {
  const li = document.createElement('li');
  li.appendChild(ul);
  return li;
}

function leafItem(label, href) {
  const li = document.createElement('li');
  const i = document.createElement('i');
  i.className = 'fa fa-download w3-text-indigo';
  const a = document.createElement('a');
  a.setAttribute('download', '');
  a.href = href;
  a.textContent = ' ' + label;
  i.appendChild(a);
  li.appendChild(i);
  return li;
}
