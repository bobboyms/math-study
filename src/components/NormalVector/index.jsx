import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {add, dec, dot, pairTex, rightAngleMark, signed, sub} from '../mathviz/lineParam';

// O vetor normal (lição 7.33, Retas com vetores).
//
// A reta ax + by = k (com a, b, k dados) e dois pontos dela, P₁ e P₂, que o
// aluno move pelos controles. A seta de P₁ até P₂ (azul) fica sempre deitada
// na reta, e o vetor n = (a, b) (laranja) sai de P₁ em ângulo reto. O painel
// faz a conta: os dois pontos dão k em ax + by, a diferença dá 0, e essa
// diferença é o produto escalar de n com a seta P₁P₂.
//
// O botão "Andar na direção de n" mostra o contraexemplo: um passo n leva a um
// ponto fora da reta, onde ax + by vale k + a² + b².

const txt = (v) => dec(v, 1).replace('{,}', ',').replace('-', '−');

export default function NormalVector({
  n = [2, 3],
  k = 12,
  xMin = -2,
  xMax = 8,
  yMin = -2,
  yMax = 8,
  xUnit = 32,
  p1Range = [-1.5, 4.5],
  p2Range = [-1.5, 7.5],
  step = 1.5,
  initial = [3, 6],
  caption,
}) {
  const [x1, setX1] = useState(initial[0]);
  const [x2, setX2] = useState(initial[1]);
  const [walk, setWalk] = useState(false);
  const [a, b] = n;
  const yOf = (x) => (k - a * x) / b;
  const P1 = [x1, yOf(x1)];
  const P2 = [x2, yOf(x2)];
  const w = sub(P2, P1);
  const dir = [-b, a];
  const R = add(P1, n);
  const same = x1 === x2;

  const value = (p) => `${dec(a, 0)} \\times ${signed(p[0])} + ${dec(b, 0)} \\times ${signed(p[1])} = ${dec(a * p[0] + b * p[1], 1)}`;

  const segments = [{from: P1, to: R, tone: 2, arrow: true, label: '\\vec{n}', dx: -14, dy: -2}];
  if (!same) segments.unshift({from: P1, to: P2, tone: 1, arrow: true});
  const points = [
    {at: P1, tone: 1, r: 5, label: 'P_1', dx: -16, dy: 14},
    {at: P2, tone: 1, r: 5, label: same ? undefined : 'P_2', dx: 14, dy: -14},
  ];
  if (walk) points.push({at: R, tone: 2, r: 5.5, open: true, label: 'R', dx: 14, dy: -8});

  return (
    <div className={shared.wrapper} data-explorer="normal-vector">
      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnit={xUnit}
        axisLabels={['x', 'y']}
        lines={[{through: [[0, yOf(0)], [1, yOf(1)]], tone: 0}]}
        polygons={[rightAngleMark(P1, dir, n, 0.4)]}
        segments={segments}
        points={points}
        caption={caption}
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`P_1 = ${pairTex(P1[0], P1[1])}:\\quad ${value(P1)}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`P_2 = ${pairTex(P2[0], P2[1])}:\\quad ${value(P2)}`} />
        </p>
        <p>
          Os dois pontos estão na reta, então os dois dão {k}. A diferença das duas contas é {k} − {k} = 0.
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\vec{n} \\cdot \\overrightarrow{P_1P_2} = ${pairTex(a, b)} \\cdot ${pairTex(w[0], w[1])} = ${dec(a, 0)} \\times ${signed(w[0])} + ${dec(b, 0)} \\times ${signed(w[1])} = ${dec(dot(n, w), 1)}`}
          />
        </p>
        <p>
          {same
            ? 'Com P₁ e P₂ no mesmo lugar, a seta entre eles é nula. Afaste os dois pontos para ver a seta.'
            : 'Produto escalar zero: a seta azul, que está deitada na reta, forma ângulo reto com n.'}
        </p>
        {walk && (
          <p>
            <strong>Um passo na direção de n:</strong> <Formula math={`R = P_1 + \\vec{n} = ${pairTex(R[0], R[1])}`} />,
            e <Formula math={`${value(R)}`} />, que não é {k}. O ponto R saiu da reta: n não é diretor.
          </p>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>P₁, coordenada x: {txt(x1)}</span>
          <input
            type="range"
            min={p1Range[0]}
            max={p1Range[1]}
            step={step}
            value={x1}
            onChange={(e) => setX1(Number(e.target.value))}
            aria-label="Coordenada x do ponto P1"
          />
        </label>
        <label className={shared.control}>
          <span>P₂, coordenada x: {txt(x2)}</span>
          <input
            type="range"
            min={p2Range[0]}
            max={p2Range[1]}
            step={step}
            value={x2}
            onChange={(e) => setX2(Number(e.target.value))}
            aria-label="Coordenada x do ponto P2"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => setWalk(!walk)} aria-pressed={walk}>
          {walk ? 'Esconder o passo na direção de n' : 'Andar na direção de n'}
        </button>
      </div>
    </div>
  );
}
