// ─── QUESTION ENGINE ──────────────────────────────────────────────────────────
function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function generateQuestion(topic, difficulty) {
  const d = difficulty; // 1=easy 2=med 3=hard
  const lim = d === 1 ? [1,12] : d === 2 ? [10,50] : [50,200];
  const [lo, hi] = lim;

  switch (topic) {
    case "Addition": {
      const a = rand(lo, hi), b = rand(lo, hi);
      return { q: `${a} + ${b}`, answer: a + b, steps: [`${a} + ${b} = ${a + b}`], type: "Addition" };
    }
    case "Subtraction": {
      const a = rand(lo + 5, hi), b = rand(lo, a);
      return { q: `${a} − ${b}`, answer: a - b, steps: [`${a} − ${b} = ${a - b}`], type: "Subtraction" };
    }
    case "Multiplication": {
      const a = d === 1 ? rand(1,12) : rand(2,20), b = d === 1 ? rand(1,12) : rand(2,15);
      return { q: `${a} × ${b}`, answer: a * b, steps: [`${a} × ${b} = ${a * b}`, `(Think: ${a} added ${b} times)`], type: "Multiplication" };
    }
    case "Division": {
      const b = d === 1 ? rand(1,10) : rand(2,15), a = b * rand(1, d === 1 ? 10 : 20);
      return { q: `${a} ÷ ${b}`, answer: a / b, steps: [`${a} ÷ ${b} = ${a / b}`, `Check: ${b} × ${a / b} = ${a} ✓`], type: "Division" };
    }
    case "Fractions": {
      const denom = d === 1 ? rand(2,6) : rand(2,12);
      const n1 = rand(1, denom - 1), n2 = rand(1, denom - 1);
      const num = n1 + n2, gcd = (a, b) => b ? gcd(b, a % b) : a, g = gcd(num, denom);
      const ans = `${num/g}/${denom/g}`;
      return {
        q: `${n1}/${denom} + ${n2}/${denom}`,
        answer: num / denom,
        answerDisplay: ans,
        steps: [
          `Same denominator: ${denom}`,
          `Add the numerators: ${n1} + ${n2} = ${num}`,
          `Result: ${num}/${denom}${g > 1 ? ` → simplified: ${ans}` : ""}`
        ],
        type: "Fractions",
        isText: true,
        textAnswer: ans,
        checkFn: (s) => {
          const clean = s.replace(/\s/g,"");
          if (clean === ans) return true;
          if (clean === `${num}/${denom}`) return true;
          const parts = clean.split("/");
          if (parts.length === 2) {
            const top = parseInt(parts[0]), bot = parseInt(parts[1]);
            if (!isNaN(top) && !isNaN(bot) && bot !== 0) return Math.abs(top/bot - num/denom) < 0.001;
          }
          return Math.abs(parseFloat(clean) - num/denom) < 0.001;
        }
      };
    }
    case "Equations": {
      const b = rand(1, d === 1 ? 10 : 30), coef = d === 1 ? 1 : rand(2, d === 2 ? 6 : 12);
      const rhs = rand(b + 1, b + coef * (d === 1 ? 10 : 30));
      const x = (rhs - b) / coef;
      if (!Number.isInteger(x) || x <= 0) return generateQuestion(topic, difficulty);
      const qStr = coef === 1 ? `x + ${b} = ${rhs}` : `${coef}x + ${b} = ${rhs}`;
      return {
        q: `Solve: ${qStr}`,
        answer: x,
        steps: [
          `${coef === 1 ? "x" : `${coef}x`} + ${b} = ${rhs}`,
          `${coef === 1 ? "x" : `${coef}x`} = ${rhs} − ${b} = ${rhs - b}`,
          coef > 1 ? `x = ${rhs - b} ÷ ${coef} = ${x}` : `x = ${x}`
        ],
        type: "Equations"
      };
    }
    default: return generateQuestion("Addition", difficulty);
  }
}

function genSimilar(q, difficulty) {
  return generateQuestion(q.type, difficulty);
}
