/**
 * 渲染 models.html 对比表 + 开源模型专表
 */
(function () {
  if (!window.ModelsTableData) return;

  const { MODELS, TIER_LABEL } = ModelsTableData;

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function sweCell(swe) {
    if (!swe || swe === '—') return '—';
    return swe.indexOf('%') > -1 ? `<b>${esc(swe)}</b>` : esc(swe);
  }

  const mainTbody = document.getElementById('models-compare-tbody');
  if (mainTbody) {
    mainTbody.innerHTML = '';
    let lastTier = 0;
    MODELS.forEach((m) => {
      if (m.tier !== lastTier) {
        lastTier = m.tier;
        const tr = document.createElement('tr');
        tr.className = 'table-tier';
        const td = document.createElement('td');
        td.colSpan = 9;
        td.textContent = TIER_LABEL[m.tier] || '';
        tr.appendChild(td);
        mainTbody.appendChild(tr);
      }

      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td>${esc(m.n)}</td>` +
        `<td><a class="model-link" href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.name)}</a></td>` +
        `<td>${esc(m.co)}</td>` +
        `<td><span class="pill ${esc(m.pill)}">${esc(m.type)}</span></td>` +
        `<td>${esc(m.params)}</td>` +
        `<td>${sweCell(m.swe)}</td>` +
        `<td>${esc(m.mmlu)}</td>` +
        `<td class="td-released">${esc(m.released)}</td>` +
        `<td>${esc(m.note)}</td>`;
      mainTbody.appendChild(tr);
    });
  }

  const openTbody = document.getElementById('open-models-tbody');
  if (openTbody) {
    const openModels = MODELS.filter((m) => m.type === '开源');
    openTbody.innerHTML = '';
    if (!openModels.length) {
      openTbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;color:var(--muted)">暂无开源模型数据</td></tr>';
    } else {
      openModels.forEach((m) => {
        const tr = document.createElement('tr');
        tr.innerHTML =
          `<td><a class="model-link" href="${esc(m.url)}" target="_blank" rel="noopener">${esc(m.name)}</a></td>` +
          `<td>${esc(m.co)}</td>` +
          `<td>${esc(m.params)}</td>` +
          `<td>${sweCell(m.swe)}</td>` +
          `<td class="td-released">${esc(m.released)}</td>` +
          `<td>${esc(m.note)}</td>`;
        openTbody.appendChild(tr);
      });
    }
  }
})();
