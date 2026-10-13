<!--
- [INPUT]: 依赖代码、数据、配置与 docs/CURRENT.md 的实际变更
- [OUTPUT]: 对外提供按时间倒序排列的项目迭代记录
- [POS]: 项目根目录的版本记忆；docs/CURRENT.md 描述现在，docs/archive/ 保存历史方案，本文件记录演进过程
- [PROTOCOL]: 变更时更新此头部，然后检查 README.md
-->

# Changelog

本文件记录 VibeCodingNav（前身 AIEvalIndex）的有效迭代。最新记录置顶；尚未完成的工作留在 `docs/CURRENT.md`，只有已经落地的变化进入这里。

## 2026-10-13

### 新增

- 新增通用榜 FrontierCode 1.1（Cognition）：测 PR 可合并性（维护者会不会合并），单元测试 + 评分细则 + 验证器；不公平联网使用清零。2026-10-13 从 https://cognition.com/data/frontiercode-leaderboard/data.json（`v1_1` Main）同步 130 行，与页面 All reasoning levels 一致（43 模型全部推理档；# 为最佳档名次）。列：Score、Pass rate、Flag rate、Cost / rollout、Output tokens（及 harness）。`scope: general`，挂入 Web 前端 / Android / CLI·DevOps，方法 C 权重 0.6。维度标签「能否合并」，图标 Phosphor GitMerge。榜首 Claude Opus 5.5（medium）54.6%。

### 变更

- `Benchmark.scope: general` 现包括 sudo L7、DeepSWE v1.1 与 FrontierCode 1.1；三场景融合表与综合分均增加 FrontierCode 列。首页观测权重门槛随总权重调整（Web ≥ 2.1 / 4.2，Android ≥ 1.4 / 2.8，CLI ≥ 1.1 / 2.2）。

## 2026-10-12

### 新增

- 「写文档和文案」挂入 EQ-Bench Creative Writing v3（https://eqbench.com/creative_writing.html）：2026-10-12 从页面 `creative_writing.js`（v=1.0.91）嵌入 CSV 抓取全部 140 行，主指标归一化 Elo（越高越好；锚定 DeepSeek-R1=1500、ministral-3b=200）。方法 C 权重 0.6，Slop Index 仍为 1.0；列序按权重为「像真人」→「创意写作」。维度标签「创意写作」，图标 Phosphor PenNib。基准页含完整原榜；Creative Writing 29/140 行映射到本站模型；Slop Index 同步补齐 Grok 4.5 / Muse Spark 1.1 等可对齐 `modelSlug`。
- 工具箱「字体」分类新增 Best Free Fonts（https://bestfreefonts.com/）：精选免费字体目录，强调真正免费，收录字体常见为 SIL Open Font License；与 qiaomu-cover-fonts 等同列。
- 全站接入 Google Analytics GA4（`G-ZBKDEBT9C6`）：经 `@next/third-parties` 的 `GoogleAnalytics` 挂在共用 `DocumentShell`，中英根布局一并覆盖；测量 ID 集中在 `GA_MEASUREMENT_ID`；仅生产构建注入（`next dev` 不加载），静态导出 HTML 含 gtag.js。

### 变更

- 写文档和文案场景由单榜变为双榜综合分；首页该卡与场景 takeaway 随融合表重算（不再等于单看 Slop Index）。
- Android 场景融合表里 Android Bench 的白话维度标签由「长程任务」改为「安卓开发」（英 Android dev），列头图标由 DeviceMobile 改为 Phosphor AndroidLogo，避免与 DeepSWE「长程工程」混淆。列头悬停说明、评分模态权重/例子/小多图与 i18n 均走同一 `dimension` 字段。

### 修复

- 场景融合表列头改为单行（`whitespace-nowrap`）：图标、白话标签与排序箭头同一行垂直居中；各榜列固定最小宽度 10rem，表宽超出版心时在表内横向滚动，模型 / 综合分 / 上榜三列横向 sticky。表上同步日期与表格内容右缘对齐（工具栏并入融合表同一 `px-4` 盒）。

## 2026-10-11

### 新增

- 新增通用榜 DeepSWE v1.1（Datacurve）：113 道长程工程题，Pass@1，来源更新 2026-09-22。2026-10-11 从 https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json 同步 28 行 Best 配置（每模型最高 Pass@1 推理档）。`scope: general`，挂入 Web 前端 / Android / CLI·DevOps，方法 C 权重 0.6。维度标签「长程工程」，图标 Phosphor RoadHorizon。榜首 GPT 6 Astra 74.1%，Gemini 3.8 Flash 73.8%，Claude Opus 5 73.6%。
- 新增场景「写文档和文案」（Write docs & copy），挂 The Slop Index 一张榜。2026-10-11 从 https://theslopindex.com/leaderboard 抓取 39 行（当时 1,795 票）；开放数据 https://github.com/hgaddipati1118/slop-index 。来源 Slop Score 越高越差、#1 最渣；本站反转为最少 slop 为 #1，分数存 100 − Slop Score。维度标签「像真人」，图标 Phosphor Article。未另建推荐组合（工具箱无可对应文案栈）。首页 featured 场景增至 4 张。
- Web 前端增加 LMArena Image-to-WebDev。完整榜 64 行，榜单日期 2026-10-09，177,108 票。基准页在原榜之后画出分数对混合价格，实心点是帕累托页列出的 6 个模型。
- 场景综合分（方法 C）：每张榜相对榜首归一化（竞技场按对榜首胜率，通过率按比值，榜首 100），按场景权重加权；缺榜按中位水平半权计入，初步行半权。只用于融合表默认排序和首页卡片；融合表格子仍是各榜原始名次。
- 基准增加 `scope`：`specific`（默认）最多属于一个场景；`general` 可跨场景复用。目前仅 sudo L7 为 `general`。
- 场景页「评分方法」说明：归一化、权重、缺榜半权公式与场景注意点；有合适样本时用小多图说明「单榜第 1 ≠ 综合第 1」。
- 场景页头部第三轮：介绍句 + 构建期从融合表生成的 takeaway（诚实标并列）+ 行内「怎么算的？」；表上轻工具栏（按综合分排序 / 同步日期）；表后「推荐组合」四列网格链到组合页。

### 变更

- 场景融合表的基准列按 `boards[].weight` 降序排列（同权保持声明顺序）；评分模态权重表与小多图共用同一顺序。Web 前端因此为：盲测投票 → 还原设计 → 工程判断 → 长程工程 → Next.js 任务 → React 任务。Android：长程任务 → 工程判断 → 长程工程。CLI：终端任务 → 长程工程。
- `Benchmark.scope: general` 现包括 sudo L7 与 DeepSWE v1.1；DeepSWE 同时出现在三个场景的融合表与综合分中。
- 场景表上工具栏去掉「格子里是各榜原始名次」提示，右侧只保留「本页同步 {date}」。
- 「综合分怎么算」模态按「公式 → 一个例子 → 为什么合起来看 → 权重 → 缺榜 → 注意事项」重排：公式用排版分数式对齐方法 C；例子在构建期用 `explainCompositeScore` 拆真实模型（Web 为 Claude Fable 5.1 = 84）；小多图移到「为什么合起来看」，柱下标榜名、柱高为 s_b、斜线为缺榜。无「单榜第 1 但综合更低」样本的场景省略图，仍保留公式与例子。
- 融合表 WebDev 维度标签「偏好」改为「盲测投票」（英 Blind votes）。可排序列头统一为「图标 + 标签 + 右侧排序箭头」；未激活列悬停/聚焦时箭头淡显，当前排序列实色。综合分、上榜与各榜名次左对齐并对齐列头文字起点（有图标的列对齐图标起点），沿用等宽数字。
- 场景页「评分方法 →」改为居中模态（约 880px / 80vh）：左侧目录可平滑滚到各节并随滚动高亮；窄屏目录收到顶部横向列表。Esc、遮罩点击与关闭按钮可关，焦点回触发按钮但不画重焦点环。
- 场景页头部改为介绍句、数据 takeaway 与行内「怎么算的？」；去掉无信息量副标题、独立「评分方法 →」按钮、头部组合行与头部同步日期（同步日期移到表上工具栏）。
- 融合表列头改为 Phosphor 图标 + 白话维度标签（内容数据双语）；悬停/聚焦列头显示基准名（链到基准页）、测什么、主办方、权重与样本量。点击列头仍排序。无权重圆点。
- 场景融合表默认按综合分排序，增加「综合分」列。首页场景卡片改为名次 + 厂商标 + 模型名 + 综合分；悬停或键盘聚焦可看各榜名次与归一化分。仍保持桌面三列。
- 首页和场景列表的卡片去掉标题下的基准名称。首页与场景列表（`/scenarios`、`/zh/scenarios`）桌面均为一行三列，较窄时改为两列，再窄时一列。
- Android Bench 1.0 与 2.0 长程合并为一个基准。当前版本是 2.0 长程，场景和首页只用这一版。1.0 仍是完整的 32 行，在基准页标为历史版本。旧地址会打开合并页并选中对应版本。过期判断看当前版本。
- 基准页的完整榜单在滚动时，筛选和表头吸在导航下方。横向滑动时表头仍与各列对齐。
- sudo L7 归入「做 Web 前端」：融合表新增一列，方法 C 综合分权重 0.6（与图生网页同级，通过率按比值相对榜首）。首页与场景列表改为三张卡片。
- sudo L7 同时进入「做一个 Android App」：融合表多一列，方法 C 权重 0.6（Android Bench 当前版本主榜权重 1.0）。基准页「出现在场景」回链到 Web 前端与 Android。

### 修复

- 融合表列头说明弹层只保留基准名链接、权重与 1–2 句说明；去掉主办方与票数/模型数/日期元数据行，并移除对应 `runBy` / `dataNote` 内容字段与「主办」文案。
- 「评分方法」与搜索等对话框的右上角关闭改为仅 Phosphor X 图标按钮（`aria-label` 为「关闭」/ Close）；去掉「Esc 关闭」可见文案，Esc 仍可关。
- 融合表「综合分」「上榜」列头与维度列头同用前景色；「出现」改名为「上榜」（英 On boards）；列头说明弹层去掉底部「打开基准页」链，标题链到基准页保留。
- 融合表维度列头：Phosphor 图标与标签同一行（图标在左约 14px），与数值列底对齐；含链接的说明改用锚定表头的 Popover（悬停桥接、焦点可进链接、Esc 关闭），不再跟随指针。只读分数明细仍跟随指针。
- 场景卡片与融合表的分数明细浮层改为跟随指针（右下约 12px），碰撞时翻转/平移留在视口内；键盘聚焦时锚在行起点附近，不再钉在行尾溢到下一张卡片。
- 焦点环只在键盘 Tab 时出现，颜色是半透明前景，不再是粗黑框。用 Esc 或点击关掉搜索后，焦点回到按钮，但不显示这个环。
- 主导航只在对应栏目高亮。首页 `/` 与 `/zh/` 不再把「场景」标成当前页。
- 榜单筛选和表头按导航的实际高度吸在导航正下方。窄屏导航折成两行时不再被盖住。
- 场景融合表的列头同样吸在导航下，滚动后不再只剩模型行。

### 移除

- 移除场景「生产级改动与架构决策」。旧地址 `/scenarios/production-changes/` 与 `/zh/scenarios/production-changes/` 跳到 Web 前端场景。

## 2026-10-10

### 新增

- 新增框架官方评测 Supabase Evals、Next.js Agent Evals、Convex Evals，以及生态评测 ReactBench（Million，不是 React / Meta 官方）。基线与有材料、网页臂分列，不合成一个分数。Convex 的 With Guidelines 因公开查询报错未收录。
- 新增场景「生产级改动与架构决策」和基准 sudo L7。分数按 Surge 公开榜的列表顺序收录 12 行，博客里的单任务成本只写在说明里，不进榜单列。
- 站点重建为 VibeCodingNav：按场景挑选模型与工具。英文在 `/`，中文在 `/zh/`。
- 内容模型包含场景榜单、模型、基准、工具分类、库 / Skill / 插件 / Prompt / 工具，以及「做 X」组合页。构建期校验引用，并生成反向链接。
- 榜单挑选在构建期计算：榜首、输出或跑分成本不超过榜首一半的最高名次、宽松开源许可中的最高名次。基准超过 90 天或已停更时降为非主要证据。
- 首页、场景、模型、工具箱、条目详情、组合、基准与更新日志按 v7 信息架构生成静态页。

### 变更

- 场景页改为融合表：一行一个模型，一列一张榜，格子是该模型在这张榜上最好的名次。缺席写「—」，不估算。默认只平均实际出现的榜；平均名次相同，则出现的榜更多者在前，再比主榜名次。表头链到基准页。完整原榜改在基准页，超过 20 行可展开。
- Web 前端对齐 LMArena WebDev、Next.js Agent Evals 和 ReactBench。Android 对齐 1.0 与 2.0 长程。Supabase 与 Convex 仍只在条目页。同一模型的推理档位和 agent 组合并到最好的一档，悬停可看来源行。
- 首页卡片按同一平均名次取前 5。多榜卡片左侧是平均名次，右侧是各榜名次；单榜卡片仍显示主榜分数。
- 「用开源模型做前端」改跳到 LMArena WebDev 基准页，「大型重构与迁移」改跳到 Android Bench 2.0 长程基准页。
- 首页场景榜单只显示 6 张卡片，标题右侧的「查看更多」进入场景列表。场景列表使用和首页相同的卡片。
- 公开榜按来源页完整收录：LMArena WebDev 142 行、Android Bench 1.0 的 32 行、Android Bench 2.0 长程 10 行、Terminal-Bench 4.0 的 35 行、sudo L7 的 12 行。列、顺序、并列名次和页面上的分数与来源一致。超过 20 行默认收起，可展开全部。
- Android 场景用页签放 1.0 和长程两张表。开源权重是 WebDev 与 Android 榜上的筛选，筛选不改来源名次。首页卡片取各场景主榜来源名次的前 5，全栈 SaaS 与其余五张一起出现在首页。
- Terminal-Bench 里 GPT-6.1 Sol max 与 GPT-6 Astra max 并列第 3，展示成本是 $634.24。sudo L7 以 Claude Opus 5.5 为首，与 Claude Sonnet 5.5 同为 45。
- 榜单卡片里的模型名可点，进入对应模型页。悬停用手型，名字不加下划线，也不铺底色。
- 首页榜单卡片右上角改为「查看更多 →」，去掉底部的「查看完整榜单」。基准名称可点，进入对应基准页。
- 场景、模型、组合、基准页面的版心改为与首页相同的 1200px，页脚一起对齐。
- 首页去掉开工提示、榜单与工具箱的说明句，以及「全部场景」「还有」这一行。
- 包名与站点元数据改为 vibecodingnav / vibecodingnav.com。视觉改为 Geist、Geist Mono 与 zinc 单色，亮色和暗色由 CSS 变量切换。
- 静态导出配置保持 `output: export` 与目录式尾斜杠，未改部署设置。
- 页头标记改为 Phosphor 的终端图标。有 LobeHub 单色标的 AI 厂商改用该标，其余厂商仍用字母标。

### 修复

- 榜单列宽按列固定。切换全部、专有、开源权重，或展开全部行时，表格不再随当前行的文字左右伸缩。
- Android Bench 2.0 长程补齐来源页的 agent、置信区间、完成率、耗时、成本和后 3 行。此前只存了前 7 行通过率，且只有第一名有区间。
- sudo L7 的 HTML 把每行 rank 都写成 1，名次改按列表顺序。榜单不再把博客成本当成一列。
- 基准超过 90 天后，组合页撤下模型推荐并标出过期，静态构建不再因为挑选为空而失败。
- 内容日期按年月日回写校验，拒绝 2026-02-30 这类溢出日期。

### 移除

- 移除派生场景「用开源模型做前端」和「大型重构与迁移」。旧地址跳到 Web 前端榜，以及 Android 场景的长程页签。
- 移除场景「做全栈 SaaS」和「做 iOS App」。一张基准只属于一个场景。全栈组合页保留，模型依据改为命令行场景的 Terminal-Bench，并单独引用 Next.js、Supabase、Convex 和 ReactBench。旧地址分别跳到组合页和场景列表。
- 移除 AIEvalIndex 的模型详情、社区评价、六语言路由和对应测试。日语、韩语、西班牙语、法语不再生成页面。

### 文档

- README 与 `docs/CURRENT.md` 改为当前站点的路由和数据流。

## 记录规范

- 使用 `YYYY-MM-DD` 作为迭代标题；同日多次迭代可继续追加在同一日期下。
- 按 `新增`、`变更`、`修复`、`移除`、`文档` 分类，只保留实际影响。
- 每条记录说明结果，不复述实现过程；破坏性变化必须明确标注。

## 2026-07-24

### 新增

- GPT-5.6 Sol (max) 跑分表接入 OpenAI 发布页的 11 项核心官方评测，覆盖专业工作、编码、计算机使用、多模态、学术与工具使用，并明确排除 Sol Ultra 多智能体成绩。

### 变更

- GPT-5.6 Sol (max) 的 Intelligence Index 改用官方精确值 58.9，比较锚点统一为 Claude Fable 5、GPT-5.5 与 Claude Opus 4.8；OpenAI 成为首要评分来源，Artificial Analysis 继续承载速度、延迟与上下文等独立运行指标。
- 已收录模型的主 Intelligence Index 抽取为轻量单一真相源，详情页与 Header 模型目录不再重复维护分数。

### 修复

- 修复 GPT-5.6 在模型目录、详情页与测试中分别显示 59、59 和 58 的数据漂移。

## 2026-07-20

### 新增

- 新增 GPT-5.6 Sol (max) 六语言静态详情页，复用 K3 的 Hero、跑分对照、社区结论、来源流与 Footer 结构；核心智能、速度、价格、延迟和上下文指标来自用户指定的 Artificial Analysis 页面快照。
- OpenAI 模型加入 Header 模型菜单并开放详情路由，英文路径为 `/models/gpt-5-6-sol/`，其余语言沿用 locale 前缀。

### 变更

- 模型内容契约新增可选模型级 SEO、厂商 logo/官网与指标说明，Hero 不再硬编码 Moonshot 身份，并能正确显示专有模型的权重状态。

### 修复

- 将更名前的 `/models/gpt-5-5-max/` 及其本地化路径纳入静态参数并解析到 GPT-5.6 Sol (max)，修复旧开发标签页在 `output: export` 下触发的 `generateStaticParams` 500 错误；SEO canonical 始终保持新 slug。

## 2026-07-19

### 新增

- Kimi K3 Hero 的 Moonshot AI 厂商署名新增官网外链，并在新页面安全打开。
- Community Verdict 后新增 Community Reviews 原声流：以 blog / X / YouTube 三类平台化卡片呈现四条真实评价来源，关键短语按情绪色与当前语言高亮，并接入真实视频封面与来源外链。
- Header 新增截图同构的 Models 厂商分组菜单：使用 OpenAI、Anthropic、Moonshot、Google 官方 logo 展示十个模型及分数，当前 Kimi K3 可访问，未收录模型保持明确不可用。
- 根路径新增 noindex 临时占位与 Kimi K3 直接入口，为后续正式 Home 保留独立信息架构。

### 变更

- 模型页迁入可扩展 slug 路由：英文使用 `/models/kimi-k3/`，其他五种语言使用 `/{locale}/models/kimi-k3/`；共享模型注册表、页面组装与 SEO metadata，canonical/hreflang 同步新 URL。
- 语言菜单改为在相同模型 slug 间切换语言；Header/Footer 品牌入口统一指向根占位页。
- Kimi Hero 与模型菜单统一使用 `public/model-logos/moonshot.svg`，厂商标记集中到模型 logo 资产目录。
- Benchmark 对照表按编辑式参考重构：新增可开关的 Compare 胶囊筛选、来源虚线链接、蓝色 Kimi 表头与更明确的 Wins 收口线；隐藏比较项时同步重算行内最佳成绩与胜出项，并保留全局 Header 下方的吸顶表头。
- 六语言字典和模型内容契约新增原声流标题、动作标签、卡片展示元数据与逐语言关键短语；Footer 的 Reviews 导航改为直达新板块。
- Community Verdict 按编辑式参考收口：评分面板改为紧凑白底小圆角，情绪分布统一为绿/米灰/红，赢点与短板改为无底色符号加逐行分隔，并移除重复的 Review sources；Community Reviews 去除重复眉标，固定首排三列与次排居中结构，卡片改为 4px 小圆角并支持同卡正负双色短语高亮。
- Community Reviews 的 Peter 视频卡片换用与参考一致的深绿斜纹编辑式封面；六语言新增原声流正负图例，评价数据契约由单组高亮升级为 positive / negative 双组关键短语。
- 顶部四张指标卡改为紧凑圆角布局：数值与单位同排，排名徽章和进度条按强调/中性色区分，说明文案去除重复单位并保持同一底线。
- Footer 收回与正文一致的 `max-w-5xl` 版心，品牌、说明、导航与元信息统一到页面既有的 Newsreader / JetBrains Mono 字阶；桌面改为紧凑三栏，移动端保持自然堆叠。

### 移除

- 移除旧的 `/en/`、`/zh-CN/` 等 locale 首页、根路径语言自动跳转组件与重复的 `public/moonshot.svg`。

## 2026-07-18

### 变更

- Header 新增六语言 Models、Leaderboard、Methodology 桌面端导航，分别定位模型概览、跑分对照与数据方法说明；窄屏隐藏以保留品牌与语言入口。
- Hero 按新版设计稿改版：新增 Reasoning · Multimodal 眉标与右上角发布/权重日期，标题放大至 72px，规格条改为首 token / 输出用量 / 参数量 / 模态四组；四张指标卡换为排名徽章 + 蓝色进度条布局（Intelligence / Output Speed / Price / Context Window）。
- 跑分表去卡片化：移除圆角边框容器，表头下改用深色分隔线，副标题右对齐斜体（"against frontier anchors · higher is better"）；锚点列改用短名（Fable 5 / GPT-5.6 / Opus 4.8），Kimi 列数值统一强调蓝；注释与来源图标默认隐身、行悬停或聚焦时浮现。
- 六语言字典同步新 Hero/指标卡/跑分副标文案；锚点成绩去掉尾缀 `.0`（70 / 73 / 59 / 83 / 91 / 88）。
- 指标卡货币符号修正：Newsreader 的断笔画 `$` 字形在大字号下突兀，统一回落 Georgia 单笔画字形并按 0.82em 缩放。
- 跑分注释提示迁移到 shadcn Base UI Tooltip（新增 `ui/tooltip.tsx`）：portal 渲染 + 浮动定位，修复纯 CSS 绝对定位提示被 `overflow-x-auto` 滚动容器裁剪的问题，默认 100ms 悬停延迟。
- 跑分表移除独立来源列，将注释悬浮提示和新窗口来源入口收拢到 Benchmark 列图标区。
- Kimi K3 成绩列只保留背景高亮，加粗改为按每行数值动态标记最佳成绩。
- 跑分表底部新增六语言胜出项统计，按每行最高分动态计数，并列最高分各记一项。
- Hero 规格条移除顶部横线；跑分表头在页面滚动时吸附于全局 Header 下方。
- Hero 标题新增 Moonshot AI 官方单色标记，与 Kimi K3 名称共同承载模型身份。
- 跑分区标题重构为蓝色眉标、`Kimi K3 vs. frontier anchors` 衬线比较标题与等宽规则说明；六语言同步说明每行最佳成绩加粗。
- Hero 指标卡将四列断点推迟到宽屏，中等宽度改为规整的 2×2 布局，并统一标题区高度，避免标题换行造成数值与进度条错位。
- Hero 的 Moonshot 标记改为与模型名称基线对齐；跑分吸顶表头改用独立内阴影分隔线，并放大 Kimi K3 列名，修复滚动时边线消失与模型层级不足。
- Community Reviews 重构为 Community Verdict：新增本地化结论标题、3.8/5 社区评分与情绪分布、精简赢点/短板双栏，并将长评价卡片收束为紧凑来源回链。
- Footer 重构为全宽编辑式信息区：新增品牌说明、Explore / About 页内导航、首要数据源与更新时间元信息，并完成六语言与移动端布局适配。

## 2026-07-17

### 变更（目录与代码品味重构）

- 顶层文档目录 `dev/`、`todo/` 与根目录 `design-qa.md` 合并为单一 `docs/`（`docs/CURRENT.md`、`docs/design-qa.md`、`docs/archive/`），消除文档三处散落。
- 工具配置 `eslint.config.mjs`、`vitest.config.ts`、`playwright.config.ts` 从 `config/` 移回根目录，恢复生态自动发现；`lint`/`test`/`test:e2e` 脚本不再需要 `--config` 标志。
- 两套根布局的字体声明与 body 样式抽取为 `src/app/shell.tsx` 的 `DocumentShell`，消除重复文档外壳。
- `matchLocale` 改为基础语言码前缀匹配，删除 `zh` 硬编码特殊分支。

### 移除（目录与代码品味重构）

- 删除与 `preview` 重复的 `start` 脚本。
- 删除设计 QA 截图目录与验收记录（原 `dev/design-qa/`、`design-qa.md`）；`AGENTS.md` 新增规则：QA 以文字结论呈现，不向仓库保存截图，`tests/baseline/` 视觉金本不受影响。
- `tests/` 加入 GEB 分形文档系统豁免（测试用例本身即行为契约），清理目录内 README 与测试文件的 L2/L3 契约及 `[PROTOCOL]` 标记，保留普通导航 README。
- 清理本地生成产物 `out/` 与 `test-results/`（均已被 `.gitignore` 覆盖，从不进入版本库，`pnpm build` 可随时再生）。

### 变更

- Header 品牌标记精简为方形汇聚棱镜：移除外部光线，以三块灰阶三角面在内部焦点汇合表达多源评分聚合，并与浏览器标签复用同一透明 PNG 资产。
- Header 收紧标记、字标与垂直留白，校准品牌组合的视觉中心，置顶时保持与页面一致的实色背景。
- 六语言营销副标题迁入 Footer，与数据源、免责声明和翻译说明统一承接页尾信息。
- Header 语言切换器改为仅显示当前国旗的 shadcn Base UI 单选菜单，保留本地语言记忆并完善键盘与读屏交互。
- Header 语言触发器统一为无底色的 Phosphor Globe 图标，切换后不再显示当前语言国旗。

### 新增

- 接入最小化 shadcn `base-nova` 配置、Base UI Dropdown Menu primitive 与六语言国旗/原生名元数据。
- 引入 `@phosphor-icons/react`，统一承载 Header 地球触发器与菜单选中图标。

### 文档

- 增加 `public/` 品牌资产地图与 Header 视觉验收记录，保持代码、资产和架构文档同构。

### 重构

- 将自写模板生成器全量迁移到 Next.js 16 App Router、React 19、strict TypeScript 与 Tailwind CSS 4。
- 将模型 JSON 和六语言 JSON 字典迁为 `satisfies` 校验的类型化内容模块，保留英文双层兜底。
- 将生产输出从 `dist/` 改为 Next.js `out/` 纯静态导出，Vercel 改用框架零配置部署。

### 移除

- 删除 `templates/`、`scripts/`、旧 `data/`、旧 `i18n/`、Tailwind 3 配置与自定义 Vercel 配置。

### 测试

- 增加 Vitest 语言/兜底单测、Playwright 六语言流程测试及四张重构前视觉金本。
- 验证 Next.js 静态构建生成根页、404 和六个语言页面，重构后视觉截图与旧站一致。

### 新增

- 完成 Kimi K3 静态多语言 MVP：Hero、跑分对照、社区评价、共识与数据源回链。
- 增加 en、zh-CN、ja、ko、es、fr 六语言构建、英文兜底、根路径语言检测和 hreflang。
- 增加 `pnpm dev` 本地开发环，支持内容监听重建、Tailwind watch 与静态服务。
- 增加 Vercel 静态部署配置，生产构建输出到 `dist/`。

### 文档

- 将历史需求与设计基线从 `dev/` 迁移到 `todo/`。
- 新增 `dev/CURRENT.md`，作为当前能力、边界与下一步的单一真相源。
- 建立根目录 Changelog，后续迭代统一记录在本文件。
- 新增项目级 `AGENTS.md`，明确 `dev/`、`todo/` 的 GEB 文档豁免和重大更新的 Changelog 约束。
- 清理 `dev/`、`todo/` 现有文件中的 L2/L3 契约与 `[PROTOCOL]` 标记，使目录现状与豁免规则一致。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
