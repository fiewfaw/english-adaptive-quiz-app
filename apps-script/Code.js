/**
 * English Adaptive Quiz — Progress sync API (Google Apps Script Web App)
 * Receives one row per answered question from the quiz app and stores it in a
 * Google Sheet so Khun Ann can analyse weak points.
 *
 * Endpoints (deploy as Web App, execute as me, access = anyone anonymous):
 *   POST  body JSON {key, deviceId, questionId, part, skillTag, cefrLevel, difficulty, correct, timestamp}
 *   GET   ?key=...                 -> summary (weakest skills, totals)
 *   GET   ?key=...&format=json     -> all attempts as JSON
 *   GET   ?key=...&device=<id>     -> filter to one device
 *
 * Sheet is auto-created on first write; its id is stored in ScriptProperties.
 */
var API_KEY = 'eng-quiz-2026';          // must match SYNC_KEY in the app
var SHEET_PROP = 'PROGRESS_SHEET_ID';
var HEADERS = ['timestamp', 'deviceId', 'questionId', 'part', 'skillTag', 'cefrLevel', 'difficulty', 'correct'];

function sheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(SHEET_PROP);
  var ss = null;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { id = null; } }
  if (!id) {
    ss = SpreadsheetApp.create('English Quiz Progress');
    props.setProperty(SHEET_PROP, ss.getId());
    var sh0 = ss.getActiveSheet();
    sh0.setName('attempts');
    sh0.appendRow(HEADERS);
  }
  return ss.getSheetByName('attempts') || ss.getActiveSheet();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.key !== API_KEY) return json_({ ok: false, error: 'bad key' });
    sheet_().appendRow([
      d.timestamp || new Date().toISOString(),
      d.deviceId || '',
      d.questionId || '',
      d.part || '',
      d.skillTag || '',
      d.cefrLevel || '',
      (d.difficulty === 0 || d.difficulty) ? d.difficulty : '',
      d.correct === true
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.key !== API_KEY) return json_({ ok: false, error: 'bad key' });
  var sh = sheet_();
  var rows = sh.getDataRange().getValues();
  var head = rows.shift() || HEADERS;
  var data = rows.map(function (r) {
    var o = {}; head.forEach(function (h, i) { o[h] = r[i]; }); return o;
  });
  if (p.device) data = data.filter(function (a) { return String(a.deviceId) === String(p.device); });

  if (p.format === 'json') return json_({ ok: true, count: data.length, attempts: data });

  // default: weakness summary by skillTag
  var by = {};
  data.forEach(function (a) {
    var t = a.skillTag || '?';
    by[t] = by[t] || { skillTag: t, seen: 0, correct: 0 };
    by[t].seen++;
    if (a.correct === true || a.correct === 'true' || a.correct === 'TRUE') by[t].correct++;
  });
  var summary = Object.keys(by).map(function (k) {
    var s = by[k];
    return { skillTag: s.skillTag, seen: s.seen, correct: s.correct, accuracy: +(s.correct / s.seen).toFixed(2) };
  }).sort(function (a, b) { return a.accuracy - b.accuracy; });

  var totalCorrect = data.filter(function (a) { return a.correct === true || a.correct === 'true' || a.correct === 'TRUE'; }).length;
  return json_({
    ok: true,
    total: data.length,
    accuracy: data.length ? +(totalCorrect / data.length).toFixed(2) : 0,
    weakest: summary.slice(0, 5),
    bySkill: summary
  });
}

/** Run once manually to trigger the Sheets/Drive authorization prompt + create the sheet. */
function authorizeAndInit() {
  var sh = sheet_();
  Logger.log('Sheet ready: ' + sh.getParent().getUrl());
  return sh.getParent().getUrl();
}
