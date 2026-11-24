// Ferramentas comuns às figuras da lição dos gráficos do seno e do cosseno
// (WaveTracer, WavePeriodCopies, WaveLevelCounter, WaveSymmetry, WaveShift,
// ArcHeightCompare).

// Rótulo LaTeX do múltiplo k·π/2: 1 → π/2, 2 → π, 3 → 3π/2, −2 → −π.
export function halfPiLabel(k) {
  if (k === 0) return '0';
  const sign = k < 0 ? '-' : '';
  const n = Math.abs(k);
  if (n % 2 === 0) {
    const m = n / 2;
    return `${sign}${m === 1 ? '' : m}\\pi`;
  }
  return `${sign}\\frac{${n === 1 ? '' : n}\\pi}{2}`;
}

// Caminho SVG de uma curva y = f(x), amostrada de `step` em `step` pixels.
export function curvePath(f, x0, x1, toX, toY, step = 2) {
  if (x1 <= x0) return '';
  const px0 = toX(x0);
  const px1 = toX(x1);
  const n = Math.max(2, Math.ceil(Math.abs(px1 - px0) / step));
  let d = '';
  for (let i = 0; i <= n; i += 1) {
    const x = x0 + ((x1 - x0) * i) / n;
    d += `${i === 0 ? 'M' : 'L'} ${toX(x).toFixed(2)} ${toY(f(x)).toFixed(2)} `;
  }
  return d.trim();
}

// "=" quando o arredondamento a `digits` casas não perde nada; "≈" quando perde.
export const rel = (v, digits = 3) =>
  Math.abs(v - Number(v.toFixed(digits))) < 1e-9 ? '=' : '\\approx';

// Número com vírgula, sem "-0".
export function num(v, digits = 3) {
  const r = Number(v.toFixed(digits));
  return String(Object.is(r, -0) || Math.abs(r) < 1e-12 ? 0 : r).replace('.', '{,}');
}

// Número entre parênteses quando negativo (para "20 × (−0,5)").
export const paren = (v, digits = 3) => (v < -1e-12 ? `(${num(v, digits)})` : num(v, digits));

// Texto do giro com as voltas: 450 → "450° (1 volta e mais 90°)".
export function turnText(deg) {
  if (deg < 360) return `${deg}°`;
  const k = Math.floor(deg / 360);
  const rest = deg - 360 * k;
  const voltas = k === 1 ? '1 volta' : `${k} voltas`;
  return rest === 0 ? `${deg}° (${voltas})` : `${deg}° (${voltas} e mais ${rest}°)`;
}

export const TAU = 2 * Math.PI;
