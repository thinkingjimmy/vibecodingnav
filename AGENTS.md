# AIEvalIndex 项目协作规范

本文件补充仓库上层协作规则；与通用规则冲突时，以下规则在本项目范围内优先。

## 文档豁免

- `docs/` 是开发状态、验收记录与历史方案目录（含 `docs/archive/`），不使用 GEB 分形文档系统。
- `tests/` 是测试目录（含 `tests/baseline/`），不使用 GEB 分形文档系统；测试用例本身即行为契约，无需再做文档同构。
- 以上目录内的文件不要求 L1/L2/L3 契约，也不添加 `[PROTOCOL]` 标记。
- 以上目录可以保留普通 README 作为导航，但不承担 GEB 层级映射或强制成员同步职责。
- 项目其他目录仍遵循既有 GEB 文档规则。

## Changelog

- 每次重大更新必须在同一批改动中更新根目录 `CHANGELOG.md`。
- 重大更新包括架构或技术栈调整、核心功能增删、数据契约变化、构建或部署链路变化，以及明显影响用户行为的改动。
- 纯措辞、排版或无行为变化的小修正无需单独记录。
- Changelog 只记录已经落地的结果，使用日期归档，并明确新增、变更、修复、移除或文档影响。

## UI 验证

- 验证页面 UI 时必须使用 Codex 内置 Browser。
- 禁止使用 Browser Use、Chrome 控制或 Computer Use 操作 Chrome 完成 UI 验证。
- 内置 Browser 不可用时应明确报告阻塞，不得静默切换到上述工具。

## QA 截图

- UI 验证与设计 QA 以文字结论呈现，不生成、不保存截图文件到仓库；`docs/` 不收纳验收截图。
- `tests/baseline/` 的视觉回归金本属于自动化测试资产，不受本条约束，仍按既有规则维护。

## 图标

- 新增或修改 UI icon 时必须使用 Phosphor Icons；React 组件统一从 `@phosphor-icons/react` 引入。
- 禁止为新增或修改的功能图标引入其他图标库、手写 SVG 或使用 Emoji 代替。
- 修改历史遗留的非 Phosphor icon 时，应将本次触及的 icon 一并迁移到 Phosphor Icons。
