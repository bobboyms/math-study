import React from 'react';
import SpaceScene, {lerp} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Pitágoras duas vezes (lição 7.34, Vetores no espaço).
//
// Etapa 1, no chão: os deslocamentos 3 (em x) e 4 (em y) são catetos, com
// ângulo reto entre eles, e a diagonal do chão OS = 5 aparece como hipotenusa.
// Etapa 2, em pé: do ponto S sobe a aresta vertical de 12, com ângulo reto em
// S, e o voo OP = 13 aparece como hipotenusa do triângulo em pé.
//
// `stages={1}` mostra só a etapa do chão; `stages={2}` mostra as duas.

const O = [0, 0, 0];
const X3 = [3, 0, 0];
const S = [3, 4, 0];
const P = [3, 4, 12];

export default function FloorThenUp({stages = 2, caption}) {
  const duration = stages === 1 ? 2.4 : 4.6;
  const {ref, t, play, playing} = useAnimation({duration});

  const kLegs = stage(t, 0, 1.0);
  const kFloor = stage(t, 1.1, 2.2);
  const kUp = stages === 2 ? stage(t, 2.4, 3.4) : 0;
  const kHyp = stages === 2 ? stage(t, 3.5, 4.6) : 0;

  const items = [];
  items.push({type: 'poly', pts: [O, X3, S], tone: 2, fill: 0.14, opacity: kFloor});
  if (kUp > 0) items.push({type: 'poly', pts: [O, S, lerp(S, P, kUp)], tone: 1, fill: 0.1, opacity: kHyp});
  if (kLegs > 0.02) {
    items.push(
      {type: 'line', from: O, to: lerp(O, X3, Math.min(1, kLegs * 2)), tone: 3, width: 2.6},
    );
    if (kLegs > 0.5) items.push({type: 'line', from: X3, to: lerp(X3, S, (kLegs - 0.5) * 2), tone: 3, width: 2.6});
  }
  items.push(
    {type: 'right', at: X3, a: [-1, 0, 0], b: [0, 1, 0], size: 0.55, opacity: kLegs >= 1 ? 1 : 0},
    {type: 'label', at: [1.5, 0, 0], math: '3', dx: -12, dy: 4, tone: 3, opacity: kLegs >= 0.5 ? 1 : 0},
    {type: 'label', at: [3, 2, 0], math: '4', dy: 15, tone: 3, opacity: kLegs >= 1 ? 1 : 0},
  );
  if (kFloor > 0.02) items.push({type: 'line', from: O, to: lerp(O, S, kFloor), tone: 2, width: 2.8});
  items.push({type: 'label', at: [1.5, 2, 0], math: '5', dx: 2, dy: -13, tone: 2, opacity: kFloor >= 1 ? 1 : 0});
  if (kUp > 0.02) items.push({type: 'line', from: S, to: lerp(S, P, kUp), tone: 3, width: 2.6});
  items.push(
    {type: 'right', at: S, a: [-3, -4, 0], b: [0, 0, 1], size: 0.9, opacity: kUp >= 1 ? 1 : 0},
    {type: 'label', at: [3, 4, 6], math: '12', dx: 17, tone: 3, opacity: kUp >= 1 ? 1 : 0},
  );
  if (kHyp > 0.02) items.push({type: 'line', from: O, to: lerp(O, P, kHyp), tone: 1, width: 2.8});
  items.push(
    {type: 'label', at: [1.5, 2, 6], math: '13', dx: -17, dy: -2, tone: 1, opacity: kHyp >= 1 ? 1 : 0},
    {type: 'point', at: O, tone: 0, r: 3.5, math: 'O', dx: -13, dy: -10},
    {type: 'point', at: S, tone: 2, r: 4, math: 'S', dx: 14, dy: 12, opacity: kFloor},
  );
  if (stages === 2) items.push({type: 'point', at: P, tone: 1, r: 4, math: 'P', dx: 14, dy: -6, opacity: kUp});

  const floorDone = kFloor >= 1;
  const upDone = kHyp >= 1;

  return (
    <div className={shared.wrapper} data-explorer={stages === 1 ? 'floor-pythagoras' : 'floor-then-up'}>
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={stages === 1 ? 56 : 24}
          axes={{max: [4.4, 4.6, stages === 1 ? 1.6 : 12.6]}}
          frame={stages === 1 ? [S, X3] : [P, S, X3]}
          caption={
            caption ??
            (stages === 1
              ? 'No chão, os deslocamentos 3 e 4 formam um ângulo reto. A diagonal do chão, de O até a sombra S, é a hipotenusa desse triângulo laranja.'
              : 'Primeiro no chão: catetos 3 e 4, hipotenusa OS = 5. Depois em pé: do ponto S sobe a aresta vertical de 12, com ângulo reto em S, e o voo OP é a hipotenusa do triângulo azul.')
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p style={{opacity: floorDone ? 1 : 0.35}}>
          No chão: <Formula math="OS = \sqrt{3^2 + 4^2} = \sqrt{25} = 5" />
        </p>
        {stages === 2 && (
          <p style={{opacity: upDone ? 1 : 0.35}}>
            Em pé: <Formula math="OP = \sqrt{5^2 + 12^2} = \sqrt{169} = 13" />
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
