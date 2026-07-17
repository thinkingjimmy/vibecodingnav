# components/

> L2 | 父级: ../README.md

成员清单
benchmark-table.tsx: 跑分锚点对照表与来源回链
footer.tsx: 数据源、免责声明、更新时间与翻译说明
header.tsx: 共享汇聚棱镜标记、编辑部风格字标、本地化营销副标题与地球图标语言菜单容器
hero.tsx: 模型标题、元数据与四张指标卡
language-select.tsx: Phosphor 地球触发器、国旗/原生语言单选菜单、客户端语言记忆和静态路由切换
locale-redirect.tsx: 根路径客户端语言检测与 replace 跳转
reviews.tsx: 优缺点共识与社区评价卡片
ui/: shadcn Base UI 无业务语义组件，当前提供 Dropdown Menu primitive

法则: Server Component 默认；浏览器 API 只进入 language-select 与 locale-redirect。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
