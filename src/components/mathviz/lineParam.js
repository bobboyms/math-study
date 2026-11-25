// Contas e marcas comuns às figuras de retas escritas com vetores
// (lição 7.33, Retas com vetores).
//
// Todas as figuras usam o CartesianPlane com a mesma escala nos dois eixos
// (xUnit = yUnit). Por isso o quadradinho do ângulo reto, calculado aqui em
// unidades do plano, sai quadrado na tela.

import {dec, pairTex} from './vectorArc';

export {dec, pairTex};

export const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
export const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
export const times = (k, p) => [k * p[0], k * p[1]];
export const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
export const norm = (p) => Math.hypot(p[0], p[1]);

// Ponto da reta A + t·d.
export const at = (A, d, t) => [A[0] + t * d[0], A[1] + t * d[1]];

// Número arredondado para comparar sem o ruído do ponto flutuante.
export const round = (v, digits = 6) => {
  const r = Number(v.toFixed(digits));
  return Object.is(r, -0) ? 0 : r;
};

// Número em LaTeX entre parênteses quando é negativo, para aparecer numa
// soma: 1 + (−2).
export const signed = (v, digits = 1) => (v < 0 ? `(${dec(v, digits)})` : dec(v, digits));

// Os dois valores de t em que a reta A + t·d sai da janela [x0, x1] × [y0, y1].
// Os segmentos do CartesianPlane não são recortados pela caixa do gráfico:
// é com estes valores que uma semirreta ou um rastro param na borda.
export function windowRange(A, d, box) {
  const [x0, x1, y0, y1] = box;
  let lo = -Infinity;
  let hi = Infinity;
  [[A[0], d[0], x0, x1], [A[1], d[1], y0, y1]].forEach(([p, v, a, b]) => {
    if (v === 0) return;
    const ta = (a - p) / v;
    const tb = (b - p) / v;
    lo = Math.max(lo, Math.min(ta, tb));
    hi = Math.min(hi, Math.max(ta, tb));
  });
  return [lo, hi];
}

// Marca de ângulo reto no ponto `vertex`, entre as direções `u` e `v`
// (vetores quaisquer, não precisam ser unitários). `size` em unidades do
// plano. Devolve um polígono sem preenchimento para o CartesianPlane.
export function rightAngleMark(vertex, u, v, size = 0.3, tone = 0) {
  const nu = norm(u) || 1;
  const nv = norm(v) || 1;
  const a = times(size / nu, u);
  const b = times(size / nv, v);
  return {
    points: [vertex, add(vertex, a), add(add(vertex, a), b), add(vertex, b)],
    tone,
    fill: false,
  };
}
