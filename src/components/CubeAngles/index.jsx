import React, {useState} from 'react';
import SpaceScene, {fullBox, dot, norm, tex, triple} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';

// Ângulos dentro de um cubo (lição 7.34, Vetores no espaço).
//
// Um cubo de aresta 1 com um canto na origem. Cada botão escolhe duas setas
// que saem desse canto (arestas, diagonais de face, a diagonal do cubo). O
// painel faz a conta do produto escalar e do ângulo; no desenho aparece o arco
// do ângulo ou, quando o produto é zero, a marca de ângulo reto.

const PAIRS = [
  {name: 'aresta x e aresta z', u: [1, 0, 0], v: [0, 0, 1]},
  {name: 'aresta vertical e diagonal do chão', u: [0, 0, 1], v: [1, 1, 0]},
  {name: 'diagonal do cubo e aresta x', u: [1, 1, 1], v: [1, 0, 0]},
  {name: 'diagonais de faces vizinhas', u: [1, 1, 0], v: [0, 1, 1]},
];

const rootTex = (n2) => {
  const r = Math.sqrt(n2);
  return Math.abs(r - Math.round(r)) < 1e-9 ? `${Math.round(r)}` : `\\sqrt{${n2}}`;
};

export default function CubeAngles({initial = 0, pairs = PAIRS, caption}) {
  const [index, setIndex] = useState(initial);
  const {u, v} = pairs[index];
  const p = dot(u, v);
  const cosT = p / (norm(u) * norm(v));
  const theta = (Math.acos(cosT) * 180) / Math.PI;
  const exact = Math.abs(theta - Math.round(theta)) < 1e-6;
  const thetaTex = exact ? `= ${Math.round(theta)}^\\circ` : `\\approx ${tex(theta, 1)}^\\circ`;

  const items = [...fullBox([0, 0, 0], [1, 1, 1], {opacity: 0.7})];
  if (p === 0) items.push({type: 'right', at: [0, 0, 0], a: u, b: v, size: 0.18});
  else items.push({type: 'arc', at: [0, 0, 0], a: u, b: v, r: 0.3, labelR: 0.52, math: '\\theta', tone: 0});
  items.push(
    {type: 'arrow', from: [0, 0, 0], to: u, tone: 1, math: `\\vec{u} = ${triple(u)}`, dx: u[1] === 0 && u[2] === 0 ? -48 : 52, dy: u[2] ? -12 : 14},
    {type: 'arrow', from: [0, 0, 0], to: v, tone: 2, math: `\\vec{v} = ${triple(v)}`, dx: v[0] === 0 && v[1] === 0 ? 0 : 52, dy: v[2] ? -14 : 16},
    {type: 'point', at: [0, 0, 0], tone: 0, r: 3.5, math: 'O', dx: 14, dy: -12},
  );

  const parts = u.map((x, i) => `${x} \\times ${v[i]}`).join(' + ');

  return (
    <div className={shared.wrapper} data-explorer="cube-angles">
      <SpaceScene
        items={items}
        unit={130}
        axes={{max: [1.35, 1.4, 1.35]}}
        axisLabels={['x', 'y', 'z']}
        frame={[[1, 1, 1], [1, 0, 0], [0, 1, 0]]}
        padding={44}
        caption={
          caption ??
          'Um cubo de aresta 1 com um canto na origem. As duas setas saem desse canto. Escolha o par nos botões: o painel faz a conta do ângulo.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math={`\\vec{u} \\cdot \\vec{v} = ${parts} = ${p}`} />
        </p>
        <p>
          <Formula
            math={`\\cos\\theta = \\frac{${p}}{${rootTex(dot(u, u))} \\times ${rootTex(dot(v, v))}}${p === 0 ? ' = 0' : ` \\approx ${tex(cosT, 3)}`},\\qquad \\theta ${thetaTex}`}
          />
        </p>
        <p>{p === 0 ? 'Produto escalar zero: as duas setas são perpendiculares.' : 'Produto escalar positivo: o ângulo é agudo.'}</p>
      </div>
      <div className={shared.buttons}>
        {pairs.map((pair, i) => (
          <button key={pair.name} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>
            {pair.name}
          </button>
        ))}
      </div>
    </div>
  );
}
