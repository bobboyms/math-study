import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';

// Secante (ou cossecante) como 1 dividido pelo cosseno (ou pelo seno).
//
// Uma régua de −4 a 4. O ponto verde é o cosseno do giro (laranja, no modo
// seno); o ponto azul é 1 dividido por ele. A faixa de −1 a 1 fica sombreada:
// o cosseno mora nela, e a secante nunca entra nela. Quando o cosseno encolhe
// para perto de 0, a secante foge para longe; com o cosseno igual a 0, ela não
// existe. Quando a secante passa do fim da régua, uma seta na ponta avisa.

const D = Math.PI / 180;
const W = 420;
const H = 150;
const X0 = 24;
const X1 = W - 24;
const MIN = -4;
const MAX = 4;
const X = (v) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);
const Y = 92;

const NAMES = {
  cos: {base: '\\cos', rec: '\\sec', tone: 3, word: 'secante', baseWord: 'cosseno'},
  sen: {base: '\\sen', rec: '\\cossec', tone: 2, word: 'cossecante', baseWord: 'seno'},
};

export default function ReciprocalLine({
  initial = 60,
  fn: initialFn = 'cos',
  caption,
}) {
  const [deg, setDeg] = useState(initial);
  const [fn, setFn] = useState(initialFn);
  const n = NAMES[fn];
  const th = deg * D;
  let v = fn === 'cos' ? Math.cos(th) : Math.sin(th);
  if (Math.abs(v) < 1e-9) v = 0;
  const exists = v !== 0;
  const r = exists ? 1 / v : null;
  const inside = exists && Math.abs(r) <= MAX;
  const rx = exists ? X(Math.max(MIN, Math.min(MAX, r))) : null;
  const exact = (a, d = 3) => Math.abs(a - Number(a.toFixed(d))) < 1e-9;

  const defaultCaption = `Arraste o giro. O ponto ${fn === 'cos' ? 'verde' : 'laranja'} é o ${n.baseWord}; o azul é a ${n.word}, 1 dividido por ele. A faixa cinza vai de −1 a 1: o ${n.baseWord} fica sempre nela, e a ${n.word} nunca fica no meio dela: no máximo encosta numa ponta, em 1 ou em −1.`;

  return (
    <div className={shared.wrapper} data-explorer="reciprocal-line">
      <figure className={geo.figure} style={{margin: 0}}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={exists ? `Régua com o ${n.baseWord} ${mathNumber(v, 3)} e a ${n.word} ${mathNumber(r, 3)}.` : `O ${n.baseWord} vale 0 e a ${n.word} não existe.`}>
          {/* faixa de −1 a 1 */}
          <rect x={X(-1)} y={Y - 18} width={X(1) - X(-1)} height={26} fill="var(--mv-guide)" opacity={0.22} rx={3} />
          <line x1={X0 - 8} y1={Y} x2={X1 + 8} y2={Y} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <line x1={X(k)} y1={Y - 5} x2={X(k)} y2={Y + 5} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
              <SvgMath x={X(k)} y={Y + 20} math={String(k)} fontSize={12} />
            </g>
          ))}
          {/* o cosseno (ou seno) */}
          <circle cx={X(v)} cy={Y - 9} r={6} fill={`var(--mv-tone-${n.tone})`} />
          <SvgMath x={X(v)} y={Y - 33} math={`${n.base}\\theta`} tone={n.tone} fontSize={13} halo />
          {/* a recíproca */}
          {exists && inside && (
            <>
              <circle cx={rx} cy={Y - 9} r={6} fill="var(--mv-tone-1)" />
              <SvgMath x={rx} y={Y - 52} math={`${n.rec}\\theta`} tone={1} fontSize={13} halo />
              <line x1={rx} y1={Y - 42} x2={rx} y2={Y - 16} stroke="var(--mv-tone-1)" strokeWidth={1} />
            </>
          )}
          {exists && !inside && (
            <>
              <path
                d={r > 0
                  ? `M ${X1 + 14} ${Y - 9} L ${X1 + 2} ${Y - 16} L ${X1 + 2} ${Y - 2} Z`
                  : `M ${X0 - 14} ${Y - 9} L ${X0 - 2} ${Y - 16} L ${X0 - 2} ${Y - 2} Z`}
                fill="var(--mv-tone-1)"
              />
              <SvgMath x={r > 0 ? X1 + 6 : X0 - 6} y={Y - 52} math={`${n.rec}\\theta`} anchor={r > 0 ? 'end' : 'start'} tone={1} fontSize={13} halo />
            </>
          )}
          {!exists && (
            <SvgMath x={W / 2} y={18} math={`${n.rec}\\theta\\ \\text{não existe}`} tone={1} fontSize={13} halo />
          )}
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <div className={shared.formula}>
          <Formula math={`\\theta = ${deg}^\\circ \\qquad ${n.base}\\theta ${exact(v) ? '=' : '\\approx'} ${mathNumber(v, 3)}`} />
        </div>
        <div className={shared.formula}>
          {exists ? (
            <Formula math={`${n.rec}\\theta = \\frac{1}{${n.base}\\theta} ${exact(r) ? '=' : '\\approx'} ${mathNumber(r, 3)}`} />
          ) : (
            <Formula math={`${n.rec}\\theta = \\frac{1}{0}:\\ \\text{não existe}`} />
          )}
        </div>
        {exists && !inside && <p>A {n.word} passou do fim da régua: o {n.baseWord} está muito perto de 0.</p>}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro: {deg}°</span>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            aria-label="Giro em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => setFn('cos')} aria-pressed={fn === 'cos'}>
          Secante: 1 ÷ cosseno
        </button>
        <button type="button" onClick={() => setFn('sen')} aria-pressed={fn === 'sen'}>
          Cossecante: 1 ÷ seno
        </button>
      </div>
    </div>
  );
}
