/**
 * [INPUT]: 依赖内容实体契约
 * [OUTPUT]: 对外提供 validateContent，返回可定位的错误列表
 * [POS]: src/content 的构建期校验，被内容入口在导入时执行
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ITEM_TYPES, PERMISSIVE_LICENSES, VENDOR_IDS, type LicenseKind, type LText } from "@/lib/contracts";
import type { Benchmark, BuildPage, ChangeEntry, Item, Model, Result, Scenario, ToolCategory } from "@/lib/contracts";

export interface ContentBundle {
  models: Model[];
  benchmarks: Benchmark[];
  results: Result[];
  scenarios: Scenario[];
  categories: ToolCategory[];
  items: Item[];
  builds: BuildPage[];
  changes: ChangeEntry[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function unique(slugs: string[], label: string, errors: string[]) {
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (!SLUG.test(slug)) errors.push(`${label} slug 不合法: ${slug}`);
    if (seen.has(slug)) errors.push(`${label} slug 重复: ${slug}`);
    seen.add(slug);
  }
}

function text(value: LText, path: string, errors: string[]) {
  if (!value?.zh?.trim() || !value?.en?.trim()) errors.push(`${path} 缺少中文或英文`);
}

function date(value: string, path: string, errors: string[]) {
  if (!DATE.test(value)) {
    errors.push(`${path} 日期不合法: ${value}`);
    return;
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const roundTrip = parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
  if (!roundTrip) errors.push(`${path} 日期不合法: ${value}`);
}

export function validateContent(input: ContentBundle): string[] {
  const errors: string[] = [];
  unique(input.models.map((item) => item.slug), "model", errors);
  unique(input.benchmarks.map((item) => item.slug), "benchmark", errors);
  unique(input.scenarios.map((item) => item.slug), "scenario", errors);
  unique(input.categories.map((item) => item.slug), "category", errors);
  unique(input.items.map((item) => item.slug), "item", errors);
  unique(input.builds.map((item) => item.slug), "build", errors);

  const models = new Set(input.models.map((item) => item.slug));
  const benchmarks = new Set(input.benchmarks.map((item) => item.slug));
  const scenarios = new Set(input.scenarios.map((item) => item.slug));
  const items = new Set(input.items.map((item) => item.slug));
  const builds = new Set(input.builds.map((item) => item.slug));
  const resultKeys = new Set<string>();

  for (const model of input.models) {
    text(model.summary, `model.${model.slug}.summary`, errors);
    text(model.licenseLabel, `model.${model.slug}.license`, errors);
    if (!model.why.length || !model.whyNot.length) errors.push(`model.${model.slug} 缺少为什么选或别选`);
    model.why.forEach((line, index) => text(line, `model.${model.slug}.why.${index}`, errors));
    model.whyNot.forEach((line, index) => text(line, `model.${model.slug}.whyNot.${index}`, errors));
    if (!VENDOR_IDS.includes(model.vendor)) errors.push(`model.${model.slug} 厂商未知`);
    date(model.fetchedAt, `model.${model.slug}.fetchedAt`, errors);
    for (const headline of model.headlines ?? []) {
      if (!benchmarks.has(headline)) errors.push(`model.${model.slug} 头条基准不存在: ${headline}`);
    }
    for (const peer of model.peerTable?.slugs ?? []) {
      if (!models.has(peer)) errors.push(`model.${model.slug} 对照模型不存在: ${peer}`);
    }
  }

  for (const benchmark of input.benchmarks) {
    text(benchmark.measures, `benchmark.${benchmark.slug}.measures`, errors);
    text(benchmark.method, `benchmark.${benchmark.slug}.method`, errors);
    text(benchmark.scoreMeaning, `benchmark.${benchmark.slug}.scoreMeaning`, errors);
    text(benchmark.caveats, `benchmark.${benchmark.slug}.caveats`, errors);
    text(benchmark.updateCadence, `benchmark.${benchmark.slug}.updateCadence`, errors);
    date(benchmark.asOf, `benchmark.${benchmark.slug}.asOf`, errors);
    if (!benchmark.links.length) errors.push(`benchmark.${benchmark.slug} 缺少来源`);
  }

  for (const result of input.results) {
    const key = `${result.benchmark}|${result.label ?? result.modelSlug ?? ""}|${result.effort ?? ""}|${result.agent ?? ""}|${result.arm ?? "baseline"}|${result.rank ?? ""}`;
    if (resultKeys.has(key)) errors.push(`result 重复: ${key}`);
    resultKeys.add(key);
    if (!benchmarks.has(result.benchmark)) errors.push(`result 基准不存在: ${result.benchmark}`);
    if (!result.modelSlug && !result.label) errors.push(`result 缺少模型: ${key}`);
    if (result.modelSlug && !models.has(result.modelSlug)) errors.push(`result 模型不存在: ${result.modelSlug}`);
    if (result.vendor && !VENDOR_IDS.includes(result.vendor)) errors.push(`result 厂商未知: ${key}`);
    if (result.rank != null && result.rank < 1) errors.push(`result 名次不合法: ${key}`);
    if (!Number.isFinite(result.score)) errors.push(`result 分数不合法: ${key}`);
    date(result.asOf, `result.${key}.asOf`, errors);
  }

  for (const scenario of input.scenarios) {
    text(scenario.title, `scenario.${scenario.slug}.title`, errors);
    text(scenario.summary, `scenario.${scenario.slug}.summary`, errors);
    if (scenario.benchmark && !benchmarks.has(scenario.benchmark)) errors.push(`scenario.${scenario.slug} 基准不存在`);
    for (const board of scenario.boards ?? []) {
      if (!benchmarks.has(board.benchmark)) errors.push(`scenario.${scenario.slug} 分表基准不存在: ${board.benchmark}`);
      text(board.label, `scenario.${scenario.slug}.board.${board.id}`, errors);
    }
    if (!scenario.benchmark && !scenario.editorPicks?.length) errors.push(`scenario.${scenario.slug} 既没有基准也没有精选`);
    if (scenario.build && !builds.has(scenario.build)) errors.push(`scenario.${scenario.slug} 组合不存在`);
    for (const related of scenario.related) {
      if (related === scenario.slug || !scenarios.has(related)) errors.push(`scenario.${scenario.slug} 相关场景不存在: ${related}`);
    }
    for (const pick of scenario.editorPicks ?? []) {
      if (!models.has(pick.modelSlug)) errors.push(`scenario.${scenario.slug} 精选模型不存在`);
      text(pick.reason, `scenario.${scenario.slug}.pick`, errors);
    }
  }

  for (const category of input.categories) {
    text(category.title, `category.${category.slug}.title`, errors);
    text(category.summary, `category.${category.slug}.summary`, errors);
    date(category.updatedAt, `category.${category.slug}.updatedAt`, errors);
    const seen = new Set<string>();
    for (const slug of category.items) {
      if (!items.has(slug)) errors.push(`category.${category.slug} 条目不存在: ${slug}`);
      if (seen.has(slug)) errors.push(`category.${category.slug} 条目重复: ${slug}`);
      seen.add(slug);
    }
    for (const slug of category.homeItems ?? []) {
      if (!category.items.includes(slug)) errors.push(`category.${category.slug} 首页条目不在分类里: ${slug}`);
    }
  }

  for (const entry of input.items) {
    if (!ITEM_TYPES.includes(entry.type)) errors.push(`item.${entry.slug} 类型不合法`);
    text(entry.oneLiner, `item.${entry.slug}.oneLiner`, errors);
    text(entry.fitFor, `item.${entry.slug}.fitFor`, errors);
    text(entry.whyPick, `item.${entry.slug}.whyPick`, errors);
    text(entry.whenNot, `item.${entry.slug}.whenNot`, errors);
    date(entry.verifiedAt, `item.${entry.slug}.verifiedAt`, errors);
    if (entry.updatedAt) date(entry.updatedAt, `item.${entry.slug}.updatedAt`, errors);
    if (entry.mark && !VENDOR_IDS.includes(entry.mark)) errors.push(`item.${entry.slug} 标记未知`);
    if (entry.relatedItem && !items.has(entry.relatedItem)) errors.push(`item.${entry.slug} 对应条目不存在`);
    if (entry.eval && !benchmarks.has(entry.eval.benchmark)) errors.push(`item.${entry.slug} 评测不存在`);
    if (entry.eval?.note) text(entry.eval.note, `item.${entry.slug}.eval.note`, errors);
    for (const peer of entry.peers) {
      if (peer === entry.slug || !items.has(peer)) errors.push(`item.${entry.slug} 同类不存在: ${peer}`);
    }
  }

  for (const build of input.builds) {
    text(build.title, `build.${build.slug}.title`, errors);
    text(build.summary, `build.${build.slug}.summary`, errors);
    text(build.agentsMd, `build.${build.slug}.agentsMd`, errors);
    text(build.installCmds, `build.${build.slug}.installCmds`, errors);
    date(build.updatedAt, `build.${build.slug}.updatedAt`, errors);
    if (!scenarios.has(build.scenario)) errors.push(`build.${build.slug} 场景不存在`);
    for (const role of build.roles) {
      for (const ref of [role.primary, ...(role.extras ?? []), ...role.alternatives.map((item) => item.ref)]) {
        if (ref.kind === "model" && !models.has(ref.slug)) errors.push(`build.${build.slug} 模型不存在: ${ref.slug}`);
        if (ref.kind === "item" && !items.has(ref.slug)) errors.push(`build.${build.slug} 条目不存在: ${ref.slug}`);
      }
    }
  }

  for (const change of input.changes) {
    text(change.text, `change.${change.date}`, errors);
    if (!change.source.trim()) errors.push(`change.${change.date} 缺少来源`);
  }

  return errors;
}

export function isPermissiveLicense(license: LicenseKind) {
  return PERMISSIVE_LICENSES.includes(license);
}
