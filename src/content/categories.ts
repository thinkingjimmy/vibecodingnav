/**
 * [INPUT]: 依赖 ToolCategory 契约，条目 slug 指向 items
 * [OUTPUT]: 对外提供八个工具分类及编辑排序
 * [POS]: src/content 的工具箱目录
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { LText, ToolCategory } from "@/lib/contracts";

const tx = (zh: string, en: string): LText => ({ zh, en });
const tip = (zhTitle: string, enTitle: string, zhBody: string, enBody: string) => ({
  title: tx(zhTitle, enTitle),
  body: tx(zhBody, enBody),
});

export const categories: ToolCategory[] = [
  {
    slug: "ui",
    title: tx("UI 组件", "UI components"),
    summary: tx("可复制的界面底座，以及让 Agent 按这套底座写的 Skill 和插件。", "A copy-in UI base, plus the skill and plugin that keep an agent on it."),
    updatedAt: "2026-10-10",
    items: ["shadcn-ui", "shadcn-mcp", "frontend-design"],
    howToPick: [
      tip("有组件约定", "When the components are chosen", "用 shadcn/ui，并把 shadcn MCP 装上，避免 Agent 另写一套按钮。", "Use shadcn/ui and add the shadcn MCP so the agent does not invent another button."),
      tip("还没有视觉方向", "When there is no visual direction", "先装 frontend-design，再写页面。", "Install frontend-design before writing the page."),
      tip("要无样式原语", "When you want unstyled primitives", "换 Base UI，不把 shadcn 的样式一起带进来。", "Use Base UI and do not bring shadcn's styles along."),
    ],
  },
  {
    slug: "icons",
    title: tx("图标", "Icons"),
    summary: tx("界面图标与品牌 logo 分开选。一个产品只留一套界面图标。", "Pick interface icons and brand marks separately. Keep one interface set per product."),
    updatedAt: "2026-10-10",
    items: ["phosphor-icons", "lobehub-icons", "lucide", "iconify"],
    howToPick: [
      tip("需要字重", "When you need weights", "用 Phosphor，选中态再换 fill。", "Use Phosphor, and switch the selected state to fill."),
      tip("沿用 shadcn 示例", "When you stay with the shadcn examples", "继续用 Lucide，不必为了换图标重写示例。", "Stay on Lucide. Do not rewrite the examples just to change icons."),
      tip("厂商 logo", "Vendor marks", "AI 品牌标用 LobeHub，不要画进 Phosphor。", "Use LobeHub for AI brand marks. Do not draw them in Phosphor."),
    ],
  },
  {
    slug: "motion",
    title: tx("动效", "Motion"),
    summary: tx("页面过渡、手势、滚动动画，以及让编程 Agent 把动画写对的 Skill 和插件。", "Page transitions, gestures, and scroll, plus the skills and plugins that help an agent write the animation correctly."),
    updatedAt: "2026-10-10",
    items: ["motion", "motion-ai-kit", "gsap", "gsap-skills", "react-view-transitions", "react-bits", "animejs"],
    homeItems: ["motion", "motion-ai-kit", "gsap-skills"],
    howToPick: [
      tip("React 项目", "React projects", "先用 Motion；让 Agent 写的话，把 Motion AI Kit 一起装上。", "Start with Motion. If an agent will write it, install Motion AI Kit too."),
      tip("复杂时间线或滚动叙事", "Complex timelines or scroll stories", "选 GSAP，并装 gsap-skills，避免 Agent 写出过时的 Club 插件用法。", "Choose GSAP and install gsap-skills so the agent does not write outdated Club plugin code."),
      tip("Next.js 页面切换", "Next.js page changes", "先试 View Transitions：浏览器原生、零依赖，不支持的浏览器自动跳过动画。", "Try View Transitions first: native, no dependency, and unsupported browsers skip the animation."),
      tip("少即是多", "Less is enough", "一个页面只留一处编排好的动效，比处处淡入更像人做的。", "One composed motion on a page looks more considered than a fade on every block."),
    ],
  },
  {
    slug: "type",
    title: tx("字体", "Type"),
    summary: tx("界面字体、中文回退，以及只用于封面的展示字体。", "UI type, a Chinese fallback, and display faces that stay on covers."),
    updatedAt: "2026-10-10",
    items: ["geist", "lxgw-wenkai", "qiaomu-cover-fonts"],
    howToPick: [
      tip("界面与数字", "UI and figures", "Geist Sans / Mono。", "Geist Sans and Mono."),
      tip("中文正文", "Chinese text", "回退到霞鹜文楷。", "Fall back to LXGW WenKai."),
      tip("封面", "Covers", "用 qiaomu-cover-fonts，不要拿来排长文。", "Use qiaomu-cover-fonts, not for long text."),
    ],
  },
  {
    slug: "charts",
    title: tx("图表", "Charts"),
    summary: tx("后台图表与让 Agent 出图的插件。", "Admin charts, and a plugin that lets an agent produce one."),
    updatedAt: "2026-10-10",
    items: ["recharts", "echarts", "mcp-server-chart"],
    howToPick: [
      tip("普通后台", "Ordinary admin", "Recharts 够用。", "Recharts is enough."),
      tip("种类或数据量上去", "More types or more data", "换 Apache ECharts。", "Switch to Apache ECharts."),
      tip("让 Agent 出图", "Let the agent draw it", "加上 mcp-server-chart。", "Add mcp-server-chart."),
    ],
  },
  {
    slug: "forms",
    title: tx("表单与校验", "Forms and validation"),
    summary: tx("表单状态和一份前后端共用的 schema。", "Form state, and one schema shared by client and server."),
    updatedAt: "2026-10-10",
    items: ["react-hook-form", "zod", "tanstack-form"],
    howToPick: [
      tip("React 表单", "React forms", "React Hook Form 加 Zod。", "React Hook Form plus Zod."),
      tip("schema 要跨端", "A schema that crosses the wire", "Zod 放在共享模块，不要在客户端再写一套正则。", "Put Zod in a shared module. Do not add a second regex on the client."),
      tip("不想用 Hook Form", "Not Hook Form", "用 TanStack Form，仍然配 Zod。", "Use TanStack Form, still with Zod."),
    ],
  },
  {
    slug: "design",
    title: tx("设计还原", "Design handoff"),
    summary: tx("有稿就对照稿，没有稿就先出原型，做完用规范自查。", "Follow the file when you have one. Prototype first when you do not. Review against the guidelines when the page exists."),
    updatedAt: "2026-10-10",
    items: ["figma-mcp", "open-design", "web-design-guidelines"],
    howToPick: [
      tip("已有 Figma", "A Figma file exists", "用 Figma MCP server，让实现对照稿。", "Use the Figma MCP server and implement against the file."),
      tip("没有稿", "No file yet", "用 open-design 先出可看的原型。", "Use open-design to get a prototype you can look at."),
      tip("做完", "After it exists", "用 web-design-guidelines 查对比度、焦点和触控尺寸。", "Use web-design-guidelines for contrast, focus, and hit targets."),
    ],
  },
  {
    slug: "rules",
    title: tx("项目规则", "Project rules"),
    summary: tx("仓库级说明、别人的系统提示，以及用来写新技能的技能。", "Repo-level instructions, other people's system prompts, and a skill for writing a new skill."),
    updatedAt: "2026-10-10",
    items: ["agents-md", "system-prompts", "skill-creator", "android-agents"],
    howToPick: [
      tip("给当前仓库", "For this repo", "写 AGENTS.md，人和 Agent 读同一份。", "Write AGENTS.md. People and agents read the same file."),
      tip("动手前", "Before you write rules", "翻 system-prompts 合集，避免和工具默认提示打架。", "Read the system-prompts collection so you do not fight the tool's default prompt."),
      tip("反复出现的做法", "A practice that keeps coming back", "用 skill-creator 收成 SKILL.md。", "Turn it into a SKILL.md with skill-creator."),
    ],
  },
];
