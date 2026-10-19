---
name: Update curated AI coding site
description: >-
  Use when the user sends a benchmark/leaderboard link, a repo or tool link, or
  a leaderboard-change report and wants the curated AI coding hub site (scenario
  model rankings + toolbox) updated from it.
---
# Update curated AI coding site from a link

Input: one or more URLs (benchmark/leaderboard, GitHub repo, tool/library site) or a change report from a leaderboard monitor. The site repo is a local Next.js static-export project edited through the local Cursor agent (`cursor-agent -p --force`) on the user's computer, working directly on `main`.

## 1. Classify the link
- **New benchmark**: a leaderboard not on the site yet.
- **Board refresh**: a board already on the site whose data changed.
- **Toolbox item**: a repo, library, icon set, font site, skill, plugin.
- **Not used on the site**: say so in one sentence and stop; don't change pages.
Check the repo's board/tool content files to know what is already on the site.

## 2. Read the source yourself first (WebFetch)
- Benchmark: what it measures, who runs it, metric and direction (higher better or worse), task count, update date, versions, whether it is coding-general (cross-scenario) or specific to one scenario.
- Tool: what it actually offers and its license/price focus. Never invent claims or numbers.

## 3. Decide placement
- Specific benchmark: one scenario per specific board (build check enforces). General engineering boards (like sudo L7, DeepSWE, FrontierCode) get the general flag and join the coding scenarios at weight 0.6 unless told otherwise.
- Primary board of a scenario weight 1; secondary 0.6; framework-task boards 0.4. Framework-only evals (e.g. Supabase, Convex) stay on framework pages.
- If it fits no scenario, or a new scenario might be warranted, ask the user with a short widget (new scenario / add to existing at low weight / board library only).
- Tool: pick the closest existing toolbox category; create one only if none fits.

## 4. Brief Cursor (one self-contained prompt)
Include: source URLs; what it measures and direction (invert worse-is-higher scores so best = #1, and say so in the description); import the COMPLETE original leaderboard (all rows and columns, find underlying JSON/bundle or render with Playwright, verify row count vs source); record source, revision, fetch date; plain-language dimension label + Phosphor icon distinct from existing labels; popover text (name link, weight, 1-2 sentences); board detail page; model-name unification (reasoning tiers/harness variants -> best variant); columns sorted by weight; zh + en i18n; no invented data. For refreshes: refetch live source, use the report only as cross-check, flag mismatches, recompute composites. Always end with `pnpm lint`, `typecheck`, `test`, `test:e2e`, commit, and a printed summary (row counts, top 5, affected scenarios' column order and composite top 3, mapped/unmapped model counts, any mismatches).
Run it in the background; queue after any running Cursor job (wait on its PID) so jobs never overlap.

## 5. Report and push
- Report to the user in plain words: what was added/changed, where it sits, top results, unmapped count, anything you decided on their behalf.
- Commits are local until pushed. Push `main` when the user asks (or has said to push after each round); then confirm `main...origin/main` is clean.
- In a group room with a monitor bot: only boards on the site matter; ignore others and say so briefly. Keep a current list of boards in use to give the monitor when asked.
