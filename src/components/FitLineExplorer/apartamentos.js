// Dados e contas dos apartamentos da lição 11.12 (Mínimos quadrados).
//
// Cinco vendas no mesmo prédio: área em m² e preço em milhares de reais. A
// melhor reta, no sentido dos mínimos quadrados, é y = 5x + 50, com erros
// (−10, 20, −20, 20, −10) e soma dos quadrados 1 400. Os componentes Fit*
// importam daqui para que todas as figuras usem os mesmos números.

export const AREAS = [40, 50, 60, 70, 80];
export const PRICES = [240, 320, 330, 420, 440];
export const BEST = {m: 5, n: 50};

export const predict = (m, n, x) => m * x + n;
export const errorsOf = (m, n, xs = AREAS, ys = PRICES) => xs.map((x, i) => ys[i] - predict(m, n, x));
export const sqeOf = (m, n, xs = AREAS, ys = PRICES) =>
  errorsOf(m, n, xs, ys).reduce((s, e) => s + e * e, 0);

// Número com vírgula decimal e espaço fino nos milhares (padrão do curso:
// 26 400, 1 400), até `digits` casas, sem zeros sobrando.
function grouped(abs, digits) {
  const rounded = Number(abs.toFixed(digits));
  const [int, frac] = String(rounded).split('.');
  const intG = int.length > 3 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : int;
  return {intG, frac};
}

// Para LaTeX: '26\,400', '-0{,}5'.
export function tnum(value, digits = 2) {
  const rounded = Number(value.toFixed(digits));
  const v = Object.is(rounded, -0) ? 0 : rounded;
  const {intG, frac} = grouped(Math.abs(v), digits);
  const body = intG.replace(/ /g, '\\,') + (frac ? `{,}${frac}` : '');
  return v < 0 ? `-${body}` : body;
}

// Para texto simples: '26 400', '−0,5'.
export function pnum(value, digits = 2) {
  const rounded = Number(value.toFixed(digits));
  const v = Object.is(rounded, -0) ? 0 : rounded;
  const {intG, frac} = grouped(Math.abs(v), digits);
  const body = intG.replace(/ /g, ' ') + (frac ? `,${frac}` : '');
  return v < 0 ? `−${body}` : body;
}

// Erro com sinal explícito, para rótulo: '+20', '−10', '0'.
export const signedText = (e) => (e > 1e-9 ? `+${pnum(e)}` : pnum(e));

// A reta em LaTeX: 'y = 5x + 50', 'y = 350', 'y = 8x - 80'.
export function lineTex(m, n) {
  const mPart = Math.abs(m) < 1e-9 ? '' : `${m === 1 ? '' : tnum(m)}x`;
  if (!mPart) return `y = ${tnum(n)}`;
  if (Math.abs(n) < 1e-9) return `y = ${mPart}`;
  return `y = ${mPart} ${n < 0 ? '-' : '+'} ${tnum(Math.abs(n))}`;
}

// A mesma reta em texto simples, para botões.
export const lineText = (m, n) =>
  lineTex(m, n)
    .replace(/\\,/g, ' ')
    .replace('{,}', ',')
    .replace(' - ', ' − ');

// Quadrado entre parênteses quando negativo: '(-10)^2'.
export const sqTex = (e) => (e < -1e-9 ? `(${tnum(e)})^2` : `${tnum(e)}^2`);
