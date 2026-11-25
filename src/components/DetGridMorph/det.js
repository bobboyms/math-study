// Contas comuns às figuras da lição 11.9 (Determinante).
//
// Matrizes 2 × 2 escritas por linhas, como no papel: [[a, b], [c, d]]. As
// colunas são (a, c) e (b, d).

import {lerp} from '../LinearGridMorph/plane';

export const I2 = [
  [1, 0],
  [0, 1],
];

export const det2 = (M) => M[0][0] * M[1][1] - M[0][1] * M[1][0];

export const mul2 = (A, B) => [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];

export const apply2 = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

// Mistura da identidade com A: (1 − s)I + sA. Cada ponto anda em linha reta.
export const mix2 = (A, s) => [
  [lerp(1, A[0][0], s), lerp(0, A[0][1], s)],
  [lerp(0, A[1][0], s), lerp(1, A[1][1], s)],
];

export const rot2 = (deg) => {
  const a = (deg * Math.PI) / 180;
  return [
    [Math.cos(a), -Math.sin(a)],
    [Math.sin(a), Math.cos(a)],
  ];
};

// Matriz de uma etapa no progresso s (0 a 1). Rotação gira pelo ângulo (sem
// encolher no meio); qualquer outra matriz anda em linha reta.
export const stageMatrix = (st, s) => (st.rotation != null ? rot2(st.rotation * s) : mix2(st.matrix, s));

// Área com sinal de um polígono (fórmula do cadarço): positiva quando os
// vértices estão em ordem anti-horária.
export function signedArea(pts) {
  let s = 0;
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    s += p[0] * q[1] - q[0] * p[1];
  });
  return s / 2;
}

// Arredonda ruído de ponto flutuante: 4,9999999 vira 5.
export const clean = (v, digits = 6) => {
  const r = Number(v.toFixed(digits));
  return Object.is(r, -0) ? 0 : r;
};
