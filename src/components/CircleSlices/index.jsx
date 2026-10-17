import React, {useState} from 'react';
import GeoFigure from '../GeoFigure';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';

// O círculo cortado em n fatias iguais e remontado com as fatias alternadas,
// uma de ponta para cima, outra de ponta para baixo. Cada fatia é um setor de
// verdade, com a borda curva: a figura não esconde o serrilhado.
//
// É interativo porque aumentar n É a ideia da dedução de A = πr²: a área nunca
// muda (são sempre as mesmas fatias), mas a figura fica cada vez mais parecida
// com o retângulo de base πr e altura r, desenhado tracejado por cima.
//
// Geometria da montagem, com α = 360°/n e r o raio:
// - fatia de ponta para cima: vértice em (x, r), arco embaixo, tocando y = 0;
// - fatia de ponta para baixo: vértice em (x, y0), com y0 = r − r·cos(α/2),
//   que é a altura em que terminam os raios das fatias vizinhas;
// - meia largura da corda: w = r·sen(α/2). As pontas se alternam a cada w.

const R = 2;
const RADIUS_CM = 10;

const fmt = (value, digits) => Number(value).toFixed(digits).replace('.', ',');

export default function CircleSlices({initialSlices = 12, min = 4, max = 60}) {
  const [n, setN] = useState(initialSlices);

  const half = Math.PI / n;
  const halfDeg = 180 / n;
  const w = R * Math.sin(half);
  const y0 = R - R * Math.cos(half);

  const arcs = [];
  for (let j = 0; j < n / 2; j += 1) {
    arcs.push({
      at: [w + 2 * w * j, R],
      r: R,
      from: 270 - halfDeg,
      to: 270 + halfDeg,
      sector: true,
      tone: 1,
    });
    arcs.push({
      at: [2 * w * (j + 1), y0],
      r: R,
      from: 90 - halfDeg,
      to: 90 + halfDeg,
      sector: true,
      tone: 2,
    });
  }

  // Retângulo de referência: base πr, altura r, centrado na figura.
  const x1 = w / 2;
  const x2 = x1 + Math.PI * R;
  const yb = y0 / 2;
  const yt = yb + R;

  // Os números do painel usam um raio de 10 cm, para dar ordem de grandeza.
  const scale = RADIUS_CM / R;
  const tooth = y0 * scale;
  const slant = w * scale;

  return (
    <div className={shared.wrapper} data-explorer="circle-slices">
      <GeoFigure
        unit={52}
        padding={36}
        bounds={[0, -0.25, 3.75 * R, 1.35 * R]}
        arcs={arcs}
        segments={[
          [[x1, yb], [x2, yb]],
          [[x2, yb], [x2, yt]],
          [[x2, yt], [x1, yt]],
          [[x1, yt], [x1, yb]],
        ].map(([from, to]) => ({from, to, tone: 3, dashed: true}))}
        dims={[
          {from: [x1, yb], to: [x2, yb], label: '\\pi r', offset: 22, tone: 3},
          {from: [x2, yb], to: [x2, yt], label: 'r', offset: 22, tone: 3},
        ]}
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <strong>{n} fatias</strong>: {n / 2} com a ponta para cima e {n / 2} com a
          ponta para baixo. As bordas curvas de cada lado somam meia volta. Por
          isso, cada lado mede <Formula math="\pi r" />, metade de{' '}
          <Formula math="2\pi r" />.
        </p>
        <p>
          Num círculo de raio 10 cm, cada dente do serrilhado tem{' '}
          <strong>{fmt(tooth, tooth < 0.1 ? 3 : 2)} cm</strong> de altura, e a
          lateral inclinada avança <strong>{fmt(slant, 2)} cm</strong> em relação
          ao retângulo tracejado.
        </p>
        <p>
          A área não muda com o número de fatias: as peças são sempre as do mesmo
          círculo, <Formula math="\pi \times 10^2 \approx 314{,}16\ \text{cm}^2" />.
          O que muda é a diferença entre a figura e o retângulo.
        </p>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Número de fatias: {n}</span>
          <span className={shared.hint}>
            Arraste para a direita e acompanhe o serrilhado e a lateral inclinada.
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={2}
            value={n}
            onChange={(event) => setN(Number(event.target.value))}
            aria-label="Número de fatias"
            aria-valuetext={`${n} fatias`}
          />
        </label>
      </div>
    </div>
  );
}
