import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath, plainNumber} from '../VectorSumKit';

// A distributiva k(u + v) = ku + kv (lição 7.29) como triângulo ampliado.
//
// O triângulo tracejado tem os lados u, v (ponta com cauda) e u + v. O
// triângulo cheio é o mesmo desenho com os três lados multiplicados por k:
// ku, depois kv a partir da ponta de ku, e a soma k(u + v). Mudando o k, o
// triângulo cresce ou encolhe sem mudar de forma (é semelhante ao primeiro),
// e a ponta de ku + kv cai sempre na ponta de k(u + v). Ao entrar na tela, o
// k vai sozinho de 1 até 2.

const DURATION = 2.4;

export default function ScaledSumTriangle({u = [2, 1], v = [1, 2], initial = 2, caption}) {
  const [k, setK] = useState(initial);
  const {ref, play, playing} = useAnimation({
    duration: DURATION,
    onFrame: (time) => setK(Math.round((1 + (initial - 1) * stage(time, 0.3, DURATION)) * 100) / 100),
  });

  const s = [u[0] + v[0], u[1] + v[1]];
  const ku = [k * u[0], k * u[1]];
  const kv = [k * v[0], k * v[1]];
  const ks = [k * s[0], k * s[1]];

  // as setas ampliadas primeiro, o triângulo original tracejado por cima
  const segments = [
    {from: [0, 0], to: ku, tone: 1, arrow: true},
    {from: ku, to: ks, tone: 2, arrow: true},
    {from: [0, 0], to: ks, tone: 3, arrow: true},
    {from: [0, 0], to: u, tone: 1, dashed: true},
    {from: u, to: s, tone: 2, dashed: true},
    {from: [0, 0], to: s, tone: 3, dashed: true},
  ];
  const kTxt = mathNumber(k, 2);
  const labels = [
    {at: [ku[0] / 2, ku[1] / 2], math: `${kTxt}\\vec{u}`, tone: 1, dx: 10, dy: 16, fontSize: 13},
    {at: [ku[0] + kv[0] / 2, ku[1] + kv[1] / 2], math: `${kTxt}\\vec{v}`, tone: 2, dx: 24, dy: 0, fontSize: 13},
    {at: [ks[0] * 0.5, ks[1] * 0.5], math: `${kTxt}(\\vec{u} + \\vec{v})`, tone: 3, dx: -48, dy: -8, fontSize: 13},
  ];

  return (
    <div className={shared.wrapper} data-explorer="scaled-sum-triangle">
      <div ref={ref}>
        <CartesianPlane
          xMin={-1}
          xMax={8}
          yMin={-1}
          yMax={8}
          xUnit={38}
          axisLabels={['x', 'y']}
          polygons={[{points: [[0, 0], u, s], tone: 3}]}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'O triângulo sombreado, de lados tracejados, tem os lados u, v e u + v. O triângulo de setas tem os três lados multiplicados por k. Ele cresce ou encolhe sem mudar de forma, e a ponta de ku + kv cai sempre na ponta de k(u + v).'
          }
        />
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Número k: <strong>{plainNumber(k)}</strong>
          </span>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.25}
            value={k}
            disabled={playing}
            onChange={(e) => setK(Number(e.target.value))}
            aria-label="Número k que multiplica os três lados do triângulo"
            aria-valuetext={plainNumber(k)}
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`${kTxt}(\\vec{u} + \\vec{v}) = ${kTxt} \\times ${pairMath(...s)} = ${pairMath(...ks)}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`${kTxt}\\vec{u} + ${kTxt}\\vec{v} = ${pairMath(...ku)} + ${pairMath(...kv)} = ${pairMath(...ks)}`} />
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a ampliação de novo
        </button>
      </div>
    </div>
  );
}
