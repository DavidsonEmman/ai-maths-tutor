// ─── EXPLANATION ENGINE ───────────────────────────────────────────────────────
function buildExplanation(q) {
  const lines = [];
  lines.push(`Let me walk you through **${q.q}**:`);
  q.steps.forEach((s, i) => lines.push(`Step ${i + 1}: ${s}`));
  lines.push(`Answer: **${q.answerDisplay || q.answer}**`);
  return lines;
}
