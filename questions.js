/*
  English Adaptive Quiz question bank

  Khun Ann / Hermes edits this file when Fiew sends new vocabulary, grammar points,
  reading topics, or listening scripts. Keep the structure exactly like the examples.
  The app reads window.ENGLISH_QUIZ_QUESTIONS at startup.
*/
window.ENGLISH_QUIZ_QUESTIONS = [
  // ---- Grammar & Vocab ----
  {id:"g01",part:"grammar_vocab",skillTag:"tenses",cefrLevel:"A2",difficulty:1,prompt:"She ____ to the market every Sunday.",choices:["go","goes","going","gone"],answerIndex:1,explanation:"Present simple กับประธานเอกพจน์ (she) เติม -s → goes",ref:"CEFR A2"},
  {id:"g02",part:"grammar_vocab",skillTag:"prepositions",cefrLevel:"A2",difficulty:1,prompt:"The meeting is ____ Monday morning.",choices:["in","on","at","by"],answerIndex:1,explanation:"ใช้ on กับวันในสัปดาห์ → on Monday",ref:"CEFR A2"},
  {id:"g03",part:"grammar_vocab",skillTag:"articles",cefrLevel:"A2",difficulty:2,prompt:"He is ____ honest man.",choices:["a","an","the","—"],answerIndex:1,explanation:"honest ออกเสียงสระ /ɒ/ (h เงียบ) จึงใช้ an",ref:"CEFR A2"},
  {id:"g04",part:"grammar_vocab",skillTag:"tenses",cefrLevel:"B1",difficulty:3,prompt:"By the time we arrived, the film ____.",choices:["already started","has already started","had already started","was already starting"],answerIndex:2,explanation:"เหตุเกิดก่อนอีกเหตุในอดีต ใช้ past perfect → had already started",ref:"CEFR B1"},
  {id:"g05",part:"grammar_vocab",skillTag:"conditionals",cefrLevel:"B1",difficulty:3,prompt:"If I ____ more time, I would learn the guitar.",choices:["have","had","will have","would have"],answerIndex:1,explanation:"Second conditional (สมมติปัจจุบัน): if + past simple, would + verb → had",ref:"CEFR B1"},
  {id:"g06",part:"grammar_vocab",skillTag:"modals",cefrLevel:"B1",difficulty:2,prompt:"You ____ smoke here — it's a hospital.",choices:["mustn't","don't have to","needn't","wouldn't"],answerIndex:0,explanation:"ห้ามทำ (prohibition) ใช้ mustn't",ref:"CEFR B1"},
  {id:"g07",part:"grammar_vocab",skillTag:"phrasal-verbs",cefrLevel:"B1",difficulty:3,prompt:"Please ____ the form and return it to the office.",choices:["fill in","fill up","fill out for","fill off"],answerIndex:0,explanation:"กรอกแบบฟอร์ม = fill in (หรือ fill out) — ตัวเลือกที่ถูกที่สุดคือ fill in",ref:"CEFR B1"},
  {id:"g08",part:"grammar_vocab",skillTag:"vocabulary-collocation",cefrLevel:"B2",difficulty:4,prompt:"The new policy had a significant ____ on small businesses.",choices:["affect","effect","effort","impactful"],answerIndex:1,explanation:"ต้องการคำนาม → effect (affect เป็นกริยา); collocation: have an effect on",ref:"CEFR B2"},
  {id:"g09",part:"grammar_vocab",skillTag:"word-formation",cefrLevel:"B2",difficulty:4,prompt:"Her argument was completely ____; nobody could disagree.",choices:["convince","convincing","convinced","convincingly"],answerIndex:1,explanation:"ต้องการ adjective ขยาย argument → convincing (น่าเชื่อถือ)",ref:"CEFR B2"},
  {id:"g10",part:"grammar_vocab",skillTag:"tenses",cefrLevel:"B2",difficulty:4,prompt:"I'm exhausted — I ____ all day.",choices:["work","worked","have been working","had worked"],answerIndex:2,explanation:"การกระทำต่อเนื่องจนถึงปัจจุบันและเห็นผล → present perfect continuous",ref:"CEFR B2"},
  {id:"g11",part:"grammar_vocab",skillTag:"prepositions",cefrLevel:"B1",difficulty:3,prompt:"She's very good ____ solving problems quickly.",choices:["in","on","at","with"],answerIndex:2,explanation:"good at + V-ing",ref:"CEFR B1"},
  {id:"g12",part:"grammar_vocab",skillTag:"vocabulary-collocation",cefrLevel:"B1",difficulty:3,prompt:"Can you ____ a decision by Friday?",choices:["make","do","take","give"],answerIndex:0,explanation:"collocation: make a decision",ref:"CEFR B1"},

  // ---- Reading ----
  {id:"r01",part:"reading",skillTag:"main-idea",cefrLevel:"A2",difficulty:2,
   passage:"Lina works from home three days a week. She says it saves her two hours of travel each day, and she feels less tired. However, she sometimes misses talking to her colleagues face to face.",
   prompt:"What is the passage mainly about?",choices:["Lina's daily travel route","The good and bad points of working from home","Why Lina is always tired","Lina's colleagues"],answerIndex:1,explanation:"เนื้อหารวมข้อดี (ประหยัดเวลา) และข้อเสีย (คิดถึงเพื่อน) ของ work from home",ref:"CEFR A2"},
  {id:"r02",part:"reading",skillTag:"detail",cefrLevel:"A2",difficulty:2,
   passage:"The museum opens at 9 a.m. on weekdays and 10 a.m. at weekends. It closes at 5 p.m. every day except Friday, when it stays open until 8 p.m.",
   prompt:"When does the museum close on Friday?",choices:["5 p.m.","8 p.m.","9 a.m.","10 a.m."],answerIndex:1,explanation:"ข้อความระบุว่า Friday เปิดถึง 8 p.m.",ref:"CEFR A2"},
  {id:"r03",part:"reading",skillTag:"inference",cefrLevel:"B1",difficulty:3,
   passage:"Tom checked his bag twice before leaving. At the airport, he reached for his passport but his hand found nothing. His face went pale.",
   prompt:"What can we infer about Tom?",choices:["He was excited to travel","He had forgotten his passport","He was meeting a friend","He had lost his bag"],answerIndex:1,explanation:"ล้วงหากระเป๋าแล้วไม่เจอ + หน้าซีด → อนุมานว่าลืม/ทำพาสปอร์ตหาย",ref:"CEFR B1"},
  {id:"r04",part:"reading",skillTag:"vocabulary-in-context",cefrLevel:"B1",difficulty:3,
   passage:"The instructions were so vague that nobody knew exactly what to do, and the team wasted an entire morning guessing.",
   prompt:"In this context, \"vague\" is closest in meaning to:",choices:["clear","unclear","short","long"],answerIndex:1,explanation:"ผลคือไม่มีใครรู้ว่าต้องทำอะไร → vague = ไม่ชัดเจน (unclear)",ref:"CEFR B1"},
  {id:"r05",part:"reading",skillTag:"main-idea",cefrLevel:"B2",difficulty:4,
   passage:"While many assume that multitasking boosts productivity, a growing body of research suggests the opposite. Each time we switch tasks, the brain needs time to refocus, and these small delays accumulate. Far from saving time, constant switching may quietly drain it.",
   prompt:"What is the writer's main point?",choices:["Multitasking always saves time","Multitasking may actually reduce productivity","The brain cannot focus at all","Research is unreliable"],answerIndex:1,explanation:"ผู้เขียนแย้งความเชื่อว่า multitasking ดี โดยชี้ว่ามันอาจลดประสิทธิภาพ",ref:"CEFR B2"},
  {id:"r06",part:"reading",skillTag:"inference",cefrLevel:"B2",difficulty:5,
   passage:"The café had changed. The hand-written menus were gone, replaced by glowing screens, and the old owner's photographs no longer hung by the door. Maya ordered her usual coffee, but it no longer tasted the same.",
   prompt:"What does the passage suggest about Maya's feelings?",choices:["She prefers the new design","She feels a sense of loss","She dislikes coffee now","She is meeting the owner"],answerIndex:1,explanation:"รายละเอียดของเก่าที่หายไป + 'no longer tasted the same' สื่อความรู้สึกสูญเสีย/โหยหา",ref:"CEFR B2"},

  // ---- Listening (script-based for now) ----
  {id:"l01",part:"listening",skillTag:"specific-info",cefrLevel:"A2",difficulty:2,
   audioScript:"Woman: Excuse me, what time does the next train to Oxford leave?\nMan: The 10:15 has just gone, so the next one is at 10:45 from platform 3.",
   prompt:"When does the next train leave?",choices:["10:15","10:45","11:15","3:00"],answerIndex:1,explanation:"ผู้ชายบอกว่ารถ 10:15 เพิ่งออก รอบถัดไป 10:45",ref:"CEFR A2"},
  {id:"l02",part:"listening",skillTag:"gist",cefrLevel:"B1",difficulty:3,
   audioScript:"Speaker: Thank you all for coming. Today I won't talk about the budget — that's next week. Instead, I'd like to focus on our new recycling plan and how each team can help.",
   prompt:"What is the talk mainly about?",choices:["The budget","A recycling plan","Hiring new staff","A holiday schedule"],answerIndex:1,explanation:"ผู้พูดบอกชัดว่าวันนี้เน้น recycling plan (ไม่ใช่ budget)",ref:"CEFR B1"},
  {id:"l03",part:"listening",skillTag:"detail",cefrLevel:"B1",difficulty:3,
   audioScript:"Man: I'd like to book a table for four, please.\nWoman: Of course. For tonight?\nMan: No, for tomorrow at 7:30.",
   prompt:"When does the man want the table?",choices:["Tonight at 7:30","Tomorrow at 7:30","Tonight for four","Tomorrow morning"],answerIndex:1,explanation:"ผู้ชายแก้เป็น 'tomorrow at 7:30'",ref:"CEFR B1"},
  {id:"l04",part:"listening",skillTag:"specific-info",cefrLevel:"B2",difficulty:4,
   audioScript:"Tutor: For the assignment, the word count is fifteen hundred words. You can lose marks for going more than ten percent over, so keep it under sixteen-fifty.",
   prompt:"What is the maximum acceptable word count?",choices:["1,500","1,650","1,000","2,000"],answerIndex:1,explanation:"1,500 +10% = 1,650 (อาจารย์ย้ำ 'under sixteen-fifty')",ref:"CEFR B2"},
  {id:"l05",part:"listening",skillTag:"inference",cefrLevel:"B2",difficulty:5,
   audioScript:"Woman: So, how was the new restaurant?\nMan: Well... the view was lovely, and the staff were friendly. (pause) Let's just say I won't be rushing back for the food.",
   prompt:"What does the man imply about the food?",choices:["It was excellent","It was disappointing","It was expensive","It was spicy"],answerIndex:1,explanation:"'won't be rushing back for the food' เป็นการพูดเลี่ยง สื่อว่าอาหารไม่ดี (ผิดหวัง)",ref:"CEFR B2"},
];
