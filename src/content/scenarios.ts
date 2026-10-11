/**
 * [INPUT]: 依赖 Scenario 契约
 * [OUTPUT]: 对外提供场景榜单：specific 基准最多一个场景，general 可跨场景；首页与列表同一套三张卡片
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
      "落地页、交互组件、React / Next.js 页面。这一页把 LMArena WebDev、Image-to-WebDev、Next.js Agent Evals、生态评测 ReactBench，以及通用编码能力榜 sudo L7 按模型对齐，格子里是名次。完整原榜在各基准页。",
      "Landing pages, interactive components, and React / Next.js screens. This page lines up LMArena WebDev, Image-to-WebDev, Next.js Agent Evals, the ReactBench ecosystem eval, and the general coding board sudo L7 by model. Cells are ranks. The full source boards live on the benchmark pages.",
    ),
    benchmark: "lmarena-webdev",
    boards: [
      { id: "webdev", benchmark: "lmarena-webdev", label: tx("WebDev", "WebDev"), weight: 1 },
      { id: "image", benchmark: "lmarena-image-to-webdev", label: tx("图生网页", "From image"), weight: 0.6 },
      { id: "nextjs", benchmark: "nextjs-evals", label: tx("Next.js", "Next.js"), weight: 0.4 },
      { id: "reactbench", benchmark: "reactbench", label: tx("ReactBench", "ReactBench"), weight: 0.4 },
      { id: "sudo", benchmark: "sudo-l7", label: tx("sudo L7", "sudo L7"), weight: 0.6 },
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
    related: ["android-app", "cli-devops"],
  },
  {
    slug: "android-app",
    title: tx("做一个 Android App", "Build an Android app"),
    summary: tx(
      "Kotlin + Compose。这一页把 Android Bench 当前版本（2.0 长程）与通用编码能力榜 sudo L7 按模型对齐，格子是名次。1.0 的完整原榜在基准页，标为历史版本。",
      "Kotlin and Compose. This page lines up the current Android Bench version, 2.0 long-horizon, with the general coding board sudo L7 by model. Cells are ranks. The full 1.0 board stays on the benchmark page as an archived version.",
    ),
    benchmark: "android-bench",
    boards: [
      { id: "current", benchmark: "android-bench", label: tx("Android Bench 2.0", "Android Bench 2.0"), weight: 1 },
      { id: "sudo", benchmark: "sudo-l7", label: tx("sudo L7", "sudo L7"), weight: 0.6 },
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
    related: ["web-frontend", "cli-devops"],
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
    related: ["web-frontend", "android-app"],
  },
];
