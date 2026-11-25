import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import {at, dec, norm, pairTex, sub, windowRange} from '../mathviz/lineParam';

// Os dois drones do galpão (lição 7.33, Retas com vetores).
//
// mode="routes": o problema motivador. Cada drone aparece no ponto de partida
//   com a seta do deslocamento de um segundo, e a rota tracejada cresce a
//   partir dele até a borda.
// mode="places": as rotas se cruzam? Um controle para o instante de cada
//   drone (t para A, s para B). Quando os dois param no mesmo ponto, o painel
//   avisa: é o cruzamento, com os dois instantes.
// mode="meeting": os drones batem? Um controle só, o mesmo instante t para os
//   dois. O segmento entre eles mostra a distância, e o painel mostra a
//   diferença em cada coordenada.

const txt = (v) => dec(v, 1).replace('{,}', ',').replace('-', '−');
const same = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9;

export default function DroneRoutes({
  mode = 'routes',
  A = [1, 2],
  u = [2, 1],
  B = [9, 1],
  v = [-1, 2],
  xMin = 0,
  xMax = 11,
  yMin = 0,
  yMax = 10,
  xUnit = 32,
  marks = [0, 1, 2, 3, 4],
  caption,
}) {
  const [tA, setTA] = useState(1);
  const [sB, setSB] = useState(1);
  const [t, setT] = useState(mode === 'meeting' ? 2.5 : 1);
  const anim = useAnimation({duration: 3.5, autoplay: mode === 'routes'});
  const {ref, playing} = anim;
  const box = [xMin, xMax, yMin, yMax];
  const endA = windowRange(A, u, box)[1];
  const endB = windowRange(B, v, box)[1];

  const lines = [];
  const segments = [];
  const points = [];
  const labels = [];

  if (mode === 'routes') {
    const k = playing ? ease(Math.min(1, Math.max(0, anim.t - 0.4) / 3)) : 1;
    segments.push({from: A, to: at(A, u, endA * k), tone: 1, dashed: true});
    segments.push({from: B, to: at(B, v, endB * k), tone: 2, dashed: true});
    segments.push({from: A, to: at(A, u, 1), tone: 1, arrow: true, label: pairTex(u[0], u[1]), dx: -12, dy: -22});
    segments.push({from: B, to: at(B, v, 1), tone: 2, arrow: true, label: pairTex(v[0], v[1]), dx: -34, dy: 0});
    points.push({at: A, tone: 1, r: 5.5, label: 'A', dx: -12, dy: 14});
    points.push({at: B, tone: 2, r: 5.5, label: 'B', dx: 14, dy: 12});
  } else {
    lines.push({through: [A, at(A, u, 1)], tone: 1, dashed: true});
    lines.push({through: [B, at(B, v, 1)], tone: 2, dashed: true});
    // O cruzamento das rotas: A + t·u = B + s·v, resolvido pela regra de Cramer.
    const det = u[0] * -v[1] - -v[0] * u[1];
    if (Math.abs(det) > 1e-12) {
      const r = sub(B, A);
      const tc = (r[0] * -v[1] - -v[0] * r[1]) / det;
      points.push({at: at(A, u, tc), tone: 3, r: 8, open: true});
    }
    marks.forEach((m) => {
      points.push({at: at(A, u, m), tone: 1, r: 3, label: `${m}`, dx: 0, dy: 18, fontSize: 12});
      points.push({at: at(B, v, m), tone: 2, r: 3, label: `${m}`, dx: 14, dy: 4, fontSize: 12});
    });
  }

  let P;
  let Q;
  if (mode === 'places') {
    P = at(A, u, tA);
    Q = at(B, v, sB);
    if (tA > 0) segments.push({from: A, to: P, tone: 1});
    if (sB > 0) segments.push({from: B, to: Q, tone: 2});
  } else if (mode === 'meeting') {
    P = at(A, u, t);
    Q = at(B, v, t);
    if (!same(P, Q)) segments.push({from: P, to: Q, muted: true, dashed: true});
  }
  if (P) {
    points.push({at: P, tone: 1, r: 7, label: '\\text{A}', dx: -16, dy: -10});
    points.push({at: Q, tone: 2, r: 7, label: '\\text{B}', dx: 16, dy: -10});
  }

  const meet = P && same(P, Q);
  const diff = P ? sub(Q, P) : null;

  return (
    <div className={shared.wrapper} data-explorer="drone-routes">
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={xUnit}
          axisLabels={['x', 'y']}
          lines={lines}
          segments={segments}
          points={points}
          labels={labels}
          caption={caption}
        />
      </div>
      {mode === 'routes' && (
        <div className={shared.buttons}>
          <button type="button" onClick={() => anim.play()} disabled={playing}>
            Ver as rotas de novo
          </button>
        </div>
      )}
      {mode === 'places' && (
        <>
          <div className={shared.readout} aria-live="polite" aria-atomic="true">
            <p className={shared.formula}>
              Drone A no instante <Formula math={`t = ${dec(tA, 1)}`} />: <Formula math={pairTex(P[0], P[1])} />
            </p>
            <p className={shared.formula}>
              Drone B no instante <Formula math={`s = ${dec(sB, 1)}`} />: <Formula math={pairTex(Q[0], Q[1])} />
            </p>
            <p>
              {meet ? (
                <strong>
                  Mesmo lugar: o ponto {`(${txt(P[0])}, ${txt(P[1])})`} está nas duas rotas. A passa por ele no instante{' '}
                  {txt(tA)}, e B no instante {txt(sB)}.
                </strong>
              ) : (
                'Lugares diferentes. Mexa nos dois controles, um de cada vez, até os dois drones pararem no mesmo ponto.'
              )}
            </p>
          </div>
          <div className={shared.controls}>
            <label className={shared.control}>
              <span>Instante do drone A: t = {txt(tA)} s</span>
              <input
                type="range"
                min={0}
                max={4}
                step={0.5}
                value={tA}
                onChange={(e) => setTA(Number(e.target.value))}
                aria-label="Instante t do drone A"
              />
            </label>
            <label className={shared.control}>
              <span>Instante do drone B: s = {txt(sB)} s</span>
              <input
                type="range"
                min={0}
                max={4}
                step={0.5}
                value={sB}
                onChange={(e) => setSB(Number(e.target.value))}
                aria-label="Instante s do drone B"
              />
            </label>
          </div>
        </>
      )}
      {mode === 'meeting' && (
        <>
          <div className={shared.readout} aria-live="polite" aria-atomic="true">
            <p className={shared.formula}>
              No instante <Formula math={`t = ${dec(t, 1)}`} />, o drone A está em <Formula math={pairTex(P[0], P[1])} />, e
              o drone B, em <Formula math={pairTex(Q[0], Q[1])} />.
            </p>
            <p>
              Diferença em x: <Formula math={dec(diff[0], 1)} />. Diferença em y: <Formula math={dec(diff[1], 1)} />.
              Distância entre os drones: <Formula math={`\\approx ${dec(norm(diff), 2)}`} /> m.
            </p>
            <p>
              {diff[0] === 0 || Math.abs(diff[0]) < 1e-9
                ? 'A diferença em x zerou, mas a diferença em y não: os drones estão na mesma vertical, em alturas diferentes.'
                : Math.abs(diff[1]) < 1e-9
                  ? 'A diferença em y zerou, mas a diferença em x não: os drones estão na mesma horizontal, afastados.'
                  : 'Para uma batida, as duas diferenças teriam que zerar no mesmo instante.'}
            </p>
          </div>
          <div className={shared.controls}>
            <label className={shared.control}>
              <span>Instante, o mesmo para os dois drones: t = {txt(t)} s</span>
              <input
                type="range"
                min={0}
                max={4}
                step={0.1}
                value={t}
                onChange={(e) => setT(Number(Number(e.target.value).toFixed(6)))}
                aria-label="Instante t, o mesmo para os dois drones"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
