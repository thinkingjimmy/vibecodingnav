/**
 * [INPUT]: 依赖 @playwright/test 与本地静态预览服务
 * [OUTPUT]: 对外提供 Chromium 端到端测试、视觉基线与 8080 端口编排配置
 * [POS]: 根目录的浏览器验收配置，被 playwright 自动发现、tests/site.spec.ts 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  reporter: "list",
  snapshotPathTemplate: "{testDir}/baseline/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "./node_modules/.bin/serve out -l 8080",
    url: "http://127.0.0.1:8080/en/",
    reuseExistingServer: true,
  },
});
