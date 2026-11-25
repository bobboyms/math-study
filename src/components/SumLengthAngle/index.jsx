import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath} from '../VectorSumKit';

// O módulo da soma não é a soma dos módulos (lição 7.29).
//
// A seta b (motor, 8 unidades) aponta para a direita. A seta c (correnteza,
// 6 unidades) sai da ponta de b, fazendo o ângulo escolhido com a direção de
// b. A seta verde é b + c. Embaixo, duas réguas: a cinza tem 8 + 6 = 14, e a
// verde tem o comprimento de b + c. Só em 0° a régua verde chega a 14; em 90°
// ela mede 10 (o barco da lição), e em 180° ela mede 8 − 6 = 2. Ao entrar na
// tela, o ângulo vai sozinho de 0° até 90°.

const B = 8;
const C = 6;
const DURATION = 3;

export default function SumLengthAngle({initial = 90, caption}) {
  const [deg, setDeg] = useState(initial);
  const {ref, play, playing} = useAnimation({
    duration: DURATION,
    onFrame: (time) => setDeg(Math.round((initial * stage(time, 0.3, DURATION)) / 5) * 5),
  });

  const a = (deg * Math.PI) / 180;
  const c = [C * Math.cos(a), C * Math.sin(a)];
  const s = [B + c[0], c[1]];
  const len = Math.hypot(...s);
  // “=” quando os números da conta são exatos com duas casas; “≈” quando não.
  const exactNum = (x) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;
  const rel = exactNum(s[0]) && exactNum(s[1]) && exactNum(len) ? '=' : '\\approx';

  const segments = [
    {from: [0, -2.1], to: [B + C, -2.1], muted: true},
    {from: [0, -1.5], to: [len, -1.5], tone: 3},
    {from: [0, 0], to: [B, 0], tone: 1, arrow: true},
    {from: [B, 0], to: [B + c[0], c[1]], tone: 2, arrow: true},
  ];
  if (len > 0.05) segments.push({from: [0, 0], to: s, tone: 3, arrow: true});

  const labels = [
    {at: [B / 2, 0], math: '\\vec{b}', tone: 1, dy: deg < 30 ? 14 : -14, dx: deg < 30 ? -30 : 0, fontSize: 13},
    {at: [B + c[0] / 2, c[1] / 2], math: '\\vec{c}', tone: 2, dx: deg > 150 ? 0 : 14, dy: deg > 150 ? -14 : 6, fontSize: 13},
    {at: [B + C, -2.1], math: '8 + 6 = 14', anchor: 'start', dx: 6, dy: 6, fontSize: 12},
    {at: [len, -1.5], math: `\\lVert \\vec{b} + \\vec{c} \\rVert`, tone: 3, anchor: 'start', dx: 6, dy: len > 12.5 ? -8 : 0, fontSize: 12},
  ];
  if (len > 0.05) {
    labels.push({at: [s[0] * 0.5, s[1] * 0.5], math: '\\vec{b} + \\vec{c}', tone: 3, dx: -30, dy: -14, fontSize: 13});
  }

  return (
    <div className={shared.wrapper} data-explorer="sum-length-angle">
      <div ref={ref}>
        <CartesianPlane
          xMin={-1}
          xMax={17}
          yMin={-2.7}
          yMax={7}
          xUnit={22}
          showNumbers={false}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'A seta b mede 8 e aponta para a direita. A seta c mede 6 e sai da ponta de b, girando conforme o ângulo. A seta verde é a soma. Embaixo, a régua cinza mede 8 + 6 = 14 e a régua verde mede o comprimento da soma.'
          }
        />
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Ângulo entre b e c: <strong>{deg}°</strong>
          </span>
          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={deg}
            disabled={playing}
            onChange={(e) => setDeg(Number(e.target.value))}
            aria-label="Ângulo entre as setas b e c, em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\vec{b} + \\vec{c} ${rel} ${pairMath(s[0], s[1], 2)}, \\qquad \\lVert \\vec{b} + \\vec{c} \\rVert ${rel} ${mathNumber(len, 2)}`}
          />
        </p>
        <p>
          {deg === 0 && 'As duas setas apontam para o mesmo lado: só aqui o comprimento da soma chega a 8 + 6 = 14.'}
          {deg === 90 && 'Ângulo reto: é o barco da lição. A soma mede 10, a hipotenusa do triângulo de catetos 8 e 6.'}
          {deg === 180 && 'Sentidos opostos: uma seta desfaz parte da outra, e a soma mede 8 − 6 = 2.'}
          {deg !== 0 && deg !== 90 && deg !== 180 && 'A soma é sempre menor que 14 quando as setas não apontam para o mesmo lado.'}
        </p>
      </div>
      <div className={shared.buttons}>
        {[0, 90, 180].map((d) => (
          <button key={d} type="button" disabled={playing} aria-pressed={deg === d} onClick={() => setDeg(d)}>
            {d}°
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
