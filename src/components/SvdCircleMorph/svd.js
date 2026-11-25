// Contas da decomposição em valores singulares (lição 11.13).
//
// Matrizes 2 × 2 escritas por linhas, como no papel: [[a, b], [c, d]].
// `svd2` devolve os vetores singulares com o sinal que a lição usa: v2 é v1
// girado 90° no sentido anti-horário, e u_i = A v_i / σ_i. O sinal de v1 pode
// ser fixado por uma dica (`hint`), para a figura bater com o texto.
//
// `svdN` faz a SVD de uma matriz qualquer (imagens) pelos autovalores de
// MᵀM, calculados pelo método de Jacobi (giros que zeram, um de cada vez, as
// entradas fora da diagonal de uma matriz simétrica).

export const EPS = 1e-9;

export const T2 = (M) => [
  [M[0][0], M[1][0]],
  [M[0][1], M[1][1]],
];

export const len = (p) => Math.hypot(p[0], p[1]);
export const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
export const perp = (p) => [-p[1], p[0]];
export const scale = (k, p) => [k * p[0], k * p[1]];
export const unitOf = (p) => {
  const L = len(p);
  return L < EPS ? [1, 0] : [p[0] / L, p[1] / L];
};
export const cols2 = (c1, c2) => [
  [c1[0], c2[0]],
  [c1[1], c2[1]],
];

const mul = (A, B) => [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];
const ap = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

// Autovalores e autovetores de uma simétrica 2 × 2 [[a, b], [b, c]].
export function symEig2(S) {
  const a = S[0][0];
  const b = (S[0][1] + S[1][0]) / 2;
  const c = S[1][1];
  const m = (a + c) / 2;
  const r = Math.hypot((a - c) / 2, b);
  const l1 = m + r;
  const l2 = m - r;
  let v1;
  if (r < EPS) v1 = [1, 0];
  else if (a >= c) v1 = unitOf([l1 - c, b]);
  else v1 = unitOf([b, l1 - a]);
  return {l1, l2, v1, v2: perp(v1)};
}

export function svd2(A, hint) {
  const AtA = mul(T2(A), A);
  const e = symEig2(AtA);
  let v1 = e.v1;
  if (hint && dot(v1, hint) < 0) v1 = scale(-1, v1);
  const v2 = perp(v1);
  const s1 = Math.sqrt(Math.max(0, e.l1));
  const s2 = Math.sqrt(Math.max(0, e.l2));
  const Av1 = ap(A, v1);
  const Av2 = ap(A, v2);
  const u1 = s1 > 1e-7 ? scale(1 / s1, Av1) : v1;
  const u2 = s2 > 1e-7 ? scale(1 / s2, Av2) : perp(u1);
  return {
    s1,
    s2,
    l1: e.l1,
    l2: e.l2,
    v1,
    v2,
    u1,
    u2,
    Av1,
    Av2,
    V: cols2(v1, v2),
    U: cols2(u1, u2),
    Vt: T2(cols2(v1, v2)),
    Sigma: [
      [s1, 0],
      [0, s2],
    ],
  };
}

// Ângulo de uma seta, em graus.
export const angleDeg = (p) => (Math.atan2(p[1], p[0]) * 180) / Math.PI;

// Uma matriz ortogonal 2 × 2 é uma rotação (det 1) ou um espelho (det −1).
// Para o espelho, devolve também o ângulo da reta que fica parada.
export function orthoKind(Q) {
  const d = Q[0][0] * Q[1][1] - Q[0][1] * Q[1][0];
  const near = (x, y) => Math.abs(x - y) < 1e-7;
  if (near(Q[0][0], 1) && near(Q[1][1], 1) && near(Q[0][1], 0) && near(Q[1][0], 0)) return {kind: 'identity', angle: 0};
  if (d > 0) return {kind: 'rotation', angle: angleDeg([Q[0][0], Q[1][0]])};
  // espelho [[cos t, sin t], [sin t, −cos t]]: a reta parada faz t/2 com o eixo x
  const t = angleDeg([Q[0][0], Q[1][0]]);
  let line = t / 2;
  line = ((line % 180) + 180) % 180;
  return {kind: 'mirror', angle: line};
}

// ---------------------------------------------------------------------------
// SVD de uma matriz m × n qualquer (para as imagens).

function jacobi(Sin) {
  const n = Sin.length;
  const S = Sin.map((row) => row.slice());
  const V = Array.from({length: n}, (_, i) => Array.from({length: n}, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep += 1) {
    let off = 0;
    for (let p = 0; p < n; p += 1) for (let q = p + 1; q < n; q += 1) off += S[p][q] * S[p][q];
    if (off < 1e-22) break;
    for (let p = 0; p < n; p += 1) {
      for (let q = p + 1; q < n; q += 1) {
        if (Math.abs(S[p][q]) < 1e-300) continue;
        const theta = (S[q][q] - S[p][p]) / (2 * S[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k += 1) {
          const skp = S[k][p];
          const skq = S[k][q];
          S[k][p] = c * skp - s * skq;
          S[k][q] = s * skp + c * skq;
        }
        for (let k = 0; k < n; k += 1) {
          const spk = S[p][k];
          const sqk = S[q][k];
          S[p][k] = c * spk - s * sqk;
          S[q][k] = s * spk + c * sqk;
        }
        for (let k = 0; k < n; k += 1) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  return {values: S.map((row, i) => row[i]), vectors: V};
}

// Devolve {s: [σ1 ≥ σ2 ≥ ...], u: [colunas], v: [colunas]}; só os σ não nulos
// trazem u.
export function svdN(M) {
  const m = M.length;
  const n = M[0].length;
  const MtM = Array.from({length: n}, (_, i) =>
    Array.from({length: n}, (_, j) => {
      let s = 0;
      for (let k = 0; k < m; k += 1) s += M[k][i] * M[k][j];
      return s;
    }),
  );
  const {values, vectors} = jacobi(MtM);
  const order = values.map((l, i) => [l, i]).sort((a, b) => b[0] - a[0]);
  const s = [];
  const u = [];
  const v = [];
  const top = Math.sqrt(Math.max(0, order[0][0]));
  order.forEach(([l, i]) => {
    const sigma = Math.sqrt(Math.max(0, l));
    if (sigma < 1e-6 * Math.max(1, top)) return;
    const vi = vectors.map((row) => row[i]);
    const ui = M.map((row) => row.reduce((acc, x, j) => acc + x * vi[j], 0) / sigma);
    s.push(sigma);
    u.push(ui);
    v.push(vi);
  });
  return {s, u, v};
}

// Soma das k primeiras camadas σ u vᵀ.
export function layersSum(dec, k, m, n) {
  const out = Array.from({length: m}, () => new Array(n).fill(0));
  for (let l = 0; l < Math.min(k, dec.s.length); l += 1) {
    const {s, u, v} = {s: dec.s[l], u: dec.u[l], v: dec.v[l]};
    for (let i = 0; i < m; i += 1) for (let j = 0; j < n; j += 1) out[i][j] += s * u[i] * v[j];
  }
  return out;
}
