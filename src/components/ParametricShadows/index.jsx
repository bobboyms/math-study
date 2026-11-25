import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import {at, dec, pairTex, signed} from '../mathviz/lineParam';

// As paramétricas: uma conta para cada coordenada (lição 7.33).
//
// O ponto P anda pela reta A + t·d. Duas sombras acompanham: uma no eixo x
// (azul), com a coordenada x de P, e outra no eixo y (verde), com a
// coordenada y. Ao aparecer, t vai de 0 a `tEnd`, e cada sombra deixa uma
// marca (ponto pequeno) a cada passo inteiro: as marcas do eixo x ficam
// espaçadas de a, as do eixo y de b. Depois, o deslizante controla t.

const txt = (v) => dec(v, 1).replace('{,}', ',').replace('-', '−');

export default function ParametricShadows({
  A = [1, 2],
  d = [2, 1],
  xMin = -1,
  xMax = 10,
  yMin = -1,
  yMax = 7,
  xUnit = 34,
  tMin = -1,
  tMax = 4,
  tEnd = 3,
  caption,
}) {
  const [t, setT] = useState(tEnd);
  const anim = useAnimation({duration: 4});
  const {ref, playing} = anim;
  const shownT = playing ? Math.min(tEnd, (Math.max(0, anim.t - 0.5) / 3.5) * tEnd) : t;
  const P = at(A, d, shownT);

  // Marcas nos eixos: os passos inteiros já dados (durante a animação) ou de
  // 0 até t (depois dela).
  const last = playing ? Math.floor(shownT + 1e-9) : Math.floor(Math.max(0, t) + 1e-9);
  const marks = Array.from({length: last + 1}, (_, k) => k);

  const points = [];
  marks.forEach((k) => {
    const Q = at(A, d, k);
    points.push({at: [Q[0], 0], tone: 1, r: 3});
    points.push({at: [0, Q[1]], tone: 3, r: 3});
  });
  points.push({at: [P[0], 0], tone: 1, r: 5.5});
  points.push({at: [0, P[1]], tone: 3, r: 5.5});
  points.push({at: P, tone: 2, r: 6, label: 'P', dx: 12, dy: -12});

  const segments = [
    {from: P, to: [P[0], 0], tone: 1, dashed: true},
    {from: P, to: [0, P[1]], tone: 3, dashed: true},
  ];

  // Coeficiente de t escrito como na lição: 2t, t, −t.
  const coef = (k) => (k === 1 ? '' : k === -1 ? '-' : dec(k, 1));
  const x = A[0] + d[0] * t;
  const y = A[1] + d[1] * t;

  return (
    <div className={shared.wrapper} data-explorer="parametric-shadows">
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={xUnit}
          axisLabels={['x', 'y']}
          lines={[{through: [A, at(A, d, 1)], muted: true, dashed: true}]}
          segments={segments}
          points={points}
          caption={caption}
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {playing ? (
          <p>A sombra azul anda no eixo x, a verde anda no eixo y. Cada passo inteiro deixa uma marca em cada eixo.</p>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula math={`x = ${dec(A[0], 1)} + ${coef(d[0])}t = ${dec(A[0], 1)} + ${dec(d[0], 1)} \\times ${signed(t)} = ${dec(x, 1)}`} />
            </p>
            <p className={shared.formula}>
              <Formula math={`y = ${dec(A[1], 1)} + ${coef(d[1])}t = ${dec(A[1], 1)} + ${dec(d[1], 1)} \\times ${signed(t)} = ${dec(y, 1)}`} />
            </p>
            <p>
              Juntando as duas contas, <Formula math={`P = ${pairTex(x, y)}`} />. A cada passo, a sombra azul anda{' '}
              {Math.abs(d[0])} e a verde anda {Math.abs(d[1])}: cada coordenada tem o seu próprio passo.
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Número de passos: t = {txt(t)}</span>
          <input
            type="range"
            min={tMin}
            max={tMax}
            step={0.5}
            value={t}
            disabled={playing}
            onChange={(e) => setT(Number(e.target.value))}
            aria-label="Número de passos t"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          onClick={() => {
            setT(tEnd);
            anim.play();
          }}
          disabled={playing}
        >
          Ver as sombras de novo
        </button>
      </div>
    </div>
  );
}
