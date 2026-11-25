import React from 'react';
import CartesianPlane from '../CartesianPlane';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {AREAS, PRICES} from '../FitLineExplorer/apartamentos';

// A primeira tentativa da corretora (problema motivador da lição 11.12).
//
// Animação: a reta y = 8x − 80, que passa pelos apartamentos 1 e 2, cresce da
// esquerda para a direita; em 60, 70 e 80 m² aparece o preço que ela prevê
// (bolinha vazia), e um tracejado verde desce até o preço de verdade, com o
// tamanho do erro: 70, 60 e 120 mil. O quadro final é a reta com os três
// erros.

const M = 8;
const N = -80;
const X0 = 35; // y = 200
const X1 = 82.5; // y = 580
const MISSES = [2, 3, 4]; // apartamentos 3, 4 e 5 (índices)

export default function FitFirstTry({caption}) {
  const duration = 4.4;
  const {ref, t, play, playing} = useAnimation({duration});

  const grow = stage(t, 0.2, 1.4);
  const xEnd = X0 + (X1 - X0) * grow;
  const segments = [{from: [X0, M * X0 + N], to: [xEnd, M * xEnd + N], tone: 2}];
  const points = AREAS.map((x, i) => ({at: [x, PRICES[i]], tone: 1, label: String(i + 1), dx: 12, dy: 4, fontSize: 12}));
  const labels = [];
  if (grow > 0.5) labels.push({at: [55, 360], math: 'y = 8x - 80', tone: 2, dx: -10, dy: -10, anchor: 'end'});

  MISSES.forEach((i, j) => {
    const x = AREAS[i];
    const yp = M * x + N;
    const y = PRICES[i];
    const s = stage(t, 1.6 + 0.85 * j, 2.3 + 0.85 * j);
    if (s <= 0) return;
    points.push({at: [x, yp], tone: 2, open: true, r: 5});
    const yEnd = yp + (y - yp) * s;
    if (Math.abs(yEnd - yp) > 0.5) segments.push({from: [x, yp], to: [x, yEnd], tone: 3, dashed: true});
    if (s > 0.95) labels.push({at: [x, (y + yp) / 2], math: `\\text{erra } ${yp - y}`, tone: 3, dx: 8, anchor: 'start', fontSize: 13});
  });

  return (
    <div className={shared.wrapper} data-explorer="fit-first-try">
      <div ref={ref}>
        <CartesianPlane
          xMin={30}
          xMax={95}
          yMin={200}
          yMax={580}
          xUnit={7}
          yUnit={1.1}
          xStep={10}
          yStep={40}
          segments={segments}
          points={points}
          labels={labels}
          axisLabels={['\\text{m}^2', '\\text{R\\$ mil}']}
          caption={
            caption ??
            'Os cinco apartamentos (área em m² na horizontal, preço em R$ mil na vertical). A reta laranja passa pelos apartamentos 1 e 2 e prevê 400 mil para 60 m², 480 para 70 m² e 560 para 80 m² (bolinhas vazias). Os tracejados verdes mostram quanto ela erra nos outros três.'
          }
        />
      </div>
      <div className={shared.buttons}>
        <button type="button" disabled={playing} onClick={() => play()}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
