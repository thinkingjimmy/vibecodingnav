# 07-17 | Design System —— 提取自 paperswithcode.co

> 逆向自 paperswithcode.co 生产环境 CSS bundle（2026-07-17 快照），全部数值为实测而非目测。
> 本文档保留原始设计依据；当前实现以 `src/input.css` 为准，调整样式时必须同步核对两者差异。

---

## 一、设计哲学（一段话读懂这个风格）

**暖纸底色 + 墨色文字 + 三字体分工**。它不是"性冷淡白",而是米白暖纸（`#FAF8F4`），像印刷品。
字体各司其职：**衬线（Newsreader）管内容**——标题、摘要、大数字；**等宽（JetBrains Mono）管元数据**——标签、徽章、统计、按钮；无衬线（Inter）只做兜底。
强调色是**低饱和蓝**（oklch，接近藏青），全站只此一色，出现即代表"重点/激活/数据高亮"。
密度极高（正文 13px 上下）但不显挤，靠留白与 1px 发丝线分隔，几乎不用阴影。

---

## 二、Design Tokens（原站原值，直接抄）

### 2.1 颜色

```css
:root {
  /* 背景三层 */
  --bg:            #FAF8F4;   /* 页面底色 · 暖米白 */
  --bg-elevated:   #FFFFFF;   /* 卡片/悬浮层 · 纯白 */
  --bg-subtle:     #F2EFE8;   /* 次级底/hover 态 · 深一档米色 */

  /* 文字三档（墨色系，非纯黑） */
  --ink:           #1A1814;   /* 主文字 · 暖黑 */
  --ink-soft:      #5A554C;   /* 次级文字 · 摘要/作者 */
  --ink-faint:     #8E8678;   /* 弱文字 · 标签/说明 */

  /* 边框两档（发丝线） */
  --hairline:         #E4DFD4;  /* 常规分隔线/边框 */
  --hairline-strong:  #C8C2B3;  /* hover 加深边框 */

  /* 强调色（全站唯一彩色） */
  --accent:      oklch(0.45 0.08 250);  /* 低饱和蓝 · 数据高亮/激活态 */
  --accent-soft: oklch(0.92 0.03 250);  /* 浅蓝底 · 选中背景 */
  --accent-text: oklch(0.35 0.10 250);  /* 深蓝字 · 链接/强调文字 */
  --warn:        oklch(0.55 0.12 30);   /* 暖橙红 · 唯一警示色 */
}
```

### 2.2 字体

```css
--serif: "Newsreader", Georgia, serif;              /* 内容层 */
--sans:  "Inter", -apple-system, sans-serif;        /* 兜底 */
--mono:  "JetBrains Mono", ui-monospace, monospace; /* 元数据层 */
```

原站用量实测：mono 112 处 > serif 51 处 > sans 11 处。**mono 才是这个风格的主角。**

**i18n 适配（AIEvalIndex 专属追加）**：CJK 页面衬线回落宋体系，等宽保持拉丁字体渲染数字：

```css
[lang="zh-CN"] { --serif: "Newsreader", Georgia, "Songti SC", "Noto Serif SC", serif; }
[lang="ja"]    { --serif: "Newsreader", Georgia, "Hiragino Mincho ProN", "Noto Serif JP", serif; }
[lang="ko"]    { --serif: "Newsreader", Georgia, "Apple Myungjo", "Noto Serif KR", serif; }
```

### 2.3 字号阶梯（密度是灵魂）

| 用途 | 字号 | 字体 | 备注 |
|---|---|---|---|
| 页面大标题 (feed-title) | 44px / 500 | serif | letter-spacing -0.025em, line-height 1 |
| 详情页标题 (detail-title) | 38px / 500 | serif | -0.02em, lh 1.15, text-wrap balance |
| 大数字 (SOTA 值) | 36px / 500 | serif | **color: accent**, tnum, lh 1 |
| 排名序号 | 32px / 500 italic | serif | color: ink-faint, tnum |
| 条目标题 | 22-24px / 500 | serif | -0.015em, lh 1.2 |
| 正文/摘要 | 13.5-16px | serif | lh 1.55-1.65, color: ink-soft |
| UI 常规文字 | 12-13px | sans/mono | |
| 元数据/标签/按钮 | 10-11px / 500 | mono | 这是全站出现最多的字号 |
| Section 眉标 | 10px | mono | uppercase + letter-spacing 0.1-0.14em |

**铁律：正文永远 ≤16px；11px mono 是元数据的默认值；数字一律 `font-feature-settings:"tnum"` 对齐。**

### 2.4 圆角 / 阴影 / 动效

```
圆角：3-4px（标签/小件） · 6px（按钮/卡片，最常用） · 8px（大卡片） · 999px（药丸/头像）
阴影：几乎不用。层级靠 1px hairline 边框 + 背景三层色差表达
动效：transition 0.15s 一刀切（border-color / background / color）
hover 公式：border-color → hairline-strong；背景 → bg-subtle；tag 额外 brightness(.96) + translateY(-1px)
```

---

## 三、组件配方（原站实测样式，按需取用）

### 3.1 Section 眉标（section-label）—— 本风格的签名元素

```css
.section-label {
  font-family: var(--mono); font-size: 10px;
  letter-spacing: .12em; text-transform: uppercase;
  color: var(--ink-faint);
  padding-top: 24px; border-top: 1px solid var(--hairline);
  margin-bottom: 14px;
}
```
用途：BENCHMARKS / COMMUNITY REVIEWS 等区块标题。**顶部发丝线 + mono 大写小字**，一眼学术。

### 3.2 大数字展示（bench-sota-value）—— Hero 指标卡用这个

```css
.stat-value {
  font-family: var(--serif); font-size: 36px; font-weight: 500;
  color: var(--accent); font-feature-settings: "tnum"; line-height: 1;
}
/* 配套小标签：10-11px mono uppercase ink-faint */
```
用途：Intelligence 57、Arena #1、$3/$15、1M context 四张卡。衬线大数字 + 强调蓝 = 视觉锚点。

### 3.3 重点引述框（tldr-box）—— 评价共识区用这个

```css
.tldr-box {
  padding: 18px 22px 18px 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--hairline);
  border-left: 3px solid var(--accent);   /* 左侧 3px 强调线是灵魂 */
  border-radius: 4px;
  font-family: var(--serif); font-size: 15px; line-height: 1.6;
}
```
用途：Consensus pros/cons 两栏。cons 栏可将左线换 `var(--warn)`。

### 3.4 标签/徽章（tag-chip / banner-tag）—— 数据源徽章用这个

```css
.tag-chip {   /* 可点击标签 */
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; font-family: var(--mono);
  font-size: 11px; font-weight: 500; border-radius: 4px;
  border: 1px solid transparent;
  transition: filter .15s, transform .15s;
}
.banner-tag { /* 实心强调徽章，如 #1 排名 */
  font-family: var(--mono); font-size: 10px; font-weight: 600;
  background: var(--accent); color: #fff;
  padding: 2px 6px; border-radius: 3px; letter-spacing: .05em;
}
.metric-pill { /* 线框数据药丸，如 votes/context */
  display: inline-flex; gap: 5px; padding: 3px 8px;
  border: 1px solid var(--hairline); border-radius: 4px;
  background: var(--bg-elevated); color: var(--ink-soft);
  font-family: var(--mono); font-size: 11px; text-transform: lowercase;
}
```

### 3.5 按钮（次级为主，全站没有大实心主按钮）

```css
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 32px; padding: 0 12px;
  border: 1px solid var(--hairline); border-radius: 6px;
  background: var(--bg-elevated);
  font-family: var(--mono); font-size: 11px; font-weight: 500;
  color: var(--ink-soft);
  transition: border-color .15s, background .15s, color .15s;
}
.btn:hover { border-color: var(--hairline-strong); background: var(--bg-subtle); }
```
高度统一 32px。语言切换器、外链回源按钮都用它。

### 3.6 卡片与表格

```
卡片：bg-elevated + 1px hairline + radius 8px + padding 12-24px，无阴影
表格：无竖线；行间 1px hairline 横线；表头 10px mono uppercase ink-faint；
     数字列 mono + tnum 右对齐；高亮行（Kimi K3）用 accent-soft 背景 + 左侧 3px accent 线
```

### 3.7 页面标题区（Hero 参考 detail 页）

```
标题 38px serif 500 + 副题 13px serif italic ink-soft（如 "by Moonshot AI · Released Jul 2026"）
下接 quickstats 行：mono 11px ink-faint，间距 28px，底部 1px accent 分隔线
```

---

## 四、Tailwind 落地映射

`tailwind.config.js` 直接注入 tokens（CSS 变量法，locale 换字体不用改配置）：

```js
export default {
  content: ["./templates/**/*.html"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", elevated: "var(--bg-elevated)", subtle: "var(--bg-subtle)",
        ink: { DEFAULT: "var(--ink)", soft: "var(--ink-soft)", faint: "var(--ink-faint)" },
        hairline: { DEFAULT: "var(--hairline)", strong: "var(--hairline-strong)" },
        accent: { DEFAULT: "var(--accent)", soft: "var(--accent-soft)", text: "var(--accent-text)" },
        warn: "var(--warn)",
      },
      fontFamily: {
        serif: "var(--serif)", sans: "var(--sans)", mono: "var(--mono)",
      },
    },
  },
}
```

常用组合速查：

| 元素 | Tailwind 类 |
|---|---|
| Section 眉标 | `font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint border-t border-hairline pt-6 mb-3.5` |
| 大数字 | `font-serif text-4xl font-medium text-accent [font-feature-settings:'tnum'] leading-none` |
| 元数据 | `font-mono text-[11px] font-medium text-ink-soft` |
| 卡片 | `bg-elevated border border-hairline rounded-lg` |
| 按钮 | `h-8 px-3 border border-hairline rounded-md bg-elevated font-mono text-[11px] text-ink-soft hover:border-hairline-strong hover:bg-subtle transition-colors` |

字体加载：Newsreader + Inter + JetBrains Mono 走 Google Fonts，`display=swap`，只取 400/500/600 + italic。

---

## 五、禁律（违反即离型）

- ❌ 纯白页面底 —— 底色必须是 `#FAF8F4`，纯白只给卡片
- ❌ 第二种强调色 —— 蓝之外只有 warn 橙红，且仅用于"缺点/警示"
- ❌ 大阴影、渐变、玻璃拟态 —— 层级只靠发丝线和三层背景色
- ❌ 粗体滥用 —— 全站最重 600，标题一律 500
- ❌ 大字号 UI —— 按钮/标签超过 12px 就不是这个风格了
- ❌ 无衬线做标题 —— 标题永远衬线，元数据永远等宽
