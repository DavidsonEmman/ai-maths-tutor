        {/* RESTART BUTTON */}
import { PHASE } from "../constants/phases";

export default function RestartButton({ phase, restartSession }) {
  if (phase !== PHASE.SUMMARY) return null;

  return (
    <button
      className="send-btn"
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: 12,
        fontSize: "0.95rem",
      }}
      onClick={restartSession}
    >
      🔄 Start New Session
    </button>
  );
}
