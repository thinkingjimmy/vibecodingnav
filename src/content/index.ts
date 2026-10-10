/**
 * [INPUT]: 依赖各内容文件与 validateContent
 * [OUTPUT]: 对外提供通过构建期校验的内容包
 * [POS]: src/content 的唯一出口，页面与目录查询都从这里进入
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { benchmarks } from "./benchmarks";
import { builds } from "./builds";
import { categories } from "./categories";
import { changes } from "./changes";
import { items } from "./items";
import { models } from "./models";
import { results } from "./results";
import { scenarios } from "./scenarios";
import { validateContent, type ContentBundle } from "./validate";

export const content: ContentBundle = { models, benchmarks, results, scenarios, categories, items, builds, changes };

const errors = validateContent(content);
if (errors.length > 0) {
  throw new Error(`内容校验失败:\n${errors.join("\n")}`);
}
