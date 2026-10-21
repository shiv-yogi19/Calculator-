import { AngleMode } from '../types';

/**
 * Token types for mathematical expression parsing
 */
type TokenType = 'NUMBER' | 'OPERATOR' | 'FUNCTION' | 'LPAREN' | 'RPAREN' | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

// Operator priorities
const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '−': 1,
  '×': 2,
  '*': 2,
  '÷': 2,
  '/': 2,
  'mod': 2,
  '^': 3,
  '%': 4, // Unary postfix percentage
  '%_ADD': 4, // Additive percentage
  '!': 4, // Unary postfix factorial
  'NEG': 4, // Unary negation
};

const RIGHT_ASSOCIATIVE: Record<string, boolean> = {
  '^': true,
  'NEG': true,
};

/**
 * Safe factorial function supporting integers up to 170 (beyond which doubles overflow to Infinity)
 */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial requires non-negative integer');
  }
  if (n > 170) {
    throw new Error('Overflow: value too large');
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Clean floating point arithmetic imprecision (e.g. 0.1 + 0.2 = 0.30000000000000004 -> 0.3)
 */
export function cleanFloat(num: number, precision: number = 12): number {
  if (!Number.isFinite(num)) return num;
  // If practically an integer
  const rounded = Math.round(num);
  if (Math.abs(num - rounded) < 1e-12) {
    return rounded;
  }
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * Format numbers for display, handling large values, scientific notation, and thousands separators
 */
export function formatResultNumber(
  val: number,
  options: {
    precision?: number;
    useThousands?: boolean;
    scientific?: boolean;
  } = {}
): string {
  if (Number.isNaN(val)) return 'Error';
  if (!Number.isFinite(val)) {
    return val > 0 ? 'Infinity' : '-Infinity';
  }

  const { precision = 10, useThousands = true, scientific = false } = options;
  const absVal = Math.abs(val);

  if (scientific || (absVal !== 0 && (absVal >= 1e15 || absVal < 1e-6))) {
    const expStr = val.toExponential(6);
    return expStr.replace('e+', 'e').replace('e-', 'e-');
  }

  // Clean float
  const cleaned = cleanFloat(val, precision);
  const str = cleaned.toString();

  if (!useThousands) return str;

  // Add commas to integer part
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Tokenize a math expression
 */
export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  // Normalize symbols
  const s = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/e(?![a-zA-Z])/g, 'euler');

  while (i < s.length) {
    const char = s[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers & decimals
    if (/\d/.test(char) || (char === '.' && i + 1 < s.length && /\d/.test(s[i + 1]))) {
      let numStr = '';
      while (i < s.length && (/[\d.]/.test(s[i]) || (s[i] === 'e' && i + 1 < s.length && /[+-]|\d/.test(s[i + 1])))) {
        numStr += s[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Constants & Functions
    if (/[a-zA-Z]/.test(char)) {
      let name = '';
      while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) {
        name += s[i];
        i++;
      }

      if (name === 'pi') {
        tokens.push({ type: 'NUMBER', value: String(Math.PI) });
      } else if (name === 'euler') {
        tokens.push({ type: 'NUMBER', value: String(Math.E) });
      } else if (name === 'mod') {
        tokens.push({ type: 'OPERATOR', value: 'mod' });
      } else {
        tokens.push({ type: 'FUNCTION', value: name.toLowerCase() });
      }
      continue;
    }

    // Parentheses
    if (char === '(') {
      // Check for implicit multiplication: e.g. 5(3) -> 5*(3)
      if (
        tokens.length > 0 &&
        (tokens[tokens.length - 1].type === 'NUMBER' || tokens[tokens.length - 1].type === 'RPAREN')
      ) {
        tokens.push({ type: 'OPERATOR', value: '*' });
      }
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // Operators
    if ('+-*/%^!'.includes(char)) {
      if (char === '%') {
        // Check if preceding operator in token stream was + or -
        let isAdditive = false;
        if (tokens.length >= 2 && tokens[tokens.length - 1].type === 'NUMBER') {
          const prevOp = tokens[tokens.length - 2];
          if (prevOp && prevOp.type === 'OPERATOR' && (prevOp.value === '+' || prevOp.value === '-')) {
            isAdditive = true;
          }
        }
        tokens.push({ type: 'OPERATOR', value: isAdditive ? '%_ADD' : '%' });
        i++;
        continue;
      }

      // Check for unary minus vs subtraction
      if (char === '-') {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN' || prev.type === 'FUNCTION') {
          tokens.push({ type: 'OPERATOR', value: 'NEG' });
          i++;
          continue;
        }
      }

      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // Unknown character, skip
    i++;
  }

  return tokens;
}

/**
 * Shunting-Yard Algorithm to convert tokens into Reverse Polish Notation (RPN)
 */
export function shuntingYard(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'NUMBER') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'OPERATOR') {
      const o1 = token.value;
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'OPERATOR') {
          const o2 = top.value;
          const p1 = PRECEDENCE[o1] || 0;
          const p2 = PRECEDENCE[o2] || 0;
          if ((!RIGHT_ASSOCIATIVE[o1] && p1 <= p2) || (RIGHT_ASSOCIATIVE[o1] && p1 < p2)) {
            outputQueue.push(operatorStack.pop()!);
            continue;
          }
        } else if (top.type === 'FUNCTION') {
          outputQueue.push(operatorStack.pop()!);
          continue;
        }
        break;
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      let matched = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop()!;
        if (top.type === 'LPAREN') {
          matched = true;
          break;
        }
        outputQueue.push(top);
      }
      if (!matched) {
        throw new Error('Mismatched parentheses');
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNCTION') {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

/**
 * Evaluates an RPN token list
 */
export function evaluateRPN(rpn: Token[], angleMode: AngleMode = 'DEG'): number {
  const stack: number[] = [];

  const toRad = (val: number) => (angleMode === 'DEG' ? (val * Math.PI) / 180 : val);
  const fromRad = (rad: number) => (angleMode === 'DEG' ? (rad * 180) / Math.PI : rad);

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'OPERATOR') {
      const op = token.value;

      if (op === 'NEG') {
        if (stack.length < 1) throw new Error('Invalid syntax');
        const a = stack.pop()!;
        stack.push(-a);
        continue;
      }

      if (op === '!') {
        if (stack.length < 1) throw new Error('Invalid syntax');
        const a = stack.pop()!;
        stack.push(factorial(a));
        continue;
      }

      if (op === '%_ADD') {
        if (stack.length < 1) throw new Error('Invalid syntax');
        const b = stack.pop()!;
        if (stack.length >= 1) {
          const a = stack[stack.length - 1];
          stack.push((a * b) / 100);
        } else {
          stack.push(b / 100);
        }
        continue;
      }

      if (op === '%') {
        if (stack.length < 1) throw new Error('Invalid syntax');
        const b = stack.pop()!;
        stack.push(b / 100);
        continue;
      }

      if (stack.length < 2) {
        throw new Error('Invalid syntax');
      }

      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (op) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (Math.abs(b) === 0) throw new Error('Cannot divide by 0');
          stack.push(a / b);
          break;
        case 'mod':
          if (b === 0) throw new Error('Cannot divide by 0');
          stack.push(a % b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator: ${op}`);
      }
    } else if (token.type === 'FUNCTION') {
      if (stack.length < 1) throw new Error('Invalid function arguments');
      const arg = stack.pop()!;
      const fn = token.value;

      switch (fn) {
        case 'sin':
          stack.push(Math.sin(toRad(arg)));
          break;
        case 'cos': {
          // Special case for exact 90 deg / 270 deg
          const rad = toRad(arg);
          const c = Math.cos(rad);
          stack.push(Math.abs(c) < 1e-15 ? 0 : c);
          break;
        }
        case 'tan': {
          const rad = toRad(arg);
          const cosVal = Math.cos(rad);
          if (Math.abs(cosVal) < 1e-15) throw new Error('Undefined (tan 90°)');
          stack.push(Math.tan(rad));
          break;
        }
        case 'asin':
        case 'arcsin':
        case 'sin_inv':
          if (arg < -1 || arg > 1) throw new Error('asin domain is [-1, 1]');
          stack.push(fromRad(Math.asin(arg)));
          break;
        case 'acos':
        case 'arccos':
        case 'cos_inv':
          if (arg < -1 || arg > 1) throw new Error('acos domain is [-1, 1]');
          stack.push(fromRad(Math.acos(arg)));
          break;
        case 'atan':
        case 'arctan':
        case 'tan_inv':
          stack.push(fromRad(Math.atan(arg)));
          break;
        case 'log':
        case 'log10':
          if (arg <= 0) throw new Error('log domain must be > 0');
          stack.push(Math.log10(arg));
          break;
        case 'ln':
          if (arg <= 0) throw new Error('ln domain must be > 0');
          stack.push(Math.log(arg));
          break;
        case 'sqrt':
          if (arg < 0) throw new Error('Cannot take root of negative');
          stack.push(Math.sqrt(arg));
          break;
        case 'cbrt':
          stack.push(Math.cbrt(arg));
          break;
        case 'sqr':
          stack.push(arg * arg);
          break;
        case 'cube':
          stack.push(arg * arg * arg);
          break;
        case 'abs':
          stack.push(Math.abs(arg));
          break;
        case 'fact':
          stack.push(factorial(arg));
          break;
        case 'inv':
        case 'reciprocal':
          if (arg === 0) throw new Error('Cannot divide by 0');
          stack.push(1 / arg);
          break;
        default:
          throw new Error(`Unknown function: ${fn}`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Malformed expression');
  }

  return cleanFloat(stack[0]);
}

/**
 * Top level evaluate function
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): { result: number; error: null } | { result: null; error: string } {
  if (!expr || expr.trim() === '') {
    return { result: null, error: 'Empty expression' };
  }

  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) {
      return { result: null, error: 'Empty expression' };
    }
    const rpn = shuntingYard(tokens);
    const value = evaluateRPN(rpn, angleMode);
    return { result: value, error: null };
  } catch (err: any) {
    return { result: null, error: err.message || 'Calculation error' };
  }
}

/**
 * Calculates a live preview while the user is typing.
 * Automatically closes unclosed parentheses if needed.
 * Returns null if the expression is incomplete or invalid.
 */
export function getLivePreview(expr: string, angleMode: AngleMode = 'DEG'): string | null {
  if (!expr || expr.trim() === '') return null;

  // Don't preview if ends with dangling operator
  const trimmed = expr.trim();
  if (/[+\-*/÷×^]$/.test(trimmed)) return null;

  // Auto-close open parentheses for preview calculation
  let openCount = 0;
  for (const c of trimmed) {
    if (c === '(') openCount++;
    if (c === ')') openCount--;
  }
  let testExpr = trimmed;
  if (openCount > 0) {
    testExpr += ')'.repeat(openCount);
  }

  const evalResult = evaluateExpression(testExpr, angleMode);
  if (evalResult.error === null && evalResult.result !== null) {
    return formatResultNumber(evalResult.result, { precision: 8 });
  }

  return null;
}
