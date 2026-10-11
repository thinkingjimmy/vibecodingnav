/**
 * [INPUT]: 依赖 Scenario 契约
 * [OUTPUT]: 对外提供场景榜单：一张基准只属于一个场景，首页与列表同一套四张卡片
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
      "落地页、交互组件、React / Next.js 页面。这一页把 LMArena WebDev、Image-to-WebDev、Next.js Agent Evals 和生态评测 ReactBench 按模型对齐，格子里是名次。完整原榜在各基准页。",
      "Landing pages, interactive components, and React / Next.js screens. This page lines up LMArena WebDev, Image-to-WebDev, Next.js Agent Evals, and the ReactBench ecosystem eval by model. Cells are ranks. The full source boards live on the benchmark pages.",
    ),
    benchmark: "lmarena-webdev",
    boards: [
      { id: "webdev", benchmark: "lmarena-webdev", label: tx("WebDev", "WebDev") },
      { id: "image", benchmark: "lmarena-image-to-webdev", label: tx("图生网页", "From image") },
      { id: "nextjs", benchmark: "nextjs-evals", label: tx("Next.js", "Next.js") },
      { id: "reactbench", benchmark: "reactbench", label: tx("ReactBench", "ReactBench") },
    ],
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
    related: ["android-app", "cli-devops", "production-changes"],
  },
  {
    slug: "android-app",
    title: tx("做一个 Android App", "Build an Android app"),
    summary: tx(
      "Kotlin + Compose。这一页按 Android Bench 的当前版本（2.0 长程）排名，格子是名次。1.0 的完整原榜在基准页，标为历史版本。",
      "Kotlin and Compose. This page ranks models on the current Android Bench version, 2.0 long-horizon. Cells are ranks. The full 1.0 board stays on the benchmark page as an archived version.",
    ),
    benchmark: "android-bench",
    boards: [
      { id: "current", benchmark: "android-bench", label: tx("Android Bench 2.0", "Android Bench 2.0") },
    ],
    valueMetric: "run",
    lead: "top",
    featured: true,
    build: "android-app",
    whyItMatters: [
      point(
        "区间叠在一起",
        "The intervals overlap",
        "第一名 32.7%（18.7–47.3），第二名 28.0%（13.3–42.0）。分差很小，不要只看名次。",
        "First is 32.7% (18.7–47.3). Second is 28.0% (13.3–42.0). The gap is small, so rank alone is a weak reason to switch.",
      ),
      point(
        "半价以内看第四名",
        "Fourth is under half the cost",
        "榜首跑分成本 $215.4。GPT 6 Sol 排第四，18.0%，$93.4，不到一半。",
        "The leader's run costs $215.4. GPT 6 Sol is fourth at 18.0% and $93.4, under half that cost.",
      ),
      point(
        "1.0 不再更新",
        "1.0 is no longer updated",
        "标准任务的 1.0 仍是完整的 32 行，在基准页标为历史版本。场景和首页只使用 2.0 长程。",
        "The 1.0 standard-task table is still the full 32 rows, marked archived on the benchmark page. The scenario and the home card use only 2.0 long-horizon.",
      ),
    ],
    related: ["web-frontend", "cli-devops", "production-changes"],
  },
  {
    slug: "cli-devops",
    title: tx("写 CLI、脚本与 DevOps", "Write CLI, scripts, and DevOps"),
    summary: tx(
      "终端里的 Agent 任务与自动化。按 Terminal-Bench 4.0 的通过率排名，同时看单次跑分成本。",
      "Agent tasks and automation in a terminal. Ranked by the Terminal-Bench 4.0 pass rate, with the cost of one run beside the score.",
    ),
    benchmark: "terminal-bench-4",
    valueMetric: "run",
    lead: "top",
    featured: true,
    build: "cli-devops",
    whyItMatters: [
      point(
        "第一名不是最便宜",
        "First is not the cheapest",
        "Opus 5.5 通过率 64.8%，跑分成本 $4.7k。GPT-6.1 Sol 并列第 3，58.2%，成本 $634.24。",
        "Opus 5.5 passes 64.8% at $4.7k a run. GPT-6.1 Sol ties for 3rd at 58.2% and $634.24.",
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
    related: ["web-frontend", "android-app", "production-changes"],
  },
  {
    slug: "production-changes",
    title: tx("生产级改动与架构决策", "Production changes & architecture decisions"),
    summary: tx(
      "改生产代码时，测试通过还不够：要发现风险、顶回去、验证危险情况，并把决定说清楚。按 Surge AI sudo L7 的任务完成率排名。",
      "On production code, passing tests is not enough: spot the risk, push back, verify the dangerous cases, and explain the decision. Ranked by the Surge AI sudo L7 completion rate.",
    ),
    benchmark: "sudo-l7",
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
    related: ["web-frontend", "android-app", "cli-devops"],
  },
];
