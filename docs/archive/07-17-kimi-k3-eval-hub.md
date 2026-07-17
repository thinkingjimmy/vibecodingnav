# 07-17 | Kimi K3 跑分汇总落地页 (MVP)

> 目标：为 **Kimi K3** 制作单模型的评测汇总落地页 —— 官方跑分 + 竞技场排名 + 真实用户评价，三位一体。
> 定位：AI 模型界的 G2/Capterra。先做一个模型跑通全流程，数据结构从第一天就为泛化设计。
> 历史说明：本文记录首版静态模板实现；当前 Next.js 架构与验证入口以 `../CURRENT.md` 为准。

## 〇、已定决策（2026-07-17 拍板，不再讨论）

| 决策点 | 结论 |
|---|---|
| 站点语言 | **i18n 六语言**：en（兜底）、zh-CN、ja、ko、es、fr，支持浏览器语言 auto-detect（~~原定纯英文~~，07-17 当日改定） |
| 评价共性结构 | **扁平 pros/cons 两栏**（样本量小，分维度评分留待泛化期） |
| 竞品对比 | **每项跑分放 2-3 个锚点**（Claude Opus / GPT-5.5 同表，Kimi K3 行高亮）。07-17 实施更正：真实数据源当前一线锚点为 **Claude Fable 5 / GPT-5.6 Sol / Claude Opus 4.8**，GPT-5.5 仅存于官方表个别项（已入表格备注行），按真实数据落地 |
| 站点命名 | **AIEvalIndex**（repo 名即站名，Vercel 域名 aievalindex.vercel.app） |

---

## 一、问题本质

跑分数据散落在各评测平台（Artificial Analysis、Arena.ai…），用户评价散落在 X / YouTube / 博客。
没有一个地方能回答："这个模型到底怎么样？" —— 数字（跑分）+ 人话（评价）必须同屏。

**MVP 铁律：一个模型、一个页面、零后端。** 数据全部静态化为 JSON，构建时渲染。
泛化 = 换一份 JSON。这是唯一正确的架构起点。

---

## 二、数据源盘点（已侦察确认）

### 2.1 Artificial Analysis — <https://artificialanalysis.ai/models/kimi-k3>

| 维度 | 数据 |
|---|---|
| Intelligence Index | 57（189 个模型中排第 4） |
| 输出速度 | 62.0 tokens/s（排名 88/189） |
| 首 token 延迟 | 1.99s |
| 定价 | $3.00 / $15.00 每百万 tokens（输入/输出），缓存命中 $0.30 |
| 上下文窗口 | 1M tokens |
| 参数量 | 2.8T |
| 细分跑分 | GDPval-AA v2、SciCode、Humanity's Last Exam、GPQA Diamond 等 9 项 |

### 2.2 Arena.ai WebDev 竞技场 — <https://arena.ai/leaderboard/code/webdev>

| 维度 | 数据 |
|---|---|
| kimi-k3 排名 | **#1**，Score 1679，1,757 票 |
| 参照系 | kimi-k2.6 #18 (1515)、kimi-k2.7-code #26 (1470) |
| 榜单字段 | Rank / Rank Spread / Model / Score / Votes / Price / Context |

### 2.3 用户真实评价（人工采集 → Summary → 提取共性）

首篇样本：Simon Willison — <https://simonwillison.net/2026/Jul/16/kimi-k3/>

- 👍 首个开源 3T 级模型；多项基准超 Claude Opus 与 GPT-5.5；视觉能力出色；较 K2.6 输出 token 省 21%
- 👎 中国实验室迄今最贵（$3/$15）；推理 token 消耗大（一张鹈鹕图 13,241 tokens ≈ $0.25）；仅一档推理强度；有约 85 token 隐藏系统提示

后续人工采集 X / YouTube / 博客各 2-3 篇，共性提炼成"优点共识 / 缺点共识"两栏。

---

## 三、页面结构（对齐 paperswithcode.co 风格）

设计基调：暖纸底色、衬线标题 + 等宽元数据、发丝线分隔、单一低饱和蓝强调色、高密度小字号。
**全部样式细节以 [07-17-design-system.md](./07-17-design-system.md) 为设计基线**（逆向自 paperswithcode.co 真实 CSS；当前实现以 `src/input.css` 为准）。

```
┌─────────────────────────────────────────┐
│ Header: AIEvalIndex logo + 语言切换器      │
│  (EN/中文/日本語/한국어/ES/FR 下拉)         │
├─────────────────────────────────────────┤
│ Hero: Kimi K3 · Moonshot AI              │
│  关键指标卡片×4: Intelligence 57 | Arena #1 │
│  | $3/$15 | 1M context                   │
├─────────────────────────────────────────┤
│ Section 1: Benchmarks 跑分表              │
│  (来源徽章: Artificial Analysis / Arena)  │
│  每项含 Claude Opus / GPT-5.5 锚点分数，   │
│  Kimi K3 行高亮                           │
├─────────────────────────────────────────┤
│ Section 2: Community Reviews             │
│  优点共识 / 缺点共识 两栏 + 单条评价卡片      │
│  (作者头像/名字/来源链接/一句话 Summary)     │
├─────────────────────────────────────────┤
│ Footer: 数据源声明 + 更新日期               │
└─────────────────────────────────────────┘
```

---

## 四、技术方案

- **栈**：静态多页站 —— 单模板 + **构建脚本生成 6 语言页面** + **Tailwind CSS**。不上框架：i18n 的本质是"模板 × 字典"的笛卡尔积，一个 ~50 行 Node 脚本足矣，Next/Astro 在此都是死重。
- **构建**：`scripts/build.mjs` 读取模板 + 语言字典 + 数据 JSON，输出 `dist/{locale}/index.html` × 6。Tailwind CLI 扫描模板生成 `dist/style.css`。
- **i18n 架构**：
  - **UI 字符串**：`i18n/{locale}.json`（标题、栏目名、按钮等界面词），en 为兜底——字典缺 key 时回落 en，页面永不开天窗。
  - **内容翻译**：评价 Summary、共识 pros/cons 属于内容而非界面，随数据走（见 schema），同样 en 兜底。
  - **跑分名 / 模型名 / 数字**：专有名词不翻译，六语言共享。
- **Auto-detect**：根路径 `/` 放一个仅含检测脚本的极小页面：`localStorage.lang || navigator.language` → 跳转 `/{locale}/`，无匹配落 `/en/`。语言切换器写回 localStorage。纯客户端，零服务端逻辑，Vercel 静态托管照常成立。
- **SEO**：每页输出 `<link rel="alternate" hreflang>` 互指 + `x-default` 指向 `/en/`，让搜索引擎按语言收录，不受根路径跳转影响。
- **部署**：**Vercel** —— Build Command: `node scripts/build.mjs && npx tailwindcss -i src/input.css -o dist/style.css --minify`，Output Directory: `dist`。每次 push 即上线。
- **泛化路径**：未来 = 模板 × `data/{model}.json` × 6 语言，构建脚本天然支持，这正是现在就上生成脚本的原因。

### 工程结构

```
/
├── templates/index.html    # 页面模板（Tailwind 类 + {{token}} 占位符）
├── data/kimi-k3.json       # 全部数据（内容翻译内嵌，en 兜底）
├── i18n/
│   ├── en.json             # UI 字典 · 兜底语言
│   ├── zh-CN.json  ja.json  ko.json  es.json  fr.json
├── scripts/build.mjs       # 生成器: 模板 × 字典 × 数据 → dist/{locale}/
├── src/input.css           # Tailwind 入口
├── tailwind.config.js      # 主题定制：字体、强调色
└── package.json            # 唯一依赖: tailwindcss
```

构建产物：`dist/index.html`（检测跳转页）+ `dist/{en,zh-CN,ja,ko,es,fr}/index.html` + `dist/style.css`

### 数据 Schema 草案

```json
{
  "model": { "name": "Kimi K3", "vendor": "Moonshot AI", "params": "2.8T", "context": "1M", "license": "Modified MIT" },
  "pricing": { "input": 3.0, "output": 15.0, "cached": 0.3 },
  "benchmarks": [
    { "source": "artificial-analysis", "name": "Intelligence Index", "score": 57, "rank": "4/189", "url": "...",
      "peers": [ { "model": "Claude Opus", "score": 0 }, { "model": "GPT-5.5", "score": 0 } ] },
    { "source": "arena-webdev", "name": "WebDev Arena", "score": 1679, "rank": "1", "votes": 1757, "url": "...",
      "peers": [ { "model": "kimi-k2.6", "score": 1515 } ] }
  ],
  "reviews": [
    { "author": "Simon Willison", "source": "blog", "url": "...", "date": "2026-07-16",
      "summary": { "en": "...", "zh-CN": "...", "ja": "...", "ko": "...", "es": "...", "fr": "..." },
      "pros": [ { "en": "...", "zh-CN": "..." } ],
      "cons": [ { "en": "...", "zh-CN": "..." } ] }
  ],
  "consensus": {
    "pros": [ { "en": "...", "zh-CN": "...", "ja": "...", "ko": "...", "es": "...", "fr": "..." } ],
    "cons": [ { "en": "..." } ]
  }
}
```

**i18n 约定**：所有可翻译字段统一为 `{ locale: string }` 对象，`en` 必填、其余可缺——构建脚本按 en 兜底渲染。跑分名、模型名、数字、URL 不进翻译层。

**翻译工作流**：英文为母本（人工撰写）→ AI 批量翻译其余 5 语 → zh-CN 人工校对（站长母语），ja/ko/es/fr 接受 AI 质量，标注"社区可纠错"。

---

## 五、开发 Todo

### Phase 1 — 数据采集与建模
- [x] 定稿 `data/kimi-k3.json` schema（peers 由数组改为按锚点模型名索引的对象，配合固定锚点列渲染）
- [x] 采集细分跑分（07-17 实况：AA 页面细分分数未静态公开，改以 Moonshot 官方发布表 + kingy.ai 汇总为源，共录入 11 项；SciCode / CritPt / AA-LCR / τ³-Banking 无公开数值，未录入——铁律：无源不录）
- [x] 采集竞品锚点分数：Claude Fable 5 / GPT-5.6 Sol / Claude Opus 4.8（GPT-5.5 个别项入备注）
- [x] 采集 Arena.ai WebDev 榜单 Kimi K3 数据（#1/1679/1,757 票；K2.6 #18、K2.7-code #26 入备注行）
- [x] 录入 Simon Willison 评价：Summary + pros/cons（英文母本）
- [x] 再人工采集 3 条评价：Lentils@X、Peter "First impressions"@YouTube、AIReiter@博客
- [x] 提炼共性 → `consensus.pros` ×4 / `consensus.cons` ×4（英文母本）
- [x] 编写 6 份 UI 字典 `i18n/{locale}.json`
- [x] 内容翻译：reviews/consensus 六语内嵌 data JSON（zh-CN 待站长终校）

### Phase 2 — 页面开发
- [x] 初始化工程：tailwindcss@3.4 唯一依赖，`tailwind.config.js` CSS 变量法注入 tokens
- [x] 编写 `scripts/build.mjs`：模板 × 字典 × 数据 → `dist/{locale}/index.html` × 6，缺 key 回落 en，未解析 token 直接构建失败
- [x] 搭建 `templates/index.html` 骨架（Hero / Benchmarks / Reviews / Footer 四段 + 占位符）
- [x] 按 [07-17-design-system.md](./07-17-design-system.md) 实现样式：暖纸底、三字体分工、发丝线、单一强调蓝
- [x] Header 语言切换器：下拉跳转 `/{locale}/` 并写 localStorage
- [x] 根路径检测跳转页：`localStorage.lang || navigator.language(s)` → `/{locale}/`，zh-* 归并 zh-CN，无匹配落 `/en/`
- [x] 每页输出 hreflang 互指标签 ×6 + `x-default`（SEO）
- [x] CJK 字体栈处理：`[lang]` 选择器切 `--serif` 宋体系，mono 保持拉丁渲染数字
- [x] Hero 关键指标卡片 ×4（Intelligence 57 / Arena #1 / $3/$15 / 1M）
- [x] Benchmarks 表格：来源徽章外链回源 + Kimi K3 列 accent-soft 高亮（锚点为列，高亮"行"转置为高亮"列"）
- [x] Reviews 区：共识两栏（pros 蓝线 / cons warn 线）+ 4 张评价卡片（首字母头像、来源徽章、Summary、原文链接）
- [x] 响应式：表格容器 overflow-x-auto 横滚，卡片移动端单列

### Phase 3 — 验证与发布
- [x] 数据核对：页面所有数字与源站抓取结果一一对照（07-17 快照）
- [x] 每条数据带回源链接：11 项跑分逐行外链 + 4 条评价原文链接 + Footer 数据源清单
- [x] 本地预览走查：桌面 1280px + 移动 500px 截图核对（390px 裁切为 headless 最小布局宽假象，布局全流式）
- [x] 六语言页面逐一走查：构建期缺 key 即失败（天窗不可能存在）、CJK lang 属性与宋体回落在位、切换器 selected 正确
- [x] Auto-detect 验证：headless 实测 ja/ko/fr 正确落位、zh-TW→zh-CN、de→en 兜底；localStorage 记忆由切换器写入
- [ ] 部署到 **Vercel**：连 GitHub 仓库（vercel.json 已就位：buildCommand = `pnpm build`，outputDirectory = `dist`，pnpm-lock.yaml 驱动包管理器识别）——需站长在 Vercel 授权操作
- [ ] 验证 Vercel 生产 URL：6 个 locale 路径可达、样式完整、hreflang 标签在位、外链可达——待部署后执行

### Phase 4 — 泛化预埋（本期不做，只留钩子）
- [ ] 确认模板与数据完全解耦（换 JSON 即换模型页）
- [ ] 记录采集 SOP：新增一个模型需要哪几步

---

## 六、边界声明（MVP 不做什么）

- ❌ 不做后端 / 数据库 / 自动爬虫 —— 数据人工更新
- ❌ 不做多模型对比页 —— 只有 Kimi K3 一页
- ❌ 不做用户提交评价 —— 评价由站长人工策展
- ❌ 不做历史趋势图 —— 只呈现当前快照
- ❌ 不做服务端语言协商（Edge Middleware / Accept-Language）—— 客户端检测足够，保持纯静态
- ❌ 不做 ja/ko/es/fr 人工校对 —— AI 翻译直出，仅 zh-CN 人工把关
