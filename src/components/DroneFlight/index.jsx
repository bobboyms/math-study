import React from 'react';
import SpaceScene, {pointBox, lerp} from '../SpaceScene';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O drone do depósito (lição 7.34, Vetores no espaço).
//
// mode="intro": o problema motivador. O drone sai do canto O, no chão, e voa
// em linha reta até a caixa P(3, 4, 12). Antes do voo aparecem as três
// medidas (3, 4 e 12); no fim, o voo fica marcado com "? m".
//
// mode="solved": a resolução. Aparecem, em ordem, a sombra do voo no chão
// (5 m), a subida vertical (12 m), o voo (13 m) e o ângulo θ ≈ 67,4° entre o
// voo e a sombra, com o ângulo reto no pé da subida.

const P = [3, 4, 12];
const S0 = [3, 4, 0];
const O = [0, 0, 0];

export default function DroneFlight({mode = 'intro', caption}) {
  const solved = mode === 'solved';
  const {ref, t, play, playing} = useAnimation({duration: solved ? 4.2 : 4});
  const items = [];

  if (!solved) {
    const kBox = stage(t, 0, 0.9);
    const kFly = stage(t, 1.0, 3.4);
    const kEnd = stage(t, 3.4, 4);
    items.push(...pointBox(P, {opacity: kBox, floorDiagonal: false}));
    items.push(
      {type: 'label', at: [1.5, 0, 0], math: '3\\ \\text{m}', dx: -28, dy: -4, tone: 3, opacity: kBox},
      {type: 'label', at: [3, 2, 0], math: '4\\ \\text{m}', dy: 16, tone: 3, opacity: kBox},
      {type: 'label', at: [3, 4, 6], math: '12\\ \\text{m}', dx: 30, tone: 3, opacity: kBox},
    );
    const D = lerp(O, P, kFly);
    if (kFly > 0.02) items.push({type: 'line', from: O, to: D, tone: 1, width: 2.6});
    items.push(
      {type: 'point', at: O, tone: 0, math: 'O', dx: 14, dy: 10},
      {type: 'point', at: P, tone: 2, math: 'P(3,\\ 4,\\ 12)', dx: 56, dy: -4, opacity: kBox},
      {type: 'point', at: D, tone: 1, r: 6},
      // No alto do voo há mais espaço entre a linha e o eixo z: o rótulo fica
      // à esquerda da linha, sem cobri-la.
      {type: 'label', at: lerp(O, P, 0.75), math: '?\\ \\text{m}', dx: -10, dy: 0, anchor: 'end', tone: 1, opacity: kEnd},
    );
  } else {
    const k1 = stage(t, 0, 0.9);
    const k2 = stage(t, 0.9, 1.8);
    const k3 = stage(t, 1.8, 2.9);
    const k4 = stage(t, 2.9, 4.0);
    items.push(...pointBox(P, {opacity: 0.6, floorDiagonal: false}).filter((it) => it.from[2] === 0));
    if (k1 > 0.02) items.push({type: 'arrow', from: O, to: lerp(O, S0, k1), tone: 2});
    if (k2 > 0.02) items.push({type: 'line', from: S0, to: lerp(S0, P, k2), tone: 3, dashed: true});
    if (k3 > 0.02) items.push({type: 'arrow', from: O, to: lerp(O, P, k3), tone: 1});
    items.push(
      {type: 'right', at: S0, a: [-3, -4, 0], b: [0, 0, 1], size: 0.9, opacity: k2},
      {type: 'arc', at: O, a: S0, b: P, r: 2.4, labelR: 3.6, math: '\\theta', tone: 1, opacity: k4},
      {type: 'label', at: [1.5, 2, 0], math: '5', dx: 6, dy: 16, tone: 2, opacity: k1},
      {type: 'label', at: [3, 4, 6], math: '12', dx: 20, tone: 3, opacity: k2},
      {type: 'label', at: [1.5, 2, 6], math: '13', dx: -18, dy: -4, tone: 1, opacity: k3},
      {type: 'point', at: O, tone: 0, math: 'O', dx: 14, dy: 10},
      {type: 'point', at: S0, tone: 2, math: 'S', dx: 14, dy: 12, opacity: k1},
      {type: 'point', at: P, tone: 1, math: 'P', dx: 14, dy: -6, opacity: k3},
    );
  }

  return (
    <div className={shared.wrapper} data-explorer={solved ? 'drone-solved' : 'drone-intro'}>
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={24}
          axes={{max: [3.6, 4.6, 12.6]}}
          frame={[P, [3, 4, 0], [3.6, 0, 0]]}
          padding={36}
          caption={
            caption ??
            (solved
              ? 'A sombra do voo no chão mede 5 m (Pitágoras com 3 e 4). A subida vertical mede 12 m e faz ângulo reto com a sombra no ponto S. O voo é a hipotenusa: 13 m, com inclinação θ ≈ 67,4° em relação ao chão.'
              : 'O drone sai do canto O, no chão, e voa em linha reta até a caixa P. As linhas tracejadas mostram as três medidas: 3 m ao longo de x, 4 m ao longo de y e 12 m de altura. Quanto mede o voo?')
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
