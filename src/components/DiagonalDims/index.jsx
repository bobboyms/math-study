import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {dec, decText} from '../GenreBars/clientes';

// O ângulo entre a diagonal (1, 1, ..., 1) e o primeiro eixo, conforme o
// número n de coordenadas cresce (lição 11.2).
//
// cos θ = 1/√n. O desenho é a folha plana dos dois vetores (o eixo e a
// diagonal), com os dois normalizados: o eixo deitado e a diagonal girada de
// θ. Com n = 2 é a diagonal do quadrado (45°); com n = 3, a do cubo; com
// muitas coordenadas, a diagonal fica quase em pé, perto do tracejado de 90°.

const NS = [2, 3, 4, 5, 10, 20, 50, 100, 1000, 10000, 1000000];
const W = 360;
const H = 236;
const O = [60, 206];
const R = 170;

const nText = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
const nTex = (n) => (n === 1000000 ? '1\\,000\\,000' : n === 10000 ? '10\\,000' : n === 1000 ? '1\\,000' : String(n));

export default function DiagonalDims({initial = 0, caption}) {
  const [i, setI] = useState(initial);
  const n = NS[i];
  const cos = 1 / Math.sqrt(n);
  const th = Math.acos(cos);
  const deg = (th * 180) / Math.PI;
  const tip = [O[0] + R * Math.cos(th), O[1] - R * Math.sin(th)];
  const r = 40;
  const arcEnd = [O[0] + r * Math.cos(th), O[1] - r * Math.sin(th)];

  return (
    <div className={shared.wrapper} data-explorer="diagonal-dims">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Com ${n} coordenadas, o ângulo entre a diagonal e o primeiro eixo é de ${decText(deg, 1)} graus.`}>
          <line x1={O[0]} y1={O[1]} x2={O[0]} y2={O[1] - R - 10} stroke="var(--mv-guide)" strokeWidth={1.3} strokeDasharray="5 4" />
          <SvgMath x={O[0] - 8} y={O[1] - R - 4} math="90^\circ" anchor="end" fontSize={12} />
          <line x1={O[0]} y1={O[1]} x2={O[0] + R - 9} y2={O[1]} stroke="var(--mv-tone-1)" strokeWidth={2.5} />
          <path d={`M ${O[0] + R} ${O[1]} l -11 -5.5 l 0 11 Z`} fill="var(--mv-tone-1)" />
          <SvgMath x={O[0] + R + 6} y={O[1] - 14} math="\vec{e}_1" anchor="start" fontSize={14} tone={1} />
          {(() => {
            const ux = Math.cos(th);
            const uy = -Math.sin(th);
            const bx = tip[0] - ux * 11;
            const by = tip[1] - uy * 11;
            return (
              <g>
                <line x1={O[0]} y1={O[1]} x2={tip[0] - ux * 8} y2={tip[1] - uy * 8} stroke="var(--mv-tone-2)" strokeWidth={2.5} />
                <path d={`M ${tip[0]} ${tip[1]} L ${bx - uy * 5.5} ${by + ux * 5.5} L ${bx + uy * 5.5} ${by - ux * 5.5} Z`} fill="var(--mv-tone-2)" />
              </g>
            );
          })()}
          <SvgMath x={tip[0] + 10} y={tip[1] - 6} math="\text{diagonal}" anchor="start" fontSize={13} tone={2} space={W - tip[0] - 12} />
          <path d={`M ${O[0] + r} ${O[1]} A ${r} ${r} 0 0 0 ${arcEnd[0]} ${arcEnd[1]}`} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <SvgMath
            x={O[0] + 58 * Math.cos(th / 2) + 6}
            y={O[1] - 58 * Math.sin(th / 2)}
            math={`${dec(deg, 1)}^\\circ`}
            anchor="start"
            fontSize={13}
            halo
          />
          <circle cx={O[0]} cy={O[1]} r={3} fill="var(--ifm-color-emphasis-700)" />
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>número de coordenadas: n = {nText(n)}</span>
          <input type="range" min={0} max={NS.length - 1} step={1} value={i} onChange={(e) => setI(Number(e.target.value))} />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`\\cos\\theta = \\frac{1}{\\sqrt{${nTex(n)}}} \\approx ${dec(cos, 4)},\\qquad \\theta \\approx ${dec(deg, 2)}^\\circ`}
          />
        </p>
      </div>
    </div>
  );
}
