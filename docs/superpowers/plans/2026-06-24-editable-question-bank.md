# Editable Question Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let Khun Ann / Hermes edit quiz content without touching the app UI.

**Architecture:** `index.html` owns UI and adaptive behavior. `questions.js` owns quiz content and exposes `window.ENGLISH_QUIZ_QUESTIONS`. Markdown files explain the content workflow for Khun Ann and future agents.

**Tech Stack:** Static HTML, plain JavaScript, GitHub Pages, Node.js validator with no dependencies.

## Global Constraints

- Keep the app static and GitHub Pages-compatible.
- Do not require a build step.
- Do not require Hermes to edit `index.html` for normal content updates.
- Validate question content before publishing.

---

### Task 1: Extract Question Bank

**Files:**
- Create: `questions.js`
- Modify: `index.html`

**Interfaces:**
- Produces: `window.ENGLISH_QUIZ_QUESTIONS: Array<Question>`
- Consumes: `const BANK = window.ENGLISH_QUIZ_QUESTIONS`

- [x] Move the existing `BANK` array into `questions.js`.
- [x] Load `questions.js` before the main app script in `index.html`.
- [x] Keep `BANK` as the internal app variable so adaptive logic remains unchanged.
- [x] Add guards for empty question banks and empty selected sections.

### Task 2: Add Content Validation

**Files:**
- Create: `scripts/validate-questions.js`

**Interfaces:**
- Consumes: `questions.js`
- Produces: CLI result `PASS: N questions validated` or detailed `FAIL` lines

- [x] Validate unique `id`.
- [x] Validate `part`, `skillTag`, `cefrLevel`, `difficulty`, `prompt`, `choices`, `answerIndex`, and `explanation`.
- [x] Require `passage` for reading questions.
- [x] Require `audioScript` for listening questions.

### Task 3: Add Ann-Facing Documentation

**Files:**
- Create: `CONTENT_GUIDE.md`
- Create: `ANN_CONTENT_HANDOFF.md`
- Modify: `README.md`

**Interfaces:**
- Produces: human workflow for Khun Ann / Hermes

- [x] Document the editable schema.
- [x] Document the Hermes workflow from Fiew vocabulary/topic input to patch handoff.
- [x] Document validation command and expected output.

### Task 4: Verify And Publish

**Files:**
- Read: `index.html`
- Read: `questions.js`
- Read: `scripts/validate-questions.js`

**Interfaces:**
- Consumes: local files and GitHub Pages URL
- Produces: live app at `https://fiewfaw.github.io/english-adaptive-quiz-app/`

- [ ] Run `node scripts/validate-questions.js`.
- [ ] Parse the inline script in `index.html`.
- [ ] Confirm `questions.js` is referenced before the main script.
- [ ] Sync files to the original local app folder.
- [ ] Publish to GitHub.
- [ ] Verify live URL returns `HTTP 200` and includes `purple-icon-system`.
