import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {makeFrame} from '../WaveTracer/frame';
import {curvePath} from '../WaveTracer/wave';
import {PI, TAU, piLabel, valueTex, num} from '../TrigEqCycleLine/angles';

// Todas as soluções saem de uma volta: os dois pontos de encontro da volta
// de 0 a 2π (k = 0) são copiados 2π para a direita (k = 1) e 2π para a
// esquerda (k = −1). Cada cópia pousa sobre um encontro da reta com a curva.
// Uma família de pontos (α + 2kπ) e a outra (o espelho + 2kπ) têm tons
// diferentes, e a tabela abaixo da figura lista os valores com o seu k.

const DURATION = 4.4;

export default function TrigEqCopies({fn = 'sin', value = 0.5, caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const f = fn === 'sin' ? Math.sin : Math.cos;
  const curveTone = fn === 'sin' ? 2 : 3;
  const tones = fn === 'sin' ? [1, 3] : [1, 2];
  const name = fn === 'sin' ? '\\sen' : '\\cos';
  const alpha = fn === 'sin' ? Math.asin(value) : Math.acos(value);
  // As duas soluções da volta de 0 a 2π, cada uma com a sua família.
  const fam = fn === 'sin'
    ? [{x0: alpha < 0 ? alpha + TAU : alpha, tex: '\\alpha'}, {x0: PI - alpha, tex: '\\pi - \\alpha'}]
    : [{x0: alpha, tex: '\\alpha'}, {x0: TAU - alpha, tex: '-\\alpha'}];

  const fr = makeFrame({xMin: -TAU - 0.2, xMax: 2 * TAU + 0.2, G: 28, K: 50, top: 62, tickEvery: 100, labelZero: false});
  const {gx, gy, W, H} = fr;

  const show0 = stage(t, 0, 0.8);
  const right = stage(t, 1.0, 2.5);
  const left = stage(t, 2.7, 4.2);

  const pointsAt = (offset, opacity, key) => (
    <g key={key} opacity={opacity}>
      {fam.map((p, i) => (
        <g key={i}>
          <line x1={gx(p.x0 + offset)} y1={gy(value)} x2={gx(p.x0 + offset)} y2={gy(0)} stroke={`var(--mv-tone-${tones[i]})`} strokeWidth={1} strokeDasharray="3 3" />
          <circle cx={gx(p.x0 + offset)} cy={gy(value)} r={5.5} fill={`var(--mv-tone-${tones[i]})`} stroke="var(--mv-paper)" strokeWidth={1.5} />
        </g>
      ))}
    </g>
  );

  const bracket = (k, opacity) => {
    const x0 = gx(k * TAU) + 3;
    const x1 = gx((k + 1) * TAU) - 3;
    const y = gy(1.35) - 18;
    return (
      <g key={`b${k}`} opacity={opacity}>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
        <line x1={x0} y1={y - 5} x2={x0} y2={y + 5} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
        <line x1={x1} y1={y - 5} x2={x1} y2={y + 5} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
        <SvgMath x={(x0 + x1) / 2} y={y - 14} math={`k = ${k}`} fontSize={13} halo />
      </g>
    );
  };

  // Tabela: k = −1, 0, 1 para as duas famílias.
  const cell = (x) => {
    const p = piLabel(x);
    return p ? `${p}` : `\\approx ${num(x, 2)}`;
  };
  const kTex = (k) => (k === 0 ? '' : k === 1 ? ' + 2\\pi' : k === -1 ? ' - 2\\pi' : ` ${k > 0 ? '+' : '-'} ${2 * Math.abs(k)}\\pi`);

  return (
    <div className={shared.wrapper} data-explorer="trig-eq-copies">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Os dois encontros da volta de 0 a 2π copiados uma volta para cada lado: todas as soluções de ${fn} x = ${num(value, 2)}.`}>
          {fr.axes}
          {[-1, 0, 1, 2].map((k) => (
            <line key={k} x1={gx(k * TAU)} y1={gy(1.2)} x2={gx(k * TAU)} y2={gy(-1.2)} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="4 4" />
          ))}
          <rect x={gx(0)} y={gy(1.2)} width={gx(TAU) - gx(0)} height={gy(-1.2) - gy(1.2)} fill={`var(--mv-tone-${curveTone})`} fillOpacity={0.08} />
          <path d={curvePath(f, -TAU - 0.2, 2 * TAU + 0.2, gx, gy)} fill="none" stroke={`var(--mv-tone-${curveTone})`} strokeWidth={2.25} />
          <line x1={gx(-TAU - 0.2)} y1={gy(value)} x2={gx(2 * TAU + 0.2)} y2={gy(value)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} strokeDasharray="6 4" />
          <SvgMath x={gx(1.5 * PI)} y={gy(value) - 13} math={`y = ${valueTex(value)}`} fontSize={12} halo space={80} />
          {/* marcas das voltas, depois da curva: rótulo à direita do traço, onde o seno ainda está acima do eixo */}
          {[-1, 1, 2].map((k) => (
            <g key={`t${k}`}>
              <line x1={gx(k * TAU)} y1={gy(0) - 4} x2={gx(k * TAU)} y2={gy(0) + 4} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={gx(k * TAU) + 5} y={gy(0) + 15} math={piLabel(k * TAU)} anchor="start" fontSize={12} halo space={40} />
            </g>
          ))}
          {bracket(0, show0)}
          {right > 0 && bracket(1, right >= 1 ? 1 : 0.35)}
          {left > 0 && bracket(-1, left >= 1 ? 1 : 0.35)}
          {right > 0 && pointsAt(TAU * right, 1, 'r')}
          {left > 0 && pointsAt(-TAU * left, 1, 'l')}
          {pointsAt(0, show0, 'o')}
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'Os dois encontros da volta de 0 a 2π (k = 0) são copiados uma volta para a direita (k = 1) e uma para a esquerda (k = −1). Cada cópia cai em cima de outro encontro da reta com a curva.'}
        </figcaption>
      </figure>
      <div className={shared.readout}>
        <table>
          <thead>
            <tr>
              <th><Formula math="k" /></th>
              <th style={{color: `var(--mv-tone-${tones[0]})`}}><Formula math={`${fam[0].tex} + 2k\\pi`} /></th>
              <th style={{color: `var(--mv-tone-${tones[1]})`}}><Formula math={`${fam[1].tex} + 2k\\pi`} /></th>
            </tr>
          </thead>
          <tbody>
            {[-1, 0, 1].map((k) => (
              <tr key={k}>
                <td><Formula math={String(k)} /></td>
                {fam.map((p, i) => (
                  <td key={i}><Formula math={k === 0 ? cell(p.x0) : `${cell(p.x0)}${kTex(k)} = ${cell(p.x0 + k * TAU)}`} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Cada linha da tabela é uma volta inteira somada (ou tirada) das duas soluções de{' '}
          <Formula math={`${name} x = ${valueTex(value)}`} /> que estão entre 0 e <Formula math="2\pi" />.
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver as cópias de novo
        </button>
      </div>
    </div>
  );
}
