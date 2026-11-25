import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage, fmt} from '../mathviz/useAnimation';

// Produto zero é ângulo reto (lição 7.31, Produto escalar).
//
// u = (2, 3) fica parado. Uma cópia de u gira um quarto de volta no sentido
// anti-horário, até (−3, 2). Durante o giro o painel faz a conta das
// coordenadas: o produto começa em 13 (u com ele mesmo), diminui, e chega a 0
// exatamente quando a cópia forma ângulo reto com u. O botão do contraexemplo
// mostra (−2, 3), que só troca um sinal: o produto dá 5, e o ângulo não é reto.

const U = [2, 3];
const DURATION = 3.4;
const comma = (v, d) => fmt(v, d).replace(',', '{,}');
const sgn = (v, d = 2) => (v < -0.005 ? `-${comma(-v, d)}` : comma(Math.abs(v), d));
const par = (v, d = 2) => (v < -0.005 ? `(${sgn(v, d)})` : sgn(v, d));

export default function PerpTurn({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const [contra, setContra] = useState(false);

  const phi = (Math.PI / 2) * stage(t, 0.4, 3.0);
  const w = [U[0] * Math.cos(phi) - U[1] * Math.sin(phi), U[0] * Math.sin(phi) + U[1] * Math.cos(phi)];
  const dot = U[0] * w[0] + U[1] * w[1];
  const done = phi >= Math.PI / 2 - 1e-9;
  const final = done ? [-3, 2] : w;

  const au = Math.atan2(U[1], U[0]);
  const polygons = [];
  if (!done && phi > 0.08) {
    const pts = [[0, 0]];
    for (let i = 0; i <= 24; i++) {
      const a = au + (phi * i) / 24;
      pts.push([0.9 * Math.cos(a), 0.9 * Math.sin(a)]);
    }
    polygons.push({points: pts, tone: 3});
  }
  if (done) {
    // quadradinho do ângulo reto
    const e1 = [U[0] / Math.hypot(...U), U[1] / Math.hypot(...U)];
    const e2 = [-e1[1], e1[0]];
    const k = 0.45;
    polygons.push({points: [[0, 0], [e1[0] * k, e1[1] * k], [(e1[0] + e2[0]) * k, (e1[1] + e2[1]) * k], [e2[0] * k, e2[1] * k]], tone: 3});
  }

  const segments = [
    {from: [0, 0], to: U, tone: 1, arrow: true},
    {from: [0, 0], to: final, tone: 2, arrow: true},
  ];
  const labels = [{at: U, math: '\\vec{u} = (2,\\ 3)', tone: 1, dx: 46, dy: -4}];
  if (done) labels.push({at: final, math: '(-3,\\ 2)', tone: 2, dx: -10, dy: -18});
  if (contra && done) {
    segments.push({from: [0, 0], to: [-2, 3], tone: 3, arrow: true, dashed: true});
    labels.push({at: [-2, 3], math: '(-2,\\ 3)', tone: 3, dx: 0, dy: -18});
  }

  return (
    <div className={shared.wrapper} data-explorer="perp-turn">
      <div ref={ref}>
        <CartesianPlane
          xMin={-4}
          xMax={4}
          yMin={-1}
          yMax={4}
          xUnit={40}
          axisLabels={['x', 'y']}
          polygons={polygons}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'A seta azul é u = (2, 3). A laranja começa em cima dela e gira um quarto de volta. O painel acompanha o produto escalar das duas: ele cai até zero no momento em que o ângulo fica reto.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          {done ? (
            <Formula math="(2,\ 3) \cdot (-3,\ 2) = 2 \times (-3) + 3 \times 2 = -6 + 6 = 0" />
          ) : (
            <Formula math={`(2,\\ 3) \\cdot (${sgn(w[0])};\\ ${sgn(w[1])}) \\approx 2 \\times ${par(w[0])} + 3 \\times ${par(w[1])} \\approx ${sgn(dot)}`} />
          )}
        </p>
        {contra && done && (
          <p className={shared.formula}>
            Contraexemplo: <Formula math="(2,\ 3) \cdot (-2,\ 3) = -4 + 9 = 5" />. Trocar só um sinal não produz ângulo reto.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o giro de novo
        </button>
        <button type="button" onClick={() => setContra(!contra)} disabled={playing} aria-pressed={contra}>
          {contra ? 'Esconder o contraexemplo' : 'Mostrar o contraexemplo (−2, 3)'}
        </button>
      </div>
    </div>
  );
}
