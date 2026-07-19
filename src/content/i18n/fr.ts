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
    "language": "Langue",
    "models": "Modèles",
    "leaderboard": "Classement",
    "methodology": "Méthodologie"
  },
  "hero": {
    "by": "par",
    "released": "Sorti",
    "weights": "Poids",
    "weightsDue": "prévu",
    "firstToken": "Premier token",
    "verbosity": "Verbosité",
    "parameters": "Paramètres",
    "modality": "Modalité"
  },
  "stats": {
    "intelligence": "Intelligence",
    "intelligenceSub": "82e percentile · médiane 30",
    "speed": "Vitesse de sortie",
    "speedSub": "sous la médiane 73",
    "price": "Tarif / 1M",
    "priceSub": "entrée / sortie · cache 0,30 $",
    "context": "Contexte",
    "contextSub": "≈ 1 573 pages A4"
  },
  "bench": {
    "title": "Benchmarks",
    "versus": "vs",
    "anchors": "ancres de référence",
    "subtitle": "Plus haut est meilleur · meilleur de la ligne en gras",
    "compare": "Comparer",
    "benchmark": "Benchmark",
    "wins": "Victoires"
  },
  "reviews": {
    "title": "Verdict de la communauté",
    "consensusPros": "Ses points forts",
    "consensusCons": "Ses points faibles",
    "rave": "enthousiaste",
    "mixed": "mitigé",
    "critical": "critique",
    "takes": "avis",
    "sources": "Sources des avis"
  },
  "feed": {
    "title": "Avis de la communauté",
    "headlineLead": "En direct du",
    "headlineQualifier": "fil",
    "subtitle": "Chaque carte conserve l'allure de sa plateforme",
    "positiveLabel": "atouts",
    "negativeLabel": "limites",
    "readArticle": "Lire l'article",
    "watchVideo": "Voir la vidéo",
    "minRead": "min de lecture"
  },
  "footer": {
    "description": "Un index indépendant, sélectionné à la main, des évaluations de modèles de pointe — chaque chiffre renvoie à sa source.",
    "explore": "Explorer",
    "about": "À propos",
    "models": "Modèles",
    "leaderboards": "Classements",
    "benchmarks": "Benchmarks",
    "reviews": "Avis",
    "methodology": "Méthodologie",
    "dataSources": "Sources des données",
    "modelDataFrom": "Données du modèle par",
    "updated": "mis à jour"
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
