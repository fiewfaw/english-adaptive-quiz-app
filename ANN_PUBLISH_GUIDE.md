# Ann Publish Guide

This guide lets Khun Ann publish quiz content updates to the live app.

Live app: https://fiewfaw.github.io/english-adaptive-quiz-app/

## One-Time Setup By Fiew

Create a fine-grained GitHub Personal Access Token for this repo only.

Recommended settings:

- Resource owner: `fiewfaw`
- Repository access: Only `english-adaptive-quiz-app`
- Repository permission: `Contents: Read and write`
- Expiration: 30 to 90 days

Do not paste the token into this repo, GitHub files, Obsidian notes, or chat history. Store it only in the Hermes/Ann environment as `GITHUB_TOKEN`.

## Ann's Publish Flow

1. Edit only `questions.js`.
2. Validate the question bank:

```powershell
node scripts\validate-questions.js
```

Expected result:

```text
PASS: 23 questions validated
```

The number can be higher after Ann adds more questions.

3. Run a dry-run publish:

```powershell
node scripts\publish-content.js --dry-run
```

Expected result:

```text
DRY_RUN_OK: validation passed; no upload attempted
```

4. Publish to GitHub Pages:

```powershell
$env:GITHUB_TOKEN="paste-token-here-for-this-session"
node scripts\publish-content.js
Remove-Item Env:\GITHUB_TOKEN
```

If Hermes already stores `GITHUB_TOKEN` securely, Ann can run only:

```powershell
node scripts\publish-content.js
```

5. Confirm output includes:

```text
PUBLISH_OK: questions.js commit=<commit sha>
LIVE_OK: https://fiewfaw.github.io/english-adaptive-quiz-app/questions.js
```

## What The Script Does

- Validates `questions.js` before upload.
- Uses the GitHub API to update only `questions.js`.
- Does not require `gh`.
- Does not require `git push`.
- Does not print the token.
- Checks that the live `questions.js` matches the local file after GitHub Pages updates.

## Troubleshooting

- `Missing GITHUB_TOKEN`: the token is not set in the environment.
- `Question validation failed`: fix `questions.js` before publishing.
- `GitHub API 401`: token is wrong, expired, or revoked.
- `GitHub API 403`: token lacks `Contents: Read and write` permission for this repo.
- `Published, but live verification did not pass`: GitHub accepted the update, but Pages was slow. Wait one or two minutes and run the script again, or check the live URL manually.

## Safety Rule

Ann can publish content changes in `questions.js`. UI, app logic, adaptive scoring, and GitHub Pages settings should still go through Fiew/Codex/Claude Code unless Fiew explicitly asks Ann to change them.
