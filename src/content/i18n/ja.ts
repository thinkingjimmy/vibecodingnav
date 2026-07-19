/**
 * [INPUT]: 依赖 src/lib/contracts 的 DeepPartial/Dictionary 契约与英文兜底策略
 * [OUTPUT]: 对外提供日语 UI 覆盖字典
 * [POS]: src/content/i18n 的日语内容模块，被 src/lib/i18n.ts 合并到英文母本
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { DeepPartial, Dictionary } from "@/lib/contracts";

const dictionary = {
  "meta": {
    "title": "Kimi K3 — ベンチマーク・アリーナ順位・実ユーザー評価 | AIEvalIndex",
    "description": "Moonshot AI「Kimi K3」の公式ベンチマーク、アリーナ順位、厳選コミュニティレビュー——すべての数値は出典にリンク。"
  },
  "header": {
    "language": "言語",
    "models": "モデル",
    "leaderboard": "ランキング",
    "methodology": "評価方法"
  },
  "hero": {
    "by": "開発",
    "released": "リリース",
    "weights": "ウェイト",
    "weightsDue": "公開予定",
    "firstToken": "初回トークン",
    "verbosity": "出力量",
    "parameters": "パラメータ",
    "modality": "モダリティ"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "中央値 30 比 · Artificial Analysis",
    "speed": "出力速度",
    "speedSub": "tok/s · 中央値 73 未満",
    "price": "料金 / 1M",
    "priceSub": "入力 / 出力 · キャッシュヒット $0.30",
    "context": "コンテキストウィンドウ",
    "contextSub": "トークン · A4 約 1,573 ページ"
  },
  "bench": {
    "title": "ベンチマーク",
    "versus": "対",
    "anchors": "フロンティア級アンカー",
    "subtitle": "高いほど良い · 行内最高値を太字",
    "benchmark": "ベンチマーク",
    "wins": "勝利数"
  },
  "reviews": {
    "title": "コミュニティの評価",
    "consensusPros": "優れている点",
    "consensusCons": "弱い点",
    "rave": "絶賛",
    "mixed": "賛否混合",
    "critical": "批判的",
    "takes": "件の評価",
    "sources": "レビュー出典"
  },
  "footer": {
    "description": "独立した手作業によるフロンティアモデル評価索引。すべての数値から出典を確認できます。",
    "explore": "見る",
    "about": "概要",
    "models": "モデル",
    "leaderboards": "ランキング",
    "benchmarks": "ベンチマーク",
    "reviews": "レビュー",
    "methodology": "評価方法",
    "dataSources": "データ出典",
    "modelDataFrom": "モデルデータ提供",
    "updated": "更新"
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
