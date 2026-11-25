import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {clipLine, dot, kOf, norm, rightAngle, sub, times, num, numText, par} from '../mathviz/projection';

// O ângulo decide o lado da sombra (lição 7.32).
//
// u = (4, 2) fica parado e marca o chão (reta cinza tracejada). A vara v tem
// tamanho 4 e faz com u o ângulo θ escolhido no deslizante, de 0° a 180°. Da
// ponta de v desce a linha em ângulo reto até o chão, e a sombra (verde) vai
// da origem até o pé. Com θ agudo, a sombra aponta para o lado de u; com
// θ = 90°, ela encolhe até um ponto; com θ obtuso ou raso, cai atrás da origem.
//
// show="sign" (padrão): o painel liga o lado da sombra ao sinal de v · u.
// show="comp": o painel calcula o tamanho com sinal da sombra de dois jeitos,
// ‖v‖ cos θ e (v · u) / ‖u‖, e mostra que dão o mesmo número.

const U = [4, 2];
const R = 4;
const BOX = [-4.8, 4.8, -2.4, 4.6];
const ALPHA = Math.atan2(U[1], U[0]);

const off = (d, L) => {
  const n = norm(d) || 1;
  return {dx: (d[0] / n) * L, dy: (-d[1] / n) * L};
};

export default function ProjectionExplorer({initial = 50, show = 'sign', caption}) {
  const [theta, setTheta] = useState(initial);

  const ang = ALPHA + (theta * Math.PI) / 180;
  const v = [R * Math.cos(ang), R * Math.sin(ang)];
  const k = kOf(v, U);
  const H = times(k, U);
  const d = dot(v, U);
  const lu = norm(U);
  const comp = d / lu;
  const cos = Math.cos((theta * Math.PI) / 180);
  const zero = Math.abs(theta - 90) < 0.01;

  const line = clipLine([0, 0], U, BOX);
  const nrm = [-U[1], U[0]];
  const down = times(-1, nrm);
  const segments = [];
  if (line) segments.push({from: line[0], to: line[1], muted: true, dashed: true});
  segments.push({from: [0, 0], to: U, tone: 1, arrow: true});
  if (norm(sub(v, H)) > 0.05) segments.push({from: v, to: H, tone: 2, dashed: true});
  if (!zero && norm(H) > 0.08) segments.push({from: [0, 0], to: H, tone: 3, arrow: true});
  segments.push({from: [0, 0], to: v, tone: 2, arrow: true});
  if (norm(H) > 0.3 || zero) {
    segments.push(...rightAngle(H, times(k >= 0 ? -1 : 1, U), sub(v, H), 0.26));
  }

  const labels = [
    {at: U, math: '\\vec{u}', tone: 1, ...off([U[0] + down[0] * 0.5, U[1] + down[1] * 0.5], 18)},
    {at: v, math: '\\vec{v}', tone: 2, ...off(v, 16)},
  ];
  if (!zero && norm(H) > 0.3) {
    const text = show === 'comp' ? `${num(comp, 2)}` : '\\text{sombra}';
    // O rótulo fica do lado de baixo da reta, longe da vara. Com ângulo agudo,
    // ele vai para perto da ponta da sombra, onde há mais espaço até o eixo x.
    labels.push({at: times(theta < 90 ? 0.75 : 0.5, H), math: text, tone: 3, ...off(down, 24)});
  }

  let where;
  if (zero) where = 'A sombra é um ponto só: o vetor nulo.';
  else if (theta < 90) where = 'A sombra aponta para o mesmo lado de u.';
  else where = 'A sombra cai atrás da origem e aponta contra u.';

  return (
    <div className={shared.wrapper} data-explorer="projection-explorer">
      <CartesianPlane
        xMin={BOX[0]}
        xMax={BOX[1]}
        yMin={BOX[2]}
        yMax={BOX[3]}
        xUnit={40}
        showNumbers={false}
        axisLabels={['x', 'y']}
        segments={segments}
        labels={labels}
        caption={
          caption ??
          'O vetor u (azul) fica parado; a vara v (laranja) tem tamanho 4 e faz com u o ângulo escolhido. A sombra de v (verde) termina onde a linha tracejada, em ângulo reto com o chão, encontra a reta de u.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {show === 'comp' ? (
          <>
            <p className={shared.formula}>
              <Formula
                math={`\\lVert \\vec{v} \\rVert \\cos\\theta = 4 \\times \\cos ${theta}^\\circ ${zero ? '=' : '\\approx'} 4 \\times ${par(cos, 3)} ${zero ? '=' : '\\approx'} ${num(R * cos, 2)}`}
              />
            </p>
            <p className={shared.formula}>
              <Formula
                math={`\\frac{\\vec{v} \\cdot \\vec{u}}{\\lVert \\vec{u} \\rVert} \\approx \\frac{${num(d, 2)}}{${num(lu, 3)}} ${zero ? '=' : '\\approx'} ${num(comp, 2)}`}
              />
            </p>
            <p>{where} As duas contas dão o mesmo número, com o mesmo sinal.</p>
          </>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula math={`\\theta = ${theta}^\\circ, \\qquad \\vec{v} \\cdot \\vec{u} ${zero ? '=' : '\\approx'} ${num(d, 2)}`} />
            </p>
            <p>
              {zero
                ? 'O produto escalar é zero: ângulo reto. '
                : d > 0
                  ? 'O produto escalar é positivo: ângulo agudo. '
                  : theta === 180
                    ? 'O produto escalar é negativo: ângulo raso, de 180°. '
                    : 'O produto escalar é negativo: ângulo obtuso. '}
              {where}
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo entre v e u: {numText(theta, 0)}°</span>
          <input
            type="range"
            min={0}
            max={180}
            step={5}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            aria-label="Ângulo entre v e u, em graus"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {[30, 90, 135].map((deg) => (
          <button key={deg} type="button" aria-pressed={theta === deg} onClick={() => setTheta(deg)}>
            {deg}°
          </button>
        ))}
      </div>
    </div>
  );
}
