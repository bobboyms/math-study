import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {CLIENTS, dot, norm, sub, dec, decText, rootTex, DEG} from '../GenreBars/clientes';

// A folha de dois vetores de R^5 (lição 11.2).
//
// Dois vetores, mesmo com cinco coordenadas, cabem numa folha plana, como na
// lição 7.34. A figura desenha essa folha só com três números que as contas
// dão: o módulo de cada vetor e o ângulo θ definido pelo cosseno. O primeiro
// vetor fica deitado; o segundo sai da mesma origem, girado de θ.
//
// A distância entre as pontas é medida no desenho (coordenadas da folha) e
// comparada, no painel, com a distância calculada pelas cinco diferenças: as
// duas dão o mesmo número. Na folha aparecem juntas as duas medidas de
// semelhança da lição: a distância (tracejado entre as pontas) e o ângulo.

const W = 460;
const SC = 19;
const DEFAULT_PAIRS = [
  ['Paula', 'Gustavo'],
  ['Paula', 'Carla'],
  ['Paula', 'Davi'],
  ['Carla', 'Davi'],
];

const ink = 'var(--ifm-color-emphasis-700)';

function Arrow({from, to, k, dashed}) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const head = 11;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const nx = -uy * head * 0.5;
  const ny = ux * head * 0.5;
  return (
    <g style={{color: `var(--mv-tone-${k})`}}>
      <line x1={x1} y1={y1} x2={x2 - ux * 8} y2={y2 - uy * 8} stroke="currentColor" strokeWidth={2.5} strokeDasharray={dashed ? '7 5' : undefined} strokeLinecap="round" />
      <path d={`M ${x2} ${y2} L ${bx + nx} ${by + ny} L ${bx - nx} ${by - ny} Z`} fill="currentColor" />
    </g>
  );
}

export default function PairSheet({pairs = DEFAULT_PAIRS, initial = 0, caption}) {
  const [idx, setIdx] = useState(initial);
  const [na, nb] = pairs[idx];
  const A = CLIENTS[na];
  const B = CLIENTS[nb];
  const {ref, t, play, playing} = useAnimation({duration: 3.2});
  const uK = stage(t, 0, 0.8);
  const vK = stage(t, 0.8, 1.6);
  const arcK = stage(t, 1.6, 2.2);
  const distK = stage(t, 2.2, 3.0);

  // altura do desenho: a maior subida entre os pares, mais margens
  const rise = Math.max(
    ...pairs.map(([x, y]) => {
      const u = CLIENTS[x].v;
      const w = CLIENTS[y].v;
      const s = Math.max(0, Math.min(1, dot(u, w) / (norm(u) * norm(w))));
      return norm(w) * Math.sqrt(1 - s * s) * SC;
    }),
  );
  const H = Math.round(rise + 40 + 44);
  const O = [40, H - 44];
  const la = norm(A.v);
  const lb = norm(B.v);
  const pq = dot(A.v, B.v);
  const cos = Math.max(-1, Math.min(1, pq / (la * lb)));
  const th = Math.acos(cos);
  const deg = th * DEG;
  const flat = deg < 0.5;
  const d5 = norm(sub(A.v, B.v));

  // a folha, em unidades: u deitado, v girado de θ
  const U = [la, 0];
  const V = [lb * Math.cos(th), lb * Math.sin(th)];
  const dSheet = Math.hypot(U[0] - V[0], U[1] - V[1]);
  const S = (p) => [O[0] + p[0] * SC, O[1] - p[1] * SC];
  const uTip = S([la * uK, 0]);
  const vTip = S([V[0] * vK, V[1] * vK]);
  const uEnd = S(U);
  const vEnd = S(V);

  const arcR = 34;
  const arcEnd = [O[0] + arcR * Math.cos(th * arcK), O[1] - arcR * Math.sin(th * arcK)];
  const sameTone = A.tone === B.tone;

  // rótulo da distância: do lado de fora do triângulo (longe da origem)
  const m = [(uEnd[0] + vEnd[0]) / 2, (uEnd[1] + vEnd[1]) / 2];
  const away = [m[0] - O[0], m[1] - O[1]];
  const aw = Math.hypot(...away) || 1;
  const distLabel = [m[0] + (away[0] / aw) * 22, m[1] + (away[1] / aw) * 16];

  const cosMath = flat
    ? `\\cos\\theta = \\frac{${pq}}{${rootTex(dot(A.v, A.v))} \\times ${rootTex(dot(B.v, B.v))}} = \\frac{${pq}}{${dec(la * lb, 2)}} = 1`
    : `\\cos\\theta = \\frac{${pq}}{${rootTex(dot(A.v, A.v))} \\times ${rootTex(dot(B.v, B.v))}} \\approx \\frac{${pq}}{${dec(la * lb, 2)}} \\approx ${cos.toFixed(3).replace('.', '{,}')}`;

  return (
    <div className={shared.wrapper} data-explorer="pair-sheet">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Folha plana com os vetores de ${na} e ${nb}: módulos ${decText(la)} e ${decText(lb)}, ângulo de ${decText(deg, 1)} graus, distância entre as pontas ${decText(d5)}.`}>
          {/* arco do ângulo */}
          {!flat && arcK > 0 && (
            <>
              <path
                d={`M ${O[0] + arcR} ${O[1]} A ${arcR} ${arcR} 0 0 0 ${arcEnd[0]} ${arcEnd[1]}`}
                fill="none"
                stroke={ink}
                strokeWidth={1.5}
              />
              <g opacity={arcK}>
                <SvgMath
                  x={O[0] + arcR + 5}
                  y={O[1] - 12}
                  math={`\\theta \\approx ${dec(deg, 1)}^\\circ`}
                  anchor="start"
                  fontSize={12}
                  halo
                />
              </g>
            </>
          )}
          {flat && arcK > 0 && (
            <g opacity={arcK}>
              <SvgMath x={O[0] + 40} y={O[1] - 18} math="\theta = 0^\circ" anchor="start" fontSize={13} halo />
            </g>
          )}

          {/* setas: a mais longa primeiro, para a outra ficar por cima */}
          {lb >= la ? (
            <>
              {vK > 0.02 && <Arrow from={O} to={vTip} k={B.tone} dashed={sameTone} />}
              {uK > 0.02 && <Arrow from={O} to={uTip} k={A.tone} />}
            </>
          ) : (
            <>
              {uK > 0.02 && <Arrow from={O} to={uTip} k={A.tone} />}
              {vK > 0.02 && <Arrow from={O} to={vTip} k={B.tone} dashed={sameTone} />}
            </>
          )}
          <circle cx={O[0]} cy={O[1]} r={3} fill={ink} />

          {/* nomes nas pontas */}
          <g opacity={uK}>
            <SvgMath x={uEnd[0] + 4} y={uEnd[1] + (flat ? -18 : 18)} math={`\\text{${na}}`} anchor="start" fontSize={14} tone={A.tone} halo space={W - uEnd[0] - 6} />
          </g>
          <g opacity={vK}>
            <SvgMath
              x={flat ? vEnd[0] + 4 : vEnd[0] + 12 * Math.cos(th)}
              y={flat ? vEnd[1] - 18 : vEnd[1] - 14}
              math={`\\text{${nb}}`}
              anchor={flat ? 'start' : 'middle'}
              fontSize={14}
              tone={B.tone}
              halo
            />
          </g>

          {/* distância entre as pontas */}
          {distK > 0 && !flat && (
            <g opacity={distK}>
              <line x1={uEnd[0]} y1={uEnd[1]} x2={vEnd[0]} y2={vEnd[1]} stroke={ink} strokeWidth={1.8} strokeDasharray="5 4" />
              <SvgMath x={distLabel[0]} y={distLabel[1]} math={`${dec(dSheet, 2)}`} fontSize={14} halo />
            </g>
          )}
          {distK > 0 && flat && (
            <g opacity={distK}>
              <line x1={uEnd[0]} x2={vEnd[0]} y1={O[1] + 16} y2={O[1] + 16} stroke={ink} strokeWidth={1.8} />
              <line x1={uEnd[0]} x2={uEnd[0]} y1={O[1] + 10} y2={O[1] + 22} stroke={ink} strokeWidth={1.5} />
              <line x1={vEnd[0]} x2={vEnd[0]} y1={O[1] + 10} y2={O[1] + 22} stroke={ink} strokeWidth={1.5} />
              <SvgMath x={(uEnd[0] + vEnd[0]) / 2} y={O[1] + 30} math={`${dec(dSheet, 2)}`} fontSize={14} halo />
            </g>
          )}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`\\vec{${A.letter}} \\cdot \\vec{${B.letter}} = ${pq},\\quad \\lVert \\vec{${A.letter}} \\rVert = ${rootTex(dot(A.v, A.v))} \\approx ${dec(la, 2)},\\quad \\lVert \\vec{${B.letter}} \\rVert = ${rootTex(dot(B.v, B.v))} \\approx ${dec(lb, 2)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula math={cosMath} />
          {flat ? ', então θ = 0°.' : <>, então <Formula math={`\\theta \\approx ${dec(deg, 1)}^\\circ`} />.</>}
        </p>
        <p>
          Distância entre as pontas, medida na folha: {decText(dSheet)}. Pela conta com as cinco diferenças,{' '}
          <Formula math={`\\lVert \\vec{${A.letter}} - \\vec{${B.letter}} \\rVert = ${rootTex(dot(sub(A.v, B.v), sub(A.v, B.v)))} \\approx ${dec(d5, 2)}`} />
          . As duas medidas dão o mesmo número.
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
        {pairs.length > 1 &&
          pairs.map(([a, b], j) => (
            <button
              key={`${a}-${b}`}
              type="button"
              aria-pressed={j === idx}
              disabled={playing}
              onClick={() => {
                setIdx(j);
                play();
              }}
            >
              {a} e {b}
            </button>
          ))}
      </div>
    </div>
  );
}
