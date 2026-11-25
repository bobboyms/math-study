import React from 'react';
import CartesianPlane from '../CartesianPlane';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';

// "Ande 5 quarteirões" a partir do mesmo ponto: um número só não diz onde se
// chega. Setas de comprimento 5 saem uma depois da outra, em direções
// diferentes, e as pontas vão marcando uma circunferência de raio 5. No quadro
// final ficam as 12 setas que terminam em esquina (coordenadas inteiras) e a
// circunferência inteira tracejada: qualquer ponto dela é "5 quarteirões".

const ENDS = [
  [5, 0], [4, 3], [3, 4], [0, 5], [-3, 4], [-4, 3],
  [-5, 0], [-4, -3], [-3, -4], [0, -5], [3, -4], [4, -3],
];
const DURATION = 4.2;
const EACH = 0.28;

export default function FiveBlocksCircle({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const segments = [];
  const points = [{at: [0, 0], tone: 2, r: 5, label: '\\text{saída}', dx: 70, dy: -24}];
  ENDS.forEach((end, i) => {
    const start = 0.3 + i * EACH;
    if (t < start) return;
    const k = Math.min(1, (t - start) / EACH);
    const tip = [end[0] * k, end[1] * k];
    if (k > 0.04) segments.push({from: [0, 0], to: tip, tone: 1, arrow: true});
    if (k >= 1) points.push({at: end, tone: 1, r: 3.5});
  });
  const circleOn = t >= 0.3 + ENDS.length * EACH + 0.2;

  return (
    <div className={shared.wrapper} data-explorer="five-blocks-circle">
      <div ref={ref}>
        <CartesianPlane
          xMin={-6}
          xMax={6}
          yMin={-6}
          yMax={6}
          xUnit={30}
          xTicks={[{at: -5, label: '-5'}, {at: 5, label: '5'}]}
          yTicks={[{at: -5, label: '-5'}, {at: 5, label: '5'}]}
          axisLabels={['x', 'y']}
          circles={circleOn ? [{center: [0, 0], r: 5, tone: 3, dashed: true}] : []}
          segments={segments}
          points={points}
          caption={
            caption ??
            'Doze entregadores saem do mesmo ponto e cada um anda 5 quarteirões em linha reta, cada um para um lado. Eles chegam a doze lugares diferentes. A circunferência tracejada, de raio 5, reúne todos os lugares possíveis.'
          }
        />
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver as setas saindo de novo
        </button>
      </div>
    </div>
  );
}
