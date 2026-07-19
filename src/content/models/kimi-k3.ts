/**
 * [INPUT]: 依赖 src/lib/contracts 的 ModelEvaluation 类型，内容来自 2026-07-17 人工核验快照
 * [OUTPUT]: 对外提供 Kimi K3 模型信息、带单位/色调的顶部指标、跑分、含正负关键短语的评价原声流元数据、社区结论、共识与数据源
 * [POS]: src/content/models 的首个类型化模型内容模块，被 src/lib/model.ts 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ModelEvaluation } from "@/lib/contracts";

const evaluation = {
  "updated": "2026-07-17",

  "model": {
    "name": "Kimi K3",
    "kicker": "Reasoning · Multimodal",
    "vendor": "Moonshot AI",
    "params": "2.8T",
    "architecture": "MoE",
    "context": "1M",
    "modality": "Text + Image",
    "license": "Modified MIT",
    "released": "2026-07-16",
    "openWeights": "2026-07-27"
  },

  "pricing": { "input": 3.0, "output": 15.0, "cached": 0.3 },

  "performance": {
    "outputSpeed": "62 tokens/s",
    "speedRank": "#90 / 189",
    "ttft": "1.99 s",
    "verbosity": "130M tokens"
  },

  "anchors": [
    { "name": "Claude Fable 5", "label": "Fable 5" },
    { "name": "GPT-5.6 Sol", "label": "GPT-5.6" },
    { "name": "Claude Opus 4.8", "label": "Opus 4.8" }
  ],

  "heroStats": [
    { "value": "57", "unit": "idx", "badge": "#4/189", "bar": 82, "tone": "accent", "labelKey": "intelligence", "subKey": "intelligenceSub" },
    { "value": "62", "unit": "tokens/s", "badge": "#90/189", "bar": 46, "tone": "neutral", "labelKey": "speed", "subKey": "speedSub" },
    { "value": "$3/$15", "unit": "", "badge": "#127/189", "bar": 33, "tone": "neutral", "labelKey": "price", "subKey": "priceSub" },
    { "value": "1M", "unit": "tokens", "badge": "top 5%", "bar": 95, "tone": "accent", "labelKey": "context", "subKey": "contextSub" }
  ],

  "benchmarks": [
    {
      "name": "Intelligence Index v4.1",
      "sourceLabel": "Artificial Analysis",
      "url": "https://artificialanalysis.ai/models/kimi-k3",
      "score": "57",
      "detail": "#4/189",
      "peers": { "Claude Fable 5": "60", "GPT-5.6 Sol": "58" },
      "note": "GPT-5.6 Sol = xhigh effort"
    },
    {
      "name": "WebDev Arena",
      "sourceLabel": "Arena.ai",
      "url": "https://arena.ai/leaderboard/code/webdev",
      "score": "1679",
      "detail": "#1 · 1,757 votes",
      "peers": { "Claude Fable 5": "1631", "GPT-5.6 Sol": "1618", "Claude Opus 4.8": "1562" },
      "note": "kimi-k2.6 #18 (1515) · kimi-k2.7-code #26 (1470)"
    },
    {
      "name": "GDPval-AA v2",
      "sourceLabel": "Moonshot · via kingy.ai",
      "url": "https://kingy.ai/blog/kimi-k3-benchmarks-specs-price-fable-5-gpt-5-6-sol/",
      "score": "1668",
      "detail": "Elo",
      "peers": { "Claude Fable 5": "1760", "GPT-5.6 Sol": "1748" },
      "note": ""
    },
    {
      "name": "GPQA Diamond",
      "sourceLabel": "Moonshot AI",
      "url": "https://www.kimi.com/blog/kimi-k3",
      "score": "93.5",
      "detail": "%",
      "peers": { "Claude Fable 5": "92.6", "GPT-5.6 Sol": "94.1", "Claude Opus 4.8": "91" },
      "note": ""
    },
    {
      "name": "Humanity's Last Exam",
      "sourceLabel": "Moonshot AI",
      "url": "https://www.kimi.com/blog/kimi-k3",
      "score": "43.5",
      "detail": "% · full set",
      "peers": { "Claude Fable 5": "53.3", "GPT-5.6 Sol": "44.5", "Claude Opus 4.8": "49.8" },
      "note": "w/ tools: 56.0 vs 63.0 / 58.0 / 57.9"
    },
    {
      "name": "Terminal-Bench 2.1",
      "sourceLabel": "Moonshot AI",
      "url": "https://www.kimi.com/blog/kimi-k3",
      "score": "88.3",
      "detail": "%",
      "peers": { "Claude Fable 5": "84.6", "GPT-5.6 Sol": "88.8", "Claude Opus 4.8": "84.6" },
      "note": ""
    },
    {
      "name": "DeepSWE",
      "sourceLabel": "Moonshot AI",
      "url": "https://www.kimi.com/blog/kimi-k3",
      "score": "67.5",
      "detail": "",
      "peers": { "Claude Fable 5": "70", "GPT-5.6 Sol": "73", "Claude Opus 4.8": "59" },
      "note": "GPT-5.5: 67.0"
    },
    {
      "name": "Program Bench",
      "sourceLabel": "Moonshot AI",
      "url": "https://www.kimi.com/blog/kimi-k3",
      "score": "77.8",
      "detail": "",
      "peers": { "Claude Fable 5": "76.8", "GPT-5.6 Sol": "77.6", "Claude Opus 4.8": "71.9" },
      "note": "GPT-5.5: 70.8"
    },
    {
      "name": "BrowseComp",
      "sourceLabel": "Moonshot AI",
      "url": "https://www.kimi.com/blog/kimi-k3",
      "score": "91.2",
      "detail": "%",
      "peers": { "Claude Fable 5": "88", "GPT-5.6 Sol": "90.4" },
      "note": ""
    },
    {
      "name": "Automation Bench",
      "sourceLabel": "Moonshot AI",
      "url": "https://www.kimi.com/blog/kimi-k3",
      "score": "30.8",
      "detail": "",
      "peers": { "Claude Fable 5": "29.1", "GPT-5.6 Sol": "29.7" },
      "note": ""
    },
    {
      "name": "MMMU-Pro",
      "sourceLabel": "Moonshot · via kingy.ai",
      "url": "https://kingy.ai/blog/kimi-k3-benchmarks-specs-price-fable-5-gpt-5-6-sol/",
      "score": "80.5",
      "detail": "%",
      "peers": { "Claude Fable 5": "81.2", "GPT-5.6 Sol": "83" },
      "note": ""
    }
  ],

  "reviews": [
    {
      "author": "Simon Willison",
      "source": "blog",
      "url": "https://simonwillison.net/2026/Jul/16/kimi-k3/",
      "date": "2026-07-16",
      "summary": {
        "en": "First open 3T-class model. Beats Claude Opus 4.8 and GPT-5.5 on several benchmarks with excellent vision, and uses 21% fewer output tokens than K2.6 — but it's the priciest Chinese-lab model yet and burns reasoning tokens: a single pelican SVG cost about $0.25.",
        "zh-CN": "首个开源 3T 级模型。多项跑分超过 Claude Opus 4.8 与 GPT-5.5，视觉能力出色，输出 token 比 K2.6 省 21%——但也是迄今最贵的中国实验室模型，且推理 token 消耗大：一张鹈鹕 SVG 花了约 $0.25。",
        "ja": "初のオープン 3T 級モデル。複数のベンチマークで Claude Opus 4.8 と GPT-5.5 を上回り、視覚能力も優秀。出力トークンは K2.6 比 21% 減——ただし中国ラボ製で最も高価、推論トークン消費も大きく、ペリカン SVG 一枚で約 $0.25。",
        "ko": "최초의 오픈 3T급 모델. 여러 벤치마크에서 Claude Opus 4.8과 GPT-5.5를 능가하고 비전 능력도 뛰어나며, 출력 토큰은 K2.6보다 21% 적다. 다만 중국 랩 모델 중 가장 비싸고 추론 토큰 소모가 커서 펠리컨 SVG 한 장에 약 $0.25가 들었다.",
        "es": "Primer modelo abierto de clase 3T. Supera a Claude Opus 4.8 y GPT-5.5 en varios benchmarks, con excelente visión y un 21% menos de tokens de salida que K2.6 — pero es el modelo más caro de un laboratorio chino hasta la fecha y consume muchos tokens de razonamiento: un solo SVG de pelícano costó unos $0.25.",
        "fr": "Premier modèle ouvert de classe 3T. Il dépasse Claude Opus 4.8 et GPT-5.5 sur plusieurs benchmarks, avec une excellente vision et 21 % de tokens de sortie en moins que K2.6 — mais c'est le modèle de laboratoire chinois le plus cher à ce jour, et il consomme beaucoup de tokens de raisonnement : un simple SVG de pélican a coûté environ 0,25 $."
      },
      "pros": [
        { "en": "First open 3T-class model (2.8T params, open weights due Jul 27)" },
        { "en": "Beats Claude Opus 4.8 & GPT-5.5 on multiple benchmarks; excellent vision" },
        { "en": "21% fewer output tokens than K2.6" }
      ],
      "cons": [
        { "en": "Priciest Chinese-lab model yet ($3 / $15 per 1M tokens)" },
        { "en": "Heavy reasoning-token spend — one SVG ≈ 16.7K tokens ≈ $0.25" },
        { "en": "Single reasoning-effort level; ~85-token hidden system prompt" }
      ],
      "feed": {
        "displayName": "Simon Willison",
        "initials": "SW",
        "sourceLabel": "simonwillison.net",
        "readMinutes": 4,
        "highlights": {
          "positive": {
            "en": ["Beats Claude Opus 4.8 and GPT-5.5", "21% fewer output tokens than K2.6"],
            "zh-CN": ["多项跑分超过 Claude Opus 4.8 与 GPT-5.5", "输出 token 比 K2.6 省 21%"],
            "ja": ["複数のベンチマークで Claude Opus 4.8 と GPT-5.5 を上回り", "出力トークンは K2.6 比 21 % 減"],
            "ko": ["여러 벤치마크에서 Claude Opus 4.8과 GPT-5.5를 능가하고", "출력 토큰은 K2.6보다 21% 적다"],
            "es": ["Supera a Claude Opus 4.8 y GPT-5.5", "un 21% menos de tokens de salida que K2.6"],
            "fr": ["Il dépasse Claude Opus 4.8 et GPT-5.5", "21 % de tokens de sortie en moins que K2.6"]
          },
          "negative": {
            "en": ["priciest Chinese-lab model yet"],
            "zh-CN": ["迄今最贵的中国实验室模型"],
            "ja": ["中国ラボ製で最も高価"],
            "ko": ["중국 랩 모델 중 가장 비싸고"],
            "es": ["el modelo más caro de un laboratorio chino hasta la fecha"],
            "fr": ["le modèle de laboratoire chinois le plus cher à ce jour"]
          }
        }
      }
    },
    {
      "author": "Lentils (@Lentils80)",
      "source": "x",
      "url": "https://x.com/Lentils80/status/2077387333154857151",
      "date": "2026-07-16",
      "summary": {
        "en": "Tried K3 on frontend: VERY slow — even slower than Fable, one run took 35 minutes — but the result was one of the best outputs ever seen from this prompt, better than many frontier models.",
        "zh-CN": "用 K3 跑前端：非常慢——比 Fable 还慢，一次生成花了 35 分钟——但结果是这个 prompt 下见过的最佳输出之一，好过许多一线模型。",
        "ja": "K3 でフロントエンドを試した：非常に遅い——Fable より遅く、1 回の生成に 35 分——だが結果はこのプロンプトで見た中で最高クラスの出力で、多くのフロンティアモデルを上回る。",
        "ko": "K3로 프런트엔드를 테스트: 매우 느리다 — Fable보다도 느려서 한 번 생성에 35분 — 하지만 결과물은 이 프롬프트에서 본 것 중 최고 수준으로, 많은 프런티어 모델보다 낫다.",
        "es": "Probó K3 en frontend: MUY lento — incluso más lento que Fable, una ejecución tardó 35 minutos — pero el resultado fue una de las mejores salidas jamás vistas con este prompt, mejor que muchos modelos frontera.",
        "fr": "K3 testé sur du frontend : TRÈS lent — encore plus lent que Fable, une exécution a pris 35 minutes — mais le résultat est l'une des meilleures sorties jamais vues avec ce prompt, meilleure que celle de nombreux modèles frontière."
      },
      "pros": [],
      "cons": [],
      "feed": {
        "displayName": "Lentils",
        "handle": "@Lentils80",
        "initials": "LL",
        "sourceLabel": "X",
        "highlights": {
          "positive": {
            "en": ["one of the best outputs ever seen"],
            "zh-CN": ["最佳输出之一"],
            "ja": ["最高クラスの出力"],
            "ko": ["최고 수준"],
            "es": ["una de las mejores salidas jamás vistas"],
            "fr": ["l'une des meilleures sorties jamais vues"]
          },
          "negative": {
            "en": ["VERY slow", "35 minutes"],
            "zh-CN": ["非常慢", "35 分钟"],
            "ja": ["非常に遅い", "35 分"],
            "ko": ["매우 느리다", "35분"],
            "es": ["MUY lento", "35 minutos"],
            "fr": ["TRÈS lent", "35 minutes"]
          }
        }
      }
    },
    {
      "author": "Peter — \"Kimi K3 | First impressions\"",
      "source": "youtube",
      "url": "https://www.youtube.com/watch?v=LSlV206xPqM",
      "date": "2026-07-17",
      "summary": {
        "en": "Puts the launch-day hype to a hands-on test and finds K3 ahead of some of today's biggest models — including Claude Fable — on his coding tasks.",
        "zh-CN": "把发布日的热度拉到实测台上：在他的编码任务中，K3 领先于当下一些最强模型——包括 Claude Fable。",
        "ja": "発売日の話題を実際に検証。自身のコーディングタスクでは、K3 が Claude Fable を含む現行トップモデルの一部を上回ると評価。",
        "ko": "출시일의 화제를 직접 검증. 자신의 코딩 작업에서 K3가 Claude Fable을 포함한 현존 최강 모델 일부를 앞선다고 평가.",
        "es": "Pone a prueba el bombo del día de lanzamiento y concluye que K3 supera a algunos de los modelos más grandes de hoy — incluido Claude Fable — en sus tareas de código.",
        "fr": "Il confronte le battage du jour du lancement à des tests concrets : sur ses tâches de code, K3 devance certains des plus grands modèles actuels — dont Claude Fable."
      },
      "pros": [],
      "cons": [],
      "feed": {
        "displayName": "Peter",
        "handle": "Kimi K3 · First impressions",
        "initials": "P",
        "sourceLabel": "YouTube",
        "highlights": {
          "positive": {
            "en": ["ahead of some of today's biggest models", "including Claude Fable"],
            "zh-CN": ["K3 领先于当下一些最强模型", "包括 Claude Fable"],
            "ja": ["K3 が Claude Fable を含む現行トップモデルの一部を上回る"],
            "ko": ["K3가 Claude Fable을 포함한 현존 최강 모델 일부를 앞선다"],
            "es": ["K3 supera a algunos de los modelos más grandes de hoy", "incluido Claude Fable"],
            "fr": ["K3 devance certains des plus grands modèles actuels", "dont Claude Fable"]
          },
          "negative": { "en": [] }
        },
        "thumbnail": "/kimi-k3-review-video-editorial.png"
      }
    },
    {
      "author": "AIReiter",
      "source": "blog",
      "url": "https://aireiter.com/blog/kimi-k3",
      "date": "2026-07-17",
      "summary": {
        "en": "Hands-on with the 1M-context agent flagship: frontier-tier reasoning and genuinely long coding sessions on a generous time-based quota — but it only runs at max thinking effort, and open weights aren't downloadable until Jul 27.",
        "zh-CN": "实测这台 1M 上下文的 Agent 旗舰：一线推理水准，配合宽松的按时长计费额度能跑真正的长编码会话——但目前只有 max 思考强度一档，开源权重要到 7 月 27 日才可下载。",
        "ja": "1M コンテキストのエージェント旗艦を実測：フロンティア級の推論力と、寛大な時間ベース枠での長時間コーディングセッション——ただし現状は max 思考強度のみで、オープンウェイトの公開は 7/27 まで待ち。",
        "ko": "1M 컨텍스트 에이전트 플래그십 실사용기: 프런티어급 추론력과 넉넉한 시간 기반 쿼터로 진짜 긴 코딩 세션이 가능 — 다만 현재는 max 추론 강도 한 단계뿐이고, 오픈 웨이트는 7월 27일에야 공개.",
        "es": "Prueba práctica del buque insignia de agentes con contexto de 1M: razonamiento de nivel frontera y sesiones de código realmente largas con una cuota generosa por tiempo — pero solo funciona a esfuerzo máximo de razonamiento, y los pesos abiertos no estarán disponibles hasta el 27 de julio.",
        "fr": "Prise en main du fleuron agentique à contexte 1M : raisonnement de niveau frontière et de très longues sessions de code grâce à un quota généreux basé sur le temps — mais il ne tourne qu'à l'effort de réflexion maximal, et les poids ouverts ne seront téléchargeables que le 27 juillet."
      },
      "pros": [],
      "cons": [],
      "feed": {
        "displayName": "AIReiter",
        "initials": "AR",
        "sourceLabel": "aireiter.com",
        "readMinutes": 6,
        "highlights": {
          "positive": {
            "en": ["frontier-tier reasoning", "genuinely long coding sessions"],
            "zh-CN": ["一线推理水准", "真正的长编码会话"],
            "ja": ["フロンティア級の推論力", "長時間コーディングセッション"],
            "ko": ["프런티어급 추론력", "진짜 긴 코딩 세션"],
            "es": ["razonamiento de nivel frontera", "sesiones de código realmente largas"],
            "fr": ["raisonnement de niveau frontière", "de très longues sessions de code"]
          },
          "negative": {
            "en": ["max thinking effort", "open weights aren't downloadable until Jul 27"],
            "zh-CN": ["max 思考强度一档", "开源权重要到 7 月 27 日才可下载"],
            "ja": ["max 思考強度のみ", "オープンウェイトの公開は 7/27 まで待ち"],
            "ko": ["max 추론 강도 한 단계뿐", "오픈 웨이트는 7월 27일에야 공개"],
            "es": ["esfuerzo máximo de razonamiento", "los pesos abiertos no estarán disponibles hasta el 27 de julio"],
            "fr": ["l'effort de réflexion maximal", "les poids ouverts ne seront téléchargeables que le 27 juillet"]
          }
        }
      }
    }
  ],

  "verdict": {
    "score": "3.8",
    "distribution": { "rave": 1, "mixed": 5, "critical": 0 },
    "headline": {
      "lead": {
        "en": "Admired,",
        "zh-CN": "备受赞赏，",
        "ja": "高評価、",
        "ko": "호평,",
        "es": "Admirado,",
        "fr": "Admiré,"
      },
      "qualifier": {
        "en": "with caveats",
        "zh-CN": "但有保留",
        "ja": "ただし注意点も",
        "ko": "단, 아쉬움도",
        "es": "con reservas",
        "fr": "avec réserves"
      }
    },
    "pros": [
      {
        "en": "Frontier-tier, and open",
        "zh-CN": "一线水准，且开放权重",
        "ja": "フロンティア級、かつオープン",
        "ko": "프런티어급, 그리고 오픈",
        "es": "Nivel frontera y abierto",
        "fr": "Niveau frontière et ouvert"
      },
      {
        "en": "Beats Opus 4.8 on code",
        "zh-CN": "编码表现胜过 Opus 4.8",
        "ja": "コードで Opus 4.8 を上回る",
        "ko": "코딩에서 Opus 4.8 능가",
        "es": "Supera a Opus 4.8 en código",
        "fr": "Dépasse Opus 4.8 en code"
      },
      {
        "en": "Loved for real output",
        "zh-CN": "真实任务输出广受好评",
        "ja": "実タスクの出力が好評",
        "ko": "실전 출력 품질 호평",
        "es": "Muy querido por su salida real",
        "fr": "Apprécié pour ses sorties réelles"
      },
      {
        "en": "1M context, efficient",
        "zh-CN": "1M 上下文，token 高效",
        "ja": "1M コンテキスト、高効率",
        "ko": "1M 컨텍스트, 높은 효율",
        "es": "Contexto de 1M, eficiente",
        "fr": "Contexte 1M, efficace"
      }
    ],
    "cons": [
      {
        "en": "Slow to think",
        "zh-CN": "思考速度偏慢",
        "ja": "思考が遅い",
        "ko": "생각이 느림",
        "es": "Lento al razonar",
        "fr": "Lent à réfléchir"
      },
      {
        "en": "Expensive to run",
        "zh-CN": "运行成本偏高",
        "ja": "実行コストが高い",
        "ko": "실행 비용이 높음",
        "es": "Caro de ejecutar",
        "fr": "Coûteux à utiliser"
      },
      {
        "en": "Trails on some evals",
        "zh-CN": "部分评测仍然落后",
        "ja": "一部評価では後れを取る",
        "ko": "일부 평가에서 뒤처짐",
        "es": "Queda atrás en algunas pruebas",
        "fr": "En retrait sur certains tests"
      },
      {
        "en": "Weights not out yet",
        "zh-CN": "权重尚未开放下载",
        "ja": "ウェイトは未公開",
        "ko": "웨이트 아직 미공개",
        "es": "Los pesos aún no están disponibles",
        "fr": "Poids pas encore disponibles"
      }
    ]
  },

  "consensus": {
    "pros": [
      {
        "en": "Frontier-tier results: #1 on WebDev Arena and top-5 on the Artificial Analysis Intelligence Index — the first open-weights model at this level.",
        "zh-CN": "一线水准：WebDev Arena 第 1、Artificial Analysis Intelligence Index 前 5——首个达到此水准的开源权重模型。",
        "ja": "フロンティア級の成績：WebDev Arena 1 位、Artificial Analysis Intelligence Index トップ 5——この水準に達した初のオープンウェイトモデル。",
        "ko": "프런티어급 성적: WebDev Arena 1위, Artificial Analysis Intelligence Index 톱 5 — 이 수준에 도달한 최초의 오픈 웨이트 모델.",
        "es": "Resultados de nivel frontera: #1 en WebDev Arena y top-5 en el Intelligence Index de Artificial Analysis — el primer modelo de pesos abiertos a este nivel.",
        "fr": "Résultats de niveau frontière : n°1 sur WebDev Arena et top 5 de l'Intelligence Index d'Artificial Analysis — le premier modèle à poids ouverts à ce niveau."
      },
      {
        "en": "Beats Claude Opus 4.8 on most published coding & agentic benchmarks (DeepSWE 67.5 vs 59.0, Terminal-Bench 88.3 vs 84.6).",
        "zh-CN": "在多数已公布的编码与 Agent 跑分上超过 Claude Opus 4.8（DeepSWE 67.5 vs 59.0，Terminal-Bench 88.3 vs 84.6）。",
        "ja": "公開済みのコーディング／エージェント系ベンチマークの大半で Claude Opus 4.8 を上回る（DeepSWE 67.5 vs 59.0、Terminal-Bench 88.3 vs 84.6）。",
        "ko": "공개된 코딩·에이전트 벤치마크 대부분에서 Claude Opus 4.8을 능가 (DeepSWE 67.5 vs 59.0, Terminal-Bench 88.3 vs 84.6).",
        "es": "Supera a Claude Opus 4.8 en la mayoría de los benchmarks publicados de código y agentes (DeepSWE 67.5 vs 59.0, Terminal-Bench 88.3 vs 84.6).",
        "fr": "Il dépasse Claude Opus 4.8 sur la plupart des benchmarks publiés de code et d'agents (DeepSWE 67.5 vs 59.0, Terminal-Bench 88.3 vs 84.6)."
      },
      {
        "en": "Reviewers consistently praise real-world output quality, especially frontend / web code — \"one of the best outputs I've ever seen\".",
        "zh-CN": "评测者一致称赞真实任务的输出质量，尤其是前端 / Web 代码——“我见过的最佳输出之一”。",
        "ja": "レビュアーは実タスクでの出力品質、特にフロントエンド／Web コードを一貫して高評価——「今まで見た中で最高の出力のひとつ」。",
        "ko": "리뷰어들은 실전 출력 품질, 특히 프런트엔드/웹 코드를 일관되게 호평 — “지금까지 본 것 중 최고의 출력물 중 하나”.",
        "es": "Los evaluadores elogian de forma consistente la calidad de salida en tareas reales, sobre todo en código frontend / web — “una de las mejores salidas que he visto”.",
        "fr": "Les testeurs saluent unanimement la qualité des sorties en conditions réelles, surtout le code frontend / web — « l'une des meilleures sorties que j'aie jamais vues »."
      },
      {
        "en": "1M-token context plus strong long-horizon agentic ability (BrowseComp 91.2, best published at release), and 21% more token-efficient than K2.6.",
        "zh-CN": "1M token 上下文 + 强长程 Agent 能力（BrowseComp 91.2，发布时公开最高分），且比 K2.6 省 21% 输出 token。",
        "ja": "1M トークンのコンテキストと強力な長期エージェント能力（BrowseComp 91.2、リリース時点の公開最高値）、さらに K2.6 比 21% のトークン効率向上。",
        "ko": "1M 토큰 컨텍스트와 강력한 장기 에이전트 능력 (BrowseComp 91.2, 출시 시점 공개 최고 기록), K2.6 대비 토큰 효율 21% 개선.",
        "es": "Contexto de 1M de tokens y gran capacidad agéntica de largo plazo (BrowseComp 91.2, el mejor publicado en el lanzamiento), con un 21% más de eficiencia de tokens que K2.6.",
        "fr": "Contexte d'1M de tokens et forte capacité agentique de long terme (BrowseComp 91.2, meilleur score publié au lancement), avec une efficacité en tokens supérieure de 21 % à K2.6."
      }
    ],
    "cons": [
      {
        "en": "Slow: only one (max) reasoning-effort level, so even simple tasks think long — runs of 35 minutes reported.",
        "zh-CN": "慢：推理强度只有 max 一档，简单任务也长时间思考——有单次生成 35 分钟的报告。",
        "ja": "遅い：思考強度が max の一段階しかなく、単純なタスクでも長考する——1 回の生成に 35 分という報告も。",
        "ko": "느리다: 추론 강도가 max 한 단계뿐이라 단순 작업도 오래 생각한다 — 한 번 생성에 35분 걸렸다는 보고도 있다.",
        "es": "Lento: solo hay un nivel (máximo) de esfuerzo de razonamiento, así que hasta las tareas simples piensan mucho — se reportan ejecuciones de 35 minutos.",
        "fr": "Lent : un seul niveau d'effort de raisonnement (max), donc même les tâches simples réfléchissent longtemps — des exécutions de 35 minutes ont été rapportées."
      },
      {
        "en": "Real cost runs high: $3 / $15 is the priciest from a Chinese lab yet, and heavy reasoning-token use inflates bills (≈ $0.25 for one SVG).",
        "zh-CN": "实际成本偏高：$3 / $15 是迄今中国实验室最贵定价，且推理 token 消耗大幅推高账单（一张 SVG 约 $0.25）。",
        "ja": "実コストが高い：$3 / $15 は中国ラボ製として過去最高値で、推論トークンの大量消費が請求額を押し上げる（SVG 一枚で約 $0.25）。",
        "ko": "실사용 비용이 높다: $3 / $15는 중국 랩 최고가이며, 추론 토큰 과소비가 청구액을 키운다 (SVG 한 장에 약 $0.25).",
        "es": "El coste real es alto: $3 / $15 es lo más caro de un laboratorio chino hasta ahora, y el gran consumo de tokens de razonamiento infla la factura (≈ $0.25 por un SVG).",
        "fr": "Le coût réel est élevé : 3 $ / 15 $ est le tarif le plus cher d'un laboratoire chinois à ce jour, et la forte consommation de tokens de raisonnement gonfle la facture (≈ 0,25 $ pour un SVG)."
      },
      {
        "en": "Still trails Claude Fable 5 and GPT-5.6 Sol on several official benchmarks (HLE 43.5 vs 53.3 / 44.5; DeepSWE below both).",
        "zh-CN": "在多项官方跑分上仍落后 Claude Fable 5 与 GPT-5.6 Sol（HLE 43.5 vs 53.3 / 44.5；DeepSWE 低于两者）。",
        "ja": "複数の公式ベンチマークではなお Claude Fable 5 と GPT-5.6 Sol に及ばない（HLE 43.5 vs 53.3 / 44.5、DeepSWE も両者以下）。",
        "ko": "여러 공식 벤치마크에서는 여전히 Claude Fable 5와 GPT-5.6 Sol에 뒤진다 (HLE 43.5 vs 53.3 / 44.5, DeepSWE도 둘 다에 밀림).",
        "es": "Aún queda por detrás de Claude Fable 5 y GPT-5.6 Sol en varios benchmarks oficiales (HLE 43.5 vs 53.3 / 44.5; DeepSWE por debajo de ambos).",
        "fr": "Il reste derrière Claude Fable 5 et GPT-5.6 Sol sur plusieurs benchmarks officiels (HLE 43,5 vs 53,3 / 44,5 ; DeepSWE en dessous des deux)."
      },
      {
        "en": "Open weights promised but not downloadable at launch (due Jul 27); ~85-token hidden system prompt; some scores await independent verification.",
        "zh-CN": "开源权重承诺了但发布时不可下载（7 月 27 日放出）；有约 85 token 的隐藏系统提示；部分分数尚待独立验证。",
        "ja": "オープンウェイトは約束されたがローンチ時点では未公開（7/27 予定）。約 85 トークンの隠しシステムプロンプトがあり、一部スコアは独立検証待ち。",
        "ko": "오픈 웨이트는 약속됐지만 출시 시점엔 다운로드 불가 (7월 27일 예정). 약 85토큰의 숨은 시스템 프롬프트가 있으며, 일부 점수는 독립 검증 대기 중.",
        "es": "Los pesos abiertos están prometidos pero no descargables en el lanzamiento (previstos para el 27 de julio); hay un prompt de sistema oculto de ~85 tokens; algunas puntuaciones esperan verificación independiente.",
        "fr": "Les poids ouverts sont promis mais pas téléchargeables au lancement (prévus le 27 juillet) ; un prompt système caché d'environ 85 tokens ; certains scores attendent une vérification indépendante."
      }
    ]
  },

  "sources": [
    { "name": "Artificial Analysis — Kimi K3", "url": "https://artificialanalysis.ai/models/kimi-k3" },
    { "name": "Arena.ai — WebDev Leaderboard", "url": "https://arena.ai/leaderboard/code/webdev" },
    { "name": "Moonshot AI — Kimi K3 Tech Blog", "url": "https://www.kimi.com/blog/kimi-k3" },
    { "name": "kingy.ai — K3 Benchmarks vs Frontier", "url": "https://kingy.ai/blog/kimi-k3-benchmarks-specs-price-fable-5-gpt-5-6-sol/" },
    { "name": "Simon Willison — Kimi K3", "url": "https://simonwillison.net/2026/Jul/16/kimi-k3/" },
    { "name": "AIReiter — Kimi K3 Hands-On", "url": "https://aireiter.com/blog/kimi-k3" }
  ]
} satisfies ModelEvaluation;

export default evaluation;
