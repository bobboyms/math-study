import React from 'react';
import SpaceScene, {add, times} from '../SpaceScene';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// A vertical faz ângulo reto com toda linha do chão que passa pelo pé dela
// (lição 7.34, Vetores no espaço).
//
// Um poste aprumado sai do ponto F do chão. Um esquadro (triângulo com um
// canto reto) fica em pé encostado no poste, com um lado no chão, e dá uma
// volta inteira em torno do poste. Em toda direção o canto reto encaixa. A
// volta termina com o lado do chão apontando para a origem O: é a direção da
// diagonal do chão, a do triângulo em pé da fórmula da distância.

const F = [2, 3, 0];
const TOP = [2, 3, 4.2];
const LEG = 2.2;
const END = (Math.atan2(-3, -2) * 180) / Math.PI + 360; // ≈ 236,3°: de F para O
const DURATION = 4.4;

export default function PoleSquare({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const k = stage(t, 0.2, 4.0);
  const done = stage(t, 4.0, DURATION);
  const a = ((END - 360 * (1 - k)) * Math.PI) / 180;
  const dir = [Math.cos(a), Math.sin(a), 0];
  const foot = add(F, times(LEG, dir));
  const up = add(F, [0, 0, LEG]);
  const far = add(F, times(-1.6, dir));
  const near = add(F, times(3.4, dir));

  const items = [
    {type: 'poly', pts: [[0, 0, 0], [4.5, 0, 0], [4.5, 6, 0], [0, 6, 0]], tone: 0, fill: 0.07},
    {type: 'line', from: far, to: near, tone: 2, dashed: true},
    {type: 'poly', pts: [F, foot, up], tone: 3, fill: 0.22, stroke: true},
    {type: 'line', from: F, to: TOP, tone: 0, width: 4},
    {type: 'right', at: F, a: dir, b: [0, 0, 1], size: 0.5, tone: 3},
    {type: 'line', from: F, to: [0, 0, 0], dotted: true, opacity: done},
    {type: 'point', at: [0, 0, 0], tone: 0, r: 3.5, math: 'O', dx: 13, dy: -9},
    {type: 'point', at: F, tone: 0, r: 3.5, math: 'F', dx: 14, dy: 12},
    {type: 'label', at: TOP, math: '\\text{poste}', dy: -14},
  ];

  return (
    <div className={shared.wrapper} data-explorer="pole-square">
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={40}
          axes={{max: [4.8, 6.3, 4.6]}}
          frame={[TOP, [4.5, 6, 0], [4.5, 0, 0], [0, 6, 0]]}
          caption={
            caption ??
            'O poste sobe na vertical a partir do ponto F do chão. O esquadro verde fica em pé, com um lado no poste e outro no chão, e dá uma volta em torno do poste: o canto reto encaixa em toda direção do chão. A volta termina apontando para a origem O.'
          }
        />
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
