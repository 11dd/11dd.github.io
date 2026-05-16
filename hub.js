/**
 * AI 工具入口合集：分区 Tab、筛选、入口标签与网址展示
 */
(function () {
  if (!document.body.dataset.hubPage) return;

  const main = document.querySelector('.page-main');
  const sidebar = document.querySelector('.hub-sidebar');
  const tabs = document.querySelector('.hub-zone-tabs');
  const filterInput = document.querySelector('#hub-filter');
  if (!main) return;

  const panelMode = !!document.querySelector('.page-hub-layout--horizontal');
  const zones = Array.from(main.querySelectorAll('.hub-zone'));
  const cats = Array.from(main.querySelectorAll('.hub-cat'));

  function countryForEntry(href, region, catEl) {
    const isCn = region === 'cn' || detectRegion(href, catEl) === 'cn';
    return window.HubCountry?.countryFromHref(href, isCn) || (isCn ? 'CN' : 'UN');
  }

  function regionAria(href, region, catEl) {
    const cc = countryForEntry(href, region, catEl);
    return window.HubCountry?.countryLabel(cc) || (region === 'cn' ? '中国' : '国际');
  }

  function applyRegionTag(tag, region, href, catEl) {
    if (!tag) return;
    const cc = countryForEntry(href, region, catEl);
    const icon = window.HubCountry?.flagEmoji(cc) || '🌐';
    const label = window.HubCountry?.countryLabel(cc) || '国际';
    tag.textContent = icon;
    tag.setAttribute('aria-label', label);
    tag.title = label;
    tag.dataset.country = cc;
  }

  /** 常见国内主域名（不含 .cn 后缀的也算国内入口） */
  const CN_HOST_HINTS = [
    'aliyun.com', 'aliyuncs.com', 'tencent.com', 'qq.com', 'baidu.com', 'bytedance.com',
    'volcengine.com', 'doubao.com', 'moonshot.cn', 'xfyun.cn', 'iflytek.com', 'tiangong.cn',
    'coze.cn', 'feishu.cn', 'dingtalk.com', 'wps.cn', 'huaweicloud.com', '10086.cn',
    'youdao.com', 'sohu.com', 'langboat.com', 'deeplang.ai', 'lenovo.com.cn', 'modelbest.cn',
    'baichuan-ai.com', 'stepfun.com', 'sensetime.com', 'hailuoai.com', 'zhihu.com',
    'metaso.cn', 'jd.com', 'yanxi.jd.com', 'lingyiwanwu.com', 'mobvoi.com', 'xiaoice.com',
    'kuaishou.com', 'jianying.com', 'capcut.cn', 'siliconflow.cn', 'bigmodel.cn',
    'fastgpt.in', 'ragflow.io', 'chatexcel.com', 'autodl.com', 'virtaicloud.com',
    'mockplus.cn', 'js.design', 'yuque.com', 'dida365.com', 'ibiling.cn', 'wawawriter.com',
    'caiyunai.com', 'sobot.com', 'qiyukf.com', 'mokahr.com', 'beisen.com', 'taobao.com',
    'chuangyi.taobao.com', 'hunyuan.tencent.com', 'jiutian.10086.cn', 'iflyrec.com',
    'tongyi.aliyun.com', 'yiyan.baidu.com', 'chatglm.cn', 'yuanbao.tencent.com',
    'chat.sensetime.com', 'zhida.zhihu.com', 'n.cn', 'platform.moonshot.cn',
    'chat.baidu.com', 'xueshu.baidu.com', 'whee.com', 'vidu.studio', 'pixverse.ai',
    'zenvideo.qq.com', 'moyin.com', 'guiji.cn', 'tianpuyue.cn', 'laihua.com', 'bilibili.com',
    'mastergo.com', 'pixso.cn', 'lanhuapp.com', 'comate.baidu.com', 'codegeex.cn',
    'marscode.cn', 'trae.cn', 'modelscope.cn', 'aistudio.baidu.com', 'fit2cloud.com',
    'shimo.im', 'islide.cc', 'aippt.cn', 'fanruan.com', 'sensorsdata.cn', 'suanli.cn',
    'oceanengine.com', 'ad.qq.com', 'xiaohongshu.com', 'icourse163.org', 'xuetangx.com',
    'tianchi.aliyun.com', 'pkulaw.com', 'wkinfo.com.cn', 'iwencai.com', 'wind.com.cn',
    'superclueai.com', 'opencompass.org.cn', 'baai.ac.cn', 'waytoagi.com', 'aishort.top',
    'maxai.me', 'udesk.cn', 'easemob.com', 'matrix.tencent.com', 'dun.163.com',
  ];

  function isExternalHref(href) {
    return href && /^https?:\/\//i.test(href.trim());
  }

  function detectRegion(href, catEl) {
    if (!isExternalHref(href)) return 'global';
    if (catEl?.classList.contains('hub-cat--ranked')) {
      if (catEl.id === 'cn-chat') return 'cn';
      if (catEl.id === 'global-chat') return 'global';
    }
    try {
      const host = new URL(href).hostname.toLowerCase();
      if (host.endsWith('.cn')) return 'cn';
      if (CN_HOST_HINTS.some((d) => host === d || host.endsWith('.' + d))) return 'cn';
      return 'global';
    } catch {
      return 'global';
    }
  }

  function displayHost(href) {
    try {
      const u = new URL(href);
      let path = u.pathname;
      if (path === '/' || path === '') return u.hostname;
      if (path.length > 28) path = path.slice(0, 26) + '…';
      return u.hostname + path;
    } catch {
      return href;
    }
  }

  function fullHref(href) {
    return href;
  }

  function ensureTag(parent, region, beforeEl, href, catEl) {
    let tag = parent.querySelector(':scope > .hub-tag, .hub-name-row .hub-tag, .hub-pill-top .hub-tag');
    if (!tag) {
      tag = document.createElement('span');
      if (beforeEl) {
        const row = document.createElement('span');
        row.className = beforeEl.classList.contains('hub-pill-name') ? 'hub-pill-top' : 'hub-name-row';
        beforeEl.parentNode.insertBefore(row, beforeEl);
        row.appendChild(tag);
        row.appendChild(beforeEl);
      } else {
        parent.insertBefore(tag, parent.firstChild);
      }
    }
    tag.className = 'hub-tag hub-tag--' + region;
    applyRegionTag(tag, region, href, catEl);
    return tag;
  }

  /** 将 pill 布局统一为与 cn-chat / global-chat 相同的 hub-link 卡片网格 */
  function normalizePillGrids() {
    main.querySelectorAll('.hub-pill-grid').forEach((grid) => {
      const cat = grid.closest('.hub-cat');
      grid.classList.remove('hub-pill-grid');
      grid.classList.add('hub-link-grid');
      const pills = Array.from(grid.querySelectorAll(':scope > a.hub-pill'));
      pills.forEach((pill, index) => {
        const nameText = pill.querySelector('.hub-pill-name')?.textContent?.trim() || '';
        const descText = pill.querySelector('.hub-pill-desc')?.textContent?.trim() || '';
        const link = document.createElement('a');
        link.className = 'hub-link';
        link.href = pill.getAttribute('href') || '#';
        const target = pill.getAttribute('target');
        const rel = pill.getAttribute('rel');
        if (target) link.target = target;
        if (rel) link.rel = rel;

        const rank = document.createElement('span');
        rank.className = 'hub-rank';
        rank.textContent = String(index + 1);

        const body = document.createElement('span');
        body.className = 'hub-body';

        const name = document.createElement('span');
        name.className = 'hub-name';
        name.textContent = nameText;
        body.appendChild(name);

        if (descText) {
          const desc = document.createElement('span');
          desc.className = 'hub-desc';
          desc.textContent = descText;
          body.appendChild(desc);
        }

        link.appendChild(rank);
        link.appendChild(body);
        pill.replaceWith(link);
      });
      if (cat) cat.classList.add('hub-cat--ranked');
    });
  }

  function applyEntryMeta(body, href, cat, region) {
    if (!body || !window.HubMeta) return;
    const meta = HubMeta.resolve(href, cat?.id || '', region);
    let tipEl = body.querySelector('.hub-tip');
    if (meta.tip) {
      if (!tipEl) {
        tipEl = document.createElement('span');
        tipEl.className = 'hub-tip';
        const desc = body.querySelector('.hub-desc');
        if (desc) desc.after(tipEl);
        else body.insertBefore(tipEl, body.querySelector('.hub-url, .hub-go'));
      }
      tipEl.textContent = meta.tip;
    } else if (tipEl) {
      tipEl.remove();
    }

    let chips = body.querySelector('.hub-chips');
    if (!meta.chips.length) {
      chips?.remove();
      return;
    }
    if (!chips) {
      chips = document.createElement('span');
      chips.className = 'hub-chips';
      const anchor = body.querySelector('.hub-url') || body.querySelector('.hub-go');
      body.insertBefore(chips, anchor);
    }
    chips.replaceChildren();
    meta.chips.forEach(({ text, kind }) => {
      const chip = document.createElement('span');
      chip.className = 'hub-chip' + (kind ? ' hub-chip--' + kind : '');
      chip.textContent = text;
      chips.appendChild(chip);
    });
  }

  function enrichEntry(a) {
    const href = a.getAttribute('href');
    if (!href) return;
    const cat = a.closest('.hub-cat');
    const region = detectRegion(href, cat);
    const host = displayHost(href);
    const full = fullHref(href);
    const cc = countryForEntry(href, region, cat);

    a.dataset.region = region;
    a.dataset.country = cc;
    a.title = '点击访问：' + full;
    a.setAttribute('aria-label', regionAria(href, region, cat) + ' · ' + (a.querySelector('.hub-name, .hub-pill-name')?.textContent || '') + ' · ' + host);

    if (a.classList.contains('hub-link')) {
      const body = a.querySelector('.hub-body');
      if (!body) return;
      const name = body.querySelector('.hub-name');
      if (name && !name.parentElement?.classList.contains('hub-name-row')) {
        ensureTag(body, region, name, href, cat);
      } else if (name) {
        ensureTag(name.parentElement, region, null, href, cat);
      }
      let urlEl = body.querySelector('.hub-url');
      if (!urlEl) {
        urlEl = document.createElement('span');
        urlEl.className = 'hub-url';
        body.appendChild(urlEl);
      }
      urlEl.textContent = host;
      let go = body.querySelector('.hub-go');
      if (!go) {
        go = document.createElement('span');
        go.className = 'hub-go';
        body.appendChild(go);
      }
      go.textContent = '↗ 点击访问官网';
      applyEntryMeta(body, href, cat, region);
    } else if (a.classList.contains('hub-pill')) {
      const name = a.querySelector('.hub-pill-name');
      if (name && !name.parentElement?.classList.contains('hub-pill-top')) {
        ensureTag(a, region, name, href, cat);
      } else {
        const top = a.querySelector('.hub-pill-top');
        if (top) {
          let tag = top.querySelector('.hub-tag');
          if (!tag) tag = ensureTag(top, region, null, href, cat);
          else {
            tag.className = 'hub-tag hub-tag--' + region;
            applyRegionTag(tag, region, href, cat);
          }
        }
      }
      let urlEl = a.querySelector('.hub-pill-url');
      if (!urlEl) {
        urlEl = document.createElement('span');
        urlEl.className = 'hub-pill-url';
        a.appendChild(urlEl);
      }
      urlEl.textContent = host;
      let go = a.querySelector('.hub-go');
      if (!go) {
        go = document.createElement('span');
        go.className = 'hub-go';
        a.appendChild(go);
      }
      go.textContent = '↗ 新标签打开';
    }
  }

  /** 按 HubHeat 热度重排各分类内入口，并刷新序号 */
  function sortCategoriesByHeat() {
    if (!window.HubHeat) return;
    main.querySelectorAll('.hub-cat').forEach((cat) => {
      const grid = cat.querySelector('.hub-link-grid');
      if (!grid) return;
      const catId = cat.id;
      const links = Array.from(grid.querySelectorAll(':scope > a.hub-link'));
      links.forEach((link, i) => {
        if (link.dataset.orderFallback == null) link.dataset.orderFallback = String(i);
      });
      links.sort((a, b) => {
        const sa = HubHeat.score(catId, a.getAttribute('href') || '');
        const sb = HubHeat.score(catId, b.getAttribute('href') || '');
        if (sb !== sa) return sb - sa;
        return Number(a.dataset.orderFallback) - Number(b.dataset.orderFallback);
      });
      links.forEach((link, i) => {
        const rank = link.querySelector('.hub-rank');
        if (rank) rank.textContent = String(i + 1);
        grid.appendChild(link);
      });
    });
  }

  normalizePillGrids();
  sortCategoriesByHeat();

  main.querySelectorAll('a.hub-link, a.hub-pill').forEach((a) => {
    const href = a.getAttribute('href');
    if (!isExternalHref(href)) {
      a.remove();
      return;
    }
    enrichEntry(a);
  });

  function setActiveZone(zoneId) {
    if (tabs) {
      tabs.querySelectorAll('[data-zone]').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.zone === zoneId);
      });
    }
    if (sidebar) {
      sidebar.querySelectorAll('.toc-group-label a[data-zone]').forEach((a) => {
        a.classList.toggle('is-active', a.dataset.zone === zoneId);
      });
    }
  }

  function scrollToEl(el) {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function showZonePanel(zoneId, opts = {}) {
    zones.forEach((z) => {
      z.classList.toggle('hub-zone--panel-active', z.id === zoneId);
    });
    setActiveZone(zoneId);
    if (filterInput) {
      filterInput.value = '';
    }
    cats.forEach((c) => c.classList.remove('hub-cat--hidden'));
    zones.forEach((z) => z.classList.remove('hub-zone--hidden'));
    try {
      history.replaceState(null, '', '#' + zoneId);
    } catch (_) {}
    if (!opts.skipScroll) {
      const zoneHead = main.querySelector('#' + zoneId + ' .hub-zone-head');
      const scrollTarget = zoneHead || main.querySelector('#' + zoneId);
      if (scrollTarget) {
        const top = scrollTarget.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }
  }

  function onZoneNavClick(e) {
    const btn = e.target.closest('[data-zone]');
    if (!btn) return;
    if (!tabs?.contains(btn) && !sidebar?.contains(btn)) return;
    if (btn.tagName === 'A' && btn.getAttribute('href')?.startsWith('#')) {
      const id = btn.dataset.zone || btn.getAttribute('href').slice(1);
      const zone = main.querySelector('#' + id);
      if (zone) {
        if (panelMode) {
          e.preventDefault();
          showZonePanel(id);
        } else {
          e.preventDefault();
          scrollToEl(zone);
        }
      }
    }
  }

  tabs?.addEventListener('click', onZoneNavClick);
  sidebar?.addEventListener('click', onZoneNavClick);

  if (!panelMode && zones.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveZone(visible.target.id);
      },
      { rootMargin: '-18% 0px -58% 0px', threshold: [0, 0.08, 0.2] }
    );
    zones.forEach((z) => io.observe(z));
  }

  if (panelMode) {
    document.querySelector('.portal-home-jumps')?.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#zone-"]');
      if (!a) return;
      e.preventDefault();
      const zid = a.getAttribute('href').slice(1);
      if (main.querySelector('#' + zid)) showZonePanel(zid);
    });

    document.querySelector('.hub-quick')?.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const tid = a.getAttribute('href').slice(1);
      if (!tid || tid.startsWith('zone-')) return;
      const target = document.getElementById(tid);
      const zoneEl = target?.closest('.hub-zone');
      if (zoneEl?.id) {
        e.preventDefault();
        showZonePanel(zoneEl.id, { skipScroll: true });
        requestAnimationFrame(() => scrollToEl(target));
      }
    });

    const hash = location.hash.slice(1);
    let initialZone = 'zone-chat';
    if (hash.startsWith('zone-') && main.querySelector('#' + hash)) {
      initialZone = hash;
    } else if (hash) {
      const el = document.getElementById(hash);
      const z = el?.closest('.hub-zone');
      if (z?.id) initialZone = z.id;
    }
    showZonePanel(initialZone, { skipScroll: true });
    if (hash && !hash.startsWith('zone-')) {
      const el = document.getElementById(hash);
      if (el && el.closest('.hub-zone')?.id === initialZone) {
        requestAnimationFrame(() => scrollToEl(el));
      }
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      const q = filterInput.value.trim().toLowerCase();
      if (panelMode) {
        const activeZone = main.querySelector('.hub-zone--panel-active');
        const scopeCats = activeZone ? Array.from(activeZone.querySelectorAll('.hub-cat')) : cats;
        scopeCats.forEach((cat) => {
          const hit = !q || cat.textContent.toLowerCase().includes(q);
          cat.classList.toggle('hub-cat--hidden', !hit);
        });
        return;
      }
      cats.forEach((cat) => {
        const hit = !q || cat.textContent.toLowerCase().includes(q);
        cat.classList.toggle('hub-cat--hidden', !hit);
      });
      zones.forEach((zone) => {
        const visible = zone.querySelectorAll('.hub-cat:not(.hub-cat--hidden)').length > 0;
        zone.classList.toggle('hub-zone--hidden', !visible);
      });
    });
  }
})();
