/**
 * [INPUT]: 依赖 ESLint 9、eslint-config-next 的 Core Web Vitals 与 TypeScript 规则
 * [OUTPUT]: 对外提供全项目静态质量规则与生成目录忽略清单
 * [POS]: 根目录的代码质量配置，被 eslint 自动发现
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "out/**",
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
