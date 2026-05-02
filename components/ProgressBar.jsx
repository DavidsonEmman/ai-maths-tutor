
        {/* PROGRESS BAR */}
import { PHASE } from "../constants/phases";

export default function ProgressBar({ totalQ, qDone, progress, phase }) {
  if (totalQ <= 0 || phase === PHASE.SUMMARY) return null;

  return (
    <div className="prog-bar-wrap">
      <div className="prog-bar-track">
        <div className="prog-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="prog-lbl">
        {qDone}/{totalQ} questions completed
      </div>
    </div>
  );
}
