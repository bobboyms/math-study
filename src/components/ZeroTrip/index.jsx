import React from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease, fmt} from '../mathviz/useAnimation';

// O vetor nulo (lição 7.28, Vetores): sair e voltar ao mesmo lugar.
//
// O entregador sai do restaurante R, contorna um quarteirão grande e volta.
// O caminho já andado fica em verde. A seta azul liga R à posição atual: é o
// deslocamento até ali. Ela cresce, gira, encolhe e some quando ele chega de
// volta. No quadro final: 16 quarteirões andados e deslocamento (0, 0).

const ROUTE = [
  [1, 1],
  [6, 1],
  [6, 4],
  [1, 4],
  [1, 1],
];
const LENGTHS = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
const TOTAL = LENGTHS.reduce((s, x) => s + x, 0);
const DURATION = 5;

function at(dist) {
  let left = dist;
  for (let i = 0; i < LENGTHS.length; i += 1) {
    if (left <= LENGTHS[i]) {
      const k = left / LENGTHS[i];
      const p = ROUTE[i];
      const q = ROUTE[i + 1];
      return {pos: [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k], leg: i};
    }
    left -= LENGTHS[i];
  }
  return {pos: ROUTE[ROUTE.length - 1], leg: LENGTHS.length - 1};
}

const dec = (x) => fmt(Math.abs(x) < 0.05 ? 0 : x, 1).replace(',', '{,}').replace(/\{,\}0$/, '');

export default function ZeroTrip({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const k = ease(Math.max(0, t - 0.3) / (DURATION - 0.5));
  const walked = Math.min(TOTAL, k * TOTAL);
  const {pos, leg} = at(walked);
  const R = ROUTE[0];
  const done = walked >= TOTAL - 1e-6;

  const segments = [];
  for (let i = 0; i < leg; i += 1) segments.push({from: ROUTE[i], to: ROUTE[i + 1], tone: 3});
  if (Math.hypot(pos[0] - ROUTE[leg][0], pos[1] - ROUTE[leg][1]) > 0.03) {
    segments.push({from: ROUTE[leg], to: pos, tone: 3});
  }
  const disp = [pos[0] - R[0], pos[1] - R[1]];
  if (Math.hypot(disp[0], disp[1]) > 0.15) segments.push({from: R, to: pos, tone: 1, arrow: true});

  const points = [{at: R, tone: 2, r: 6, label: 'R', dx: -14, dy: 18}];
  if (!done) points.push({at: pos, tone: 0, r: 4});
  const labels = done ? [{at: R, math: '\\overrightarrow{RR} = (0,\\ 0)', dx: 72, dy: 22, tone: 1}] : [];

  return (
    <div className={shared.wrapper} data-explorer="zero-trip">
      <div ref={ref}>
        <CartesianPlane
          xMin={0}
          xMax={8}
          yMin={0}
          yMax={6}
          xUnit={38}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'O entregador sai do restaurante R e dá a volta num retângulo de 5 por 3 quarteirões. Em verde, o caminho já andado. A seta azul vai de R até onde ele está agora: é o deslocamento até ali. Na volta a R, a seta some.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="off">
        <p>
          Caminho andado: <Formula math={`${dec(walked)}`} /> quarteirões. Deslocamento desde R:{' '}
          <Formula math={`(${dec(disp[0])},\\ ${dec(disp[1])})`} />.
        </p>
        <p>
          {done
            ? 'Ele andou 16 quarteirões, mas terminou onde começou. O deslocamento total é o vetor nulo.'
            : 'A seta mostra só a diferença entre o lugar de agora e o lugar de saída, e não o caminho.'}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a volta de novo
        </button>
      </div>
    </div>
  );
}
