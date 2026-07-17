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
    "tagline": "Puntuaciones de modelos de IA y reseñas reales, en un solo lugar",
    "language": "Idioma"
  },
  "hero": {
    "by": "por",
    "released": "Lanzado el",
    "openWeights": "pesos abiertos",
    "params": "parámetros",
    "context": "contexto",
    "license": "licencia",
    "outputSpeed": "velocidad de salida",
    "ttft": "primer token",
    "cached": "caché"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "#4 de 189 · Artificial Analysis",
    "arena": "Ranking WebDev Arena",
    "arenaSub": "1679 Elo · 1,757 votos",
    "price": "Precio / 1M tokens",
    "priceSub": "entrada / salida · caché $0.30",
    "context": "Ventana de contexto",
    "contextSub": "tokens · ≈ 1,573 páginas A4"
  },
  "bench": {
    "title": "Benchmarks",
    "subtitle": "Kimi K3 frente a anclas de frontera. Cada número enlaza a su fuente.",
    "benchmark": "Benchmark",
    "source": "fuente"
  },
  "reviews": {
    "title": "Reseñas de la comunidad",
    "subtitle": "Selección manual de blogs, X y YouTube — resumidas, con enlaces a los originales.",
    "consensusPros": "Consenso · Fortalezas",
    "consensusCons": "Consenso · Debilidades",
    "readOriginal": "Leer original"
  },
  "footer": {
    "sources": "Fuentes de datos",
    "updated": "Datos verificados",
    "disclaimer": "AIEvalIndex agrega datos públicos de benchmarks y reseñas comunitarias. Cada cifra enlaza a su fuente.",
    "aiNote": "Las páginas ja · ko · es · fr son traducciones por IA del original en inglés; se agradecen correcciones."
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
