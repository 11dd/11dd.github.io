/** 为含评测/分数的表格自动追加数据来源脚注 */
(function () {
  const AS_OF = '2026-05-16';
  const DEFAULT_SOURCES = [
    { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai' },
    { name: 'LMSYS Arena', url: 'https://chat.lmsys.org' },
    { name: 'SWE-bench', url: 'https://www.swebench.com' }
  ];

  const PAGE_SOURCES = {
    'models.html': [
      { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai' },
      { name: '各厂商官网', url: 'https://platform.openai.com/docs/models' }
    ],
    'benchmarks.html': [
      { name: 'SWE-bench', url: 'https://www.swebench.com' },
      { name: 'LMSYS Arena', url: 'https://chat.lmsys.org' }
    ],
    'coding.html': [{ name: 'SWE-bench', url: 'https://www.swebench.com' }]
  };

  function isScoreTable(table) {
    if (table.dataset.noSource) return false;
    const head = (table.querySelector('thead')?.innerText || '').toLowerCase();
    if (/mmlu|humaneval|分数|基准|elo|swe|评测|月薪|融资/.test(head)) return true;
    if (table.querySelector('tbody b, tbody strong')) return true;
    return false;
  }

  function appendNote(wrap, sources) {
    if (wrap.querySelector('.table-source-note')) return;
    const p = document.createElement('p');
    p.className = 'table-source-note';
    const links = sources
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`)
      .join(' · ');
    p.innerHTML = `<strong>数据说明：</strong>表中分数/价格为培训参考，核对日期 <time datetime="${AS_OF}">${AS_OF}</time>。请以 ${links} 及各厂商官网实时数据为准，不构成采购或投资建议。`;
    wrap.appendChild(p);
  }

  function init() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const sources = PAGE_SOURCES[page] || DEFAULT_SOURCES;

    document.querySelectorAll('.tbl-wrap').forEach((wrap) => {
      const table = wrap.querySelector('table');
      if (!table || wrap.closest('.glossary-table')) return;
      if (!isScoreTable(table)) return;
      appendNote(wrap, sources);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
