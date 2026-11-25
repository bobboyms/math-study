import React, {useState} from 'react';
import SpaceScene, {add, sub, times, dot, norm, cross, tex, triple} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Dois vetores do espaço sempre cabem numa folha plana (lição 7.34).
//
// Os vetores u e v saem da origem. A origem e as duas pontas formam um
// triângulo, pintado como uma folha. A folha então gira, como um objeto
// rígido (sem esticar nem dobrar), até ficar de frente para o leitor, no plano
// do papel. Ali o ângulo θ entre u e v é um ângulo comum de geometria plana,
// com os mesmos comprimentos de antes: ‖u‖, ‖v‖ e ‖u − v‖.
//
// O giro é a rotação que leva a base (e1, e2, n) da folha à base (y, z, x)
// da cena. O plano yz é desenhado sem deformação (o papel é esse plano), por
// isso a folha chega de frente, sem perspectiva.

const PRESETS = [
  {u: [1, 2, 2], v: [2, -1, 3]},
  {u: [1, 1, 0], v: [0, 1, 1]},
];
const DURATION = 5;



function basisRotation(u, v) {
  const e1 = times(1 / norm(u), u);
  const w = sub(v, times(dot(v, e1), e1));
  const e2 = times(1 / norm(w), w);
  const n = cross(e1, e2);
  // R = Y Eᵀ, com E = [e1 e2 n] e Y = [ŷ ẑ x̂].
  const Y = [
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
  ];
  const E = [e1, e2, n];
  const R = [0, 1, 2].map((i) => [0, 1, 2].map((j) => Y[i][0] * E[0][j] + Y[i][1] * E[1][j] + Y[i][2] * E[2][j]));
  const tr = R[0][0] + R[1][1] + R[2][2];
  const angle = Math.acos(Math.max(-1, Math.min(1, (tr - 1) / 2)));
  const s = Math.sin(angle);
  const axis =
    s > 1e-6
      ? times(1 / (2 * s), [R[2][1] - R[1][2], R[0][2] - R[2][0], R[1][0] - R[0][1]])
      : [1, 0, 0];
  return {axis: times(1 / norm(axis), axis), angle};
}

// Rodrigues: gira p em torno do eixo unitário k pelo ângulo a.
function rotate(p, k, a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return add(add(times(c, p), times(s, cross(k, p))), times(dot(k, p) * (1 - c), k));
}

const rootTex = (n2) => {
  const r = Math.sqrt(n2);
  return Number.isInteger(Math.round(n2)) && Math.abs(r - Math.round(r)) < 1e-9 ? `${Math.round(r)}` : `\\sqrt{${Math.round(n2)}}`;
};

// O enquadramento: todas as posições das pontas ao longo do giro, nos dois
// pares. Assim a figura não muda de tamanho no meio do giro nem ao trocar o
// par.
const FRAME = PRESETS.flatMap(({u, v}) => {
  const {axis, angle} = basisRotation(u, v);
  const out = [];
  for (let i = 0; i <= 20; i += 1) {
    out.push(rotate(u, axis, (angle * i) / 20), rotate(v, axis, (angle * i) / 20));
  }
  return out;
});

export default function SheetFlatten({initial = 0, caption}) {
  const [index, setIndex] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const {u, v} = PRESETS[index];
  const {axis, angle} = basisRotation(u, v);

  const kGrow = stage(t, 0, 0.8);
  const kSheet = stage(t, 0.8, 1.6);
  const kTurn = stage(t, 1.8, 4.2);
  const kEnd = stage(t, 4.2, DURATION);
  const turnNow = (p) => rotate(p, axis, angle * kTurn);
  const U = turnNow(times(kGrow, u));
  const V = turnNow(times(kGrow, v));
  const O = [0, 0, 0];

  const uv = dot(u, v);
  const nu2 = dot(u, u);
  const nv2 = dot(v, v);
  const d = sub(u, v);
  const nd2 = dot(d, d);
  const cosT = uv / Math.sqrt(nu2 * nv2);
  const theta = (Math.acos(cosT) * 180) / Math.PI;
  const thetaTex = Math.abs(theta - Math.round(theta)) < 1e-6 ? `= ${Math.round(theta)}^\\circ` : `\\approx ${tex(theta, 1)}^\\circ`;

  const small = Math.min(nu2, nv2) < 4;
  const items = [
    {type: 'poly', pts: [O, U, V], tone: 3, fill: 0.2, opacity: kSheet},
    {type: 'line', from: V, to: U, tone: 3, dashed: true, opacity: kSheet},
  ];
  if (kGrow > 0.02) {
    items.push({type: 'arrow', from: O, to: U, tone: 1}, {type: 'arrow', from: O, to: V, tone: 2});
  }
  items.push(
    {type: 'label', at: U, math: '\\vec{u}', dx: 14, dy: -10, tone: 1, opacity: kGrow >= 1 ? 1 - kEnd : 0},
    {type: 'label', at: V, math: '\\vec{v}', dx: 14, dy: -10, tone: 2, opacity: kGrow >= 1 ? 1 - kEnd : 0},
    {type: 'label', at: times(0.5, U), math: `\\lVert \\vec{u} \\rVert = ${rootTex(nu2)}`, dy: 18, tone: 1, opacity: kEnd},
    {type: 'label', at: times(0.62, V), math: `\\lVert \\vec{v} \\rVert = ${rootTex(nv2)}`, dx: -58, dy: -4, tone: 2, opacity: kEnd},
    {type: 'label', at: times(0.5, add(U, V)), math: `${rootTex(nd2)}`, dx: 24, dy: -6, tone: 3, opacity: kEnd},
    // Triângulo pequeno: o rótulo de θ não cabe dentro dele e vai para a
    // esquerda do vértice O, fora do triângulo.
    small
      ? {type: 'arc', at: O, a: U, b: V, r: 0.55, tone: 0, opacity: kEnd}
      : {type: 'arc', at: O, a: U, b: V, r: 0.55, labelR: 0.45 * Math.sqrt(Math.min(nu2, nv2)), dx: 10, math: `\\theta ${thetaTex}`, tone: 0, opacity: kEnd, size: 13},
    ...(small ? [{type: 'label', at: O, math: `\\theta ${thetaTex}`, dx: -14, dy: -20, anchor: 'end', tone: 0, opacity: kEnd, size: 13}] : []),
    {type: 'point', at: O, tone: 0, r: 3.5, math: 'O', dx: -12, dy: 10},
  );


  return (
    <div className={shared.wrapper} data-explorer="sheet-flatten">
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={52}
          axes={{max: [2.4, 3.2, 3.2]}}
          axesOpacity={1 - 0.8 * kTurn}
          frame={FRAME}
          caption={
            caption ??
            'Os vetores u e v saem da origem, e o triângulo que eles formam é pintado como uma folha. A folha gira inteira, sem esticar, até ficar de frente para você. No fim, θ é um ângulo comum de um triângulo plano, com os mesmos três lados.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math={`\\vec{u} = ${triple(u)},\\quad \\vec{v} = ${triple(v)},\\quad \\vec{u} - \\vec{v} = ${triple(d)}`} />
        </p>
        <p>
          Os três lados ao quadrado: <Formula math={`${nu2},\\ ${nv2},\\ ${nd2}`} />. Pela fórmula dos três lados,{' '}
          <Formula math={`\\vec{u} \\cdot \\vec{v} = \\frac{${nu2} + ${nv2} - ${nd2}}{2} = ${tex(uv)}`} />.
        </p>
        <p>
          <Formula
            math={`\\cos\\theta = \\frac{${tex(uv)}}{${rootTex(nu2)} \\times ${rootTex(nv2)}} \\approx ${tex(cosT, 3)},\\qquad \\theta ${thetaTex}`}
          />
        </p>
      </div>
      <div className={shared.buttons}>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            type="button"
            disabled={playing}
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              play();
            }}
          >
            u = ({p.u.map((x) => String(x).replace('-', '−')).join(', ')}), v = ({p.v.map((x) => String(x).replace('-', '−')).join(', ')})
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
