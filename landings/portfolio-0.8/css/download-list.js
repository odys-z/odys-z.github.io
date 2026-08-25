/**
 * Dynamically renders the "Portfolio for Android" / "Portfolio Synode" download
 * links based on files present in ./res/dist, described by a manifest JSON
 * (e.g. ./res/dist/manifest.json), generated at build/deploy time.
 *
 * Expected manifest shape:
 * {
 *   "version": "0.8",
 *   "apk":    { "file": "portfolio-0.8-android.apk" },
 *   "synode": { "file": "portfolio-0.8-synode.zip" }
 * }
 * Either "apk" or "synode" may be omitted if that build isn't published yet.
 */
function renderDownloadLinks(containerId, manifestUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch(manifestUrl, { cache: 'no-store' })
    .then(resp => {
      if (!resp.ok) throw new Error(`manifest fetch failed: ${resp.status}`);
      return resp.json();
    })
    .then(mf => {
      container.innerHTML = ''; // clear static placeholders

      if (mf.apk) {
        container.appendChild(
          buildDownloadEntry('download-apk', `./res/dist/${mf.apk.file}`,
            `Portfolio ${mf.version} for Android`)
        );
      }
      if (mf.synode) {
        container.appendChild(
          buildDownloadEntry('download-synode', `./res/dist/${mf.synode.file}`,
            `Portfolio ${mf.version} Synode`)
        );
      }
    })
    .catch(err => {
      console.error('renderDownloadLinks:', err);
      // leave container empty (or show a friendly fallback) rather than break the page
    });
}

function buildDownloadEntry(id, href, label) {
  const p = document.createElement('p');
  const i = document.createElement('i');
  i.className = 'fa fa-download w3-text-indigo';

  const a = document.createElement('a');
  a.id = id;
  a.setAttribute('download', '');
  a.href = href;
  a.textContent = label;

  i.appendChild(a);
  p.appendChild(i);
  return p;
}