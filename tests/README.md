# tests/

测试目录。本目录不使用 GEB 分形文档系统，文件无需 L1/L2/L3 契约或 `[PROTOCOL]` 标记；测试用例本身即行为契约。

## 文件

- locale.test.ts: 语言元数据、默认语言模型路径与模型 slug 注册表（Vitest）
- i18n.test.ts: UI 字典和内容字段英文兜底（Vitest）
- site.spec.ts: 根占位、六语言模型路由、模型/语言菜单、品牌一致性、SEO、响应式与截图回归（Playwright）
- baseline/: 视觉回归金本，仅在确认视觉变更后更新

## 运行

单测（`pnpm test`）不依赖构建；E2E（`pnpm test:e2e`）先生成 `out/`，再由 serve 在 8080 提供静态站。
