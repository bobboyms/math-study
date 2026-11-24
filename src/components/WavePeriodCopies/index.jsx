import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {makeFrame} from '../WaveTracer/frame';
import {curvePath, TAU} from '../WaveTracer/wave';

// O período como cópia: o trecho de uma volta (0 a 2π) é copiado e deslizado
// 2π para a direita e 2π para a esquerda. Cada cópia pousa exatamente sobre
// a continuação da curva. O quadro final mostra três voltas, cada uma com o
// colchete "2π".

const DURATION = 4.2;

export default function WavePeriodCopies({fn = 'sin', caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const f = fn === 'sin' ? Math.sin : Math.cos;
  const tone = fn === 'sin' ? 2 : 3;
  const fr = makeFrame({xMin: -TAU - 0.25, xMax: 2 * TAU + 0.25, G: 30, K: 46, top: 40, labelZero: false});
  const {gx, gy, W, H} = fr;

  const show0 = stage(t, 0, 0.7);
  const right = stage(t, 0.9, 2.4);
  const leftP = stage(t, 2.6, 4.1);

  const block = (offset, opacity, key, final) => {
    const x0 = offset;
    const x1 = offset + TAU;
    return (
      <g key={key} opacity={opacity}>
        <rect x={gx(x0)} y={gy(1.15)} width={gx(x1) - gx(x0)} height={gy(-1.15) - gy(1.15)} fill={`var(--mv-tone-${tone})`} fillOpacity={offset === 0 ? 0.12 : 0.06} />
        <path d={curvePath((x) => f(x - offset), x0, x1, gx, gy)} fill="none" stroke={`var(--mv-tone-${tone})`} strokeWidth={2.5} />
        {final && (
          <g>
            <line x1={gx(x0) + 2} y1={gy(1.15) - 12} x2={gx(x1) - 2} y2={gy(1.15) - 12} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
            <line x1={gx(x0) + 2} y1={gy(1.15) - 17} x2={gx(x0) + 2} y2={gy(1.15) - 7} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
            <line x1={gx(x1) - 2} y1={gy(1.15) - 17} x2={gx(x1) - 2} y2={gy(1.15) - 7} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
            <SvgMath x={(gx(x0) + gx(x1)) / 2} y={gy(1.15) - 24} math={offset === 0 ? '2\\pi\\text{: uma volta}' : '2\\pi'} fontSize={13} halo />
          </g>
        )}
      </g>
    );
  };

  const done = right >= 1 && leftP >= 1;

  return (
    <div className={shared.wrapper} data-explorer="wave-period-copies">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="O trecho de 0 a 2π copiado 2π para a direita e 2π para a esquerda: as cópias continuam a curva.">
          {fr.axes}
          {[-1, 0, 1, 2].map((k) => (
            <line key={k} x1={gx(k * TAU)} y1={gy(1.15)} x2={gx(k * TAU)} y2={gy(-1.15)} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="4 4" />
          ))}
          {/* a curva verdadeira, tracejada: é onde as cópias precisam pousar */}
          <path d={curvePath(f, -TAU - 0.25, 2 * TAU + 0.25, gx, gy)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="3 4" />
          {/* cópias: só aparecem quando começam a andar */}
          {right > 0 && block(TAU * right, 1, 'r', done)}
          {leftP > 0 && block(-TAU * leftP, 1, 'l', done)}
          {block(0, show0, 'o', done)}
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'O trecho de uma volta, de 0 a 2π, é copiado e arrastado 2π para a direita e 2π para a esquerda. Cada cópia pousa exatamente sobre a continuação da curva.'}
        </figcaption>
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver as cópias de novo
        </button>
      </div>
    </div>
  );
}
