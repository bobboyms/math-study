import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {add, dec, norm, signed} from '../mathviz/lineParam';

// A conta ax + by + c como régua de distância (lição 7.33).
//
// A reta ax + by + c = 0 (contínua) e as paralelas em que a conta vale
// ±|n|, ±2|n|, … (tracejadas). O valor de cada uma fica escrito ao lado do
// vetor normal, como numa régua. Vizinhas ficam a
// 1 de distância uma da outra, porque andar 1 na direção do normal faz a conta
// mudar |n|. O aluno move um ponto P; o painel calcula a conta e a divide por
// |n|. Os eixos ficam sem numeração: os números da régua disputariam o mesmo
// lugar, e as coordenadas de P estão nos controles (cada quadradinho vale 1).

const txt = (v) => dec(v, 0).replace('-', '−');

export default function LevelLines({
  a = 3,
  b = 4,
  c = -7,
  base = [1, 1],
  xMin = -2,
  xMax = 8,
  yMin = -2,
  yMax = 8,
  xUnit = 30,
  levels,
  initial = [4, 5],
  caption,
}) {
  const [P, setP] = useState(initial);
  const n = [a, b];
  const len = norm(n);
  const value = a * P[0] + b * P[1] + c;
  const dist = Math.abs(value) / len;
  const exact = Number.isInteger(len);

  // Cada paralela: a·x + b·y + c = k. Ela passa pelo ponto base + (k ÷ |n|²)·n
  // e anda na direção (−b, a).
  const lineThrough = (k) => {
    const p = add(base, [(k * a) / (len * len), (k * b) / (len * len)]);
    return [p, add(p, [-b, a])];
  };
  // O valor de cada paralela fica escrito ao lado do ponto em que ela cruza a
  // reta do normal que passa por `base`, um pouco para o lado: as etiquetas
  // formam uma régua ao longo de n.
  const side = [(b / len) * 0.42, (-a / len) * 0.42];
  const rulerLabel = (k) => {
    const p = add(base, [(k * a) / (len * len), (k * b) / (len * len)]);
    return {at: add(p, side), anchor: 'start', dx: 2, dy: 4};
  };
  const inside = (p) => p[0] >= xMin + 0.2 && p[0] <= xMax - 0.6 && p[1] >= yMin + 0.2 && p[1] <= yMax - 0.2;

  // Sem `levels`, desenha as paralelas de −2|n| a 6|n|.
  const all = levels ?? [-2, -1, 1, 2, 3, 4, 5, 6];

  const lines = [{through: lineThrough(0), tone: 1}];
  const labels = [];
  all.forEach((m) => {
    const k = m * len;
    lines.push({through: lineThrough(k), muted: true, dashed: true});
    const pos = rulerLabel(k);
    if (inside(pos.at)) labels.push({...pos, math: dec(k, 0), fontSize: 12});
  });
  labels.push({...rulerLabel(0), math: '0', fontSize: 12, tone: 1});

  return (
    <div className={shared.wrapper} data-explorer="level-lines">
      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnit={xUnit}
        axisLabels={['x', 'y']}
        showNumbers={false}
        lines={lines}
        segments={[{from: base, to: add(base, n), tone: 2, arrow: true, label: '\\vec{n}', dx: -14, dy: -4}]}
        points={[{at: P, tone: 2, r: 6, label: 'P', dx: -12, dy: -14}]}
        labels={labels}
        caption={caption}
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`${dec(a, 0)}x + ${dec(b, 0)}y ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${dec(a, 0)} \\times ${signed(P[0], 0)} + ${dec(b, 0)} \\times ${signed(P[1], 0)} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${dec(value, 0)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`d = \\frac{\\lvert ${dec(value, 0)} \\rvert}{\\sqrt{${a * a} + ${b * b}}} = \\frac{${dec(Math.abs(value), 0)}}{${exact ? dec(len, 0) : `\\sqrt{${a * a + b * b}}`}} ${Math.abs(dist * 100 - Math.round(dist * 100)) < 1e-9 ? '=' : '\\approx'} ${dec(dist, 2)}`}
          />
        </p>
        <p>
          {value === 0
            ? 'A conta deu zero: P está na reta, e a distância é zero.'
            : `${
                Number.isInteger(value / len)
                  ? `P está sobre a linha onde a conta vale ${txt(value)}`
                  : `P está entre as linhas onde a conta vale ${txt(Math.floor(value / len) * len)} e ${txt(Math.ceil(value / len) * len)}`
              }. Cada linha tracejada fica a 1 da vizinha, e a conta muda ${dec(len, 0)} de uma para a outra.`}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ponto P, coordenada x: {txt(P[0])}</span>
          <input
            type="range"
            min={Math.ceil(xMin)}
            max={Math.floor(xMax)}
            step={1}
            value={P[0]}
            onChange={(e) => setP([Number(e.target.value), P[1]])}
            aria-label="Coordenada x do ponto P"
          />
        </label>
        <label className={shared.control}>
          <span>Ponto P, coordenada y: {txt(P[1])}</span>
          <input
            type="range"
            min={Math.ceil(yMin)}
            max={Math.floor(yMax)}
            step={1}
            value={P[1]}
            onChange={(e) => setP([P[0], Number(e.target.value)])}
            aria-label="Coordenada y do ponto P"
          />
        </label>
      </div>
    </div>
  );
}
