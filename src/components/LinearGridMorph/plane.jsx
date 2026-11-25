import React from 'react';
import SvgMath from '../mathviz/SvgMath';

// Peças de desenho comuns às figuras da lição 11.6 (transformações lineares):
// LinearGridMorph, LinearColumnsDrag e LinearityCheck.
//
// Convenções iguais às do LinearMap: y para cima, tons 1 a 3, rótulos em
// KaTeX. e1 e a sua imagem no tom 1, e2 e a sua imagem no tom 2, o quadrado
// unitário e a sua imagem no tom 3, em preenchimento claro.

export const PAD = 28;

export const toneVar = (tone) =>
  tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';

export const lerp = (a, b, s) => a + (b - a) * s;
export const clamp01 = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x);

// Número em LaTeX com vírgula decimal; -0 vira 0.
export function num(value, digits = 2) {
  const r = Number(value.toFixed(digits));
  const v = Object.is(r, -0) ? 0 : r;
  return String(v).replace('.', '{,}');
}

// Número em texto comum, com vírgula e o sinal de menos tipográfico.
export function numText(value, digits = 2) {
  const r = Number(value.toFixed(digits));
  const v = Object.is(r, -0) ? 0 : r;
  return String(v).replace('.', ',').replace('-', '−');
}

// Par ordenado em LaTeX, no padrão da casa: (3,\ 4), e (0{,}6;\ 0{,}8) quando
// alguma coordenada tem vírgula.
export function pair(p, digits = 2) {
  const a = num(p[0], digits);
  const b = num(p[1], digits);
  const sep = a.includes('{,}') || b.includes('{,}') ? ';\\ ' : ',\\ ';
  return `(${a}${sep}${b})`;
}

export function pairText(p, digits = 2) {
  const a = numText(p[0], digits);
  const b = numText(p[1], digits);
  const sep = a.includes(',') || b.includes(',') ? '; ' : ', ';
  return `(${a}${sep}${b})`;
}

export function bmatrix(M, digits = 2) {
  return `\\begin{bmatrix} ${num(M[0][0], digits)} & ${num(M[0][1], digits)} \\\\ ${num(M[1][0], digits)} & ${num(M[1][1], digits)} \\end{bmatrix}`;
}

// Janela [xMin, xMax, yMin, yMax] → funções que levam coordenadas da
// matemática a pixels do SVG.
export function frame(win, unit, top = 0) {
  const [xMin, xMax, yMin, yMax] = win;
  const W = PAD * 2 + (xMax - xMin) * unit;
  const H = PAD * 2 + (yMax - yMin) * unit + top;
  const X = (x) => PAD + (x - xMin) * unit;
  const Y = (y) => top + PAD + (yMax - y) * unit;
  const P = (p) => [X(p[0]), Y(p[1])];
  return {W, H, X, Y, P, top, xMin, xMax, yMin, yMax, unit};
}

function headPath(b, ux, uy, size) {
  const bx = b[0] - ux * size;
  const by = b[1] - uy * size;
  const nx = -uy * size * 0.5;
  const ny = ux * size * 0.5;
  return `M ${b[0]} ${b[1]} L ${bx + nx} ${by + ny} L ${bx - nx} ${by - ny} Z`;
}

// Seta da matemática `from` → `to`. Sem `offset`, o rótulo vai um pouco além
// da ponta, na direção da seta, ancorado pela borda quando a seta aponta para
// o lado (como no LinearMap).
export function Arrow({
  f,
  from = [0, 0],
  to,
  tone,
  label,
  offset,
  dashed = false,
  width = 2.8,
  head = 11,
  fontSize = 13,
  opacity = 1,
}) {
  const a = f.P(from);
  const b = f.P(to);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (len < 3) return null;
  const ux = (b[0] - a[0]) / len;
  const uy = (b[1] - a[1]) / len;
  const h = Math.min(head, len * 0.6);
  const cut = Math.min(h * 0.8, len / 2);
  const end = [b[0] - ux * cut, b[1] - uy * cut];
  let anchor = 'middle';
  let dx;
  let dy;
  if (offset) {
    [dx, dy] = offset;
    anchor = offset[2] || 'middle';
  } else if (ux > 0.45) {
    anchor = 'start';
    dx = 8;
    dy = uy * 16;
  } else if (ux < -0.45) {
    anchor = 'end';
    dx = -8;
    dy = uy * 16;
  } else {
    dx = ux * 16;
    dy = uy * 20;
  }
  const color = toneVar(tone);
  return (
    <g opacity={opacity}>
      <line
        x1={a[0]}
        y1={a[1]}
        x2={end[0]}
        y2={end[1]}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 5' : undefined}
      />
      <path d={headPath(b, ux, uy, h)} fill={color} />
      {label && (
        <SvgMath x={b[0] + dx} y={b[1] + dy} anchor={anchor} math={label} fontSize={fontSize} tone={tone} halo />
      )}
    </g>
  );
}

// Rótulo solto numa posição da matemática, deslocado em pixels.
export function Label({f, at, math, tone, dx = 0, dy = 0, anchor = 'middle', fontSize = 13}) {
  const p = f.P(at);
  return <SvgMath x={p[0] + dx} y={p[1] + dy} anchor={anchor} math={math} fontSize={fontSize} tone={tone} halo />;
}

// Malha original, fixa e clara, com os eixos.
export function FixedGrid({f, clipId}) {
  const xs = [];
  for (let x = Math.ceil(f.xMin); x <= Math.floor(f.xMax); x += 1) xs.push(x);
  const ys = [];
  for (let y = Math.ceil(f.yMin); y <= Math.floor(f.yMax); y += 1) ys.push(y);
  const top = f.Y(f.yMax);
  const bottom = f.Y(f.yMin);
  const left = f.X(f.xMin);
  const right = f.X(f.xMax);
  return (
    <g clipPath={clipId ? `url(#${clipId})` : undefined}>
      {xs.map((x) => (
        <line key={`x${x}`} x1={f.X(x)} y1={top} x2={f.X(x)} y2={bottom} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
      ))}
      {ys.map((y) => (
        <line key={`y${y}`} x1={left} y1={f.Y(y)} x2={right} y2={f.Y(y)} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
      ))}
    </g>
  );
}

export function Axes({f}) {
  return (
    <g>
      <line x1={f.X(f.xMin)} y1={f.Y(0)} x2={f.X(f.xMax)} y2={f.Y(0)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
      <line x1={f.X(0)} y1={f.Y(f.yMin)} x2={f.X(0)} y2={f.Y(f.yMax)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
    </g>
  );
}

// A malha levada pelo mapa `map` (ponto → ponto). Com `curved`, cada linha é
// amostrada em muitos pontos, para mostrar o mapa que entorta; sem, cada
// linha reta é desenhada pelas duas pontas.
export function MovedGrid({f, map, extent = 6, curved = false, clipId}) {
  const ks = [];
  for (let k = -extent; k <= extent; k += 1) ks.push(k);
  const N = curved ? 48 : 1;
  const line = (p0, p1) => {
    const pts = [];
    for (let i = 0; i <= N; i += 1) {
      const s = i / N;
      pts.push(f.P(map([lerp(p0[0], p1[0], s), lerp(p0[1], p1[1], s)])));
    }
    return pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ');
  };
  return (
    <g clipPath={clipId ? `url(#${clipId})` : undefined} fill="none">
      {ks.map((k) => (
        <g key={k} stroke="var(--mv-guide)" strokeWidth={k === 0 ? 2 : 1.1}>
          <path d={`M ${line([k, -extent], [k, extent])}`} />
          <path d={`M ${line([-extent, k], [extent, k])}`} />
        </g>
      ))}
    </g>
  );
}

// Polígono levado pelo mapa; as arestas são amostradas quando `curved`.
export function polygonPath(f, pts, map, curved = false) {
  const N = curved ? 16 : 1;
  const out = [];
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length];
    for (let j = 0; j < N; j += 1) {
      const s = j / N;
      out.push(f.P(map([lerp(p[0], q[0], s), lerp(p[1], q[1], s)])));
    }
  });
  return `M ${out.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} Z`;
}

export function ClipDefs({f, id}) {
  return (
    <defs>
      <clipPath id={id}>
        <rect x={f.X(f.xMin)} y={f.Y(f.yMax)} width={f.X(f.xMax) - f.X(f.xMin)} height={f.Y(f.yMin) - f.Y(f.yMax)} />
      </clipPath>
    </defs>
  );
}

export function Dot({f, at, tone, r = 4.5, open = false}) {
  const p = f.P(at);
  return (
    <circle
      cx={p[0]}
      cy={p[1]}
      r={r}
      fill={open ? 'var(--mv-paper)' : toneVar(tone)}
      stroke={toneVar(tone)}
      strokeWidth={open ? 2 : 1}
    />
  );
}
