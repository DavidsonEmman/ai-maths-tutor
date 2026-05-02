export function buildExplanation(question) {
  const lines = [];

  lines.push(`Let me walk you through **${question.q}**:`);

  question.steps.forEach((step, index) => {
    lines.push(`Step ${index + 1}: ${step}`);
  });

  lines.push(`Answer: **${question.answerDisplay || question.answer}**`);

  return lines;
}