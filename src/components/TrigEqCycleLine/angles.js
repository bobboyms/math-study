// Ferramentas comuns às figuras da lição de equações trigonométricas
// (TrigEqCycleLine, TrigEqCopies, TrigEqInterval, TrigEqArgument, TrigEqRoots,
// TrigEqWheel).

import {num} from '../WaveTracer/wave';

export const PI = Math.PI;
export const TAU = 2 * Math.PI;

// Um ângulo em radianos escrito como fração de π, em LaTeX, quando ele é uma
// fração de π com denominador 1, 2, 3, 4, 6 ou 12: 5π/6 → '\\frac{5\\pi}{6}'.
// Devolve null quando não é (aí a figura escreve o decimal).
export function piLabel(x) {
  const r = x / PI;
  for (const d of [1, 2, 3, 4, 6, 12]) {
    const n = Math.round(r * d);
    if (Math.abs(r * d - n) < 1e-7) {
      if (n === 0) return '0';
      const sign = n < 0 ? '-' : '';
      const a = Math.abs(n);
      const top = a === 1 ? '\\pi' : `${a}\\pi`;
      return d === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${d}}`;
    }
  }
  return null;
}

// "= 5π/6" quando o ângulo é uma fração de π conhecida; "≈ 2,62" quando não.
export function angleRel(x, digits = 2) {
  const p = piLabel(x);
  return p ? `= ${p}` : `\\approx ${num(x, digits)}`;
}

// O ângulo sozinho, para rótulo de figura: '\\frac{5\\pi}{6}' ou '2{,}62'.
export function angleShort(x, digits = 2) {
  return piLabel(x) ?? num(x, digits);
}

// Valores notáveis de seno, cosseno e tangente escritos em LaTeX.
const NOTABLE = [
  [0, '0'],
  [0.5, '\\frac{1}{2}'],
  [Math.SQRT2 / 2, '\\frac{\\sqrt{2}}{2}'],
  [Math.sqrt(3) / 2, '\\frac{\\sqrt{3}}{2}'],
  [1, '1'],
  [Math.sqrt(3) / 3, '\\frac{\\sqrt{3}}{3}'],
  [Math.sqrt(3), '\\sqrt{3}'],
];

export function valueTex(c, digits = 2) {
  for (const [v, tex] of NOTABLE) {
    if (Math.abs(Math.abs(c) - v) < 1e-9) return c < 0 && v !== 0 ? `-${tex}` : tex;
  }
  return num(c, digits);
}

// Texto simples (fora do KaTeX) de um número: vírgula decimal e sinal de menos
// tipográfico.
export const plain = (v, digits = 2) => num(v, digits).replace('{,}', ',').replace('-', '−');

// Leva um ângulo para [0, 2π).
export const mod2pi = (x) => {
  const m = ((x % TAU) + TAU) % TAU;
  return Math.abs(m - TAU) < 1e-9 ? 0 : m;
};

export {num};
