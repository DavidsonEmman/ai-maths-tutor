import ChatBubble from "./ChatBubble";

export default function ChatArea({
  messages,
  waiting,
  bottomRef,
  studentName,
  phase,
  chooseTopic,
  renderBubbleText,
}) {
  return (
    <div className="chat-area">
      {messages.map((msg, index) => (
        <ChatBubble
          key={index}
          msg={msg}
          studentName={studentName}
          phase={phase}
          chooseTopic={chooseTopic}
          renderBubbleText={renderBubbleText}
        />
      ))}

      {waiting && (
        <div className="msg tutor">
          <div className="avatar tutor">T</div>
          <div className="bubble tutor">
            <span className="typing">thinking…</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}