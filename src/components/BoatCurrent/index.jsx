import React from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import {pairMath} from '../VectorSumKit';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O barco e a correnteza (lição 7.29, Soma de vetores): o problema motivador.
//
// O rio corre entre as margens y = 0 e y = 8 (km). O motor empurra o barco
// para o norte a 8 km/h, e a correnteza arrasta para o leste a 6 km/h, os dois
// ao mesmo tempo. A animação faz passar uma hora: o barco (ponto verde) deixa
// a trilha, e as duas setinhas presas a ele mostram os dois empurrões, que não
// param em momento nenhum. Um ponto cinza mostra onde o barco estaria sem
// correnteza. Quadro final: o barco do outro lado, em (6, 8), e o ponto cinza
// em (0, 8), bem em frente à partida.

const END = [6, 8];
const DURATION = 4.6;
// Setinhas presas ao barco, em escala reduzida (1/4 do tamanho real), só para
// mostrar a direção de cada empurrão sem sair do desenho.
const SMALL = 0.25;

export default function BoatCurrent({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const s = stage(t, 0.6, DURATION - 0.2);
  const boat = [END[0] * s, END[1] * s];
  const ghost = [0, END[1] * s];
  const done = s > 0.995;

  const segments = [
    // margem norte (a margem sul é o eixo x)
    {from: [-1, 8], to: [9, 8], muted: true, dashed: true},
  ];
  if (s > 0.01) {
    segments.push({from: [0, 0], to: boat, tone: 3, dashed: true});
    segments.push({from: [0, 0], to: ghost, muted: true, dashed: true});
  }
  segments.push({
    from: boat,
    to: [boat[0], boat[1] + 8 * SMALL],
    tone: 1,
    arrow: true,
  });
  segments.push({
    from: boat,
    to: [boat[0] + 6 * SMALL, boat[1]],
    tone: 2,
    arrow: true,
  });

  const labels = [
    {at: [8.2, 0], math: '\\text{margem sul}', dy: -14, fontSize: 12, anchor: 'end'},
    {at: [boat[0], boat[1] + 8 * SMALL], math: '\\text{motor}', tone: 1, dx: -30, dy: -8, fontSize: 12},
    {at: [boat[0] + 6 * SMALL, boat[1]], math: '\\text{correnteza}', tone: 2, dx: 26, dy: -12, fontSize: 12},
  ];

  const points = [
    {at: ghost, tone: 0, r: 4},
    {at: boat, tone: 3, r: 6},
  ];
  if (done) {
    points[0].label = '(0,\\ 8)';
    points[0].dx = 28;
    points[0].dy = 16;
    points[1].label = '(6,\\ 8)';
    points[1].dx = 30;
    points[1].dy = 18;
  }

  const hours = s;
  const minutes = Math.round(hours * 60);

  return (
    <div className={shared.wrapper} data-explorer="boat-current">
      <div ref={ref}>
        <CartesianPlane
          xMin={-1}
          xMax={9}
          yMin={-1}
          yMax={10}
          xUnit={30}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'O eixo x aponta para o leste e o eixo y para o norte, em quilômetros. O rio corre entre a margem sul (o eixo x) e a margem norte (a linha tracejada de cima). As setinhas presas ao barco (ponto verde) mostram os dois empurrões, que agem juntos o tempo todo. O ponto cinza mostra onde o barco estaria se a água estivesse parada.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Tempo de viagem: <strong>{minutes} min</strong>. O barco está em{' '}
          <Formula math={pairMath(boat[0], boat[1], 1)} />. Sem correnteza, estaria em{' '}
          <Formula math={pairMath(0, ghost[1], 1)} />.
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a travessia de novo
        </button>
      </div>
    </div>
  );
}
