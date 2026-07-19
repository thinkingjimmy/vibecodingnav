# lib/

> L2 | 父级: ../README.md

成员清单
contracts.ts: Locale、Dictionary（含 Benchmark Compare 控件、Community Reviews 情绪图例与编辑式 Footer 文案）、ModelEvaluation（含指标单位/色调、社区结论、情绪分布与评价原声流正负关键短语）及共享类型契约
i18n.ts: 六语言字典合并与英文兜底入口
locale.ts: 语言合法性、地区匹配与优先级决策纯函数
model.ts: 模型内容访问与 LocalizedText 英文兜底
site.ts: canonical 域名、共享品牌图标、语言名/国旗元数据与 locale 路径
utils.ts: shadcn UI primitives 共用的 Tailwind 类名合并工具

法则: 纯函数优先·常量集中·页面不直连内容文件

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
