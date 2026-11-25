import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage, fmt} from '../mathviz/useAnimation';

// O produto escalar não muda quando os dois vetores giram juntos (lição 7.31,
// Produto escalar).
//
// u tem tamanho 4 e faz 65° com o eixo x; v tem tamanho 5 e faz 20°. Na
// animação, as duas setas giram juntas 20° no sentido horário: as
// coordenadas mudam o tempo todo, mas a conta "par com par, depois soma"
// fica parada em 14,14. No fim, v está deitado no eixo x, e a conta fica
// curta: a sombra de u no eixo (4 cos 45°) vezes o tamanho de v.
//
// Depois, quatro controles mudam os tamanhos e os ângulos com o eixo. O
// painel faz as duas contas lado a lado: pelas coordenadas e por
// tamanho × tamanho × cosseno do ângulo entre as setas.

const START = {a: 4, b: 5, alpha: 65, beta: 20};
const DURATION = 3.4;
const rad = (d) => (d * Math.PI) / 180;
const comma = (v, d) => fmt(v, d).replace(',', '{,}');
const sgn = (v, d = 2) => (v < -0.005 ? `-${comma(-v, d)}` : comma(Math.abs(v), d));
const par = (v, d = 2) => (v < -0.005 ? `(${sgn(v, d)})` : sgn(v, d));

function wedge(a1, a2, r) {
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const pts = [[0, 0]];
  for (let i = 0; i <= 28; i++) {
    const a = a1 + (d * i) / 28;
    pts.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  return {pts, mid: a1 + d / 2, size: Math.abs(d)};
}

export default function DotRotateInvariant({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const [manual, setManual] = useState(null);

  const rot = -START.beta * stage(t, 0.5, 3.0);
  const cur = manual ?? {...START, alpha: START.alpha + rot, beta: START.beta + rot};
  const {a, b, alpha, beta} = cur;

  const u = [a * Math.cos(rad(alpha)), a * Math.sin(rad(alpha))];
  const v = [b * Math.cos(rad(beta)), b * Math.sin(rad(beta))];
  const dot = u[0] * v[0] + u[1] * v[1];
  const w = wedge(rad(alpha), rad(beta), 1);
  const thetaDeg = (w.size * 180) / Math.PI;
  const flat = Math.abs(((beta % 360) + 360) % 360) < 0.01 || Math.abs((((beta % 360) + 360) % 360) - 360) < 0.01;

  const polygons = [{points: w.pts, tone: 3}];
  const segments = [
    {from: [0, 0], to: u, tone: 2, arrow: true},
    {from: [0, 0], to: v, tone: 1, arrow: true},
  ];
  const labels = [];
  if (thetaDeg > 14) {
    labels.push({at: [1.6 * Math.cos(w.mid), 1.6 * Math.sin(w.mid)], math: '\\theta', tone: 3});
  }
  const off = (p, d = 22) => {
    const n = Math.hypot(p[0], p[1]) || 1;
    return {dx: (p[0] / n) * d, dy: -(p[1] / n) * d};
  };
  labels.push({at: u, math: '\\vec{u}', tone: 2, ...off(u)});
  labels.push({at: v, math: '\\vec{v}', tone: 1, ...off(v)});
  if (flat) {
    segments.push({from: u, to: [u[0], 0], tone: 3, dashed: true});
    segments.push({from: [0, 0], to: [u[0], 0], tone: 3});
    labels.push({at: [u[0] / 2, 0], math: `${a}\\cos ${comma(thetaDeg, 0)}^\\circ`, dy: 22, tone: 3});
  }

  const touch = (patch) => setManual({...cur, ...patch});

  const control = (key, label, min, max) => (
    <label className={shared.control} key={key}>
      <span>
        {label}: {fmt(cur[key], 0)}
        {key === 'alpha' || key === 'beta' ? '°' : ''}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={Math.round(cur[key])}
        disabled={playing}
        onChange={(e) => touch({[key]: Number(e.target.value)})}
        aria-label={label}
      />
    </label>
  );

  return (
    <div className={shared.wrapper} data-explorer="dot-rotate">
      <div ref={ref}>
        <CartesianPlane
          xMin={-5.5}
          xMax={5.5}
          yMin={-5.5}
          yMax={5.5}
          xUnit={30}
          showNumbers={false}
          axisLabels={['x', 'y']}
          polygons={polygons}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'As duas setas giram juntas, e a abertura θ entre elas não muda. As coordenadas mudam, mas a conta das coordenadas (no painel) dá sempre o mesmo número. No fim, v fica deitado no eixo x, e o tracejado verde mostra a sombra de u nesse eixo.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\vec{u} \\approx (${sgn(u[0])};\\ ${sgn(u[1])}), \\quad \\vec{v} \\approx (${sgn(v[0])};\\ ${sgn(v[1])})`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\text{coordenadas: } ${par(u[0])} \\times ${par(v[0])} + ${par(u[1])} \\times ${par(v[1])} \\approx ${sgn(dot)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\text{tamanhos e ângulo: } ${a} \\times ${b} \\times \\cos ${comma(thetaDeg, 0)}^\\circ \\approx ${sgn(a * b * Math.cos(w.size))}`}
          />
        </p>
      </div>
      <div className={shared.controls}>
        {control('a', 'Tamanho de u', 1, 5)}
        {control('alpha', 'Ângulo de u com o eixo x', 0, 359)}
        {control('b', 'Tamanho de v', 1, 5)}
        {control('beta', 'Ângulo de v com o eixo x', 0, 359)}
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setManual(null);
            play();
          }}
        >
          Ver as setas girarem juntas de novo
        </button>
      </div>
    </div>
  );
}
