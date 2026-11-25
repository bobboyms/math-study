import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {fmt} from '../mathviz/useAnimation';

// O sinal do produto escalar (lição 7.31, Produto escalar).
//
// O vetor u fica parado; dois controles escolhem as coordenadas inteiras de v.
// A reta tracejada passa pela origem em ângulo reto com u e divide o plano em
// dois lados. O lado de u está sombreado: quando a ponta de v está nele, o
// produto escalar sai positivo; em cima da reta, zero; do outro lado,
// negativo. O arco marca o ângulo entre as setas, sempre o do lado menor.
//
// `readout="sign"` (padrão) mostra a conta das coordenadas e o tipo de ângulo.
// `readout="angle"` acrescenta a conta do ângulo pelo arco cosseno.

const num = (n) => String(n).replace('-', '−');
const tex = (n) => String(n);
const texP = (n) => (n < 0 ? `(${n})` : String(n));
const pair = (p) => `(${p[0]},\\ ${p[1]})`;
const comma = (v, d) => fmt(v, d).replace(',', '{,}');

// Recorta o retângulo da janela pelo semiplano u·x >= 0.
function halfPlane(u, box) {
  const [x0, x1, y0, y1] = box;
  const poly = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ];
  const f = (p) => u[0] * p[0] + u[1] * p[1];
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const fp = f(p);
    const fq = f(q);
    if (fp >= 0) out.push(p);
    if ((fp >= 0) !== (fq >= 0)) {
      const s = fp / (fp - fq);
      out.push([p[0] + s * (q[0] - p[0]), p[1] + s * (q[1] - p[1])]);
    }
  }
  return out;
}

// Fatia de círculo entre as direções de u e v, pelo lado menor.
function wedge(u, v, r) {
  const au = Math.atan2(u[1], u[0]);
  let d = Math.atan2(v[1], v[0]) - au;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const pts = [[0, 0]];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const a = au + (d * i) / steps;
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  return {pts, mid: au + d / 2};
}

export default function DotSignExplorer({
  u = [4, 1],
  initial = [2, 3],
  presets = [
    [2, 3],
    [-1, 4],
    [-3, 2],
  ],
  readout = 'sign',
  range = 5,
  caption,
}) {
  const [v, setV] = useState(initial);
  const lim = range + 1;
  const box = [-lim, lim, -lim, lim];

  const p = u[0] * v[0] + u[1] * v[1];
  const nu = Math.hypot(u[0], u[1]);
  const nv = Math.hypot(v[0], v[1]);
  const zero = nv === 0;
  const cos = zero ? 0 : p / (nu * nv);
  const theta = zero ? 0 : (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;

  const polygons = [{points: halfPlane(u, box), tone: 1}];
  const labels = [];
  const segments = [{from: [0, 0], to: u, tone: 1, arrow: true}];
  if (!zero) {
    const w = wedge(u, v, 1.1);
    polygons.push({points: w.pts, tone: 3});
    if (theta > 12) {
      labels.push({at: [1.85 * Math.cos(w.mid), 1.85 * Math.sin(w.mid)], math: `${Math.round(theta)}^\\circ`, tone: 3});
    }
    segments.push({from: [0, 0], to: v, tone: 2, arrow: true});
    labels.push({
      at: v,
      math: `\\vec{v} = ${pair(v)}`,
      dx: v[0] >= 0 ? 44 : -44,
      dy: v[1] >= 0 ? -14 : 18,
      tone: 2,
    });
  }
  // Com u deitado no eixo x, o rótulo vai acima da seta, longe dos números do eixo.
  labels.push({at: u, math: `\\vec{u} = ${pair(u)}`, dx: 30, dy: u[1] === 0 ? -16 : 20, tone: 1});

  // Rótulos dos dois lados da reta, longe das setas.
  const side = [u[0] / nu, u[1] / nu];
  labels.push({at: [side[0] * 4.2 + side[1] * 3.6, side[1] * 4.2 - side[0] * 3.6], math: '\\text{positivo}', tone: 1});
  labels.push({at: [-side[0] * 4.2 + side[1] * 3.6, -side[1] * 4.2 - side[0] * 3.6], math: '\\text{negativo}'});

  const kind = zero
    ? 'O vetor nulo não tem direção, e não há ângulo para classificar.'
    : p > 0
      ? 'Positivo: a ponta de v está do lado sombreado, e o ângulo é agudo.'
      : p === 0
        ? 'Zero: a ponta de v está em cima da reta tracejada, e o ângulo é reto.'
        : theta > 179.95
          ? 'Negativo: v aponta exatamente para o lado oposto ao de u, e o ângulo é raso, de 180°.'
          : 'Negativo: a ponta de v está do lado sem sombra, e o ângulo é obtuso.';

  const cosText = `\\cos\\theta = \\dfrac{${tex(p)}}{\\sqrt{${u[0] * u[0] + u[1] * u[1]}} \\times \\sqrt{${v[0] * v[0] + v[1] * v[1]}}} \\approx ${comma(cos, 3)}`;

  return (
    <div className={shared.wrapper} data-explorer="dot-sign">
      <CartesianPlane
        xMin={-lim}
        xMax={lim}
        yMin={-lim}
        yMax={lim}
        xUnit={range > 5 ? 22 : 26}
        axisLabels={['x', 'y']}
        polygons={polygons}
        lines={[{through: [[0, 0], [-u[1], u[0]]], dashed: true, muted: true}]}
        segments={segments}
        labels={labels}
        caption={
          caption ??
          'A seta azul é u, parada. A seta laranja é v: mude as coordenadas nos controles. A reta tracejada faz ângulo reto com u. Do lado sombreado o produto escalar é positivo; em cima da reta, zero; do outro lado, negativo.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\vec{u} \\cdot \\vec{v} = ${texP(u[0])} \\times ${texP(v[0])} + ${texP(u[1])} \\times ${texP(v[1])} = ${tex(u[0] * v[0])} ${u[1] * v[1] < 0 ? '-' : '+'} ${Math.abs(u[1] * v[1])} = ${tex(p)}`} />
        </p>
        <p>{kind}</p>
        {readout === 'angle' && !zero && (
          <p className={shared.formula}>
            <Formula math={`${cosText}, \\qquad \\theta \\approx ${comma(theta, 1)}^\\circ`} />
          </p>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Primeira coordenada de v: {num(v[0])}</span>
          <input
            type="range"
            min={-range}
            max={range}
            step={1}
            value={v[0]}
            onChange={(e) => setV([Number(e.target.value), v[1]])}
            aria-label="Primeira coordenada do vetor v"
          />
        </label>
        <label className={shared.control}>
          <span>Segunda coordenada de v: {num(v[1])}</span>
          <input
            type="range"
            min={-range}
            max={range}
            step={1}
            value={v[1]}
            onChange={(e) => setV([v[0], Number(e.target.value)])}
            aria-label="Segunda coordenada do vetor v"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {presets.map((q) => (
          <button key={q.join(',')} type="button" aria-pressed={q[0] === v[0] && q[1] === v[1]} onClick={() => setV(q)}>
            v = ({num(q[0])}, {num(q[1])})
          </button>
        ))}
      </div>
    </div>
  );
}
