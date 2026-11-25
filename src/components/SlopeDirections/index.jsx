import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {fmt} from '../mathviz/useAnimation';

// A regra das inclinações como produto escalar (lição 7.31, Produto escalar).
//
// Duas retas pela origem, de inclinações m1 e m2. Andando 1 para a direita,
// cada uma sobe m: as setas (1, m1) e (1, m2) apontam ao longo delas. O painel
// faz (1, m1) · (1, m2) = 1 + m1 × m2, que dá zero exatamente quando
// m1 × m2 = −1. O botão "horizontal e vertical" troca a segunda reta pela
// vertical, que não tem inclinação: a regra das inclinações não tem o que
// multiplicar, mas a seta (0, 1) existe e o produto escalar responde.

const comma = (v) => {
  const s = Number.isInteger(v) ? String(v) : fmt(v, 2).replace(/0$/, '').replace(',', '{,}');
  return s;
};
const tex = (v) => (v < 0 ? `-${comma(-v)}` : comma(v));
const par = (v) => (v < 0 ? `(${tex(v)})` : tex(v));
const txt = (v) => tex(v).replace('{,}', ',').replace('-', '−');

export default function SlopeDirections({caption}) {
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(-0.5);
  const [vertical, setVertical] = useState(false);

  const d1 = [1, m1];
  const d2 = vertical ? [0, 1] : [1, m2];
  const dot = d1[0] * d2[0] + d1[1] * d2[1];
  const zero = Math.abs(dot) < 1e-9;

  const lines = [{m: m1, n: 0, tone: 1, dashed: true}, vertical ? {x: 0, tone: 2, dashed: true} : {m: m2, n: 0, tone: 2, dashed: true}];
  const segments = [
    {from: [0, 0], to: d1, tone: 1, arrow: true},
    {from: [0, 0], to: d2, tone: 2, arrow: true},
  ];
  const labels = [
    {at: d1, math: `(1,\\ ${tex(m1)})`, tone: 1, dx: 38, dy: m1 >= 0 ? -4 : 12},
    {at: d2, math: vertical ? '(0,\\ 1)' : `(1,\\ ${tex(m2)})`, tone: 2, dx: vertical ? -30 : m2 >= 0 ? 40 : 6, dy: vertical ? -14 : m2 >= 0 ? 16 : 34},
  ];

  const sum = vertical
    ? `(1,\\ ${tex(m1)}) \\cdot (0,\\ 1) = 1 \\times 0 + ${par(m1)} \\times 1 = ${tex(dot)}`
    : `(1,\\ ${tex(m1)}) \\cdot (1,\\ ${tex(m2)}) = 1 + ${par(m1)} \\times ${par(m2)} = 1 ${m1 * m2 < 0 ? '-' : '+'} ${comma(Math.abs(m1 * m2))} = ${tex(dot)}`;

  return (
    <div className={shared.wrapper} data-explorer="slope-directions">
      <CartesianPlane
        xMin={-3}
        xMax={3}
        yMin={-3}
        yMax={3}
        xUnit={40}
        axisLabels={['x', 'y']}
        lines={lines}
        segments={segments}
        labels={labels}
        caption={
          caption ??
          'Duas retas pela origem. Cada seta anda 1 para a direita e sobe a inclinação da sua reta, e por isso aponta ao longo dela. O painel faz o produto escalar das duas setas.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={sum} />
        </p>
        <p>
          {vertical
            ? m1 === 0
              ? 'A primeira reta é horizontal, e a segunda é vertical. A vertical não tem inclinação, e a regra das inclinações não tem o que multiplicar. Mesmo assim o produto das setas dá zero: as retas são perpendiculares.'
              : 'A segunda reta é vertical e não tem inclinação. Mesmo assim a seta (0, 1) existe, e o produto escalar diz se o ângulo é reto.'
            : zero
              ? `O produto deu zero, e de fato m₁ × m₂ = ${m1 < 0 ? `(${txt(m1)})` : txt(m1)} × ${m2 < 0 ? `(${txt(m2)})` : txt(m2)} = −1: as retas são perpendiculares.`
              : `O produto não é zero, porque m₁ × m₂ = ${txt(m1 * m2)}, e não −1: as retas não são perpendiculares.`}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Inclinação m₁ da reta azul: {txt(m1)}</span>
          <input type="range" min={-3} max={3} step={0.25} value={m1} onChange={(e) => setM1(Number(e.target.value))} aria-label="Inclinação da primeira reta" />
        </label>
        <label className={shared.control}>
          <span>Inclinação m₂ da reta laranja: {vertical ? 'não existe (reta vertical)' : txt(m2)}</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.25}
            value={m2}
            onChange={(e) => {
              setVertical(false);
              setM2(Number(e.target.value));
            }}
            aria-label="Inclinação da segunda reta"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {[
          [2, -0.5],
          [1, -1],
          [0.5, 1],
        ].map(([p, q]) => (
          <button
            key={`${p},${q}`}
            type="button"
            aria-pressed={!vertical && p === m1 && q === m2}
            onClick={() => {
              setVertical(false);
              setM1(p);
              setM2(q);
            }}
          >
            m₁ = {txt(p)} e m₂ = {txt(q)}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={vertical && m1 === 0}
          onClick={() => {
            setM1(0);
            setVertical(true);
          }}
        >
          Horizontal e vertical
        </button>
      </div>
    </div>
  );
}
