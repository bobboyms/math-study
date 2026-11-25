import React, {useState} from 'react';
import GeoFigure from '../GeoFigure';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {fmt} from '../mathviz/useAnimation';

// O comprimento da soma e o "dobro do produto" (lição 7.31, Produto escalar).
//
// É o barco da lição de soma de vetores: velocidade própria de 8 km/h e
// correnteza de 6 km/h. Um controle muda o ângulo θ entre as duas. A soma é a
// diagonal do paralelogramo. O painel abre
// ‖u + v‖² = ‖u‖² + 2 u·v + ‖v‖² com os números: com θ = 90° o termo do meio
// some e sobra o Pitágoras (10 km/h); com θ = 0° as velocidades se somam
// (14 km/h); com θ = 180° uma desconta a outra (2 km/h).

const U = 8;
const V = 6;
const comma = (v, d) => fmt(v, d).replace(',', '{,}');
const sgn = (v, d = 2) => (v < -0.005 ? `-${comma(-v, d)}` : comma(Math.abs(v), d));
const isInt = (v) => Math.abs(v - Math.round(v)) < 1e-9;
const show = (v) => (isInt(v) ? String(Math.round(v)) : sgn(v));
const eq = (v) => (isInt(v) ? '=' : '\\approx');

export default function DotSumLength({initial = 90, caption}) {
  const [theta, setTheta] = useState(initial);
  const r = (theta * Math.PI) / 180;
  const u = [U * Math.cos(r), U * Math.sin(r)];
  const v = [V, 0];
  const s = [u[0] + v[0], u[1] + v[1]];
  const dot = U * V * Math.cos(r);
  const sq = U * U + 2 * dot + V * V;
  const len = Math.sqrt(Math.max(0, sq));

  const segments = [
    {from: v, to: s, tone: 0, dashed: true},
    {from: u, to: s, tone: 0, dashed: true},
    {from: [0, 0], to: v, tone: 1, arrow: true},
    {from: [0, 0], to: u, tone: 2, arrow: true},
  ];
  if (len > 0.2) segments.push({from: [0, 0], to: s, tone: 3, arrow: true});

  const labels = [
    {at: [V / 2, 0], math: '\\vec{v}\\ (6)', tone: 1, dy: 20},
    {at: [u[0] / 2, u[1] / 2], math: '\\vec{u}\\ (8)', tone: 2, dx: theta < 150 ? -30 : 0, dy: theta < 150 ? -4 : -18},
  ];
  if (len > 0.2) {
    labels.push({at: s, math: `\\lVert \\vec{u} + \\vec{v} \\rVert ${eq(len)} ${show(len)}`, tone: 3, dx: s[0] > 3 ? 20 : -10, dy: -18});
  }
  // O rótulo do ângulo fica perto da correnteza (a um quarto da abertura):
  // na bissetriz ele cairia sobre a diagonal da soma.
  const angles = theta > 6 && theta < 174 ? [{at: [0, 0], from: [3, 0], to: u, tone: 0, radius: 26}] : [];
  if (theta >= 40 && theta < 174) {
    const q = r / 4;
    labels.push({at: [2.3 * Math.cos(q), 2.3 * Math.sin(q)], math: `${theta}^\\circ`});
  }

  return (
    <div className={shared.wrapper} data-explorer="dot-sum-length">
      <GeoFigure
        unit={26}
        padding={30}
        bounds={[-2.6, -1.2, 14.8, 8.9]}
        segments={segments}
        angles={angles}
        labels={labels}
        caption={
          caption ??
          'A seta azul é a correnteza, 6 km/h. A laranja é a velocidade própria do barco, 8 km/h. A seta verde é a soma: a diagonal do paralelogramo tracejado. Mude o ângulo entre as duas e veja o tamanho da soma mudar.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\vec{u} \\cdot \\vec{v} = 8 \\times 6 \\times \\cos ${theta}^\\circ ${eq(dot)} ${show(dot)}`} />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\lVert \\vec{u} + \\vec{v} \\rVert^2 = 64 + 2 \\times ${dot < -0.005 ? `(${show(dot)})` : show(dot)} + 36 ${eq(sq)} ${show(sq)}, \\qquad \\lVert \\vec{u} + \\vec{v} \\rVert ${eq(len)} ${show(len)}`}
          />
        </p>
        <p>
          {theta === 90
            ? 'Ângulo reto: o produto escalar é zero, o termo do meio some, e sobra o Pitágoras: 64 + 36 = 100.'
            : theta < 90
              ? 'Ângulo agudo: o produto é positivo, e a soma fica maior que a do Pitágoras.'
              : theta === 180
                ? 'Ângulo raso: as velocidades apontam para lados opostos, o produto é negativo, e uma desconta a outra: 8 − 6 = 2.'
                : 'Ângulo obtuso: o produto é negativo, e a soma fica menor que a do Pitágoras.'}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo entre o barco e a correnteza: {theta}°</span>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            aria-label="Ângulo entre a velocidade do barco e a correnteza, em graus"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {[0, 60, 90, 120, 180].map((d) => (
          <button key={d} type="button" aria-pressed={d === theta} onClick={() => setTheta(d)}>
            {d}°
          </button>
        ))}
      </div>
    </div>
  );
}
