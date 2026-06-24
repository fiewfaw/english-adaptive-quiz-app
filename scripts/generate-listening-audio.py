#!/usr/bin/env python3
"""Generate listening-clip MP3s (l01..l05) for the quiz app using edge-tts
natural neural voices. Female = en-GB-Sonia, Male = en-GB-Ryan.

Output: assets/audio/<id>.mp3  (24kHz mono mp3)

Run:  python scripts/generate-listening-audio.py
Requires: edge-tts (pip), ffmpeg on PATH.

Speaker labels in questions.js (Woman:/Man:/Speaker:/Tutor:) are NOT read aloud;
each turn is voiced by the matching speaker so the clip sounds like real audio.
Numbers/times are spelled for clean pronunciation.
"""
import asyncio, os, subprocess, tempfile, sys
import edge_tts

FEMALE = "en-GB-SoniaNeural"
MALE   = "en-GB-RyanNeural"

# (speaker, text) per turn.  ("PAUSE", seconds) inserts silence.
CLIPS = {
    "l01": [("F", "Excuse me, what time does the next train to Oxford leave?"),
            ("M", "The ten fifteen has just gone, so the next one is at ten forty-five, from platform three.")],
    "l02": [("F", "Thank you all for coming. Today I won't talk about the budget — that's next week. "
                  "Instead, I'd like to focus on our new recycling plan, and how each team can help.")],
    "l03": [("M", "I'd like to book a table for four, please."),
            ("F", "Of course. For tonight?"),
            ("M", "No, for tomorrow at half past seven.")],
    "l04": [("M", "For the assignment, the word count is fifteen hundred words. "
                  "You can lose marks for going more than ten percent over, so keep it under sixteen fifty.")],
    "l05": [("F", "So, how was the new restaurant?"),
            ("M", "Well... the view was lovely, and the staff were friendly."),
            ("PAUSE", 0.7),
            ("M", "Let's just say I won't be rushing back for the food.")],
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(ROOT, "assets", "audio")
GAP  = 0.35  # silence between turns (s)
SR   = 24000

def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)

def silence(path, secs):
    ff("-f", "lavfi", "-i", f"anullsrc=r={SR}:cl=mono", "-t", f"{secs}",
       "-c:a", "libmp3lame", "-q:a", "9", path)

async def tts(text, voice, path):
    await edge_tts.Communicate(text, voice).save(path)

async def build(qid, turns, tmp):
    parts, idx = [], 0
    for i, (spk, val) in enumerate(turns):
        if spk == "PAUSE":
            p = os.path.join(tmp, f"{qid}_{i}_pause.mp3"); silence(p, val); parts.append(p); continue
        voice = FEMALE if spk == "F" else MALE
        raw = os.path.join(tmp, f"{qid}_{i}_raw.mp3")
        await tts(val, voice, raw)
        norm = os.path.join(tmp, f"{qid}_{i}.mp3")          # normalise codec/sr for concat
        ff("-i", raw, "-ar", str(SR), "-ac", "1", "-c:a", "libmp3lame", "-q:a", "4", norm)
        parts.append(norm)
        if i < len(turns) - 1 and turns[i + 1][0] != "PAUSE":
            g = os.path.join(tmp, f"{qid}_{i}_gap.mp3"); silence(g, GAP); parts.append(g)
    lst = os.path.join(tmp, f"{qid}_list.txt")
    with open(lst, "w", encoding="utf-8") as f:
        for p in parts: f.write(f"file '{p}'\n")
    out = os.path.join(OUT, f"{qid}.mp3")
    ff("-f", "concat", "-safe", "0", "-i", lst, "-ar", str(SR), "-ac", "1",
       "-c:a", "libmp3lame", "-q:a", "4", out)
    print(f"  OK  {qid}.mp3  ({os.path.getsize(out)//1024} KB)")

async def main():
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for qid, turns in CLIPS.items():
            await build(qid, turns, tmp)
    print("DONE: listening audio generated in assets/audio/")

if __name__ == "__main__":
    asyncio.run(main())
