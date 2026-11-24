import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {arcPath, onCircle, fmt} from '../mathviz/useAnimation';

// A reta numérica enrolada na circunferência de raio 1.
//
// A reta começa em pé, encostada no ponto (1, 0), com o 0 nesse ponto. Ela se
// enrola como um barbante de verdade: o pedaço já enrolado fica sobre a
// circunferência, e o resto segue reto pela tangente a partir do último ponto
// enrolado. Os números viajam junto com a reta, e cada um termina no ponto da
// circunferência cuja distância até (1, 0), medida sobre a curva, é o próprio
// número. É a imagem que liga ângulo e número real.
//
// O raio até o último ponto enrolado e o arco do ângulo aparecem no terceiro
// tom: o ângulo em radianos e o comprimento enrolado são o mesmo número.
//
// Os números inteiros ficam do lado de fora da curva e os múltiplos de π/2 do
// lado de dentro, para os rótulos de 3 e π (e de 6 e 2π) não se cobrirem.

const S = 440;
const CX = 220;
const CY = 230;
const R = 62;
const L = 2 * Math.PI; // comprimento da reta desenhada: uma volta
const DURATION = 6;

const INTEGERS = [0, 1, 2, 3, 4, 5, 6];
const PI_MARKS = [
  [Math.PI / 2, '\\frac{\\pi}{2}'],
  [Math.PI, '\\pi'],
  [(3 * Math.PI) / 2, '\\frac{3\\pi}{2}'],
  [2 * Math.PI, '2\\pi'],
];

// Posição do número u da reta quando o comprimento w já está enrolado, e a
// normal "para fora" naquele ponto (a mesma da circunferência no último ponto
// enrolado, para o trecho solto).
function place(u, w) {
  if (u <= w) {
    const [x, y] = onCircle(CX, CY, R, u);
    return {x, y, nx: Math.cos(u), ny: -Math.sin(u)};
  }
  const [px, py] = onCircle(CX, CY, R, w);
  const d = (u - w) * R;
  return {
    x: px - d * Math.sin(w),
    y: py - d * Math.cos(w),
    nx: Math.cos(w),
    ny: -Math.sin(w),
  };
}

export default function WrapLine({
  caption = 'A reta numérica enrolada na circunferência de raio 1, a partir do ponto (1, 0). Cada número termina no ponto que está, medindo sobre a curva, a essa distância do começo.',
}) {
  const [manual, setManual] = useState(null);
  const {ref, t, play, playing} = useAnimation({
    duration: DURATION,
    onFrame: () => setManual(null),
  });
  const w = manual ?? Math.min(L, (t / DURATION) * L);

  const N = 120;
  const pts = [];
  for (let i = 0; i <= N; i += 1) {
    const {x, y} = place((L * i) / N, w);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const [px, py] = onCircle(CX, CY, R, w);
  const [ax, ay] = onCircle(CX, CY, 26, w / 2);

  return (
    <div className={shared.wrapper} data-explorer="wrap-line">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${S} ${S}`}
          style={{maxWidth: '420px', overflow: 'hidden'}}
          role="img"
          aria-label={`Reta numérica enrolada até o número ${fmt(w, 2)} na circunferência de raio 1.`}
        >
          <line x1={CX - R - 40} y1={CY} x2={CX + R + 40} y2={CY} stroke="var(--mv-guide)" strokeWidth={1} />
          <line x1={CX} y1={CY - R - 40} x2={CX} y2={CY + R + 40} stroke="var(--mv-guide)" strokeWidth={1} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />

          {w > 0.02 && (
            <>
              <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={2} />
              <path d={arcPath(CX, CY, 18, 0, w)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.75} />
            </>
          )}

          <polyline points={pts.join(' ')} fill="none" stroke="var(--mv-tone-2)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />

          {INTEGERS.map((k) => {
            const {x, y, nx, ny} = place(k, w);
            return (
              <g key={k}>
                <line x1={x - nx * 6} y1={y - ny * 6} x2={x + nx * 6} y2={y + ny * 6} stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
                <SvgMath x={x + nx * 17} y={y + ny * 17} math={String(k)} fontSize={12} />
              </g>
            );
          })}
          {PI_MARKS.map(([u, tex]) => {
            const {x, y, nx, ny} = place(u, w);
            return (
              <g key={tex}>
                <circle cx={x} cy={y} r={3.5} fill="var(--mv-tone-2)" />
                <SvgMath x={x - nx * 22} y={y - ny * 22} math={tex} tone={2} fontSize={13} halo />
              </g>
            );
          })}

          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />
          {w > 0.6 && <SvgMath x={ax} y={ay} math="\theta" tone={1} fontSize={12} />}
          <SvgMath x={CX + R + 46} y={CY + 16} math="(1,\ 0)" anchor="start" fontSize={12} />
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Enrolado até o número <strong>{fmt(w, 2)}</strong>. O ângulo no centro mede{' '}
          <Formula math={`\\theta = ${fmt(w, 2).replace(',', '{,}')}\\text{ rad} \\approx ${Math.round((w * 180) / Math.PI)}^\\circ`} />
          : no círculo de raio 1, o ângulo em radianos e o comprimento enrolado são o mesmo número.
        </p>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Quanto da reta já foi enrolado</span>
          <input
            type="range"
            min={0}
            max={6.28}
            step={0.01}
            value={Math.min(6.28, Number(w.toFixed(2)))}
            onChange={(event) => setManual(Number(event.target.value))}
            disabled={playing}
            aria-label="Comprimento já enrolado"
            aria-valuetext={`${fmt(w, 2)}`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>
          Enrolar de novo
        </button>
      </div>
    </div>
  );
}
