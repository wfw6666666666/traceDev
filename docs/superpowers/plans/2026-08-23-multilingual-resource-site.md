# TraceDev 多语言支持 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 TraceDev 接入简体中文、繁體中文、English、日本語和한국어五种语言，并让固定文案、动态内容、搜索和学习日志遵循统一的本地化回退规则。

**Architecture:** 使用无依赖的 `js/i18n.js` 维护语言状态、固定语言包和内容读取 API。`app.js` 与 `journal.js` 通过 `getLocalizedContent()` 渲染动态数据，语言切换通过事件重新渲染当前页面和搜索索引，不刷新页面。缺少翻译时回退现有简体中文字段。

**Tech Stack:** 原生 JavaScript、静态 HTML、现有 CSS、PowerShell 验证脚本。

**Spec:** `docs/superpowers/specs/2026-08-23-multilingual-resource-site-design.md`

## Global Constraints

- 语言标识固定为 `zh-CN`、`zh-TW`、`en`、`ja`、`ko`。
- 不增加第三方运行时依赖，不调用在线翻译 API。
- `localStorage` 键固定为 `traceDevLocale`。
- 缺少翻译统一回退简体中文，日志和外部链接数据不能因翻译缺失而消失。
- 不读取、输出或提交 `token.txt`。

### Task 1: Add Failing Multilingual Regression Checks

**Files:**
- Modify: `tools/verify-redesign.ps1`

- [ ] **Step 1: Add checks for the language script, selector, locale API, and renderer integration.**
- [ ] **Step 2: Run `./tools/verify-redesign.ps1` and confirm it fails because the language implementation is absent.**

### Task 2: Add Locale Controller and Fixed UI Language Packs

**Files:**
- Create: `js/i18n.js`
- Modify: `index.html`
- Modify: `css/style.css`

- [ ] **Step 1: Define `I18N`, locale detection, `translate()`, `getLocalizedContent()`, persistence, and `tracedev:locale-changed`.**
- [ ] **Step 2: Add one shared language menu with keyboard and touch behavior.**
- [ ] **Step 3: Mark fixed page text with `data-i18n`, placeholders, and aria labels.**
- [ ] **Step 4: Add responsive menu styles and update script cache versions.**

### Task 3: Localize Dynamic Data and Re-rendering

**Files:**
- Modify: `js/data.js`
- Modify: `js/app.js`
- Modify: `js/journal.js`
- Modify: `data/posts.json`

- [ ] **Step 1: Add representative translations to fixed content while preserving Chinese top-level fields.**
- [ ] **Step 2: Route video, resource, product, FAQ, author, and journal rendering through `getLocalizedContent()`.**
- [ ] **Step 3: Re-render visible panels and rebuild search indexes when the locale event fires.**
- [ ] **Step 4: Keep journal filter values stable while displaying localized labels.**

### Task 4: Verify Locale Switching and Regression Safety

**Files:**
- Modify: `tools/verify-redesign.ps1`

- [ ] **Step 1: Run the static verification script and all JavaScript syntax checks.**
- [ ] **Step 2: Request the local HTML and scripts over HTTP and verify status `200`, language selector markup, and cache-busted assets.**
- [ ] **Step 3: Run `git diff --check` and inspect the final changed-file list.**
