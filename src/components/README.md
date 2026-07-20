# components/

> L2 | 父级: ../README.md

成员清单
benchmark-table.tsx: Leaderboard 锚点与可交互跑分对照表（Compare 胶囊筛选 + 来源虚线链接、蓝色眉标 + 衬线比较标题 + 等宽规则说明、吸顶常显分隔线、窄屏横向滚动、放大 Kimi 表头与蓝色数据带），按当前可见模型动态标记最佳成绩并统计胜出项，注释走 ui/tooltip
footer.tsx: 与正文共享 max-w-5xl 版心和 Newsreader / JetBrains Mono 字阶的编辑式页脚（Methodology / Data sources 锚点、本地化品牌说明、桌面三栏与移动端顺序堆叠、Explore / About 真实导航、首要数据源、更新时间与版权信息）
header.tsx: 紧凑置顶的共享汇聚棱镜标记、桌面模型目录/页内导航与地球图标语言菜单容器
hero.tsx: Models 锚点、眉标行 + 与文字基线对齐的 Moonshot 标记和超大衬线标题 + 新页打开官网的厂商署名 + 文案右对齐的发布/权重元信息 + 规格条与紧凑两列到四列指标卡（行内单位、语义徽章与等位进度条）
language-select.tsx: Phosphor 地球触发器、国旗/原生语言单选菜单、客户端语言记忆和同模型静态路由切换
model-menu.tsx: Header 桌面 Models 客户端菜单，按四家厂商展示官方 logo、模型分数、当前链接与不可用状态
review-feed.tsx: Community Verdict 后的紧凑三列 Community Reviews 原声流，按 blog / X / YouTube 呈现四条小圆角平台卡片，首排固定 Simon / AIReiter / Peter、次排居中 Lentils，并用绿红双色标注本地化关键短语
reviews.tsx: 编辑式 Community Verdict（本地化结论标题、绿/米灰/红紧凑评分分布与带行分隔的赢点/短板双栏）
ui/: shadcn Base UI 无业务语义组件，当前提供 Dropdown Menu 与 Tooltip primitive

法则: Server Component 默认；浏览器状态只进入 benchmark-table、language-select 与 model-menu。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
