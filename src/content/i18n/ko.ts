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
    "tagline": "AI 모델 점수와 실제 사용 후기를 한눈에",
    "language": "언어"
  },
  "hero": {
    "by": "개발",
    "released": "출시",
    "openWeights": "오픈 웨이트 공개",
    "params": "파라미터",
    "context": "컨텍스트",
    "license": "라이선스",
    "outputSpeed": "출력 속도",
    "ttft": "첫 토큰",
    "cached": "캐시 히트"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "189개 모델 중 4위 · Artificial Analysis",
    "arena": "WebDev Arena 순위",
    "arenaSub": "1679 Elo · 1,757표",
    "price": "가격 / 100만 토큰",
    "priceSub": "입력 / 출력 · 캐시 히트 $0.30",
    "context": "컨텍스트 윈도우",
    "contextSub": "토큰 · A4 약 1,573쪽"
  },
  "bench": {
    "title": "벤치마크",
    "subtitle": "Kimi K3 vs 프런티어 앵커 모델. 모든 수치는 출처로 연결됩니다.",
    "benchmark": "벤치마크",
    "source": "출처"
  },
  "reviews": {
    "title": "커뮤니티 리뷰",
    "subtitle": "블로그·X·YouTube에서 엄선 — 요약과 원문 링크 제공.",
    "consensusPros": "컨센서스 · 강점",
    "consensusCons": "컨센서스 · 약점",
    "readOriginal": "원문 읽기"
  },
  "footer": {
    "sources": "데이터 출처",
    "updated": "데이터 확인일",
    "disclaimer": "AIEvalIndex는 공개 벤치마크 데이터와 커뮤니티 리뷰를 모읍니다. 모든 수치는 출처로 연결됩니다.",
    "aiNote": "ja · ko · es · fr 페이지는 영어 원본의 AI 번역입니다. 오류 제보를 환영합니다."
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
