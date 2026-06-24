# Ann Publish Flow Design

## Goal

Let Khun Ann publish quiz content updates for the English Adaptive Quiz without needing `gh`, `git push`, or broad GitHub account access.

## Approved Approach

Use a fine-grained GitHub Personal Access Token limited to `fiewfaw/english-adaptive-quiz-app` and keep it outside the repository as `GITHUB_TOKEN`.

Ann edits only `questions.js`, validates it locally, then runs a small Node script that uploads `questions.js` through the GitHub Contents API. The script verifies that the live GitHub Pages copy eventually matches the local file.

## Security Boundary

- Token is never committed to the repo.
- Token is never printed by the script.
- Recommended token permission is repository `Contents: Read and write`.
- Recommended expiration is 30 to 90 days.
- Ann's default publish path updates `questions.js` only.

## Components

- `scripts/publish-content.js`: no-dependency Node CLI for validation, GitHub API upload, and live verification.
- `scripts/test-publish-content.js`: small Node test script for argument parsing and helper behavior.
- `ANN_PUBLISH_GUIDE.md`: setup and publish guide for Fiew and Khun Ann.
- `ANN_CONTENT_HANDOFF.md`: handoff note updated with the new publish flow.
- `README.md`: short pointer to the publish guide.

## Data Flow

1. Fiew creates a fine-grained PAT and gives it to the Hermes/Ann environment as `GITHUB_TOKEN`.
2. Ann edits `questions.js`.
3. Ann runs `node scripts/validate-questions.js`.
4. Ann runs `node scripts/publish-content.js --dry-run`.
5. Ann runs `node scripts/publish-content.js`.
6. Script uploads `questions.js` to the `main` branch.
7. Script polls `https://fiewfaw.github.io/english-adaptive-quiz-app/questions.js` until the live content matches the local content.

## Error Handling

- Missing token stops publish before any network write.
- Invalid question bank stops publish before any network write.
- GitHub API failures print status and a short message without secrets.
- Live verification failure exits nonzero and tells Ann to re-check GitHub Pages later.

## Testing

- Run helper tests with `node scripts/test-publish-content.js`.
- Run content validation with `node scripts/validate-questions.js`.
- Run dry-run publish with `node scripts/publish-content.js --dry-run`.
- After deployment, verify live URLs return HTTP 200.
