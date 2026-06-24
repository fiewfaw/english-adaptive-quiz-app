# Handoff to Khun Ann: Editable Quiz Content

แอนดูแลเนื้อหาข้อสอบของแอปนี้ได้แล้ว โดยแก้ไฟล์ `questions.js` เป็นหลัก

## Current Links

- Repo: https://github.com/fiewfaw/english-adaptive-quiz-app
- Live app: https://fiewfaw.github.io/english-adaptive-quiz-app/
- Ann publish guide: `ANN_PUBLISH_GUIDE.md`

## Ann Publish Flow

Ann can publish content updates after Fiew gives Hermes/Ann a fine-grained GitHub token stored as `GITHUB_TOKEN`.

Recommended token boundary:

- Repo: `fiewfaw/english-adaptive-quiz-app` only
- Permission: `Contents: Read and write`
- Expiration: 30 to 90 days
- Never save the token in this repo, vault notes, or chat

Ann's command flow:

```powershell
node scripts\validate-questions.js
node scripts\publish-content.js --dry-run
node scripts\publish-content.js
```

The publish script updates only `questions.js` and verifies the live GitHub Pages copy. Full instructions are in `ANN_PUBLISH_GUIDE.md`.

## What Changed

- ข้อสอบถูกแยกออกจาก `index.html`
- คลังข้อสอบอยู่ที่ `questions.js`
- หน้าแอปยังอยู่ที่ `index.html`
- ตัวตรวจข้อสอบอยู่ที่ `scripts/validate-questions.js`
- คู่มือแก้ข้อสอบอยู่ที่ `CONTENT_GUIDE.md`

## Hermes Flow

เมื่อเฟี้ยวส่งคำศัพท์หรือหัวข้อที่อยากฝึก:

1. แอนสรุปเป้าหมายเป็นหมวด เช่น vocab, tenses, reading main idea, listening detail
2. แอนเพิ่มข้อสอบใน `questions.js`
3. แอนรัน `node scripts/validate-questions.js`
4. ถ้าผ่าน ให้ส่ง patch หรือไฟล์ `questions.js` กลับให้ Codex/Claude Code push
5. หลัง push แล้วให้เช็ก live URL อีกครั้ง

## Important Constraint

Hermes/OneDrive อาจเชื่อมไม่เสถียร ดังนั้นไฟล์นี้ตั้งใจให้เป็น handoff ที่อ่านจาก GitHub ได้ด้วย ไม่ต้องพึ่ง vault อย่างเดียว

## Editing Boundary

แอนแก้ได้:

- `questions.js`
- เพิ่มข้อสอบ Grammar & Vocab
- เพิ่ม Reading passages
- เพิ่ม Listening scripts
- ปรับ explanation/ref ของข้อสอบ

แอนไม่ควรแก้โดยไม่ขอเฟี้ยวก่อน:

- UI/CSS ใน `index.html`
- adaptive algorithm
- localStorage/state logic
- GitHub Pages settings

## Push Boundary

ถ้าเครื่องแอนไม่มี GitHub auth:

- แอนทำ patch ได้
- Codex หรือ Claude Code เป็นคน push ให้

ถ้าเฟี้ยว authorize GitHub ให้แอน:

- แอน push เองได้
- ต้อง verify live app หลัง push ทุกครั้ง
