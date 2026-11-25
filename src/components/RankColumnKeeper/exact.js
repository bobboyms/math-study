import {fr, toFr, add, sub, mul, div, neg, isZero, texFr} from '../SystemElimination/frac';

// Contas exatas com matrizes para as figuras da lição 11.10 (base, dimensão e
// posto): forma escalonada reduzida, pivôs, posto, base do núcleo e a receita
// que refaz uma coluna a partir de outras. Tudo com frações {n, d}, para a
// figura nunca escrever 0,9999.

export const toMat = (rows) => rows.map((r) => r.map(toFr));

// Forma escalonada reduzida. Devolve a matriz e as colunas dos pivôs.
export function rref(rows, nCols) {
  const m = toMat(rows).map((r) => [...r]);
  const cols = nCols ?? (m[0] ? m[0].length : 0);
  const pivots = [];
  let r = 0;
  for (let c = 0; c < cols && r < m.length; c += 1) {
    let p = r;
    while (p < m.length && isZero(m[p][c])) p += 1;
    if (p === m.length) continue;
    [m[r], m[p]] = [m[p], m[r]];
    const lead = m[r][c];
    m[r] = m[r].map((x) => div(x, lead));
    for (let i = 0; i < m.length; i += 1) {
      if (i === r || isZero(m[i][c])) continue;
      const k = m[i][c];
      m[i] = m[i].map((x, j) => sub(x, mul(k, m[r][j])));
    }
    pivots.push(c);
    r += 1;
  }
  return {m, pivots};
}

export const rank = (rows) => rref(rows).pivots.length;

// Base do núcleo: um vetor por coluna sem pivô (1 nela, 0 nas outras livres).
export function nullBasis(rows) {
  const n = rows[0].length;
  const {m, pivots} = rref(rows);
  const free = [...Array(n).keys()].filter((j) => !pivots.includes(j));
  return free.map((f) => {
    const v = Array(n).fill(fr(0));
    v[f] = fr(1);
    pivots.forEach((pc, i) => {
      v[pc] = neg(m[i][f]);
    });
    return v;
  });
}

// Receita que refaz a coluna `target` com as colunas `kept`. Devolve os
// coeficientes (um por coluna guardada) ou null se não existe receita.
export function recipe(rows, kept, target) {
  const aug = rows.map((r) => [...kept.map((k) => r[k]), r[target]]);
  const {m, pivots} = rref(aug, kept.length);
  // linha 0 = número diferente de zero: impossível
  for (let i = pivots.length; i < m.length; i += 1) {
    if (!isZero(m[i][kept.length])) return null;
  }
  const coef = kept.map(() => fr(0));
  pivots.forEach((pc, i) => {
    coef[pc] = m[i][kept.length];
  });
  return coef;
}

// "2\vec{f} + \vec{o}" a partir de coeficientes e nomes; zero vira "\vec{0}".
export function comboTex(coef, names) {
  let out = '';
  coef.forEach((c, i) => {
    if (isZero(c)) return;
    const neg_ = c.n < 0;
    const abs = neg_ ? neg(c) : c;
    const k = abs.n === 1 && abs.d === 1 ? '' : texFr(abs);
    if (!out) out = `${neg_ ? '-' : ''}${k}${names[i]}`;
    else out += ` ${neg_ ? '-' : '+'} ${k}${names[i]}`;
  });
  return out || '\\vec{0}';
}

export {fr, toFr, add, sub, mul, div, neg, isZero, texFr};
