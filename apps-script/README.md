# Progress-sync backend (Google Apps Script Web App)

Receives one row per answered question from the quiz and stores it in a Google
Sheet so Khun Ann can analyse weak points. No paid/external backend.

- **Script:** "English Quiz Progress API" (owner: fiewfaw@gmail.com)
- **Web App URL (POST + GET):** https://script.google.com/macros/s/AKfycbwUIS48PbXSZ3jHOid3GbO5u7M2Lstw6eoERA12SIlVFejelPRLXzCPmPYor_0Am1VY/exec
- Client wiring: `SYNC_URL` / `SYNC_KEY` in `index.html` (key must equal `API_KEY` in Code.js)

## Endpoints
- `POST` JSON `{key, deviceId, questionId, part, skillTag, cefrLevel, difficulty, correct, timestamp}` → append row
- `GET ?key=eng-quiz-2026` → weakness summary (weakest skills + accuracy)
- `GET ?key=eng-quiz-2026&format=json` → all attempts
- `GET ?key=eng-quiz-2026&device=<id>` → filter one device

## Deploy / update (clasp)
```
cd apps-script && clasp push && clasp create-deployment
```
First deploy needs a one-time owner authorization (open the exec URL while logged
in as the owner → Review Permissions → Allow). The auto-created Sheet "English
Quiz Progress" holds the data.
