// Frações exatas para as figuras de sistemas lineares (lição 11.4).
//
// O escalonamento multiplica linhas por números como 1/5 ou 5/3. Com números
// de ponto flutuante, 3 × (1/3) pode virar 0,9999999 e a figura escreveria
// isso. Aqui cada valor é um par {n, d} sempre simplificado, com d positivo.

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

export function fr(n, d = 1) {
  let num = n;
  let den = d;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(Math.abs(num), den) || 1;
  return {n: num / g, d: den / g};
}

// Aceita número inteiro, [numerador, denominador] ou uma fração já pronta.
export const toFr = (v) => {
  if (Array.isArray(v)) return fr(v[0], v[1]);
  if (typeof v === 'number') return fr(v, 1);
  return v;
};

export const add = (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a, b) => fr(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a, b) => fr(a.n * b.n, a.d * b.d);
export const div = (a, b) => fr(a.n * b.d, a.d * b.n);
export const neg = (a) => fr(-a.n, a.d);
export const isZero = (a) => a.n === 0;
export const eq = (a, b) => a.n === b.n && a.d === b.d;

// Em LaTeX: "-4", "\tfrac{2}{3}", "-\tfrac{19}{2}".
export function texFr(a) {
  if (a.d === 1) return String(a.n);
  const s = a.n < 0 ? '-' : '';
  return `${s}\\tfrac{${Math.abs(a.n)}}{${a.d}}`;
}

// Em texto corrido (leitor de tela, painel): "−4", "2/3".
export function plainFr(a) {
  const s = a.d === 1 ? String(Math.abs(a.n)) : `${Math.abs(a.n)}/${a.d}`;
  return a.n < 0 ? `−${s}` : s;
}

// Uma operação elementar aplicada às linhas (contadas a partir de 1).
//   {op: 'swap', rows: [1, 3]}           L1 ↔ L3
//   {op: 'scale', row: 1, k: [1, 5]}     L1 ← (1/5) L1
//   {op: 'add', row: 2, from: 1, k: -2}  L2 ← L2 − 2 L1
export function applyOp(rows, op) {
  const R = rows.map((r) => r.slice());
  if (op.op === 'swap') {
    const [i, j] = op.rows;
    [R[i - 1], R[j - 1]] = [R[j - 1], R[i - 1]];
  } else if (op.op === 'scale') {
    const k = toFr(op.k);
    R[op.row - 1] = R[op.row - 1].map((v) => mul(v, k));
  } else if (op.op === 'add') {
    const k = toFr(op.k);
    const src = rows[op.from - 1];
    R[op.row - 1] = R[op.row - 1].map((v, c) => add(v, mul(k, src[c])));
  }
  return R;
}

// "2L_1", "L_1", "\tfrac{5}{3}L_1": o múltiplo sem o sinal.
function multiple(k, row) {
  const a = fr(Math.abs(k.n), k.d);
  const coef = a.n === 1 && a.d === 1 ? '' : texFr(a);
  return `${coef}L_{${row}}`;
}

export function opTex(op) {
  if (op.op === 'swap') return `L_{${op.rows[0]}} \\leftrightarrow L_{${op.rows[1]}}`;
  const k = toFr(op.k);
  if (op.op === 'scale') {
    const sign = k.n < 0 ? '-' : '';
    return `L_{${op.row}} \\leftarrow ${sign}${multiple(k, op.row)}`;
  }
  const sign = k.n < 0 ? '-' : '+';
  return `L_{${op.row}} \\leftarrow L_{${op.row}} ${sign} ${multiple(k, op.from)}`;
}

// Primeira coluna diferente de zero de uma linha, olhando só as `n` primeiras
// colunas (as das incógnitas). −1 quando a linha é toda de zeros ali.
export function leadCol(row, n) {
  for (let c = 0; c < n; c++) if (!isZero(row[c])) return c;
  return -1;
}
