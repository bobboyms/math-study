import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {arcPath, onCircle, fmt} from '../mathviz/useAnimation';

// Uma roda de bicicleta rolando sem escorregar: o caminho contrário de s = rθ.
//
// Sabendo quanto a roda andou (s) e o raio (r), quanto ela girou? Cada pedaço
// da borda que encosta no chão deixa no chão um pedaço do mesmo tamanho. O
// desenho pinta os dois: o trecho do chão já percorrido e o arco da borda que
// já encostou nele, no mesmo tom. Depois de uma volta inteira o arco fecha, e o
// painel passa a contar as voltas.
//
// Escala: raio de 0,30 m desenhado com R pixels, então 1 m vale R/0,30 pixels
// tanto no chão quanto na borda.

const W = 440;
const H = 190;
const R = 36;
const RADIUS_M = 0.3;
const PX_PER_M = R / RADIUS_M;
const X0 = 40;
const GROUND = 150;
const MAX_M = 3;
const DURATION = 5;

export default function RollingWheel({
  caption = 'A roda rola sem escorregar. O trecho laranja do chão e o arco laranja da borda têm o mesmo comprimento.',
}) {
  const [manual, setManual] = useState(null);
  const {ref, t, play, playing} = useAnimation({
    duration: DURATION,
    onFrame: () => setManual(null),
  });
  const s = manual ?? (Math.min(t, DURATION) / DURATION) * MAX_M;
  const th = s / RADIUS_M; // radianos
  const cx = X0 + s * PX_PER_M;
  const cy = GROUND - R;
  const touched = Math.min(th, 2 * Math.PI);
  // Rolando para a direita, a roda gira no sentido horário: um ponto da borda
  // que estava embaixo (ângulo −π/2) está agora no ângulo −π/2 − θ.
  const marks = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a) =>
    onCircle(cx, cy, R, a - Math.PI / 2 - th),
  );

  return (
    <div className={shared.wrapper} data-explorer="rolling-wheel">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`A roda de raio 30 centímetros andou ${fmt(s, 2)} metros e girou ${fmt(th, 1)} radianos.`}
        >
          <line x1={10} y1={GROUND} x2={W - 10} y2={GROUND} stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          {[0, 1, 2, 3].map((m) => (
            <g key={m}>
              <line x1={X0 + m * PX_PER_M} y1={GROUND} x2={X0 + m * PX_PER_M} y2={GROUND + 7} stroke="var(--ifm-font-color-base)" strokeWidth={1.25} />
              <SvgMath x={X0 + m * PX_PER_M} y={GROUND + 22} math={`${m}\\text{ m}`} fontSize={12} />
            </g>
          ))}
          {s > 0 && (
            <line x1={X0} y1={GROUND} x2={cx} y2={GROUND} stroke="var(--mv-tone-2)" strokeWidth={6} strokeLinecap="round" />
          )}

          <circle cx={cx} cy={cy} r={R} fill="var(--mv-paper)" stroke="var(--ifm-font-color-base)" strokeWidth={2} />
          {marks.map(([x, y], i) => (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={i === 0 ? 'var(--mv-tone-1)' : 'var(--mv-guide)'} strokeWidth={i === 0 ? 2.5 : 1.25} />
          ))}
          {touched > 0.01 && touched < 2 * Math.PI - 1e-6 && (
            <path d={arcPath(cx, cy, R, -Math.PI / 2 - touched, -Math.PI / 2)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={5} />
          )}
          {touched >= 2 * Math.PI - 1e-6 && (
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--mv-tone-2)" strokeWidth={5} />
          )}
          <circle cx={cx} cy={cy} r={3} fill="var(--ifm-font-color-base)" />
          <circle cx={marks[0][0]} cy={marks[0][1]} r={4} fill="var(--mv-tone-1)" />

          <SvgMath x={W - 14} y={24} math={`s = ${fmt(s, 2).replace(',', '{,}')}\\text{ m}`} anchor="end" tone={2} fontSize={15} />
          <SvgMath x={W - 14} y={48} math={`\\theta = \\frac{s}{r} = ${fmt(th, 2).replace(',', '{,}')}\\text{ rad}`} anchor="end" fontSize={15} />
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Roda de raio <Formula math="r = 0{,}30\text{ m}" />. Andou{' '}
          <Formula math={`s = ${fmt(s, 2).replace(',', '{,}')}\\text{ m}`} />, então girou{' '}
          <Formula math={`\\theta = \\frac{${fmt(s, 2).replace(',', '{,}')}}{0{,}30} \\approx ${fmt(th, 2).replace(',', '{,}')}\\text{ rad}`} />
          , que são <Formula math={`\\frac{${fmt(th, 2).replace(',', '{,}')}}{2\\pi} \\approx ${fmt(th / (2 * Math.PI), 2).replace(',', '{,}')}`} /> volta.
        </p>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Distância percorrida: {fmt(s, 2)} m</span>
          <input
            type="range"
            min={0}
            max={MAX_M}
            step={0.05}
            value={Number(s.toFixed(2))}
            onChange={(event) => setManual(Number(event.target.value))}
            disabled={playing}
            aria-label="Distância percorrida em metros"
            aria-valuetext={`${fmt(s, 2)} metros`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>
          Rolar de novo
        </button>
      </div>
    </div>
  );
}
