import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {wedge, polar, dec, decText, pairTex} from '../mathviz/vectorArc';

// Todo vetor é um ponto do ciclo esticado (lição 7.30):
// r(cos θ, sen θ) é a seta de tamanho r e ângulo θ.
//
// O ciclo de raio 1 (laranja) tem o ponto (cos θ, sen θ) e a seta curta até
// ele. Ao aparecer, a seta curta estica, sem girar, até o tamanho r (azul),
// e a ponta passa pela circunferência tracejada de raio r. Os deslizantes
// mudam o ângulo e o tamanho; o painel mostra a mesma conta com os números
// do momento: as duas coordenadas do ponto do ciclo multiplicadas por r.

const DURATION = 3.2;

export default function StretchedCycle({initialAngle = 36.87, initialR = 5, caption}) {
  const [theta, setTheta] = useState(initialAngle);
  const [r, setR] = useState(initialR);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const k = stage(t, 0.6, DURATION - 0.3);
  const now = 1 + (r - 1) * k;

  const unit = polar(1, theta);
  const tip = polar(now, theta);
  const segments = [];
  const labels = [];
  const polygons = [wedge(0.6, 0, theta, 0)];

  // A seta mais comprida vai por baixo, para a curta continuar visível sobre
  // ela (as duas estão na mesma reta).
  const longArrow = {from: [0, 0], to: tip, tone: 1, arrow: true};
  const unitArrow = {from: [0, 0], to: unit, tone: 2, arrow: true};
  if (Math.abs(now - 1) < 0.02) segments.push(unitArrow);
  else if (now > 1) segments.push(longArrow, unitArrow);
  else segments.push(unitArrow, longArrow);

  const side = unit[0] >= -0.2 ? 1 : -1;
  if (k > 0.98 || !playing) {
    labels.push({
      at: polar(r, theta),
      math: pairTex(r * unit[0], r * unit[1], 2),
      dx: side * 52,
      dy: unit[1] >= 0 ? -14 : 16,
      tone: 1,
    });
  }
  labels.push({
    at: unit,
    math: '(\\cos\\theta,\\ \\sen\\theta)',
    dx: unit[0] >= 0 ? 70 : -70,
    dy: unit[1] >= 0 ? 34 : -34,
    tone: 2,
  });
  const m = polar(0.6, theta / 2);
  if (theta > 8) labels.push({at: m, math: '\\theta', dx: m[0] >= 0 ? 10 : -10, dy: m[1] >= 0 ? -8 : 10});

  const c = Math.cos((theta * Math.PI) / 180);
  const s = Math.sin((theta * Math.PI) / 180);

  return (
    <div className={shared.wrapper} data-explorer="stretched-cycle">
      <div ref={ref}>
        <CartesianPlane
          xMin={-6}
          xMax={6}
          yMin={-6}
          yMax={6}
          xUnit={26}
          showNumbers={false}
          axisLabels={['x', 'y']}
          circles={[
            {center: [0, 0], r: 1, tone: 2},
            {center: [0, 0], r: now, tone: 1, dashed: true},
          ]}
          segments={segments}
          labels={labels}
          polygons={polygons}
          caption={
            caption ??
            'A seta curta (laranja) vai até o ponto do ciclo de raio 1 no ângulo θ. A seta longa (azul) é a mesma seta esticada r vezes: ela aponta para o mesmo lado e termina na circunferência tracejada de raio r.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`(\\cos\\theta,\\ \\sen\\theta) = ${pairTex(c, s, 3)}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`${dec(r, 1)} \\times ${pairTex(c, s, 3)} = ${pairTex(r * c, r * s, 2)}`} />
        </p>
        <p>
          A seta curta mede 1. A longa mede <Formula math={`${dec(r, 1)} \\times 1 = ${dec(r, 1)}`} /> e aponta para o
          mesmo lado, no ângulo <Formula math={`${dec(theta, 1)}^\\circ`} />.
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo θ: {decText(theta, 1)}°</span>
          <input type="range" min={0} max={359} step={1} value={Math.round(theta)} onChange={(e) => setTheta(Number(e.target.value))} disabled={playing} aria-label="Ângulo do vetor, em graus" />
        </label>
        <label className={shared.control}>
          <span>Tamanho r: {decText(r, 1)}</span>
          <input type="range" min={0.5} max={5.5} step={0.5} value={r} onChange={(e) => setR(Number(e.target.value))} disabled={playing} aria-label="Tamanho do vetor" />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a seta esticar de novo
        </button>
        <button
          type="button"
          onClick={() => {
            setTheta(36.87);
            setR(5);
          }}
          disabled={playing}
        >
          Voltar a (4, 3)
        </button>
      </div>
    </div>
  );
}
