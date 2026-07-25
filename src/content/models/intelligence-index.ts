/**
 * [INPUT]: 无运行时依赖，承接已收录模型的主 Intelligence Index 数值
 * [OUTPUT]: 对外提供详情页、Header 目录与测试共享的 INTELLIGENCE_INDEX 单一真相源
 * [POS]: src/content/models 的轻量评分索引，避免模型内容与导航目录重复定义同一智能分
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export const INTELLIGENCE_INDEX = {
  "gpt-5-6-sol": 58.9,
  "kimi-k3": 57,
} as const;
