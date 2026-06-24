const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const file = path.join(root, "questions.js");
const code = fs.readFileSync(file, "utf8");
const sandbox = { window: {} };

vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: "questions.js" });

const questions = sandbox.window.ENGLISH_QUIZ_QUESTIONS;
const allowedParts = new Set(["grammar_vocab", "reading", "listening"]);
const allowedLevels = new Set(["A2", "B1", "B2"]);
const errors = [];
const ids = new Set();

function fail(id, message) {
  errors.push(`${id || "(unknown id)"}: ${message}`);
}

if (!Array.isArray(questions)) {
  fail("questions.js", "window.ENGLISH_QUIZ_QUESTIONS must be an array");
} else {
  questions.forEach((q, index) => {
    const label = q && q.id ? q.id : `item ${index + 1}`;
    if (!q || typeof q !== "object") {
      fail(label, "question must be an object");
      return;
    }
    if (!q.id || typeof q.id !== "string") fail(label, "id is required");
    if (q.id && ids.has(q.id)) fail(label, "duplicate id");
    if (q.id) ids.add(q.id);
    if (!allowedParts.has(q.part)) fail(label, "part must be grammar_vocab, reading, or listening");
    if (!q.skillTag || typeof q.skillTag !== "string") fail(label, "skillTag is required");
    if (!allowedLevels.has(q.cefrLevel)) fail(label, "cefrLevel must be A2, B1, or B2");
    if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 5) fail(label, "difficulty must be an integer from 1 to 5");
    if (!q.prompt || typeof q.prompt !== "string") fail(label, "prompt is required");
    if (!Array.isArray(q.choices) || q.choices.length !== 4) fail(label, "choices must have exactly 4 items");
    if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3) fail(label, "answerIndex must be 0, 1, 2, or 3");
    if (!q.explanation || typeof q.explanation !== "string") fail(label, "explanation is required");
    if (q.part === "reading" && (!q.passage || typeof q.passage !== "string")) fail(label, "reading questions need passage");
    if (q.part === "listening" && (!q.audioScript || typeof q.audioScript !== "string")) fail(label, "listening questions need audioScript");
  });
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} question bank issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`PASS: ${questions.length} questions validated`);
