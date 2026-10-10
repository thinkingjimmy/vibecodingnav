/**
 * [INPUT]: 依赖已校验的内容包、字典、路径与 90 天过期判断
 * [OUTPUT]: 对外提供页面可直接渲染的本地化视图、榜单筛选行、组合解析与反向链接
 * [POS]: src/lib 的读取模型，分数与反链在构建时从实体算出，页面不再拼接数据
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { content } from "@/content";
import { isPermissiveLicense } from "@/content/validate";
import {
  ITEM_SEGMENT,
  type BuildPage,
  type Ci,
  type Item,
  type LicenseKind,
  type Locale,
  type Result,
  type ResultArm,
  type RoleRef,
  type Scenario,
  type ScoreUnit,
  type VendorId,
} from "./contracts";
import { getDictionary } from "./i18n";
import { localePath, t } from "./locale";
import { isStale, SITE_SYNC, siteClock } from "./site";

const CLOCK = siteClock();
const { models, benchmarks, results, scenarios, categories, items, builds, changes } = content;

const modelBy = new Map(models.map((model) => [model.slug, model]));
const benchmarkBy = new Map(benchmarks.map((benchmark) => [benchmark.slug, benchmark]));
const itemBy = new Map(items.map((item) => [item.slug, item]));
const scenarioBy = new Map(scenarios.map((scenario) => [scenario.slug, scenario]));
const buildBy = new Map(builds.map((build) => [build.slug, build]));
const categoryBy = new Map(categories.map((category) => [category.slug, category]));

export interface BoardRow {
  key: string;
  rank: number;
  rankSpread?: string;
  name: string;
  vendor: VendorId;
  href: string;
  effort?: string;
  license?: string;
  licenseKind: LicenseKind;
  preliminary?: boolean;
  score: string;
  scoreNumber: number;
  ci?: string;
  ciLow?: number;
  ciHigh?: number;
  votes?: string;
  price?: string;
  context?: string;
}

export interface SearchEntry {
  href: string;
  title: string;
  kicker: string;
  haystack: string;
}

function formatScore(score: number, unit: ScoreUnit) {
  if (unit !== "%" && Number.isInteger(score)) return String(score);
  const hundredths = Math.round(score * 100) / 100;
  const tenths = Math.round(score * 10) / 10;
  if (Math.abs(hundredths - tenths) > 1e-9) return hundredths.toFixed(2);
  return tenths.toFixed(1);
}

function formatDelta(delta: number) {
  if (Math.abs(delta) < 0.001) return "0";
  const text = formatScore(Math.abs(delta), "%");
  return delta > 0 ? `+${text}` : `−${text}`;
}

function formatBound(value: number, decimal: boolean) {
  return decimal ? value.toFixed(1) : String(value);
}

function formatCi(ci: Ci | undefined) {
  if (!ci) return undefined;
  if (ci.kind === "pm") return `±${Number.isInteger(ci.value) ? ci.value : ci.value.toFixed(1)}`;
  const decimal = !Number.isInteger(ci.low) || !Number.isInteger(ci.high);
  return `${formatBound(ci.low, decimal)}–${formatBound(ci.high, decimal)}`;
}

function outputTokenPrice(label?: string) {
  const match = label?.match(/\$([0-9.]+)\s*\/\s*\$([0-9.]+)/);
  return match ? Number(match[2]) : null;
}

function runCostUsd(label?: string) {
  if (!label) return null;
  const thousands = label.match(/\$([0-9.]+)\s*k/i);
  if (thousands) return Number(thousands[1]) * 1000;
  const amount = label.match(/\$([0-9.]+)/);
  return amount ? Number(amount[1]) : null;
}

function scenarioRows(scenario: Scenario) {
  if (!scenario.benchmark) return [];
  const rows = results.filter((result) => result.benchmark === scenario.benchmark);
  if (scenario.subset === "permissive-open") {
    return rows
      .filter((result) => isPermissiveLicense(modelBy.get(result.modelSlug)!.license))
      .sort((a, b) => b.score - a.score || (a.rank ?? 999) - (b.rank ?? 999));
  }
  return rows.filter((result) => result.rank != null).sort((a, b) => a.rank! - b.rank! || b.score - a.score);
}

function bestRow(rows: Result[]) {
  return [...rows].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999) || b.score - a.score)[0];
}

export function resolvePicks(scenarioSlug: string, clock = CLOCK) {
  const scenario = scenarioBy.get(scenarioSlug);
  if (!scenario?.benchmark) return { top: undefined, value: undefined, open: undefined, stale: false };
  const benchmark = benchmarkBy.get(scenario.benchmark)!;
  const stale = Boolean(benchmark.retired || isStale(benchmark.asOf, clock));
  if (stale) return { top: undefined, value: undefined, open: undefined, stale: true };
  const rows = scenarioRows(scenario).filter((row) => scenario.subset === "permissive-open" || row.rank != null);
  const top = bestRow(rows);
  const open = bestRow(rows.filter((row) => isPermissiveLicense(modelBy.get(row.modelSlug)!.license)));
  const costOf = (row: Result) => (scenario.valueMetric === "token" ? outputTokenPrice(row.tokenPrice) : runCostUsd(row.runCost));
  const topCost = top ? costOf(top) : null;
  const value = topCost == null
    ? undefined
    : bestRow(rows.filter((row) => {
        const cost = costOf(row);
        return cost != null && cost <= topCost / 2 + 1e-9;
      }));
  return { top, value, open, stale: false };
}

function toBoardRows(locale: Locale, scenario: Scenario): BoardRow[] {
  const benchmark = scenario.benchmark ? benchmarkBy.get(scenario.benchmark) : undefined;
  const unit = benchmark?.scoreUnit ?? "";
  return scenarioRows(scenario).map((result, index) => {
    const model = modelBy.get(result.modelSlug)!;
    const ciLow = result.ci?.kind === "pm" ? result.score - result.ci.value : result.ci?.low;
    const ciHigh = result.ci?.kind === "pm" ? result.score + result.ci.value : result.ci?.high;
    return {
      key: `${result.modelSlug}-${result.effort ?? index}`,
      rank: scenario.subset === "all" ? result.rank! : index + 1,
      rankSpread: scenario.subset === "all" ? result.rankSpread : undefined,
      name: model.name,
      vendor: model.vendor,
      href: localePath(locale, `/models/${model.slug}`),
      effort: result.effort,
      license: model.license === "proprietary" ? undefined : t(locale, model.licenseLabel),
      licenseKind: model.license,
      preliminary: result.preliminary,
      score: formatScore(result.score, unit),
      scoreNumber: result.score,
      ci: formatCi(result.ci),
      ciLow,
      ciHigh,
      votes: result.votes,
      price: result.tokenPrice ?? result.runCost,
      context: result.context,
    };
  });
}

function itemHref(locale: Locale, item: Item) {
  return localePath(locale, `/${ITEM_SEGMENT[item.type]}/${item.slug}`);
}

function itemMeta(locale: Locale, item: Item, override?: { zh: string; en: string }) {
  if (override) return t(locale, override);
  const dict = getDictionary(locale);
  const kind = dict.type[item.type];
  const extra = item.type === "skill" ? item.author ?? item.license : item.license ?? item.author;
  return extra ? `${kind} · ${extra}` : kind;
}

interface ResolvedRef {
  href: string;
  name: string;
  vendor?: VendorId;
  meta: string;
  slug: string;
  kind: "model" | "item";
}

function resolveRef(locale: Locale, scenario: Scenario, ref: RoleRef, clock: string): ResolvedRef | undefined {
  if (ref.kind === "item") {
    const item = itemBy.get(ref.slug);
    if (!item) return undefined;
    return { href: itemHref(locale, item), name: item.name, meta: itemMeta(locale, item), slug: item.slug, kind: "item" };
  }
  if (ref.kind === "model") {
    const model = modelBy.get(ref.slug);
    if (!model) return undefined;
    return { href: localePath(locale, `/models/${model.slug}`), name: model.name, vendor: model.vendor, meta: t(locale, model.licenseLabel), slug: model.slug, kind: "model" };
  }
  const picks = resolvePicks(scenario.slug, clock);
  const result = picks[ref.pick];
  if (!result || !scenario.benchmark) return undefined;
  const model = modelBy.get(result.modelSlug)!;
  const benchmark = benchmarkBy.get(scenario.benchmark)!;
  const rank = scenario.subset === "all" ? result.rank : scenarioRows(scenario).findIndex((row) => row === result) + 1;
  return {
    href: localePath(locale, `/models/${model.slug}`),
    name: model.name,
    vendor: model.vendor,
    meta: `${benchmark.shortName} #${rank} · ${formatScore(result.score, benchmark.scoreUnit)}`,
    slug: model.slug,
    kind: "model",
  };
}

function alternativeText(locale: Locale, scenario: Scenario, alt: BuildPage["roles"][number]["alternatives"][number], clock: string) {
  const dict = getDictionary(locale);
  const resolved = resolveRef(locale, scenario, alt.ref, clock);
  if (!resolved) return "";
  if (alt.tone === "note") return t(locale, alt.when);
  const picks = resolvePicks(scenario.slug, clock);
  const pick = alt.ref.kind === "pick" ? picks[alt.ref.pick] : undefined;
  const benchmark = scenario.benchmark ? benchmarkBy.get(scenario.benchmark) : undefined;
  const rank = pick?.rank ?? "";
  const score = pick && benchmark ? formatScore(pick.score, benchmark.scoreUnit) : "";
  if (alt.tone === "value") return `${dict.build.value}：${resolved.name}（#${rank} · ${score}，${t(locale, alt.when)}）`;
  const license = pick ? t(locale, modelBy.get(pick.modelSlug)!.licenseLabel) : "";
  return `${dict.build.open}：${resolved.name}（#${rank} · ${license}）`;
}

export function getBuild(locale: Locale, slug: string, clock = CLOCK) {
  const build = buildBy.get(slug);
  if (!build) return undefined;
  const scenario = scenarioBy.get(build.scenario)!;
  const benchmark = scenario.benchmark ? benchmarkBy.get(scenario.benchmark) : undefined;
  const stale = Boolean(benchmark && (benchmark.retired || isStale(benchmark.asOf, clock)));
  const dict = getDictionary(locale);
  const roles = build.roles.map((role) => {
    const primary = resolveRef(locale, scenario, role.primary, clock);
    const extras = (role.extras ?? []).map((ref) => resolveRef(locale, scenario, ref, clock)).filter((ref): ref is ResolvedRef => Boolean(ref));
    if (!primary) {
      if (role.primary.kind === "pick" && stale) {
        return {
          role: t(locale, role.role),
          primary: {
            href: localePath(locale, `/scenarios/${scenario.slug}`),
            name: dict.build.withheld,
            meta: dict.benchmark.stale,
            slug: "",
            kind: "model" as const,
            vendor: undefined,
            stale: true,
          },
          extras: extras.map((extra) => ({ href: extra.href, name: extra.name })),
          alternative: "",
        };
      }
      throw new Error(`组合 ${slug} 的首选无法从榜单解析`);
    }
    return {
      role: t(locale, role.role),
      primary: { ...primary, stale: false, meta: itemBy.has(primary.slug) && role.meta ? itemMeta(locale, itemBy.get(primary.slug)!, role.meta) : role.meta && primary.kind === "item" ? t(locale, role.meta) : primary.meta },
      extras: extras.map((extra) => ({ href: extra.href, name: extra.name })),
      alternative: role.alternatives.map((alt) => alternativeText(locale, scenario, alt, clock)).filter(Boolean).join(" · "),
    };
  });
  const evidence = [
    { href: localePath(locale, `/scenarios/${scenario.slug}`), label: `${dict.build.scenario} · ${t(locale, scenario.title)}` },
    ...build.roles.flatMap((role) => [role.primary, ...(role.extras ?? [])])
      .filter((ref): ref is Extract<RoleRef, { kind: "item" }> => ref.kind === "item")
      .map((ref) => itemBy.get(ref.slug)!)
      .filter((item, index, list) => list.findIndex((other) => other.slug === item.slug) === index)
      .map((item) => ({ href: itemHref(locale, item), label: `${dict.type[item.type]} · ${item.name}` })),
  ];
  return {
    slug: build.slug,
    title: t(locale, build.title),
    summary: t(locale, build.summary),
    updatedAt: build.updatedAt,
    basis: benchmark ? `${benchmark.name} ${benchmark.asOf}` : "",
    agentsMd: t(locale, build.agentsMd),
    installCmds: t(locale, build.installCmds),
    roles,
    notFor: build.notFor.map((row) => ({
      title: t(locale, row.title),
      body: t(locale, row.body),
      href: row.href ? localePath(locale, row.href) : undefined,
    })),
    evidence,
    stale,
    combo: roles.filter((role) => !role.primary.stale).map((role) => role.primary.name).join(" + "),
    href: localePath(locale, `/build/${build.slug}`),
  };
}

for (const build of builds) getBuild("zh", build.slug);

function categoriesForItem(slug: string) {
  return categories.filter((category) => category.items.includes(slug));
}

function buildsForItem(slug: string) {
  return builds.filter((build) => build.roles.some((role) => [role.primary, ...(role.extras ?? []), ...role.alternatives.map((alt) => alt.ref)].some((ref) => ref.kind === "item" && ref.slug === slug)));
}

function buildsForModel(slug: string) {
  return builds.filter((build) => {
    const scenario = scenarioBy.get(build.scenario)!;
    return build.roles.some((role) => [role.primary, ...(role.extras ?? []), ...role.alternatives.map((alt) => alt.ref)].some((ref) => {
      if (ref.kind === "model") return ref.slug === slug;
      if (ref.kind !== "pick") return false;
      return resolvePicks(scenario.slug)[ref.pick]?.modelSlug === slug;
    }));
  });
}

const HOME_BOARD_COUNT = 6;

function scenarioCard(locale: Locale, scenario: (typeof scenarios)[number]) {
  const benchmark = scenario.benchmark ? benchmarkBy.get(scenario.benchmark) : undefined;
  const sourceName = scenario.sourceLabel ? t(locale, scenario.sourceLabel) : benchmark?.name ?? "";
  const editor = Boolean(scenario.editorPicks?.length);
  const rows = editor
    ? scenario.editorPicks!.map((pick, index) => {
        const model = modelBy.get(pick.modelSlug)!;
        return { rank: index + 1, name: model.name, vendor: model.vendor, href: localePath(locale, `/models/${model.slug}`), reason: t(locale, pick.reason) };
      })
    : toBoardRows(locale, scenario).slice(0, 5).map((row) => ({
        rank: row.rank,
        name: row.name,
        vendor: row.vendor,
        href: row.href,
        score: row.score,
        unit: benchmark?.scoreUnit ?? "",
        license: scenario.subset === "permissive-open" ? row.license : undefined,
      }));
  return {
    href: localePath(locale, `/scenarios/${scenario.slug}`),
    title: t(locale, scenario.title),
    sourceName,
    sourceHref: benchmark ? localePath(locale, `/benchmarks/${benchmark.slug}`) : undefined,
    asOf: benchmark?.asOf ?? "",
    rows,
  };
}

export function listScenarioCards(locale: Locale) {
  return scenarios.map((scenario) => scenarioCard(locale, scenario));
}

export function getHome(locale: Locale) {
  const dict = getDictionary(locale);
  const cards = scenarios.filter((scenario) => scenario.featured).slice(0, HOME_BOARD_COUNT).map((scenario) => scenarioCard(locale, scenario));
  return {
    cards,
    categories: categories.map((category) => ({
      href: localePath(locale, `/tools/${category.slug}`),
      title: t(locale, category.title),
      items: (category.homeItems ?? category.items.slice(0, 3)).map((slug) => {
        const item = itemBy.get(slug)!;
        return { href: itemHref(locale, item), name: item.name, type: dict.type[item.type] };
      }),
    })),
    changes: changes.map((change) => ({ date: change.date, kind: dict.kind[change.kind], kindId: change.kind, text: t(locale, change.text), source: change.source })),
    sources: benchmarks.map((benchmark) => ({
      href: localePath(locale, `/benchmarks/${benchmark.slug}`),
      name: benchmark.name,
      date: benchmark.asOf,
      note: benchmark.retired ? dict.home.retired : t(locale, benchmark.domain),
      stale: benchmark.retired || isStale(benchmark.asOf, CLOCK),
    })),
  };
}

export function getScenario(locale: Locale, slug: string) {
  const scenario = scenarioBy.get(slug);
  if (!scenario) return undefined;
  const dict = getDictionary(locale);
  const benchmark = scenario.benchmark ? benchmarkBy.get(scenario.benchmark) : undefined;
  const stale = Boolean(benchmark && (benchmark.retired || isStale(benchmark.asOf, CLOCK)));
  const rows = toBoardRows(locale, scenario);
  const ranked = results.filter((result) => result.benchmark === scenario.benchmark && result.rank != null);
  const build = scenario.build ? getBuild(locale, scenario.build) : undefined;
  return {
    slug,
    title: t(locale, scenario.title),
    summary: t(locale, scenario.summary),
    meta: [
      scenario.sourceLabel ? t(locale, scenario.sourceLabel) : benchmark?.name,
      benchmark ? `${locale === "zh" ? "榜单日期" : "Board"} ${benchmark.asOf}` : locale === "zh" ? `编辑更新 ${SITE_SYNC}` : `Edited ${SITE_SYNC}`,
      benchmark?.votes ? `${benchmark.votes} ${locale === "zh" ? "票" : "votes"}` : "",
      benchmark?.trackedCount ? `${benchmark.trackedCount} ${locale === "zh" ? "个模型" : "models"}` : "",
      `${locale === "zh" ? "本页同步" : "Synced"} ${SITE_SYNC}`,
    ].filter(Boolean).join(" · "),
    note: scenario.note ? t(locale, scenario.note) : scenario.lead === "value" ? dict.scenario.leadNote : "",
    stale,
    combo: build ? { href: build.href, label: build.combo } : undefined,
    rows,
    showFilters: scenario.subset === "all" && rows.length > 0,
    priceLabel: rows.some((row) => row.votes) ? "token" : rows.some((row) => results.some((result) => result.runCost && result.modelSlug && row.name.includes(result.modelSlug))) ? "run" : rows.some((row) => row.price?.includes("/")) ? "token" : "run",
    partial: scenario.subset === "all" && benchmark?.trackedCount && ranked.length < benchmark.trackedCount
      ? dict.scenario.partial.replace("{count}", String(benchmark.trackedCount)).replace("{shown}", String(ranked.length))
      : "",
    explain: benchmark
      ? [
          [dict.benchmark.measures, t(locale, benchmark.measures)],
          [dict.benchmark.method, t(locale, benchmark.method)],
          [dict.benchmark.meaning, t(locale, benchmark.scoreMeaning)],
          [dict.benchmark.caveats, t(locale, benchmark.caveats)],
          [dict.benchmark.cadence, t(locale, benchmark.updateCadence)],
        ]
      : [],
    links: benchmark?.links ?? [],
    why: scenario.whyItMatters.map((item) => ({ title: t(locale, item.title), body: t(locale, item.body) })),
    picks: (scenario.editorPicks ?? []).map((pick) => {
      const model = modelBy.get(pick.modelSlug)!;
      return { href: localePath(locale, `/models/${model.slug}`), name: model.name, vendor: model.vendor, reason: t(locale, pick.reason) };
    }),
    related: scenario.related.map((related) => ({ href: localePath(locale, `/scenarios/${related}`), title: t(locale, scenarioBy.get(related)!.title) })),
  };
}

function bestResult(modelSlug: string, benchmarkSlug: string) {
  const rows = results.filter((result) => result.modelSlug === modelSlug && result.benchmark === benchmarkSlug);
  return rows.length ? bestRow(rows) : undefined;
}

export function getModel(locale: Locale, slug: string) {
  const model = modelBy.get(slug);
  if (!model) return undefined;
  const dict = getDictionary(locale);
  const present = benchmarks
    .map((benchmark) => ({ benchmark, result: bestResult(slug, benchmark.slug) }))
    .filter((row) => row.result && !row.benchmark.retired);
  const headlineOrder = model.headlines ?? present.map((row) => row.benchmark.slug);
  const ordered = [
    ...headlineOrder.map((id) => present.find((row) => row.benchmark.slug === id)).filter((row): row is NonNullable<typeof row> => Boolean(row)),
    ...present.filter((row) => !headlineOrder.includes(row.benchmark.slug)),
  ];
  const stats = ordered.slice(0, 3).map(({ benchmark, result }) => ({
    label: benchmark.name,
    href: localePath(locale, `/benchmarks/${benchmark.slug}`),
    score: formatScore(result!.score, benchmark.scoreUnit),
    unit: benchmark.scoreUnit,
    meta: [result!.rank ? (benchmark.trackedCount ? `#${result!.rank} / ${benchmark.trackedCount}` : `#${result!.rank}`) : "", formatCi(result!.ci)].filter(Boolean).join(" · "),
  }));
  const scoreRows = [
    ...ordered.map(({ benchmark, result }) => ({
      href: localePath(locale, `/benchmarks/${benchmark.slug}`),
      name: benchmark.name,
      setting: result!.setting ?? result!.effort ?? "—",
      score: formatScore(result!.score, benchmark.scoreUnit),
      width: Math.max(8, Math.round((result!.score / Math.max(...results.filter((row) => row.benchmark === benchmark.slug).map((row) => row.score), result!.score)) * 100)),
      ci: formatCi(result!.ci),
      rank: result!.rank ? `#${result!.rank}` : "—",
      cost: result!.runCost ?? "—",
      date: result!.asOf,
      stale: isStale(benchmark.asOf, CLOCK),
      note: "",
    })),
    ...benchmarks.filter((benchmark) => benchmark.retired && !bestResult(slug, benchmark.slug)).map((benchmark) => ({
      href: localePath(locale, `/benchmarks/${benchmark.slug}`),
      name: benchmark.name,
      setting: "—",
      score: "",
      width: 0,
      ci: undefined as string | undefined,
      rank: "—",
      cost: "—",
      date: benchmark.asOf,
      stale: true,
      note: benchmark.retired ? dict.model.retired : dict.model.missing,
    })),
  ];
  const appearances = scenarios.flatMap((scenario) => {
    const pick = scenario.editorPicks?.find((item) => item.modelSlug === slug);
    const rows = scenarioRows(scenario).filter((row) => row.modelSlug === slug);
    if (!pick && rows.length === 0) return [];
    const result = rows.length ? bestRow(rows) : undefined;
    const benchmark = scenario.benchmark ? benchmarkBy.get(scenario.benchmark) : undefined;
    const rank = result ? (scenario.subset === "all" ? result.rank : scenarioRows(scenario).findIndex((row) => row.modelSlug === slug && row.score === result.score) + 1) : undefined;
    return [{
      href: localePath(locale, `/scenarios/${scenario.slug}`),
      title: t(locale, scenario.title),
      role: pick ? t(locale, pick.reason) : rank ? `#${rank}` : dict.model.asPick,
      detail: result && benchmark ? `${benchmark.shortName} ${formatScore(result.score, benchmark.scoreUnit)}${benchmark.scoreUnit}` : "",
    }];
  });
  const peerBenchmarks = model.peerTable?.benchmarks ?? ordered.slice(0, 1).map((row) => row.benchmark.slug);
  const peerSlugs = model.peerTable ? [slug, ...model.peerTable.slugs] : [slug, ...ordered.slice(0, 1).flatMap(({ benchmark, result }) => scenarioRows({ ...scenarios[0], benchmark: benchmark.slug, subset: "all" }).filter((row) => row.rank && result?.rank && Math.abs(row.rank - result.rank) <= 2 && row.modelSlug !== slug).map((row) => row.modelSlug))];
  const uniquePeers = peerSlugs.filter((peer, index) => peerSlugs.indexOf(peer) === index);
  return {
    slug,
    name: model.name,
    vendor: model.vendor,
    summary: t(locale, model.summary),
    meta: [model.vendorName, t(locale, model.licenseLabel), model.context === "—" ? "" : `${locale === "zh" ? "上下文" : "Context"} ${model.context}`, model.priceLabel === "—" ? "" : `${model.priceLabel} ${dict.model.perMillion}`, model.agents.length ? `${dict.model.agents} ${model.agents.join(" / ")}` : "", `${dict.model.fetched} ${model.fetchedAt}`].filter(Boolean).join(" · "),
    stats,
    scoreRows,
    why: model.why.map((line) => t(locale, line)),
    whyNot: model.whyNot.map((line) => t(locale, line)),
    appearances,
    builds: buildsForModel(slug).map((build) => {
      const view = getBuild(locale, build.slug)!;
      return { href: view.href, title: t(locale, scenarioBy.get(build.scenario)!.title), detail: view.combo };
    }),
    peers: {
      columns: peerBenchmarks.map((id) => benchmarkBy.get(id)!.shortName),
      rows: uniquePeers.map((peer) => {
        const other = modelBy.get(peer)!;
        return {
          href: localePath(locale, `/models/${peer}`),
          name: other.name,
          vendor: other.vendor,
          current: peer === slug,
          scores: peerBenchmarks.map((id) => {
            const result = bestResult(peer, id);
            const benchmark = benchmarkBy.get(id)!;
            return result ? `${formatScore(result.score, benchmark.scoreUnit)}${benchmark.scoreUnit}` : "—";
          }),
          price: other.priceLabel,
        };
      }),
    },
  };
}

export function getCategory(locale: Locale, slug: string) {
  const category = categoryBy.get(slug);
  if (!category) return undefined;
  const dict = getDictionary(locale);
  const rows = category.items.map((itemSlug) => {
    const item = itemBy.get(itemSlug)!;
    return {
      href: itemHref(locale, item),
      name: item.name,
      type: item.type,
      typeLabel: dict.type[item.type],
      oneLiner: t(locale, item.oneLiner),
      fitFor: t(locale, item.fitFor),
      meta: [item.license, item.homepage?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") ?? item.repo?.replace(/^https?:\/\/(www\.)?/, "")].filter(Boolean).join(" · "),
    };
  });
  const counts = (["library", "skill", "plugin", "prompt", "tool"] as const)
    .map((type) => ({ label: dict.type[type], count: rows.filter((row) => row.type === type).length }))
    .filter((row) => row.count > 0);
  return {
    slug,
    title: t(locale, category.title),
    summary: t(locale, category.summary),
    meta: [...counts.map((row) => `${row.label} ${row.count}`), `${dict.tools.updated} ${category.updatedAt}`].join(" · "),
    rows,
    how: category.howToPick.map((tip) => ({ title: t(locale, tip.title), body: t(locale, tip.body) })),
    builds: builds.filter((build) => category.items.some((item) => buildsForItem(item).includes(build))).map((build) => ({ href: localePath(locale, `/build/${build.slug}`), title: t(locale, scenarioBy.get(build.scenario)!.title) })),
    others: categories.filter((other) => other.slug !== slug).map((other) => ({ href: localePath(locale, `/tools/${other.slug}`), title: t(locale, other.title) })),
  };
}

export function getItem(locale: Locale, type: Item["type"], slug: string) {
  const item = itemBy.get(slug);
  if (!item || item.type !== type) return undefined;
  const dict = getDictionary(locale);
  const related = item.relatedItem ? itemBy.get(item.relatedItem) : undefined;
  return {
    ...item,
    typeLabel: dict.type[item.type],
    oneLiner: t(locale, item.oneLiner),
    fitFor: t(locale, item.fitFor),
    whyPick: t(locale, item.whyPick),
    whenNot: t(locale, item.whenNot),
    caveats: item.caveats ? t(locale, item.caveats) : "",
    installNote: item.installNote ? t(locale, item.installNote) : "",
    install: item.install.map((block) => ({ label: t(locale, block.label), cmd: block.cmd })),
    usage: item.usage ? { label: t(locale, item.usage.label), cmd: item.usage.cmd } : undefined,
    does: (item.does ?? []).map((row) => ({ title: t(locale, row.title), body: t(locale, row.body) })),
    compatible: (item.compatible ?? []).map((row) => ({ agent: row.agent, note: t(locale, row.note), via: row.via })),
    meta: [item.license, item.author, item.homepage?.replace(/^https?:\/\//, ""), item.repo?.replace(/^https?:\/\//, ""), item.version, item.platforms, item.format, item.updatedAt ? `${dict.tools.updated} ${item.updatedAt}` : ""].filter(Boolean).join(" · "),
    peers: item.peers.map((peer) => {
      const other = itemBy.get(peer)!;
      return { href: itemHref(locale, other), name: other.name, type: dict.type[other.type], oneLiner: t(locale, other.oneLiner), meta: other.license };
    }),
    related: related ? { href: itemHref(locale, related), name: related.name, type: dict.type[related.type] } : undefined,
    categories: categoriesForItem(slug).map((category) => ({ href: localePath(locale, `/tools/${category.slug}`), title: t(locale, category.title) })),
    builds: buildsForItem(slug).map((build) => ({ href: localePath(locale, `/build/${build.slug}`), title: t(locale, scenarioBy.get(build.scenario)!.title) })),
    scenarios: buildsForItem(slug).map((build) => scenarioBy.get(build.scenario)!).map((scenario) => ({ href: localePath(locale, `/scenarios/${scenario.slug}`), title: t(locale, scenario.title) })),
    evalView: item.eval ? frameworkEval(locale, item.eval.benchmark, item.eval.mode, item.caveats ? t(locale, item.caveats) : "") : undefined,
  };
}

function armRows(benchmarkSlug: string, arm: ResultArm) {
  return results.filter((result) => result.benchmark === benchmarkSlug && (result.arm ?? "baseline") === arm);
}

function resultKey(result: Result) {
  return `${result.modelSlug}|${result.effort ?? ""}`;
}

function frameworkEval(locale: Locale, benchmarkSlug: string, mode: "board" | "uplift" | "unverified", note = "") {
  const benchmark = benchmarkBy.get(benchmarkSlug)!;
  const dict = getDictionary(locale);
  const baseline = armRows(benchmarkSlug, "baseline").sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  const assisted = new Map(armRows(benchmarkSlug, "assisted").map((result) => [resultKey(result), result]));
  const web = new Map(armRows(benchmarkSlug, "web").map((result) => [resultKey(result), result]));
  const rows = baseline.flatMap((result) => {
    const model = modelBy.get(result.modelSlug)!;
    const pair = assisted.get(resultKey(result));
    const webRow = web.get(resultKey(result));
    if (mode === "uplift" && !pair) return [];
    return [{
      rank: result.rank,
      name: model.name,
      vendor: model.vendor,
      href: localePath(locale, `/models/${model.slug}`),
      setting: result.setting ?? result.effort,
      baseline: formatScore(result.score, benchmark.scoreUnit),
      assisted: pair ? formatScore(pair.score, benchmark.scoreUnit) : undefined,
      web: webRow ? formatScore(webRow.score, benchmark.scoreUnit) : undefined,
      delta: pair ? formatDelta(pair.score - result.score) : undefined,
      cost: result.runCost,
    }];
  });
  return {
    href: localePath(locale, `/benchmarks/${benchmark.slug}`),
    name: benchmark.name,
    kind: benchmark.kind,
    kindLabel: t(locale, benchmark.domain),
    asOf: benchmark.asOf,
    version: benchmark.version,
    mode,
    rows: mode === "unverified" ? [] : rows,
    showWeb: mode === "board" && web.size > 0,
    assistedLabel: benchmark.assistedLabel ? t(locale, benchmark.assistedLabel) : dict.item.evalUplift,
    webLabel: benchmark.webLabel ? t(locale, benchmark.webLabel) : "",
    note: note || t(locale, benchmark.caveats),
  };
}

export function getBenchmark(locale: Locale, slug: string) {
  const benchmark = benchmarkBy.get(slug);
  if (!benchmark) return undefined;
  return {
    slug,
    name: benchmark.name,
    asOf: benchmark.asOf,
    stale: benchmark.retired || isStale(benchmark.asOf, CLOCK),
    retired: Boolean(benchmark.retired),
    domain: t(locale, benchmark.domain),
    measures: t(locale, benchmark.measures),
    method: t(locale, benchmark.method),
    scoreMeaning: t(locale, benchmark.scoreMeaning),
    caveats: t(locale, benchmark.caveats),
    updateCadence: t(locale, benchmark.updateCadence),
    links: benchmark.links,
    version: benchmark.version,
    kind: benchmark.kind,
    board: benchmark.kind ? frameworkEval(locale, slug, "board") : undefined,
    scenarios: scenarios.filter((scenario) => scenario.benchmark === slug).map((scenario) => ({ href: localePath(locale, `/scenarios/${scenario.slug}`), title: t(locale, scenario.title) })),
  };
}

export function listModels(locale: Locale) {
  return models
    .map((model) => {
      const best = results.filter((result) => {
        if (result.modelSlug !== model.slug || !result.rank || (result.arm ?? "baseline") !== "baseline") return false;
        const board = benchmarkBy.get(result.benchmark)!;
        return !board.kind && !board.retired && !isStale(board.asOf, CLOCK);
      }).sort((a, b) => a.rank! - b.rank!)[0];
      const benchmark = best ? benchmarkBy.get(best.benchmark) : undefined;
      return {
        href: localePath(locale, `/models/${model.slug}`),
        name: model.name,
        vendor: model.vendor,
        vendorName: model.vendorName,
        license: t(locale, model.licenseLabel),
        context: model.context,
        price: model.priceLabel,
        best: best && benchmark ? `${benchmark.shortName} #${best.rank}` : "—",
        rank: best?.rank ?? 999,
      };
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
}

export function listBuilds(locale: Locale) {
  return builds.map((build) => ({ href: localePath(locale, `/build/${build.slug}`), title: t(locale, build.title), summary: t(locale, build.summary) }));
}

export function listCategories(locale: Locale) {
  return getHome(locale).categories;
}

export function listBenchmarks(locale: Locale) {
  return benchmarks.map((benchmark) => ({
    href: localePath(locale, `/benchmarks/${benchmark.slug}`),
    name: benchmark.name,
    date: benchmark.asOf,
    domain: benchmark.retired ? getDictionary(locale).home.retired : t(locale, benchmark.domain),
    stale: benchmark.retired || isStale(benchmark.asOf, CLOCK),
    summary: t(locale, benchmark.measures),
  }));
}

export function getChanges(locale: Locale) {
  return getHome(locale).changes;
}

export function searchEntries(locale: Locale): SearchEntry[] {
  const dict = getDictionary(locale);
  const entries: SearchEntry[] = [
    ...scenarios.map((scenario) => ({ href: localePath(locale, `/scenarios/${scenario.slug}`), title: t(locale, scenario.title), kicker: dict.nav.scenarios, haystack: `${scenario.slug} ${scenario.title.zh} ${scenario.title.en}` })),
    ...models.map((model) => ({ href: localePath(locale, `/models/${model.slug}`), title: model.name, kicker: dict.nav.models, haystack: `${model.slug} ${model.name} ${model.vendorName}` })),
    ...categories.map((category) => ({ href: localePath(locale, `/tools/${category.slug}`), title: t(locale, category.title), kicker: dict.nav.tools, haystack: `${category.slug} ${category.title.zh} ${category.title.en}` })),
    ...items.map((item) => ({ href: itemHref(locale, item), title: item.name, kicker: dict.type[item.type], haystack: `${item.slug} ${item.name} ${item.oneLiner.zh} ${item.oneLiner.en}` })),
    ...builds.map((build) => ({ href: localePath(locale, `/build/${build.slug}`), title: t(locale, build.title), kicker: dict.nav.builds, haystack: `${build.slug} ${build.title.zh} ${build.title.en}` })),
    ...benchmarks.map((benchmark) => ({ href: localePath(locale, `/benchmarks/${benchmark.slug}`), title: benchmark.name, kicker: dict.nav.benchmarks, haystack: `${benchmark.slug} ${benchmark.name}` })),
  ];
  return entries.map((entry) => ({ ...entry, haystack: entry.haystack.toLowerCase() }));
}

export function slugs(kind: "scenarios" | "models" | "benchmarks" | "categories" | "builds") {
  const map = { scenarios, models, benchmarks, categories, builds };
  return map[kind].map((entry) => entry.slug);
}

export function itemSlugs(type: Item["type"]) {
  return items.filter((item) => item.type === type).map((item) => item.slug);
}
