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
