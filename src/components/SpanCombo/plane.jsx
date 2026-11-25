import React, {useId} from 'react';
import SvgMath from '../mathviz/SvgMath';

// Plano cartesiano mínimo para as figuras da lição 11.5.
//
// O CartesianPlane não recorta setas nem aceita opacidade por traço, e estas
// figuras precisam das duas coisas: malhas que aparecem aos poucos e um rastro
// de pontos. Aqui, tudo o que vem de `clipped` é recortado pela janela; o que
// vem de `over` (pontos e rótulos) fica por cima, sem recorte.

export const toneVar = (tone) => (tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)');

export function arrowHead(x, y, dx, dy, size = 10) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x - ux * size;
  const by = y - uy * size;
  const nx = -uy * size * 0.5;
  const ny = ux * size * 0.5;
  return `M ${x} ${y} L ${bx + nx} ${by + ny} L ${bx - nx} ${by - ny} Z`;
}

export function makePlane({xMin, xMax, yMin, yMax}, unit, pad = 26) {
  const W = pad * 2 + (xMax - xMin) * unit;
  const H = pad * 2 + (yMax - yMin) * unit;
  const X = (x) => pad + (x - xMin) * unit;
  const Y = (y) => pad + (yMax - y) * unit;
  const P = (p) => [X(p[0]), Y(p[1])];
  return {W, H, X, Y, P, pad, unit, xMin, xMax, yMin, yMax};
}

// Reta pela janela inteira, passando por `a` com direção `d`.
export function fullLine(pl, a, d) {
  const big = 4 * (pl.xMax - pl.xMin + pl.yMax - pl.yMin);
  const n = Math.hypot(d[0], d[1]) || 1;
  const e = [(d[0] / n) * big, (d[1] / n) * big];
  return [pl.P([a[0] - e[0], a[1] - e[1]]), pl.P([a[0] + e[0], a[1] + e[1]])];
}

export function Arrow({pl, from, to, tone, width = 2.6, dashed = false, opacity = 1}) {
  const a = pl.P(from);
  const b = pl.P(to);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (len < 1.5) return null;
  const head = Math.min(10, len * 0.6);
  const cut = Math.min(head * 0.8, len / 2);
  const end = [b[0] - ((b[0] - a[0]) / len) * cut, b[1] - ((b[1] - a[1]) / len) * cut];
  return (
    <g opacity={opacity}>
      <line
        x1={a[0]}
        y1={a[1]}
        x2={end[0]}
        y2={end[1]}
        stroke={toneVar(tone)}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 5' : undefined}
      />
      <path d={arrowHead(b[0], b[1], b[0] - a[0], b[1] - a[1], head)} fill={toneVar(tone)} />
    </g>
  );
}

export default function MiniPlane({pl, ticksEvery = 1, axisLabels = ['x', 'y'], clipped, over, ariaLabel, maxWidth}) {
  const uid = useId().replace(/:/g, '-');
  const {W, H, X, Y, pad} = pl;
  const ox = Math.min(Math.max(X(0), pad), W - pad);
  const oy = Math.min(Math.max(Y(0), pad), H - pad);
  const xs = [];
  for (let v = Math.ceil(pl.xMin / ticksEvery) * ticksEvery; v <= pl.xMax; v += ticksEvery) if (v !== 0) xs.push(v);
  const ys = [];
  for (let v = Math.ceil(pl.yMin / ticksEvery) * ticksEvery; v <= pl.yMax; v += ticksEvery) if (v !== 0) ys.push(v);
  const minus = (v) => String(v).replace('-', '−');
  return (
    <svg
      viewBox={`0 0 ${W.toFixed(1)} ${H.toFixed(1)}`}
      style={{display: 'block', width: '100%', maxWidth: `${maxWidth ?? W}px`, height: 'auto', margin: '0 auto'}}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect x={pad} y={pad} width={W - 2 * pad} height={H - 2 * pad} />
        </clipPath>
      </defs>
      <line x1={pad - 8} y1={oy} x2={W - pad + 8} y2={oy} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
      <line x1={ox} y1={H - pad + 8} x2={ox} y2={pad - 8} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
      <path d={arrowHead(W - pad + 8, oy, 1, 0, 8)} fill="var(--ifm-color-emphasis-600)" />
      <path d={arrowHead(ox, pad - 8, 0, -1, 8)} fill="var(--ifm-color-emphasis-600)" />
      {xs.map((v) => (
        <g key={`x${v}`}>
          <line x1={X(v)} x2={X(v)} y1={oy - 3} y2={oy + 3} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          <text x={X(v)} y={oy + 15} textAnchor="middle" fontSize={11} fill="var(--ifm-color-emphasis-800)" style={{fontFamily: 'KaTeX_Main, Georgia, serif'}}>
            {minus(v)}
          </text>
        </g>
      ))}
      {ys.map((v) => (
        <g key={`y${v}`}>
          <line x1={ox - 3} x2={ox + 3} y1={Y(v)} y2={Y(v)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          <text x={ox - 6} y={Y(v) + 4} textAnchor="end" fontSize={11} fill="var(--ifm-color-emphasis-800)" style={{fontFamily: 'KaTeX_Main, Georgia, serif'}}>
            {minus(v)}
          </text>
        </g>
      ))}
      {axisLabels && (
        <>
          <SvgMath x={W - pad + 4} y={oy - 14} math={axisLabels[0]} fontSize={13} anchor="end" space={40} />
          <SvgMath x={ox + 14} y={pad - 6} math={axisLabels[1]} fontSize={13} />
        </>
      )}
      <g clipPath={`url(#clip-${uid})`}>{clipped}</g>
      {over}
    </svg>
  );
}
