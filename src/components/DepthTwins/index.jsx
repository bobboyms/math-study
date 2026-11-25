import React, {useState} from 'react';
import SpaceScene, {pointBox, project, num} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';

// O desenho em perspectiva engana na profundidade (lição 7.34).
//
// Os pontos P(0, 2, 3) e Q(4, 4, 4) são diferentes no espaço, mas na vista de frente caem exatamente no mesmo lugar do
// papel: Q está mais à frente (x = 4) e mais alto, e o encurtamento do eixo x
// compensa as duas coisas. Os botões mostram a caixa de cada ponto, que
// desfaz a dúvida sem girar nada. O deslizante gira a cena em torno do eixo z,
// como uma mesa giratória: fora da vista de frente, os dois pontos se separam.

const P = [0, 2, 3];
const Q = [4, 4, 4];
const VIEWS = [-40, -20, 0, 20, 40];

export default function DepthTwins({caption}) {
  const [view, setView] = useState(0);
  const [boxP, setBoxP] = useState(false);
  const [boxQ, setBoxQ] = useState(false);

  const pp = project(P, view);
  const pq = project(Q, view);
  const gap = Math.hypot(pp[0] - pq[0], pp[1] - pq[1]);
  const same = gap < 0.05;

  const items = [];
  if (boxP) items.push(...pointBox(P).map((it) => ({...it, tone: 1})));
  if (boxQ) items.push(...pointBox(Q).map((it) => ({...it, tone: 2})));
  if (boxP) items.push({type: 'label', at: [0, 2, 1.5], math: '3', dx: -12, tone: 1});
  if (boxQ)
    items.push(
      {type: 'label', at: [2, 0, 0], math: '4', dx: -12, dy: 14, tone: 2},
      {type: 'label', at: [4, 2, 0], math: '4', dy: 15, tone: 2},
      {type: 'label', at: [4, 4, 2], math: '4', dx: 14, tone: 2},
    );
  items.push(
    {type: 'point', at: Q, tone: 2, r: 9, math: 'Q', dx: 20, dy: -14},
    {type: 'point', at: P, tone: 1, r: 4.5, math: 'P', dx: -20, dy: -14},
  );

  return (
    <div className={shared.wrapper} data-explorer="depth-twins">
      <SpaceScene
        items={items}
        view={view}
        unit={38}
        axes={{max: [4.6, 4.8, 4.6]}}
        frame={[P, Q, [4, 4, 0], [4, 0, 0], [0, 4, 0]]}
        frameViews={VIEWS}
        caption={
          caption ??
          'O ponto azul P e o anel laranja Q. Na vista de frente (giro 0°), os dois caem no mesmo lugar do papel. Mostre a caixa de cada um, ou gire a vista, para ver que são pontos diferentes.'
        }
      />
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Girar a vista em torno do eixo z: <strong>{num(view, 0)}°</strong>
          </span>
          <input type="range" min={-40} max={40} step={1} value={view} onChange={(e) => setView(Number(e.target.value))} />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          No espaço, <Formula math="P = (0,\ 2,\ 3)" /> e <Formula math="Q = (4,\ 4,\ 4)" /> são pontos
          diferentes: Q está 4 a mais na direção x, 2 a mais na direção y e 1 mais alto.
        </p>
        <p>
          {same
            ? 'No papel, nesta vista, os dois caem exatamente no mesmo lugar.'
            : 'Nesta vista, os dois se separam no papel.'}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" aria-pressed={boxP} onClick={() => setBoxP(!boxP)}>
          {boxP ? 'Esconder a caixa de P' : 'Mostrar a caixa de P'}
        </button>
        <button type="button" aria-pressed={boxQ} onClick={() => setBoxQ(!boxQ)}>
          {boxQ ? 'Esconder a caixa de Q' : 'Mostrar a caixa de Q'}
        </button>
        <button type="button" onClick={() => setView(0)}>
          Vista de frente
        </button>
      </div>
    </div>
  );
}
