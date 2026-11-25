import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {curvePath} from '../WaveTracer/wave';
import {PI, TAU, piLabel} from '../TrigEqCycleLine/angles';

// sen(2x) = 1/2 com x entre 0 e 2π.
//
// Em cima, o argumento u = 2x, que percorre de 0 a 4π: duas voltas, quatro
// encontros com a reta y = 1/2. Embaixo, na mesma escala, o x, que percorre
// só de 0 a 2π. Cada encontro de cima desce até a metade do seu valor
// (x = u/2), e a curva sen(2x) se desenha por eles. O tracejado de baixo é
// sen x, que tem só dois encontros no mesmo intervalo.

const G = 40; // pixels por radiano, igual nos dois painéis
const K = 34; // pixels por unidade vertical
const LEFT = 44;
const W = Math.ceil(LEFT + 4 * PI * G + 84);
const TOP1 = 34; // y = 1,35 do painel de cima
const TOP2 = TOP1 + 2.7 * K + 62; // y = 1,35 do painel de baixo
const H = Math.ceil(TOP2 + 2.7 * K + 30);
const DURATION = 4.6;
const C = 0.5;

const gx = (x) => LEFT + x * G;
const gy1 = (y) => TOP1 + (1.35 - y) * K;
const gy2 = (y) => TOP2 + (1.35 - y) * K;

// As quatro soluções de sen u = 1/2 em [0, 4π]: duas famílias.
const U = [
  {u: PI / 6, fam: 0},
  {u: (5 * PI) / 6, fam: 1},
  {u: PI / 6 + TAU, fam: 0},
  {u: (5 * PI) / 6 + TAU, fam: 1},
];
const TONES = [1, 3];

function Axes({gy, xMax, name, ticks}) {
  return (
    <g>
      <line x1={gx(0) - 6} y1={gy(0)} x2={gx(xMax) + 16} y2={gy(0)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
      <path d={`M ${gx(xMax) + 16} ${gy(0)} l -7 -4 v 8 z`} fill="var(--ifm-color-emphasis-700)" />
      <SvgMath x={gx(xMax) + 21} y={gy(0)} math={name} anchor="start" fontSize={13} space={64} halo />
      <line x1={gx(0)} y1={gy(-1.25)} x2={gx(0)} y2={gy(1.3)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
      {[-1, 1].map((v) => (
        <g key={v}>
          <line x1={gx(0)} y1={gy(v)} x2={gx(xMax)} y2={gy(v)} stroke="var(--mv-guide)" strokeWidth={0.75} strokeDasharray="2 5" />
          <SvgMath x={gx(0) - 6} y={gy(v)} math={String(v)} anchor="end" fontSize={12} space={30} />
        </g>
      ))}
      {ticks.map((x) => (
        <g key={x}>
          <line x1={gx(x)} y1={gy(0) - 4} x2={gx(x)} y2={gy(0) + 4} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
          <SvgMath x={gx(x)} y={gy(0) + 16} math={piLabel(x)} fontSize={12} halo space={40} />
        </g>
      ))}
    </g>
  );
}

export default function TrigEqArgument({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const pulse = stage(t, 0, 0.7);
  const fall = stage(t, 0.9, 2.6);
  const trace = stage(t, 2.8, 4.2);
  const ghost = stage(t, 4.0, 4.6);

  return (
    <div className={shared.wrapper} data-explorer="trig-eq-argument">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="Em cima, sen u = 1/2 com u de 0 a 4π: quatro encontros. Embaixo, x = u/2 de 0 a 2π: os mesmos quatro encontros, em π/12, 5π/12, 13π/12 e 17π/12.">
          {/* painel de cima: o argumento u = 2x */}
          <rect x={gx(0)} y={gy1(1.3)} width={4 * PI * G} height={gy1(-1.25) - gy1(1.3)} fill="var(--mv-tone-2)" fillOpacity={0.05} />
          <Axes gy={gy1} xMax={4 * PI} name="u = 2x" ticks={[PI, TAU, 3 * PI, 4 * PI]} />
          <path d={curvePath(Math.sin, 0, 4 * PI, gx, gy1)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2.25} />
          <line x1={gx(0)} y1={gy1(C)} x2={gx(4 * PI)} y2={gy1(C)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} strokeDasharray="6 4" />
          <SvgMath x={gx(2 * PI)} y={TOP1 - 18} math="u = 2x\text{ anda de } 0 \text{ a } 4\pi\text{: duas voltas}" fontSize={13} halo />
          {U.map((p) => (
            <g key={`u${p.u}`}>
              <circle cx={gx(p.u)} cy={gy1(C)} r={5 + 2 * (1 - pulse)} fill={`var(--mv-tone-${TONES[p.fam]})`} stroke="var(--mv-paper)" strokeWidth={1.5} />
              <SvgMath x={gx(p.u) + (p.fam === 0 ? -7 : 7)} y={gy1(C) - 16} math={piLabel(p.u)} anchor={p.fam === 0 ? 'end' : 'start'} fontSize={12} tone={TONES[p.fam]} halo space={60} />
            </g>
          ))}

          {/* painel de baixo: o x */}
          <rect x={gx(0)} y={gy2(1.3)} width={2 * PI * G} height={gy2(-1.25) - gy2(1.3)} fill="var(--mv-tone-2)" fillOpacity={0.05} />
          <Axes gy={gy2} xMax={2 * PI} name="x" ticks={[PI / 2, PI, (3 * PI) / 2, TAU]} />
          <SvgMath x={gx(2 * PI) + 30} y={gy2(1.15)} math="\text{o } x \text{ anda de } 0 \text{ a } 2\pi" anchor="start" fontSize={13} space={W - gx(2 * PI) - 32} halo />
          {ghost > 0 && (
            <g opacity={ghost}>
              <path d={curvePath(Math.sin, 0, TAU, gx, gy2)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.75} strokeDasharray="4 4" />
              {[PI / 6, (5 * PI) / 6].map((x) => (
                <circle key={x} cx={gx(x)} cy={gy2(C)} r={4} fill="var(--mv-paper)" stroke="var(--mv-guide)" strokeWidth={1.75} />
              ))}
              <SvgMath x={gx(2 * PI) + 30} y={gy2(-0.55)} math="\text{tracejado: } \sen x" anchor="start" fontSize={12} space={W - gx(2 * PI) - 32} halo />
            </g>
          )}
          {trace > 0 && (
            <path d={curvePath((x) => Math.sin(2 * x), 0, TAU * trace, gx, gy2)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2.25} />
          )}
          {trace >= 1 && (
            <SvgMath x={gx(2 * PI) + 30} y={gy2(0.6)} math="\sen(2x)" anchor="start" fontSize={13} tone={2} space={W - gx(2 * PI) - 32} halo />
          )}
          <line x1={gx(0)} y1={gy2(C)} x2={gx(2 * PI)} y2={gy2(C)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} strokeDasharray="6 4" />

          {/* cada encontro desce até a metade do seu valor */}
          {fall > 0 && U.map((p) => {
            const x0 = gx(p.u);
            const y0 = gy1(C);
            const x1 = gx(p.u / 2);
            const y1 = gy2(C);
            const x = x0 + (x1 - x0) * fall;
            const y = y0 + (y1 - y0) * fall;
            const tone = TONES[p.fam];
            return (
              <g key={`d${p.u}`}>
                <line x1={x0} y1={y0} x2={x} y2={y} stroke={`var(--mv-tone-${tone})`} strokeWidth={1} strokeDasharray="3 4" opacity={0.7} />
                <circle cx={x} cy={y} r={5} fill={`var(--mv-tone-${tone})`} stroke="var(--mv-paper)" strokeWidth={1.5} />
                {fall >= 1 && (
                  <SvgMath x={x1 + (p.fam === 0 ? -7 : 7)} y={y1 - 16} math={piLabel(p.u / 2)} anchor={p.fam === 0 ? 'end' : 'start'} fontSize={12} tone={tone} halo space={60} />
                )}
              </g>
            );
          })}
          {fall > 0.3 && (
            <SvgMath x={gx(2.9 * PI)} y={(gy1(-1.25) + gy2(1.3)) / 2} math="x = \tfrac{u}{2}" fontSize={14} halo />
          )}
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'Em cima, o argumento u = 2x anda duas voltas e encontra a altura 1/2 quatro vezes. Cada encontro desce até a metade do seu valor, porque x = u/2. Embaixo, sen(2x) passa pelos quatro; o tracejado sen x só passa por dois.'}
        </figcaption>
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
