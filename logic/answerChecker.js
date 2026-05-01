
function cleanInput(value) {
  return String(value)
    .toLowerCase()
    .replace(/\s/g, "")
    .replace("x=", "")
    .replace("x", "");
}

export function checkAnswer(userInput, question) {
  if (!question) return false;

  const cleaned = cleanInput(userInput);

  if (question.type === "Fractions") {
    if (cleaned === question.textAnswer) return true;
    if (cleaned === question.rawFraction) return true;

    const parts = cleaned.split("/");

    if (parts.length === 2) {
      const top = parseInt(parts[0]);
      const bottom = parseInt(parts[1]);

      if (!isNaN(top) && !isNaN(bottom) && bottom !== 0) {
        return Math.abs(top / bottom - question.answer) < 0.001;
      }
    }

    return Math.abs(parseFloat(cleaned) - question.answer) < 0.001;
  }

  const parsed = parseFloat(cleaned);

  return !isNaN(parsed) && Math.abs(parsed - question.answer) < 0.001;
}
