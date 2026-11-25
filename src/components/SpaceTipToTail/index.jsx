import React, {useState} from 'react';
import SpaceScene, {add, times, lerp} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Somar vetores no espaço é encadear deslocamentos (lição 7.34).
//
// O drone faz o trecho u = (0, 2, 1) e, a partir da ponta dele, o trecho
// v = (3, 1, −1). A seta da soma liga a saída à chegada: (3, 3, 0). As linhas
// verticais tracejadas mostram a altura de cada ponta: sobe 1, depois desce 1,
// e termina no chão. O botão "2u" desenha o dobro de u sobre a mesma reta.

const U = [0, 2, 1];
const V = [3, 1, -1];
const SUM = add(U, V);
const DURATION = 3.8;

export default function SpaceTipToTail({caption}) {
  const [double, setDouble] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const ku = stage(t, 0, 1.2);
  const kv = stage(t, 1.3, 2.5);
  const ks = stage(t, 2.7, 3.6);

  const items = [
    {type: 'line', from: U, to: [U[0], U[1], 0], guide: true, opacity: ku >= 1 ? 1 : 0},
  ];
  if (double) {
    items.push(
      {type: 'arrow', from: [0, 0, 0], to: times(2, U), tone: 3, math: '2\\vec{u} = (0,\\ 4,\\ 2)', dx: 8, dy: -18},
      {type: 'line', from: times(2, U), to: [0, 4, 0], guide: true},
    );
  }
  if (ku > 0.02) items.push({type: 'arrow', from: [0, 0, 0], to: times(ku, U), tone: 1});
  if (kv > 0.02) items.push({type: 'arrow', from: U, to: add(U, times(kv, V)), tone: 2});
  if (ks > 0.02) items.push({type: 'arrow', from: [0, 0, 0], to: lerp([0, 0, 0], SUM, ks), tone: 0});
  items.push(
    {type: 'label', at: times(0.5, U), math: '\\vec{u}', dx: -4, dy: -14, tone: 1, opacity: ku >= 1 ? 1 : 0},
    {type: 'label', at: add(U, times(0.5, V)), math: '\\vec{v}', dx: 16, dy: 0, tone: 2, opacity: kv >= 1 ? 1 : 0},
    {type: 'label', at: times(0.5, SUM), math: '\\vec{u} + \\vec{v}', dx: -10, dy: 18, opacity: ks >= 1 ? 1 : 0},
    {type: 'label', at: U, math: '\\text{altura } 1', dx: 0, dy: -18, opacity: ku >= 1 ? 1 : 0},
    {type: 'point', at: [0, 0, 0], tone: 0, r: 3.5, math: 'O', dx: -13, dy: -9},
    {type: 'point', at: SUM, tone: 2, r: 4, math: '(3,\\ 3,\\ 0)', dx: 36, dy: 12, opacity: kv >= 1 ? 1 : 0},
  );

  return (
    <div className={shared.wrapper} data-explorer="space-tip-to-tail">
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={46}
          axes={{max: [3.6, 4.6, 2.6]}}
          frame={[SUM, U, times(2, U), [3, 0, 0]]}
          caption={
            caption ??
            'O trecho azul u sai da origem e sobe até a altura 1. O trecho laranja v sai da ponta de u e desce 1. A seta cinza, da saída até a chegada, é a soma: (3, 3, 0), de volta à altura do chão.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math="\vec{u} + \vec{v} = (0 + 3,\ 2 + 1,\ 1 + (-1)) = (3,\ 3,\ 0)" />
        </p>
        {double && (
          <p>
            <Formula math="2\vec{u} = (2 \times 0,\ 2 \times 2,\ 2 \times 1) = (0,\ 4,\ 2)" />: a mesma direção, o
            dobro do comprimento.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" aria-pressed={double} onClick={() => setDouble(!double)}>
          {double ? 'Esconder 2u' : 'Mostrar 2u'}
        </button>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
