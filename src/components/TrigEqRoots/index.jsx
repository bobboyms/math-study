import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {PI, angleShort, angleRel, mod2pi, plain} from '../TrigEqCycleLine/angles';

// Da equação em u = sen x de volta aos ângulos.
//
// À esquerda, uma régua vertical com os valores de u encontrados pela
// álgebra. A faixa verde é onde o seno mora, de −1 a 1. Cada valor de u vira
// uma reta horizontal na mesma altura, que atravessa o ciclo: os pontos de
// encontro são os ângulos x com sen x = u. Um u fora da faixa passa por cima
// (ou por baixo) do círculo e não dá ângulo nenhum.
//
//   <TrigEqRoots sets={[
//     {label: '2u² − u − 1 = 0', roots: [{u: 1, tex: '1'}, {u: -0.5, tex: '-\\frac{1}{2}'}]},
//   ]} />

const W = 430;
const R = 76;
const RULER = 58;
const CX = 286;
const U_MAX = 2.35;
const U_MIN = -1.4;
const CY = 22 + U_MAX * R;
const H = Math.ceil(CY - U_MIN * R + 18);
const sy = (u) => CY - u * R;
const sx = (x) => CX + x * R;
const PER = 1.4; // segundos por raiz

function anglesFor(u) {
  if (Math.abs(u) > 1 + 1e-9) return [];
  const a = Math.asin(Math.max(-1, Math.min(1, u)));
  const out = [mod2pi(a), mod2pi(PI - a)];
  return out.filter((x, i) => out.findIndex((y) => Math.abs(y - x) < 1e-7) === i).sort((p, q) => p - q);
}

export default function TrigEqRoots({sets, caption}) {
  const [which, setWhich] = useState(0);
  const set = sets[which];
  const duration = 0.4 + PER * set.roots.length;
  const {ref, t, play, playing} = useAnimation({duration});
  const choose = (i) => {
    setWhich(i);
    play({duration: 0.4 + PER * sets[i].roots.length});
  };

  const ticks = [-1, -0.5, 0, 0.5, 1, 2];
  const total = set.roots.reduce((n, r) => n + anglesFor(r.u).length, 0);

  return (
    <div className={shared.wrapper} data-explorer="trig-eq-roots">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Valores de u na régua e as retas horizontais no ciclo: ${total} ângulos.`}>
          {/* régua de u, com a faixa do seno */}
          <line x1={RULER} y1={sy(U_MIN + 0.1)} x2={RULER} y2={sy(U_MAX - 0.05)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={`M ${RULER} ${sy(U_MAX - 0.05) - 6} l -4 7 h 8 z`} fill="var(--ifm-color-emphasis-700)" />
          <SvgMath x={RULER + 8} y={sy(U_MAX - 0.12)} math="u" anchor="start" fontSize={14} space={30} />
          <line x1={RULER} y1={sy(1)} x2={RULER} y2={sy(-1)} stroke="var(--mv-tone-3)" strokeWidth={8} opacity={0.55} />
          {ticks.map((v) => (
            <g key={v}>
              <line x1={RULER - 5} y1={sy(v)} x2={RULER + 5} y2={sy(v)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={RULER - 9} y={sy(v)} math={v === 0.5 ? '\\tfrac{1}{2}' : v === -0.5 ? '-\\tfrac{1}{2}' : String(v)} anchor="end" fontSize={12} space={44} />
            </g>
          ))}
          <SvgMath x={RULER + 10} y={sy(-1.22)} math="\text{faixa do seno: de } {-1} \text{ a } 1" anchor="start" tone={3} fontSize={11} space={170} halo />

          {/* ciclo */}
          <line x1={sx(-1.4)} y1={CY} x2={sx(1.45)} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <line x1={CX} y1={sy(1.35)} x2={CX} y2={sy(-1.3)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2} />
          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />

          {set.roots.map((r, i) => {
            const t0 = 0.4 + PER * i;
            const grow = stage(t, t0, t0 + 0.8);
            const pts = stage(t, t0 + 0.75, t0 + 1.1);
            const angles = anglesFor(r.u);
            const xEnd = sx(1.42);
            const xNow = RULER + (xEnd - RULER) * grow;
            const outside = angles.length === 0;
            return (
              <g key={`${which}-${i}`}>
                <circle cx={RULER} cy={sy(r.u)} r={6} fill={outside ? 'var(--mv-paper)' : 'var(--mv-tone-1)'} stroke="var(--mv-tone-1)" strokeWidth={2} />
                {grow > 0 && (
                  <line x1={RULER} y1={sy(r.u)} x2={xNow} y2={sy(r.u)} stroke="var(--mv-tone-1)" strokeWidth={2} strokeDasharray={outside ? '6 4' : undefined} />
                )}
                {pts > 0 && outside && (
                  <SvgMath x={xEnd} y={sy(r.u) - 14} math={`u = ${r.tex}\\text{: nenhum ponto}`} anchor="end" fontSize={12} tone={1} halo space={200} />
                )}
                {pts > 0 && angles.map((a) => {
                  const px = Math.cos(a);
                  const out = px >= 0 ? 1 : -1;
                  const lx = sx(px) + out * 22;
                  const ly = sy(Math.sin(a)) + (r.u < 0 ? 15 : -15);
                  const top = angles.length === 1;
                  return (
                    <g key={a} opacity={pts}>
                      <circle cx={sx(px)} cy={sy(Math.sin(a))} r={6} fill="var(--mv-tone-2)" stroke="var(--mv-paper)" strokeWidth={1.75} />
                      <SvgMath x={top ? sx(px) + 10 : lx} y={top ? sy(Math.sin(a)) - 15 : ly} math={angleShort(a)} anchor={top ? 'start' : out > 0 ? 'start' : 'end'} tone={2} fontSize={14} halo space={80} />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'Cada valor de u encontrado pela álgebra (régua da esquerda) vira uma reta horizontal na mesma altura. Os pontos em que ela corta o ciclo são os ângulos x com sen x = u.'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite">
        {set.roots.map((r, i) => {
          const angles = anglesFor(r.u);
          return (
            <p key={i}>
              <Formula math={`u = ${r.tex}`} />:{' '}
              {angles.length === 0 ? (
                <>nenhum ângulo, porque {plain(r.u)} está fora da faixa de −1 a 1.</>
              ) : (
                <>
                  <Formula math={`\\sen x = ${r.tex}`} /> dá{' '}
                  {angles.map((a, j) => (
                    <span key={a}>
                      {j > 0 && ' e '}
                      <Formula math={`x ${angleRel(a)}`} />
                    </span>
                  ))}
                  .
                </>
              )}
            </p>
          );
        })}
        <p>
          Entre 0 e <Formula math="2\pi" />: <strong>{total} {total === 1 ? 'solução' : 'soluções'}</strong>.
        </p>
      </div>
      <div className={shared.buttons}>
        {sets.length > 1 && sets.map((s, i) => (
          <button key={s.label} type="button" onClick={() => choose(i)} aria-pressed={which === i} disabled={playing}>
            {s.label}
          </button>
        ))}
        <button type="button" onClick={() => play({duration})} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
