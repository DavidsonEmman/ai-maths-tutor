import { useState, useEffect, useRef } from "react";

// ─── COLOUR & FONT PALETTE ───────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --ink:     #1a1a2e;
    --chalk:   #f5f0e8;
    --board:   #1d3a2f;
    --gold:    #e8c547;
    --coral:   #e85d4a;
    --mint:    #4caf8a;
    --sky:     #5b9bd5;
    --paper:   #fffdf7;
    --shadow:  rgba(26,26,46,0.18);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--board);
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.04) 27px, rgba(255,255,255,0.04) 28px),
      repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(255,255,255,0.04) 27px, rgba(255,255,255,0.04) 28px);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    color: var(--chalk);
  }

  .app-wrap {
    max-width: 780px;
    margin: 0 auto;
    padding: 24px 16px 48px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── TOP BAR ── */
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgba(232,197,71,0.3);
    padding-bottom: 12px;
  }
  .topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--gold);
    letter-spacing: 0.5px;
  }
  .topbar-sub { font-size: 0.75rem; color: rgba(245,240,232,0.55); margin-top:2px; }
  .session-badge {
    background: rgba(232,197,71,0.12);
    border: 1px solid rgba(232,197,71,0.4);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 0.72rem;
    color: var(--gold);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.5px;
  }

  /* ── CHAT AREA ── */
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 340px;
    max-height: 56vh;
    overflow-y: auto;
    padding: 4px 2px;
    scrollbar-width: thin;
    scrollbar-color: rgba(232,197,71,0.25) transparent;
  }

  /* ── BUBBLES ── */
  .msg { display: flex; gap: 10px; align-items: flex-start; animation: fadeUp 0.3s ease; }
  .msg.tutor { flex-direction: row; }
  .msg.student { flex-direction: row-reverse; }

  @keyframes fadeUp {
    from { opacity:0; transform: translateY(10px); }
    to   { opacity:1; transform: translateY(0); }
  }

  .avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.05rem; font-weight: 700;
  }
  .avatar.tutor { background: var(--gold); color: var(--ink); }
  .avatar.student { background: var(--sky); color: #fff; font-size: 0.8rem; }

  .bubble {
    max-width: 78%;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 0.88rem;
    line-height: 1.6;
    position: relative;
  }
  .bubble.tutor {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-top-left-radius: 4px;
    color: var(--chalk);
  }
  .bubble.student {
    background: var(--sky);
    color: #fff;
    border-top-right-radius: 4px;
  }
  .bubble.correct  { border-left: 3px solid var(--mint); }
  .bubble.wrong    { border-left: 3px solid var(--coral); }
  .bubble.explain  { border-left: 3px solid var(--gold); background: rgba(232,197,71,0.07); }
  .bubble.question { border-left: 3px solid var(--sky); }
  .bubble.summary  { border-left: 3px solid var(--mint); background: rgba(76,175,138,0.07); }

  .bubble strong { color: var(--gold); }
  .bubble .step { margin: 4px 0; padding-left: 10px; border-left: 2px solid rgba(232,197,71,0.3); font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .bubble .label { font-size: 0.7rem; color: rgba(245,240,232,0.45); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }

  /* ── SCORE STRIP ── */
  .score-strip {
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .score-card {
    flex: 1; min-width: 90px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 10px 14px;
    text-align: center;
  }
  .score-card .val { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--gold); }
  .score-card .lbl { font-size: 0.68rem; color: rgba(245,240,232,0.5); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }
  .score-card.good .val  { color: var(--mint); }
  .score-card.bad  .val  { color: var(--coral); }

  /* ── INPUT AREA ── */
  .input-area {
    display: flex; gap: 10px; align-items: stretch;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 16px;
    padding: 8px 10px;
  }
  .input-area input, .input-area select {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--chalk);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    padding: 4px 6px;
  }
  .input-area input::placeholder { color: rgba(245,240,232,0.35); }
  .input-area select option { background: var(--board); color: var(--chalk); }
  .send-btn {
    background: var(--gold);
    color: var(--ink);
    border: none;
    border-radius: 10px;
    padding: 8px 18px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.15s;
    white-space: nowrap;
  }
  .send-btn:hover { opacity: 0.88; transform: scale(0.97); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── TOPIC PICKER ── */
  .topic-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    margin-top: 10px;
  }
  .topic-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    padding: 12px 8px;
    color: var(--chalk);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }
  .topic-btn:hover { background: rgba(232,197,71,0.15); border-color: var(--gold); color: var(--gold); }
  .topic-btn .icon { font-size: 1.3rem; display: block; margin-bottom: 4px; }

  /* ── PROGRESS BAR ── */
  .prog-bar-wrap { margin-top: 6px; }
  .prog-bar-track { height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
  .prog-bar-fill  { height: 100%; border-radius: 3px; background: var(--mint); transition: width 0.4s ease; }
  .prog-lbl { font-size: 0.68rem; color: rgba(245,240,232,0.4); margin-top: 3px; text-align: right; }

  /* ── WEAK TAGS ── */
  .weak-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .weak-tag { background: rgba(232,93,74,0.18); border: 1px solid rgba(232,93,74,0.4); border-radius: 20px; padding: 2px 10px; font-size: 0.7rem; color: var(--coral); }
  .strong-tag { background: rgba(76,175,138,0.18); border: 1px solid rgba(76,175,138,0.4); border-radius: 20px; padding: 2px 10px; font-size: 0.7rem; color: var(--mint); }

  .typing { opacity: 0.55; font-style: italic; font-size: 0.8rem; }
  .divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 4px 0; }
`;

// ─── QUESTION ENGINE ──────────────────────────────────────────────────────────
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function generateQuestion(topic, difficulty) {
  const d = difficulty; // 1=easy 2=med 3=hard
  const lim = d === 1 ? [1,12] : d === 2 ? [10,50] : [50,200];
  const [lo, hi] = lim;

  switch (topic) {
    case "Addition": {
      const a = rand(lo, hi), b = rand(lo, hi);
      return { q: `${a} + ${b}`, answer: a + b, steps: [`${a} + ${b} = ${a + b}`], type: "Addition" };
    }
    case "Subtraction": {
      const a = rand(lo + 5, hi), b = rand(lo, a);
      return { q: `${a} − ${b}`, answer: a - b, steps: [`${a} − ${b} = ${a - b}`], type: "Subtraction" };
    }
    case "Multiplication": {
      const a = d === 1 ? rand(1,12) : rand(2,20), b = d === 1 ? rand(1,12) : rand(2,15);
      return { q: `${a} × ${b}`, answer: a * b, steps: [`${a} × ${b} = ${a * b}`, `(Think: ${a} added ${b} times)`], type: "Multiplication" };
    }
    case "Division": {
      const b = d === 1 ? rand(1,10) : rand(2,15), a = b * rand(1, d === 1 ? 10 : 20);
      return { q: `${a} ÷ ${b}`, answer: a / b, steps: [`${a} ÷ ${b} = ${a / b}`, `Check: ${b} × ${a / b} = ${a} ✓`], type: "Division" };
    }
    case "Fractions": {
      const denom = d === 1 ? rand(2,6) : rand(2,12);
      const n1 = rand(1, denom - 1), n2 = rand(1, denom - 1);
      const num = n1 + n2, gcd = (a, b) => b ? gcd(b, a % b) : a, g = gcd(num, denom);
      const ans = `${num/g}/${denom/g}`;
      return {
        q: `${n1}/${denom} + ${n2}/${denom}`,
        answer: num / denom,
        answerDisplay: ans,
        steps: [
          `Same denominator: ${denom}`,
          `Add the numerators: ${n1} + ${n2} = ${num}`,
          `Result: ${num}/${denom}${g > 1 ? ` → simplified: ${ans}` : ""}`
        ],
        type: "Fractions",
        isText: true,
        textAnswer: ans,
        checkFn: (s) => {
          const clean = s.replace(/\s/g,"");
          if (clean === ans) return true;
          if (clean === `${num}/${denom}`) return true;
          const parts = clean.split("/");
          if (parts.length === 2) {
            const top = parseInt(parts[0]), bot = parseInt(parts[1]);
            if (!isNaN(top) && !isNaN(bot) && bot !== 0) return Math.abs(top/bot - num/denom) < 0.001;
          }
          return Math.abs(parseFloat(clean) - num/denom) < 0.001;
        }
      };
    }
    case "Equations": {
      const b = rand(1, d === 1 ? 10 : 30), coef = d === 1 ? 1 : rand(2, d === 2 ? 6 : 12);
      const rhs = rand(b + 1, b + coef * (d === 1 ? 10 : 30));
      const x = (rhs - b) / coef;
      if (!Number.isInteger(x) || x <= 0) return generateQuestion(topic, difficulty);
      const qStr = coef === 1 ? `x + ${b} = ${rhs}` : `${coef}x + ${b} = ${rhs}`;
      return {
        q: `Solve: ${qStr}`,
        answer: x,
        steps: [
          `${coef === 1 ? "x" : `${coef}x`} + ${b} = ${rhs}`,
          `${coef === 1 ? "x" : `${coef}x`} = ${rhs} − ${b} = ${rhs - b}`,
          coef > 1 ? `x = ${rhs - b} ÷ ${coef} = ${x}` : `x = ${x}`
        ],
        type: "Equations"
      };
    }
    default: return generateQuestion("Addition", difficulty);
  }
}

function genSimilar(q, difficulty) {
  return generateQuestion(q.type, difficulty);
}

// ─── EXPLANATION ENGINE ───────────────────────────────────────────────────────
function buildExplanation(q) {
  const lines = [];
  lines.push(`Let me walk you through **${q.q}**:`);
  q.steps.forEach((s, i) => lines.push(`Step ${i + 1}: ${s}`));
  lines.push(`Answer: **${q.answerDisplay || q.answer}**`);
  return lines;
}

// ─── FEEDBACK LINES ───────────────────────────────────────────────────────────
const CORRECT_LINES = [
  "Excellent work! You understood that operation perfectly.",
  "Correct! Clear thinking — well done.",
  "That's right! Your reasoning is sharp.",
  "Perfect. You're handling this level with confidence.",
  "Correct! Keep that momentum going.",
];
const WRONG_LINES = [
  "Not quite. Let me show you how to approach this.",
  "That isn't the right answer. Here is the correct method.",
  "Close, but not correct. Let's fix the mistake together.",
  "Incorrect — but don't worry. Let's work through it step by step.",
  "Not this time. Here is how it should be solved.",
];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ─── TOPICS ───────────────────────────────────────────────────────────────────
const TOPICS = [
  { name: "Addition",       icon: "➕" },
  { name: "Subtraction",    icon: "➖" },
  { name: "Multiplication", icon: "✖️" },
  { name: "Division",       icon: "➗" },
  { name: "Fractions",      icon: "½" },
  { name: "Equations",      icon: "⚖️" },
];

// ─── PHASES ───────────────────────────────────────────────────────────────────
const PHASE = {
  WELCOME: "welcome",
  ASK_CLASS: "ask_class",
  ASK_TOPIC: "ask_topic",
  ASK_COUNT: "ask_count",
  QUESTIONING: "questioning",
  AWAITING_ANS: "awaiting_ans",
  SIMILAR: "similar",
  AWAITING_SIMILAR: "awaiting_similar",
  SUMMARY: "summary",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function pct(c, t) { return t === 0 ? 0 : Math.round((c / t) * 100); }

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function MathsAITeacher() {
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState(PHASE.WELCOME);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);

  // student state
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [topic, setTopic] = useState("");
  const [totalQ, setTotalQ] = useState(0);
  const [qDone, setQDone] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [streak, setStreak] = useState(0);        // consecutive correct
  const [failStreak, setFailStreak] = useState(0); // consecutive wrong

  // current question
  const [currentQ, setCurrentQ] = useState(null);
  const [isSimilar, setIsSimilar] = useState(false);

  // tracking
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [topicStats, setTopicStats] = useState({});

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // kick off on mount
  useEffect(() => {
    delay(() => {
      pushTutor("Welcome to your personal Maths Classroom. 📚", "");
      delay(() => {
        pushTutor("I am your AI Maths Teacher. I will ask you questions, explain your mistakes, and help you improve.", "");
        delay(() => {
          pushTutor("Let's start. **What is your name?**", "");
          setPhase(PHASE.WELCOME);
        }, 900);
      }, 700);
    }, 400);
  }, []);

  function delay(fn, ms) { setTimeout(fn, ms); }

  function pushTutor(text, type = "") {
    setMessages(m => [...m, { role: "tutor", text, type }]);
  }
  function pushStudent(text) {
    setMessages(m => [...m, { role: "student", text }]);
  }
  function pushTopicPicker() {
    setMessages(m => [...m, { role: "tutor", text: "Choose a maths topic:", type: "topic-picker" }]);
  }

  function handleSend() {
    const val = input.trim();
    if (!val || waiting) return;
    setInput("");
    setWaiting(true);
    pushStudent(val);
    delay(() => processInput(val), 500);
  }

  function processInput(val) {
    setWaiting(false);
    switch (phase) {
      case PHASE.WELCOME: {
        const name = val.charAt(0).toUpperCase() + val.slice(1);
        setStudentName(name);
        pushTutor(`Welcome, **${name}**! Great to have you here.`, "");
        delay(() => {
          pushTutor("Which **class or level** are you in? (e.g. Grade 5, Year 8, JSS2…)", "");
          setPhase(PHASE.ASK_CLASS);
        }, 500);
        break;
      }
      case PHASE.ASK_CLASS: {
        setStudentClass(val);
        pushTutor(`${val} — noted. Now, **which maths topic** would you like to practise today?`, "");
        delay(() => { pushTopicPicker(); setPhase(PHASE.ASK_TOPIC); }, 300);
        break;
      }
      case PHASE.ASK_COUNT: {
        const n = parseInt(val);
        if (isNaN(n) || n < 1 || n > 50) {
          pushTutor("Please enter a number between 1 and 50.", "");
          setWaiting(false);
          return;
        }
        setTotalQ(n);
        pushTutor(`Perfect. I will ask you **${n} ${topic} question${n > 1 ? "s" : ""}**. Let's begin! 🎯`, "");
        delay(() => askQuestion(topic, 1, 0, false), 600);
        break;
      }
      case PHASE.AWAITING_ANS: {
        checkAnswer(val, false);
        break;
      }
      case PHASE.AWAITING_SIMILAR: {
        checkAnswer(val, true);
        break;
      }
      default: break;
    }
  }

  function chooseTopic(t) {
    setTopic(t);
    pushStudent(t);
    delay(() => {
      pushTutor(`${t} — excellent choice. **How many questions** would you like to answer?`, "");
      setPhase(PHASE.ASK_COUNT);
    }, 400);
  }

  function askQuestion(t, diff, doneCount, isSim) {
    const q = isSim ? genSimilar(currentQ, diff) : generateQuestion(t, diff);
    setCurrentQ(q);
    setIsSimilar(isSim);
    const num = doneCount + 1;
    if (!isSim) {
      pushTutor(
        isSim ? "" : `**Question ${num}:** What is ${q.q}?`,
        "question"
      );
      setPhase(PHASE.AWAITING_ANS);
    } else {
      pushTutor(`Now try this similar one: **${q.q}** — what is the answer?`, "question");
      setPhase(PHASE.AWAITING_SIMILAR);
    }
  }

  function checkAnswer(val, isSim) {
    const q = currentQ;
    let isCorrect = false;
    if (q.checkFn) {
      isCorrect = q.checkFn(val);
    } else {
      const parsed = parseFloat(val.replace(/\s/g, ""));
      isCorrect = !isNaN(parsed) && Math.abs(parsed - q.answer) < 0.001;
    }

    const newDone = isSim ? qDone : qDone + 1;
    if (!isSim) setQDone(newDone);

    // update stats
    const topKey = q.type;
    setTopicStats(prev => {
      const cur = prev[topKey] || { c: 0, w: 0 };
      return { ...prev, [topKey]: isCorrect ? { c: cur.c + 1, w: cur.w } : { c: cur.c, w: cur.w + 1 } };
    });

    let newStreak = streak, newFail = failStreak, newDiff = difficulty;
    if (isCorrect) {
      setCorrect(c => c + 1);
      setStreak(s => s + 1); newStreak++;
      setFailStreak(0); newFail = 0;
      if (newStreak >= 3 && newDiff < 3) {
        newDiff = newDiff + 1;
        setDifficulty(newDiff);
        pushTutor(`${pick(CORRECT_LINES)} 🌟`, "correct");
        delay(() => pushTutor("You're on a streak! I'm raising the difficulty a little. 📈", ""), 400);
      } else {
        pushTutor(`${pick(CORRECT_LINES)} ✅`, "correct");
      }
    } else {
      setWrong(w => w + 1);
      setStreak(0); newStreak = 0;
      setFailStreak(f => f + 1); newFail++;
      if (newFail >= 2 && newDiff > 1) {
        newDiff = newDiff - 1;
        setDifficulty(newDiff);
      }
      pushTutor(`${pick(WRONG_LINES)}`, "wrong");
      delay(() => {
        const expLines = buildExplanation(q);
        expLines.forEach((line, i) => {
          delay(() => pushTutor(line, i === 0 ? "explain" : "explain"), i * 200);
        });
        // similar question after wrong — but not after a similar question
        if (!isSim) {
          delay(() => {
            pushTutor("Let's test if that clicked. Try this similar question:", "");
            delay(() => askQuestion(q.type, newDiff, newDone, true), 300);
          }, expLines.length * 200 + 400);
        }
      }, 400);
    }

    // decide next step
    if (isCorrect || isSim) {
      delay(() => {
        if (newDone >= totalQ) {
          delay(() => showSummary(newDone, isCorrect ? correct + 1 : correct, isCorrect ? wrong : wrong + 1), 600);
        } else {
          delay(() => {
            askQuestion(topic, newDiff, newDone, false);
          }, isSim ? 1000 : 800);
        }
      }, isCorrect ? 700 : (isSim ? 3200 : 0));
    }
  }

  function showSummary(done, cor, wrg) {
    const percentage = pct(cor, done);
    const grade = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : percentage >= 40 ? "Fair" : "Needs Work";
    const emoji = percentage >= 80 ? "🏆" : percentage >= 60 ? "🎯" : percentage >= 40 ? "📝" : "💪";

    const weakTopics = Object.entries(topicStats).filter(([, v]) => pct(v.c, v.c + v.w) < 50).map(([k]) => k);
    const strongTopics = Object.entries(topicStats).filter(([, v]) => pct(v.c, v.c + v.w) >= 70).map(([k]) => k);

    pushTutor("─────────────────────────────────", "");
    pushTutor(`**Session Complete!** ${emoji}`, "summary");
    delay(() => {
      pushTutor(
        `Today you answered **${done} question${done > 1 ? "s" : ""}** in **${topic}**. You got **${cor} correct** and **${wrg} wrong**. Your score: **${percentage}%** — ${grade}.`,
        "summary"
      );
      delay(() => {
        if (weakTopics.length) {
          pushTutor(`You need more practice with: **${weakTopics.join(", ")}**. Consider doing another session focused on these areas.`, "wrong");
        }
        if (strongTopics.length) {
          pushTutor(`You showed strength in: **${strongTopics.join(", ")}**. Keep it up! 💚`, "correct");
        }
        delay(() => {
          pushTutor(
            `Recommendation: ${percentage < 50
              ? `Focus on ${topic} at basic level. Review your fundamentals.`
              : percentage < 80
              ? `Good progress! Try harder questions next time.`
              : `Exceptional! You are ready to move to a more advanced topic.`}`,
            "summary"
          );
          setPhase(PHASE.SUMMARY);
        }, 600);
      }, 600);
    }, 400);
  }

  const showTopicPicker = phase === PHASE.ASK_TOPIC;
  const totalAttempted = correct + wrong;
  const percentage = pct(correct, totalAttempted);
  const progress = totalQ > 0 ? pct(qDone, totalQ) : 0;

  const diffLabel = difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard";

  return (
    <>
      <style>{CSS}</style>
      <div className="app-wrap">

        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">🖊 Maths AI Teacher</div>
            <div className="topbar-sub">Adaptive · Explanatory · Personal</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            {studentName && <div className="session-badge">{studentName}{studentClass ? ` · ${studentClass}` : ""}</div>}
            {topic && <div className="session-badge">{topic} · {diffLabel}</div>}
          </div>
        </div>

        {/* SCORE STRIP */}
        {totalAttempted > 0 && (
          <div className="score-strip">
            <div className={`score-card ${percentage >= 70 ? "good" : percentage >= 40 ? "" : "bad"}`}>
              <div className="val">{percentage}%</div>
              <div className="lbl">Score</div>
            </div>
            <div className="score-card good">
              <div className="val">{correct}</div>
              <div className="lbl">Correct</div>
            </div>
            <div className="score-card bad">
              <div className="val">{wrong}</div>
              <div className="lbl">Wrong</div>
            </div>
            <div className="score-card">
              <div className="val">{totalAttempted}</div>
              <div className="lbl">Attempted</div>
            </div>
          </div>
        )}

        {/* PROGRESS BAR */}
        {totalQ > 0 && phase !== PHASE.SUMMARY && (
          <div className="prog-bar-wrap">
            <div className="prog-bar-track">
              <div className="prog-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="prog-lbl">{qDone}/{totalQ} questions completed</div>
          </div>
        )}

        {/* CHAT AREA */}
        <div className="chat-area">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>
                {msg.role === "tutor" ? "T" : (studentName ? studentName[0].toUpperCase() : "S")}
              </div>
              <div className={`bubble ${msg.role} ${msg.type || ""}`}>
                {msg.type === "topic-picker"
                  ? (
                    <>
                      <div style={{ marginBottom: 8 }}>Choose a maths topic:</div>
                      <div className="topic-grid">
                        {TOPICS.map(t => (
                          <button key={t.name} className="topic-btn" onClick={() => { if (phase === PHASE.ASK_TOPIC) chooseTopic(t.name); }}>
                            <span className="icon">{t.icon}</span>
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )
                  : renderBubbleText(msg.text)
                }
              </div>
            </div>
          ))}
          {waiting && (
            <div className="msg tutor">
              <div className="avatar tutor">T</div>
              <div className="bubble tutor"><span className="typing">thinking…</span></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT AREA */}
        {phase !== PHASE.SUMMARY && phase !== PHASE.ASK_TOPIC && (
          <div className="input-area">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={
                phase === PHASE.WELCOME ? "Type your name…"
                : phase === PHASE.ASK_CLASS ? "Type your class or level…"
                : phase === PHASE.ASK_COUNT ? "Number of questions…"
                : "Type your answer…"
              }
              disabled={waiting}
            />
            <button className="send-btn" onClick={handleSend} disabled={waiting || !input.trim()}>
              Send
            </button>
          </div>
        )}

        {phase === PHASE.SUMMARY && (
          <button
            className="send-btn"
            style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: "0.95rem" }}
            onClick={() => {
              setMessages([]); setPhase(PHASE.WELCOME); setStudentName(""); setStudentClass("");
              setTopic(""); setTotalQ(0); setQDone(0); setCorrect(0); setWrong(0);
              setStreak(0); setFailStreak(0); setDifficulty(1); setTopicStats({}); setCurrentQ(null);
              delay(() => {
                pushTutor("Welcome back! Let's start a new session. **What is your name?**", "");
                setPhase(PHASE.WELCOME);
              }, 300);
            }}
          >
            🔄 Start New Session
          </button>
        )}

      </div>
    </>
  );
}

// ─── RENDER BOLD TEXT ─────────────────────────────────────────────────────────
function renderBubbleText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p
      )}
    </span>
  );
}
