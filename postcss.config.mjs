/**
 * [INPUT]: 依赖 @tailwindcss/postcss
 * [OUTPUT]: 对外提供 Next.js CSS 管线的 Tailwind CSS 4 PostCSS 插件
 * [POS]: 根目录的唯一 PostCSS 配置，被 next dev 与 next build 自动加载
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
const postcssConfig = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default postcssConfig;
