import React from 'react';
import CartesianPlane from '../CartesianPlane';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {wedge, polar} from '../mathviz/vectorArc';

// Dois jeitos de dar a mesma instrução (lição 7.30).
//
// Da praça (origem) até a padaria (4, 3), em quarteirões. Primeiro um
// caminhante (laranja) segue a instrução por coordenadas: 4 para o leste e
// depois 3 para o norte. Em seguida outro (azul) segue a instrução por tamanho
// e ângulo: 5 quarteirões em linha reta, a cerca de 36,9° do leste. Os dois
// chegam ao mesmo ponto. No quadro final ficam o "L" e a seta reta, com o
// ângulo marcado.

const TARGET = [4, 3];
const ANGLE = (Math.atan2(3, 4) * 180) / Math.PI; // 36,87°
const DURATION = 5;

const lerp = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];

export default function TwoRoutes({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const kEast = stage(t, 0.3, 1.5);
  const kNorth = stage(t, 1.6, 2.6);
  const kLine = stage(t, 2.9, 4.4);
  const kAngle = stage(t, 4.3, DURATION);

  const segments = [];
  const labels = [];
  const points = [];
  const polygons = [];

  // Caminho por coordenadas.
  const east = [4 * kEast, 0];
  if (kEast > 0.02) segments.push({from: [0, 0], to: east, tone: 2, arrow: kNorth < 0.02});
  if (kNorth > 0.02) segments.push({from: [4, 0], to: [4, 3 * kNorth], tone: 2, arrow: true});
  if (kEast > 0.98) labels.push({at: [2, 0], math: '4\\ \\text{para o leste}', dy: 40, tone: 2});
  if (kNorth > 0.98) labels.push({at: [4, 1.5], math: '3\\ \\text{para o norte}', dx: 12, anchor: 'start', tone: 2});
  const walkerL = kNorth > 0 ? [4, 3 * kNorth] : east;
  if (kLine < 0.02) points.push({at: walkerL, tone: 2, r: 5});

  // Caminho por tamanho e ângulo.
  if (kLine > 0.02) {
    const now = lerp([0, 0], TARGET, kLine);
    segments.push({from: [0, 0], to: now, tone: 1, arrow: true});
    points.push({at: now, tone: 1, r: 5});
  }
  if (kLine > 0.98) labels.push({at: [2, 1.5], math: '5\\ \\text{em linha reta}', dx: -30, dy: -18, tone: 1});
  if (kAngle > 0.02) polygons.push(wedge(1.1, 0, ANGLE * kAngle, 1));
  if (kAngle > 0.98) labels.push({at: polar(1.1, ANGLE / 2), math: '\\approx 36{,}9^\\circ', dx: 34, dy: 0, tone: 1});

  points.push({at: [0, 0], tone: 0, r: 4, label: '\\text{praça}', dx: -10, dy: 20});
  points.push({at: TARGET, tone: 0, r: 4, label: '\\text{padaria}', dx: -30, dy: -16});

  return (
    <div className={shared.wrapper} data-explorer="two-routes">
      <div ref={ref}>
        <CartesianPlane
          xMin={-1}
          xMax={6.6}
          yMin={-1}
          yMax={4}
          xUnit={50}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          polygons={polygons}
          caption={
            caption ??
            'Da praça até a padaria, em quarteirões. O caminhante laranja anda 4 para o leste e depois 3 para o norte. O azul anda 5 em linha reta, a cerca de 36,9° do leste. Os dois chegam ao mesmo ponto, (4, 3).'
          }
        />
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver os dois caminhos de novo
        </button>
      </div>
    </div>
  );
}
