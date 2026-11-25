import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {clipLine, kOf, lerp, norm, rightAngle, sub, times, pairText} from '../mathviz/projection';

// O gesto da projeção, animado (lição 7.32).
//
// u (azul) marca o chão: a reta cinza tracejada que passa pela origem na
// direção de u. v (laranja) é a vara, presa na origem. A animação faz os três
// passos do texto: (1) da ponta de v desce uma linha em ângulo reto até a reta
// de u; (2) a sombra (verde) cresce da origem até o pé dessa linha; (3) a
// marca de ângulo reto aparece, e a linha que desceu vira o resto.
//
// Os botões trocam a vara v. Com ângulo obtuso, como (−3, 1), o pé cai atrás
// da origem, no prolongamento da reta, e a sombra aponta contra u.

const DURATION = 4.4;
const BOX = [-3.8, 5.2, -1.6, 5];
const PRESETS = [
  [1, 4],
  [3, 3],
  [-3, 1],
];

// Direção no plano → deslocamento em pixels do rótulo (o y da tela desce).
const off = (d, L) => {
  const n = norm(d) || 1;
  return {dx: (d[0] / n) * L, dy: (-d[1] / n) * L};
};

export default function ProjectionDrop({u = [4, 2], initial = [1, 4], caption}) {
  const [v, setV] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const k = kOf(v, u);
  const H = times(k, u);
  const nrm = [-u[1], u[0]]; // perpendicular a u, para o lado de v quando v · nrm > 0
  const side = v[0] * nrm[0] + v[1] * nrm[1] >= 0 ? 1 : -1;
  const up = times(side, nrm); // lado onde está a ponta de v
  const down = times(-1, up);

  const a = stage(t, 0.6, 2.0); // a linha desce
  const b = stage(t, 2.2, 3.4); // a sombra cresce
  const c = stage(t, 3.5, 4.0); // ângulo reto e rótulos

  const line = clipLine([0, 0], u, BOX);
  const segments = [];
  if (line) segments.push({from: line[0], to: line[1], muted: true, dashed: true});
  segments.push({from: [0, 0], to: u, tone: 1, arrow: true});
  segments.push({from: [0, 0], to: v, tone: 2, arrow: true});
  if (a > 0.01) {
    segments.push({from: v, to: lerp(v, H, a), tone: c > 0.5 ? 2 : 0, dashed: true});
  }
  if (b > 0.01 && norm(H) > 0.05) {
    segments.push({from: [0, 0], to: lerp([0, 0], H, b), tone: 3, arrow: true});
  }
  if (c > 0.5) {
    const toward = sub(v, H);
    segments.push(...rightAngle(H, times(k >= 0 ? -1 : 1, u), toward, 0.28));
  }

  const along = times(k >= 0 ? 1 : -1, u);
  const labels = [
    {at: u, math: '\\vec{u}', tone: 1, ...off([u[0] + down[0] * 0.4, u[1] + down[1] * 0.4], 18)},
    {at: v, math: '\\vec{v}', tone: 2, ...off(v, 16)},
  ];
  if (c > 0.5) {
    // O rótulo da sombra fica do lado da vara quando há espaço entre as duas
    // setas; com a vara quase deitada (menos de 35°) ou caindo para trás, ele
    // vai para o lado de fora, longe da vara.
    const cosAng = (v[0] * u[0] + v[1] * u[1]) / (norm(v) * norm(u));
    const outside = k < 0 || cosAng > Math.cos((35 * Math.PI) / 180);
    const mid = times(k < 0 ? 0.7 : outside ? 0.75 : 0.6, H);
    labels.push({at: mid, math: '\\text{sombra}', tone: 3, ...off(outside ? down : up, 28)});
    labels.push({at: lerp(v, H, 0.5), math: '\\text{resto}', tone: 2, ...off(along, 34)});
  }

  return (
    <div className={shared.wrapper} data-explorer="projection-drop">
      <div ref={ref}>
        <CartesianPlane
          xMin={BOX[0]}
          xMax={BOX[1]}
          yMin={BOX[2]}
          yMax={BOX[3]}
          xUnit={46}
          axisLabels={['x', 'y']}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'A reta cinza tracejada é o chão, na direção de u (azul). Da ponta da vara v (laranja) desce uma linha em ângulo reto até o chão. A sombra (verde) vai da origem até o pé dessa linha, e a linha que desceu é o resto.'
          }
        />
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a sombra cair de novo
        </button>
      </div>
      <div className={shared.buttons}>
        {PRESETS.map((p) => (
          <button
            key={pairText(p)}
            type="button"
            aria-pressed={p[0] === v[0] && p[1] === v[1]}
            disabled={playing}
            onClick={() => {
              setV(p);
              play();
            }}
          >
            v = {pairText(p)}
          </button>
        ))}
      </div>
    </div>
  );
}
