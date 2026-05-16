document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('nav-search-btn');
  const panel = document.getElementById('search-panel');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!btn || !panel || !input || !results || typeof SEARCH_INDEX === 'undefined') return;

  const render = (q) => {
    const s = q.trim().toLowerCase();
    const list = !s
      ? SEARCH_INDEX.slice(0, 12)
      : SEARCH_INDEX.filter(
          (x) =>
            x.t.toLowerCase().includes(s) ||
            x.k.toLowerCase().includes(s) ||
            x.u.toLowerCase().includes(s)
        );
    const th = window.AITheme?.withThemeHref?.bind(window.AITheme) || ((h) => h);
    results.innerHTML = list.length
      ? list
          .map(
            (x) =>
              `<a class="search-hit" href="${th(x.u)}"><strong>${x.t}</strong><span>${x.k}</span></a>`
          )
          .join('')
      : '<div class="search-empty">无匹配，试试「RAG」「API」「合规」</div>';
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      input.focus();
      render('');
    }
  });

  input.addEventListener('input', () => render(input.value));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) input.focus();
    }
    if (e.key === 'Escape') panel.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
  });
});
