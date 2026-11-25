import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {num, rel} from '../WaveTracer/wave';

// As três escritas de cos 2a como três caminhos na reta numérica, que chegam
// ao mesmo ponto.
//
// Linha 1: avança cos²a (tom 1), recua sen²a (tom 2).
// Linha 2: avança 1 (cinza), recua sen²a duas vezes (tom 2).
// Linha 3: avança cos²a duas vezes (tom 1), recua 1 (cinza).
// A reta vertical tracejada marca cos 2a: as três chegadas caem nela.
// Como sen²a + cos²a = 1, o "1" cinza tem o comprimento de um azul mais um
// laranja.

const U = 120;
const LEFT = 150;
const XMIN = -1.15;
const XMAX = 2.15;
const W = Math.round(LEFT + (XMAX - XMIN) * U + 10);
const ROWS = [66, 146, 226];
const AXIS_Y = 292;
const H = AXIS_Y + 34;
const X = (v) => LEFT + (v - XMIN) * U;
const rad = (d) => (d * Math.PI) / 180;

function Arrow({x0, x1, y, color, dashed}) {
  const a = X(x0);
  const b = X(x1);
  if (Math.abs(b - a) < 1) return null;
  const s = b > a ? 1 : -1;
  const head = Math.min(8, Math.abs(b - a));
  return (
    <g>
      <line x1={a} y1={y} x2={b - s * head} y2={y} stroke={color} strokeWidth={3.5} strokeDasharray={dashed ? '6 3' : undefined} />
      <path d={`M ${b} ${y} l ${-s * head} -5 v 10 z`} fill={color} />
      <line x1={a} y1={y - 6} x2={a} y2={y + 6} stroke={color} strokeWidth={1.5} />
    </g>
  );
}

export default function DoubleCosineRoutes({initial = 30}) {
  const [a, setA] = useState(initial);
  const c2 = Math.cos(rad(a)) ** 2;
  const s2 = Math.sin(rad(a)) ** 2;
  const target = Math.cos(rad(2 * a));
  const t1 = 'var(--mv-tone-1)';
  const t2 = 'var(--mv-tone-2)';
  const gray = 'var(--ifm-color-emphasis-600)';
  const up = -11;
  const dn = 11;

  return (
    <div className={shared.wrapper} data-explorer="double-cosine-routes">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Três caminhos na reta numérica para cos de ${2 * a} graus, todos chegando a ${num(target, 3)}.`}>
          {/* reta numérica */}
          <line x1={X(XMIN)} y1={AXIS_Y} x2={X(XMAX)} y2={AXIS_Y} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          {[-1, 0, 1, 2].map((v) => (
            <g key={v}>
              <line x1={X(v)} y1={AXIS_Y - 5} x2={X(v)} y2={AXIS_Y + 5} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={X(v)} y={AXIS_Y + 18} math={String(v)} fontSize={12} />
              <line x1={X(v)} y1={30} x2={X(v)} y2={AXIS_Y - 6} stroke="var(--mv-guide)" strokeWidth={0.75} strokeDasharray="2 5" />
            </g>
          ))}
          {/* cos 2a */}
          <line x1={X(target)} y1={26} x2={X(target)} y2={AXIS_Y} stroke="var(--mv-tone-3)" strokeWidth={2} strokeDasharray="6 4" />
          <SvgMath x={X(target)} y={14} math={`\\cos ${2 * a}^\\circ ${rel(target)} ${num(target, 3)}`} tone={3} fontSize={13} halo />

          {/* linha 1 */}
          <SvgMath x={LEFT - 14} y={ROWS[0]} math="\cos^2 a - \sen^2 a" anchor="end" fontSize={14} space={140} />
          <Arrow x0={0} x1={c2} y={ROWS[0] + up} color={t1} />
          <Arrow x0={c2} x1={c2 - s2} y={ROWS[0] + dn} color={t2} />

          {/* linha 2 */}
          <SvgMath x={LEFT - 14} y={ROWS[1]} math="1 - 2\sen^2 a" anchor="end" fontSize={14} space={140} />
          <Arrow x0={0} x1={1} y={ROWS[1] + up} color={gray} />
          <Arrow x0={1} x1={1 - s2} y={ROWS[1] + dn} color={t2} />
          <Arrow x0={1 - s2} x1={1 - 2 * s2} y={ROWS[1] + dn} color={t2} />

          {/* linha 3 */}
          <SvgMath x={LEFT - 14} y={ROWS[2]} math="2\cos^2 a - 1" anchor="end" fontSize={14} space={140} />
          <Arrow x0={0} x1={c2} y={ROWS[2] + up} color={t1} />
          <Arrow x0={c2} x1={2 * c2} y={ROWS[2] + up} color={t1} />
          <Arrow x0={2 * c2} x1={2 * c2 - 1} y={ROWS[2] + dn} color={gray} />

          {ROWS.map((y) => (
            <circle key={y} cx={X(target)} cy={y + dn} r={4.5} fill="var(--mv-tone-3)" />
          ))}
        </svg>
        <figcaption className={geo.caption}>
          Cada linha é um caminho na reta numérica, saindo do zero. Azul: avança o quadrado do cosseno. Laranja: recua o quadrado do seno. Cinza: o comprimento 1, que vale um azul mais um laranja. A linha verde tracejada marca o cosseno do dobro, e as três chegadas caem nela.
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Com <Formula math={`a = ${a}^\\circ`} />: <Formula math={`\\cos^2 a \\approx ${num(c2, 3)}`} /> e{' '}
          <Formula math={`\\sen^2 a \\approx ${num(s2, 3)}`} />, que somam 1.
        </p>
        <div className={shared.formula}>
          <Formula math={`${num(c2, 3)} - ${num(s2, 3)} \\approx 1 - 2 \\times ${num(s2, 3)} \\approx 2 \\times ${num(c2, 3)} - 1 \\approx ${num(target, 3)}`} />
        </div>
        <p>
          {target < -1e-9
            ? 'O recuo passou do avanço: o cosseno do dobro é negativo, porque o ângulo 2a passou de 90°.'
            : Math.abs(target) < 1e-9
              ? 'As três chegadas caem no zero: o ângulo 2a é exatamente 90°.'
              : 'As três chegadas caem no mesmo ponto, à direita do zero.'}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo a: {a}° (o dobro: {2 * a}°)</span>
          <input type="range" min={0} max={90} step={5} value={a}
            onChange={(e) => setA(Number(e.target.value))} aria-label="Ângulo a, em graus" />
        </label>
      </div>
    </div>
  );
}
