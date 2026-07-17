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
    "tagline": "AIモデル評価と実利用レビューを、ひとつに",
    "language": "言語"
  },
  "hero": {
    "by": "開発",
    "released": "リリース",
    "openWeights": "オープンウェイト公開",
    "params": "パラメータ",
    "context": "コンテキスト",
    "license": "ライセンス",
    "outputSpeed": "出力速度",
    "ttft": "初回トークン",
    "cached": "キャッシュヒット"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "189 モデル中 4 位 · Artificial Analysis",
    "arena": "WebDev Arena 順位",
    "arenaSub": "1679 Elo · 1,757 票",
    "price": "料金 / 100万トークン",
    "priceSub": "入力 / 出力 · キャッシュヒット $0.30",
    "context": "コンテキストウィンドウ",
    "contextSub": "トークン · A4 約 1,573 ページ"
  },
  "bench": {
    "title": "ベンチマーク",
    "subtitle": "Kimi K3 とフロンティア級アンカーの比較。すべての数値は出典にリンク。",
    "benchmark": "ベンチマーク",
    "source": "出典"
  },
  "reviews": {
    "title": "コミュニティレビュー",
    "subtitle": "ブログ・X・YouTube から厳選——要約と原文リンク付き。",
    "consensusPros": "コンセンサス · 強み",
    "consensusCons": "コンセンサス · 弱み",
    "readOriginal": "原文を読む"
  },
  "footer": {
    "sources": "データ出典",
    "updated": "データ確認日",
    "disclaimer": "AIEvalIndex は公開ベンチマークとコミュニティレビューを集約。すべての数値は出典にリンクしています。",
    "aiNote": "ja · ko · es · fr ページは英語版からの AI 翻訳です。誤りの指摘を歓迎します。"
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
