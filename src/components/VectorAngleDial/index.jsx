import React, {useRef, useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import {wedge, polar, dec, decText, edgePoint} from '../mathviz/vectorArc';

// O ângulo de um vetor (lição 7.30): o giro que leva o semieixo x positivo
// até a seta, no sentido anti-horário.
//
// Uma seta de tamanho 4 sai da origem. A cunha azul marca o giro desde o
// semieixo x positivo. A reta cinza tracejada é a direção da seta (a reta
// inteira), e o ângulo escolhe um dos dois lados dela: o sentido. Com
// `reference`, a cunha laranja mostra o ângulo de referência (até a parte do
// eixo x mais próxima), que é o que o aluno confunde com o ângulo do vetor.
//
// Ao aparecer, a seta gira de 0° até `initial`. Cada botão faz a seta girar
// do ângulo atual até o novo; o deslizante muda o ângulo direto.

const R = 4;
const DURATION = 2.4;

const quadrantText = (deg) => {
  const d = ((deg % 360) + 360) % 360;
  if (d === 0) return 'sobre o semieixo x positivo (leste)';
  if (d === 90) return 'sobre o semieixo y positivo (norte)';
  if (d === 180) return 'sobre o semieixo x negativo (oeste)';
  if (d === 270) return 'sobre o semieixo y negativo (sul)';
  if (d < 90) return 'no primeiro quadrante';
  if (d < 180) return 'no segundo quadrante';
  if (d < 270) return 'no terceiro quadrante';
  return 'no quarto quadrante';
};

// Ângulo de referência: distância até a parte do eixo x mais próxima.
const referenceOf = (deg) => {
  const d = ((deg % 360) + 360) % 360;
  if (d <= 90) return {ref: d, from: 0};
  if (d <= 180) return {ref: 180 - d, from: 180};
  if (d <= 270) return {ref: d - 180, from: 180};
  return {ref: 360 - d, from: 360};
};

const PRESETS = [
  {deg: 30, label: '30°'},
  {deg: 210, label: '210°'},
  {deg: 90, label: '90°'},
  {deg: 216.87, label: 'a seta de (−4, −3)'},
];

export default function VectorAngleDial({initial = 30, reference = false, presets = PRESETS, caption}) {
  const [target, setTarget] = useState(initial);
  const from = useRef(0);
  const {ref, t, total, play, playing} = useAnimation({duration: DURATION});
  const k = playing ? ease(t / total) : 1;
  const theta = playing ? from.current + (target - from.current) * k : target;

  const goTo = (deg) => {
    from.current = theta;
    setTarget(deg);
    play();
  };

  const tip = polar(R, theta);
  const segments = [];
  const labels = [];
  const polygons = [];

  // Direção: a reta inteira que contém a seta.
  const dir = polar(1, theta);
  const far = edgePoint(dir[0], dir[1], 5);
  segments.push({from: [-far[0], -far[1]], to: far, muted: true, dashed: true});
  if (theta > 0.5) polygons.push(wedge(1.2, 0, theta, 1));
  segments.push({from: [0, 0], to: tip, tone: 1, arrow: true});

  const mid = polar(1.2, theta / 2);
  if (theta > 4) {
    labels.push({at: mid, math: `${dec(theta, 1)}^\\circ`, dx: mid[0] >= 0 ? 30 : -30, dy: mid[1] >= 0 ? -10 : 12, tone: 1});
  }

  const r = referenceOf(theta);
  if (reference && !playing && r.ref > 1 && r.from !== 0) {
    const a0 = r.from;
    const a1 = r.from === 360 ? 360 - r.ref : theta;
    polygons.push(wedge(2.4, a0, a1, 2));
    const m = polar(2.4, (a0 + a1) / 2);
    labels.push({at: m, math: `${dec(r.ref, 1)}^\\circ`, dx: m[0] >= 0 ? 30 : -30, dy: m[1] >= 0 ? -6 : 8, tone: 2});
  }

  return (
    <div className={shared.wrapper} data-explorer="vector-angle-dial">
      <div ref={ref}>
        <CartesianPlane
          xMin={-5}
          xMax={5}
          yMin={-5}
          yMax={5}
          xUnit={32}
          showNumbers={false}
          axisLabels={['x', 'y']}
          segments={segments}
          labels={labels}
          polygons={polygons}
          caption={
            caption ??
            'A seta azul sai da origem. A cunha azul é o giro que leva o semieixo x positivo até ela, no sentido anti-horário. A reta cinza tracejada é a direção da seta; o ângulo diz também para qual lado dessa reta ela aponta.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Ângulo do vetor: <Formula math={`\\theta = ${dec(theta, 1)}^\\circ`} />, {quadrantText(Math.round(theta * 10) / 10)}.
          {reference && r.from !== 0 && r.ref > 1 && !playing && (
            <>
              {' '}A cunha laranja, de <Formula math={`${dec(r.ref, 1)}^\\circ`} />, é o ângulo de referência: ele é medido
              até a parte do eixo x mais próxima, e <strong>não</strong> é o ângulo do vetor.
            </>
          )}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo: {decText(theta, 0)}°</span>
          <input
            type="range"
            min={0}
            max={359}
            step={1}
            value={Math.round(theta)}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={playing}
            aria-label="Ângulo do vetor, em graus"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {presets.map((p) => (
          <button key={p.label} type="button" onClick={() => goTo(p.deg)} disabled={playing} aria-pressed={!playing && Math.abs(target - p.deg) < 0.01}>
            Girar até {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
