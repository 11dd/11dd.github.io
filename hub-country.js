/**
 * 根据域名解析国家/地区，生成对应国旗 emoji
 */
(function (global) {
  const CC_LABEL = {
    CN: '中国',
    US: '美国',
    GB: '英国',
    UK: '英国',
    FR: '法国',
    DE: '德国',
    CA: '加拿大',
    AU: '澳大利亚',
    JP: '日本',
    KR: '韩国',
    SG: '新加坡',
    IL: '以色列',
    IN: '印度',
    NL: '荷兰',
    SE: '瑞典',
    CH: '瑞士',
    FI: '芬兰',
    IE: '爱尔兰',
    HK: '中国香港',
    TW: '中国台湾',
    EU: '欧盟',
    BR: '巴西',
    MX: '墨西哥',
    ES: '西班牙',
    IT: '意大利',
    RU: '俄罗斯',
    VN: '越南',
    TH: '泰国',
    MY: '马来西亚',
    ID: '印度尼西亚',
    NZ: '新西兰',
    PL: '波兰',
    NO: '挪威',
    DK: '丹麦',
    AT: '奥地利',
    BE: '比利时',
    UN: '国际'
  };

  /** 主域名 → 国家（公司总部 / 主运营地） */
  const HOST_BY_CC = {
    US: [
      'openai.com', 'chatgpt.com', 'anthropic.com', 'claude.ai', 'console.anthropic.com',
      'platform.openai.com', 'google.com', 'gemini.google.com', 'aistudio.google.com',
      'translate.google.com', 'notebooklm.google.com', 'microsoft.com', 'copilot.microsoft.com',
      'powerbi.microsoft.com', 'ai.azure.com', 'meta.ai', 'perplexity.ai', 'poe.com',
      'character.ai', 'huggingface.co', 'openrouter.ai', 'you.com', 'grok.com', 'pi.ai',
      'lmarena.ai', 'chat.lmsys.org', 'duck.ai', 'brave.com', 'reka.ai', 'abacus.ai',
      'venice.ai', 'writer.com', 'ibm.com', 'aws.amazon.com', 'salesforce.com', 'zendesk.com',
      'intercom.com', 'hubspot.com', 'notion.so', 'figma.com', 'adobe.com', 'firefly.adobe.com',
      'gamma.app', 'miro.com', 'grammarly.com', 'github.com', 'cursor.com', 'bolt.new',
      'replit.com', 'lovable.dev', 'v0.dev', 'codeium.com', 'runwayml.com', 'midjourney.com',
      'pika.art', 'lumalabs.ai', 'suno.com', 'udio.com', 'elevenlabs.io', 'heygen.com',
      'd-id.com', 'descript.com', 'opus.pro', 'veed.io', 'capcut.com', 'fireflies.ai',
      'otter.ai', 'tldv.io', 'notta.ai', 'superhuman.com', 'shortwave.com', 'reclaim.ai',
      'usemotion.com', 'linkedin.com', 'eightfold.ai', 'huntr.co', 'joinhandshake.com',
      'coursera.org', 'duolingo.com', 'khanacademy.org', 'quizlet.com', 'consensus.app',
      'elicit.com', 'connectedpapers.com', 'semanticscholar.org', 'phind.com', 'julius.ai',
      'rows.com', 'tableau.com', 'databricks.com', 'harvey.ai', 'hebbia.ai', 'bloomberg.com',
      'casetext.com', 'nuance.com', 'gptzero.me', 'originality.ai', 'copyleaks.com',
      'hivemoderation.com', 'lakera.ai', 'protectai.com', 'artificialanalysis.ai',
      'swebench.com', 'jasper.ai', 'copy.ai', 'sudowrite.com', 'squibler.io', 'novelai.net',
      'flowgpt.com', 'promptbase.com', 'promptingguide.ai', 'monica.im', 'sider.ai',
      'glama.ai', 'getliner.com', 'zapier.com', 'make.com', 'webflow.com', 'framer.com',
      'relume.io', 'uizard.io', 'lambda.ai', 'modal.com', 'runpod.io', 'replicate.com',
      'fal.ai', 'civitai.com', 'fireworks.ai', 'hyperbolic.xyz', 'coreweave.com', 'unity.com',
      'spline.design', 'hyperhuman.deemos.com', 'jan.ai', 'ollama.com', 'lmstudio.ai',
      'localai.io', 'langflow.org', 'coze.com', 'obsidian.md', 'logseq.com',
      'immersivetranslate.com', 'otranslator.com', 'together.xyz', 'api.together.xyz',
      'groq.com', 'console.groq.com', 'maxai.me'
    ],
    FR: ['mistral.ai', 'chat.mistral.ai'],
    DE: ['deepl.com', 'n8n.io', 'blackforestlabs.ai'],
    CA: ['cohere.com'],
    AU: ['canva.com'],
    IL: ['ai21.com', 'studio.ai21.com'],
    IN: ['writesonic.com'],
    CN: [
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
      'udesk.cn', 'easemob.com', 'matrix.tencent.com', 'dun.163.com', 'ai.baidu.com',
      'cloud.baidu.com', 'cloud.tencent.com', 'open.bigmodel.cn', 'console.volcengine.com',
      'bailian.console.aliyun.com', 'jimeng.jianying.com', 'klingai.kuaishou.com',
      'kimi.moonshot.cn', 'chat.deepseek.com', 'platform.deepseek.com', 'meshy.ai',
      'tripo3d.ai', 'fish.audio', 'dify.ai', 'maxkb.fit2cloud.com', 'meeting.tencent.com',
      'member.bilibili.com', 'ai.lenovo.com.cn', 'ai.wps.cn', 'ai.sohu.com', 'ai.youdao.com',
      'fanyi.baidu.com', 'fanyi.youdao.com', '3d.hunyuan.tencent.com', 'flagopen.baai.ac.cn',
      'if.caiyunai.com', 'v.flomoapp.com'
    ]
  };

  const HOST_COUNTRY = {};
  ['US', 'FR', 'DE', 'CA', 'AU', 'IL', 'IN', 'CN'].forEach((cc) => {
    (HOST_BY_CC[cc] || []).forEach((h) => {
      HOST_COUNTRY[h] = cc;
    });
  });

  const TWO_PART_TLD = {
    'co.uk': 'GB',
    'org.uk': 'GB',
    'com.au': 'AU',
    'com.br': 'BR',
    'co.jp': 'JP',
    'co.kr': 'KR',
    'com.cn': 'CN',
    'org.cn': 'CN',
    'ac.cn': 'CN',
    'com.hk': 'HK',
    'com.tw': 'TW',
    'co.in': 'IN',
    'com.sg': 'SG',
    'com.mx': 'MX'
  };

  const SINGLE_TLD = {
    uk: 'GB',
    de: 'DE',
    fr: 'FR',
    jp: 'JP',
    kr: 'KR',
    sg: 'SG',
    au: 'AU',
    ca: 'CA',
    in: 'IN',
    ch: 'CH',
    se: 'SE',
    nl: 'NL',
    fi: 'FI',
    it: 'IT',
    es: 'ES',
    ie: 'IE',
    ru: 'RU',
    br: 'BR',
    mx: 'MX',
    vn: 'VN',
    th: 'TH',
    my: 'MY',
    id: 'ID',
    ph: 'PH',
    nz: 'NZ',
    pl: 'PL',
    no: 'NO',
    dk: 'DK',
    at: 'AT',
    be: 'BE',
    tw: 'TW',
    hk: 'HK',
    cn: 'CN',
    eu: 'EU',
    il: 'IL'
  };

  let hostSuffixes = null;

  function buildHostSuffixes() {
    if (hostSuffixes) return hostSuffixes;
    hostSuffixes = Object.keys(HOST_COUNTRY).sort((a, b) => b.length - a.length);
    return hostSuffixes;
  }

  function flagEmoji(cc) {
    if (!cc || cc === 'UN') return '🌐';
    const u = cc.toUpperCase();
    if (u.length !== 2) return '🌐';
    const A = 0x1f1e6;
    return String.fromCodePoint(
      A + u.charCodeAt(0) - 65,
      A + u.charCodeAt(1) - 65
    );
  }

  function countryLabel(cc) {
    return CC_LABEL[cc] || CC_LABEL.UN;
  }

  function countryFromTld(host) {
    const parts = host.split('.');
    if (parts.length >= 3) {
      const two = parts.slice(-2).join('.');
      if (TWO_PART_TLD[two]) return TWO_PART_TLD[two];
    }
    const last = parts[parts.length - 1];
    return SINGLE_TLD[last] || null;
  }

  function countryFromHost(host, isCn) {
    if (!host) return 'UN';
    const h = host.toLowerCase().replace(/^www\./, '');
    if (isCn || h.endsWith('.cn')) return 'CN';

    for (const suffix of buildHostSuffixes()) {
      if (h === suffix || h.endsWith('.' + suffix)) return HOST_COUNTRY[suffix];
    }

    return countryFromTld(h) || 'UN';
  }

  function countryFromHref(href, isCn) {
    try {
      const host = new URL(href).hostname.toLowerCase();
      return countryFromHost(host, isCn);
    } catch {
      return 'UN';
    }
  }

  global.HubCountry = {
    flagEmoji,
    countryLabel,
    countryFromHost,
    countryFromHref
  };
})(typeof window !== 'undefined' ? window : globalThis);
