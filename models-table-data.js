/** 全球模型对比表数据 · 发布时间供培训参考（以厂商公告/技术报告为准） */
(function (global) {
  const MODELS = [
    // 第一梯队 · 全球顶尖旗舰
    { tier: 1, n: 1, name: 'Claude Opus 4.7', url: 'https://www.anthropic.com/claude', co: 'Anthropic', pill: 'pill-r', type: '闭源', params: '—', swe: '87.6%', mmlu: '—', released: '2026-04', note: '编程 / Agent 标杆' },
    { tier: 1, n: 2, name: 'GPT-5.5', url: 'https://openai.com', co: 'OpenAI', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '—', released: '2026-04', note: '综合旗舰 · 计算机使用' },
    { tier: 1, n: 3, name: 'Claude Sonnet 4.6', url: 'https://www.anthropic.com/claude', co: 'Anthropic', pill: 'pill-r', type: '闭源', params: '—', swe: '82.0%', mmlu: '—', released: '2026-03', note: 'Sonnet 性价比旗舰' },
    { tier: 1, n: 4, name: 'Gemini 2.5 Pro', url: 'https://deepmind.google/models/gemini', co: 'Google', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '—', released: '2025-06', note: '多模态 · 超长上下文' },
    { tier: 1, n: 5, name: 'DeepSeek-V4-Pro', url: 'https://www.deepseek.com', co: '深度求索', pill: 'pill-g', type: '开源', params: 'MoE', swe: '80.6%', mmlu: '—', released: '2026-04', note: '开源编程第一档' },

    // 第二梯队 · 主力 / 高性价比
    { tier: 2, n: 6, name: 'GPT-5.2', url: 'https://openai.com', co: 'OpenAI', pill: 'pill-r', type: '闭源', params: '—', swe: '76.3%', mmlu: '—', released: '2026-03', note: 'API 稳定主力' },
    { tier: 2, n: 7, name: 'Claude Opus 4.6', url: 'https://www.anthropic.com/claude', co: 'Anthropic', pill: 'pill-r', type: '闭源', params: '—', swe: '80.8%', mmlu: '—', released: '2026-02', note: '全栈编程' },
    { tier: 2, n: 8, name: 'Kimi K2.6', url: 'https://www.moonshot.cn', co: '月之暗面', pill: 'pill-b', type: 'API', params: '—', swe: '80.2%', mmlu: '—', released: '2026-01', note: '长文档 · 搜索' },
    { tier: 2, n: 9, name: 'Qwen3.6 Plus', url: 'https://qwenlm.github.io', co: '阿里云', pill: 'pill-b', type: 'API', params: '397B级', swe: '78.8%', mmlu: '—', released: '2026-02', note: '中文编程 · Agent' },
    { tier: 2, n: 10, name: 'GLM-5', url: 'https://www.zhipuai.cn', co: '智谱AI', pill: 'pill-b', type: 'API', params: '—', swe: '77.8%', mmlu: '—', released: '2026-01', note: '国产综合旗舰' },
    { tier: 2, n: 11, name: 'DeepSeek-V4-Flash', url: 'https://www.deepseek.com', co: '深度求索', pill: 'pill-g', type: '开源', params: 'MoE', swe: '79.0%', mmlu: '—', released: '2026-04', note: '极速 · 低成本' },
    { tier: 2, n: 12, name: 'o3 / o4-mini', url: 'https://openai.com', co: 'OpenAI', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '—', released: '2025-04', note: '推理 / 数学专精' },
    { tier: 2, n: 13, name: 'DeepSeek-R1', url: 'https://www.deepseek.com', co: '深度求索', pill: 'pill-g', type: '开源', params: '671B MoE', swe: '—', mmlu: '86.7', released: '2025-01', note: '推理 · 极致单价' },
    { tier: 2, n: 14, name: 'DeepSeek-V3', url: 'https://www.deepseek.com', co: '深度求索', pill: 'pill-g', type: '开源', params: '671B MoE', swe: '—', mmlu: '79.5', released: '2024-12', note: '通用 MoE 性价比' },
    { tier: 2, n: 15, name: 'Qwen3-235B', url: 'https://qwenlm.github.io', co: '阿里云', pill: 'pill-g', type: '开源', params: '235B MoE', swe: '—', mmlu: '85.0', released: '2025-04', note: '中文 + Agent' },
    { tier: 2, n: 16, name: 'GPT-4.1', url: 'https://openai.com', co: 'OpenAI', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '83.8', released: '2025-04', note: '长上下文记忆' },
    { tier: 2, n: 17, name: 'GPT-4o', url: 'https://openai.com', co: 'OpenAI', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '88.7', released: '2024-05', note: '多模态 · 仍广泛使用' },
    { tier: 2, n: 18, name: 'Claude 3.7 Sonnet', url: 'https://www.anthropic.com/claude', co: 'Anthropic', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '87.9', released: '2025-02', note: '上一代 Sonnet 主力' },
    { tier: 2, n: 19, name: 'Gemini 2.0 Pro', url: 'https://deepmind.google/models/gemini', co: 'Google', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '87.1', released: '2024-12', note: '百万级上下文' },
    { tier: 2, n: 20, name: 'Llama 4 Scout', url: 'https://ai.meta.com/llama', co: 'Meta', pill: 'pill-g', type: '开源', params: '109B', swe: '—', mmlu: '—', released: '2025-04', note: '开源生态旗舰' },
    { tier: 2, n: 21, name: 'Grok-3', url: 'https://grok.com', co: 'xAI', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '—', released: '2025-02', note: 'X 实时数据' },
    { tier: 2, n: 22, name: 'Mistral Large 2', url: 'https://mistral.ai', co: 'Mistral AI', pill: 'pill-p', type: '开源', params: '123B', swe: '—', mmlu: '84.0', released: '2024-07', note: '欧洲旗舰' },
    { tier: 2, n: 23, name: 'Command R+', url: 'https://cohere.com', co: 'Cohere', pill: 'pill-b', type: 'API', params: '104B', swe: '—', mmlu: '81.5', released: '2024-08', note: '企业 RAG' },
    { tier: 2, n: 24, name: 'Doubao Pro', url: 'https://www.volcengine.com/product/doubao', co: '字节跳动', pill: 'pill-b', type: 'API', params: '—', swe: '—', mmlu: '—', released: '2024-12', note: '国内低价 API' },
    { tier: 2, n: 25, name: '混元 Turbo', url: 'https://hunyuan.tencent.com', co: '腾讯', pill: 'pill-b', type: 'API', params: '—', swe: '—', mmlu: '80.8', released: '2024-09', note: '腾讯生态' },
    { tier: 2, n: 26, name: '文心 4.5 Turbo', url: 'https://yiyan.baidu.com', co: '百度', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '83.3', released: '2025-03', note: '搜索增强' },
    { tier: 2, n: 27, name: 'GLM-4', url: 'https://www.zhipuai.cn', co: '智谱AI', pill: 'pill-b', type: 'API', params: '—', swe: '—', mmlu: '83.5', released: '2024-06', note: '国产综合' },
    { tier: 2, n: 28, name: 'Qwen3-7B', url: 'https://qwenlm.github.io', co: '阿里云', pill: 'pill-g', type: '开源', params: '7B', swe: '—', mmlu: '76.8', released: '2025-04', note: '本地部署首选' },
    { tier: 2, n: 29, name: 'Phi-4', url: 'https://azure.microsoft.com/products/phi', co: 'Microsoft', pill: 'pill-g', type: '开源', params: '14B', swe: '—', mmlu: '80.5', released: '2024-12', note: '端侧 / 小模型' },
    { tier: 2, n: 30, name: 'GPT-4o mini', url: 'https://openai.com', co: 'OpenAI', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '79.3', released: '2024-07', note: '轻量低价' },

    // 第三梯队 · 上一代 / 经典
    { tier: 3, n: '—', name: 'Claude 3.5 Sonnet', url: 'https://www.anthropic.com/claude', co: 'Anthropic', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '~88', released: '2024-06', note: '前代 Sonnet' },
    { tier: 3, n: '—', name: 'DeepSeek-R1-0528', url: 'https://www.deepseek.com', co: '深度求索', pill: 'pill-g', type: '开源', params: '671B', swe: '—', mmlu: '87.8', released: '2025-05', note: 'R1 升级版' },
    { tier: 3, n: '—', name: 'Qwen2.5-72B', url: 'https://qwenlm.github.io', co: '阿里云', pill: 'pill-g', type: '开源', params: '72B', swe: '—', mmlu: '79.9', released: '2024-09', note: '上一代通义' },
    { tier: 3, n: '—', name: 'Llama 3.1 70B', url: 'https://ai.meta.com/llama', co: 'Meta', pill: 'pill-g', type: '开源', params: '70B', swe: '—', mmlu: '—', released: '2024-07', note: '经典开源' },
    { tier: 3, n: '—', name: 'GPT-3.5 Turbo', url: 'https://openai.com', co: 'OpenAI', pill: 'pill-r', type: '闭源', params: '—', swe: '—', mmlu: '~70', released: '2022-11', note: 'legacy 低成本' },
  ];

  const TIER_LABEL = {
    1: '🚀 第一梯队 · 全球顶尖旗舰（综合能力 / 编程标杆）',
    2: '⚡ 第二梯队 · 主力商用（高性价比 / 开源 / 国内 API）',
    3: '📦 第三梯队 · 上一代经典（培训对照，生产优先上表）',
  };

  global.ModelsTableData = { MODELS, TIER_LABEL };
})(typeof window !== 'undefined' ? window : globalThis);
