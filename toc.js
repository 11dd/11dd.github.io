/** 长页自动侧栏目录：page-wrap 内 ≥2 个 .sec-title 且尚无 sticky-toc 时启用 */
(function () {
  function slugify(text, index) {
    return (
      'sec-' +
      String(index + 1) +
      '-' +
      text
        .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 24)
        .toLowerCase() || index
    );
  }

  function initAutoToc() {
    if (document.body.dataset.noAutoToc === 'true') return;
    const wrap = document.querySelector('.page-wrap:not(.page-cols)');
    if (!wrap || wrap.querySelector('.sticky-toc')) return;

    const titles = [...wrap.querySelectorAll('.sec-title')];
    if (titles.length < 2) return;

    titles.forEach((el, i) => {
      if (!el.id) el.id = slugify(el.textContent.trim(), i);
    });

    const toc = document.createElement('nav');
    toc.className = 'sticky-toc';
    toc.setAttribute('aria-label', '本章目录');
    toc.innerHTML =
      '<h5>本章目录</h5>' +
      titles
        .map((t) => {
          const label = t.textContent.trim().replace(/\s+/g, ' ');
          const short = label.length > 22 ? label.slice(0, 22) + '…' : label;
          return `<a href="#${t.id}" title="${label.replace(/"/g, '&quot;')}">${short}</a>`;
        })
        .join('');

    const main = document.createElement('div');
    main.className = 'page-main';
    while (wrap.firstChild) main.appendChild(wrap.firstChild);

    wrap.classList.add('page-cols');
    wrap.appendChild(toc);
    wrap.appendChild(main);
  }

  document.addEventListener('DOMContentLoaded', initAutoToc);
})();
