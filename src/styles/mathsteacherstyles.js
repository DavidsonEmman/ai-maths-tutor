export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --ink:     #1a1a2e;
    --chalk:   #f5f0e8;
    --board:   #1d3a2f;
    --gold:    #e8c547;
    --coral:   #e85d4a;
    --mint:    #4caf8a;
    --sky:     #5b9bd5;
    --paper:   #fffdf7;
    --shadow:  rgba(26,26,46,0.18);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--board);
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.04) 27px, rgba(255,255,255,0.04) 28px),
      repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(255,255,255,0.04) 27px, rgba(255,255,255,0.04) 28px);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    color: var(--chalk);
  }

  .app-wrap {
    max-width: 780px;
    margin: 0 auto;
    padding: 24px 16px 48px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── TOP BAR ── */
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgba(232,197,71,0.3);
    padding-bottom: 12px;
  }
  .topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--gold);
    letter-spacing: 0.5px;
  }
  .topbar-sub { font-size: 0.75rem; color: rgba(245,240,232,0.55); margin-top:2px; }
  .session-badge {
    background: rgba(232,197,71,0.12);
    border: 1px solid rgba(232,197,71,0.4);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 0.72rem;
    color: var(--gold);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.5px;
  }

  /* ── CHAT AREA ── */
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 340px;
    max-height: 56vh;
    overflow-y: auto;
    padding: 4px 2px;
    scrollbar-width: thin;
    scrollbar-color: rgba(232,197,71,0.25) transparent;
  }

  /* ── BUBBLES ── */
  .msg { display: flex; gap: 10px; align-items: flex-start; animation: fadeUp 0.3s ease; }
  .msg.tutor { flex-direction: row; }
  .msg.student { flex-direction: row-reverse; }

  @keyframes fadeUp {
    from { opacity:0; transform: translateY(10px); }
    to   { opacity:1; transform: translateY(0); }
  }

  .avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.05rem; font-weight: 700;
  }
  .avatar.tutor { background: var(--gold); color: var(--ink); }
  .avatar.student { background: var(--sky); color: #fff; font-size: 0.8rem; }

  .bubble {
    max-width: 78%;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 0.88rem;
    line-height: 1.6;
    position: relative;
  }
  .bubble.tutor {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-top-left-radius: 4px;
    color: var(--chalk);
  }
  .bubble.student {
    background: var(--sky);
    color: #fff;
    border-top-right-radius: 4px;
  }
  .bubble.correct  { border-left: 3px solid var(--mint); }
  .bubble.wrong    { border-left: 3px solid var(--coral); }
  .bubble.explain  { border-left: 3px solid var(--gold); background: rgba(232,197,71,0.07); }
  .bubble.question { border-left: 3px solid var(--sky); }
  .bubble.summary  { border-left: 3px solid var(--mint); background: rgba(76,175,138,0.07); }

  .bubble strong { color: var(--gold); }
  .bubble .step { margin: 4px 0; padding-left: 10px; border-left: 2px solid rgba(232,197,71,0.3); font-family: 'DM Mono', monospace; font-size: 0.82rem; }
  .bubble .label { font-size: 0.7rem; color: rgba(245,240,232,0.45); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }

  /* ── SCORE STRIP ── */
  .score-strip {
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .score-card {
    flex: 1; min-width: 90px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 10px 14px;
    text-align: center;
  }
  .score-card .val { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--gold); }
  .score-card .lbl { font-size: 0.68rem; color: rgba(245,240,232,0.5); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }
  .score-card.good .val  { color: var(--mint); }
  .score-card.bad  .val  { color: var(--coral); }

  /* ── INPUT AREA ── */
  .input-area {
    display: flex; gap: 10px; align-items: stretch;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 16px;
    padding: 8px 10px;
  }
  .input-area input, .input-area select {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--chalk);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    padding: 4px 6px;
  }
  .input-area input::placeholder { color: rgba(245,240,232,0.35); }
  .input-area select option { background: var(--board); color: var(--chalk); }
  .send-btn {
    background: var(--gold);
    color: var(--ink);
    border: none;
    border-radius: 10px;
    padding: 8px 18px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: transform 0.1s, opacity 0.15s;
    white-space: nowrap;
  }
  .send-btn:hover { opacity: 0.88; transform: scale(0.97); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── TOPIC PICKER ── */
  .topic-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    margin-top: 10px;
  }
  .topic-btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    padding: 12px 8px;
    color: var(--chalk);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }
  .topic-btn:hover { background: rgba(232,197,71,0.15); border-color: var(--gold); color: var(--gold); }
  .topic-btn .icon { font-size: 1.3rem; display: block; margin-bottom: 4px; }

  /* ── PROGRESS BAR ── */
  .prog-bar-wrap { margin-top: 6px; }
  .prog-bar-track { height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
  .prog-bar-fill  { height: 100%; border-radius: 3px; background: var(--mint); transition: width 0.4s ease; }
  .prog-lbl { font-size: 0.68rem; color: rgba(245,240,232,0.4); margin-top: 3px; text-align: right; }

  /* ── WEAK TAGS ── */
  .weak-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .weak-tag { background: rgba(232,93,74,0.18); border: 1px solid rgba(232,93,74,0.4); border-radius: 20px; padding: 2px 10px; font-size: 0.7rem; color: var(--coral); }
  .strong-tag { background: rgba(76,175,138,0.18); border: 1px solid rgba(76,175,138,0.4); border-radius: 20px; padding: 2px 10px; font-size: 0.7rem; color: var(--mint); }

  .typing { opacity: 0.55; font-style: italic; font-size: 0.8rem; }
  .divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 4px 0; }
`;
