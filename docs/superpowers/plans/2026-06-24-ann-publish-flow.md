# Ann Publish Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe publish path so Khun Ann can publish `questions.js` updates herself.

**Architecture:** Keep content editing in `questions.js`, validate locally, then use a no-dependency Node CLI to upload the file through the GitHub Contents API. The script keeps token handling outside the repo and verifies GitHub Pages after upload.

**Tech Stack:** Static HTML app, Node.js core modules, GitHub REST Contents API, GitHub Pages.

## Global Constraints

- Do not store GitHub tokens in the repo, vault, chat, or generated guide examples.
- Default publish scope is `questions.js` only.
- Do not require `gh` or `git push`.
- Keep the script dependency-free.
- Verify live Pages content after publish.

---

### Task 1: Publish Script Tests

**Files:**
- Create: `scripts/test-publish-content.js`
- Create later: `scripts/publish-content.js`

**Interfaces:**
- Consumes: `require("./publish-content")`
- Produces: tests for `parseArgs`, `encodeBase64`, `buildContentPath`, and `createPublishMessage`

- [ ] **Step 1: Write the failing test**

```js
const assert = require("assert");
const publish = require("./publish-content");

assert.deepStrictEqual(publish.parseArgs(["--dry-run"]), {
  dryRun: true,
  skipLiveCheck: false,
  help: false,
});

assert.strictEqual(publish.encodeBase64("hello"), "aGVsbG8=");
assert.strictEqual(
  publish.buildContentPath("fiewfaw", "english-adaptive-quiz-app", "questions.js", "main"),
  "/repos/fiewfaw/english-adaptive-quiz-app/contents/questions.js?ref=main"
);
assert.strictEqual(
  publish.createPublishMessage("questions.js"),
  "Update quiz content: questions.js"
);

console.log("PASS: publish-content helper tests");
```

- [ ] **Step 2: Verify it fails**

Run: `node scripts/test-publish-content.js`
Expected: FAIL because `scripts/publish-content.js` does not exist yet.

### Task 2: Publish Script Implementation

**Files:**
- Create: `scripts/publish-content.js`

**Interfaces:**
- Produces: `parseArgs(argv: string[]): object`
- Produces: `encodeBase64(text: string): string`
- Produces: `buildContentPath(owner: string, repo: string, repoPath: string, branch: string): string`
- Produces: `createPublishMessage(repoPath: string): string`
- Produces: CLI command `node scripts/publish-content.js [--dry-run] [--skip-live-check]`

- [ ] **Step 1: Implement exported helpers and CLI**

Use Node core modules only. Run validation before upload. Require `GITHUB_TOKEN` only for real publish. Upload `questions.js` with the GitHub Contents API. Poll the live Pages copy until it matches the local file.

- [ ] **Step 2: Verify tests pass**

Run: `node scripts/test-publish-content.js`
Expected: `PASS: publish-content helper tests`

- [ ] **Step 3: Verify dry-run passes**

Run: `node scripts/publish-content.js --dry-run`
Expected: content validation passes and no token is required.

### Task 3: Ann Guide And Handoff

**Files:**
- Create: `ANN_PUBLISH_GUIDE.md`
- Modify: `ANN_CONTENT_HANDOFF.md`
- Modify: `README.md`

**Interfaces:**
- Produces: clear one-time setup instructions for Fiew.
- Produces: clear edit, validate, dry-run, publish, verify flow for Ann.

- [ ] **Step 1: Add guide**

Document the fine-grained PAT settings, environment variable setup, publish commands, and troubleshooting.

- [ ] **Step 2: Update handoff and README**

Point Ann to `ANN_PUBLISH_GUIDE.md` and make the current publish owner explicit.

### Task 4: Sync, Publish, Verify

**Files:**
- Copy changed repo files to `C:\Users\fiewf\OneDrive - Srinakharinwirot University\Project\My english skill\english-adaptive-quiz-app`
- Update vault relay notes under `C:\Users\fiewf\OneDrive - Srinakharinwirot University\Obsidian-Vault`

**Interfaces:**
- Produces: live GitHub repo with publish script and guide.

- [ ] **Step 1: Run local checks**

Run: `node scripts/test-publish-content.js`
Run: `node scripts/validate-questions.js`
Run: `node scripts/publish-content.js --dry-run`

- [ ] **Step 2: Commit local repo**

Commit message: `Add Ann content publish flow`

- [ ] **Step 3: Publish with GitHub API**

Use the existing Codex device-flow/API publish method, not `gh` or `git push`.

- [ ] **Step 4: Verify live**

Check live app, `questions.js`, `ANN_PUBLISH_GUIDE.md`, and `scripts/publish-content.js` return HTTP 200.
