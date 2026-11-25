import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import {add, at, dec, dot, norm, pairTex, rightAngleMark, signed, sub} from '../mathviz/lineParam';

// O ponto da rota mais perto de um ponto fixo (lição 7.33).
//
// Um drone anda pela rota A + t·d; a base S está fora dela. O controle escolhe
// o instante t. A figura liga o drone à base (tracejado verde) e mostra a
// direção de voo d no drone. O painel calcula (P(t) − S) · d: negativo, a
// base ainda está à frente e o drone se aproxima; zero, ângulo reto, o ponto
// mais perto; positivo, o drone já está se afastando. Ao aparecer, t vai de 0
// até o instante do ponto mais perto.

const txt = (v) => dec(v, 1).replace('{,}', ',').replace('-', '−');

export default function ClosestOnRoute({
  A = [1, 2],
  d = [2, 1],
  S = [4, 8],
  xMin = 0,
  xMax = 9,
  yMin = 0,
  yMax = 9,
  xUnit = 34,
  tMax = 3.4,
  step = 0.2,
  caption,
}) {
  // Instante do ponto mais perto: (A + t·d − S) · d = 0.
  const tBest = Number((dot(sub(S, A), d) / dot(d, d)).toFixed(6));
  const [t, setT] = useState(tBest);
  const anim = useAnimation({duration: 3.5});
  const {ref, playing} = anim;
  const shownT = playing ? tBest * ease(Math.min(1, Math.max(0, anim.t - 0.4) / 3)) : t;

  const P = at(A, d, shownT);
  const toBase = sub(P, S);
  const value = dot(toBase, d);
  const dist = norm(toBase);
  const atBest = Math.abs(value) < 1e-9;

  const polygons = atBest ? [rightAngleMark(P, d, sub(S, P), 0.35)] : [];
  const segments = [
    {from: P, to: S, tone: 3, dashed: true, label: dec(dist, 2), dx: 22, dy: 0},
    {from: P, to: add(P, d), tone: 1, arrow: true, label: '\\vec{d}', dx: 6, dy: 16},
  ];

  return (
    <div className={shared.wrapper} data-explorer="closest-on-route">
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={xUnit}
          axisLabels={['x', 'y']}
          lines={[{through: [A, at(A, d, 1)], tone: 1, dashed: true}]}
          polygons={polygons}
          segments={segments}
          points={[
            {at: A, tone: 1, r: 4, label: 'A', dx: -12, dy: 14},
            {at: S, tone: 3, r: 5.5, label: 'S', dx: 0, dy: -16},
            {at: P, tone: 2, r: 6, label: 'P(t)', dx: 4, dy: 22},
          ]}
          caption={caption}
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {playing ? (
          <p>O drone anda pela rota. O tracejado verde liga o drone à base.</p>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula
                math={`P(${dec(t, 1)}) = ${pairTex(P[0], P[1])},\\quad P(t) - S = ${pairTex(toBase[0], toBase[1])}`}
              />
            </p>
            <p className={shared.formula}>
              <Formula
                math={`\\big(P(t) - S\\big) \\cdot \\vec{d} = ${signed(toBase[0])} \\times ${signed(d[0], 0)} + ${signed(toBase[1])} \\times ${signed(d[1], 0)} = ${dec(value, 1)}`}
              />
            </p>
            <p>
              Distância até a base: <Formula math={`\\approx ${dec(dist, 2)}`} />.{' '}
              {atBest ? (
                <strong>Produto escalar zero: o tracejado forma ângulo reto com a rota. Este é o ponto mais perto.</strong>
              ) : value < 0 ? (
                'Produto escalar negativo: a base ainda está à frente do drone, e a distância continua diminuindo.'
              ) : (
                'Produto escalar positivo: a base já ficou para trás, e a distância está aumentando.'
              )}
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Instante: t = {txt(t)} s</span>
          <input
            type="range"
            min={0}
            max={tMax}
            step={step}
            value={t}
            disabled={playing}
            onChange={(e) => setT(Number(Number(e.target.value).toFixed(6)))}
            aria-label="Instante t, em segundos"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          onClick={() => {
            setT(tBest);
            anim.play();
          }}
          disabled={playing}
        >
          Ver o voo de novo
        </button>
      </div>
    </div>
  );
}
