        {/* TOPIC PICKER */}
import { TOPICS } from "../data/topics";
import { PHASE } from "../constants/phases";

export default function TopicPicker({ phase, chooseTopic }) {
  return (
    <>
      <div style={{ marginBottom: 8 }}>Choose a maths topic:</div>

      <div className="topic-grid">
        {TOPICS.map((topic) => (
          <button
            key={topic.name}
            className="topic-btn"
            onClick={() => {
              if (phase === PHASE.ASK_TOPIC) chooseTopic(topic.name);
            }}
          >
            <span className="icon">{topic.icon}</span>
            {topic.name}
          </button>
        ))}
      </div>
    </>
  );
}
