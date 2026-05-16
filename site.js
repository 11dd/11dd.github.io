/** 全站页面顺序：培训路径 + 页脚上一章/下一章（首页为 manual.html） */
const SITE_PAGES = [
  { file: 'manual.html', title: '培训首页' },
  { file: 'syllabus.html', title: '大纲·架构' },
  { file: 'history.html', title: '发展历史' },
  { file: 'models.html', title: '全部模型' },
  { file: 'infra.html', title: 'AI硬件' },
  { file: 'playbook-business.html', title: '业务培训手册' },
  { file: 'prompt.html', title: '提示词工程' },
  { file: 'coding.html', title: '编码工具' },
  { file: 'api-integration.html', title: 'API·网关' },
  { file: 'rag.html', title: '知识库RAG' },
  { file: 'finetune.html', title: '模型部署' },
  { file: 'industries.html', title: '行业应用' },
  { file: 'agents.html', title: 'Agent框架' },
  { file: 'mcp.html', title: 'MCP协议' },
  { file: 'media.html', title: '图像/视频' },
  { file: 'benchmarks.html', title: '评测·合规·职业' },
  { file: 'future.html', title: '未来趋势' },
  { file: 'startup.html', title: '创业·实操' }
];

const SITE_VERSION = '2026年5月版';

const PAGE_FOOTER_TITLES = {
  'syllabus.html': '培训大纲·架构',
  'api-integration.html': 'API·网关',
  'benchmarks.html': '评测·生产·合规·职业',
  'startup.html': '创业·实操'
};

function currentPageFile() {
  const p = location.pathname.split('/').pop();
  return p && p.endsWith('.html') ? p : 'index.html';
}

/** 移除页脚中过时的手写上一章/下一章，避免与 SITE_PAGES 冲突 */
function stripLegacyFooterNav() {
  document.querySelectorAll('footer p').forEach((p) => {
    const t = p.textContent || '';
    if (
      (t.includes('返回首页') || t.includes('返回培训首页')) &&
      (t.includes('下一章') || t.includes('←') || t.includes('→'))
    ) {
      p.remove();
    }
  });
}

function injectChapterFooter() {
  if (document.body.dataset.siteMode === 'portal') return;
  const footers = document.querySelectorAll('footer');
  if (!footers.length) return;
  const footer = footers[footers.length - 1];
  const cur = currentPageFile();
  const idx = SITE_PAGES.findIndex((x) => x.file === cur);
  if (idx < 0) return;

  const prev = idx > 0 ? SITE_PAGES[idx - 1] : null;
  const next = idx < SITE_PAGES.length - 1 ? SITE_PAGES[idx + 1] : null;

  let nav = footer.querySelector('.chapter-nav');
  if (!nav) {
    nav = document.createElement('p');
    nav.className = 'chapter-nav';
    nav.style.marginTop = '10px';
    footer.appendChild(nav);
  }
  const th = window.AITheme?.withThemeHref?.bind(window.AITheme) || ((h) => h);
  const parts = [
    `<a href="${th('manual.html')}">← 返回培训首页</a>`,
    `<a href="${th('index.html')}">🧭 工具导航</a>`
  ];
  if (prev) parts.push(`<a href="${th(prev.file)}">← ${prev.title}</a>`);
  if (next) parts.push(`<a href="${th(next.file)}">${next.title} →</a>`);
  nav.innerHTML = parts.join(' &nbsp;|&nbsp; ');

  const title = PAGE_FOOTER_TITLES[cur];
  const firstP = footer.querySelector('p:not(.chapter-nav)');
  if (firstP && title && !firstP.textContent.includes(title)) {
    firstP.textContent = `AI大模型全景培训手册 · ${title} · ${SITE_VERSION}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.siteMode === 'portal') return;
  stripLegacyFooterNav();
  injectChapterFooter();
  window.AITheme?.patchAllLinks?.();
});
