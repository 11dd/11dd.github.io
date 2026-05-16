/** 将 .tl 时间线按年代折叠为 details，默认仅展开最近一段 */
(function () {
  const ERAS = [
    { max: 1999, label: '1950—1999 · 符号 AI 与两次寒冬', open: false },
    { max: 2016, label: '2000—2016 · 深度学习复兴', open: false },
    { max: 2022, label: '2017—2022 · Transformer 与大模型前夜', open: false },
    { max: 2025, label: '2023—2025 · ChatGPT 爆发与 Agent', open: false },
    { max: 9999, label: '2026—当下 · 格局与趋势', open: true }
  ];

  function parseYear(text) {
    const m = String(text).match(/(\d{4})/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function eraForYear(y) {
    return ERAS.find((e) => y <= e.max) || ERAS[ERAS.length - 1];
  }

  function groupTimeline() {
    const tl = document.querySelector('.tl[data-group-timeline], .page-main .tl, .page-wrap > .tl');
    if (!tl || tl.dataset.grouped) return;

    const items = [...tl.querySelectorAll(':scope > .tl-item')];
    if (items.length < 6) return;

    const buckets = new Map();
    items.forEach((item) => {
      const yrEl = item.querySelector('.tl-yr');
      const y = parseYear(yrEl?.textContent || '');
      const era = eraForYear(y);
      if (!buckets.has(era.label)) buckets.set(era.label, { era, nodes: [] });
      buckets.get(era.label).nodes.push(item);
    });

    const frag = document.createDocumentFragment();
    ERAS.forEach((era) => {
      const bucket = buckets.get(era.label);
      if (!bucket?.nodes.length) return;
      const details = document.createElement('details');
      details.className = 'tl-era';
      if (era.open) details.open = true;
      const summary = document.createElement('summary');
      summary.textContent = era.label;
      summary.className = 'tl-era-summary';
      details.appendChild(summary);
      const inner = document.createElement('div');
      inner.className = 'tl-era-body';
      bucket.nodes.forEach((n) => {
        n.remove();
        inner.appendChild(n);
      });
      details.appendChild(inner);
      frag.appendChild(details);
    });

    tl.innerHTML = '';
    tl.appendChild(frag);
    tl.dataset.grouped = '1';
  }

  document.addEventListener('DOMContentLoaded', groupTimeline);
})();
