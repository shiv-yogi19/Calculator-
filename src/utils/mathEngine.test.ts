import { evaluateExpression, formatResultNumber, factorial } from './mathEngine';

interface TestCase {
  expression: string;
  expected: number | string;
  angleMode?: 'DEG' | 'RAD';
}

const tests: TestCase[] = [
  // Basic Arithmetic & Precedence
  { expression: '2 + 3', expected: 5 },
  { expression: '10 - 4', expected: 6 },
  { expression: '6 × 7', expected: 42 },
  { expression: '24 ÷ 6', expected: 4 },
  { expression: '2 + 3 × 4', expected: 14 },
  { expression: '(2 + 3) × 4', expected: 20 },
  { expression: '2 + 3 × 4 - 5', expected: 9 },

  // Decimals & Floats
  { expression: '0.1 + 0.2', expected: 0.3 },
  { expression: '1.25 × 4', expected: 5 },

  // Negatives
  { expression: '-5 × -3', expected: 15 },
  { expression: '10 + -3', expected: 7 },

  // Percentages
  { expression: '200 + 10%', expected: 220 },
  { expression: '50 × 20%', expected: 10 },

  // Powers & Factorials
  { expression: '2^3', expected: 8 },
  { expression: '3^2', expected: 9 },
  { expression: '5!', expected: 120 },

  // Trigonometry DEG
  { expression: 'sin(90)', expected: 1, angleMode: 'DEG' },
  { expression: 'cos(0)', expected: 1, angleMode: 'DEG' },
  { expression: 'cos(90)', expected: 0, angleMode: 'DEG' },
  { expression: 'tan(45)', expected: 1, angleMode: 'DEG' },

  // Trigonometry RAD
  { expression: 'cos(pi)', expected: -1, angleMode: 'RAD' },

  // Logarithms & Roots
  { expression: 'log(100)', expected: 2 },
  { expression: 'log(1000)', expected: 3 },
  { expression: 'ln(euler)', expected: 1 },
  { expression: 'sqrt(64)', expected: 8 },
  { expression: 'cbrt(27)', expected: 3 },

  // Division by zero
  { expression: '10 ÷ 0', expected: 'Cannot divide by 0' },
];

let passed = 0;
let failed = 0;

console.log('=== RUNNING NEXCAL MATHEMATICAL ENGINE VERIFICATION TESTS ===\n');

for (const t of tests) {
  const res = evaluateExpression(t.expression, t.angleMode || 'DEG');
  if (typeof t.expected === 'string') {
    if (res.error === t.expected) {
      console.log(`[PASS] ${t.expression} => Error caught: "${res.error}"`);
      passed++;
    } else {
      console.error(`[FAIL] ${t.expression} => Expected error "${t.expected}", got`, res);
      failed++;
    }
  } else {
    if (res.error === null && Math.abs(res.result! - t.expected) < 1e-6) {
      console.log(`[PASS] ${t.expression} = ${res.result}`);
      passed++;
    } else {
      console.error(`[FAIL] ${t.expression} => Expected ${t.expected}, got`, res);
      failed++;
    }
  }
}

console.log(`\nRESULTS: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL MATHEMATICAL ENGINE TESTS PASSED SUCCESFULLY!');
}
