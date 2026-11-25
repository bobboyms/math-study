import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {CLIENTS, dot, dec, decText, listTex} from '../GenreBars/clientes';

// A parábola da desigualdade de Cauchy-Schwarz (lição 11.2).
//
// Para dois vetores fixos u e v, a conta f(t) = ‖u − t v‖² é uma expressão do
// 2º grau em t. Ela é uma soma de quadrados, então nunca fica negativa: a
// parábola nunca desce abaixo do eixo. O aluno arrasta t e vê o vetor
// u − t v e a soma dos quadrados dele no painel.
//
// Com Paula e Carla a parábola fica sempre acima do eixo (discriminante
// negativo). Com Paula e Gustavo ela encosta no eixo em t = 1/2, onde
// u − t v é o vetor nulo (discriminante zero): é o caso da igualdade, em que
// um vetor é múltiplo do outro.

const PAIRS = [
  ['Paula', 'Carla'],
  ['Paula', 'Gustavo'],
];

export default function CauchyParabola({initial = 0, caption}) {
  const [idx, setIdx] = useState(initial);
  const [t, setT] = useState(0.5);
  const [na, nb] = PAIRS[idx];
  const A = CLIENTS[na];
  const B = CLIENTS[nb];
  const a = dot(B.v, B.v);
  const b = -2 * dot(A.v, B.v);
  const c = dot(A.v, A.v);
  const f = (x) => a * x * x + b * x + c;
  const disc = b * b - 4 * a * c;
  const tMin = -b / (2 * a);
  const fMin = f(tMin);
  const w = A.v.map((x, i) => x - t * B.v[i]);
  const ft = f(t);
  const la = A.letter;
  const lb = B.letter;

  return (
    <div className={shared.wrapper} data-explorer="cauchy-parabola">
      <CartesianPlane
        xMin={-0.55}
        xMax={1.55}
        yMin={-20}
        yMax={262}
        xUnit={175}
        yUnit={0.9}
        xStep={0.5}
        yStep={50}
        axisLabels={['t', 'f(t)']}
        functions={[{f, tone: 1}]}
        segments={[{from: [t, 0], to: [t, ft], tone: 2, dashed: true}]}
        points={[
          {at: [t, ft], tone: 2, r: 5},
          {at: [tMin, fMin], tone: 3, r: 4, label: `\\text{mais baixo: } ${dec(fMin, 2)}`, dx: 0, dy: -22},
        ]}
        caption={
          caption ??
          `A curva é f(t) = ‖${la} − t${lb}‖², o quadrado do módulo do vetor ${la} − t${lb}. O ponto laranja acompanha o t do controle; o verde é o ponto mais baixo da curva.`
        }
      />
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            t = {decText(t, 2)}
          </span>
          <input type="range" min={-0.5} max={1.5} step={0.05} value={t} onChange={(e) => setT(Number(e.target.value))} />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`\\vec{${la}} - ${t < 0 ? `(${dec(t, 2)})` : dec(t, 2)}\\,\\vec{${lb}} = ${listTex(w, 2)}`} />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`f(${dec(t, 2)}) = ${w.map((x) => (x < 0 ? `(${dec(x, 2)})^2` : `${dec(x, 2)}^2`)).join(' + ')} ${Math.abs(ft - Number(ft.toFixed(2))) < 1e-9 ? '=' : '\\approx'} ${dec(ft, 2)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula math={`f(t) = ${c} ${b < 0 ? '-' : '+'} ${Math.abs(b)}t + ${a}t^2,\\qquad \\Delta = (${b})^2 - 4 \\times ${a} \\times ${c} = ${disc}`} />
        </p>
        <p>
          {disc < 0
            ? 'A soma de quadrados nunca fica negativa, e aqui nem chega a zero: a curva passa inteira acima do eixo, e o discriminante é negativo.'
            : `Aqui a curva encosta no eixo em t = ${decText(tMin, 2)}. Nesse t o vetor ${la} − t${lb} é o vetor nulo, porque o Gustavo é o dobro da Paula. O discriminante é zero: é o caso da igualdade.`}
        </p>
      </div>
      <div className={shared.buttons}>
        {PAIRS.map(([p, q], j) => (
          <button
            key={`${p}-${q}`}
            type="button"
            aria-pressed={j === idx}
            onClick={() => {
              setIdx(j);
            }}
          >
            {p} e {q}
          </button>
        ))}
      </div>
    </div>
  );
}
