/**
 * 入口卡片补充信息：访问、费用、形态、一句话亮点
 */
(function (global) {
  function entryKey(href) {
    try {
      const u = new URL(href);
      const host = u.hostname.toLowerCase().replace(/^www\./, '');
      let path = u.pathname.replace(/\/$/, '') || '';
      if (!path || path === '/') return host;
      return host + path;
    } catch {
      return '';
    }
  }

  function hostOnly(href) {
    try {
      return new URL(href).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  const PRICE_LABEL = {
    free: '免费',
    freemium: '免费+付费',
    paid: '付费订阅',
    enterprise: '企业定价',
    metered: '按量计费',
  };

  const ACCESS_LABEL = {
    cn: '国内直连',
    proxy: '需科学上网',
    global: '国内/全球可用',
  };

  /** 分类默认推断（未单独配置的主机名） */
  const CAT_DEFAULTS = {
    'cn-chat': { price: 'freemium', form: ['Web', 'App'], access: 'cn' },
    'global-chat': { price: 'freemium', form: ['Web'], access: 'proxy' },
    multimodal: { price: 'freemium', form: ['Web', '多模态'] },
    'ai-search': { price: 'freemium', form: ['Web', '搜索'] },
    media: { price: 'freemium', form: ['Web', '生成'] },
    audio: { price: 'freemium', form: ['Web', '生成'] },
    'video-edit': { price: 'freemium', form: ['Web', '剪辑'] },
    '3d-game': { price: 'freemium', form: ['Web', '3D'] },
    'design-ui': { price: 'freemium', form: ['Web', '设计'] },
    coding: { price: 'freemium', form: ['IDE', '插件'] },
    workflow: { price: 'freemium', form: ['低代码', 'API'] },
    'api-dev': { price: 'metered', form: ['API', '控制台'] },
    opensource: { price: 'free', form: ['本地', '开源'] },
    'model-host': { price: 'metered', form: ['API'] },
    'gpu-cloud': { price: 'metered', form: ['云 GPU'] },
    office: { price: 'freemium', form: ['Web', '插件'] },
    meeting: { price: 'freemium', form: ['Web', 'App'] },
    translate: { price: 'freemium', form: ['Web', '插件'] },
    data: { price: 'freemium', form: ['Web', 'BI'] },
    'email-eff': { price: 'paid', form: ['Web', 'App'] },
    pkm: { price: 'freemium', form: ['App', '插件'] },
    crm: { price: 'enterprise', form: ['SaaS'] },
    hr: { price: 'enterprise', form: ['SaaS'] },
    marketing: { price: 'freemium', form: ['Web', '营销'] },
    'writing-long': { price: 'freemium', form: ['Web', '创作'] },
    edu: { price: 'freemium', form: ['Web', '学习'] },
    vertical: { price: 'enterprise', form: ['行业方案'] },
    trust: { price: 'freemium', form: ['Web', 'API'] },
    compare: { price: 'free', form: ['榜单', '评测'] },
    'prompt-community': { price: 'free', form: ['社区', '插件'] },
  };

  /**
   * @type {Record<string, { access?: string, price?: string, form?: string[], tip?: string }>}
   */
  const HOST = {
    'doubao.com': { access: 'cn', tip: '字节系 · 免费额度高' },
    'chat.deepseek.com': { access: 'global', tip: '推理与代码性价比高' },
    'tongyi.aliyun.com': { access: 'cn', form: ['Web', 'App', 'API'], tip: '通义全系 · 企业生态' },
    'kimi.moonshot.cn': { access: 'cn', tip: '长文档 · 联网搜索' },
    'yiyan.baidu.com': { access: 'cn', tip: '文心大模型 · 搜索联动' },
    'chatglm.cn': { access: 'cn', tip: 'GLM 系列对话' },
    'yuanbao.tencent.com': { access: 'cn', tip: '腾讯混元 · 微信生态' },
    'xinghuo.xfyun.cn': { access: 'cn', tip: '语音与办公场景强' },
    'metaso.cn': { access: 'cn', form: ['Web', '学术模式'], tip: '国产 AI 搜索标杆' },
    'coze.cn': { access: 'cn', form: ['Web', 'Bot'], tip: '零代码 Agent 搭建' },
    'chatgpt.com': { access: 'proxy', price: 'freemium', form: ['Web', 'App', 'API'], tip: '生态最全的通用助手' },
    'claude.ai': { access: 'proxy', form: ['Web', 'App', 'API'], tip: '长文与代码表现突出' },
    'gemini.google.com': { access: 'proxy', form: ['Web', 'App'], tip: 'Google 多模态旗舰' },
    'copilot.microsoft.com': { access: 'proxy', form: ['Web', 'Edge'], tip: '微软 · Office/Bing 联动' },
    'grok.com': { access: 'proxy', tip: 'xAI · X 平台数据' },
    'perplexity.ai': { access: 'proxy', form: ['Web', 'App'], tip: '带引用来源的 AI 搜索' },
    'poe.com': { access: 'proxy', tip: '多模型聚合对话' },
    'chat.mistral.ai': { access: 'proxy', tip: '欧洲开源旗舰 Le Chat' },
    'platform.openai.com': { price: 'metered', form: ['API', 'Playground'], access: 'proxy' },
    'console.anthropic.com': { price: 'metered', form: ['API'], access: 'proxy' },
    'notebooklm.google.com': { access: 'proxy', tip: '文档研读 · 音频概览' },
    'cursor.com': { price: 'freemium', form: ['IDE'], access: 'proxy', tip: 'AI 原生编程 IDE' },
    'github.com/features/copilot': { price: 'paid', form: ['IDE 插件'], access: 'proxy' },
    'codeium.com/windsurf': { price: 'freemium', form: ['IDE'], access: 'proxy' },
    'dify.ai': { access: 'global', form: ['开源', '私有部署', 'API'], tip: 'RAG / 工作流标杆' },
    'n8n.io': { price: 'freemium', form: ['工作流', '自托管'], access: 'proxy' },
    'ollama.com': { price: 'free', form: ['本地 CLI'], access: 'global', tip: '本机一键跑开源模型' },
    'huggingface.co': { price: 'freemium', form: ['模型库', 'Spaces'], access: 'proxy' },
    'midjourney.com': { price: 'paid', form: ['Discord', 'Web'], access: 'proxy', tip: '美学向图像生成' },
    'openai.com/sora': { price: 'paid', form: ['Web'], access: 'proxy', tip: 'OpenAI 视频生成' },
    'runwayml.com': { price: 'freemium', form: ['Web'], access: 'proxy' },
    'klingai.kuaishou.com': { access: 'cn', tip: '可灵 · 国产视频生成' },
    'jimeng.jianying.com': { access: 'cn', tip: '即梦 · 剪映系创作' },
    'suno.com': { price: 'freemium', access: 'proxy', tip: 'AI 音乐生成头部' },
    'elevenlabs.io': { price: 'freemium', form: ['Web', 'API'], access: 'proxy' },
    'deepl.com': { price: 'freemium', form: ['Web', 'App', 'API'], access: 'proxy', tip: '欧语翻译质量标杆' },
    'fanyi.baidu.com': { access: 'cn', tip: '中文翻译 · 同传' },
    'notion.so/product/ai': { price: 'paid', form: ['Web', 'App'], access: 'proxy' },
    'gamma.app': { price: 'freemium', form: ['Web'], access: 'proxy', tip: 'AI 生成演示文稿' },
    'wps.cn': { access: 'cn', form: ['App', '插件'], tip: '国产办公套件 AI' },
    'feishu.cn': { access: 'cn', form: ['Web', 'App'], tip: '企业协作 + 智能伙伴' },
    'lmarena.ai': { price: 'free', access: 'proxy', tip: '盲测排行榜 · 选模型参考' },
    'cloud.siliconflow.cn': { price: 'metered', form: ['API'], access: 'cn', tip: '国内多模型 API 聚合' },
    'bailian.console.aliyun.com': { price: 'metered', form: ['控制台', 'API'], access: 'cn' },
    'platform.deepseek.com': { price: 'metered', form: ['API'], access: 'global' },
    'openrouter.ai': { price: 'metered', form: ['API'], access: 'proxy', tip: '一个 Key 调多模型' },
    'autodl.com': { price: 'metered', form: ['GPU 租用'], access: 'cn', tip: '国内深度学习租卡' },
    'v0.dev': { price: 'freemium', form: ['Web'], access: 'proxy', tip: 'Vercel · React UI 生成' },
    'figma.com/ai': { price: 'paid', form: ['设计工具'], access: 'proxy' },
    'immersivetranslate.com': { price: 'freemium', form: ['浏览器插件'], access: 'global', tip: '双语对照阅读' },
    'monica.im': { price: 'freemium', form: ['浏览器插件'], access: 'global' },
    'character.ai': { access: 'proxy', tip: '角色扮演对话社区' },
    'huggingface.co/chat': { price: 'free', access: 'proxy', tip: '开源模型在线体验' },
  };

  function lookup(href) {
    const key = entryKey(href);
    const host = hostOnly(href);
    return HOST[key] || HOST[host] || {};
  }

  function resolve(href, catId, region) {
    const custom = lookup(href);
    const cat = CAT_DEFAULTS[catId] || {};
    const access = custom.access || cat.access || (region === 'cn' ? 'cn' : 'proxy');
    const price = custom.price || cat.price;
    const form = custom.form || cat.form;
    const chips = [];

    if (ACCESS_LABEL[access]) {
      chips.push({
        text: ACCESS_LABEL[access],
        kind: access === 'cn' ? 'access-cn' : access === 'global' ? 'access-global' : 'access-proxy',
      });
    }
    if (price && PRICE_LABEL[price]) {
      chips.push({ text: PRICE_LABEL[price], kind: 'price-' + price });
    }
    if (form && form.length) {
      chips.push({ text: form.join(' · '), kind: 'form' });
    }

    return {
      chips,
      tip: custom.tip || null,
    };
  }

  global.HubMeta = { resolve, entryKey, hostOnly };
})(typeof window !== 'undefined' ? window : globalThis);
