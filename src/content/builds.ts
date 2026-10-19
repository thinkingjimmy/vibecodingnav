/**
 * [INPUT]: 依赖 BuildPage 契约；模型行用 pick，工具行用条目 slug
 * [OUTPUT]: 对外提供四套「做 X」组合
 * [POS]: src/content 的组合页，只引用、不复制榜单分数
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { BuildPage, LText } from "@/lib/contracts";

const tx = (zh: string, en: string): LText => ({ zh, en });
const note = (slug: string, zh: string, en: string) => ({
  ref: { kind: "item" as const, slug },
  tone: "note" as const,
  when: tx(zh, en),
});

export const builds: BuildPage[] = [
  {
    slug: "web-frontend",
    scenario: "web-frontend",
    updatedAt: "2026-10-10",
    title: tx("做 Web 前端，用这一套", "Build a Web frontend with this set"),
    summary: tx(
      "模型、Skill、组件、图标、动效、字体一次配齐。模型取自 LMArena WebDev 榜单，其余由编辑按用途挑选；每一项都能单独换。",
      "Model, skill, components, icons, motion, and type in one set. The model comes from the LMArena WebDev board. An editor picked the rest by job. Each row can be swapped.",
    ),
    roles: [
      {
        role: tx("模型", "Model"),
        primary: { kind: "pick", pick: "top" },
        purpose: tx("写代码的主力", "The main model for coding"),
        alternatives: [
          { ref: { kind: "pick", pick: "value" }, tone: "value", when: tx("价格减半", "half the token price") },
          { ref: { kind: "pick", pick: "open" }, tone: "open", when: tx("可自托管", "self-hostable") },
        ],
      },
      {
        role: tx("Skill", "Skill"),
        primary: { kind: "item", slug: "frontend-design" },
        purpose: tx("让 AI 先定视觉方向再写", "Set a visual direction before coding"),
        alternatives: [note("web-design-guidelines", "完成后用 web-design-guidelines 按 Web 界面规范自查", "Afterward, review with web-design-guidelines")],
      },
      {
        role: tx("组件", "UI"),
        primary: { kind: "item", slug: "shadcn-ui" },
        purpose: tx("可复制改写的组件源码", "Copy-in component source you can edit"),
        alternatives: [note("shadcn-ui", "要完全无样式、自己定设计系统时用 Base UI", "Use Base UI for a fully unstyled design system")],
      },
      {
        role: tx("图标", "Icons"),
        primary: { kind: "item", slug: "phosphor-icons" },
        purpose: tx("六种字重的统一图标", "One icon family in six weights"),
        alternatives: [note("lobehub-icons", "需要 AI 品牌 logo 时加 LobeHub Icons", "Add LobeHub Icons when you need AI brand marks")],
      },
      {
        role: tx("动效", "Motion"),
        primary: { kind: "item", slug: "motion" },
        purpose: tx("React 动画与手势", "React animation and gestures"),
        extras: [{ kind: "item", slug: "motion-ai-kit" }],
        meta: tx("库 + 插件", "Library + plugin"),
        alternatives: [note("gsap", "滚动叙事页面换 GSAP + gsap-skills", "Switch scroll storytelling to GSAP + gsap-skills")],
      },
      {
        role: tx("字体", "Type"),
        primary: { kind: "item", slug: "geist" },
        purpose: tx("界面与等宽字体", "UI and mono type"),
        meta: tx("库 · OFL-1.1", "Library · OFL-1.1"),
        alternatives: [note("lxgw-wenkai", "中文用霞鹜文楷；封面类视觉用 qiaomu-cover-fonts", "Use LXGW WenKai for Chinese. Use qiaomu-cover-fonts for covers.")],
      },
      {
        role: tx("MCP", "MCP"),
        primary: { kind: "item", slug: "figma-mcp" },
        purpose: tx("把设计稿上下文喂给 AI", "Feed design-file context to the agent"),
        alternatives: [note("open-design", "没有设计稿时用 open-design 先出原型", "With no design file, prototype first in open-design")],
      },
    ],
    agentsMd: tx(
      `# 前端约定
- 组件：shadcn/ui，按需 npx shadcn@latest add <component>，不另引 UI 库
- 图标：@phosphor-icons/react，默认 weight="regular"
- 动效：motion/react；只给用户操作的反馈加动效，不做整页淡入
- 字体：Geist Sans / Geist Mono，中文回退霞鹜文楷
- 动手前用 frontend-design 定方案，完成后用 web-design-guidelines 自查`,
      `# Frontend
- Components: shadcn/ui, added with npx shadcn@latest add <component>. Do not add a second UI kit.
- Icons: @phosphor-icons/react, default weight="regular"
- Motion: motion/react. Animate feedback to a user action. Do not fade the whole page in.
- Type: Geist Sans / Geist Mono, with LXGW WenKai as the Chinese fallback
- Plan with frontend-design before coding. Review with web-design-guidelines after.`,
    ),
    installCmds: tx(
      `# Skill（Claude Code）
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills

# 审查 Skill 与 Motion AI Kit
npx skills add https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
npx motion-ai

# 依赖
npm i @phosphor-icons/react motion geist`,
      `# Skill (Claude Code)
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills

# Review skill and Motion AI Kit
npx skills add https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
npx motion-ai

# Dependencies
npm i @phosphor-icons/react motion geist`,
    ),
    notFor: [
      { title: tx("移动端原生", "Native mobile"), body: tx("Kotlin / Compose 项目看「做一个 Android App」，模型排名不同。", "For Kotlin / Compose, open “Build an Android app”. The model order is different."), href: "/build/android-app" },
      { title: tx("后端与脚本为主", "Mostly backend and scripts"), body: tx("界面只是薄薄一层时，按 Terminal-Bench 选模型更准。", "When the interface is a thin layer, pick the model from Terminal-Bench."), href: "/build/cli-devops" },
      { title: tx("预算紧", "A tight budget"), body: tx("把模型换成 Claude Sonnet 5.5（价格减半，分数低 38）或开源的 DeepSeek V4.1 Flash，其余不变。", "Swap the model for Claude Sonnet 5.5 (half the price, 38 points lower) or open-weight DeepSeek V4.1 Flash. Leave the rest.") },
    ],
  },
  {
    slug: "android-app",
    scenario: "android-app",
    updatedAt: "2026-10-10",
    title: tx("做一个 Android App，用这一套", "Build an Android app with this set"),
    summary: tx(
      "模型取自 Android Bench 当前的 2.0 长程版本。界面用 Jetpack Compose。仓库约定写在 AGENTS.md 里，避免 Agent 再新增 XML。",
      "The model comes from the current Android Bench version, 2.0 long-horizon. UI is Jetpack Compose. Repo rules live in AGENTS.md so the agent does not add more XML.",
    ),
    roles: [
      {
        role: tx("模型", "Model"),
        primary: { kind: "pick", pick: "top" },
        purpose: tx("写代码的主力", "The main model for coding"),
        alternatives: [{ ref: { kind: "pick", pick: "value" }, tone: "value", when: tx("跑分成本不到一半", "under half the run cost") }],
      },
      {
        role: tx("UI", "UI"),
        primary: { kind: "item", slug: "jetpack-compose" },
        purpose: tx("声明式 Android 界面", "Declarative Android UI"),
        alternatives: [note("jetpack-compose", "存量 View 页面不迁移时，不要套这套 Compose 约定", "Do not apply the Compose rules to View screens you are not migrating")],
      },
      {
        role: tx("规则", "Rules"),
        primary: { kind: "item", slug: "android-agents" },
        purpose: tx("仓库约定，少写 XML", "Repo rules that keep XML out"),
        alternatives: [note("agents-md", "其他 Agent 也读仓库根目录的 AGENTS.md", "Other agents read AGENTS.md at the repo root too")],
      },
    ],
    agentsMd: tx(
      `# Android 约定
- 每次修改后运行 ./gradlew test lint
- UI 使用 Compose + Material 3，禁止新增 XML
- 新功能先写 ViewModel 单测，再写界面`,
      `# Android
- After each change, run ./gradlew test lint
- UI is Compose and Material 3. Do not add XML.
- For a new feature, write the ViewModel test before the screen.`,
    ),
    installCmds: tx(
      `# 仓库约定
把本页 AGENTS.md 放到仓库根目录

# UI
使用 Jetpack Compose，见 developer.android.com/jetpack/compose`,
      `# Repo rules
Put this page's AGENTS.md at the repo root

# UI
Use Jetpack Compose: developer.android.com/jetpack/compose`,
    ),
    notFor: [
      { title: tx("Web 前端", "Web frontend"), body: tx("浏览器里的页面看「做 Web 前端」，榜单是 LMArena WebDev。", "For a page in the browser, open “Build a Web frontend”. That board is LMArena WebDev."), href: "/build/web-frontend" },
      { title: tx("标准任务的历史版本", "The archived standard-task board"), body: tx("当前组合按 2.0 长程。1.0 的完整原榜仍在基准页，标为历史版本，不再更新。", "The current set follows 2.0 long-horizon. The full 1.0 board stays on the benchmark page, marked as an archived version that is no longer updated."), href: "/benchmarks/android-bench/#1.0" },
      { title: tx("iOS", "iOS"), body: tx("没有公开的 iOS 专项榜，这里不单开场景。", "There is no public iOS board, so this site does not invent a scenario for it.") },
    ],
  },
  {
    slug: "cli-devops",
    scenario: "cli-devops",
    updatedAt: "2026-10-10",
    title: tx("写 CLI 与脚本，用这一套", "Write CLI and scripts with this set"),
    summary: tx(
      "模型取自 Terminal-Bench 4.0。规则写进 AGENTS.md：先有可重复的命令，再改脚本。",
      "The model comes from Terminal-Bench 4.0. The rules go in AGENTS.md: a repeatable command first, then the script.",
    ),
    roles: [
      {
        role: tx("模型", "Model"),
        primary: { kind: "pick", pick: "top" },
        purpose: tx("写代码的主力", "The main model for coding"),
        alternatives: [{ ref: { kind: "pick", pick: "value" }, tone: "value", when: tx("跑分成本约为八分之一", "about an eighth of the run cost") }],
      },
      {
        role: tx("规则", "Rules"),
        primary: { kind: "item", slug: "agents-md" },
        purpose: tx("先有可重复命令再改脚本", "A repeatable command before the script"),
        alternatives: [note("skill-creator", "同一套终端做法要复用到别的仓库时，再收成 Skill", "Turn it into a skill when the same terminal practice should travel to other repos")],
      },
    ],
    agentsMd: tx(
      `# CLI 约定
- 先写一个可重复的命令或失败的测试，再改脚本
- 破坏性命令先停下来确认
- 改完用项目里已经写明的检查命令自查`,
      `# CLI
- Write a repeatable command or a failing test before changing the script
- Stop and confirm before a destructive command
- After the change, run the check command the repo already documents`,
    ),
    installCmds: tx(
      `# 仓库约定
把本页 AGENTS.md 放到仓库根目录`,
      `# Repo rules
Put this page's AGENTS.md at the repo root`,
    ),
    notFor: [
      { title: tx("界面才是主体", "The interface is the product"), body: tx("页面质量看 LMArena WebDev，不看终端通过率。", "Page quality is LMArena WebDev, not a terminal pass rate."), href: "/build/web-frontend" },
      { title: tx("Android", "Android"), body: tx("Kotlin / Compose 用 Android Bench，不用这张终端榜。", "Kotlin / Compose uses Android Bench, not this terminal board."), href: "/build/android-app" },
      { title: tx("只看通过率第一", "Only the top pass rate"), body: tx("批量脚本看成本。这个场景的省钱档在模型行的备选里。", "Batch scripts should read cost. The value tier is the alternative on the model row.") },
    ],
  },
  {
    slug: "saas",
    scenario: "cli-devops",
    updatedAt: "2026-10-10",
    title: tx("做全栈 SaaS，用这一套", "Build a full-stack SaaS with this set"),
    summary: tx(
      "模型取自「写 CLI、脚本与 DevOps」的 Terminal-Bench，按跑分成本选，不另开一张场景榜。Next.js、Supabase、Convex 和 ReactBench 各自独立，不合成一个分数。",
      "The model comes from Terminal-Bench on the CLI scenario, chosen by run cost. It is not a second scenario board. The Next.js, Supabase, Convex, and ReactBench evals stay separate and are not merged into one score.",
    ),
    citations: [
      { kind: "benchmark", slug: "nextjs-evals" },
      { kind: "benchmark", slug: "supabase-evals" },
      { kind: "benchmark", slug: "convex-evals" },
      { kind: "benchmark", slug: "reactbench" },
    ],
    roles: [
      {
        role: tx("模型", "Model"),
        primary: { kind: "pick", pick: "value" },
        alternatives: [{ ref: { kind: "pick", pick: "top" }, tone: "note", when: tx("不看成本、只看通过率时", "when you ignore cost and read only the pass rate") }],
      },
      {
        role: tx("应用框架", "App framework"),
        primary: { kind: "item", slug: "nextjs" },
        extras: [{ kind: "item", slug: "nextjs-agents-md" }],
        meta: tx("库 + AGENTS.md", "Library + AGENTS.md"),
        alternatives: [note("react", "界面层是 React。ReactBench 是生态评测，不是官方榜", "The UI layer is React. ReactBench is an ecosystem eval, not an official board")],
      },
      {
        role: tx("数据", "Data"),
        primary: { kind: "item", slug: "supabase" },
        extras: [{ kind: "item", slug: "supabase-skills" }],
        alternatives: [note("convex", "换 Convex 时看它自己的无指南榜，不要和 Supabase 的通过率相加", "If you switch to Convex, read its own no-guidelines board. Do not add it to the Supabase pass rate")],
      },
    ],
    agentsMd: tx(
      `# 全栈约定
- 应用框架：Next.js。Agent 读仓库里的 Next.js AGENTS.md，不凭记忆写 App Router
- 数据：Supabase。需要时加载官方 skills；基线能力以无 Skills 的评测为准
- 不把 Next.js、Supabase、Convex、ReactBench 的通过率加在一起`,
      `# Full stack
- App framework: Next.js. The agent reads the repo's Next.js AGENTS.md and does not write the App Router from memory.
- Data: Supabase. Load the official skills when needed. Baseline ability is the no-skills eval.
- Do not add Next.js, Supabase, Convex, and ReactBench pass rates together.`,
    ),
    installCmds: tx(
      `npx create-next-app@latest
npm i @supabase/supabase-js`,
      `npx create-next-app@latest
npm i @supabase/supabase-js`,
    ),
    notFor: [
      { title: tx("只做界面", "Interface only"), body: tx("页面质量看 Web 前端那一套。", "Page quality belongs on the web frontend set."), href: "/build/web-frontend" },
      { title: tx("把评测加总", "Adding the evals"), body: tx("每张框架评测测的是模型加上这一套框架。样本不大，前排又接近满分，不能合成一个排名。", "Each framework eval measures a model together with that framework. The samples are small and the front is near the ceiling, so they do not become one ranking.") },
      { title: tx("把有指南当成基线", "Treat with-guidelines as the baseline"), body: tx("有指南列是另一臂。名次仍看无指南；变化量在 Convex AI rules 页。", "With Guidelines is another arm. Rank still follows no-guidelines; the change lives on the Convex AI rules page.") },
    ],
  },
];
