(function () {
  const KEY = 'ai-training-theme';
  const PARAM = 't';
  const root = document.documentElement;

  function readFromUrl() {
    try {
      const p = new URLSearchParams(location.search);
      const t = p.get(PARAM) || p.get('theme');
      if (t === 'light' || t === 'dark') return t;
    } catch (_) {}
    return null;
  }

  function readSession() {
    try {
      const t = sessionStorage.getItem(KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (_) {}
    return null;
  }

  function readSaved() {
    const fromUrl = readFromUrl();
    if (fromUrl) return fromUrl;
    try {
      const t = localStorage.getItem(KEY);
      if (t === 'light' || t === 'dark') return t;
    } catch (_) {}
    const fromSession = readSession();
    if (fromSession) return fromSession;
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]*)'));
      const v = m ? decodeURIComponent(m[1]) : '';
      if (v === 'light' || v === 'dark') return v;
    } catch (_) {}
    return null;
  }

  function writeSaved(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (_) {}
    try {
      sessionStorage.setItem(KEY, theme);
    } catch (_) {}
    try {
      document.cookie = KEY + '=' + theme + ';path=/;max-age=31536000;SameSite=Lax';
    } catch (_) {}
  }

  function getPreferred() {
    return (
      readFromUrl() ||
      readSession() ||
      (function () {
        try {
          const t = localStorage.getItem(KEY);
          if (t === 'light' || t === 'dark') return t;
        } catch (_) {}
        return null;
      })() ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    );
  }

  function isLocalHtmlHref(href) {
    if (!href) return false;
    const h = href.trim();
    if (!h || h.startsWith('#') || /^https?:\/\//i.test(h) || h.startsWith('mailto:') || h.startsWith('tel:'))
      return false;
    const path = h.split('#')[0].split('?')[0];
    if (!path) return false;
    return path.endsWith('.html') || (!path.includes(':') && !path.includes('//'));
  }

  function withThemeHref(href, theme) {
    if (!href || !theme || !isLocalHtmlHref(href)) return href;
    const hashIdx = href.indexOf('#');
    const hash = hashIdx >= 0 ? href.slice(hashIdx) : '';
    const rest = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
    const qIdx = rest.indexOf('?');
    const path = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
    const params = new URLSearchParams(qIdx >= 0 ? rest.slice(qIdx + 1) : '');
    params.set(PARAM, theme);
    return path + '?' + params.toString() + hash;
  }

  function syncUrl(theme) {
    if (location.protocol !== 'file:' && location.protocol !== 'http:' && location.protocol !== 'https:') return;
    try {
      const url = new URL(location.href);
      url.searchParams.set(PARAM, theme);
      history.replaceState(null, '', url.href);
    } catch (_) {
      try {
        const q = PARAM + '=' + theme;
        const base = location.pathname.split('/').pop() || 'index.html';
        const hash = location.hash || '';
        history.replaceState(null, '', base + '?' + q + hash);
      } catch (_) {}
    }
  }

  function syncToggleButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isLight = theme === 'light';
    btn.setAttribute('aria-label', isLight ? '切换到深色模式' : '切换到浅色模式');
    btn.textContent = isLight ? '🌙' : '☀️';
    btn.title = isLight ? '深色模式' : '浅色模式';
  }

  function apply(theme, options) {
    if (theme !== 'light' && theme !== 'dark') return;
    const persist = !options || options.persist !== false;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    if (persist) writeSaved(theme);
    syncToggleButton(theme);
    if (options && options.syncUrl !== false) syncUrl(theme);
    if (options && options.patchLinks) patchAllLinks(theme);
  }

  function getCurrent() {
    const onRoot = root.getAttribute('data-theme');
    if (onRoot === 'light' || onRoot === 'dark') return onRoot;
    return getPreferred();
  }

  function toggle() {
    apply(getCurrent() === 'light' ? 'dark' : 'light', { syncUrl: true, patchLinks: true });
  }

  function patchAllLinks(theme) {
    const t = theme || getCurrent();
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!isLocalHtmlHref(href)) return;
      const next = withThemeHref(href, t);
      if (next !== href) a.setAttribute('href', next);
    });
  }

  function init() {
    const theme = getPreferred();
    apply(theme, { persist: true, syncUrl: !readFromUrl(), patchLinks: false });
    if (!readFromUrl()) syncUrl(theme);
  }

  init();

  window.AITheme = {
    KEY,
    PARAM,
    toggle,
    apply,
    syncToggleButton,
    get: getCurrent,
    init,
    withThemeHref,
    patchAllLinks,
    isLocalHtmlHref
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle')) {
      e.preventDefault();
      toggle();
      return;
    }
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!isLocalHtmlHref(href)) return;
    const next = withThemeHref(href, getCurrent());
    if (next !== href) a.setAttribute('href', next);
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    const theme = getCurrent();
    apply(theme, { persist: false, syncUrl: true, patchLinks: true });
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) apply(getPreferred(), { persist: false, syncUrl: true, patchLinks: true });
  });

  window.addEventListener('storage', (e) => {
    if (e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
      apply(e.newValue, { persist: false, syncUrl: true, patchLinks: true });
    }
  });
})();
