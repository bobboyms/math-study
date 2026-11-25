import React from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {wedge, polar} from '../mathviz/vectorArc';

// O avião e o vento (lição 7.30, Módulo, direção e componentes).
//
// Cada unidade do plano vale 100 km/h (ou 100 km percorridos em 1 hora).
//
// mode="problem": uma hora de voo em 4 segundos. A seta azul tracejada cresce
//   para onde o nariz aponta (onde o avião estaria sem vento). Da ponta dela,
//   a seta laranja mostra quanto o vento já arrastou o avião para o sul. O
//   ponto verde é o avião de verdade, e o rastro verde é o que o GPS registra.
//   No quadro final, a seta verde tem um ponto de interrogação.
// mode="solved": a resolução em três etapas. Primeiro as componentes da seta
//   azul (433 e 250), depois o vento descendo 60 a partir da ponta, por fim a
//   seta verde da soma, (433, 190), com o tamanho e o ângulo.

const AIR = polar(5, 30); // 500 km/h a 30°: (4,330; 2,5)
const WIND = [0, -0.6]; // 60 km/h para o sul
const GROUND = [AIR[0] + WIND[0], AIR[1] + WIND[1]]; // (4,330; 1,9)
const GROUND_ANGLE = (Math.atan2(GROUND[1], GROUND[0]) * 180) / Math.PI; // 23,7°

const scale = (v, k) => [v[0] * k, v[1] * k];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const long = (v) => Math.hypot(v[0], v[1]) > 0.06;

const TICKS_X = [1, 2, 3, 4, 5].map((at) => ({at, label: String(at * 100)}));
const TICKS_Y = [1, 2, 3].map((at) => ({at, label: String(at * 100)}));

function ProblemFrame({t, duration}) {
  const k = stage(t, 0.3, duration - 0.4);
  const air = scale(AIR, k);
  const ground = scale(GROUND, k);
  const segments = [];
  const labels = [];
  const points = [];

  if (long(air)) segments.push({from: [0, 0], to: air, tone: 1, arrow: true, dashed: true});
  if (k > 0.04) segments.push({from: air, to: ground, tone: 2, arrow: k > 0.3});
  if (long(ground)) segments.push({from: [0, 0], to: ground, tone: 3, arrow: k > 0.98});
  points.push({at: ground, tone: 3, r: 5});

  if (k > 0.98) {
    labels.push({at: AIR, math: '\\text{sem vento}', dx: -50, dy: -14, tone: 1});
    labels.push({at: [AIR[0], (AIR[1] + GROUND[1]) / 2], math: '\\text{vento}', dx: 34, dy: 0, tone: 2});
    labels.push({at: GROUND, math: '\\text{GPS: ?}', dx: 28, dy: 24, tone: 3});
  }
  return {segments, labels, points, k};
}

function SolvedFrame({t}) {
  const k1 = stage(t, 0.3, 1.6);
  const k2 = stage(t, 1.9, 2.9);
  const k3 = stage(t, 3.2, 4.6);
  const segments = [];
  const labels = [];
  const polygons = [];

  // Etapa 1: a seta do avião e as suas componentes.
  segments.push({from: [0, 0], to: AIR, tone: 1, arrow: true});
  if (k1 > 0.02) {
    segments.push({from: [0, 0], to: [AIR[0] * k1, 0], tone: 1, dashed: true});
    segments.push({from: [AIR[0], 0], to: [AIR[0], AIR[1] * k1], tone: 1, dashed: true});
  }
  if (k1 > 0.98) {
    labels.push({at: [AIR[0] * 0.66, 0], math: '433', dy: -12, tone: 1});
    labels.push({at: [AIR[0], AIR[1] * 0.42], math: '250', dx: -22, tone: 1});
  }
  // Etapa 2: o vento sai da ponta da seta do avião, descendo 60.
  if (k2 > 0.02) segments.push({from: AIR, to: add(AIR, scale(WIND, k2)), tone: 2, arrow: k2 > 0.3});
  if (k2 > 0.98) labels.push({at: [AIR[0], (AIR[1] + GROUND[1]) / 2], math: '-60', dx: 26, tone: 2});
  // Etapa 3: a soma, da origem até a ponta do vento.
  if (k3 > 0.02) {
    segments.push({from: [0, 0], to: scale(GROUND, k3), tone: 3, arrow: k3 > 0.3});
    polygons.push(wedge(1.3, 0, GROUND_ANGLE * k3, 3));
  }
  if (k3 > 0.98) {
    labels.push({at: GROUND, math: '(433,\\ 190)', dx: 40, dy: 20, tone: 3});
    labels.push({at: scale(GROUND, 0.62), math: '\\approx 472{,}9', dx: 6, dy: 20, tone: 3});
    labels.push({at: polar(1.3, GROUND_ANGLE / 2), math: '23{,}7^\\circ', dx: 30, dy: 2, tone: 3});
  }
  return {segments, labels, polygons, k3};
}

export default function PlaneWind({mode = 'problem', caption}) {
  const duration = mode === 'problem' ? 4.4 : 4.8;
  const {ref, t, play, playing} = useAnimation({duration});

  const frame = mode === 'problem' ? ProblemFrame({t, duration}) : SolvedFrame({t});
  const hours = mode === 'problem' ? frame.k : 1;

  const defaultCaption =
    mode === 'problem'
      ? 'Uma hora de voo. A seta azul tracejada mostra onde o avião estaria sem vento: 500 km na direção do nariz, a 30° do leste. A seta laranja é o quanto o vento já empurrou o avião para o sul. O ponto verde é o avião de verdade, e a seta verde é o que o GPS registra. Cada quadrado da malha vale 100 km/h.'
      : 'A resolução. A seta azul (500 km/h a 30°) se decompõe em 433 para o leste e 250 para o norte. O vento (laranja) desce 60 a partir da ponta azul. A seta verde vai da origem até a ponta do vento: (433, 190), com cerca de 472,9 km/h a 23,7° do leste.';

  return (
    <div className={shared.wrapper} data-explorer="plane-wind">
      <div ref={ref}>
        <CartesianPlane
          xMin={-0.5}
          xMax={5.6}
          yMin={-0.5}
          yMax={3.1}
          xUnit={64}
          xTicks={TICKS_X}
          yTicks={TICKS_Y}
          axisLabels={['\\text{leste}', '\\text{norte}']}
          segments={frame.segments}
          labels={frame.labels}
          points={frame.points ?? []}
          polygons={frame.polygons ?? []}
          caption={caption ?? defaultCaption}
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {mode === 'problem' ? (
          <p>
            Tempo de voo: <Formula math={`${(Math.round(hours * 10) / 10).toFixed(1).replace('.', '{,}')}\\ \\text{h}`} />. O
            painel diz 500 km/h a 30°. O GPS mostra a seta verde, mais curta e mais baixa. Quanto ela mede, e
            que ângulo ela faz com o leste?
          </p>
        ) : (
          <p>
            Avião: <Formula math="(433,\ 250)" />. Vento: <Formula math="(0,\ -60)" />. Soma:{' '}
            <Formula math="(433 + 0,\ 250 - 60) = (433,\ 190)" />. Tamanho{' '}
            <Formula math="\sqrt{433^2 + 190^2} \approx 472{,}9" /> km/h, ângulo{' '}
            <Formula math="\arctg \tfrac{190}{433} \approx 23{,}7^\circ" />.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {mode === 'problem' ? 'Ver a hora de voo de novo' : 'Ver a resolução de novo'}
        </button>
      </div>
    </div>
  );
}
