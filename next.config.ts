/**
 * [INPUT]: 依赖 Next.js 16 静态导出能力
 * [OUTPUT]: 对外提供 out/ 纯静态产物、目录式 trailing-slash 路由，以及 LobeHub 图标的转译
 * [POS]: 根目录的 Next.js 构建配置，取代 scripts/build.mjs 与 vercel.json
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  turbopack: { root: process.cwd() },
  transpilePackages: ["@lobehub/icons"],
};

export default nextConfig;
