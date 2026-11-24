import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';

// A maré do porto: tábua com maré alta de 4,2 m às 5 h, baixa de 0,8 m e
// ciclo de 12 h.
//
// mode="question": só o seno básico, sen t (t em horas), e as marcas da
// tábua. É o problema motivador: nenhum dos três números do seno básico serve.
//
// mode="fit" (padrão): os quatro ajustes acontecem um de cada vez, na ordem
// d, a, b, c, e a curva termina sobre as marcas da tábua. O parâmetro s, de 0
// a 4, diz quantos ajustes já foram feitos (fracionário no meio de um).
// Os botões repetem um ajuste por vez.

const PI = Math.PI;
const STEPS = [
  {key: 'd', from: 0, to: 2.5},
  {key: 'a', from: 1, to: 1.7},
  {key: 'b', from: 1, to: PI / 6},
  {key: 'c', from: 0, to: -PI / 3},
];

function paramsAt(s) {
  const p = {a: 1, b: 1, c: 0, d: 0};
  STEPS.forEach((step, i) => {
    const local = Math.min(1, Math.max(0, s - i));
    p[step.key] = step.from + ease(local) * (step.to - step.from);
  });
  return p;
}

const TEXTS = [
  'Seno básico, sen t: oscila entre −1 e 1, tem o máximo em t ≈ 1,57 h e repete a cada 2π ≈ 6,28 h. A tábua pede outra coisa: entre 0,8 e 4,2 m, máximo às 5 h, repetição a cada 12 h.',
  'Ajuste 1, somar d = 2,5: a curva subiu e a linha central agora é o nível médio, 2,5 m. Os extremos ainda estão errados: 3,5 e 1,5.',
  'Ajuste 2, multiplicar por a = 1,7: a curva vai de 0,8 a 4,2 m, como a tábua. Mas ela ainda repete a cada 6,28 h, e o máximo cai em t ≈ 1,57 h.',
  'Ajuste 3, b = π/6: uma onda passa a levar 2π ÷ (π/6) = 12 h. Falta o horário: o máximo está às 3 h, e a tábua diz 5 h.',
  'Ajuste 4, c = −π/3: a curva andou −c/b = 2 h para a direita. O máximo cai às 5 h e às 17 h, e o mínimo às 11 h e às 23 h, sobre as marcas da tábua.',
];

const FORMULAS = [
  'h(t) = \\sen t',
  'h(t) = 2{,}5 + \\sen t',
  'h(t) = 2{,}5 + 1{,}7\\sen t',
  'h(t) = 2{,}5 + 1{,}7\\sen\\!\\left(\\frac{\\pi}{6}t\\right)',
  'h(t) = 2{,}5 + 1{,}7\\sen\\!\\left(\\frac{\\pi}{6}t - \\frac{\\pi}{3}\\right)',
];

const BUTTONS = ['Seno básico', '1. Subir (d)', '2. Esticar (a)', '3. Alargar (b)', '4. Deslocar (c)'];

export default function TideFit({mode = 'fit', caption}) {
  const question = mode === 'question';
  const [range, setRange] = useState({from: 0, to: question ? 0 : 4});
  const {ref, t, total, play, playing} = useAnimation({duration: 5.5, autoplay: !question});
  const progress = playing ? Math.min(1, t / total) : 1;
  const s = range.from + (range.to - range.from) * progress;
  const p = paramsAt(s);
  const h = (x) => p.d + p.a * Math.sin(p.b * x + p.c);
  const done = Math.round(range.to);
  const shownStep = playing ? Math.floor(s + 1e-6) : done;

  // Primeiro máximo da curva atual com t ≥ 0
  let tMax = (PI / 2 - p.c) / p.b;
  const period = (2 * PI) / p.b;
  while (tMax < 0) tMax += period;

  const target = [
    {m: 0, n: 4.2, muted: true, dashed: true},
    {m: 0, n: 0.8, muted: true, dashed: true},
  ];

  const points = [
    {at: [5, 4.2], tone: 3, r: 6, open: true},
    {at: [17, 4.2], tone: 3, r: 6, open: true},
  ];
  if (!question) points.push({at: [tMax, p.d + p.a], tone: 1, r: 4.5});

  const labels = [
    {at: [24.4, 4.2], math: '4{,}2', tone: 3, anchor: 'end', dy: -13, fontSize: 13},
    {at: [24.4, 0.8], math: '0{,}8', tone: 3, anchor: 'end', dy: 14, fontSize: 13},
    {at: [11, 4.75], math: '12\\text{ h}', tone: 3, dy: -13, fontSize: 13},
  ];

  // A linha tracejada de t = 5 até a marca diz "às 5 h" sem rótulo: um rótulo
  // ali ficaria no caminho da curva nos quadros do meio da animação.
  const segments = [
    {from: [5, 0], to: [5, 4.2], muted: true, dashed: true},
    {from: [11, 4.75], to: [5, 4.75], tone: 3, arrow: true},
    {from: [11, 4.75], to: [17, 4.75], tone: 3, arrow: true},
  ];

  const go = (k) => {
    if (k === 0) {
      setRange({from: 0, to: 0});
      return;
    }
    setRange({from: k - 1, to: k});
    play({duration: 1.6});
  };

  return (
    <div className={shared.wrapper} data-explorer="tide-fit">
      {!question && (
        <div className={shared.formula}>
          <Formula math={FORMULAS[shownStep]} />
        </div>
      )}
      <div ref={ref}>
        <CartesianPlane
          xMin={-0.1}
          xMax={24.6}
          yMin={-1.5}
          yMax={5.4}
          xUnit={16}
          yUnit={34}
          xStep={1}
          yStep={1}
          xTicks={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map((v) => ({at: v, label: String(v)}))}
          yTicks={[-1, 1, 2, 3, 4, 5].map((v) => ({at: v, label: String(v)}))}
          functions={[{f: h, tone: 1}]}
          lines={target}
          points={points}
          segments={segments}
          labels={labels}
          axisLabels={['t', 'h']}
          caption={
            caption ??
            (question
              ? 'Em azul, o seno básico sen t, com t em horas. As marcas verdes são o que a tábua de marés informa: máximo de 4,2 m às 5 h, repetido 12 h depois, e mínimo de 0,8 m.'
              : 'A curva azul recebe os quatro ajustes, um de cada vez, até passar pelas marcas verdes da tábua. O ponto azul cheio é o primeiro máximo da curva.')
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>{question ? TEXTS[0] : TEXTS[shownStep]}</p>
      </div>
      {!question && (
        <div className={shared.buttons}>
          {BUTTONS.map((label, k) => (
            <button key={label} type="button" onClick={() => go(k)} disabled={playing}>
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setRange({from: 0, to: 4});
              play();
            }}
          >
            Ver os quatro ajustes de novo
          </button>
        </div>
      )}
    </div>
  );
}
