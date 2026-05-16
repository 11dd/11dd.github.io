const NAV_GROUPS = [
  {
    id: 'intro',
    label: '入门',
    links: [
      ['index.html', 'nav-hub', '工具导航'],
      ['manual.html', 'nav-home', '培训首页'],
      ['syllabus.html', 'nav-syllabus', '大纲·架构']
    ]
  },
  {
    id: 'cog',
    label: '认知',
    links: [
      ['history.html', 'nav-history', '历史'],
      ['models.html', 'nav-models', '模型'],
      ['infra.html', 'nav-infra', '硬件']
    ]
  },
  {
    id: 'skill',
    label: '技能',
    links: [
      ['playbook-business.html', 'nav-playbook', '业务'],
      ['prompt.html', 'nav-prompt', '提示词'],
      ['coding.html', 'nav-coding', '编码'],
      ['api-integration.html', 'nav-api', 'API·网关'],
      ['rag.html', 'nav-rag', 'RAG'],
      ['finetune.html', 'nav-finetune', '部署']
    ]
  },
  {
    id: 'app',
    label: '应用',
    links: [
      ['industries.html', 'nav-industries', '行业'],
      ['agents.html', 'nav-agents', 'Agent'],
      ['mcp.html', 'nav-mcp', 'MCP'],
      ['media.html', 'nav-media', '多模态']
    ]
  },
  {
    id: 'adv',
    label: '进阶',
    links: [
      ['benchmarks.html', 'nav-benchmarks', '评测·合规·职业'],
      ['future.html', 'nav-future', '趋势'],
      ['startup.html', 'nav-startup', '创业·实操']
    ]
  }
];

const NAV_PAGE_IDS = {
  'hub.html': 'nav-hub',
  'index.html': 'nav-hub',
  'manual.html': 'nav-home',
  'syllabus.html': 'nav-syllabus',
  'history.html': 'nav-history',
  'models.html': 'nav-models',
  'infra.html': 'nav-infra',
  'playbook-business.html': 'nav-playbook',
  'prompt.html': 'nav-prompt',
  'coding.html': 'nav-coding',
  'api-integration.html': 'nav-api',
  'rag.html': 'nav-rag',
  'finetune.html': 'nav-finetune',
  'industries.html': 'nav-industries',
  'agents.html': 'nav-agents',
  'mcp.html': 'nav-mcp',
  'media.html': 'nav-media',
  'benchmarks.html': 'nav-benchmarks',
  'future.html': 'nav-future',
  'startup.html': 'nav-startup'
};

const NAV_HTML_PORTAL = `
<nav class="topnav topnav--portal" id="topnav">
  <a href="index.html" class="logo logo--portal">🧭 AI工具导航 · 全景</a>
  <span class="nav-portal-spacer" aria-hidden="true"></span>
  <a href="manual.html" class="nav-portal-cta" id="nav-training-entry">📚 培训手册入口</a>
  <div class="nav-actions nav-actions--portal">
    <button type="button" class="nav-icon-btn" id="theme-toggle" title="切换主题" aria-label="切换主题">☀️</button>
  </div>
</nav>`;

const NAV_HTML_TRAINING = `
<nav class="topnav" id="topnav">
  <a href="index.html" class="logo">🤖 AI大模型全景</a>
  <button type="button" class="nav-toggle" id="nav-toggle" aria-label="打开菜单">☰</button>
  <div class="nav-groups" id="nav-groups">
    ${NAV_GROUPS.map(
      (g) => `
      <div class="nav-group" data-chapter="${g.id}">
        ${g.links.map(([href, id, text]) => `<a href="${href}" id="${id}">${text}</a>`).join('')}
      </div>`
    ).join('')}
  </div>
  <div class="nav-actions">
    <button type="button" class="nav-icon-btn" id="theme-toggle" title="切换主题" aria-label="切换主题">☀️</button>
    <button type="button" class="nav-icon-btn" id="nav-search-btn" title="搜索 (⌘K)">🔍</button>
  </div>
</nav>
<div class="search-panel" id="search-panel">
  <input type="search" id="search-input" placeholder="搜索模块：RAG、API、合规…" autocomplete="off" />
  <div id="search-results"></div>
</div>`;

document.addEventListener('DOMContentLoaded', () => {
  const portal = document.body.dataset.siteMode === 'portal';
  const wrap = document.createElement('div');
  wrap.innerHTML = portal ? NAV_HTML_PORTAL : NAV_HTML_TRAINING;
  while (wrap.firstChild) document.body.insertBefore(wrap.firstChild, document.body.firstChild);

  const page = location.pathname.split('/').pop() || 'index.html';
  const navId = NAV_PAGE_IDS[page];
  const activeLink = navId ? document.getElementById(navId) : null;
  if (activeLink) activeLink.classList.add('active');

  window.AITheme?.syncToggleButton?.(window.AITheme.get());
  window.AITheme?.patchAllLinks?.();

  const navToggle = document.getElementById('nav-toggle');
  const navGroups = document.getElementById('nav-groups');
  if (navToggle && navGroups) {
    const syncNavOpen = () => {
      const open = navGroups.classList.contains('open');
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    };
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navGroups.classList.toggle('open');
      syncNavOpen();
    });
    navGroups.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navGroups.classList.remove('open');
        syncNavOpen();
      });
    });
    document.addEventListener('click', (e) => {
      if (!navGroups.classList.contains('open')) return;
      if (e.target.closest('#nav-groups') || e.target.closest('#nav-toggle')) return;
      navGroups.classList.remove('open');
      syncNavOpen();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1100 && navGroups.classList.contains('open')) {
        navGroups.classList.remove('open');
        syncNavOpen();
      }
    });
  }
});
