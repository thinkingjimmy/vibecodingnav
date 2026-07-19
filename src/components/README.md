# components/

> L2 | 父级: ../README.md

成员清单
benchmark-table.tsx: Leaderboard 锚点与去卡片化跑分对照表（蓝色眉标 + 衬线比较标题 + 等宽规则说明、吸顶常显分隔线、窄屏横向滚动、短锚点名 + 放大 Kimi 表头与蓝色数据带），动态标记每行最佳成绩并统计胜出项，注释走 ui/tooltip，图标行悬停浮现
footer.tsx: 全宽编辑式页脚（Methodology / Data sources 锚点、本地化品牌说明、Explore / About 真实页内导航、首要数据源、更新时间与版权信息）
header.tsx: 紧凑置顶的共享汇聚棱镜标记、桌面端页内主导航与地球图标语言菜单容器
hero.tsx: Models 锚点、眉标行 + 与文字基线对齐的 Moonshot 标记和超大衬线标题 + 发布/权重右侧元信息 + 规格条与两列到四列自适应指标卡（稳定标题区基线）
language-select.tsx: Phosphor 地球触发器、国旗/原生语言单选菜单、客户端语言记忆和静态路由切换
locale-redirect.tsx: 根路径客户端语言检测与 replace 跳转
reviews.tsx: 编辑式 Community Verdict（本地化结论标题、评分情绪分布、精简赢点/短板双栏与原始评价来源回链）
ui/: shadcn Base UI 无业务语义组件，当前提供 Dropdown Menu 与 Tooltip primitive

法则: Server Component 默认；浏览器 API 只进入 language-select 与 locale-redirect。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
