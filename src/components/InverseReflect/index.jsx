import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O gráfico da inversa nasce do trecho guardado, dobrado sobre a reta y = x.
//
// A animação leva cada ponto (x, y) do trecho guardado até (y, x) em linha
// reta. O caminho de cada ponto é perpendicular à reta y = x e o meio dele cai
// sobre ela: é exatamente o reflexo. O trecho original fica tracejado no lugar,
// e um ponto marcado mostra as coordenadas trocando de lugar. Na tangente, as
// assíntotas verticais x = ±π/2 viram as horizontais y = ±π/2.
//
// `fn` é 'sen', 'cos' ou 'tg'. Com `choices`, aparecem botões para trocar.

const PI = Math.PI;
const DURATION = 3.4;

const CONF = {
  sen: {
    f: Math.sin,
    domain: [-PI / 2, PI / 2],
    win: [-2.05, 2.05, -2.05, 2.05],
    unit: 78,
    ticks: [
      {at: -PI / 2, label: '-\\frac{\\pi}{2}'},
      {at: -1, label: '-1'},
      {at: 1, label: '1'},
      {at: PI / 2, label: '\\frac{\\pi}{2}'},
    ],
    mark: [PI / 2, 1],
    markTex: '\\left(\\tfrac{\\pi}{2},\\ 1\\right)',
    imageTex: '\\left(1,\\ \\tfrac{\\pi}{2}\\right)',
    markOffset: {dx: 18, dy: 22},
    imageOffset: {dx: -44, dy: 6},
    name: '\\sen x',
    inverse: '\\arcsen x',
    nameAt: [-1.3, -0.6],
    inverseAt: [0.5, 1.88],
    yxAt: [1.88, 1.5],
    button: 'arcsen',
  },
  cos: {
    f: Math.cos,
    domain: [0, PI],
    win: [-1.55, 3.55, -1.55, 3.55],
    unit: 64,
    ticks: [
      {at: -1, label: '-1'},
      {at: 1, label: '1'},
      {at: PI / 2, label: '\\frac{\\pi}{2}'},
      {at: PI, label: '\\pi'},
    ],
    mark: [PI / 3, 0.5],
    markTex: '\\left(\\tfrac{\\pi}{3};\\ 0{,}5\\right)',
    imageTex: '\\left(0{,}5;\\ \\tfrac{\\pi}{3}\\right)',
    markOffset: {dx: 44, dy: -14},
    imageOffset: {dx: -48, dy: -4},
    name: '\\cos x',
    inverse: '\\arccos x',
    nameAt: [2.95, -0.62],
    inverseAt: [-1.0, 3.42],
    yxAt: [3.2, 2.75],
    button: 'arccos',
  },
  tg: {
    f: Math.tan,
    domain: [-Math.atan(7), Math.atan(7)],
    win: [-4.4, 4.4, -4.4, 4.4],
    unit: 37,
    ticks: [
      {at: -3, label: '-3'},
      {at: 3, label: '3'},
    ],
    mark: [PI / 3, Math.sqrt(3)],
    markTex: '\\left(\\tfrac{\\pi}{3},\\ \\sqrt{3}\\right)',
    imageTex: '\\left(\\sqrt{3},\\ \\tfrac{\\pi}{3}\\right)',
    markOffset: {dx: -46, dy: -18},
    imageOffset: {dx: 30, dy: 20},
    name: '\\tg x',
    inverse: '\\arctg x',
    nameAt: [1.95, 3.9],
    inverseAt: [3.3, 2.1],
    yxAt: [3.9, 3.3],
    asymptotes: true,
    button: 'arctg',
  },
};

const fold = ([x, y], s) => [(1 - s) * x + s * y, (1 - s) * y + s * x];

export default function InverseReflect({fn = 'sen', choices, caption}) {
  const [current, setCurrent] = useState(fn);
  const c = CONF[current];
  const {ref, t, play} = useAnimation({duration: DURATION});
  const s = stage(t, 0.5, 3.0);

  const [a, b] = c.domain;
  const N = 180;
  const curve = [];
  for (let i = 0; i <= N; i += 1) {
    const x = a + ((b - a) * i) / N;
    curve.push(fold([x, c.f(x)], s));
  }
  // O polígono do CartesianPlane sempre se fecha. Percorrer a curva e voltar
  // por ela mesma desenha uma linha aberta.
  const moving = [...curve, ...curve.slice().reverse()];

  const [xMin, xMax, yMin, yMax] = c.win;
  const segments = [];
  if (c.asymptotes) {
    [-PI / 2, PI / 2].forEach((x0) => {
      segments.push({from: [x0, yMin - 1], to: [x0, yMax + 1], muted: true, dashed: true});
      if (s > 0.02) {
        segments.push({from: fold([x0, yMin - 1], s), to: fold([x0, yMax + 1], s), tone: 1, dashed: true});
      }
    });
  }

  const markNow = fold(c.mark, s);
  const done = s > 0.999;

  return (
    <div className={shared.wrapper} data-explorer={`inverse-reflect-${current}`}>
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={c.unit}
          xStep={current === 'tg' ? 1 : 0.5}
          yStep={current === 'tg' ? 1 : 0.5}
          xTicks={c.ticks}
          yTicks={c.ticks}
          lines={[{m: 1, n: 0, muted: true, dashed: true}]}
          functions={[{f: c.f, domain: c.domain, tone: 0, dashed: true}]}
          polygons={[{points: moving, tone: 1, fill: false}]}
          segments={segments}
          points={[
            {at: c.mark, tone: 2, label: c.markTex, ...c.markOffset},
            {at: markNow, tone: 1, label: done ? c.imageTex : null, ...c.imageOffset},
          ]}
          labels={[
            {at: c.nameAt, math: c.name},
            ...(done ? [{at: c.inverseAt, math: c.inverse, tone: 1}] : []),
            // As assíntotas ganham nome escrito, em vez de um número de eixo
            // que ficaria embaixo da linha tracejada.
            ...(c.asymptotes
              ? [
                  {at: [-PI / 2, yMax - 0.3], math: 'x = -\\frac{\\pi}{2}', anchor: 'end', dx: -6, fontSize: 13},
                  ...(done ? [{at: [xMin + 0.1, PI / 2], math: 'y = \\frac{\\pi}{2}', tone: 1, anchor: 'start', dy: -16, fontSize: 13}] : []),
                ]
              : []),
            {at: c.yxAt, math: 'y = x', fontSize: 13},
          ]}
          caption={caption}
        />
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          O ponto <Formula math={c.markTex} /> do gráfico de <Formula math={c.name} /> vira o ponto{' '}
          <Formula math={c.imageTex} /> do gráfico de <Formula math={c.inverse} />: as duas coordenadas trocam de
          lugar. Cada ponto viaja em linha reta, cruzando a reta <Formula math="y = x" /> em ângulo reto, até o
          outro lado.
        </p>
        {c.asymptotes && (
          <p>
            As retas verticais <Formula math="x = \pm\frac{\pi}{2}" />, de que a tangente se aproxima sem tocar,
            viram as retas horizontais <Formula math="y = \pm\frac{\pi}{2}" />, de que o arctg se aproxima sem tocar.
          </p>
        )}
      </div>

      <div className={shared.buttons}>
        {choices &&
          choices.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={k === current}
              style={k === current ? {borderColor: 'var(--mv-tone-1)', fontWeight: 600} : undefined}
              onClick={() => {
                setCurrent(k);
                play();
              }}
            >
              {CONF[k].button}
            </button>
          ))}
        <button type="button" onClick={() => play()}>
          Ver o reflexo de novo
        </button>
      </div>
    </div>
  );
}
