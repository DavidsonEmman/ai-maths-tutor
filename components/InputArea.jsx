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
