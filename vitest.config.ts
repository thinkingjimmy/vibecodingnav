/**
 * [INPUT]: 依赖 Vitest 与 src/ 的 @ 路径别名
 * [OUTPUT]: 对外提供 Node 环境纯函数单元测试配置
 * [POS]: 根目录的单元测试配置，被 vitest 自动发现
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
