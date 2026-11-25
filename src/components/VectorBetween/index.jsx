import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O vetor que leva de A até B (lição 7.28, Vetores): chegada menos saída.
//
// Um ponto sai do ponto de saída, anda na horizontal até ficar abaixo (ou
// acima) da chegada, depois anda na vertical até ela. Cada trecho recebe o
// seu valor, Δx e Δy, e por fim a seta liga a saída à chegada. O botão de
// sentido troca saída e chegada: a mesma seta, apontada para o outro lado, e
// as duas coordenadas trocam de sinal.

const PAIRS = [
  {A: [2, 1], B: [7, 4]},
  {A: [-2, 3], B: [4, -1]},
  {A: [1, 1], B: [5, 3]},
];
const DURATION = 3.4;

const pair = (p) => `(${p[0]},\\ ${p[1]})`;
const par = (n) => (n < 0 ? `(${n})` : String(n));
const num = (n) => String(n).replace('-', '−');

export default function VectorBetween({initial = 0, caption}) {
  const [index, setIndex] = useState(initial);
  const [back, setBack] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const {A, B} = PAIRS[index];
  const from = back ? B : A;
  const to = back ? A : B;
  const fromName = back ? 'B' : 'A';
  const toName = back ? 'A' : 'B';
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];

  const kx = stage(t, 0.3, 1.4);
  const ky = stage(t, 1.5, 2.6);
  const ka = stage(t, 2.7, DURATION);
  const corner = [to[0], from[1]];

  const segments = [];
  const labels = [];
  if (kx > 0.03) segments.push({from, to: [from[0] + dx * kx, from[1]], tone: 3, dashed: true});
  if (ky > 0.03) segments.push({from: corner, to: [to[0], from[1] + dy * ky], tone: 3, dashed: true});
  if (ka > 0.03) {
    segments.push({from, to: [from[0] + dx * ka, from[1] + dy * ka], tone: 1, arrow: true});
  }
  if (kx >= 1) labels.push({at: [from[0] + dx / 2, from[1]], math: `\\Delta x = ${dx}`, dy: dy > 0 ? -12 : 20, tone: 3});
  if (ky >= 1) labels.push({at: [to[0], from[1] + dy / 2], math: `\\Delta y = ${dy}`, dx: dx > 0 ? 38 : -38, dy: 4, tone: 3});

  // Rótulos dos pontos: atrás da saída e além da chegada, na direção da seta,
  // longe dos dois trechos.
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const points = [
    {at: from, tone: 2, label: `${fromName}${pair(from)}`, dx: -ux * 30, dy: uy * 22 + 4},
    {at: to, tone: 2, label: `${toName}${pair(to)}`, dx: ux * 30, dy: -uy * 22 + 4},
  ];
  if (t < DURATION) points.push({at: [from[0] + dx * kx, from[1] + dy * ky], tone: 0, r: 4});

  const vecName = `\\overrightarrow{${fromName}${toName}}`;
  const formula = `${vecName} = ${toName} - ${fromName} = (${to[0]} - ${par(from[0])},\\ ${to[1]} - ${par(from[1])}) = ${pair([dx, dy])}`;

  return (
    <div className={shared.wrapper} data-explorer="vector-between">
      <div ref={ref}>
        <CartesianPlane
          xMin={-3}
          xMax={8}
          yMin={-2}
          yMax={6}
          xUnit={32}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'O ponto cinza sai do ponto de saída, anda na horizontal (Δx) e depois na vertical (Δy) até a chegada. A seta azul é o vetor da saída até a chegada.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Saída <Formula math={fromName} />, chegada <Formula math={toName} />. Cada coordenada é “onde terminou menos onde começou”:
        </p>
        <p className={shared.formula}>
          <Formula math={formula} />
        </p>
        <p>
          {back
            ? 'É a mesma seta do outro sentido, apontada para o lado contrário: as duas coordenadas trocaram de sinal.'
            : 'Troque o sentido para ver o caminho de volta.'}
        </p>
      </div>
      <div className={shared.buttons}>
        {PAIRS.map((p, i) => (
          <button
            key={i}
            type="button"
            disabled={playing}
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              setBack(false);
              play();
            }}
          >
            A({num(p.A[0])}, {num(p.A[1])}) e B({num(p.B[0])}, {num(p.B[1])})
          </button>
        ))}
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setBack(!back);
            play();
          }}
        >
          {back ? 'Voltar para A até B' : 'Trocar o sentido: de B até A'}
        </button>
      </div>
    </div>
  );
}
