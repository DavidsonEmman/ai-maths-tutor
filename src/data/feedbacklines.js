export const CORRECT_LINES = [
  "Excellent work! You understood that operation perfectly.",
  "Correct! Clear thinking — well done.",
  "That's right! Your reasoning is sharp.",
  "Perfect. You're handling this level with confidence.",
  "Correct! Keep that momentum going.",
];

export const WRONG_LINES = [
  "Not quite. Let me show you how to approach this.",
  "That isn't the right answer. Here is the correct method.",
  "Close, but not correct. Let's fix the mistake together.",
  "Incorrect — but don't worry. Let's work through it step by step.",
  "Not this time. Here is how it should be solved.",
];

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}