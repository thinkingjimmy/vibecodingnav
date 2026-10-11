# components/

> L2 | 父级: ../README.md

成员清单
arrow-icon.tsx: 服务端页面使用的 Phosphor 箭头，客户端边界
site-header.tsx: 置顶导航、语言切换、主题与搜索对话框
site-footer.tsx: 方法论、数据来源、更新日志与建议链接
frame.tsx: 页头、版心与页脚
leaderboard.tsx: 基准页的完整来源榜，列宽固定，筛选和表头滚动时吸在导航下
benchmark-versions.tsx: 基准页的版本切换，默认当前版本，历史版本仍展示完整原榜
price-chart.tsx: Image-to-WebDev 的分数对混合价格散点
fused-table.tsx: 场景页的融合表，一列一张榜，格子是名次
category-list.tsx: 工具箱类型筛选
copy-block.tsx: 复制安装命令与下载 AGENTS.md
weights.tsx: Phosphor 字重示例
vendor-mark.tsx: 模型与工具的 LobeHub 单色厂商标，没有图标时用字母
eval-table.tsx: 框架评测的基线榜与逐模型变化量，超过 20 行可展开
board-card.tsx: 首页与场景列表共用的榜单卡片
rich-text.tsx: 变更日志里的强调与等宽片段
ui/: 预留给无业务语义的 primitive；当前对话框直接使用 Base UI

法则: Server Component 默认。浏览器状态只在页头、来源榜、融合表、评测表、分类筛选、版本切换和复制块里。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
