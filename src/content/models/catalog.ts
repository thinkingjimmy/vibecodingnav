/**
 * [INPUT]: 依赖模型注册表的 ModelSlug 类型与 public/model-logos 厂商资产路径
 * [OUTPUT]: 对外提供 Header 模型菜单的厂商分组、展示名称、分数、语义状态与可用 slug
 * [POS]: src/content/models 的轻量模型目录，详情数据与导航展示之间的单一真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ModelSlug } from "@/lib/model";

export interface ModelCatalogGroup {
  vendor: string;
  logo: string;
  models: Array<{
    name: string;
    score: number;
    tone: "positive" | "neutral" | "current";
    slug?: ModelSlug;
  }>;
}

export const MODEL_CATALOG: ModelCatalogGroup[] = [
  {
    vendor: "OpenAI",
    logo: "/model-logos/openai.svg",
    models: [
      { name: "GPT-5.6", score: 59, tone: "positive", slug: "gpt-5-6-sol" },
      { name: "GPT-5.5", score: 55, tone: "positive" },
      { name: "GPT-5.1 mini", score: 44, tone: "neutral" },
    ],
  },
  {
    vendor: "Anthropic",
    logo: "/model-logos/claude-color.svg",
    models: [
      { name: "Claude Opus 4.8", score: 60, tone: "positive" },
      { name: "Claude Fable 5", score: 60, tone: "positive" },
      { name: "Claude Sonnet 4.8", score: 52, tone: "neutral" },
    ],
  },
  {
    vendor: "Moonshot",
    logo: "/model-logos/moonshot.svg",
    models: [
      { name: "Kimi K3", score: 57, tone: "current", slug: "kimi-k3" },
      { name: "Kimi K2.6", score: 49, tone: "neutral" },
    ],
  },
  {
    vendor: "Google",
    logo: "/model-logos/gemini-color.svg",
    models: [
      { name: "Gemini 3.5 Pro", score: 59, tone: "positive" },
      { name: "Gemini 3.5 Flash", score: 46, tone: "neutral" },
    ],
  },
];
