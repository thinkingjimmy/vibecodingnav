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
    asOf: "2026-08-11",
    domain: tx("移动端", "Mobile"),
    measures: tx("Android 上的标准任务：新功能、库迁移，以及 Kotlin / Compose 相关的修改。", "Standard Android tasks: new features, library migrations, and Kotlin / Compose changes."),
    method: tx(
      "Android 官方 Android Bench。分数是多次运行的平均通过率，成本是一整次跑分的平均花费。",
      "The official Android Bench. The score is the average pass rate across runs. Cost is the average spend of one full run.",
    ),
    scoreMeaning: tx("百分比是任务通过率。区间是公布的置信区间。", "The percent is the task pass rate. The range is the published confidence interval."),
    caveats: tx(
      "前几名的区间经常重叠，分差很小时不要只看名次。长程、跨模块的改造在另一张榜上。",
      "Intervals at the top often overlap. A small gap is not a reason to pay for first place. Long, cross-module work is a different board.",
    ),
    updateCadence: tx("榜单日期 2026-08-11。超过 90 天未更新则不再作为主要证据。", "Board date 2026-08-11. Older than 90 days, it stops being primary evidence."),
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
    asOf: "2026-10-10",
    domain: tx("终端 Agent", "Terminal agents"),
    measures: tx("终端里的 Agent 任务：安装环境、改配置、跑命令、把自动化做完。", "Agent tasks in a terminal: install a toolchain, edit config, run commands, and finish the automation."),
    method: tx("公开榜单 Terminal-Bench 4.0。分数是任务通过率。本页收录榜单前排，设置与成本以公布行为准。", "The public Terminal-Bench 4.0 board. The score is a pass rate. This page lists the front of the board, with the published setting and cost."),
    scoreMeaning: tx("百分比是通过率。成本列是单次完整跑分的花费，不是每百万 token 的标价。", "The percent is the pass rate. The cost column is one full run, not the per-million-token price."),
    caveats: tx("它不衡量界面好不好看。同一通过率下，跑分成本可以差一个数量级。", "It does not measure whether a UI looks right. At a similar pass rate, run cost can differ by an order of magnitude."),
    updateCadence: tx("本页同步 2026-10-10。变化写入首页「最新变化」。", "Synced 2026-10-10. Changes are written on the home page."),
    links: [{ label: "tbench.ai", href: "https://tbench.ai" }],
  },
  {
    slug: "android-bench-2-long",
    name: "Android Bench 2.0 长程",
    shortName: "Android 长程",
    scoreUnit: "%",
    asOf: "2026-10-10",
    trackedCount: 10,
    domain: tx("移动端", "Mobile"),
    measures: tx("跨模块、耗时很长的 Android 改造：完整功能，而不是单点修改。", "Long Android changes across modules: a whole feature, not a single edit."),
    method: tx("Android Bench 的长程榜。分数是通过率，成本是单次跑分花费。", "The long-horizon Android Bench. The score is a pass rate. Cost is one run."),
    scoreMeaning: tx("百分比是通过率。第一名公布的区间是 18.7–47.3。", "The percent is the pass rate. The published interval for first place is 18.7–47.3."),
    caveats: tx("整体通过率不高，置信区间很宽，第一名和第二名可能重叠。平均耗时以公布的小时数为准。", "Pass rates are low and intervals are wide, so first and second can overlap. Use the published hours for latency."),
    updateCadence: tx("榜单日期 2026-10-10。", "Board date 2026-10-10."),
    links: [{ label: "developer.android.com/bench", href: "https://developer.android.com/bench" }],
  },
  {
    slug: "sudo-l7",
    name: "sudo L7",
    shortName: "sudo L7",
    scoreUnit: "%",
    asOf: "2026-10-09",
    trackedCount: 12,
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
