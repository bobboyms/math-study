// Contas de matriz 2 × 2 comuns às figuras da lição 11.11 (Autovalores e
// autovetores). Matrizes por linhas, como no papel: [[a, b], [c, d]].

export const I2 = [
  [1, 0],
  [0, 1],
];

export const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

export const mul = (A, B) => [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];

export const det = (M) => M[0][0] * M[1][1] - M[0][1] * M[1][0];

export const trace = (M) => M[0][0] + M[1][1];

// A matriz do meio do caminho entre I e A: (1 − s)I + sA. Cada autovetor de A
// continua autovetor dela, com autovalor 1 − s + sλ: por isso as setas sobre
// as retas especiais só esticam durante todo o movimento.
export const mix = (A, s) => [
  [1 - s + s * A[0][0], s * A[0][1]],
  [s * A[1][0], 1 - s + s * A[1][1]],
];

export const minusLambda = (A, l) => [
  [A[0][0] - l, A[0][1]],
  [A[1][0], A[1][1] - l],
];

export const rotation = (deg) => {
  const a = (deg * Math.PI) / 180;
  return [
    [Math.cos(a), -Math.sin(a)],
    [Math.sin(a), Math.cos(a)],
  ];
};

// A matriz com autovetores d1, d2 e autovalores l1, l2: P D P⁻¹.
export function fromEigen(d1, d2, l1, l2) {
  const P = [
    [d1[0], d2[0]],
    [d1[1], d2[1]],
  ];
  const dt = det(P);
  const Pi = [
    [P[1][1] / dt, -P[0][1] / dt],
    [-P[1][0] / dt, P[0][0] / dt],
  ];
  return mul(
    mul(P, [
      [l1, 0],
      [0, l2],
    ]),
    Pi,
  );
}

export const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
export const dot = (u, v) => u[0] * v[0] + u[1] * v[1];
export const len = (u) => Math.hypot(u[0], u[1]);

// Ângulo (em graus, de −90 a 90) entre a reta de v e a seta w. Zero quando w
// está na reta de v, apontando para o mesmo lado ou para o lado oposto.
export function offLine(v, w) {
  if (len(w) < 1e-9) return 0;
  const a = (Math.atan2(cross(v, w), dot(v, w)) * 180) / Math.PI;
  let d = ((a + 90) % 180 + 180) % 180 - 90;
  if (Math.abs(d) < 1e-9) d = 0;
  return d;
}

// Autovalores reais (em ordem decrescente) de uma matriz 2 × 2; [] se o
// discriminante for negativo.
export function eigenvalues(M) {
  const tr = trace(M);
  const dt = det(M);
  const disc = tr * tr - 4 * dt;
  if (disc < -1e-12) return [];
  const r = Math.sqrt(Math.max(0, disc));
  return [(tr + r) / 2, (tr - r) / 2];
}

// Um autovetor do autovalor l (pela linha não nula de M − lI).
export function eigenvector(M, l) {
  const a = M[0][0] - l;
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1] - l;
  if (Math.abs(a) + Math.abs(b) > 1e-9) return [-b, a];
  if (Math.abs(c) + Math.abs(d) > 1e-9) return [-d, c];
  return [1, 0];
}

// Representante de uma direção com inteiros pequenos, como (1, −2); se não
// houver, devolve null. O primeiro número não nulo fica positivo.
export function niceDir(v, maxDen = 6) {
  const L = len(v);
  if (L < 1e-12) return null;
  for (let k = 1; k <= maxDen * 4; k += 1) {
    // escala que deixa a menor coordenada não nula igual a k/den
    const nz = [v[0], v[1]].filter((x) => Math.abs(x) > 1e-9 * L);
    const m = Math.min(...nz.map(Math.abs));
    const s = k / m;
    const a = v[0] * s;
    const b = v[1] * s;
    if (Math.abs(a - Math.round(a)) < 1e-6 && Math.abs(b - Math.round(b)) < 1e-6) {
      let x = Math.round(a);
      let y = Math.round(b);
      if (x < 0 || (x === 0 && y < 0)) {
        x = -x;
        y = -y;
      }
      if (Math.max(Math.abs(x), Math.abs(y)) > 12) return null;
      return [x === 0 ? 0 : x, y === 0 ? 0 : y];
    }
  }
  return null;
}

// Número em texto comum, com vírgula e o menos tipográfico; -0 vira 0.
export function numText(value, digits = 2) {
  const r = Number(Number(value).toFixed(digits));
  const v = Object.is(r, -0) ? 0 : r;
  return String(v).replace('.', ',').replace('-', '−');
}

// Número em LaTeX com vírgula decimal; -0 vira 0.
export function num(value, digits = 2) {
  const r = Number(Number(value).toFixed(digits));
  const v = Object.is(r, -0) ? 0 : r;
  return String(v).replace('.', '{,}');
}

export function pairText(p, digits = 2) {
  const a = numText(p[0], digits);
  const b = numText(p[1], digits);
  const sep = a.includes(',') || b.includes(',') ? '; ' : ', ';
  return `(${a}${sep}${b})`;
}

export function pair(p, digits = 2) {
  const a = num(p[0], digits);
  const b = num(p[1], digits);
  const sep = a.includes('{,}') || b.includes('{,}') ? ';\\ ' : ',\\ ';
  return `(${a}${sep}${b})`;
}

export function bmatrix(M, digits = 2) {
  return `\\begin{bmatrix} ${num(M[0][0], digits)} & ${num(M[0][1], digits)} \\\\ ${num(M[1][0], digits)} & ${num(M[1][1], digits)} \\end{bmatrix}`;
}

// Ponta de uma reta pela origem na direção d, recortada pela janela.
export function lineEnds(d, win) {
  const [xMin, xMax, yMin, yMax] = win;
  const L = len(d);
  const u = [d[0] / L, d[1] / L];
  const R = Math.hypot(Math.max(-xMin, xMax), Math.max(-yMin, yMax)) + 1;
  return [
    [-u[0] * R, -u[1] * R],
    [u[0] * R, u[1] * R],
  ];
}
