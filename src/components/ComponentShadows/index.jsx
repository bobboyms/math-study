import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {wedge, polar, dec, decText, pairTex} from '../mathviz/vectorArc';

// As componentes de um vetor como sombras nos eixos (lição 7.30).
//
// A seta azul tem tamanho r e ângulo θ. Linhas cinza tracejadas descem da
// ponta até os dois eixos. Sobre o eixo x fica a sombra horizontal, r cos θ
// (laranja), e sobre o eixo y a vertical, r sen θ (verde). Cada sombra é uma
// seta que sai da origem: quando aponta para a esquerda ou para baixo, o
// número é negativo.
//
// Com `triangle`, a figura desenha também o triângulo retângulo sob a seta,
// com o ângulo de referência na origem e os catetos rotulados pelo tamanho,
// sempre positivo. O painel compara o triângulo (tamanhos) com a fórmula
// (tamanhos com sinal).

const PRESETS_DEFAULT = [
  {r: 5, deg: 150},
  {r: 5, deg: 30},
  {r: 4, deg: 240},
  {r: 4, deg: 315},
];

const refAngle = (deg) => {
  const d = ((deg % 360) + 360) % 360;
  if (d <= 90) return d;
  if (d <= 180) return 180 - d;
  if (d <= 270) return d - 180;
  return 360 - d;
};

const sideFrom = (deg) => {
  const d = ((deg % 360) + 360) % 360;
  return d > 90 && d < 270 ? 180 : d > 270 ? 360 : 0;
};

export default function ComponentShadows({initialR = 5, initialAngle = 150, triangle = false, presets = PRESETS_DEFAULT, caption}) {
  const [r, setR] = useState(initialR);
  const [theta, setTheta] = useState(initialAngle);

  const c = Math.cos((theta * Math.PI) / 180);
  const s = Math.sin((theta * Math.PI) / 180);
  const a = r * c;
  const b = r * s;
  const tip = [a, b];
  const near = (v) => Math.abs(v) < 0.05;

  const segments = [];
  const labels = [];
  const polygons = [];

  if (!triangle && theta > 0.5) polygons.push(wedge(1, 0, theta, 0));

  // Linhas de projeção.
  if (!near(b)) segments.push({from: tip, to: [a, 0], muted: true, dashed: true});
  if (!near(a) && !triangle) segments.push({from: tip, to: [0, b], muted: true, dashed: true});

  // Sombras com sinal (setas sobre os eixos).
  if (!near(a)) segments.push({from: [0, 0], to: [a, 0], tone: 2, arrow: true});
  if (!near(b) && !triangle) segments.push({from: [0, 0], to: [0, b], tone: 3, arrow: true});
  if (!near(b) && triangle) segments.push({from: [a, 0], to: tip, tone: 3, arrow: true});

  segments.push({from: [0, 0], to: tip, tone: 1, arrow: true});

  if (!near(a)) {
    labels.push({
      at: [a / 2, 0],
      math: triangle ? dec(Math.abs(a), 2) : `r\\cos\\theta = ${dec(a, 2)}`,
      dy: b >= 0 ? 20 : -14,
      tone: 2,
    });
  }
  if (!near(b)) {
    if (triangle) {
      labels.push({at: [a, b / 2], math: dec(Math.abs(b), 2), dx: a >= 0 ? 28 : -28, tone: 3});
    } else {
      labels.push({at: [0, b], math: `r\\sen\\theta = ${dec(b, 2)}`, dx: a >= 0 ? -10 : 10, dy: b >= 0 ? -14 : 14, anchor: a >= 0 ? 'end' : 'start', tone: 3});
    }
  }
  labels.push({at: tip, math: '\\vec{v}', dx: a >= 0 ? 14 : -14, dy: b >= 0 ? -14 : 16, tone: 1});

  const ref = refAngle(theta);
  if (triangle && ref > 1 && ref < 89) {
    const from = sideFrom(theta);
    polygons.push(wedge(1.4, from, theta, 2));
    // Rótulo dentro do triângulo, além da cunha e abaixo da seta.
    const m = polar(2.5, from + (theta - from) * 0.35);
    labels.push({at: m, math: `${dec(ref, 0)}^\\circ`, tone: 2});
  } else if (!triangle && theta > 6) {
    const m = polar(1, theta / 2);
    labels.push({at: m, math: '\\theta', dx: m[0] >= 0 ? 10 : -10, dy: m[1] >= 0 ? -8 : 10});
  }

  return (
    <div className={shared.wrapper} data-explorer="component-shadows">
      <CartesianPlane
        xMin={-6.5}
        xMax={6.5}
        yMin={-6.5}
        yMax={6.5}
        xUnit={26}
        showNumbers={false}
        axisLabels={['x', 'y']}
        segments={segments}
        labels={labels}
        polygons={polygons}
        caption={
          caption ??
          (triangle
            ? 'O triângulo retângulo sob a seta tem o ângulo de referência na origem (laranja) e catetos com os tamanhos das componentes. Os lados do triângulo não têm sinal; o sinal vem do lado para onde cada componente aponta.'
            : 'As linhas cinza descem da ponta da seta até os eixos. A sombra no eixo x (laranja) é r cos θ, e a sombra no eixo y (verde) é r sen θ. Sombra para a esquerda ou para baixo é número negativo.')
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`${dec(r, 1)}(\\cos ${dec(theta, 0)}^\\circ,\\ \\sen ${dec(theta, 0)}^\\circ) = ${dec(r, 1)} \\times ${pairTex(c, s, 3)} = ${pairTex(a, b, 2)}`}
          />
        </p>
        {triangle && (
          <p>
            O triângulo dá só os tamanhos: catetos <Formula math={`${dec(r, 1)}\\cos ${dec(ref, 0)}^\\circ = ${dec(Math.abs(a), 2)}`} /> e{' '}
            <Formula math={`${dec(r, 1)}\\sen ${dec(ref, 0)}^\\circ = ${dec(Math.abs(b), 2)}`} />. Os sinais das componentes
            são {a < -0.005 ? 'menos' : 'mais'} na horizontal e {b < -0.005 ? 'menos' : 'mais'} na vertical, e quem
            usa o triângulo precisa descobri-los olhando o desenho. A fórmula do ciclo já traz os dois.
          </p>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo θ: {decText(theta, 0)}°</span>
          <input type="range" min={0} max={355} step={5} value={theta} onChange={(e) => setTheta(Number(e.target.value))} aria-label="Ângulo do vetor, em graus" />
        </label>
        <label className={shared.control}>
          <span>Tamanho r: {decText(r, 1)}</span>
          <input type="range" min={1} max={6} step={0.5} value={r} onChange={(e) => setR(Number(e.target.value))} aria-label="Tamanho do vetor" />
        </label>
      </div>
      <div className={shared.buttons}>
        {presets.map((p) => (
          <button
            key={`${p.r}-${p.deg}`}
            type="button"
            aria-pressed={p.r === r && p.deg === theta}
            onClick={() => {
              setR(p.r);
              setTheta(p.deg);
            }}
          >
            {decText(p.r, 0)} a {p.deg}°
          </button>
        ))}
      </div>
    </div>
  );
}
