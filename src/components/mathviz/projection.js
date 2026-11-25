// Contas e marcas comuns às figuras de projeção ortogonal (lição 7.32).
//
// Todas as figuras usam o CartesianPlane com a mesma escala nos dois eixos
// (xUnit = yUnit). Por isso o quadradinho do ângulo reto, calculado aqui em
// unidades do plano, sai quadrado na tela.

export const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
export const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
export const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
export const times = (k, p) => [k * p[0], k * p[1]];
export const norm = (p) => Math.hypot(p[0], p[1]);
export const lerp = (p, q, s) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s];

// O número k da projeção: quantos u cabem na sombra de v.
export const kOf = (v, u) => dot(v, u) / dot(u, u);

// Marca de ângulo reto no ponto `at`, entre a direção `along` (sobre a reta) e
// a direção `toward` (para onde sobe o outro lado). `size` em unidades do
// plano. Devolve dois segmentos para o CartesianPlane.
export function rightAngle(at, along, toward, size, extra = {}) {
  const a = norm(along);
  const b = norm(toward);
  if (a < 1e-9 || b < 1e-9) return [];
  const e = times(size / a, along);
  const f = times(size / b, toward);
  const p1 = add(at, e);
  const p2 = add(add(at, e), f);
  const p3 = add(at, f);
  return [
    {from: p1, to: p2, tone: 0, ...extra},
    {from: p2, to: p3, tone: 0, ...extra},
  ];
}

// Segmento da reta que passa por `through` na direção `dir`, recortado na
// janela [xMin, xMax] × [yMin, yMax]. Os segmentos do CartesianPlane não são
// recortados pela caixa do gráfico; as retas (`lines`) são, mas só aceitam
// inclinação. Este recorte serve para desenhar a reta de u como segmento.
export function clipLine(through, dir, box) {
  const [xMin, xMax, yMin, yMax] = box;
  let t0 = -Infinity;
  let t1 = Infinity;
  const clip = (p, d, lo, hi) => {
    if (Math.abs(d) < 1e-12) {
      if (p < lo || p > hi) {
        t0 = Infinity;
        t1 = -Infinity;
      }
      return;
    }
    const a = (lo - p) / d;
    const b = (hi - p) / d;
    t0 = Math.max(t0, Math.min(a, b));
    t1 = Math.min(t1, Math.max(a, b));
  };
  clip(through[0], dir[0], xMin, xMax);
  clip(through[1], dir[1], yMin, yMax);
  if (t0 > t1) return null;
  return [add(through, times(t0, dir)), add(through, times(t1, dir))];
}

// Número em LaTeX com vírgula decimal e até `digits` casas, sem zeros à
// direita: 1.40 → '1{,}4'; -0.6 → '-0{,}6'; 7 → '7'.
export function num(value, digits = 2) {
  const rounded = Number(value.toFixed(digits));
  const clean = Object.is(rounded, -0) ? 0 : rounded;
  return String(clean).replace('.', '{,}');
}

// O mesmo número para texto simples (botões, rótulos HTML).
export const numText = (value, digits = 2) => num(value, digits).replace('{,}', ',').replace('-', '−');

// Número entre parênteses quando é negativo, para aparecer dentro de uma conta.
export const par = (value, digits = 2) => (value < -1e-9 ? `(${num(value, digits)})` : num(value, digits));

// Par de coordenadas em LaTeX pela notação da casa: (3,\ 4) e (0{,}6;\ 0{,}8).
export function pair(p, digits = 2) {
  const a = num(p[0], digits);
  const b = num(p[1], digits);
  const sep = a.includes('{,}') || b.includes('{,}') ? ';' : ',';
  return `(${a}${sep}\\ ${b})`;
}

// O mesmo par para texto simples.
export function pairText(p, digits = 2) {
  const a = numText(p[0], digits);
  const b = numText(p[1], digits);
  const sep = a.includes(',') || b.includes(',') ? ';' : ',';
  return `(${a}${sep} ${b})`;
}

// Diz se o número é exato com `digits` casas (para escolher "=" ou "≈").
export const exact = (value, digits = 2) =>
  Math.abs(value * 10 ** digits - Math.round(value * 10 ** digits)) < 1e-9;
