# lib/

> L2 | 父级: ../README.md

成员清单
contracts.ts: Locale、双语文本、内容实体与 UI 字典类型
i18n.ts: 中英字典入口
locale.ts: 英文根路径、中文 `/zh/` 前缀与语言对调
nav.ts: 主导航当前项，首页不选中任何项
site.ts: vibecodingnav.com、90 天过期判断与 hreflang metadata
catalog.ts: 榜单行、挑选、组合解析、当前版本、反向链接与搜索条目
composite.ts: 场景综合分方法 C（相对榜首、加权、缺榜半权中位收缩）与单模型逐步拆解
utils.ts: Tailwind 类名合并

法则: 纯函数优先·常量集中·页面不直连内容文件

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
