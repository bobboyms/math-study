import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import {halfPiLabel} from './wave';

// Janela de gráfico em radianos, com eixos, múltiplos de π/2 e as alturas
// marcadas. Devolve as funções de conversão e o desenho dos eixos, para as
// figuras da lição dos gráficos do seno e do cosseno.
//
//   const fr = makeFrame({xMin: -2 * Math.PI, xMax: 4 * Math.PI, G: 30});
//   <svg viewBox={`0 0 ${fr.W} ${fr.H}`}> {fr.axes} ... fr.gx(x), fr.gy(y) </svg>

export function makeFrame({
  xMin,
  xMax,
  yMin = -1.35,
  yMax = 1.35,
  G = 40, // pixels por radiano
  K, // pixels por unidade vertical (padrão: igual a G, a mesma escala)
  left = 30,
  right = 30,
  top = 18,
  bottom = 26,
  tickEvery, // em múltiplos de π/2 (padrão: 1 se couber, senão 2)
  yTicks = [-1, 1],
  xName = 'x',
  yName,
  labelZero = true,
}) {
  const Ky = K ?? G;
  const gx = (x) => left + (x - xMin) * G;
  const gy = (y) => top + (yMax - y) * Ky;
  const W = Math.ceil(gx(xMax) + right);
  const H = Math.ceil(gy(yMin) + bottom);
  const every = tickEvery ?? (G * (Math.PI / 2) >= 34 ? 1 : 2);
  const kMin = Math.ceil(xMin / (Math.PI / 2));
  const kMax = Math.floor(xMax / (Math.PI / 2));
  const ticks = [];
  for (let k = kMin; k <= kMax; k += 1) {
    if (k !== 0 && k % every === 0) ticks.push(k);
  }
  const ox = gx(0);
  const oy = gy(0);
  const showY = xMin <= 0 && xMax >= 0;

  const axes = (
    <g>
      {yTicks.map((yv) => (
        <line key={`g${yv}`} x1={gx(xMin)} y1={gy(yv)} x2={gx(xMax)} y2={gy(yv)} stroke="var(--mv-guide)" strokeWidth={0.75} strokeDasharray="2 5" />
      ))}
      <line x1={gx(xMin) - 6} y1={oy} x2={gx(xMax) + 14} y2={oy} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
      <path d={`M ${gx(xMax) + 14} ${oy} l -7 -4 v 8 z`} fill="var(--ifm-color-emphasis-700)" />
      <SvgMath x={gx(xMax) + 14} y={oy - 13} math={xName} fontSize={13} />
      {showY && (
        <>
          <line x1={ox} y1={gy(yMin)} x2={ox} y2={gy(yMax) - 4} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={`M ${ox} ${gy(yMax) - 10} l -4 7 h 8 z`} fill="var(--ifm-color-emphasis-700)" />
          {yName && <SvgMath x={ox + 8} y={gy(yMax) - 2} math={yName} anchor="start" fontSize={13} space={110} />}
        </>
      )}
      {ticks.map((k) => {
        const x = gx((k * Math.PI) / 2);
        return (
          <g key={k}>
            <line x1={x} y1={oy - 4} x2={x} y2={oy + 4} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
            <SvgMath x={x} y={oy + 16} math={halfPiLabel(k)} fontSize={12} halo />
          </g>
        );
      })}
      {showY && yTicks.map((yv) => (
        <SvgMath key={`l${yv}`} x={ox - 6} y={gy(yv)} math={String(yv).replace('.', '{,}')} anchor="end" fontSize={12} halo space={40} />
      ))}
      {showY && labelZero && <SvgMath x={ox - 6} y={oy + 12} math="0" anchor="end" fontSize={12} space={30} />}
    </g>
  );

  return {gx, gy, W, H, axes, G, K: Ky};
}
