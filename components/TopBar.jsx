        {/* TOP BAR */}
export default function TopBar({ studentName, studentClass, topic, diffLabel }) {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">🖊 Smart Maths Teacher</div>
        <div className="topbar-sub">Adaptive · Explanatory · Personal</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        {studentName && (
          <div className="session-badge">
            {studentName}{studentClass ? ` · ${studentClass}` : ""}
          </div>
        )}

        {topic && (
          <div className="session-badge">
            {topic} · {diffLabel}
          </div>
        )}
      </div>
    </div>
  );
}
