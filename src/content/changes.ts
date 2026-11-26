/**
 * [INPUT]: 依赖 ChangeEntry 契约
 * [OUTPUT]: 对外提供首页与 /changes 使用的变更记录
 * [POS]: src/content 的编辑日志，不替代榜单上的分数
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ChangeEntry, LText } from "@/lib/contracts";

const tx = (zh: string, en: string): LText => ({ zh, en });

export const changes: ChangeEntry[] = [
  {
    date: "11-26",
    kind: "board",
    source: "theslopindex.com / convex.dev",
    text: tx(
      "**Slop、Convex 124 题与 WebDev**：Slop 70 行重算，捕获时间 Thu, 26 Nov 2026 01:01:51 GMT，2,782 票。机械文件仍是 full-merged-v6。反转仍是 100 − 页面整数。这次第 1 是 DeepSeek V4.1 Flash，来源 25.70。没有模型页的 Muse Ember 是第 2，来源 26.80。差 1.10。Convex 先核对哈希，仍是 124 题、2026-11-18 16:28:13 SGT。有指南 27 行，无指南 28 行。有指南 Fable 精确值 0.9959677419354839（显示 99.6），单独第 1。Argon 与没有模型页的 Neon 精确值相同，并列第 2，来源 Argon 在前。无指南 Neon 与 GPT-6.1 Sol 精确值相同，并列第 3，来源 Neon 在前。112 题归档未改。WebDev 公开页仍是 Cloudflare 403，159 行快照未改。",
      "**Slop, Convex 124 tasks, and WebDev**: the Slop Index recomputed all 70 rows, captured Thu, 26 Nov 2026 01:01:51 GMT, at 2,782 votes. The mechanical file is still full-merged-v6. Inversion is still 100 − the page integer. DeepSeek V4.1 Flash is #1 this capture at source 25.70. Muse Ember, which has no model page, is #2 at source 26.80. The gap is 1.10. Convex was checked against the hash first. It is still 124 tasks, minted 2026-11-18 16:28:13 SGT. With Guidelines has 27 rows and No Guidelines has 28. With Guidelines, Fable is exactly 0.9959677419354839 (display 99.6) and is alone at #1. Argon and Neon, which has no model page, share the exact score and #2, with Argon first. Without guidelines, Neon and GPT-6.1 Sol share the exact score and #3, with Neon first. The 112-task archive was not changed. The WebDev page is still Cloudflare 403, so the 159-row snapshot was not changed.",
    ),
  },
  {
    date: "11-25",
    kind: "board",
    source: "theslopindex.com / arena.ai",
    text: tx(
      "**Slop 与 WebDev**：Slop 70 行重算，捕获时间 Wed, 25 Nov 2026 01:02:16 GMT，2,766 票。机械文件仍是 full-merged-v6。反转仍是 100 − 页面整数。第 1 仍是没有模型页的 Muse Ember，来源 25.29。DeepSeek V4.1 Flash 仍是第 2，来源 26.58。Grok 4.6 落到第 11，来源 33.24，已不在前 10。11 月 24 日 Particle 1 的入库是页面 35、本站 65；说明里的 64 是笔误。这次是页面 34、本站 66。WebDev 公开页返回 Cloudflare 403，没有改 11 月 13 日的 159 行，也没有改 Hydrogen 的 High 标签。",
      "**Slop and WebDev**: the Slop Index recomputed all 70 rows, captured Wed, 25 Nov 2026 01:02:16 GMT, at 2,766 votes. The mechanical file is still full-merged-v6. Inversion is still 100 − the page integer. #1 is still Muse Ember, which has no model page, at source 25.29. DeepSeek V4.1 Flash is still #2 at source 26.58. Grok 4.6 fell to #11 at source 33.24, outside the top 10. The Nov 24 Particle 1 row stored page 35 and site 65; the written 64 was a report typo. This capture is page 34 and site 66. The WebDev page returned Cloudflare 403, so the Nov 13 159-row snapshot and the Hydrogen High label were not changed.",
    ),
  },
  {
    date: "11-24",
    kind: "board",
    source: "surgehq.ai / theslopindex.com",
    text: tx(
      "**sudo L7 与 Slop**：sudo 主榜仍是 25 行。Fable 5.2 仍是 52.2%。Qwen 4 Max 从 15.6% 变为 22.8%，按分数是第 12，不再和 Hy4 并列。Hy4 仍是 15.6%，单独第 18。Qwen 4 Max 没有模型页。Slop 70 行重算，捕获时间 Tue, 24 Nov 2026 01:05:52 GMT，2,746 票。机械文件仍是 full-merged-v6。反转规则没改。前两名只差 0.39：没有模型页的 Muse Ember 来源 25.29，DeepSeek V4.1 Flash 来源 25.68。GPT-6 Sol Pro 落到第 11（33.26）。Particle 1 第 15，没有模型页。Nex N2.6 第 23。",
      "**sudo L7 and Slop**: the sudo main board is still 25 rows. Fable 5.2 is still 52.2%. Qwen 4 Max moved from 15.6% to 22.8% and is #12 by score, no longer tied with Hy4. Hy4 is still 15.6% and is alone at #18. Qwen 4 Max has no model page. The Slop Index recomputed all 70 rows, captured Tue, 24 Nov 2026 01:05:52 GMT, at 2,746 votes. The mechanical file is still full-merged-v6. The inversion rule did not change. The top two differ by 0.39: Muse Ember, which has no model page, is source 25.29, and DeepSeek V4.1 Flash is source 25.68. GPT-6 Sol Pro fell to #11 (33.26). Particle 1 is #15 and has no model page. Nex N2.6 is #23.",
    ),
  },
  {
    date: "11-23",
    kind: "board",
    source: "lmarena.ai / theslopindex.com / convex.dev",
    text: tx(
      "**WebDev、图生网页、Slop 与 Convex 124 题**：WebDev 页日期 Nov 22，1,044,803 票，可读抓取仍只有前 15，159 行全量榜未改。图生网页页日期 Nov 20，218,511 票、页头 70 个模型，可读抓取也只有前 15，66 行全量榜未改。Slop 70 行重算，捕获时间 Mon, 23 Nov 2026 01:07:34 GMT，2,715 票。机械文件仍是 full-merged-v6。反转后 DeepSeek V4.1 Flash 第 1（来源 24.72），Muse Ember 第 2（25.59，没有模型页）。Convex 仍是同一 124 题哈希。有指南 26 行，无指南 27 行。Fable 5.2 与 Argon 有指南精确值都是 0.9919354838709677，并列。112 题归档未改，缺行不是 0 分，也不和 112 题相减。",
      "**WebDev, Image-to-WebDev, Slop, and Convex 124 tasks**: the WebDev page date is Nov 22, with 1,044,803 votes. The readable fetch is still only the top 15, so the 159-row snapshot was not replaced. Image-to-WebDev is dated Nov 20, with 218,511 votes and a 70-model header. That readable fetch is also only the top 15, so the 66-row snapshot was not replaced. The Slop Index recomputed all 70 rows, captured Mon, 23 Nov 2026 01:07:34 GMT, at 2,715 votes. The mechanical file is still full-merged-v6. After inversion DeepSeek V4.1 Flash is #1 (source 24.72) and Muse Ember is #2 (25.59, no model page). Convex is still the same 124-task hash. With Guidelines has 26 rows and No Guidelines has 27. Fable 5.2 and Argon share the exact with-guidelines score 0.9919354838709677. The 112-task archive was not changed. A missing row is not a zero and is not subtracted from the 112-task scores.",
    ),
  },
  {
    date: "11-20",
    kind: "board",
    source: "surgehq.ai / theslopindex.com / convex.dev",
    text: tx(
      "**sudo L7、Slop 与 Convex 124 题**：sudo 主榜 25 行，Fable 5.2 仍是 52.2%。Astra 6.2 与 Neon 都是 38.3%，并列第 4，来源 Astra 在前。Qwen 4 Max 与 Hy4 Preview 都是 15.6%，并列第 17，没有模型页。Muse Spark 1.3 落到第 21（12.8%）。Slop 70 行重算，捕获时间 Fri, 20 Nov 2026 01:04:00 GMT，2,621 票。机械文件仍是 full-merged-v6。反转后 GPT-6 Sol Pro 第 1（来源 26.49，没有模型页），GPT-5.6 Sol 第 2（27.43）。Convex 124 题两列各 10 行。有指南 Fable 5.2 精确值 0.9919354838709677（显示 99.19），无指南 0.9596774193548387（显示 95.97）。112 题归档未改，缺行不是 0 分。",
      "**sudo L7, Slop, and Convex 124 tasks**: the sudo main board has 25 rows. Fable 5.2 is still 52.2%. Astra 6.2 and Neon both score 38.3% and share #4, with Astra first in the source. Qwen 4 Max and Hy4 Preview both score 15.6% and share #17. Qwen 4 Max has no model page. Muse Spark 1.3 falls to #21 (12.8%). The Slop Index recomputed all 70 rows, captured Fri, 20 Nov 2026 01:04:00 GMT, at 2,621 votes. The mechanical file is still full-merged-v6. After inversion GPT-6 Sol Pro is #1 (source 26.49, no model page) and GPT-5.6 Sol is #2 (27.43). Each Convex 124-task column has 10 rows. With guidelines Fable 5.2 is exactly 0.9919354838709677 (display 99.19); without guidelines it is 0.9596774193548387 (display 95.97). The 112-task archive was not changed, and a missing row is not a zero.",
    ),
  },
  {
    date: "11-19",
    kind: "board",
    source: "convex.dev",
    text: tx(
      "**Android、sudo L7 与 Convex 124 题**：Android 2.0 长程 18 行，Fable 5.2 与 Sonnet 5.5 都是 40.0，并列第 1，来源 Fable 在前。1.0 未改。sudo L7 主榜 24 行，Fable 5.2 仍是 52.2%；Neon 与 GPT 6.2 Astra 都是 38.3%，并列第 4。Convex 当前版本是 124 题（哈希 32c305f6…，2026-11-18 16:28 SGT）。有指南 GPT-6.1 Sol 0.9758064516129032、Step 5 Preview 0.7580645161290323；无指南分别是 0.9112903225806451 和 0.5645161290322581。112 题旧榜按原日期保留，不和 124 题相减。WebDev 这次没有拿到完整表，全量榜未改。Slop 未改。",
      "**Android, sudo L7, and Convex 124 tasks**: Android 2.0 long-horizon has 18 rows. Fable 5.2 and Sonnet 5.5 both score 40.0 and share first, with Fable listed first. Version 1.0 was not changed. The sudo L7 main board has 24 rows. Fable 5.2 is still 52.2%. Neon and GPT 6.2 Astra both score 38.3% and share #4. The current Convex version is 124 tasks (hash 32c305f6…, minted 2026-11-18 16:28 SGT). With guidelines, GPT-6.1 Sol is 0.9758064516129032 and Step 5 Preview is 0.7580645161290323. Without guidelines they are 0.9112903225806451 and 0.5645161290322581. The 112-task archive keeps its original dates and is not subtracted from the 124-task scores. The readable WebDev fetch did not include the full table, so that board was left unchanged. Slop was not changed.",
    ),
  },
  {
    date: "11-18",
    kind: "board",
    source: "theslopindex.com",
    text: tx(
      "**Slop Index 与 Convex 有指南**：Slop 70 行重算，捕获时间 Wed, 18 Nov 2026 01:02:49 GMT，2,589 票。机械文件仍是 full-merged-v6（70 个模型、77,943 条生成）。70 行都有人群 Elo，不再有中性 50。反转后 GPT-5.6 Sol 第 1（来源 27.43），DeepSeek V4.1 Flash 第 2（27.49），Haiku 5.5 第 3（28.26）。Convex 有指南 47 行：Fable 5.2 精确值仍是 0.9880952380952381（显示 98.81，3 次），Argon 仍是 0.9866071428571429（显示 98.66，10 次），分差约 0.0015，不是有意义的胜出。Carbon 重跑为 0.9508928571428572（显示 95.09，2 次），与 Grok 4.5 并列第 10。GPT-6.2 Sol 没有模型页，与 Hy4 flash 精确值相同，并列第 18。无指南列仍是 11-12 的快照，并排不是同日对比。",
      "**Slop Index and Convex With Guidelines**: the Slop Index recomputed all 70 rows, captured Wed, 18 Nov 2026 01:02:49 GMT, at 2,589 votes. The mechanical file is still full-merged-v6 (70 models, 77,943 generations). All 70 rows now have crowd Elo, so none use a neutral 50. After inversion GPT-5.6 Sol is #1 (source 27.43), DeepSeek V4.1 Flash is #2 (27.49), and Haiku 5.5 is #3 (28.26). Convex With Guidelines has 47 rows. Fable 5.2 is still exactly 0.9880952380952381 (display 98.81, 3 runs), and Argon is still 0.9866071428571429 (display 98.66, 10 runs). The gap is about 0.0015, not a meaningful win. Carbon reran to 0.9508928571428572 (display 95.09, 2 runs) and ties Grok 4.5 at #10. GPT-6.2 Sol has no model page and shares its exact score with Hy4 flash, so they tie at #18. The No Guidelines column is still the Nov 12 snapshot, so the side-by-side is not a same-day comparison.",
    ),
  },
  {
    date: "11-17",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**WebDev、图生网页、Convex 有指南与 Slop Index**：WebDev 页面日期 11-13，1,007,405 票。159 个模型 = 158 行正式名次 + 1 行 AutoEval。Fable 5.2 xHigh 正式第 1（1826，1,445 票）。Qwen4-Max xHigh 是新的正式初步行第 6（1750），不是 AutoEval，也没有模型页。Ernie 5.5 Flash Preview 1668 仍不进综合分。图生网页 213,813 票、66 行，Opus 5.5 Max 第 1（1756），Qwen4-Max 第 6（1674，初步）。Convex 有指南 46 行：Fable 5.2 精确值 0.9880952380952381（显示 98.81，3 次），Argon 仍是 0.9866071428571429（显示 98.66，10 次）。分差约 0.0015，不是有意义的胜出。无指南列仍是 11-12 的快照，并排不是同日对比。Slop Index 70 行，捕获时间 Tue, 17 Nov 2026 01:02:19 GMT，2,507 票，机械文件是 full-merged-v6。反转后 GPT-5.6 Sol 第 1（来源 27.43）。",
      "**WebDev, Image-to-WebDev, Convex With Guidelines, and the Slop Index**: the WebDev page date is Nov 13, with 1,007,405 votes. 159 models = 158 official ranks plus 1 AutoEval row. Fable 5.2 xHigh is official #1 (1826, 1,445 votes). Qwen4-Max xHigh is a new official preliminary row at #6 (1750). It is not AutoEval and has no model page. Ernie 5.5 Flash Preview at 1668 stays out of the composite. Image-to-WebDev has 213,813 votes and 66 rows. Opus 5.5 Max is #1 (1756), and Qwen4-Max is #6 (1674, preliminary). Convex With Guidelines has 46 rows: Fable 5.2 is exactly 0.9880952380952381 (display 98.81, 3 runs), and Argon is still 0.9866071428571429 (display 98.66, 10 runs). The gap is about 0.0015, not a meaningful win. The No Guidelines column is still the Nov 12 snapshot, so the side-by-side is not a same-day comparison. The Slop Index has 70 rows, captured Tue, 17 Nov 2026 01:02:19 GMT, at 2,507 votes, from mechanical run full-merged-v6. After inversion GPT-5.6 Sol is #1 (source 27.43).",
    ),
  },
  {
    date: "11-16",
    kind: "board",
    source: "convex.dev",
    text: tx(
      "**Convex 有指南与 Slop Index**：有指南列 44 行。Gemini 4 Argon 与 Claude Fable 5.2 都显示 98.66。精确值是 0.9866071428571429 和 0.9866071428571428，页面按返回顺序把 Argon 放在前面。这是展示并列，不是明确胜出。无指南列没有重写，Fable 5.2 仍是 95.54%。Slop Index 58 行按现场投票重算（2,494 票）。反转后 GPT-5.6 Sol 仍是第 1（来源 25.88），Haiku 5.5 第 2（27.73），GLM-5.3 第 11（34.92）。",
      "**Convex With Guidelines and the Slop Index**: With Guidelines has 44 rows. Gemini 4 Argon and Claude Fable 5.2 both display 98.66. The exact values are 0.9866071428571429 and 0.9866071428571428, and the page lists Argon first because that is the response order. That is a displayed tie, not a clear win. The No Guidelines column was not rewritten; Fable 5.2 is still 95.54% there. The Slop Index recomputed all 58 rows from the live vote (2,494 votes). After inversion GPT-5.6 Sol is still #1 (source 25.88), Haiku 5.5 is #2 (27.73), and GLM-5.3 is #11 (34.92).",
    ),
  },
  {
    date: "11-13",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**WebDev、sudo L7 与 Slop Index**：WebDev 页面日期 11-11，997,838 票。159 个模型 = 158 行正式名次 + 1 行 AutoEval。Fable 5.2 xHigh 仍是正式第 1（1838，1,215 票）。新增 Gemini 4 Hydrogen High 第 10（1704，初步）。Ernie 5.5 Flash Preview 1668 仍是 AutoEval，不进综合分。sudo L7 19 行，Fable 5.2 Adaptive/Max 52.2% 第 1，Sonnet 5.5 50.6% 第 2；MiniMax M3.1 Flash 第 7（18.9%）。Slop Index 58 行按现场投票重算，反转后 GPT-5.6 Sol 第 1（来源 slop 25.9），GLM-5.3 第 2（29.0），Sonnet 5.5 第 5（31.3）。",
      "**WebDev, sudo L7, and the Slop Index**: the WebDev page date is Nov 11, with 997,838 votes. 159 models = 158 official ranks plus 1 AutoEval row. Fable 5.2 xHigh is still official #1 (1838, 1,215 votes). Gemini 4 Hydrogen High is new at #10 (1704, preliminary). Ernie 5.5 Flash Preview at 1668 is still AutoEval and stays out of the composite. sudo L7 has 19 rows. Fable 5.2 Adaptive/Max leads at 52.2%, and Sonnet 5.5 is 2nd at 50.6%. MiniMax M3.1 Flash is #7 (18.9%). The Slop Index recomputed all 58 rows from the live vote. After inversion GPT-5.6 Sol is #1 (source slop 25.9), GLM-5.3 is #2 (29.0), and Sonnet 5.5 is #5 (31.3).",
    ),
  },
  {
    date: "11-12",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**WebDev、Android 长程与 Convex**：WebDev 页面日期仍是 11-10，票数 995,980。158 个模型 = 157 行正式名次 + 1 行 AutoEval。Fable 5.2 xHigh 从 AutoEval 转为正式第 1（1836，994 票），旧行已删除。Opus 5.5 Max 第 2（1814）。当前 AutoEval 是 Ernie 5.5 Flash Preview（1668，无名次、无票数），不进综合分。Android Bench 2.0 长程页面日期 11-11，17 行；Carbon High 第 7（23.3），Haiku 5.5 Max 第 10（20.7），Muse Wonder Max 第 12（13.3）。Sonnet 5.5 Max 仍是 40.0。Convex 两列各 44 行，Fable 5.2 仍是 99.11% 与 95.54%；Carbon 有指南第 10（95.54%）、无指南第 6（86.61%）。",
      "**WebDev, Android long-horizon, and Convex**: the WebDev page date is still Nov 10, with 995,980 votes. 158 models = 157 official ranks plus 1 AutoEval row. Fable 5.2 xHigh moved from AutoEval to official #1 (1836, 994 votes), and the old row was removed. Opus 5.5 Max is #2 (1814). The current AutoEval row is Ernie 5.5 Flash Preview (1668, no rank, no votes) and stays out of the composite. Android Bench 2.0 long-horizon is dated Nov 11 and has 17 rows: Carbon High #7 (23.3), Haiku 5.5 Max #10 (20.7), Muse Wonder Max #12 (13.3). Sonnet 5.5 Max is still 40.0. Each Convex column has 44 rows. Fable 5.2 is still 99.11% and 95.54%. Carbon is #10 with guidelines (95.54%) and #6 without (86.61%).",
    ),
  },
  {
    date: "11-11",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**WebDev 与 Image-to-WebDev**：两张榜页面日期都是 11-10。WebDev 994,531 票、157 个模型 = 156 行正式名次 + 1 行 AutoEval。正式第 1 是 Opus 5.5 Max 1813；Sol Max 与 Fable 5.1 Max 都是 1743，名次仍是第 5 和第 6。Fable 5.2 xHigh 1832 仍是 AutoEval，没有名次和票数，不进综合分。Image-to-WebDev 66 行、210,832 票，Opus Max 1752 第 1；DeepSeek-V4.1-Flash-20261017 Max 新进第 13（1609）。",
      "**WebDev and Image-to-WebDev**: both page dates are Nov 10. WebDev has 994,531 votes and 157 models = 156 official ranks plus 1 AutoEval row. Official #1 is Opus 5.5 Max at 1813. Sol Max and Fable 5.1 Max both score 1743 and stay 5th and 6th. Fable 5.2 xHigh at 1832 is still AutoEval, with no rank and no votes, and it stays out of the composite. Image-to-WebDev has 66 rows and 210,832 votes; Opus Max leads at 1752. DeepSeek-V4.1-Flash-20261017 Max is new at #13 (1609).",
    ),
  },
  {
    date: "11-10",
    kind: "board",
    source: "lmarena.ai / convex.dev",
    text: tx(
      "**WebDev 与 Convex**：WebDev 页面日期仍是 11-08（984,664 票）。156 个模型里 155 行有正式名次，Opus 5.5 Max 仍第 1（1818）。Claude Fable 5.2 xHigh 1832 是 AutoEval，没有名次和票数，不进综合分。Convex 无指南 43 行，Fable 5.2 95.54% 第 1，Astra 89.73% 第 2；有指南 42 行，Fable 5.2 99.11% 第 1，Argon 98.75% 第 2。两列分开，仍只在框架页。",
      "**WebDev and Convex**: the WebDev page date is still Nov 8 (984,664 votes). Of 156 models, 155 have official ranks; Opus 5.5 Max is still #1 (1818). Claude Fable 5.2 xHigh at 1832 is AutoEval, with no rank and no votes, and it stays out of the composite. Convex No Guidelines has 43 rows, Fable 5.2 at 95.54% then Astra at 89.73%. With Guidelines has 42 rows, Fable 5.2 at 99.11% then Argon at 98.75%. The columns stay separate and framework-only.",
    ),
  },
  {
    date: "11-09",
    kind: "board",
    source: "lmarena.ai / developer.android.com",
    text: tx(
      "**三榜同步**：LMArena WebDev 至 11-08（985,908 票、154 行），Opus 5.5 Max 第 1（1818），Sonnet 5.5 xHigh 升至第 2（1773），Carbon High 第 3（1768，初步）。Image-to-WebDev 仍 65 行（208,770 票），Fable 5.1 升至第 3（1724），帕累托页改为 6 个模型并改印单任务成本。Android Bench 2.0 长程 14 行（页面日期 11-04）：新增 GPT 6.1 Terra max 第 4（28.7）、Kimi K3.1 Pro max 第 6（24.0）、Deepseek V4.1 Flash 1017 high 第 9（17.3）。Next.js 未改。",
      "**Three-board sync**: LMArena WebDev to Nov 8 (985,908 votes, 154 rows); Opus 5.5 Max #1 (1818); Sonnet 5.5 xHigh rises to #2 (1773); Carbon High #3 (1768, preliminary). Image-to-WebDev stays 65 rows (208,770 votes); Fable 5.1 rises to #3 (1724); the Pareto page now lists six models and prints cost per task. Android Bench 2.0 long-horizon is 14 rows (page date Nov 4): new GPT 6.1 Terra max #4 (28.7), Kimi K3.1 Pro max #6 (24.0), Deepseek V4.1 Flash 1017 high #9 (17.3). Next.js was not changed.",
    ),
  },
  {
    date: "10-29",
    kind: "board",
    source: "lmarena.ai / eqbench.com",
    text: tx(
      "**两榜同步**：LMArena WebDev 至 10-27（952,039 票、153 行），Opus Max 仍第 1（1810）；新增 **Gemini 4 Carbon（high）** 第 4（1768，初步）。EQ Creative Writing 146 行，Astra 仍第 1（Elo 2176.9）；**Kimi K3.1 Pro** 新进第 2（2172.6）。",
      "**Two-board sync**: LMArena WebDev to Oct 27 (952,039 votes, 153 rows); Opus Max still #1 (1810); new **Gemini 4 Carbon (high)** at #4 (1768, preliminary). EQ Creative Writing 146 rows; Astra still #1 (Elo 2176.9); **Kimi K3.1 Pro** enters at #2 (2172.6).",
    ),
  },
  {
    date: "10-28",
    kind: "board",
    source: "surgehq.ai / lmarena.ai / theslopindex.com / developer.android.com / cognition.com / convex.dev",
    text: tx(
      "**六榜同步**：sudo L7 16 行，Sonnet 5.5 `50.6%` 居首；Kimi K3.1 Pro 与 Qwen 并列第 6。WebDev 至 10-27（950,329 票、152 行），Opus Max 仍第 1；新增 **GPT-6.1 Terra** 第 14。Slop 反转后 **Inkling Small** 第 1（76），Haiku 约第 4（旧「Haiku #1」过时）。Android Bench 2.0 11 行，Sonnet max `40.0%` 居首。FrontierCode 升级 **2.0**（102 行／26 模型；完整 JSON 含 Obsidian 3）。Convex No/With Guidelines 刷新，有指南 Argon ~98.7%。",
      "**Six-board sync**: sudo L7 16 rows, Sonnet 5.5 leads at `50.6%`; Kimi K3.1 Pro ties Qwen at #6. WebDev to Oct 27 (950,329 votes, 152 rows); Opus Max still #1; new **GPT-6.1 Terra** at #14. After Slop inversion **Inkling Small** leads (76); Haiku about #4 (old “Haiku #1” stale). Android Bench 2.0 11 rows, Sonnet max `40.0%` leads. FrontierCode upgraded to **2.0** (102 rows / 26 models; complete JSON includes Obsidian 3). Convex No/With Guidelines refreshed; With Guidelines Argon ~98.7%.",
    ),
  },
  {
    date: "10-26",
    kind: "board",
    source: "lmarena.ai / theslopindex.com / eqbench.com / convex.dev",
    text: tx(
      "**四榜同步**：LMArena WebDev 至 2026-10-22（923,854 票、151 行），新增 Moonshot **Kimi K3.1 Pro（max）** 第 8（`1692`，初步）。Slop Index 扩至 58 行（2,091 票），反转后 **Haiku 5.5** 第 1（100−17=83）。EQ Creative Writing 145 行，Meta **muse-wonder** 第 9（Elo `2007.0`）。Convex With Guidelines 刷新，Claude Opus 5 第 9（`94.64%`）。",
      "**Four-board sync**: LMArena WebDev to 2026-10-22 (923,854 votes, 151 rows); new Moonshot **Kimi K3.1 Pro (max)** at #8 (`1692`, preliminary). Slop Index expands to 58 rows (2,091 votes); after inversion **Haiku 5.5** leads (100−17=83). EQ Creative Writing 145 rows; Meta **muse-wonder** at #9 (Elo `2007.0`). Convex With Guidelines refreshed; Claude Opus 5 at #9 (`94.64%`).",
    ),
  },
  {
    date: "10-20",
    kind: "board",
    source: "lmarena.ai / convex.dev",
    text: tx(
      "**四榜同步**：LMArena WebDev 至 2026-10-19（903,893 票、149 行），Opus 5.5（max）`1807` 居首，新增 Muse Wonder Full（max）第 6（`1726`）。Image-to-WebDev 至 2026-10-19（191,568 票、65 行），Opus 5.5（max）`1753` 居首，DeepSeek-V4.1-Flash-20260910（max）第 13（`1606`）。Convex No / With Guidelines 各 38 个模型，新增 GPT-5.5 第 14（`77.68%`）／第 17（`89.29%`）。",
      "**Four-board sync**: LMArena WebDev to 2026-10-19 (903,893 votes, 149 rows); Opus 5.5 (max) leads at `1807`; new Muse Wonder Full (max) at #6 (`1726`). Image-to-WebDev to 2026-10-19 (191,568 votes, 65 rows); Opus 5.5 (max) leads at `1753`; DeepSeek-V4.1-Flash-20260910 (max) at #13 (`1606`). Convex No / With Guidelines have 38 models each; new GPT-5.5 at #14 (`77.68%`) / #17 (`89.29%`).",
    ),
  },
  {
    date: "10-19",
    kind: "board",
    source: "lmarena.ai / reactbench.com / convex.dev",
    text: tx(
      "**三榜同步**：LMArena WebDev 至 2026-10-19（900,155 票、146 行），Opus 5.5（max）`1806` 居首，新增 DeepSeek-V4.1-Flash-20261017（max）第 12（`1670`）。ReactBench v1.2 重同步（85 配置），Opus 5.5（max）`54.4%` 第 1。Convex 补上 With Guidelines，并刷新 No Guidelines / Web。",
      "**Three-board sync**: LMArena WebDev to 2026-10-19 (900,155 votes, 146 rows); Opus 5.5 (max) leads at `1806`; new DeepSeek-V4.1-Flash-20261017 (max) at #12 (`1670`). ReactBench v1.2 resynced (85 configs) with Opus 5.5 (max) `54.4%` at #1. Convex adds With Guidelines and refreshes No Guidelines / Web.",
    ),
  },
  {
    date: "10-18",
    kind: "pick",
    source: "reactbits.dev",
    text: tx(
      "**React Bits**：按官网重写动效分类一句话说明（免费开源动画 React 组件，可复制源码），并补全仓库与 shadcn 安装示例。",
      "**React Bits**: refreshed the Motion one-liner from the site (free open-source animated React components, copyable source), plus repo and a shadcn install example.",
    ),
  },
  {
    date: "10-14",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**LMArena WebDev**：同步至 2026-10-13 榜（878,407 票、143 行）。Claude Opus 5.5（max）`1811` 仍居首；新增 Meta **muse-wonder-max** 第 15（`1651`）。",
      "**LMArena WebDev**: synced to the 2026-10-13 board (878,407 votes, 143 rows). Claude Opus 5.5 (max) still leads at `1811`; new Meta **muse-wonder-max** at #15 (`1651`).",
    ),
  },
  {
    date: "10-13",
    kind: "board",
    source: "cognition.com/frontiercode",
    text: tx(
      "**FrontierCode 1.1**：Main 集 130 行（全部推理档）。Claude Opus 5.5 `54.6%`。通用榜，挂入 Web 前端 / Android / CLI，权重 0.6。",
      "**FrontierCode 1.1**: 130 Main rows (all reasoning levels). Claude Opus 5.5 `54.6%`. General board on Web frontend / Android / CLI at weight 0.6.",
    ),
  },
  {
    date: "10-12",
    kind: "board",
    source: "eqbench.com",
    text: tx(
      "**写文档和文案**：挂入 EQ-Bench Creative Writing v3，140 行 Elo；权重 0.6（Slop Index 仍 1.0）。综合分榜首 GPT-6 Astra。",
      "**Write docs & copy**: adds EQ-Bench Creative Writing v3, 140 Elo rows; weight 0.6 (Slop Index stays 1.0). Composite lead is GPT-6 Astra.",
    ),
  },
  {
    date: "10-12",
    kind: "pick",
    source: "bestfreefonts.com",
    text: tx(
      "**Best Free Fonts**：字体分类新增精选免费字体目录；强调真正免费，收录常见 SIL Open Font License。",
      "**Best Free Fonts**: added to Type—a curated free-font directory focused on truly free faces, commonly SIL Open Font License.",
    ),
  },
  {
    date: "10-11",
    kind: "board",
    source: "deepswe.datacurve.ai",
    text: tx(
      "**DeepSWE v1.1**：28 行 Best 配置。GPT 6 Astra `74.1%`，Gemini 3.8 Flash `73.8%`，Claude Opus 5 `73.6%`。通用榜，挂入 Web 前端 / Android / CLI。",
      "**DeepSWE v1.1**: 28 Best-config rows. GPT 6 Astra `74.1%`, Gemini 3.8 Flash `73.8%`, Claude Opus 5 `73.6%`. General board on Web frontend / Android / CLI.",
    ),
  },
  {
    date: "10-11",
    kind: "board",
    source: "theslopindex.com",
    text: tx(
      "**写文档和文案**：新增场景，挂 The Slop Index 39 行。来源最渣为 #1；本站反转后 GPT-5.6 Luna 居首（100 − Slop = `74`）。",
      "**Write docs & copy**: new scenario on The Slop Index, 39 rows. Source ranks sloppiest first; after inversion GPT-5.6 Luna leads (100 − Slop = `74`).",
    ),
  },
  {
    date: "10-09",
    kind: "board",
    source: "arena.ai",
    text: tx(
      "**LMArena Image-to-WebDev**：64 个模型，Claude Opus 5.5（max）`1749`。图生网页，不是文字需求的 WebDev。",
      "**LMArena Image-to-WebDev**: 64 models. Claude Opus 5.5 (max) scores `1749`. This is image-to-page, not the text-prompt WebDev board.",
    ),
  },
  {
    date: "10-09",
    kind: "board",
    source: "surgehq.ai",
    text: tx(
      "**sudo L7**：Claude Opus 5.5 与 Claude Sonnet 5.5 均为 `45%`，页面先列 Opus。GPT 6 Astra `32.2%`。",
      "**sudo L7**: Claude Opus 5.5 and Claude Sonnet 5.5 both score `45%`, with Opus listed first. GPT 6 Astra scores `32.2%`.",
    ),
  },
  {
    date: "10-08",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**LMArena WebDev**：Claude Opus 5.5（max）以 `1813` 分居首，领先 GPT-6 Astra `27` 分。",
      "**LMArena WebDev**: Claude Opus 5.5 (max) leads at `1813`, 27 points ahead of GPT-6 Astra.",
    ),
  },
  {
    date: "09-29",
    kind: "board",
    source: "tbench.ai",
    text: tx(
      "**Terminal-Bench 4.0**：GPT-6.1 Sol 以 `58.2%` 并列第 3，成本 `$634.24`。",
      "**Terminal-Bench 4.0**: GPT-6.1 Sol ties for 3rd at `58.2%`, at `$634.24`.",
    ),
  },
  {
    date: "09-29",
    kind: "pick",
    source: "编辑",
    text: tx(
      "全栈组合的模型改为 Terminal-Bench 上的 **GPT-6.1 Sol**：综合成本后性价比最高。",
      "The full-stack set uses **GPT-6.1 Sol** from Terminal-Bench: best once cost is included.",
    ),
  },
  {
    date: "09-22",
    kind: "board",
    source: "tbench.ai",
    text: tx(
      "**Terminal-Bench 4.0**：Claude Opus 5.5 以 `64.8%` 登顶。",
      "**Terminal-Bench 4.0**: Claude Opus 5.5 takes first at `64.8%`.",
    ),
  },
  {
    date: "08-11",
    kind: "board",
    source: "android.com",
    text: tx(
      "**Android Bench**：新增 Claude Opus 5、GPT 5.6 Sol / Luna / Terra、Kimi K3、Qwen3.8 Max 等 8 个模型。",
      "**Android Bench**: adds eight models, including Claude Opus 5, GPT 5.6 Sol / Luna / Terra, Kimi K3, and Qwen3.8 Max.",
    ),
  },
  {
    date: "—",
    kind: "method",
    source: "编辑",
    text: tx(
      "SWE-bench Verified 自 2026 年 2 月起未收录新一代模型，暂不作为主要证据。",
      "SWE-bench Verified has not listed a new model generation since February 2026, so it is not primary evidence.",
    ),
  },
];
