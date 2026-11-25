import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import {add, dec, dot, norm, pairTex, rightAngleMark, signed, sub, times} from '../mathviz/lineParam';

// A distância se mede na direção do normal (lição 7.33, Retas com vetores).
//
// A reta a·x + b·y + c = 0, o normal n = (a, b) e um ponto P fora dela. Um
// ponto A desliza pela reta (animação ao aparecer, depois o controle). A seta
// w = AP (cinza escuro) muda a cada posição de A, mas a parte de w na direção
// do normal (seta verde, saindo de A) fica sempre igual: ela é o segmento
// tracejado de P até a reta, que é a distância. O resto de w (tracejado
// cinza) corre paralelo à reta.

const txt = (v) => dec(v, 1).replace('{,}', ',').replace('-', '−');

export default function DistanceAlongNormal({
  a = 2,
  b = -1,
  c = 3,
  P = [1, 8],
  xMin = -3,
  xMax = 4,
  yMin = -1,
  yMax = 9,
  xUnit = 40,
  sRange = [-1.5, 2],
  initial = 0,
  caption,
}) {
  const [s, setS] = useState(initial);
  const anim = useAnimation({duration: 5});
  const {ref, playing} = anim;

  // A desliza: de sRange[0] até sRange[1] e volta até `initial`.
  let shownS = s;
  if (playing) {
    const u = anim.t;
    if (u < 0.4) shownS = sRange[0];
    else if (u < 3) shownS = sRange[0] + (sRange[1] - sRange[0]) * ease((u - 0.4) / 2.6);
    else shownS = sRange[1] + (initial - sRange[1]) * ease(Math.min(1, (u - 3) / 1.6));
  }

  // A reta escrita como A(s) = (s, (−c − a·s) ÷ b): serve quando b ≠ 0.
  const pointAt = (x) => [x, (-c - a * x) / b];
  const n = [a, b];
  const nn = dot(n, n);
  const A = pointAt(shownS);
  const w = sub(P, A);
  const k = dot(w, n) / nn;
  const part = times(k, n);
  const H = sub(P, part);
  const dir = [-b, a];

  const segments = [
    {from: A, to: add(A, n), tone: 2, arrow: true, label: '\\vec{n}', dx: 16, dy: 8},
    {from: add(A, part), to: P, muted: true, dashed: true},
    {from: A, to: P, tone: 0, arrow: true, label: '\\vec{w}', dx: -14, dy: 0},
    {from: A, to: add(A, part), tone: 3, arrow: true},
    {from: P, to: H, tone: 3, dashed: true, label: 'd', dx: 10, dy: -12},
  ];

  const value = dot(w, n);
  const comp = value / Math.sqrt(nn);
  const shown = (v) => dec(v, 3);

  return (
    <div className={shared.wrapper} data-explorer="distance-along-normal">
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={xUnit}
          axisLabels={['x', 'y']}
          lines={[{through: [pointAt(0), pointAt(1)], tone: 1}]}
          polygons={[rightAngleMark(H, dir, part, 0.3)]}
          segments={segments}
          points={[
            {at: A, tone: 1, r: 5, label: 'A', dx: 16, dy: 10},
            {at: P, tone: 0, r: 5, label: 'P', dx: -14, dy: -8},
            {at: H, tone: 3, r: 3.5},
          ]}
          caption={caption}
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {playing ? (
          <p>O ponto A desliza pela reta. Repare na seta verde: ela não muda.</p>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula
                math={`A = ${pairTex(A[0], A[1])},\\quad \\vec{w} = P - A = ${pairTex(w[0], w[1])}`}
              />
            </p>
            <p className={shared.formula}>
              <Formula
                math={`\\vec{w} \\cdot \\vec{n} = ${signed(w[0])} \\times ${signed(a, 0)} + ${signed(w[1])} \\times ${signed(b, 0)} = ${dec(value, 1)}`}
              />
            </p>
            <p className={shared.formula}>
              <Formula
                math={`\\frac{\\vec{w} \\cdot \\vec{n}}{\\lVert \\vec{n} \\rVert} = \\frac{${dec(value, 1)}}{\\sqrt{${dec(nn, 0)}}} \\approx ${shown(comp)}`}
              />
            </p>
            <p>
              A seta w mede <Formula math={`${dec(norm(w), 2)}`} />, e muda quando A anda. A parte dela na direção do
              normal (seta verde) continua valendo <Formula math={`${shown(comp)}`} />, qualquer que seja A. Sem o sinal,
              esse número é a distância: <Formula math={`d \\approx ${shown(Math.abs(comp))}`} />.
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Posição de A na reta, coordenada x: {txt(s)}</span>
          <input
            type="range"
            min={sRange[0]}
            max={sRange[1]}
            step={0.5}
            value={s}
            disabled={playing}
            onChange={(e) => setS(Number(e.target.value))}
            aria-label="Coordenada x do ponto A sobre a reta"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          onClick={() => {
            setS(initial);
            anim.play();
          }}
          disabled={playing}
        >
          Ver A deslizar de novo
        </button>
      </div>
    </div>
  );
}
