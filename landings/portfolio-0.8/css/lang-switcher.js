/**
 * Language selector for the Portfolio landing pages.
 *
 * Each language is a real page at its own URL (./, ./zh-CN/, ./zh-TW/ ...);
 * this script only renders links between them, so pages stay bookmarkable,
 * crawlable and work with the back button. To add a language:
 *   1. add its name to LANG_NAMES and its folder to SITE_LANGS below,
 *   2. copy a translated index.html into <dir>,
 *   3. add its <link rel="alternate" hreflang=...> to every page's <head>.
 *
 * Usage, in a page whose <html lang> is one of the codes below:
 *   <script src="../css/lang-switcher.js"></script>
 *   <script>renderLangSwitcher('top-bar', '../');</script>
 * where the second argument is the path from the page to the landing root.
 */
/** Display names of language codes, each written in its own language. */
const LANG_NAMES = {
  'en':    'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

/** Languages that have a landing page, in menu order, and their folders. */
const SITE_LANGS = [
  { code: 'en',    dir: '' },
  { code: 'zh-CN', dir: 'zh-CN/' },
  { code: 'zh-TW', dir: 'zh-TW/' },
];

function langDisplayName(code) {
  return LANG_NAMES[code] || code;
}

function renderLangSwitcher(barId, rootRel) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  rootRel = rootRel || './';
  const cur = (document.documentElement.lang || 'en').toLowerCase();
  const current = SITE_LANGS.find(l => l.code.toLowerCase() === cur) || SITE_LANGS[0];

  const dd = document.createElement('div');
  dd.className = 'w3-dropdown-click lang-switcher';
  dd.style.float = 'right';

  const btn = document.createElement('button');
  btn.className = 'w3-button w3-padding-large w3-hover-white';
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.title = 'Language / 语言 / 語言';
  btn.innerHTML = '<i class="fa fa-globe"></i> ';
  btn.appendChild(document.createTextNode(langDisplayName(current.code) + ' '));
  btn.insertAdjacentHTML('beforeend', '<i class="fa fa-caret-down"></i>');

  const menu = document.createElement('div');
  menu.className = 'w3-dropdown-content w3-bar-block w3-card-4';
  menu.style.right = '0';

  SITE_LANGS.forEach(l => {
    const a = document.createElement('a');
    a.className = 'w3-bar-item w3-button';
    a.href = rootRel + l.dir;
    a.lang = l.code;
    a.hreflang = l.code;
    a.textContent = langDisplayName(l.code);   // always the language's own name
    if (l === current) {
      a.setAttribute('aria-current', 'page');
      a.classList.add('w3-light-grey');
    }
    menu.appendChild(a);
  });

  const setOpen = (open) => {
    menu.classList.toggle('w3-show', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!menu.classList.contains('w3-show'));
  });
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  dd.append(btn, menu);
  bar.appendChild(dd);
}
