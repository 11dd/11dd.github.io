# AI大模型全景培训手册（静态站）

面向企业内训、开发梳理与团队自学的静态 HTML 培训站点（**18 个主模块**）。

## 本地预览

```bash
cd ai-training-site
python3 -m http.server 8080
```

浏览器打开：**http://localhost:8080/**（`index.html`，**AI工具导航首页**，hao123 式分区，适合对外引流）或 **http://localhost:8080/manual.html**（**培训手册首页**，含术语表 `#glossary`；建议强制刷新 ⌘⇧R）

旧地址 `hub.html` 会自动跳到首页；`training.html` 会跳到 `manual.html`。

**说明：** 若用 `file://` 直接打开 HTML，请通过顶部导航切换页面（链接会自动带上 `?t=dark` / `?t=light`），主题才能在各页保持一致。更推荐用上面的本地 HTTP 服务访问。

## 站点结构

| 阶段 | 页面 | 说明 |
|------|------|------|
| 门户 | `index.html` | **AI工具导航首页**（hao123 式）：7 大分区、仅外部官网；侧栏 + Tab + 筛选；顶部仅「培训手册」入口，培训分组菜单在 `manual.html` 起可见 |
| 培训 | `manual.html` · `syllabus.html` 等 | 培训首页含术语表 `#glossary`；全部分组导航从 `manual.html` 开始 |
| 认知 | `history` · `models` · `infra` | 历史、选型、算力 |
| 技能 | `playbook-business` · `prompt` · `coding` · `api-integration` · `rag` · `finetune` | API 与网关同页 `#gateway` |
| 应用 | `industries` · `agents` · `mcp` · `media` | 行业与 Agent/MCP |
| 进阶 | `benchmarks` · `future` · `startup` | 评测/生产/合规/职业四合一；创业与开发者实操同页 `#devguide` |

**重定向页**（保留旧链接）：`hub.html` → `index.html`（工具导航）；`training.html` → `manual.html`；`glossary.html` → `manual.html#glossary`；`architecture.html` → 大纲架构锚点；`gateway.html` → API 网关锚点；`eval-ops` / `safety` / `careers` / `devguide` → 合并页对应锚点。

## 共享脚本

| 文件 | 作用 |
|------|------|
| `nav.js` | 分组导航、当前页高亮；**门户页**（`index.html`）仅显示精简顶栏 +「培训手册入口」；培训页显示完整菜单与 ⌘K 搜索 |
| `theme.js` | 明暗主题（事件委托，兼容动态注入导航） |
| `toc.js` | 长页自动侧栏目录（≥2 个章节标题时） |
| `history-timeline.js` | 历史页时间线按年代折叠 |
| `copy-blocks.js` | 提示词/工程模板一键复制 |
| `data-sourcing.js` | 分数表自动追加核对日期与来源脚注 |
| `site.js` | 全站上一章/下一章页脚 |
| `search-data.js` / `search.js` | 站内搜索索引 |

## 部署

可部署到任意静态托管：Nginx、GitHub Pages、阿里云 OSS、腾讯云 COS 等。将整个 `ai-training-site` 目录作为网站根目录即可。

## 数据更新说明

- 模型分数与排行榜请以 [Artificial Analysis](https://artificialanalysis.ai)、[LMSYS Arena](https://chat.lmsys.org)、[SWE-bench](https://www.swebench.com) 及各厂商官网为准。
- 本站标注「培训参考」的数据不构成采购或投资建议。
