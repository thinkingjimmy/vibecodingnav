/**
 * [INPUT]: 依赖 Scenario 契约
 * [OUTPUT]: 对外提供场景榜单：七张首页卡片、开源切片，以及全栈 SaaS
 * [POS]: src/content 的场景实体，只引用基准与模型，不复制分数
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { LText, Scenario } from "@/lib/contracts";

const tx = (zh: string, en: string): LText => ({ zh, en });
const point = (zhTitle: string, enTitle: string, zhBody: string, enBody: string) => ({
  title: tx(zhTitle, enTitle),
  body: tx(zhBody, enBody),
});

export const scenarios: Scenario[] = [
  {
    slug: "web-frontend",
    title: tx("做 Web 前端", "Build a Web frontend"),
    summary: tx(
      "落地页、交互组件、React / Next.js 页面。按 LMArena WebDev 社区盲评排名：两个匿名模型同时做同一个需求，由真人投票选出更好的那个。",
      "Landing pages, interactive components, and React / Next.js screens. Ranked by LMArena WebDev blind votes: two anonymous models build the same brief, and a person picks the better one.",
    ),
    benchmark: "lmarena-webdev",
    subset: "all",
    valueMetric: "token",
    lead: "top",
    featured: true,
    build: "web-frontend",
    whyItMatters: [
      point(
        "最接近“做出来好不好”",
        "Closest to “does it look finished”",
        "前端质量很难用测试用例衡量。盲评投票直接反映用户第一眼的判断：布局、细节、能不能用。",
        "Frontend quality is hard to catch with tests. A blind vote is the person's first look: layout, detail, and whether it runs.",
      ),
      point(
        "新、快、样本大",
        "New, fast, and large",
        "85 万票、142 个模型，新模型通常几天内上榜，是挑前端模型最新鲜的信号。",
        "852,934 votes and 142 models. New models usually show up within days, so this is the freshest frontend signal.",
      ),
      point(
        "把价格一起看",
        "Read the price with the score",
        "第 3 名 Claude Sonnet 5.5 只比第 1 名低 39 分，价格是一半；开源的 MiMo V2.6 Flash 排第 16，价格 $0.14 / $0.28。",
        "Third place, Claude Sonnet 5.5, is 39 points behind first at half the price. Open-weight MiMo V2.6 Flash is 16th at $0.14 / $0.28.",
      ),
    ],
    related: ["android-app", "cli-devops", "refactor", "open-frontend", "ios-app", "saas"],
  },
  {
    slug: "android-app",
    title: tx("做一个 Android App", "Build an Android app"),
    summary: tx(
      "Kotlin + Compose，新功能与库迁移。按 Android Bench 1.0 的标准任务通过率排名。",
      "Kotlin and Compose, new features and library migrations. Ranked by the Android Bench 1.0 pass rate on standard tasks.",
    ),
    benchmark: "android-bench-1",
    subset: "all",
    valueMetric: "run",
    lead: "top",
    featured: true,
    build: "android-app",
    whyItMatters: [
      point(
        "前几名挤在一起",
        "The top is bunched",
        "前四名都在 90.2–91.8%，置信区间重叠。日常任务不必为第一名多付钱。",
        "The top four sit between 90.2% and 91.8%, and the intervals overlap. Everyday work does not need the first-place premium.",
      ),
      point(
        "便宜档差得不多",
        "The cheap tier is close",
        "GPT 5.6 Luna 87.6%，跑分成本 $7.2，约为第一名 $175.4 的二十四分之一。",
        "GPT 5.6 Luna scores 87.6% at $7.2 a run, about a twenty-fourth of the leader's $175.4.",
      ),
      point(
        "长程是另一张榜",
        "Long work is another board",
        "跨模块改造看 Android Bench 长程，排名会变。",
        "Cross-module work belongs on the Android long-horizon board, and the order changes.",
      ),
    ],
    related: ["refactor", "web-frontend", "cli-devops", "ios-app", "open-frontend", "saas"],
  },
  {
    slug: "cli-devops",
    title: tx("写 CLI、脚本与 DevOps", "Write CLI, scripts, and DevOps"),
    summary: tx(
      "终端里的 Agent 任务与自动化。按 Terminal-Bench 4.0 的通过率排名，同时看单次跑分成本。",
      "Agent tasks and automation in a terminal. Ranked by the Terminal-Bench 4.0 pass rate, with the cost of one run beside the score.",
    ),
    benchmark: "terminal-bench-4",
    subset: "all",
    valueMetric: "run",
    lead: "top",
    featured: true,
    build: "cli-devops",
    whyItMatters: [
      point(
        "第一名不是最便宜",
        "First is not the cheapest",
        "Opus 5.5 通过率 64.8%，跑分成本 $4.7k。GPT-6.1 Sol 同为 58.2% 档里成本 $0.6k。",
        "Opus 5.5 passes 64.8% at $4.7k a run. GPT-6.1 Sol is in the 58.2% band at $0.6k.",
      ),
      point(
        "第二名更贵",
        "Second costs more",
        "Sonnet 5.5 通过率 61.8%，跑分成本 $7.3k，高于第一名。",
        "Sonnet 5.5 passes 61.8% at $7.3k a run, more than first place.",
      ),
      point(
        "这张榜不看界面",
        "This board ignores the interface",
        "界面好不好看去 LMArena WebDev。这里只看终端任务能不能做完。",
        "Whether a screen looks right is LMArena WebDev. This board only asks if the terminal task gets finished.",
      ),
    ],
    related: ["web-frontend", "saas", "refactor", "production-changes", "android-app", "open-frontend"],
  },
  {
    slug: "production-changes",
    title: tx("生产级改动与架构决策", "Production changes & architecture decisions"),
    summary: tx(
      "改生产代码时，测试通过还不够：要发现风险、顶回去、验证危险情况，并把决定说清楚。按 Surge AI sudo L7 的任务完成率排名。",
      "On production code, passing tests is not enough: spot the risk, push back, verify the dangerous cases, and explain the decision. Ranked by the Surge AI sudo L7 completion rate.",
    ),
    benchmark: "sudo-l7",
    subset: "all",
    valueMetric: "run",
    lead: "top",
    featured: true,
    note: tx(
      "成本列不是榜单原列。博客写 Sonnet 5.5 单任务约 $14，Opus 5.5 约 $10，GPT-6.1 Sol 略高于 $1，并接近 Astra 的 32%、大约五分之一的花费。Astra 没有公布美元数。",
      "The cost column is not on the leaderboard. The blog puts Sonnet 5.5 at about $14 a task, Opus 5.5 at about $10, and GPT-6.1 Sol at just over $1, close to Astra's 32% at roughly a fifth of the spend. Astra has no published dollar figure.",
    ),
    whyItMatters: [
      point(
        "补 SWE-bench 停更后的空档",
        "Fills in after SWE-bench stopped",
        "SWE-bench Verified 的榜单日期停在 2026-02-26，问的是补丁能不能过测试。sudo L7 问的是代码能跑之后，还该不该这么改。",
        "SWE-bench Verified's board date stops at 2026-02-26 and asks whether a patch passes. sudo L7 asks whether the change is the right one after the code runs.",
      ),
      point(
        "和 Terminal-Bench 不是同一件事",
        "Not the same question as Terminal-Bench",
        "Terminal-Bench 给的是终端里写明的任务。sudo L7 把做法留开：该不该做、风险在哪、怎么验证。",
        "Terminal-Bench specifies a concrete terminal task. sudo L7 leaves the approach open: whether to build it, where the risk is, and how to verify it.",
      ),
      point(
        "正确性和判断会分开",
        "Correctness and judgment split",
        "前四名的功能正确性挤在 79.6–82.4%。思路协作上 Opus 76.1%、Sonnet 74.8%，Sol 53.0%、Astra 51.6%。沟通上 Sonnet 72.4%，Sol 44.1%。",
        "Functional correctness for the top four sits between 79.6% and 82.4%. Thought partnership is 76.1% for Opus and 74.8% for Sonnet, against 53.0% for Sol and 51.6% for Astra. Communication is 72.4% for Sonnet and 44.1% for Sol.",
      ),
    ],
    related: ["refactor", "cli-devops", "saas", "web-frontend", "android-app", "ios-app"],
  },
  {
    slug: "refactor",
    title: tx("大型重构与迁移", "Large refactors and migrations"),
    summary: tx(
      "跨模块改造、框架与依赖升级。按 Android Bench 长程任务的通过率来看哪一档模型撑得住。",
      "Cross-module changes, framework upgrades, and dependency moves. The Android Bench long-horizon pass rate shows which tier can hold a long task.",
    ),
    benchmark: "android-bench-2-long",
    subset: "all",
    valueMetric: "run",
    lead: "top",
    featured: true,
    whyItMatters: [
      point(
        "通过率整体不高",
        "Pass rates stay low",
        "第一名 32.7%，区间 18.7–47.3，和后面几名重叠。",
        "First place is 32.7%, interval 18.7–47.3, overlapping the rows behind it.",
      ),
      point(
        "时间和钱都要看",
        "Time and money both count",
        "Opus 5.5 平均耗时 15.2 小时，跑分成本 $215.4。",
        "Opus 5.5 averages 15.2 hours, and a run costs $215.4.",
      ),
      point(
        "不要用标准榜代替",
        "Do not reuse the standard board",
        "Android Bench 1.0 的前几名到了长程榜会换位置。",
        "The Android Bench 1.0 leaders change places on the long board.",
      ),
    ],
    related: ["android-app", "cli-devops", "production-changes", "web-frontend", "saas", "open-frontend"],
  },
  {
    slug: "open-frontend",
    title: tx("用开源模型做前端", "Build a frontend with open models"),
    summary: tx(
      "同一张 LMArena WebDev，只留 MIT、Apache 等可再分发的许可。适合要自托管、不能把请求送到闭源 API 的时候。",
      "The same LMArena WebDev board, kept to redistributable licenses such as MIT and Apache. Use it when the model has to be self-hosted.",
    ),
    benchmark: "lmarena-webdev",
    subset: "permissive-open",
    valueMetric: "token",
    lead: "top",
    featured: true,
    sourceLabel: tx("LMArena WebDev · 开源许可", "LMArena WebDev · open license"),
    whyItMatters: [
      point(
        "许可看得懂",
        "The license is readable",
        "这一档是 MIT 或 Apache 2.0，可以自托管。qwen-community 与专有许可不在这里。",
        "This slice is MIT or Apache 2.0 and can be self-hosted. qwen-community and proprietary licenses stay out.",
      ),
      point(
        "和闭源第一名的分差",
        "The gap to the proprietary leader",
        "MiMo V2.6 Flash 1637，Opus 5.5 是 1813，差 176 分。",
        "MiMo V2.6 Flash scores 1637. Opus 5.5 scores 1813. The gap is 176.",
      ),
      point(
        "价格",
        "Price",
        "MiMo V2.6 Flash 的标价是 $0.14 / $0.28。",
        "MiMo V2.6 Flash is priced at $0.14 / $0.28.",
      ),
    ],
    related: ["web-frontend", "cli-devops", "android-app", "refactor", "ios-app", "saas"],
  },
  {
    slug: "ios-app",
    title: tx("做 iOS App", "Build an iOS app"),
    summary: tx(
      "SwiftUI 与原生能力。还没有公开的 iOS 专项基准，所以这里不放分数，只放编辑对照三张活跃榜之后的选择。",
      "SwiftUI and native APIs. There is no public iOS benchmark yet, so this page has no scores. The picks are an editor's cross-check of the three active boards.",
    ),
    subset: "all",
    valueMetric: "token",
    lead: "top",
    featured: true,
    sourceLabel: tx("暂无专项基准 · 编辑精选", "No dedicated benchmark · editor picks"),
    editorPicks: [
      { modelSlug: "claude-opus-5-5", reason: tx("三项活跃基准第一", "First on the three active boards") },
      { modelSlug: "claude-sonnet-5-5", reason: tx("前端分高，价格减半", "High frontend score, half the price") },
      { modelSlug: "gpt-6-1-sol", reason: tx("Agent 任务性价比", "Better cost on agent tasks") },
      { modelSlug: "glm-5-3", reason: tx("开源，可自托管", "Open license, can be self-hosted") },
    ],
    whyItMatters: [
      point("没有分数", "No score", "没有公开的 iOS 专项榜，这份名单不伪装成基准。", "With no public iOS board, this list does not pretend to be one."),
      point(
        "对照三张活跃榜",
        "Cross-checked with three live boards",
        "编辑只从 Terminal-Bench、WebDev、Android 长程里已经出现的模型里选。",
        "Editors only pick models that already appear on Terminal-Bench, WebDev, or the Android long board.",
      ),
      point("有专项榜再换", "Replace it when a board exists", "出现 iOS 专项基准之后，这里应改成榜单，不再保留精选。", "Once an iOS benchmark exists, this page should become a board and drop the picks."),
    ],
    related: ["android-app", "web-frontend", "cli-devops", "open-frontend", "refactor", "saas"],
  },
  {
    slug: "saas",
    title: tx("做全栈 SaaS", "Build a full-stack SaaS"),
    summary: tx(
      "Next.js、数据库、鉴权与部署。界面只是一层，更多时间在终端里。推荐看 Terminal-Bench 的成本，而不是只看通过率第一。",
      "Next.js, a database, auth, and deploy. The interface is a thin layer. Most of the time is in the terminal. Read Terminal-Bench cost, not only the top pass rate.",
    ),
    benchmark: "terminal-bench-4",
    subset: "all",
    valueMetric: "run",
    lead: "value",
    featured: false,
    build: "saas",
    note: tx(
      "2026-09-29 起，这个场景的首选改为 GPT-6.1 Sol：通过率 58.2%，跑分成本 $0.6k。",
      "Since 2026-09-29 the pick for this scenario is GPT-6.1 Sol: 58.2% pass rate, $0.6k a run.",
    ),
    whyItMatters: [
      point(
        "更接近终端而不是页面",
        "Closer to the terminal than to the page",
        "鉴权、迁移和部署用 Terminal-Bench 更合适。纯界面仍看 WebDev。",
        "Auth, migrations, and deploys fit Terminal-Bench. A pure interface still belongs on WebDev.",
      ),
      point(
        "推荐看成本",
        "The recommendation is the cost",
        "GPT-6.1 Sol 58.2%，跑分成本 $0.6k，不到榜首跑分成本的八分之一。",
        "GPT-6.1 Sol scores 58.2% at $0.6k a run, under an eighth of the leader's run cost.",
      ),
    ],
    related: ["cli-devops", "production-changes", "web-frontend", "refactor", "android-app", "open-frontend"],
  },
];
