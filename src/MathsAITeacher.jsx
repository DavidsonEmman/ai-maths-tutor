import { useState, useEffect, useRef } from "react";

import { CSS } from "./styles/mathsteacherstyles";

import { PHASE } from "./constants/phases";
import { CORRECT_LINES, WRONG_LINES, pick } from "./data/feedbackLines";

import { pct, delay } from "./logic/helpers";
import { generateQuestion, genSimilar } from "./logic/questionengine";
import { buildExplanation } from "./logic/explanationengine";
import { checkAnswer as validateAnswer } from "./logic/answerchecker";

import TopBar from "./components/TopBar";
import ScoreStrip from "./components/ScoreStrip";
import ProgressBar from "./components/ProgressBar";
import ChatArea from "./components/ChatArea";
import InputArea from "./components/InputArea";
import RestartButton from "./components/RestartButton";

export default function SmartMathsTeacher() {
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState(PHASE.WELCOME);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [topic, setTopic] = useState("");
  const [totalQ, setTotalQ] = useState(0);
  const [qDone, setQDone] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [streak, setStreak] = useState(0);
  const [failStreak, setFailStreak] = useState(0);

  const [currentQ, setCurrentQ] = useState(null);

  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [topicStats, setTopicStats] = useState({});

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    delay(() => {
      pushTutor("Welcome to your personal Maths Classroom. 📚", "");

      delay(() => {
        pushTutor(
          "I am your Smart Maths Teacher. I will ask you questions, explain your mistakes, and help you improve.",
          ""
        );

        delay(() => {
          pushTutor("Let's start. **What is your name?**", "");
          setPhase(PHASE.WELCOME);
        }, 900);
      }, 700);
    }, 400);
  }, []);

  function pushTutor(text, type = "") {
    setMessages((messages) => [...messages, { role: "tutor", text, type }]);
  }

  function pushStudent(text) {
    setMessages((messages) => [...messages, { role: "student", text }]);
  }

  function pushTopicPicker() {
    setMessages((messages) => [
      ...messages,
      { role: "tutor", text: "Choose a maths topic:", type: "topic-picker" },
    ]);
  }

  function handleSend() {
    const value = input.trim();

    if (!value || waiting) return;

    setInput("");
    setWaiting(true);
    pushStudent(value);

    delay(() => processInput(value), 500);
  }

  function processInput(value) {
    setWaiting(false);

    switch (phase) {
      case PHASE.WELCOME: {
        const name = value.charAt(0).toUpperCase() + value.slice(1);

        setStudentName(name);
        pushTutor(`Welcome, **${name}**! Great to have you here.`, "");

        delay(() => {
          pushTutor(
            "Which **class or level** are you in? (e.g. Grade 5, Year 8, JSS2…)",
            ""
          );
          setPhase(PHASE.ASK_CLASS);
        }, 500);

        break;
      }

      case PHASE.ASK_CLASS: {
        setStudentClass(value);

        pushTutor(
          `${value} — noted. Now, **which maths topic** would you like to practise today?`,
          ""
        );

        delay(() => {
          pushTopicPicker();
          setPhase(PHASE.ASK_TOPIC);
        }, 300);

        break;
      }

      case PHASE.ASK_COUNT: {
        const n = parseInt(value);

        if (isNaN(n) || n < 1 || n > 50) {
          pushTutor("Please enter a number between 1 and 50.", "");
          setWaiting(false);
          return;
        }

        setTotalQ(n);

        pushTutor(
          `Perfect. I will ask you **${n} ${topic} question${n > 1 ? "s" : ""}**. Let's begin! 🎯`,
          ""
        );

        delay(() => askQuestion(topic, 1, 0, false), 600);
        break;
      }

      case PHASE.AWAITING_ANS:
        checkAnswer(value, false);
        break;

      case PHASE.AWAITING_SIMILAR:
        checkAnswer(value, true);
        break;

      default:
        break;
    }
  }

  function chooseTopic(selectedTopic) {
    setTopic(selectedTopic);
    pushStudent(selectedTopic);

    delay(() => {
      pushTutor(
        `${selectedTopic} — excellent choice. **How many questions** would you like to answer?`,
        ""
      );
      setPhase(PHASE.ASK_COUNT);
    }, 400);
  }

  function askQuestion(selectedTopic, selectedDifficulty, doneCount, isSimilar) {
    const question = isSimilar
      ? genSimilar(currentQ, selectedDifficulty)
      : generateQuestion(selectedTopic, selectedDifficulty);

    setCurrentQ(question);

    const questionNumber = doneCount + 1;

    if (!isSimilar) {
      pushTutor(`**Question ${questionNumber}:** What is ${question.q}?`, "question");
      setPhase(PHASE.AWAITING_ANS);
    } else {
      pushTutor(
        `Now try this similar one: **${question.q}** — what is the answer?`,
        "question"
      );
      setPhase(PHASE.AWAITING_SIMILAR);
    }
  }

  function checkAnswer(value, isSimilar) {
    const question = currentQ;
    const isCorrect = validateAnswer(value, question);

    const newDone = isSimilar ? qDone : qDone + 1;

    if (!isSimilar) setQDone(newDone);

    const topicKey = question.type;

    setTopicStats((previousStats) => {
      const currentStats = previousStats[topicKey] || { c: 0, w: 0 };

      return {
        ...previousStats,
        [topicKey]: isCorrect
          ? { c: currentStats.c + 1, w: currentStats.w }
          : { c: currentStats.c, w: currentStats.w + 1 },
      };
    });

    let newStreak = streak;
    let newFailStreak = failStreak;
    let newDifficulty = difficulty;

    if (isCorrect) {
      setCorrect((correct) => correct + 1);

      newStreak++;
      newFailStreak = 0;

      setStreak(newStreak);
      setFailStreak(0);

      if (newStreak >= 3 && newDifficulty < 3) {
        newDifficulty++;
        setDifficulty(newDifficulty);

        pushTutor(`${pick(CORRECT_LINES)} 🌟`, "correct");

        delay(() => {
          pushTutor("You're on a streak! I'm raising the difficulty a little. 📈", "");
        }, 400);
      } else {
        pushTutor(`${pick(CORRECT_LINES)} ✅`, "correct");
      }
    } else {
      setWrong((wrong) => wrong + 1);

      newStreak = 0;
      newFailStreak++;

      setStreak(0);
      setFailStreak(newFailStreak);

      if (newFailStreak >= 2 && newDifficulty > 1) {
        newDifficulty--;
        setDifficulty(newDifficulty);
      }

      pushTutor(`${pick(WRONG_LINES)}`, "wrong");

      delay(() => {
        const explanationLines = buildExplanation(question);

        explanationLines.forEach((line, index) => {
          delay(() => pushTutor(line, "explain"), index * 200);
        });

        if (!isSimilar) {
          delay(() => {
            pushTutor("Let's test if that clicked. Try this similar question:", "");

            delay(() => {
              askQuestion(question.type, newDifficulty, newDone, true);
            }, 300);
          }, explanationLines.length * 200 + 400);
        }
      }, 400);
    }

    if (isCorrect || isSimilar) {
      delay(() => {
        if (newDone >= totalQ) {
          delay(() => {
            showSummary(
              newDone,
              isCorrect ? correct + 1 : correct,
              isCorrect ? wrong : wrong + 1
            );
          }, 600);
        } else {
          delay(() => {
            askQuestion(topic, newDifficulty, newDone, false);
          }, isSimilar ? 1000 : 800);
        }
      }, isCorrect ? 700 : isSimilar ? 3200 : 0);
    }
  }

  function showSummary(done, correctCount, wrongCount) {
    const percentage = pct(correctCount, done);

    const grade =
      percentage >= 80
        ? "Excellent"
        : percentage >= 60
        ? "Good"
        : percentage >= 40
        ? "Fair"
        : "Needs Work";

    const emoji =
      percentage >= 80
        ? "🏆"
        : percentage >= 60
        ? "🎯"
        : percentage >= 40
        ? "📝"
        : "💪";

    const weakTopics = Object.entries(topicStats)
      .filter(([, value]) => pct(value.c, value.c + value.w) < 50)
      .map(([key]) => key);

    const strongTopics = Object.entries(topicStats)
      .filter(([, value]) => pct(value.c, value.c + value.w) >= 70)
      .map(([key]) => key);

    pushTutor("─────────────────────────────────", "");
    pushTutor(`**Session Complete!** ${emoji}`, "summary");

    delay(() => {
      pushTutor(
        `Today you answered **${done} question${done > 1 ? "s" : ""}** in **${topic}**. You got **${correctCount} correct** and **${wrongCount} wrong**. Your score: **${percentage}%** — ${grade}.`,
        "summary"
      );

      delay(() => {
        if (weakTopics.length) {
          pushTutor(
            `You need more practice with: **${weakTopics.join(", ")}**. Consider doing another session focused on these areas.`,
            "wrong"
          );
        }

        if (strongTopics.length) {
          pushTutor(
            `You showed strength in: **${strongTopics.join(", ")}**. Keep it up! 💚`,
            "correct"
          );
        }

        delay(() => {
          pushTutor(
            `Recommendation: ${
              percentage < 50
                ? `Focus on ${topic} at basic level. Review your fundamentals.`
                : percentage < 80
                ? `Good progress! Try harder questions next time.`
                : `Exceptional! You are ready to move to a more advanced topic.`
            }`,
            "summary"
          );

          setPhase(PHASE.SUMMARY);
        }, 600);
      }, 600);
    }, 400);
  }

  function restartSession() {
    setMessages([]);
    setPhase(PHASE.WELCOME);
    setInput("");
    setWaiting(false);

    setStudentName("");
    setStudentClass("");
    setTopic("");
    setTotalQ(0);
    setQDone(0);
    setDifficulty(1);
    setStreak(0);
    setFailStreak(0);

    setCurrentQ(null);

    setCorrect(0);
    setWrong(0);
    setTopicStats({});

    delay(() => {
      pushTutor("Welcome back! Let's start a new session. **What is your name?**", "");
      setPhase(PHASE.WELCOME);
    }, 300);
  }

  const totalAttempted = correct + wrong;
  const percentage = pct(correct, totalAttempted);
  const progress = totalQ > 0 ? pct(qDone, totalQ) : 0;
  const diffLabel =
    difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard";

  return (
    <>
      <style>{CSS}</style>

      <div className="app-wrap">
        <TopBar
          studentName={studentName}
          studentClass={studentClass}
          topic={topic}
          diffLabel={diffLabel}
        />

        <ScoreStrip
          totalAttempted={totalAttempted}
          percentage={percentage}
          correct={correct}
          wrong={wrong}
        />

        <ProgressBar
          totalQ={totalQ}
          qDone={qDone}
          progress={progress}
          phase={phase}
        />

        <ChatArea
          messages={messages}
          waiting={waiting}
          bottomRef={bottomRef}
          studentName={studentName}
          phase={phase}
          chooseTopic={chooseTopic}
          renderBubbleText={renderBubbleText}
        />

        <InputArea
          phase={phase}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          waiting={waiting}
        />

        <RestartButton phase={phase} restartSession={restartSession} />
      </div>
    </>
  );
}

function renderBubbleText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </span>
  );
}
