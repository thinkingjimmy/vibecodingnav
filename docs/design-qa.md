# UI 设计 QA

## Header 模型菜单

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-e1548cbb-7f3f-4c52-9dd3-8da90a50b722.png`
- implementation screenshot: `/private/tmp/aievalindex-model-menu-open-1280-final.png`
- focused screenshot: `/private/tmp/aievalindex-model-menu-popup-final.png`
- comparison canvas: `/private/tmp/aievalindex-model-menu-comparison-final.png`
- source size: 1006 × 486；implementation popup: 1014 × 478；desktop viewport: 1280 × 900
- mobile viewport: 390 × 844；主导航隐藏，仅保留品牌和语言入口
- state: `/models/kimi-k3/`，英文，Models 菜单展开

### Full-view comparison evidence

- 桌面菜单保持参考图的三列结构，OpenAI、Anthropic、Moonshot 位于首行，Google 位于 OpenAI 下方；菜单完整落在视口内，页面无横向溢出。
- 10 个模型的名称、顺序和分数严格匹配参考；Kimi K3 使用当前项金色状态并可访问，其余 9 项可见但不可访问。
- 菜单使用现有 Base UI 导航原语，鼠标点击、方向键、Escape、焦点恢复、`aria-current` 与 `aria-disabled` 均有回归覆盖。

### Focused region comparison evidence

- 字体与排版：模型名为 25px Newsreader；厂商标题为 15px JetBrains Mono，分数为 16px JetBrains Mono；三列轨道各约 292px。
- 间距与节奏：实现弹层比参考宽 8px、高度少 8px；发丝线、17px 行内纵向留白和 44px 列间距保持同一视觉密度。
- 颜色：正向、普通与当前状态分别复用 `--model-positive`、`--model-neutral`、`--model-current`；弹层背景、边框和阴影继续使用全站语义 token。
- 图像与图标：厂商图标使用 `public/model-logos/` 中的 OpenAI、Claude、Moonshot、Gemini 官方资产；下拉箭头使用 Phosphor Icons。
- 文案：四个厂商和十个模型完全匹配参考；没有为未上线模型创建虚假链接或详情页。
- 响应式：390px 下 Models、Leaderboard 和 Methodology 整组隐藏，品牌与语言入口稳定保留，页面横向溢出为 0。

### Findings

- 无 P0 / P1 / P2 偏差。
- 可接受 P3：参考使用纯色方块概括厂商，实现遵循需求使用真实厂商 logo；弹层宽高与参考相差不超过 8px。
- 内置 Browser 验证英文菜单、中文跳转、根占位页和移动端隐藏策略；控制台无 error，仅保留既存视频封面的 LCP eager 提示。

### Comparison history

- Pass 1（P2）：初版弹层约 960 × 404，模型字号和行距偏紧；将宽度、模型字号、行内留白与厂商间距调至当前尺度。
- Pass 2：将参考与实现弹层放入同一 2044 × 486 对照画布复核，结构、内容密度和整体尺寸通过。

### Implementation checklist

- [x] 四厂商三列桌面布局与 Google 次行位置
- [x] 十个模型名称、分数、状态与真实 Kimi K3 链接
- [x] 公共厂商 logo 与新 Moonshot Hero 资产
- [x] 键盘、焦点与 ARIA 语义
- [x] 六语言同模型跳转和 slug 保持
- [x] 1280px 桌面与 390px 移动端无溢出

final result: passed

---

## Hero 指标卡

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-5cab768e-79e9-4a34-9e0c-be975ea9fe2d.png`
- implementation screenshot: `/private/tmp/aievalindex-hero-cards-reference-1024.png`
- mobile screenshot: `/private/tmp/aievalindex-hero-cards-reference-mobile.png`
- comparison canvas: `/private/tmp/aievalindex-hero-cards-comparison.png`
- desktop viewport: 1024 × 700；来源图按 2× 密度归一化，并与 984px 实现卡片区同宽比较
- mobile viewport: 390 × 844；两列状态
- state: `/models/kimi-k3/`，默认浅色主题，页面顶部

### Full-view comparison evidence

- 四张卡片均为白色 8px 圆角、浅色边框与极弱阴影；桌面四列、移动端两列，卡高和底部基线一致。
- 信息层级与参考一致：单行等宽标题 + 右上排名徽章 → 衬线主数字与行内单位 → 语义进度条 → 单行说明。
- Intelligence / Context 使用品牌蓝；Output Speed / Price 的徽章与进度条使用中性灰米色，避免所有指标争夺同一强调层级。

### Focused region comparison evidence

- 字体与排版：主数字保持 44px Newsreader；单位、标题、徽章与说明使用 10–11px JetBrains Mono，数值与单位共享基线。
- 间距与节奏：归一化后参考卡片约 238 × 132px，实现为 237 × 136px；标题顶部、主数值起点、98px 进度条基线与 111px 说明起点接近参考。
- 颜色：卡面、边框、品牌蓝、淡蓝徽章与中性徽章全部复用现有 design token；未新增孤立色值。
- 图像质量：目标区域没有图片、插画或非标准图标，不适用。
- 文案：标题缩短为单行；`idx`、`tok/s`、`tok` 移至主数值旁，说明删除重复单位；六语言同步本地化。
- 响应式：390px 下每列 169px，四张卡片无标题/说明溢出，页面横向溢出为 0。

### Findings

- 无 P0 / P1 / P2 偏差。
- 可接受 P3：实现卡片比归一化参考高约 4px，用于保留多语言标题与说明的安全行盒。

### Comparison history

- Pass 1（P2）：初版卡片高 148px，主数值后到进度条的节奏偏松；将卡片收至 136px，并明确 6px 数值/进度条间距，重新同宽比较后通过。

### Implementation checklist

- [x] 单行标题、行内单位与精简说明
- [x] 强调 / 中性徽章与进度条
- [x] 8px 圆角白色卡面和一致底线
- [x] 1024px 四列与 390px 两列无溢出
- [x] 六语言内容契约与视觉回归

final result: passed

---

## Benchmark 比较筛选与表格

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-7b9edc31-449d-489a-b738-f38e2a3e4418.png`
- implementation screenshot: `/private/tmp/aievalindex-benchmark-filter-desktop-final.png`
- filtered-state screenshot: `/private/tmp/aievalindex-benchmark-filtered-1024.png`
- mobile screenshot: `/private/tmp/aievalindex-benchmark-filter-mobile-final.png`
- comparison canvas: `/private/tmp/aievalindex-benchmark-filter-comparison-final.png`
- desktop viewport: 1024 × 700；来源图按 144dpi / @2x 密度归一化为 1024px，并与实现区块同宽比较
- mobile viewport: 390 × 844；三项比较全部选中，表格横向滚动位于起点
- state: `/models/kimi-k3/`，默认浅色主题，页面滚动至 `#leaderboard`

## Full-view comparison evidence

- 参考与实现均形成“比较标题 → Compare 胶囊 → 吸顶表头 → 11 行成绩 → Wins”单一阅读序列；Kimi 列从表头到 Wins 保持连续淡蓝数据带。
- 实现区块高 616.75px，基本对齐归一化参考的 628px 画布；首列约占 34%，四个模型列等分余下宽度。
- 三个胶囊默认选中；取消 GPT-5.6 与 Opus 4.8 后，表头只保留 Kimi K3 / Fable 5，Wins 从 `4 / 3 / 4 / 0` 动态更新为 `6 / 5`。

## Focused region comparison evidence

- 字体与排版：标题继续沿用既有 Newsreader 层级；比较控件与列名使用 JetBrains Mono，模型数据保持等宽表格数字。实现标题略大于新参考，但与 Community Verdict 和既有页面层级一致，属于有意保持的系统一致性。
- 间距与节奏：表体由约 47px 行高收紧至约 39px；Compare 胶囊收至 28px 高，完整区块在 700px 视口内从标题到 Wins 同屏可读。
- 颜色与 token：Kimi 数据带、选中胶囊、最佳成绩和焦点轮廓复用现有 accent / accent-soft；表格背景、发丝线与弱化文字复用全局语义 token。
- 图像质量：目标区没有图片、插画、logo 或非标准图标；胶囊勾选与注释均使用 Phosphor Icons，没有临时图形替代。
- 文案与内容：Compare 控件加入六语言字典；Benchmark 名称改为虚线来源链接，缺失成绩仍显示长破折号，数据与参考一致。
- 响应式：390px 页面横向溢出为 0，仅 `.benchmark-scroll` 从 350px 滚动到 930px；窄屏表头回归自然流，首行不再被 sticky 偏移覆盖。

## Findings

- 无 P0 / P1 / P2 偏差。
- 可接受 P3：参考中的标题和 Benchmark 名称更小；实现保留既有 36px / 17px 编辑式字号，以维持相邻板块的一致层级与来源链接可读性。
- 桌面吸顶实测为全局 Header 底部 57px = 表头顶部 57px，表头底线内阴影和 Kimi 淡蓝背景均持续可见。
- 内置 Browser 依次验证全选、隐藏两列、重新全选、桌面吸顶和移动横向滚动；控制台无 error / warning。

## Comparison history

- Pass 1（P2）：初版区块高约 725px，行距和胶囊明显大于参考；将数据行收至约 39px、胶囊收至 28px，区块高降至 616.75px。
- Pass 2（P2）：移动端横向滚动容器令 `top: 49px` 的 thead 压住首行；680px 以下改为 `top: 0` 的自然表头，桌面继续在全局 Header 下方吸顶。
- Pass 3：同宽并排比较、桌面/移动端实机检查通过；无剩余 P0 / P1 / P2。

## Implementation checklist

- [x] Compare 胶囊支持逐项显示 / 隐藏比较模型
- [x] 当前可见模型驱动最佳成绩和 Wins 重算
- [x] Kimi 表头与整列连续蓝色数据带
- [x] Benchmark 虚线来源链接与 Phosphor 注释提示
- [x] 桌面吸顶底线、移动端横向滚动且首行不重叠
- [x] 六语言文案、键盘焦点和 `aria-pressed` 状态

final result: passed

---

## Community Reviews

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-56cfe181-4402-4b24-a362-9624665a79bf.png`
- implementation screenshot: `/private/tmp/aievalindex-community-reviews-smaller-type-875.png`
- mobile screenshot: `/private/tmp/aievalindex-community-reviews-smaller-type-mobile.png`
- comparison canvas: `/private/tmp/aievalindex-community-reviews-two-to-three-columns.png`
- desktop viewport: 875 × 814；页面同时展示 Community Verdict 与 Community Reviews 的衔接，默认浅色主题
- mobile viewport: 390 × 844；按原始来源顺序单列展示

### Full-view comparison evidence

- 信息层级与参考一致：蓝色等宽眉标 → 与 Community Verdict 同级的衬线标题（`feed` 斜体）→ 简短说明 → 三列原声卡片。
- Community Reviews 与相邻板块共享页面标准版心；文章卡、X 卡与 YouTube 卡保留各自的平台识别，同时继续复用项目字体与颜色 token。
- 只使用现有四条可核验评价来源，不为追求参考图卡片数量虚构作者、账号或互动数据；真实外链和 YouTube 封面均可访问。

### Focused region comparison evidence

- 字体与排版：标题桌面 36px Newsreader；三列卡片的长文章正文桌面 18px / 1.5，X 正文使用 16px sans；作者与平台标题同步下调一个档位，来源标签、日期和动作继续使用 JetBrains Mono。
- 间距与节奏：875px 下使用三条 265px 等宽轨道与 20px 间距，标题到卡片 28px；390px 时按 Simon → Lentils → Peter → AIReiter 顺序单列。
- 颜色：mixed 来源使用暖红边线与浅红 mark，positive 视频使用品牌蓝；背景、阴影、发丝线与文字颜色全部来自现有语义体系。
- 图像与图标：视频卡使用真实 `LSlV206xPqM` YouTube 封面；X、YouTube 与外链动作统一使用 Phosphor Icons，没有手写 SVG 或占位图。
- 文案：标题、说明、动作标签与每条摘要的关键短语均完成六语言契约；高亮短语必须在对应本地化摘要中精确匹配。
- 交互：四张卡片都链接真实来源；Footer Reviews 入口直达 `#community-reviews`；键盘 focus 状态沿用全站蓝色轮廓。

### Findings

- 无 P0 / P1 / P2 偏差。
- 可接受差异：参考图包含六张卡片与互动指标，项目当前只有四条已核验来源且没有已核验的互动数据；实现保留真实内容边界，因此板块总高度短于参考。
- 875px 与 390px 均无横向溢出；最终重载无新增 console error。

### Comparison history

- Pass 1（P2）：沿用 1024px 页面版心导致板块和衬线卡片明显小于参考；将原声区在宽屏扩展到 1160px，并放大标题、说明、正文与卡片 padding。
- Pass 2（P2）：文章卡仍偏紧，仅约 407px 高；将桌面文章正文调至 27px / 1.6、padding 调至 40px，卡片达到约 564px，并同步校准视频卡。
- Pass 3：同宽并排比较通过；两列节奏、标题层级、情绪色高亮和平台差异均接近参考，无剩余 P0 / P1 / P2。
- Pass 4（标注修订）：按相邻板块层级收回独立宽版心，将标题调整为 36px、正文调整为 21px / 1.5，并压缩卡片 padding 与间距；875px 和 390px 重新验收通过。
- Pass 5（标注修订）：移除 blog / X / YouTube 三类卡片的外层圆角，桌面网格由两列改为三列；同时将文章卡署名区改为纵向排列，消除 265px 卡宽下的姓名截断和动作换行。875px 实测为 `265px × 3`，390px 仍为单列。
- Pass 6（标注修订）：卡片正文与作者/平台标题统一下调一个字号档位；875px 下文章正文为 18px、X 正文为 16px，390px 下分别为 17px 与 16px，三列/单列结构及 0px 圆角保持不变。

### Implementation checklist

- [x] Community Reviews 眉标、斜体标题与说明
- [x] blog / X / YouTube 三类平台化卡片
- [x] 四条真实来源、真实视频封面与外链
- [x] 六语言关键短语情绪色高亮
- [x] 875px 三列与 390px 来源顺序单列
- [x] 所有平台卡片外层为 0px 圆角
- [x] Footer 锚点、生产构建、视觉金本与 31 条浏览器回归

final result: passed

---

## Footer

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-0f00cf8a-8c72-4be9-bafb-1bf70fd3a21f.png`
- implementation screenshot: `/private/tmp/aievalindex-footer-implementation-final.png`
- mobile screenshot: `/private/tmp/aievalindex-footer-mobile-2026-07-19.png`
- comparison input: Codex 同一视觉输入并列查看参考图与内置 Browser 实现截图；不向仓库保存 QA 截图
- desktop viewport: 1280 × 720；页面滚动至底部
- mobile viewport: 390 × 844；页面滚动至底部
- state: `/models/kimi-k3/`，默认浅色主题

### Full-view comparison evidence

- Footer 背景继续全宽铺开，但信息层改与上方 `<main>` 共用 `max-w-5xl`：1280px 视口下二者均为 x=128、width=1024。
- 20px 内容内边距后，蓝色短线、品牌说明与底部元信息统一从 x=148 起笔；三栏宽度为 387 / 242 / 242px，Explore / About 起点分别为 x=591 / 890。
- Footer 可见高度约 320px，保持参考图的紧凑底部收束，不再出现独立 1536px 宽容器和超大字号造成的漂浮感。

### Focused region comparison evidence

- 字体与排版：品牌、说明和导航链接统一使用 Newsreader；眉标与元信息使用 JetBrains Mono。桌面说明和导航均为 17px，元信息为 11px。
- 间距与节奏：桌面顶部/底部留白 48px、短线到品牌 24px、导航链接 10px 行距；说明稳定为三行，接近参考图密度。
- 颜色：页脚背景复用 `--bg-subtle`，正文、弱化文字、发丝线和品牌蓝均复用现有语义 token。
- 图像与图标：品牌标记复用真实 `aievalindex-mark.png`，未用 CSS 或临时图形近似。
- 文案：英文品牌说明匹配参考；Explore / About 与来源元信息完成六语言母语化。
- 交互：Models、Leaderboards、Benchmarks、Reviews、Methodology、Data sources 均指向现有页内目标，Artificial Analysis 使用真实外链。

### Findings

- 无 P0 / P1 / P2 偏差。
- 390px 下 Footer 主区与元信息均为 350px 单列，Explore 在 About 之前顺序堆叠；页面无横向溢出。
- 可接受差异：参考图使用纯黑三角品牌标记；实现复用项目真实三面汇聚棱镜，保持全站品牌一致性。
- Footer 自身无浏览器错误；页面仍有一条既存的 Community Reviews 视频封面 LCP `loading="eager"` 提示，不属于本次 Footer 改动。

### Comparison history

- Pass 1（P1）：旧 Footer 使用 1536px 独立版心、26px 说明和 22px 等宽导航，与上方 1024px 正文尺度脱节。
- Pass 2（P2）：收回正文版心和 17px 衬线字阶后，Explore 起点仍偏右；将桌面三栏比例从 1.45/.72/.62 调为 1.15/.72/.72。
- Pass 3：参考图与实现同一输入并列复核通过；版心、三栏落点、字阶与底部元信息节奏均无剩余 P0 / P1 / P2。

### Implementation checklist

- [x] 全宽浅色背景与正文 `max-w-5xl` 共享版心
- [x] 48px 品牌短线、真实品牌标记与紧凑字标
- [x] 品牌标记、字标与三行项目说明
- [x] 桌面三栏 Explore / About 真实导航
- [x] 全宽分隔线与同版心数据来源、更新时间、版权元信息
- [x] 1280px 桌面和 390px 移动端无溢出
- [x] 六语言文案契约闭环
- [x] lint、typecheck、unit、production build 与 34 条 Playwright 回归

final result: passed

---

## Community Verdict

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-69bf71fb-43a3-425a-830b-8c87ba3f72e6.png`
- implementation screenshot: `/private/tmp/aievalindex-verdict-feed-refinement-875.png`
- mobile screenshot: `/private/tmp/aievalindex-verdict-feed-refinement-mobile.png`
- comparison canvas: `/private/tmp/aievalindex-community-refinement-before-after.png`
- desktop viewport: 875 × 814；页面滚动至 `#community-verdict`，默认浅色主题
- mobile viewport: 390 × 844；单列自适应状态

### Full-view comparison evidence

- 信息层级与参考一致：蓝色等宽眉标 → 衬线结论标题 → 直角评分卡 → 赢点/短板双栏。
- 评分卡保留 3.8 / 5、6 条评价和 1/5/0 情绪分布；分段色条、数字色彩与参考图对应。
- 在项目标准内容宽度内复刻参考比例；评价来源已由紧凑卡片承载，不再重复展示独立来源行。

### Focused region comparison evidence

- 字体与排版：沿用 Newsreader、JetBrains Mono 与现有文字 token；结论中的限定短语使用斜体，标题与 Benchmark 比较标题统一为桌面 36px，列表使用桌面 21px 衬线正文。
- 间距与节奏：标题到评分卡为 20px，评分卡桌面最小高度 166px，评分轨道宽 200px；双栏行距 20px，移动端自动收敛为单列。
- 颜色：正向信息复用品牌蓝；mixed、critical 与负向浅底新增语义 token，保持参考图的暖色对比。
- 图像与图标：目标区域无图片；加减号使用 Phosphor Icons，并置于 24px 语义圆底中。
- 文案：英文严格匹配参考；六种语言均由内容契约提供结论、情绪标签与精简赢点/短板。

### Findings

- 无 P0 / P1 / P2 偏差。
- 可接受差异：参考图是独立裁切区块；实现遵循现有页面最大宽度，并由后续 Community Reviews 卡片提供来源回链。
- 桌面与移动端均无横向溢出；最终页面重载后无新增 console warning / error。

### Comparison history

- Pass 1（P2）：评分区和列表相对参考偏紧；将评分轨道从 170px 调整至 200px、评分数字从 72px 调整至 80px、评分卡最小高度设为 166px，并将桌面列表从 23px / 16px 调整为 26px / 20px。
- Pass 2：同尺寸并排比较通过；无剩余 P0 / P1 / P2 问题。
- Pass 3（标注修订）：按页面层级统一要求，将 Community Verdict 标题从 52px 调整为 36px，与 Benchmark 比较标题一致；赢点/短板正文从 26px 调整为 21px，桌面与移动端重新验收通过。
- Pass 4（标注修订）：评分卡改为直角，标题到评分卡从 36px 收紧为 20px，并移除重复的 Review sources 行；875px 与 390px 重新验收通过。

### Implementation checklist

- [x] Community Verdict 眉标与结论标题
- [x] 3.8 / 5 评分与三段情绪分布
- [x] 赢点 / 短板双栏与 Phosphor 加减图标
- [x] 独立 Review sources 行已移除，来源回链由评论卡片承载
- [x] 875px 桌面和 390px 移动端无溢出
- [x] 六语言内容契约闭环

final result: passed
