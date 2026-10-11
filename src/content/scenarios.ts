/**
 * [INPUT]: 依赖 Scenario 契约
 * [OUTPUT]: 对外提供场景榜单：specific 基准最多一个场景，general 可跨场景；首页与列表同一套 featured 卡片；融合列头用维度图标与白话标签
 * [POS]: src/content 的场景实体，只引用基准与模型，不复制分数
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { LText, Scenario, ScenarioBoard } from "@/lib/contracts";

const tx = (zh: string, en: string): LText => ({ zh, en });
const point = (zhTitle: string, enTitle: string, zhBody: string, enBody: string) => ({
  title: tx(zhTitle, enTitle),
  body: tx(zhBody, enBody),
});

const board = (
  id: string,
  benchmark: string,
  label: LText,
  dimension: LText,
  icon: ScenarioBoard["icon"],
  blurb: LText,
  weight: number,
): ScenarioBoard => ({ id, benchmark, label, dimension, icon, blurb, weight });

export const scenarios: Scenario[] = [
  {
    slug: "web-frontend",
    title: tx("做 Web 前端", "Build a Web frontend"),
    summary: tx(
      "落地页、交互组件、React / Next.js 页面。这一页把 LMArena WebDev、Image-to-WebDev、Next.js Agent Evals、生态评测 ReactBench，以及通用编码能力榜 sudo L7 按模型对齐，格子里是名次。完整原榜在各基准页。",
      "Landing pages, interactive components, and React / Next.js screens. This page lines up LMArena WebDev, Image-to-WebDev, Next.js Agent Evals, the ReactBench ecosystem eval, and the general coding board sudo L7 by model. Cells are ranks. The full source boards live on the benchmark pages.",
    ),
    thesis: tx(
      "按真人盲测、设计还原、框架任务和工程判断，挑出写前端最合适的模型。",
      "Pick the best frontend-writing model from human blind votes, design restore, framework tasks, and engineering judgment.",
    ),
    benchmark: "lmarena-webdev",
    boards: [
      board(
        "webdev",
        "lmarena-webdev",
        tx("WebDev", "WebDev"),
        tx("盲测投票", "Blind votes"),
        "users-three",
        tx(
          "真人盲评两个模型做出的完整网页：布局、细节、能不能用。衡量的是人类偏好，不是测试通过率。",
          "People blind-vote between two models’ full pages: layout, detail, and whether it runs. This is human preference, not test pass rate.",
        ),
        1,
      ),
      board(
        "image",
        "lmarena-image-to-webdev",
        tx("图生网页", "From image"),
        tx("还原设计", "Design restore"),
        "image",
        tx(
          "照一张截图把页面做出来。看模型能不能把设计稿还原成可用页面。",
          "Build a page from a screenshot. Can the model restore a design into something usable?",
        ),
        0.6,
      ),
      board(
        "nextjs",
        "nextjs-evals",
        tx("Next.js", "Next.js"),
        tx("Next.js 任务", "Next.js tasks"),
        "file-code",
        tx(
          "Vercel 出题的真实 Next.js 任务，按 pass@4 计。前排接近天花板，区分度有限。",
          "Real Next.js tasks from Vercel, scored pass@4. The front is near the ceiling, so gaps are small.",
        ),
        0.4,
      ),
      board(
        "reactbench",
        "reactbench",
        tx("ReactBench", "ReactBench"),
        tx("React 任务", "React tasks"),
        "atom",
        tx(
          "在真实 React 仓库里写功能和修问题。第三方生态评测，不是 React 或 Meta 官方。",
          "Write features and fix issues in real React repos. A third-party ecosystem eval, not official React or Meta.",
        ),
        0.4,
      ),
      board(
        "sudo",
        "sudo-l7",
        tx("sudo L7", "sudo L7"),
        tx("工程判断", "Engineering judgment"),
        "scales",
        tx(
          "在生产代码库里做资深工程师级的取舍：改动、验证、把决定说清楚。任务集不公开。",
          "Staff-level tradeoffs in production codebases: change, verify, and explain the call. Tasks stay private.",
        ),
        0.6,
      ),
    ],
    scoringCaveats: [
      tx("四舍五入后同分算并列，再比 WebDev 名次。", "After rounding, ties share a rank; WebDev rank breaks ties."),
      tx("Next.js 前排接近 97% 天花板，区分度低。", "Next.js leaders sit near a 97% ceiling, so separation is weak."),
      tx("ReactBench 是第三方生态评测，不是 React 官方。", "ReactBench is a third-party ecosystem eval, not official React."),
      tx("sudo L7 任务不公开，按专家评分细则打分。", "sudo L7 tasks are private and graded against expert rubrics."),
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
    related: ["android-app", "cli-devops", "write-docs"],
  },
  {
    slug: "android-app",
    title: tx("做一个 Android App", "Build an Android app"),
    summary: tx(
      "Kotlin + Compose。这一页把 Android Bench 当前版本（2.0 长程）与通用编码能力榜 sudo L7 按模型对齐，格子是名次。1.0 的完整原榜在基准页，标为历史版本。",
      "Kotlin and Compose. This page lines up the current Android Bench version, 2.0 long-horizon, with the general coding board sudo L7 by model. Cells are ranks. The full 1.0 board stays on the benchmark page as an archived version.",
    ),
    thesis: tx(
      "按长程 Android 改造任务和工程判断，挑出做 App 最合适的模型。",
      "Pick the best app-building model from long-horizon Android work and engineering judgment.",
    ),
    benchmark: "android-bench",
    boards: [
      board(
        "current",
        "android-bench",
        tx("Android Bench 2.0", "Android Bench 2.0"),
        tx("长程任务", "Long-horizon"),
        "device-mobile",
        tx(
          "跨模块、耗时很长的 Android 改造：完整功能，而不是单点修改。区间很宽，分差小时不要只看名次。",
          "Long Android changes across modules: a whole feature, not a single edit. Intervals are wide; a small gap is a weak reason to switch.",
        ),
        1,
      ),
      board(
        "sudo",
        "sudo-l7",
        tx("sudo L7", "sudo L7"),
        tx("工程判断", "Engineering judgment"),
        "scales",
        tx(
          "在生产代码库里做资深工程师级的取舍。通用编码能力榜，不专测 Android UI。",
          "Staff-level tradeoffs in production codebases. A general coding board, not an Android UI test.",
        ),
        0.6,
      ),
    ],
    scoringCaveats: [
      tx("四舍五入后同分算并列，再比 Android Bench 名次。", "After rounding, ties share a rank; Android Bench rank breaks ties."),
      tx("长程任务整体通过率不高，置信区间经常重叠。", "Long-horizon pass rates are low and confidence intervals often overlap."),
      tx("sudo L7 任务不公开，按专家评分细则打分。", "sudo L7 tasks are private and graded against expert rubrics."),
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
    related: ["web-frontend", "cli-devops", "write-docs"],
  },
  {
    slug: "cli-devops",
    title: tx("写 CLI、脚本与 DevOps", "Write CLI, scripts, and DevOps"),
    summary: tx(
      "终端里的 Agent 任务与自动化。按 Terminal-Bench 4.0 的通过率排名，同时看单次跑分成本。",
      "Agent tasks and automation in a terminal. Ranked by the Terminal-Bench 4.0 pass rate, with the cost of one run beside the score.",
    ),
    thesis: tx(
      "按终端 Agent 任务的通过率，挑出写脚本与 DevOps 最合适的模型。",
      "Pick the best model for scripts and DevOps by terminal agent pass rate.",
    ),
    benchmark: "terminal-bench-4",
    boards: [
      board(
        "terminal",
        "terminal-bench-4",
        tx("Terminal-Bench", "Terminal-Bench"),
        tx("终端任务", "Terminal tasks"),
        "terminal-window",
        tx(
          "终端里的 Agent 任务：装环境、改配置、跑命令、把自动化做完。不衡量界面好不好看。",
          "Agent tasks in a terminal: install a toolchain, edit config, run commands, finish the automation. It ignores whether a UI looks right.",
        ),
        1,
      ),
    ],
    scoringCaveats: [
      tx("同一通过率下，跑分成本可以差一个数量级。", "At a similar pass rate, run cost can differ by an order of magnitude."),
      tx("这张榜不衡量界面；界面去 Web 前端场景。", "This board ignores UI quality; use the Web frontend scenario for that."),
    ],
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
    related: ["web-frontend", "android-app", "write-docs"],
  },
  {
    slug: "write-docs",
    title: tx("写文档和文案", "Write docs & copy"),
    summary: tx(
      "邮件、博客/随笔、推文和聊天文案。按 The Slop Index 衡量写作有多像真人、多不像聊天机器人。来源榜把最渣排第 1；本站已反转为最少 slop 为第 1。",
      "Email, blog/essays, tweets, and chat copy. Ranked by The Slop Index on how human and un-chatbot-like the writing is. The source ranks the sloppiest first; this site inverts so least slop is #1.",
    ),
    thesis: tx(
      "按真人写作相似度，挑出写文档和文案最合适的模型。",
      "Pick the best model for docs and copy by human-like writing.",
    ),
    benchmark: "slop-index",
    boards: [
      board(
        "slop",
        "slop-index",
        tx("The Slop Index", "The Slop Index"),
        tx("像真人", "Human-like"),
        "article",
        tx(
          "测写作有多像聊天机器人。来源 Slop Score 越高越差、#1 最渣；本站反转为最少 slop 为 #1，分数用 100 − Slop Score（越高越像真人）。40% 现场盲测 + 四条机械轴各 15%，对照 2022 年前真人写作。",
          "Measures how chatbot-like the writing is. The source Slop Score is higher = worse, #1 = sloppiest; this site inverts so least slop is #1 and uses 100 − Slop Score (higher = more human). 40% live blind votes plus four mechanical axes at 15% each, vs pre-2022 human writing.",
        ),
        1,
      ),
    ],
    scoringCaveats: [
      tx("来源榜 #1 是最渣；本站名次与分数均已反转，最少 slop 为 #1。", "Source #1 is the sloppiest; ranks and scores here are inverted so least slop is #1."),
      tx("只有一张榜时，综合分等于相对榜首的归一化分。", "With one board, the composite equals the score normalized to the leader."),
      tx("竞技场票数仍在累计；这张榜不衡量代码或界面。", "Arena votes are still accumulating; this board ignores code and UI."),
    ],
    valueMetric: "token",
    lead: "top",
    featured: true,
    whyItMatters: [
      point(
        "最少 slop 不是最贵",
        "Least slop is not the priciest",
        "反转后榜首 GPT-5.6 Luna 的来源 Slop Score 是 26。更贵的 Fable 5（$30/M）在来源榜更靠前、更渣。",
        "After inversion, GPT-5.6 Luna leads with a source Slop Score of 26. Pricier Fable 5 ($30/M) sits higher on the source board—more slop, not less.",
      ),
      point(
        "人和机器一起量",
        "People and machines both vote",
        "40% 来自现场盲测竞技场，60% 是相对 2022 年前真人写作的机械轴：简洁、模板化、节奏、AI 套话。",
        "40% is the live blind arena; 60% is mechanical distance from pre-2022 human writing: conciseness, templating, rhythm, and AI tells.",
      ),
      point(
        "四个领域同一套题",
        "The same tasks in four domains",
        "112 个场景覆盖邮件、博客/随笔、推文和 Discord。写干净邮件的模型，不一定写干净随笔。",
        "112 scenarios cover email, blog/essays, tweets, and Discord. A clean email writer is not always a clean essay writer.",
      ),
    ],
    related: ["web-frontend", "cli-devops", "android-app"],
  },
];
