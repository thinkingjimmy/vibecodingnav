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
      "落地页、交互组件、React / Next.js 页面。这一页把 LMArena WebDev、Image-to-WebDev、Next.js Agent Evals、生态评测 ReactBench，以及通用榜 sudo L7、DeepSWE v1.1 与 FrontierCode 1.1 按模型对齐，格子里是名次。完整原榜在各基准页。",
      "Landing pages, interactive components, and React / Next.js screens. This page lines up LMArena WebDev, Image-to-WebDev, Next.js Agent Evals, the ReactBench ecosystem eval, and the general boards sudo L7, DeepSWE v1.1, and FrontierCode 1.1 by model. Cells are ranks. The full source boards live on the benchmark pages.",
    ),
    thesis: tx(
      "按真人盲测、设计还原、框架任务、工程判断、长程工程和能否合并，挑出写前端最合适的模型。",
      "Pick the best frontend-writing model from human blind votes, design restore, framework tasks, engineering judgment, long-horizon engineering, and mergeability.",
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
      board(
        "deepswe",
        "deepswe-v1-1",
        tx("DeepSWE", "DeepSWE"),
        tx("长程工程", "Long-horizon eng."),
        "road-horizon",
        tx(
          "在真实开源仓库里做功能级长程改动，隔离提交后再评分。通用工程能力榜，不专测前端 UI。",
          "Feature-sized long-horizon changes in real open-source repos, committed in isolation then graded. A general engineering board, not a frontend UI test.",
        ),
        0.6,
      ),
      board(
        "frontiercode",
        "frontiercode-1-1",
        tx("FrontierCode", "FrontierCode"),
        tx("能否合并", "Mergeability"),
        "git-merge",
        tx(
          "维护者会不会合并这份 PR：单元测试、评分细则与验证器；不公平联网清零。通用能力榜，不专测前端 UI。",
          "Would the maintainer merge this PR: unit tests, rubrics, and verifiers; unfair internet use zeroed. A general board, not a frontend UI test.",
        ),
        0.6,
      ),
    ],
    scoringCaveats: [
      tx("四舍五入后同分算并列，再比 WebDev 名次。", "After rounding, ties share a rank; WebDev rank breaks ties."),
      tx("Next.js 前排接近 97% 天花板，区分度低。", "Next.js leaders sit near a 97% ceiling, so separation is weak."),
      tx("ReactBench 是第三方生态评测，不是 React 官方。", "ReactBench is a third-party ecosystem eval, not official React."),
      tx("sudo L7 任务不公开，按专家评分细则打分。", "sudo L7 tasks are private and graded against expert rubrics."),
      tx("DeepSWE 每模型只取 Best 推理档，统一 mini-swe-agent。", "DeepSWE keeps one Best reasoning tier per model, all on mini-swe-agent."),
      tx("FrontierCode 收录 Main 集全部推理档；综合分取每模型最高分档。", "FrontierCode keeps every Main reasoning tier; composite uses each model’s best score."),
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
        "90 万票、146 个模型，新模型通常几天内上榜，是挑前端模型最新鲜的信号。",
        "900,155 votes and 146 models. New models usually show up within days, so this is the freshest frontend signal.",
      ),
      point(
        "把价格一起看",
        "Read the price with the score",
        "第 3 名 Claude Sonnet 5.5 只比第 1 名低 38 分，价格是一半；开源的 DeepSeek V4.1 Flash（20261017）排第 12，价格 $0.30 / $1.20。",
        "Third place, Claude Sonnet 5.5, is 38 points behind first at half the price. Open-weight DeepSeek V4.1 Flash (20261017) is 12th at $0.30 / $1.20.",
      ),
    ],
    related: ["android-app", "cli-devops", "write-docs"],
  },
  {
    slug: "android-app",
    title: tx("做一个 Android App", "Build an Android app"),
    summary: tx(
      "Kotlin + Compose。这一页把 Android Bench 当前版本（2.0 长程）与通用榜 sudo L7、DeepSWE v1.1、FrontierCode 1.1 按模型对齐，格子是名次。1.0 的完整原榜在基准页，标为历史版本。",
      "Kotlin and Compose. This page lines up the current Android Bench version, 2.0 long-horizon, with the general boards sudo L7, DeepSWE v1.1, and FrontierCode 1.1 by model. Cells are ranks. The full 1.0 board stays on the benchmark page as an archived version.",
    ),
    thesis: tx(
      "按长程 Android 改造任务、工程判断、通用长程工程和能否合并，挑出做 App 最合适的模型。",
      "Pick the best app-building model from long-horizon Android work, engineering judgment, general long-horizon engineering, and mergeability.",
    ),
    benchmark: "android-bench",
    boards: [
      board(
        "current",
        "android-bench",
        tx("Android Bench 2.0", "Android Bench 2.0"),
        tx("安卓开发", "Android dev"),
        "android-logo",
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
      board(
        "deepswe",
        "deepswe-v1-1",
        tx("DeepSWE", "DeepSWE"),
        tx("长程工程", "Long-horizon eng."),
        "road-horizon",
        tx(
          "在真实开源仓库里做功能级长程改动。通用工程能力榜，不专测 Android UI。",
          "Feature-sized long-horizon changes in real open-source repos. A general engineering board, not an Android UI test.",
        ),
        0.6,
      ),
      board(
        "frontiercode",
        "frontiercode-1-1",
        tx("FrontierCode", "FrontierCode"),
        tx("能否合并", "Mergeability"),
        "git-merge",
        tx(
          "维护者会不会合并这份 PR。通用能力榜，不专测 Android UI。",
          "Would the maintainer merge this PR. A general board, not an Android UI test.",
        ),
        0.6,
      ),
    ],
    scoringCaveats: [
      tx("四舍五入后同分算并列，再比 Android Bench 名次。", "After rounding, ties share a rank; Android Bench rank breaks ties."),
      tx("长程任务整体通过率不高，置信区间经常重叠。", "Long-horizon pass rates are low and confidence intervals often overlap."),
      tx("sudo L7 任务不公开，按专家评分细则打分。", "sudo L7 tasks are private and graded against expert rubrics."),
      tx("DeepSWE 每模型只取 Best 推理档，统一 mini-swe-agent。", "DeepSWE keeps one Best reasoning tier per model, all on mini-swe-agent."),
      tx("FrontierCode 收录 Main 集全部推理档；综合分取每模型最高分档。", "FrontierCode keeps every Main reasoning tier; composite uses each model’s best score."),
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
      "终端里的 Agent 任务与自动化。这一页把 Terminal-Bench 4.0 与通用榜 DeepSWE v1.1、FrontierCode 1.1 按模型对齐，格子是名次，同时看单次跑分成本。",
      "Agent tasks and automation in a terminal. This page lines up Terminal-Bench 4.0 with the general boards DeepSWE v1.1 and FrontierCode 1.1 by model. Cells are ranks, with the cost of one run beside the score.",
    ),
    thesis: tx(
      "按终端 Agent 任务、通用长程工程和能否合并，挑出写脚本与 DevOps 最合适的模型。",
      "Pick the best model for scripts and DevOps from terminal agent tasks, general long-horizon engineering, and mergeability.",
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
      board(
        "deepswe",
        "deepswe-v1-1",
        tx("DeepSWE", "DeepSWE"),
        tx("长程工程", "Long-horizon eng."),
        "road-horizon",
        tx(
          "在真实开源仓库里做功能级长程改动，隔离提交后再评分。通用工程能力榜，不专测终端 UI。",
          "Feature-sized long-horizon changes in real open-source repos, committed in isolation then graded. A general engineering board, not a terminal UI test.",
        ),
        0.6,
      ),
      board(
        "frontiercode",
        "frontiercode-1-1",
        tx("FrontierCode", "FrontierCode"),
        tx("能否合并", "Mergeability"),
        "git-merge",
        tx(
          "维护者会不会合并这份 PR。通用能力榜，不专测终端 UI。",
          "Would the maintainer merge this PR. A general board, not a terminal UI test.",
        ),
        0.6,
      ),
    ],
    scoringCaveats: [
      tx("四舍五入后同分算并列，再比 Terminal-Bench 名次。", "After rounding, ties share a rank; Terminal-Bench rank breaks ties."),
      tx("同一通过率下，跑分成本可以差一个数量级。", "At a similar pass rate, run cost can differ by an order of magnitude."),
      tx("这张榜不衡量界面；界面去 Web 前端场景。", "This board ignores UI quality; use the Web frontend scenario for that."),
      tx("DeepSWE 每模型只取 Best 推理档，统一 mini-swe-agent。", "DeepSWE keeps one Best reasoning tier per model, all on mini-swe-agent."),
      tx("FrontierCode 收录 Main 集全部推理档；综合分取每模型最高分档。", "FrontierCode keeps every Main reasoning tier; composite uses each model’s best score."),
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
      "邮件、博客/随笔、推文、聊天文案与创意写作。这一页把 The Slop Index 与 EQ-Bench Creative Writing v3 按模型对齐，格子是名次。完整原榜在各基准页。",
      "Email, blog/essays, tweets, chat copy, and creative writing. This page lines up The Slop Index with EQ-Bench Creative Writing v3 by model. Cells are ranks. Full source boards live on the benchmark pages.",
    ),
    thesis: tx(
      "按真人写作相似度与创意写作 Elo，挑出写文档和文案最合适的模型。",
      "Pick the best model for docs and copy from human-like writing and creative-writing Elo.",
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
      board(
        "creative",
        "eqbench-creative-writing",
        tx("Creative Writing", "Creative Writing"),
        tx("创意写作", "Creative writing"),
        "pen-nib",
        tx(
          "EQ-Bench 创意写作 v3：32 题 × 3 次，LLM 裁判打 rubric 再成对对战。主指标是归一化 Elo（越高越好）；综合分按竞技场相对榜首胜率换算。",
          "EQ-Bench Creative Writing v3: 32 prompts × 3 runs, LLM rubric then pairwise Elo. The metric is normalized Elo (higher is better); composite treats it as an arena score vs the leader.",
        ),
        0.6,
      ),
    ],
    scoringCaveats: [
      tx("Slop Index 来源榜 #1 是最渣；本站名次与分数均已反转，最少 slop 为 #1。", "On Slop Index, source #1 is the sloppiest; ranks and scores here are inverted so least slop is #1."),
      tx("Creative Writing 是 LLM 裁判的相对 Elo，有裁判偏好；只测英文，不是角色扮演评测。", "Creative Writing is LLM-judged relative Elo with judge taste; English only, not a roleplay eval."),
      tx("缺一张榜按该榜中位水平半权收缩；两张榜权重 1.0 与 0.6。", "A missing board gets a half-weight prior at that board's median; weights are 1.0 and 0.6."),
      tx("这两张榜都不衡量代码或界面。", "Neither board measures code or UI."),
    ],
    valueMetric: "token",
    lead: "top",
    featured: true,
    whyItMatters: [
      point(
        "像真人 ≠ 写得好故事",
        "Human-like ≠ strong creative prose",
        "Slop Index 看邮件/推文等有多像真人；Creative Writing 看短篇创意写作的 Elo。两张榜前排并不重合。",
        "Slop Index asks how human email/tweet copy feels; Creative Writing ranks short creative prose by Elo. The leaders are not the same set.",
      ),
      point(
        "最少 slop 不是最贵",
        "Least slop is not the priciest",
        "反转后 Slop 榜首 GPT-5.6 Luna 的来源 Slop Score 是 26。更贵的 Fable 5（$30/M）在来源榜更靠前、更渣。",
        "After inversion, GPT-5.6 Luna leads Slop with a source Slop Score of 26. Pricier Fable 5 ($30/M) sits higher on the source board—more slop, not less.",
      ),
      point(
        "人和机器一起量",
        "People and machines both vote",
        "Slop Index：40% 现场盲测 + 60% 机械轴。Creative Writing：rubric 绝对分 + 成对 Elo，裁判是 Claude 系列。",
        "Slop Index: 40% live blind arena plus 60% mechanical axes. Creative Writing: rubric absolute scores plus pairwise Elo, judged by Claude models.",
      ),
    ],
    related: ["web-frontend", "cli-devops", "android-app"],
  },
];
