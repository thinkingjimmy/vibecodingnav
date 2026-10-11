/**
 * [INPUT]: 依赖路径字符串，不读页面
 * [OUTPUT]: 对外提供主导航的当前项；首页两边语言都不选中任何项
 * [POS]: src/lib 的导航高亮，中英路径在比较前先去掉 /zh
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

export const NAV_KEYS = ["scenarios", "models", "tools", "builds", "benchmarks"] as const;
export type NavKey = (typeof NAV_KEYS)[number];

const SECTIONS: { key: NavKey; prefixes: string[] }[] = [
  { key: "scenarios", prefixes: ["/scenarios"] },
  { key: "models", prefixes: ["/models"] },
  { key: "tools", prefixes: ["/tools", "/libraries", "/skills", "/plugins", "/prompts", "/apps"] },
  { key: "builds", prefixes: ["/build"] },
  { key: "benchmarks", prefixes: ["/benchmarks"] },
];

function sectionPath(path: string) {
  const bare = path.replace(/\/$/, "") || "/";
  return bare.replace(/^\/zh(?=\/|$)/, "") || "/";
}

function matches(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function activeNav(path: string): NavKey | undefined {
  const rest = sectionPath(path);
  return SECTIONS.find((section) => section.prefixes.some((prefix) => matches(rest, prefix)))?.key;
}
