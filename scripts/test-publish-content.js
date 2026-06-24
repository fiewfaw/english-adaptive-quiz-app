const assert = require("assert");
const publish = require("./publish-content");

assert.deepStrictEqual(publish.parseArgs(["--dry-run"]), {
  dryRun: true,
  skipLiveCheck: false,
  help: false,
});

assert.deepStrictEqual(publish.parseArgs(["--skip-live-check"]), {
  dryRun: false,
  skipLiveCheck: true,
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
