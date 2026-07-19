<!--
- [INPUT]: 依赖代码、数据、配置与 docs/CURRENT.md 的实际变更
- [OUTPUT]: 对外提供按时间倒序排列的项目迭代记录
- [POS]: 项目根目录的版本记忆；docs/CURRENT.md 描述现在，docs/archive/ 保存历史方案，本文件记录演进过程
- [PROTOCOL]: 变更时更新此头部，然后检查 README.md
-->

# Changelog

本文件记录 AIEvalIndex 的有效迭代。最新记录置顶；尚未完成的工作留在 `docs/CURRENT.md`，只有已经落地的变化进入这里。

## 记录规范

- 使用 `YYYY-MM-DD` 作为迭代标题；同日多次迭代可继续追加在同一日期下。
- 按 `新增`、`变更`、`修复`、`移除`、`文档` 分类，只保留实际影响。
- 每条记录说明结果，不复述实现过程；破坏性变化必须明确标注。

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
