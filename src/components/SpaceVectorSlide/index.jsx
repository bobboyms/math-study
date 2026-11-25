import React, {useState} from 'react';
import SpaceScene, {sub, times, add, pointBox} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Um vetor do espaço é um deslocamento, e vale em qualquer lugar (lição 7.34).
//
// A seta azul vai de A(1, 3, 0) até B(3, 6, 6). Uma cópia dela desliza, sem
// girar nem mudar de tamanho, até sair da origem: a ponta cai em (2, 3, 6),
// que é B − A. O botão de comparação desenha (2, 3, −6), de mesmo módulo 7,
// que desce em vez de subir: é outro vetor.

const A = [1, 3, 0];
const B = [3, 6, 6];
const V = sub(B, A);
const W = [2, 3, -6];
const DURATION = 3.4;

export default function SpaceVectorSlide({caption}) {
  const [compare, setCompare] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const k1 = stage(t, 0, 1.0);
  const k2 = stage(t, 1.2, 3.0);
  const k3 = stage(t, 3.0, DURATION);

  const tail = times(1 - k2, A);
  const items = [];
  items.push(...pointBox(V, {opacity: k3}).map((it) => ({...it})));
  if (compare) items.push(...pointBox(W).map((it) => ({...it})));
  items.push({type: 'arrow', from: A, to: add(A, times(k1, V)), tone: 1, opacity: k1 > 0.02 ? 1 : 0});
  if (t >= 1.2) items.push({type: 'arrow', from: tail, to: add(tail, V), tone: 2});
  if (compare) items.push({type: 'arrow', from: [0, 0, 0], to: W, tone: 3, math: '(2,\\ 3,\\ -6)', dx: 48, dy: 8});
  items.push(
    {type: 'point', at: A, tone: 1, r: 4, math: 'A(1,\\ 3,\\ 0)', dx: 44, dy: 14},
    {type: 'point', at: B, tone: 1, r: 4, math: 'B(3,\\ 6,\\ 6)', dx: 46, dy: -6},
    {type: 'label', at: V, math: '(2,\\ 3,\\ 6)', dx: -40, dy: -10, tone: 2, opacity: k3},
    {type: 'label', at: add(A, times(0.55, V)), math: '\\overrightarrow{AB}', dx: 22, dy: 6, tone: 1, opacity: k1 >= 1 ? 1 : 0},
  );

  return (
    <div className={shared.wrapper} data-explorer="space-vector-slide">
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={24}
          axes={{max: [3.6, 6.8, 6.6], min: [0, 0, compare ? -6.6 : 0]}}
          frame={compare ? [B, W, A, [3, 0, 0]] : [B, A, [3, 0, 0]]}
          caption={
            caption ??
            'A seta azul vai de A até B. A cópia laranja desliza, sem girar e sem mudar de tamanho, até sair da origem. A ponta dela cai em (2, 3, 6) = B − A: o mesmo deslocamento, desenhado em outro lugar.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math="\overrightarrow{AB} = B - A = (3 - 1,\ 6 - 3,\ 6 - 0) = (2,\ 3,\ 6)" />
        </p>
        {compare && (
          <p>
            <Formula math="\lVert (2,\ 3,\ 6) \rVert = \lVert (2,\ 3,\ -6) \rVert = \sqrt{49} = 7" />, mas um sobe 6 e o
            outro desce 6: são vetores diferentes.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" aria-pressed={compare} onClick={() => setCompare(!compare)}>
          {compare ? 'Esconder (2, 3, −6)' : 'Comparar com (2, 3, −6)'}
        </button>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
