import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {add, dec, dot, pairTex, rightAngleMark, signed, sub} from '../mathviz/lineParam';

// A reta dada por um ponto e pelo normal (lição 7.33, Retas com vetores).
//
// O ponto P₀ e o vetor normal n estão fixos. O aluno move um ponto P. A seta
// de P₀ até P (azul) e o produto escalar n · (P − P₀) dizem tudo: zero, P está
// na reta; positivo, P está do lado para onde n aponta (região sombreada);
// negativo, do outro lado. A reta é exatamente o lugar onde a conta dá zero.

const txt = (v) => dec(v, 0).replace('-', '−');

// Recorta o retângulo da janela pelo semiplano n · (X − P₀) ≥ 0.
function halfPlane(box, P0, n) {
  const [x0, x1, y0, y1] = box;
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const f = (p) => dot(n, sub(p, P0));
  const out = [];
  corners.forEach((p, i) => {
    const q = corners[(i + 1) % 4];
    const fp = f(p);
    const fq = f(q);
    if (fp >= 0) out.push(p);
    if ((fp >= 0) !== (fq >= 0)) {
      const s = fp / (fp - fq);
      out.push([p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s]);
    }
  });
  return out;
}

export default function NormalSide({
  P0 = [3, 2],
  n = [2, 3],
  xMin = -2,
  xMax = 8,
  yMin = -2,
  yMax = 8,
  xUnit = 32,
  initial = [6, 0],
  caption,
}) {
  const [P, setP] = useState(initial);
  const [a, b] = n;
  const w = sub(P, P0);
  const v = dot(n, w);
  const dir = [-b, a];
  const isP0 = w[0] === 0 && w[1] === 0;

  const segments = [{from: P0, to: add(P0, n), tone: 2, arrow: true, label: '\\vec{n}', dx: -14, dy: -2}];
  if (!isP0) segments.push({from: P0, to: P, tone: 1, arrow: true});

  return (
    <div className={shared.wrapper} data-explorer="normal-side">
      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnit={xUnit}
        axisLabels={['x', 'y']}
        polygons={[{points: halfPlane([xMin, xMax, yMin, yMax], P0, n), tone: 2}, rightAngleMark(P0, dir, n, 0.4)]}
        lines={[{through: [P0, add(P0, dir)], tone: 0}]}
        segments={segments}
        points={[
          {at: P0, tone: 0, r: 4.5, label: 'P_0', dx: -16, dy: 14},
          {at: P, tone: 1, r: 6, label: isP0 ? undefined : 'P', dx: 14, dy: -10},
        ]}
        caption={caption}
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\vec{n} \\cdot \\overrightarrow{P_0P} = ${dec(a, 0)}(x - ${dec(P0[0], 0)}) + ${dec(b, 0)}(y - ${dec(P0[1], 0)}) = ${dec(a, 0)} \\times ${signed(w[0], 0)} + ${dec(b, 0)} \\times ${signed(w[1], 0)} = ${dec(v, 0)}`}
          />
        </p>
        <p>
          {v === 0 ? (
            <>
              <strong>Deu zero:</strong> a seta de P₀ até P forma ângulo reto com n (ou é nula), e P{' '}
              <Formula math={pairTex(P[0], P[1])} /> está na reta.
            </>
          ) : v > 0 ? (
            <>
              <strong>Deu positivo:</strong> a seta de P₀ até P faz ângulo agudo com n. P está fora da reta, do lado para
              onde n aponta (a região sombreada).
            </>
          ) : (
            <>
              <strong>Deu negativo:</strong> a seta de P₀ até P faz ângulo obtuso com n. P está fora da reta, do lado
              oposto ao de n.
            </>
          )}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ponto P, coordenada x: {txt(P[0])}</span>
          <input
            type="range"
            min={Math.ceil(xMin)}
            max={Math.floor(xMax)}
            step={1}
            value={P[0]}
            onChange={(e) => setP([Number(e.target.value), P[1]])}
            aria-label="Coordenada x do ponto P"
          />
        </label>
        <label className={shared.control}>
          <span>Ponto P, coordenada y: {txt(P[1])}</span>
          <input
            type="range"
            min={Math.ceil(yMin)}
            max={Math.floor(yMax)}
            step={1}
            value={P[1]}
            onChange={(e) => setP([P[0], Number(e.target.value)])}
            aria-label="Coordenada y do ponto P"
          />
        </label>
      </div>
    </div>
  );
}
