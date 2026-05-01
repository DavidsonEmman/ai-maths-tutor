        {/* CHAT BUBBLE */}
import TopicPicker from "./TopicPicker";

export default function ChatBubble({
  msg,
  studentName,
  phase,
  chooseTopic,
  renderBubbleText,
}) {
  return (
    <div className={`msg ${msg.role}`}>
      <div className={`avatar ${msg.role}`}>
        {msg.role === "tutor"
          ? "T"
          : studentName
          ? studentName[0].toUpperCase()
          : "S"}
      </div>

      <div className={`bubble ${msg.role} ${msg.type || ""}`}>
        {msg.type === "topic-picker" ? (
          <TopicPicker phase={phase} chooseTopic={chooseTopic} />
        ) : (
          renderBubbleText(msg.text)
        )}
      </div>
    </div>
  );
}
