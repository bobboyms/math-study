// Ferramentas para figuras de vetores desenhadas no CartesianPlane
// (lição 7.30, Módulo, direção e componentes).
//
// O CartesianPlane não desenha arcos. O ângulo de um vetor é marcado aqui por
// uma cunha (polígono em leque, preenchido de leve e com contorno), que serve
// para qualquer ângulo, inclusive maior que 180° ou negativo.

export const DEG = Math.PI / 180;

// Ponto de tamanho r no ângulo `deg` (graus, anti-horário a partir do eixo x).
export const polar = (r, deg) => [r * Math.cos(deg * DEG), r * Math.sin(deg * DEG)];

// Ângulo do vetor (a, b) entre 0° e 360°, como o atan2 corrigido da lição.
export function angleOf(a, b) {
  const t = Math.atan2(b, a) / DEG;
  return t < 0 ? t + 360 : t;
}

// Cunha de raio r, do ângulo a0 ao ângulo a1 (graus; a1 pode ser menor que a0,
// e então a cunha gira no sentido horário).
export function wedge(r, a0, a1, tone, extra = {}) {
  const span = a1 - a0;
  const n = Math.max(2, Math.ceil(Math.abs(span) / 4));
  const pts = [[0, 0]];
  for (let i = 0; i <= n; i += 1) pts.push(polar(r, a0 + (span * i) / n));
  return {points: pts, tone, ...extra};
}

// Ponta da reta que passa pela origem na direção (a, b), recortada na janela
// quadrada de meia largura `half`. Os segmentos do CartesianPlane não são
// recortados pela caixa do gráfico, e uma reta "longa" sairia do desenho.
export function edgePoint(a, b, half) {
  const k = half / Math.max(Math.abs(a), Math.abs(b));
  return [a * k, b * k];
}

// Número em LaTeX com vírgula decimal: 4.33 → '4{,}33'; -0.6 → '-0{,}6'.
export function dec(value, digits = 1) {
  const rounded = Number(value.toFixed(digits));
  const clean = Object.is(rounded, -0) ? 0 : rounded;
  return String(clean).replace('.', '{,}');
}

// O mesmo número para texto simples (botões, rótulos HTML): vírgula decimal e
// sinal de menos tipográfico.
export function decText(value, digits = 1) {
  return dec(value, digits).replace('{,}', ',').replace('-', '−');
}

// Par de coordenadas em LaTeX, com ponto e vírgula quando alguma tem vírgula,
// como manda a notação da casa: (3,\ 4) e (0{,}6;\ 0{,}8).
export function pairTex(a, b, digits = 1) {
  const p = dec(a, digits);
  const q = dec(b, digits);
  const sep = p.includes('{,}') || q.includes('{,}') ? ';' : ',';
  return `(${p}${sep}\\ ${q})`;
}
