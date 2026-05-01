        {/* SCORE STRIP */}
        {totalAttempted > 0 && (
          <div className="score-strip">
            <div className={`score-card ${percentage >= 70 ? "good" : percentage >= 40 ? "" : "bad"}`}>
              <div className="val">{percentage}%</div>
              <div className="lbl">Score</div>
            </div>
            <div className="score-card good">
              <div className="val">{correct}</div>
              <div className="lbl">Correct</div>
            </div>
            <div className="score-card bad">
              <div className="val">{wrong}</div>
              <div className="lbl">Wrong</div>
            </div>
            <div className="score-card">
              <div className="val">{totalAttempted}</div>
              <div className="lbl">Attempted</div>
            </div>
          </div>
        )}
