# Content Guide for Khun Ann

ไฟล์ที่แอนแก้บ่อยคือ `questions.js` เท่านั้น ไม่ต้องแตะ `index.html` ถ้าเป็นงานเพิ่มคำศัพท์ หัวข้อ grammar, reading passage, หรือ listening script ให้เฟี้ยว

## Workflow

1. รับคำศัพท์หรือหัวข้อจากเฟี้ยวใน Hermes
2. แปลงเป็นข้อสอบแบบ 4 ตัวเลือก
3. เพิ่มข้อสอบลง `questions.js`
4. รัน `node scripts/validate-questions.js`
5. ส่ง patch/file กลับให้ Codex หรือ Claude Code push ขึ้น GitHub Pages

## Question Shape

```js
{
  id: "fiew-vocab-001",
  part: "grammar_vocab",
  skillTag: "vocabulary-health",
  cefrLevel: "B1",
  difficulty: 3,
  prompt: "The patient made a full ____ after two weeks.",
  choices: ["recover", "recovery", "recovering", "recovered"],
  answerIndex: 1,
  explanation: "หลัง article 'a' และ adjective 'full' ต้องใช้คำนาม: recovery",
  ref: "Fiew custom"
}
```

## Fields

- `id`: ห้ามซ้ำ แนะนำรูปแบบ `fiew-vocab-001`, `fiew-reading-001`, `fiew-listening-001`
- `part`: ใช้ได้แค่ `grammar_vocab`, `reading`, `listening`
- `skillTag`: หมวดทักษะ เช่น `tenses`, `word-formation`, `vocabulary-health`, `main-idea`
- `cefrLevel`: `A2`, `B1`, หรือ `B2`
- `difficulty`: เลข 1-5
- `prompt`: คำถาม
- `choices`: ตัวเลือก 4 ข้อเสมอ
- `answerIndex`: คำตอบที่ถูก เริ่มนับจาก 0 คือ A, 1 คือ B, 2 คือ C, 3 คือ D
- `explanation`: เหตุผลสั้น ๆ ว่าทำไมตอบข้อนี้
- `ref`: แหล่งอ้างอิงหรือที่มา เช่น `Fiew custom`, `CEFR B1`

## Reading

ข้อสอบ reading ต้องมี `passage`

```js
{
  id: "fiew-reading-001",
  part: "reading",
  skillTag: "detail",
  cefrLevel: "B1",
  difficulty: 3,
  passage: "Short passage here.",
  prompt: "What does the writer say about ...?",
  choices: ["A", "B", "C", "D"],
  answerIndex: 0,
  explanation: "คำตอบอยู่ในประโยคที่ ...",
  ref: "Fiew custom"
}
```

## Listening

ข้อสอบ listening ตอนนี้เป็น script-based ต้องมี `audioScript`

```js
{
  id: "fiew-listening-001",
  part: "listening",
  skillTag: "specific-info",
  cefrLevel: "A2",
  difficulty: 2,
  audioScript: "Woman: ...\nMan: ...",
  prompt: "What time does ...?",
  choices: ["A", "B", "C", "D"],
  answerIndex: 2,
  explanation: "ในสคริปต์พูดว่า ...",
  ref: "Fiew custom"
}
```

## Rules for New Content

- ถ้าเฟี้ยวส่งคำศัพท์ 10 คำ ให้ทำอย่างน้อย 10 ข้อ และพยายามคละ `skillTag`
- ถ้าเป็น grammar ให้ใส่คำอธิบาย pattern ชัด ๆ
- ถ้าเป็น vocabulary ให้ตัวเลือกหลอกควรอยู่ชนิดคำใกล้กัน เช่น noun vs verb vs adjective
- อย่าใช้คำตอบที่กำกวม
- อย่าเปลี่ยนชื่อ field
- อย่าลืม comma ระหว่างข้อใน array

## Publishing

ถ้าแอนมี `GITHUB_TOKEN` สำหรับ repo นี้แล้ว ให้ publish ด้วย:

```bash
node scripts/publish-content.js
```

อ่านรายละเอียดการตั้ง token และขั้นตอน publish ใน `ANN_PUBLISH_GUIDE.md`

## Validation

รันจาก root ของ repo:

```bash
node scripts/validate-questions.js
```

ผลที่ต้องการ:

```text
PASS: 23 questions validated
```

ถ้าขึ้น `FAIL` ให้อ่านรายการที่บอก id แล้วแก้ `questions.js` ก่อนส่งต่อให้ push
