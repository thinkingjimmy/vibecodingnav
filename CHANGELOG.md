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
