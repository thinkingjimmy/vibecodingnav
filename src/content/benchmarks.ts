/**
 * [INPUT]: 依赖 Benchmark 契约
 * [OUTPUT]: 对外提供场景共用的基准与已停更的对照基准
 * [POS]: src/content 的方法论实体
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Benchmark, LText } from "@/lib/contracts";

const tx = (zh: string, en: string): LText => ({ zh, en });

export const benchmarks: Benchmark[] = [
  {
    slug: "lmarena-webdev",
    name: "LMArena WebDev",
    shortName: "WebDev",
    scoreUnit: "",
    asOf: "2026-10-08",
    votes: "852,934",
    trackedCount: 142,
    table: "webdev",
    sourceFilter: "license",
    domain: tx("前端", "Frontend"),
    measures: tx(
      "前端 Web 开发：落地页、交互组件、小游戏和完整页面，也包括需要多步推理和工具调用的 Agent 编程流程。",
      "Frontend web work: landing pages, interactive components, small games, and full pages, including agent flows that need several steps and tool calls.",
    ),
    method: tx(
      "用户提交一个需求，两个匿名模型各自生成可交互的 Web 应用，在沙盒里跑起来；用户试用后投票选胜方或平局，只有身份揭晓前的投票计入。",
      "A person submits a brief. Two anonymous models each build an interactive web app and run it in a sandbox. The person votes after trying them. Only votes cast before the identities are revealed count.",
    ),
    scoreMeaning: tx(
      "用 Bradley-Terry 模型从两两对战结果估计相对强度，读法类似国际象棋的 Elo：差 100 分约等于 64% 的胜率。± 是 95% 置信区间，名次下方的区间表示统计上可能的名次范围。",
      "A Bradley-Terry model turns pairwise votes into a strength score, read a bit like chess Elo: 100 points is about a 64% win rate. ± is the 95% interval. The band under the rank is the statistically plausible rank range.",
    ),
    caveats: tx(
      "衡量的是人类偏好（好不好看、能不能跑），不是测试通过率；需求多是单页 demo，对大型代码库和长程重构参考有限。同一模型不同推理档位（max / high）分开排名。标“初步”的模型票数少，名次可能变动。",
      "It measures human preference (does it look right, does it run), not test pass rate. Briefs are mostly single-page demos, so it says little about large codebases or long refactors. Effort tiers of the same model are ranked separately. Preliminary rows have few votes and can move.",
    ),
    updateCadence: tx(
      "持续更新。本页榜单日期 2026-10-08，2026-10-10 同步；每周同步一次，变化写入首页「最新变化」。",
      "Updated continuously. This page's board date is 2026-10-08, synced 2026-10-10. We sync weekly and write changes on the home page.",
    ),
    links: [
      { label: "lmarena.ai/leaderboard/webdev", href: "https://lmarena.ai/leaderboard/webdev" },
      { label: "arena.ai/blog/webdev-arena", href: "https://arena.ai/blog/webdev-arena" },
      { label: "github.com/lmarena/arena-rank", href: "https://github.com/lmarena/arena-rank" },
    ],
  },
  {
    slug: "android-bench-1",
    name: "Android Bench 1.0",
    shortName: "Android Bench",
    scoreUnit: "%",
    asOf: "2026-10-06",
    trackedCount: 32,
    table: "android-1",
    sourceFilter: "weights",
    domain: tx("移动端", "Mobile"),
    measures: tx("Android 上的标准任务：新功能、库迁移，以及 Kotlin / Compose 相关的修改。", "Standard Android tasks: new features, library migrations, and Kotlin / Compose changes."),
    method: tx(
      "Android 官方 Android Bench 的 1.0 任务表。分数是多次运行的平均通过率。页面用 weight___open / weight___closed 区分开源权重和闭源，本页筛选沿用这个标记，不重排名次。",
      "The 1.0 task table on the official Android Bench. The score is the average pass rate across runs. The page marks rows weight___open or weight___closed. This page filters on that mark and does not renumber.",
    ),
    scoreMeaning: tx(
      "百分比是任务通过率。CI、平均耗时（小时）和平均成本与来源表同一行。",
      "The percent is the task pass rate. CI, average latency in hours, and average cost are the same cells as the source table.",
    ),
    caveats: tx(
      "前几名的区间经常重叠，分差很小时不要只看名次。长程任务在同一页的 2.0 长程表，不另开场景。来源表头把 CI 写成了 Cl range。",
      "Intervals at the top often overlap. A small gap is not a reason to pay for first place. Long-horizon tasks are the 2.0 table on the same page, not a separate scenario. The source heading spells the CI column as Cl range.",
    ),
    updateCadence: tx(
      "页面最新动态写到 2026-10-06。本页于 2026-10-10 与 developer.android.com/bench 的 1.0 表逐行核对，32 行全部收录。",
      "The page's latest update is 2026-10-06. This page checked all 32 rows of the 1.0 table against developer.android.com/bench on 2026-10-10.",
    ),
    links: [
      { label: "developer.android.com/bench", href: "https://developer.android.com/bench" },
      { label: "methodology", href: "https://developer.android.com/bench/methodology/1" },
    ],
  },
  {
    slug: "terminal-bench-4",
    name: "Terminal-Bench 4.0",
    shortName: "Terminal-Bench",
    scoreUnit: "%",
    asOf: "2026-10-06",
    trackedCount: 35,
    table: "terminal",
    domain: tx("终端 Agent", "Terminal agents"),
    measures: tx("终端里的 Agent 任务：安装环境、改配置、跑命令、把自动化做完。", "Agent tasks in a terminal: install a toolchain, edit config, run commands, and finish the automation."),
    method: tx(
      "公开榜单 Terminal-Bench 4.0 的全部 display 行。列与来源一致：Agent、模型、档位、通过率、发布日期、Agent 机构、模型机构、Tokens、成本。并列名次保留来源名次，不改成连续序号。",
      "Every display row on the public Terminal-Bench 4.0 board. Columns match the source: agent, model, effort, accuracy, release date, agent org, model org, tokens, and cost. Tied ranks keep the source rank.",
    ),
    scoreMeaning: tx(
      "通过率用榜单上的 display accuracy，例如 64.8% ± 3.1%，不用未展示的原始小数。成本用 display cost。Grok 4.7 的成本格写着 partial: 324/330。",
      "Accuracy is the board's display accuracy, such as 64.8% ± 3.1%, not the unpublished raw decimal. Cost is display cost. The Grok 4.7 cost cell says partial: 324/330.",
    ),
    caveats: tx("它不衡量界面好不好看。同一通过率下，跑分成本可以差一个数量级。", "It does not measure whether a UI looks right. At a similar pass rate, run cost can differ by an order of magnitude."),
    updateCadence: tx("榜单 updated_at 为 2026-10-06。本页于 2026-10-10 核对全部 35 行。", "The board updated_at is 2026-10-06. This page checked all 35 rows on 2026-10-10."),
    links: [{ label: "tbench.ai", href: "https://tbench.ai" }],
  },
  {
    slug: "android-bench-2-long",
    name: "Android Bench 2.0 长程",
    shortName: "Android 长程",
    scoreUnit: "%",
    asOf: "2026-10-06",
    trackedCount: 10,
    table: "android-long",
    sourceFilter: "weights",
    domain: tx("移动端", "Mobile"),
    measures: tx("跨模块、耗时很长的 Android 改造：完整功能，而不是单点修改。", "Long Android changes across modules: a whole feature, not a single edit."),
    method: tx(
      "developer.android.com/bench 的 Long-horizon task results。每一行是模型加 agent harness。列是通过率、CI、完成度、平均耗时和平均成本。",
      "Long-horizon task results on developer.android.com/bench. Each row is a model plus its agent harness. Columns are pass rate, CI, completion, average latency, and average cost.",
    ),
    scoreMeaning: tx(
      "百分比是 30 个任务的平均通过率。完成度是失败时离做完还有多近。耗时单位是小时，成本是一整次跑分。",
      "The percent is the average pass rate across 30 tasks. Completion is how close a failed run got. Latency is in hours. Cost is one full run.",
    ),
    caveats: tx(
      "整体通过率不高，置信区间很宽，第一名 18.7–47.3 和第二名 13.3–42.0 重叠。这张表在 Android 场景里，不单独成场景。",
      "Pass rates are low and intervals are wide. First place, 18.7–47.3, overlaps second place, 13.3–42.0. This table lives on the Android scenario.",
    ),
    updateCadence: tx(
      "页面最新的 agent 结果写着 2026-10-06。本页于 2026-10-10 与 #long-horizon-task-results 逐行核对，10 行全部收录。",
      "The page's newest agent results are dated 2026-10-06. This page checked all 10 rows against #long-horizon-task-results on 2026-10-10.",
    ),
    links: [{ label: "developer.android.com/bench", href: "https://developer.android.com/bench" }],
  },
  {
    slug: "sudo-l7",
    name: "sudo L7",
    shortName: "sudo L7",
    scoreUnit: "%",
    asOf: "2026-10-09",
    trackedCount: 12,
    table: "score",
    domain: tx("工程判断", "Engineering judgment"),
    measures: tx(
      "生产仓库里的改动与架构决策：发现风险、该不该做、怎么验证、怎么把决定说清楚。60 道题由 staff 及以上工程师编写，多数来自私有生产仓库，也有开源项目。",
      "Production changes and architecture decisions: spotting risk, pushing back, verifying, and explaining the call. 60 tasks written by staff-level engineers, mostly from private production repositories, plus open source.",
    ),
    method: tx(
      "Surge AI 的 sudo L7。专家为每道题写评分细则，模型对照细则打分，并用单元测试、静态分析等可执行检查作证据。博客称共八个维度，点名的有功能正确性、实践判断、思路协作（Thought Partnership）、验证、工程工艺（Engineering Craft）、如实报告（Truthful Reporting）和沟通。",
      "Surge AI's sudo L7. Experts write a rubric for each task. Models grade against it, with unit tests, static analysis, and other executable checks as evidence. The blog describes eight dimensions and names functional correctness, practical judgment, thought partnership, verification, engineering craft, truthful reporting, and communication.",
    ),
    scoreMeaning: tx(
      "百分比是没有漏掉必要要求的任务比例。榜单页只公布这一列。功能正确性上前四名接近：Sol 82.4%，Opus 5.5 82.1%，Astra 81.5%，Sonnet 5.5 79.6%。思路协作上 Opus 76.1%、Sonnet 74.8%，Sol 53.0%、Astra 51.6%。沟通上 Sonnet 72.4%，Sol 44.1%。",
      "The percent is the share of assignments completed without missing essential requirements. The leaderboard page publishes only that column. Functional correctness for the top four is close: Sol 82.4%, Opus 5.5 82.1%, Astra 81.5%, Sonnet 5.5 79.6%. Thought partnership is 76.1% for Opus and 74.8% for Sonnet, against 53.0% for Sol and 51.6% for Astra. Communication is 72.4% for Sonnet and 44.1% for Sol.",
    ),
    caveats: tx(
      "榜很新，只有 60 题，任务集不公开。评分由模型对照专家细则完成。Surge 是 AI 数据供应商。博客里的单任务成本是约数，榜单页没有成本列。",
      "The board is new, the set is 60 tasks, and the tasks stay private. Models grade against expert rubrics. Surge is an AI data vendor. Per-task costs in the blog are approximate; the leaderboard page has no cost column.",
    ),
    updateCadence: tx(
      "博客发布于 2026-10-08，榜单页最后发布于 2026-10-09。本页于 2026-10-10 同步公开榜上的 12 行。",
      "The blog was published on 2026-10-08. The leaderboard page was last published on 2026-10-09. This page synced the 12 public rows on 2026-10-10.",
    ),
    links: [
      { label: "surgehq.ai/benchmarks/sudo-l7", href: "https://surgehq.ai/benchmarks/sudo-l7" },
      { label: "surgehq.ai/blog/sudo-l7", href: "https://surgehq.ai/blog/sudo-l7" },
    ],
  },
  {
    slug: "supabase-evals",
    name: "Supabase Evals",
    shortName: "Supabase",
    scoreUnit: "%",
    asOf: "2026-10-10",
    trackedCount: 6,
    kind: "framework",
    version: "23 tasks × 3 runs",
    domain: tx("框架官方评测", "Framework eval"),
    assistedLabel: tx("有 Skills", "With skills"),
    measures: tx(
      "模型在 Supabase 上做认证、数据库、RLS、存储和排障。23 道题，每题跑 3 次，共 69 次检查。",
      "Models do auth, database, RLS, storage, and debugging work on Supabase. 23 tasks, 3 runs each, 69 checks.",
    ),
    method: tx(
      "Supabase 官方 evals。基线是 no-skills：不加载 supabase 与 supabase-postgres-best-practices。对照臂加载这些 Skills。两列分开，不合成一个通过率。",
      "The official Supabase evals. The baseline is no-skills: the supabase and supabase-postgres-best-practices skills stay unloaded. The other arm loads them. The two columns stay separate and are not merged into one pass rate.",
    ),
    scoreMeaning: tx(
      "百分比是 69 次检查里的通过次数。名次按无 Skills 的基线排列。变化量是有 Skills 减去基线，单位是百分点，可以为 0 或负数。",
      "The percent is passes out of 69 checks. Rank follows the no-skills baseline. The change is with-skills minus baseline, in percentage points, and it can be zero or negative.",
    ),
    caveats: tx(
      "Supabase 自己出题、自己评分。测的是模型加上 Supabase，不是框架之间的高低。只有 6 个模型、23 题。厂商既是题目作者也是评分方。",
      "Supabase writes the tasks and grades them. This measures a model together with Supabase, not one framework against another. Six models and 23 tasks. The vendor authors the tasks and grades them.",
    ),
    updateCadence: tx(
      "2026-10-10 从 supabase/evals 的结果汇总。结果文件没有单独的提交版本号，版本记为 23 题 × 3 次。",
      "Aggregated on 2026-10-10 from the supabase/evals results. The file has no separate commit version, so the version is recorded as 23 tasks × 3 runs.",
    ),
    links: [
      { label: "supabase.com/evals", href: "https://supabase.com/evals" },
      { label: "github.com/supabase/evals", href: "https://github.com/supabase/evals" },
    ],
  },
  {
    slug: "nextjs-evals",
    name: "Next.js Agent Evals",
    shortName: "Next.js",
    scoreUnit: "%",
    asOf: "2026-09-25",
    trackedCount: 14,
    kind: "framework",
    version: "pass@4 · 2026-09-25",
    domain: tx("框架官方评测", "Framework eval"),
    assistedLabel: tx("有 AGENTS.md", "With AGENTS.md"),
    measures: tx(
      "模型做真实的 Next.js 任务。当前榜是仍在重跑的 agent。更早的「Previously measured」不并进这一列。",
      "Models do real Next.js tasks. The current board is the agents that are still rerun. The older Previously measured rows are not folded into this column.",
    ),
    method: tx(
      "Vercel / Next.js 官方 evals。成功标准是 pass@4：四次里有一次通过即算过。基线没有 AGENTS.md。对照臂带上打包的 Next.js 文档。两列分开。",
      "The official Vercel / Next.js evals. Success is pass@4: one pass in four attempts counts. The baseline has no AGENTS.md. The other arm gets the bundled Next.js docs. The columns stay separate.",
    ),
    scoreMeaning: tx(
      "百分比是同一套题上的 pass@4。名次按没有 AGENTS.md 的基线，并保留来源页上的名次。变化量是有 AGENTS.md 减去基线。",
      "The percent is pass@4 on one task set. Rank follows the no-AGENTS.md baseline and keeps the source page's order. The change is with AGENTS.md minus baseline.",
    ),
    caveats: tx(
      "Vercel 自己出题、自己评分。测的是模型加上 Next.js，不是框架之间的高低。前排多在 90% 以上，贴近天花板。Pixel Canary（OpenCode）在来源页排第 5，基线 90%，有 AGENTS.md 为 97%，成本 N/A。本站没有这个模型的厂商身份，所以没有单独模型页，名次仍按来源页保留。",
      "Vercel writes the tasks and grades them. This measures a model together with Next.js, not one framework against another. The front sits above 90%, near the ceiling. Pixel Canary (OpenCode) is 5th on the source page, 90% baseline and 97% with AGENTS.md, cost N/A. This site has no vendor identity for that model, so it has no model page. Its rank stays the source rank.",
    ),
    updateCadence: tx(
      "来源页写明最后一次运行是 2026-09-25。本页于 2026-10-10 同步当前榜，不含 Previously measured。",
      "The source page dates the last run 2026-09-25. This page synced the current board on 2026-10-10 and left out Previously measured.",
    ),
    links: [{ label: "nextjs.org/evals", href: "https://nextjs.org/evals" }],
  },
  {
    slug: "convex-evals",
    name: "Convex Evals",
    shortName: "Convex",
    scoreUnit: "%",
    asOf: "2026-10-08",
    trackedCount: 13,
    kind: "framework",
    version: "92a60e0bb2f156b5ac44e6ea3f5d03a91deb434b9d002d14819d1fc2b6e35cdb",
    domain: tx("框架官方评测", "Framework eval"),
    webLabel: tx("无指南 + 网页", "No guidelines + web"),
    measures: tx(
      "模型写 Convex 代码并实际跑起来。当前版本 112 题。基线是 No Guidelines：不提供指南，也不能上网。",
      "Models write Convex code and the harness runs it. The current version has 112 tasks. The baseline is No Guidelines: no supplied guidelines and no web access.",
    ),
    method: tx(
      "Convex 官方 coding evals。名次只用 No Guidelines。No Guidelines + Web 是另一列：可以搜索和打开网页，仍然没有指南。两列不平均、不相加。",
      "The official Convex coding evals. Rank uses only No Guidelines. No Guidelines + Web is another column: the model may search and open pages, still without guidelines. The columns are not averaged or added.",
    ),
    scoreMeaning: tx(
      "百分比是 112 题上的通过率，保留到两位小数。网页列只在该模型有这次运行时出现，缺测不是 0 分。",
      "The percent is the pass rate on 112 tasks, kept to two decimals. The web column appears only when that model has a run. A missing run is not a zero.",
    ),
    caveats: tx(
      "Convex 自己出题、自己评分。测的是模型加上 Convex，不是框架之间的高低。前排接近满分。With Guidelines 没有收录：2026-10-10 查询公开接口 runs:leaderboardScores，参数 experiment=with_guidelines 返回服务器错误。页面上的 With Guidelines 标签没有对应的 experiment 字段。不把未带 experiment 的默认查询当成这一臂。",
      "Convex writes the tasks and grades them. This measures a model together with Convex, not one framework against another. The front is near the ceiling. With Guidelines is omitted: on 2026-10-10 the public query runs:leaderboardScores with experiment=with_guidelines returned a server error. The With Guidelines tab has no experiment field. The unscoped default query is not treated as that arm.",
    ),
    updateCadence: tx(
      "版本 92a60e0bb2f156b5ac44e6ea3f5d03a91deb434b9d002d14819d1fc2b6e35cdb，铸造时间 2026-10-08。本页于 2026-10-10 从 fabulous-panther-525.convex.cloud 同步 No Guidelines（13 个模型）和 No Guidelines + Web（8 个模型）。",
      "Version 92a60e0bb2f156b5ac44e6ea3f5d03a91deb434b9d002d14819d1fc2b6e35cdb, minted 2026-10-08. This page synced No Guidelines (13 models) and No Guidelines + Web (8 models) from fabulous-panther-525.convex.cloud on 2026-10-10.",
    ),
    links: [
      { label: "convex.dev/evals", href: "https://www.convex.dev/evals" },
      { label: "No Guidelines", href: "https://www.convex.dev/evals/coding/no-guidelines" },
      { label: "No Guidelines + Web", href: "https://www.convex.dev/evals/coding/no-guidelines-with-web" },
    ],
  },
  {
    slug: "reactbench",
    name: "ReactBench",
    shortName: "ReactBench",
    scoreUnit: "%",
    asOf: "2026-10-10",
    trackedCount: 76,
    kind: "ecosystem",
    version: "v1.2",
    domain: tx("生态评测", "Ecosystem eval"),
    measures: tx(
      "在真实 React 仓库里做写功能和修问题。v1.2 有 39 题、37 个仓库、76 个配置。运行方是 Million，不是 React 团队，也不是 Meta。",
      "Write features and fix issues in real React repositories. v1.2 has 39 tasks, 37 repositories, and 76 configurations. Million runs it. The React team does not, and neither does Meta.",
    ),
    method: tx(
      "公开数据 reactbench.com/data 的 v1.2 榜。每个推理档位单独一行，不把同一模型的多档合成一个分数。本页列出能对应到站内模型的 47 行，名次是 76 行全榜里的名次。",
      "The v1.2 board in the public reactbench.com/data file. Each effort tier is its own row. Tiers of one model are not merged into one score. This page lists the 47 rows that map to models on this site. The rank is the rank in the full 76-row board.",
    ),
    scoreMeaning: tx(
      "百分比是通过率。区间是数据文件里的置信区间。成本是该配置的平均花费。",
      "The percent is the pass rate. The interval is the confidence interval in the data file. Cost is the average spend of that configuration.",
    ),
    caveats: tx(
      "这是生态评测，不是 React 或 Meta 的官方评测。不要写成「官方」，也不要和 Supabase、Next.js、Convex 的官方评测合成一个数。数据文件没有单独的运行日期，版本是 v1.2。76 个配置里，没有对应站内模型的行不在这张表上。",
      "This is an ecosystem eval, not an official React or Meta eval. Do not call it official, and do not merge it with the Supabase, Next.js, or Convex evals into one number. The data file has no separate run date. The version is v1.2. Configurations without a model on this site are left off this table.",
    ),
    updateCadence: tx("2026-10-10 同步 reactbench.com/data 的 v1.2。", "Synced v1.2 of reactbench.com/data on 2026-10-10."),
    links: [{ label: "reactbench.com/data", href: "https://www.reactbench.com/data" }],
  },
  {
    slug: "swe-bench-verified",
    name: "SWE-bench Verified",
    shortName: "SWE-bench",
    scoreUnit: "%",
    asOf: "2026-02-26",
    retired: true,
    domain: tx("停更", "Retired"),
    measures: tx("真实 GitHub issue 的修复通过率。", "Pass rate on real GitHub issues."),
    method: tx("SWE-bench Verified。本站所见的最后更新日期是 2026-02-26，其后未见新一代模型被收录。", "SWE-bench Verified. The last update we show is 2026-02-26. Newer model generations are not listed after that."),
    scoreMeaning: tx("百分比是 issue 修复通过率。", "The percent is the issue-fix pass rate."),
    caveats: tx("超过 90 天未更新，不作为主要证据。", "Older than 90 days. Not primary evidence."),
    updateCadence: tx("自 2026 年 2 月起未收录新一代模型。", "No new-generation models have been added since February 2026."),
    links: [{ label: "swebench.com", href: "https://www.swebench.com" }],
  },
  {
    slug: "aider-polyglot",
    name: "Aider Polyglot",
    shortName: "Aider",
    scoreUnit: "%",
    asOf: "2025-11-20",
    retired: true,
    domain: tx("停更", "Retired"),
    measures: tx("多语言代码编辑的通过率。", "Pass rate on polyglot code edits."),
    method: tx("Aider Polyglot 榜。最后更新日期 2025-11-20。", "The Aider Polyglot board. Last update 2025-11-20."),
    scoreMeaning: tx("百分比是编辑通过率。", "The percent is the edit pass rate."),
    caveats: tx("榜单已停更，不作为主要证据。", "The board has stopped. Not primary evidence."),
    updateCadence: tx("2025-11-20 之后无更新。", "No update after 2025-11-20."),
    links: [{ label: "aider.chat/docs/leaderboards", href: "https://aider.chat/docs/leaderboards/" }],
  },
];
