/**
 * [INPUT]: 依赖 src/lib/contracts 的 DeepPartial/Dictionary 契约与英文兜底策略
 * [OUTPUT]: 对外提供西班牙语 UI 覆盖字典
 * [POS]: src/content/i18n 的西班牙语内容模块，被 src/lib/i18n.ts 合并到英文母本
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { DeepPartial, Dictionary } from "@/lib/contracts";

const dictionary = {
  "meta": {
    "title": "Kimi K3 — Benchmarks, ranking de arena y reseñas reales | AIEvalIndex",
    "description": "Benchmarks oficiales, rankings de arena y reseñas comunitarias seleccionadas de Kimi K3 de Moonshot AI — cada cifra enlaza a su fuente."
  },
  "header": {
    "language": "Idioma",
    "models": "Modelos",
    "leaderboard": "Clasificación",
    "methodology": "Metodología"
  },
  "hero": {
    "by": "por",
    "released": "Lanzado",
    "weights": "Pesos",
    "weightsDue": "previsto",
    "firstToken": "Primer token",
    "verbosity": "Verbosidad",
    "parameters": "Parámetros",
    "modality": "Modalidad"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "vs mediana 30 · Artificial Analysis",
    "speed": "Velocidad de salida",
    "speedSub": "tok/s · bajo la mediana 73",
    "price": "Precio / 1M",
    "priceSub": "entrada / salida · caché $0.30",
    "context": "Ventana de contexto",
    "contextSub": "tokens · ≈ 1,573 páginas A4"
  },
  "bench": {
    "title": "Benchmarks",
    "versus": "vs.",
    "anchors": "anclas de frontera",
    "subtitle": "Más alto es mejor · mejor de cada fila en negrita",
    "benchmark": "Benchmark",
    "wins": "Victorias"
  },
  "reviews": {
    "title": "Veredicto de la comunidad",
    "consensusPros": "Dónde destaca",
    "consensusCons": "Dónde flaquea",
    "rave": "entusiasta",
    "mixed": "mixta",
    "critical": "crítica",
    "takes": "opiniones",
    "sources": "Fuentes de reseñas"
  },
  "footer": {
    "description": "Un índice independiente y seleccionado a mano de evaluaciones de modelos frontera; cada cifra enlaza a su fuente.",
    "explore": "Explorar",
    "about": "Acerca de",
    "models": "Modelos",
    "leaderboards": "Clasificaciones",
    "benchmarks": "Benchmarks",
    "reviews": "Reseñas",
    "methodology": "Metodología",
    "dataSources": "Fuentes de datos",
    "modelDataFrom": "Datos del modelo de",
    "updated": "actualizado"
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
