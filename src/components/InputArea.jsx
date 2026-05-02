import { PHASE } from "../constants/phases";

export default function InputArea({
  phase,
  input,
  setInput,
  handleSend,
  waiting,
}) {
  if (phase === PHASE.SUMMARY || phase === PHASE.ASK_TOPIC) return null;

  const placeholder =
    phase === PHASE.WELCOME
      ? "Type your name…"
      : phase === PHASE.ASK_CLASS
      ? "Type your class or level…"
      : phase === PHASE.ASK_COUNT
      ? "Number of questions…"
      : "Type your answer…";

  return (
    <div className="input-area">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder={placeholder}
        disabled={waiting}
      />

      <button
        className="send-btn"
        onClick={handleSend}
        disabled={waiting || !input.trim()}
      >
        Send
      </button>
    </div>
  );
}