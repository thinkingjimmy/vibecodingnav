# UI 设计 QA

## Benchmark 标题

- source visual truth: `/Users/jimmywong/Library/Application Support/CleanShot/media/media_6TLrS25Klt/CleanShot 2026-07-18 at 18.58.44@2x.png`
- implementation screenshot: `/private/tmp/aievalindex-benchmark-implementation.png`
- comparison canvas: `/private/tmp/aievalindex-benchmark-comparison.png`
- viewport: 876 × 814；参考图按 @2x 归一化为 876 × 115
- state: `/en/`，页面滚动至 `#leaderboard`，默认浅色主题

## Full-view comparison evidence

- 信息层级与参考一致：蓝色全大写眉标 → 36px Newsreader 比较标题 → 右侧等宽全大写规则说明 → 表头。
- 比较标题与规则说明共享底部基线；规则文案的右对齐位置、字距和颜色与参考一致。
- 保留既有内容驱动的表格列宽、Kimi 蓝色数据带与吸顶行为；这些不属于本次标注的标题样式变更。

## Focused region comparison evidence

- 已对标题区域做同宽 876px 聚焦对比；字体、间距、颜色和文案均清晰可读，无需额外局部截图。
- 字体与排版：Newsreader / Inter / JetBrains Mono 沿用现有设计系统；字号、斜体、字重、行高和字距匹配参考层级。
- 间距与节奏：眉标到标题约 4px，标题到表头约 8px；标题与规则说明在 716px 仍同排，390px 时规则说明自然换行。
- 颜色：背景、正文、弱化文字和蓝色强调全部复用全局 token。
- 图像质量：目标区域无图像资产，不适用。
- 文案：英文与参考一致；其余五种语言按相同语义补齐比较短语和加粗规则。

## Findings

- 无 P0 / P1 / P2 偏差。
- 可接受差异：参考截图自带约 20px 外部裁切留白；实现中的区块间距由 Hero `pb-12` 统一控制，不在组件内部重复添加。

## Comparison history

- Pass 1: 参考图与实现同宽合成比较；未发现需要修复的 P0 / P1 / P2 问题。

## Implementation checklist

- [x] 蓝色 Benchmarks 眉标
- [x] 模型名 + 比较短语衬线标题，锚点短语斜体
- [x] 右侧全大写规则说明
- [x] 716px 同排、390px 无溢出
- [x] 表头吸顶与横向滚动行为不回归
- [x] 六语言内容契约闭环

final result: passed

---

## Footer

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-756645bb-96e1-4c1d-82fb-fe1c2cf1fccd.png`
- implementation screenshot: `/private/tmp/aievalindex-footer-implementation-final.jpg`
- mobile screenshot: `/private/tmp/aievalindex-footer-mobile-final.jpg`
- comparison canvas: `/private/tmp/aievalindex-footer-comparison-final.jpg`
- desktop viewport: 1726 × 800；参考页脚裁切为 y=34–582，实现页脚裁切为 y=273–800 后按同宽归一化
- mobile viewport: 390 × 844；页面滚动至底部
- state: `/en/`，默认浅色主题

### Full-view comparison evidence

- 全宽浅色页脚、左侧品牌说明、右侧 Explore / About 导航与底部元信息区的构图与参考一致。
- 内容起点 x=143px，接近参考的 x=136px；96px 蓝色短线、双栏导航起点和底部分隔线位置均对齐。
- 实现页脚高约 526px，参考主体约 548px；差异来自未渲染无对应页面的 Contact / RSS / Terms / Privacy，不影响整体视觉节奏。

### Focused region comparison evidence

- 字体与排版：品牌和说明继续使用 Newsreader，导航与元信息使用 JetBrains Mono；桌面字号、行高和三行说明换行与参考一致。
- 间距与节奏：桌面顶部留白 80px，短线到品牌 48px，链接约 49px 一行；390px 时品牌、说明、双栏导航和元信息依次堆叠。
- 颜色：页脚背景复用 `--bg-subtle`，正文、弱化文字、发丝线和品牌蓝均复用现有语义 token。
- 图像与图标：品牌标记复用真实 `aievalindex-mark.png`，未用 CSS 或临时图形近似。
- 文案：英文品牌说明匹配参考；Explore / About 与来源元信息完成六语言母语化。
- 交互：Models、Leaderboards、Benchmarks、Reviews、Methodology、Data sources 均指向现有页内目标，Artificial Analysis 使用真实外链。

### Findings

- 无 P0 / P1 / P2 偏差。
- 可接受差异：Contact、RSS、Terms、Privacy 在项目中没有真实路由或地址，因此未创建假链接；版权区保持右对齐。
- 桌面与移动端均无横向溢出；最终重载后无新增 console warning / error。

### Comparison history

- Pass 1（P2）：桌面导航字号和纵向密度小于参考，说明仅换两行；将品牌字标调至 36px、说明调至 26px / 500px、导航调至 22px，并拉开链接行距。
- Pass 2：同宽并排比较通过；说明稳定为三行，导航节奏、底部分隔线和整体高度已接近参考，无剩余 P0 / P1 / P2。

### Implementation checklist

- [x] 全宽浅色 Footer 与 96px 品牌短线
- [x] 品牌标记、字标与三行项目说明
- [x] Explore / About 真实导航
- [x] 数据来源、更新时间与版权元信息
- [x] 1726px 桌面和 390px 移动端无溢出
- [x] 六语言文案契约闭环

final result: passed

---

## Community Verdict

- source visual truth: `/var/folders/rk/_1dby6rx6yn5w9_nxbvg42kr0000gn/T/codex-clipboard-69bf71fb-43a3-425a-830b-8c87ba3f72e6.png`
- implementation screenshot: `/private/tmp/aievalindex-community-verdict-implementation-final.png`
- comparison canvas: `/private/tmp/aievalindex-community-verdict-comparison-final.png`
- desktop viewport: 1274 × 742；页面滚动至 `#community-verdict`，默认浅色主题
- mobile viewport: 390 × 844；单列自适应状态

### Full-view comparison evidence

- 信息层级与参考一致：蓝色等宽眉标 → 大号衬线结论标题 → 圆角评分卡 → 赢点/短板双栏。
- 评分卡保留 3.8 / 5、6 条评价和 1/5/0 情绪分布；分段色条、数字色彩与参考图对应。
- 在项目既有 984px 内容宽度内复刻参考比例，并保留紧凑的原始评价来源回链，不恢复旧版长卡片。

### Focused region comparison evidence

- 字体与排版：沿用 Newsreader、JetBrains Mono 与现有文字 token；结论中的限定短语使用斜体，标题与 Benchmark 比较标题统一为桌面 36px，列表使用桌面 21px 衬线正文。
- 间距与节奏：评分卡桌面最小高度 166px，评分轨道宽 200px；双栏行距 20px，移动端自动收敛为单列。
- 颜色：正向信息复用品牌蓝；mixed、critical 与负向浅底新增语义 token，保持参考图的暖色对比。
- 图像与图标：目标区域无图片；加减号使用 Phosphor Icons，并置于 24px 语义圆底中。
- 文案：英文严格匹配参考；六种语言均由内容契约提供结论、情绪标签与精简赢点/短板。

### Findings

- 无 P0 / P1 / P2 偏差。
- 可接受差异：参考图是独立裁切区块；实现遵循现有页面最大宽度，并在区块底部补充可追溯的评价来源。
- 桌面与移动端均无横向溢出；最终页面重载后无新增 console warning / error。

### Comparison history

- Pass 1（P2）：评分区和列表相对参考偏紧；将评分轨道从 170px 调整至 200px、评分数字从 72px 调整至 80px、评分卡最小高度设为 166px，并将桌面列表从 23px / 16px 调整为 26px / 20px。
- Pass 2：同尺寸并排比较通过；无剩余 P0 / P1 / P2 问题。
- Pass 3（标注修订）：按页面层级统一要求，将 Community Verdict 标题从 52px 调整为 36px，与 Benchmark 比较标题一致；赢点/短板正文从 26px 调整为 21px，桌面与移动端重新验收通过。

### Implementation checklist

- [x] Community Verdict 眉标与结论标题
- [x] 3.8 / 5 评分与三段情绪分布
- [x] 赢点 / 短板双栏与 Phosphor 加减图标
- [x] 原始评价来源回链
- [x] 1274px 桌面和 390px 移动端无溢出
- [x] 六语言内容契约闭环

final result: passed
