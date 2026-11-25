import React, {useState} from 'react';
import GeoFigure from '../GeoFigure';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {fmt} from '../mathviz/useAnimation';

// O produto escalar como sombra vezes comprimento (lição 7.31, Produto
// escalar).
//
// v fica deitado na horizontal, com tamanho escolhido num controle. u tem
// tamanho 4 e faz o ângulo θ com v, escolhido no outro controle. A luz cai de
// cima, em ângulo reto com v: a sombra de u sobre a reta de v é o segmento
// verde, de comprimento 4 cos θ. Quando θ passa de 90°, a sombra cai do outro
// lado da origem, e o comprimento com sinal fica negativo. O painel faz
// u · v = sombra × tamanho de v, e confere pelas coordenadas.

const A = 4;
const comma = (v, d) => fmt(v, d).replace(',', '{,}');
const sgn = (v, d = 2) => (v < -0.005 ? `-${comma(-v, d)}` : comma(Math.abs(v), d));
const par = (v, d = 2) => (v < -0.005 ? `(${sgn(v, d)})` : sgn(v, d));

export default function DotShadow({initialTheta = 50, initialB = 5, caption}) {
  const [theta, setTheta] = useState(initialTheta);
  const [b, setB] = useState(initialB);

  const r = (theta * Math.PI) / 180;
  const u = [A * Math.cos(r), A * Math.sin(r)];
  const shadow = u[0];
  const dot = shadow * b;

  const segments = [
    {from: [-4.6, 0], to: [6.6, 0], tone: 0, dashed: true},
    {from: [0, 0], to: [b, 0], tone: 1, arrow: true},
    {from: [0, 0], to: u, tone: 2, arrow: true},
  ];
  const labels = [
    {at: [b, 0], math: '\\vec{v}', tone: 1, dx: 4, dy: 22},
    {at: u, math: '\\vec{u}', tone: 2, dx: u[0] >= 0 ? 14 : -14, dy: -14},
  ];
  const angles = [];
  const polygons = [];
  if (Math.abs(shadow) > 0.05) {
    // A sombra é desenhada como uma faixa fina logo abaixo da reta de v, para
    // não se esconder atrás da seta de v.
    polygons.push({
      points: [
        [0, -0.12],
        [shadow, -0.12],
        [shadow, -0.32],
        [0, -0.32],
      ],
      tone: 3,
    });
    labels.push({
      at: [shadow / 2, -0.22],
      math: `\\text{sombra} \\approx ${sgn(shadow)}`,
      dy: 26,
      tone: 3,
    });
  } else {
    labels.push({at: [0, -0.22], math: '\\text{sombra} = 0', dy: 26, tone: 3});
  }
  if (u[1] > 0.05) {
    segments.push({from: u, to: [shadow, 0], tone: 3, dashed: true});
    if (Math.abs(shadow) > 0.3 && u[1] > 0.3) {
      angles.push({at: [shadow, 0], from: [shadow + (shadow > 0 ? -1 : 1), 0], to: u, right: true, tone: 3});
    }
  }
  if (theta > 6) {
    angles.push({at: [0, 0], from: [3, 0], to: u, label: `${theta}^\\circ`, tone: 0, radius: 28, labelRadius: 46});
  }

  return (
    <div className={shared.wrapper} data-explorer="dot-shadow">
      <GeoFigure
        unit={36}
        padding={30}
        bounds={[-4.7, -1.4, 6.8, 4.5]}
        polygons={polygons}
        segments={segments}
        angles={angles}
        labels={labels}
        caption={
          caption ??
          'A seta azul é v, deitada; a laranja é u, de tamanho 4. O tracejado verde desce da ponta de u em ângulo reto com a reta de v, e a faixa verde é a sombra de u. Com ângulo obtuso, a sombra cai do outro lado da origem e conta como negativa.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\text{sombra} = 4 \\times \\cos ${theta}^\\circ \\approx ${sgn(shadow)}, \\qquad \\vec{u} \\cdot \\vec{v} = \\text{sombra} \\times ${b} \\approx ${sgn(dot)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\text{pelas coordenadas: } \\vec{u} \\approx (${sgn(u[0])};\\ ${sgn(u[1])}),\\ \\vec{v} = (${b},\\ 0), \\quad ${par(u[0])} \\times ${b} + ${sgn(u[1])} \\times 0 \\approx ${sgn(dot)}`}
          />
        </p>
        <p>
          {theta < 90
            ? 'Ângulo agudo: a sombra cai do lado para onde v aponta, e o produto é positivo.'
            : theta === 90
              ? 'Ângulo reto: a sombra encolhe até um ponto, e o produto é zero.'
              : theta === 180
                ? 'Ângulo raso: u aponta para o lado oposto ao de v, a sombra é u inteira, do lado contrário, e o produto é negativo.'
                : 'Ângulo obtuso: a sombra cai do lado contrário ao de v, e o produto é negativo.'}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo entre u e v: {theta}°</span>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            aria-label="Ângulo entre u e v, em graus"
          />
        </label>
        <label className={shared.control}>
          <span>Tamanho de v: {b}</span>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            aria-label="Tamanho do vetor v"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {[30, 60, 90, 120, 180].map((d) => (
          <button key={d} type="button" aria-pressed={d === theta} onClick={() => setTheta(d)}>
            {d}°
          </button>
        ))}
      </div>
    </div>
  );
}
