// Dados e contas da lição 11.2 (Vetores com muitas coordenadas), usados por
// todas as figuras dela: GenreBars, GenrePlanePicker, CoordLengthSpiral,
// PairSheet e CauchyParabola. Mantê-los num lugar só garante que os números
// desenhados batem com a tabela do problema motivador.

export const GENRES = ['ação', 'comédia', 'drama', 'terror', 'documentário'];

// Filmes vistos no mês, na ordem de GENRES. Paula e Gustavo dividem o tom 1
// porque têm o mesmo gosto (o Gustavo é o dobro da Paula).
export const CLIENTS = {
  Paula: {v: [6, 1, 0, 4, 3], tone: 1, letter: 'p'},
  Gustavo: {v: [12, 2, 0, 8, 6], tone: 1, letter: 'g'},
  Carla: {v: [3, 3, 4, 1, 2], tone: 2, letter: 'c'},
  Davi: {v: [0, 5, 4, 0, 1], tone: 3, letter: 'd'},
};

export const dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
export const norm = (v) => Math.sqrt(dot(v, v));
export const sub = (u, v) => u.map((x, i) => x - v[i]);
export const DEG = 180 / Math.PI;

// Número em LaTeX com vírgula decimal: 4.5 → '4{,}5'; -2 → '-2'.
export function dec(value, digits = 2) {
  const rounded = Number(Number(value).toFixed(digits));
  const clean = Object.is(rounded, -0) ? 0 : rounded;
  return String(clean).replace('.', '{,}');
}

// O mesmo número em texto simples (rótulos HTML): vírgula e menos tipográfico.
export const decText = (value, digits = 2) => dec(value, digits).replace('{,}', ',').replace('-', '−');

// Lista na notação da casa: (3,\ 4) e, com alguma vírgula decimal,
// (0{,}6;\ 0{,}8).
export function listTex(v, digits = 3) {
  const parts = v.map((x) => dec(x, digits));
  const sep = parts.some((p) => p.includes('{,}')) ? ';' : ',';
  return `(${parts.join(`${sep}\\ `)})`;
}

// Raiz exata quando dá número inteiro: 25 → '5'; 39 → '\\sqrt{39}'.
export function rootTex(n2) {
  const r = Math.sqrt(n2);
  return Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : `\\sqrt{${Math.round(n2)}}`;
}

// Quadrado de uma coordenada como aparece numa soma: 3 → '3^2'; -2 → '(-2)^2'.
export const sqTex = (x) => (x < 0 ? `(${dec(x)})^2` : `${dec(x)}^2`);
