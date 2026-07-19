/**
 * [INPUT]: 依赖 src/lib/contracts 的 DeepPartial/Dictionary 契约与英文兜底策略
 * [OUTPUT]: 对外提供韩语 UI 覆盖字典
 * [POS]: src/content/i18n 的韩语内容模块，被 src/lib/i18n.ts 合并到英文母本
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { DeepPartial, Dictionary } from "@/lib/contracts";

const dictionary = {
  "meta": {
    "title": "Kimi K3 — 벤치마크·아레나 순위·실사용 리뷰 | AIEvalIndex",
    "description": "Moonshot AI Kimi K3의 공식 벤치마크, 아레나 순위, 엄선된 커뮤니티 리뷰 — 모든 수치는 출처로 연결됩니다."
  },
  "header": {
    "language": "언어",
    "models": "모델",
    "leaderboard": "리더보드",
    "methodology": "평가 방법"
  },
  "hero": {
    "by": "개발",
    "released": "출시",
    "weights": "웨이트",
    "weightsDue": "공개 예정",
    "firstToken": "첫 토큰",
    "verbosity": "출력량",
    "parameters": "파라미터",
    "modality": "모달리티"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "중앙값 30 대비 · Artificial Analysis",
    "speed": "출력 속도",
    "speedSub": "tok/s · 중앙값 73 미만",
    "price": "가격 / 1M",
    "priceSub": "입력 / 출력 · 캐시 히트 $0.30",
    "context": "컨텍스트 윈도우",
    "contextSub": "토큰 · A4 약 1,573쪽"
  },
  "bench": {
    "title": "벤치마크",
    "versus": "vs.",
    "anchors": "프런티어 앵커",
    "subtitle": "높을수록 좋음 · 행별 최고값 굵게",
    "benchmark": "벤치마크",
    "wins": "승리 항목"
  },
  "reviews": {
    "title": "커뮤니티 평가",
    "consensusPros": "강점",
    "consensusCons": "약점",
    "rave": "극찬",
    "mixed": "엇갈림",
    "critical": "비판",
    "takes": "개 평가",
    "sources": "리뷰 출처"
  },
  "footer": {
    "description": "독립적으로 엄선한 프런티어 모델 평가 인덱스입니다. 모든 수치는 원출처로 연결됩니다.",
    "explore": "둘러보기",
    "about": "소개",
    "models": "모델",
    "leaderboards": "리더보드",
    "benchmarks": "벤치마크",
    "reviews": "리뷰",
    "methodology": "평가 방법",
    "dataSources": "데이터 출처",
    "modelDataFrom": "모델 데이터 출처",
    "updated": "업데이트"
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
