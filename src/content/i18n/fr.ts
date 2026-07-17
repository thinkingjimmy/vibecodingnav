/**
 * [INPUT]: 依赖 src/lib/contracts 的 DeepPartial/Dictionary 契约与英文兜底策略
 * [OUTPUT]: 对外提供法语 UI 覆盖字典
 * [POS]: src/content/i18n 的法语内容模块，被 src/lib/i18n.ts 合并到英文母本
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { DeepPartial, Dictionary } from "@/lib/contracts";

const dictionary = {
  "meta": {
    "title": "Kimi K3 — Benchmarks, classement d'arène et avis réels | AIEvalIndex",
    "description": "Benchmarks officiels, classements d'arène et avis communautaires sélectionnés pour Kimi K3 de Moonshot AI — chaque chiffre renvoie à sa source."
  },
  "header": {
    "language": "Langue"
  },
  "hero": {
    "by": "par",
    "released": "Sorti le",
    "openWeights": "poids ouverts le",
    "params": "paramètres",
    "context": "contexte",
    "license": "licence",
    "outputSpeed": "vitesse de sortie",
    "ttft": "premier token",
    "cached": "cache"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "4e sur 189 · Artificial Analysis",
    "arena": "Classement WebDev Arena",
    "arenaSub": "1679 Elo · 1 757 votes",
    "price": "Tarif / 1M tokens",
    "priceSub": "entrée / sortie · cache 0,30 $",
    "context": "Fenêtre de contexte",
    "contextSub": "tokens · ≈ 1 573 pages A4"
  },
  "bench": {
    "title": "Benchmarks",
    "subtitle": "Kimi K3 face aux ancres de la frontière. Chaque chiffre renvoie à sa source.",
    "benchmark": "Benchmark",
    "source": "source"
  },
  "reviews": {
    "title": "Avis de la communauté",
    "subtitle": "Sélection manuelle issue de blogs, de X et de YouTube — résumés, avec liens vers les originaux.",
    "consensusPros": "Consensus · Points forts",
    "consensusCons": "Consensus · Points faibles",
    "readOriginal": "Lire l'original"
  },
  "footer": {
    "tagline": "Scores des modèles d’IA et avis réels, réunis",
    "sources": "Sources des données",
    "updated": "Données vérifiées le",
    "disclaimer": "AIEvalIndex agrège des données publiques de benchmarks et des avis communautaires. Chaque chiffre renvoie à sa source.",
    "aiNote": "Les pages ja · ko · es · fr sont des traductions IA de l'original anglais ; les corrections sont bienvenues."
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
