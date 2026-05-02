function rand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function generateQuestion(topic, difficulty) {
  const d = difficulty;
  const lim = d === 1 ? [1, 12] : d === 2 ? [10, 50] : [50, 200];
  const [lo, hi] = lim;

  switch (topic) {
    case "Addition": {
      const a = rand(lo, hi);
      const b = rand(lo, hi);

      return {
        q: `${a} + ${b}`,
        answer: a + b,
        steps: [`${a} + ${b} = ${a + b}`],
        type: "Addition",
      };
    }

    case "Subtraction": {
      const a = rand(lo + 5, hi);
      const b = rand(lo, a);

      return {
        q: `${a} − ${b}`,
        answer: a - b,
        steps: [`${a} − ${b} = ${a - b}`],
        type: "Subtraction",
      };
    }

    case "Multiplication": {
      const a = d === 1 ? rand(1, 12) : rand(2, 20);
      const b = d === 1 ? rand(1, 12) : rand(2, 15);

      return {
        q: `${a} × ${b}`,
        answer: a * b,
        steps: [
          `${a} × ${b} = ${a * b}`,
          `(Think: ${a} added ${b} times)`,
        ],
        type: "Multiplication",
      };
    }

    case "Division": {
      const b = d === 1 ? rand(1, 10) : rand(2, 15);
      const a = b * rand(1, d === 1 ? 10 : 20);

      return {
        q: `${a} ÷ ${b}`,
        answer: a / b,
        steps: [
          `${a} ÷ ${b} = ${a / b}`,
          `Check: ${b} × ${a / b} = ${a} ✓`,
        ],
        type: "Division",
      };
    }

    case "Fractions": {
      const denom = d === 1 ? rand(2, 6) : rand(2, 12);
      const n1 = rand(1, denom - 1);
      const n2 = rand(1, denom - 1);

      const num = n1 + n2;

      const gcd = (a, b) => (b ? gcd(b, a % b) : a);
      const g = gcd(num, denom);

      const simplified = `${num / g}/${denom / g}`;

      return {
        q: `${n1}/${denom} + ${n2}/${denom}`,
        answer: num / denom,
        answerDisplay: simplified,
        textAnswer: simplified,
        rawFraction: `${num}/${denom}`,
        steps: [
          `Same denominator: ${denom}`,
          `Add the numerators: ${n1} + ${n2} = ${num}`,
          `Result: ${num}/${denom}${g > 1 ? ` → simplified: ${simplified}` : ""}`,
        ],
        type: "Fractions",
      };
    }

    case "Equations": {
      const b = rand(1, d === 1 ? 10 : 30);
      const coef = d === 1 ? 1 : rand(2, d === 2 ? 6 : 12);
      const rhs = rand(b + 1, b + coef * (d === 1 ? 10 : 30));
      const x = (rhs - b) / coef;

      if (!Number.isInteger(x) || x <= 0) {
        return generateQuestion(topic, difficulty);
      }

      const qStr = coef === 1 ? `x + ${b} = ${rhs}` : `${coef}x + ${b} = ${rhs}`;

      return {
        q: `Solve: ${qStr}`,
        answer: x,
        steps: [
          `${coef === 1 ? "x" : `${coef}x`} + ${b} = ${rhs}`,
          `${coef === 1 ? "x" : `${coef}x`} = ${rhs} − ${b} = ${rhs - b}`,
          coef > 1 ? `x = ${rhs - b} ÷ ${coef} = ${x}` : `x = ${x}`,
        ],
        type: "Equations",
      };
    }

    default:
      return generateQuestion("Addition", difficulty);
  }
}

export function genSimilar(question, difficulty) {
  return generateQuestion(question.type, difficulty);
}