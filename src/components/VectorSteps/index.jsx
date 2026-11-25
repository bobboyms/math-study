import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Dois números guardam a seta inteira (lição 7.28, Vetores).
//
// Um ponto sai da origem e percorre a seta em duas etapas: primeiro anda na
// horizontal (a), depois na vertical (b). Só então a seta aparece, ligando a
// saída à chegada em linha reta. Os botões trocam o vetor, inclusive com
// coordenadas negativas e zero, e o painel traduz o sinal em lado.

const PRESETS = [
  [3, 4],
  [-3, 4],
  [4, -2],
  [-2, -5],
  [0, 5],
];
const DURATION = 3.4;

const pair = (p) => `(${p[0]},\\ ${p[1]})`;
const num = (n) => String(n).replace('-', '−');

function sideX(a) {
  if (a === 0) return <>a = 0: não anda na horizontal.</>;
  return (
    <>
      <Formula math={`a = ${a}`} />: anda {Math.abs(a)} para a {a > 0 ? 'direita (sinal +)' : 'esquerda (sinal −)'}.
    </>
  );
}
function sideY(b) {
  if (b === 0) return <>b = 0: não anda na vertical.</>;
  return (
    <>
      <Formula math={`b = ${b}`} />: anda {Math.abs(b)} para {b > 0 ? 'cima (sinal +)' : 'baixo (sinal −)'}.
    </>
  );
}

export default function VectorSteps({initial = 0, caption}) {
  const [index, setIndex] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const [a, b] = PRESETS[index];

  const kx = a === 0 ? 1 : stage(t, 0.3, 1.4);
  const ky = b === 0 ? 1 : stage(t, 1.5, 2.6);
  const ka = stage(t, 2.7, DURATION);
  const walker = [a * kx, b * ky];

  const segments = [];
  const labels = [];
  if (a !== 0 && kx > 0.03) {
    segments.push({from: [0, 0], to: [a * kx, 0], tone: 3, dashed: true});
  }
  if (b !== 0 && ky > 0.03) {
    segments.push({from: [a, 0], to: [a, b * ky], tone: 3, dashed: true});
  }
  if (ka > 0.03) {
    segments.push({from: [0, 0], to: [a * ka, b * ka], tone: 1, arrow: true});
  }
  if (a !== 0 && kx >= 1) // Dentro do triângulo: do outro lado ficariam a seta (b = 0) ou nada.
    labels.push({at: [a / 2, 0], math: `a = ${a}`, dy: b > 0 ? -12 : 20, tone: 3});
  if (b !== 0 && ky >= 1) {
    labels.push({at: [a, b / 2], math: `b = ${b}`, dx: a >= 0 ? 30 : -30, dy: 4, tone: 3});
  }
  if (ka >= 1) {
    const len = Math.hypot(a, b);
    labels.push({at: [a, b], math: `\\vec{v} = ${pair([a, b])}`, dx: a === 0 ? 46 : (a / len) * 20, dy: b >= 0 ? -16 : 22, tone: 1});
  }
  const points = [
    {at: [0, 0], tone: 0, r: 4},
    {at: walker, tone: 2, r: 5},
  ];

  return (
    <div className={shared.wrapper} data-explorer="vector-steps">
      <div ref={ref}>
        <CartesianPlane
          xMin={-6}
          xMax={6}
          yMin={-6}
          yMax={6}
          xUnit={30}
          showNumbers={false}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'O ponto laranja sai da origem, anda primeiro na horizontal e depois na vertical. A seta azul liga a saída à chegada em linha reta. Os dois trechos verdes guardam a seta inteira.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>{sideX(a)}</p>
        <p>{sideY(b)}</p>
        <p>
          Os dois números juntos: <Formula math={`\\vec{v} = ${pair([a, b])}`} />.
        </p>
      </div>
      <div className={shared.buttons}>
        {PRESETS.map((p, i) => (
          <button
            key={pair(p)}
            type="button"
            disabled={playing}
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              play();
            }}
          >
            ({num(p[0])}, {num(p[1])})
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
