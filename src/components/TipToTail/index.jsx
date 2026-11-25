import React from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath} from '../VectorSumKit';

// Ponta com cauda (lição 7.29): dois deslocamentos feitos um depois do outro
// valem por um só.
//
// 1. A seta u sai da origem e cresce até a ponta.
// 2. A seta v começa exatamente onde u terminou.
// 3. A seta da soma liga o começo de tudo ao fim de tudo.
// Um ponto cinza (o caminhante) percorre u e depois v. Quadro final: as três
// setas, com a soma da cauda de u até a ponta de v.

const DURATION = 4.4;

export default function TipToTail({u = [3, 1], v = [1, 2], caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const ku = stage(t, 0.3, 1.5);
  const kv = stage(t, 1.7, 2.9);
  const ks = stage(t, 3.1, DURATION);
  const tipU = u;
  const tipS = [u[0] + v[0], u[1] + v[1]];

  const segments = [];
  const labels = [];
  if (ku > 0.03) segments.push({from: [0, 0], to: [u[0] * ku, u[1] * ku], tone: 1, arrow: true});
  if (kv > 0.03) {
    segments.push({from: tipU, to: [tipU[0] + v[0] * kv, tipU[1] + v[1] * kv], tone: 2, arrow: true});
  }
  if (ks > 0.03) segments.push({from: [0, 0], to: [tipS[0] * ks, tipS[1] * ks], tone: 3, arrow: true});

  if (ku >= 1) labels.push({at: [u[0] / 2, u[1] / 2], math: `\\vec{u} = ${pairMath(...u)}`, tone: 1, dx: 62 + (u[0] * 25), dy: 2});
  if (kv >= 1) labels.push({at: [tipU[0] + v[0] / 2, tipU[1] + v[1] / 2], math: `\\vec{v} = ${pairMath(...v)}`, tone: 2, dx: 58, dy: 0});
  if (ks >= 1) {
    labels.push({at: [tipS[0] / 2, tipS[1] / 2], math: `\\vec{u} + \\vec{v} = ${pairMath(...tipS)}`, tone: 3, dx: -66, dy: -10});
  }

  // o caminhante: anda u e depois v
  let walker = [0, 0];
  if (kv > 0) walker = [tipU[0] + v[0] * kv, tipU[1] + v[1] * kv];
  else walker = [u[0] * ku, u[1] * ku];

  const points = [
    {at: [0, 0], tone: 0, r: 4, label: '\\text{saída}', dx: -8, dy: 18, fontSize: 12},
  ];
  if (t < DURATION - 0.05) points.push({at: walker, tone: 0, r: 5});
  if (ks >= 1) points.push({at: tipS, tone: 3, r: 4, label: '\\text{chegada}', dx: 10, dy: -18, fontSize: 12});

  return (
    <div className={shared.wrapper} data-explorer="tip-to-tail">
      <div ref={ref}>
        <CartesianPlane
          xMin={-1}
          xMax={6}
          yMin={-1}
          yMax={4}
          xUnit={50}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'O ponto cinza anda primeiro a seta u (azul) e depois a seta v (laranja), que começa onde u terminou. A seta verde vai direto da saída até a chegada: é a soma u + v.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          {ks >= 1 ? (
            <>
              Um único deslocamento <Formula math={pairMath(...tipS)} /> leva da saída ao mesmo lugar que{' '}
              <Formula math={pairMath(...u)} /> seguido de <Formula math={pairMath(...v)} />.
            </>
          ) : (
            'O caminhante está andando os dois trechos, um depois do outro.'
          )}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o passeio de novo
        </button>
      </div>
    </div>
  );
}
