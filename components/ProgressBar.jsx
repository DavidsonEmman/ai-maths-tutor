
        {/* PROGRESS BAR */}
        {totalQ > 0 && phase !== PHASE.SUMMARY && (
          <div className="prog-bar-wrap">
            <div className="prog-bar-track">
              <div className="prog-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="prog-lbl">{qDone}/{totalQ} questions completed</div>
          </div>
        )}
