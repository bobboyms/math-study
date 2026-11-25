import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {add, clipLine, dot, norm, rightAngle, sub, times, num, numText, pair, par} from '../mathviz/projection';

// Só um múltiplo de u deixa o resto em ângulo reto (lição 7.32).
//
// v = (1, 4) e u = (4, 2). O deslizante escolhe um número k, e a seta verde é
// a candidata a sombra, k u, sobre a reta de u. O resto (laranja tracejado) é
// o que falta para chegar a v: v − k u. O painel faz o produto escalar do
// resto com u e mede o ângulo entre os dois. Só com k = 0,6 o produto dá zero
// e o ângulo é reto; nesse mesmo k, o resto é o mais curto possível.
//
// Com `pythagoras`, o painel compara a soma dos quadrados dos tamanhos das
// duas partes com o quadrado do tamanho de v, que é 17. A soma só bate quando
// as partes são perpendiculares.

const V = [1, 4];
const U = [4, 2];
const BOX = [-1.2, 6.8, -0.8, 4.8];

export default function ResidualSlider({initial = 1.4, pythagoras = false, caption}) {
  const [k, setK] = useState(initial);

  const p = times(k, U);
  const r = sub(V, p);
  const ru = dot(r, U);
  const right = Math.abs(ru) < 1e-9;
  const lr = norm(r);
  const angle = (Math.acos(Math.max(-1, Math.min(1, ru / (lr * norm(U))))) * 180) / Math.PI;
  const p2 = dot(p, p);
  const r2 = dot(r, r);

  // Rótulo do resto: afastado do segmento na perpendicular, para o lado de fora
  // (longe da origem).
  const perp = [r[1], -r[0]];
  const mid = add(p, times(0.5, r));
  const sgn = dot(perp, mid) >= 0 ? 1 : -1;
  const pl = norm(perp) || 1;
  const restoOff = {dx: ((sgn * perp[0]) / pl) * 30, dy: ((-sgn * perp[1]) / pl) * 16};
  const acute = Math.min(angle, 180 - angle);

  const line = clipLine([0, 0], U, BOX);
  const segments = [];
  if (line) segments.push({from: line[0], to: line[1], muted: true, dashed: true});
  segments.push({from: [0, 0], to: V, tone: 2, arrow: true});
  segments.push({from: [0, 0], to: p, tone: 3, arrow: true});
  segments.push({from: p, to: V, tone: 2, dashed: true});
  if (right) segments.push(...rightAngle(p, [-4, -2], r, 0.26));

  const labels = [
    {at: V, math: '\\vec{v}', tone: 2, dx: -14, dy: -10},
    {at: add(p, times(0.5, r)), math: '\\text{resto}', tone: 2, ...restoOff},
  ];
  // O rótulo k u fica entre a seta verde e v. Com k abaixo de 0,6 a seta verde
  // é curta e não sobra espaço ali sem encostar em v ou no eixo x: o painel
  // mostra o número.
  if (k >= 0.6 - 1e-9) {
    labels.push({at: times(0.5, p), math: `${num(k, 1)}\\,\\vec{u}`, tone: 3, dx: -0.447 * 24, dy: -0.894 * 24});
  }

  return (
    <div className={shared.wrapper} data-explorer="residual-slider">
      <CartesianPlane
        xMin={BOX[0]}
        xMax={BOX[1]}
        yMin={BOX[2]}
        yMax={BOX[3]}
        xUnit={48}
        axisLabels={['x', 'y']}
        segments={segments}
        labels={labels}
        caption={
          caption ??
          (pythagoras
            ? 'A seta verde é k vezes u = (4, 2), sobre a reta de u. O resto (laranja tracejado) vai da ponta dela até a ponta de v = (1, 4). Arraste k e compare a soma dos quadrados dos dois tamanhos com o quadrado do tamanho de v.'
            : 'A seta verde é a candidata a sombra: k vezes u = (4, 2), sobre a reta de u. O resto (laranja tracejado) é o que falta dela até a ponta de v = (1, 4). Arraste k e procure o valor que deixa o resto em ângulo reto com a reta.')
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\text{resto} = ${pair(V, 1)} - ${num(k, 1)}\\,${pair(U, 1)} = ${pair(V, 1)} - ${pair(p, 2)} = ${pair(r, 2)}`} />
        </p>
        {pythagoras ? (
          <>
            <p className={shared.formula}>
              <Formula
                math={`\\lVert ${num(k, 1)}\\,\\vec{u} \\rVert^2 + \\lVert \\text{resto} \\rVert^2 = ${num(p2, 2)} + ${num(r2, 2)} = ${num(p2 + r2, 2)}`}
              />
            </p>
            <p>
              {right
                ? 'A soma dá 17, que é o quadrado do tamanho de v. As duas partes são perpendiculares, e v é a hipotenusa do triângulo retângulo.'
                : `A soma dá ${numText(p2 + r2, 2)}, e não 17, que é o quadrado do tamanho de v. As partes não são perpendiculares, e Pitágoras não vale para elas.`}
            </p>
          </>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula
                math={`\\text{resto} \\cdot \\vec{u} = ${par(r[0], 2)} \\times 4 + ${par(r[1], 2)} \\times 2 = ${num(ru, 2)}, \\qquad \\lVert \\text{resto} \\rVert \\approx ${num(lr, 3)}`}
              />
            </p>
            <p>
              {right
                ? 'O produto escalar é zero: o resto está em ângulo reto com u. Este é o único k que faz isso, e é também o k que deixa o resto mais curto.'
                : `O produto escalar não é zero: o resto faz cerca de ${numText(acute, 0)}° com a reta de u, e não 90°.`}
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>k: {numText(k, 1)}</span>
          <input
            type="range"
            min={0.2}
            max={1.6}
            step={0.1}
            value={k}
            onChange={(e) => setK(Math.round(Number(e.target.value) * 10) / 10)}
            aria-label="Número k que multiplica u"
          />
        </label>
      </div>
    </div>
  );
}
