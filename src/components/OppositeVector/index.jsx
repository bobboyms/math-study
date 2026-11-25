import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O vetor oposto (lição 7.28, Vetores): a mesma seta, virada para o outro lado.
//
// A seta v = AB, de A(1, 1) até B(5, 3), aparece. Uma cópia sobe 2 unidades
// (mesmo vetor, outro lugar, para não cobrir a primeira) e gira meia volta em
// torno do próprio meio: o comprimento e a reta continuam os mesmos, e a ponta
// passa para o outro lado. É −v = (−4, −2). O botão do contraexemplo mostra
// (−4, 2), que troca só um sinal e sai inclinado de outro jeito.

const A = [1, 1];
const B = [5, 3];
const V = [B[0] - A[0], B[1] - A[1]];
const LIFT = 2;
const DURATION = 3.6;

export default function OppositeVector({caption}) {
  const [contra, setContra] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const kv = stage(t, 0.3, 1.2);
  const kl = stage(t, 1.4, 2.2);
  const kr = stage(t, 2.4, DURATION);

  const segments = [];
  const labels = [];
  if (kv > 0.03) segments.push({from: A, to: [A[0] + V[0] * kv, A[1] + V[1] * kv], tone: 1, arrow: true});
  if (kv >= 1) labels.push({at: [3, 2], math: '\\vec{v} = \\overrightarrow{AB} = (4,\\ 2)', dx: 40, dy: 40, tone: 1});

  if (kl > 0) {
    const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + LIFT * kl];
    const ang = Math.PI * kr;
    const h = [V[0] / 2, V[1] / 2];
    const rh = [h[0] * Math.cos(ang) - h[1] * Math.sin(ang), h[0] * Math.sin(ang) + h[1] * Math.cos(ang)];
    const tail = [mid[0] - rh[0], mid[1] - rh[1]];
    const tip = [mid[0] + rh[0], mid[1] + rh[1]];
    segments.push({from: tail, to: tip, tone: 2, arrow: true});
    if (kr >= 1) labels.push({at: [3, 4], math: '-\\vec{v} = (-4,\\ -2)', dx: -20, dy: -40, tone: 2});
  }
  if (contra && kr >= 1) {
    segments.push({from: [5, 5], to: [1, 7], tone: 3, arrow: true, dashed: true});
    labels.push({at: [3, 6], math: '(-4,\\ 2)', dx: 6, dy: -18, tone: 3});
  }

  const points = [
    {at: A, tone: 0, r: 4, label: 'A', dx: -12, dy: 16},
    {at: B, tone: 0, r: 4, label: 'B', dx: 14, dy: 14},
  ];

  return (
    <div className={shared.wrapper} data-explorer="opposite-vector">
      <div ref={ref}>
        <CartesianPlane
          xMin={0}
          xMax={7}
          yMin={0}
          yMax={8}
          xUnit={40}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'Embaixo, a seta v de A até B. Uma cópia de v sobe duas unidades, para não cobrir a primeira, e gira meia volta em torno do próprio meio. O comprimento e a inclinação não mudam; a ponta passa para o outro lado. Essa é a seta de −v.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {contra ? (
          <p>
            O tracejado verde é <Formula math="(-4,\ 2)" />: só o primeiro sinal trocou. Ele anda para a esquerda e para{' '}
            <strong>cima</strong>, e por isso sai inclinado de outro jeito. Não está na mesma direção de{' '}
            <Formula math="\vec{v}" />, e não é o oposto.
          </p>
        ) : (
          <p>
            Fazer <Formula math="\vec{v}" /> e depois <Formula math="-\vec{v}" /> leva de volta à saída:{' '}
            <Formula math="(1,\ 1) + (4,\ 2) = (5,\ 3)" /> e <Formula math="(5,\ 3) + (-4,\ -2) = (1,\ 1)" />.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a cópia girar de novo
        </button>
        <button type="button" onClick={() => setContra(!contra)} disabled={playing} aria-pressed={contra}>
          {contra ? 'Esconder o contraexemplo' : 'Mostrar o contraexemplo (−4, 2)'}
        </button>
      </div>
    </div>
  );
}
