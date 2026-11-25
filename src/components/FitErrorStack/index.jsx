import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {AREAS, PRICES, errorsOf, tnum, lineTex, lineText} from '../FitLineExplorer/apartamentos';

// Somar os erros com sinal (lição 11.12).
//
// Cada erro é uma seta vertical verde, do preço previsto (na reta) até o
// preço observado: para cima quando o erro é positivo, para baixo quando é
// negativo. A animação leva as cinco setas, uma de cada vez, para uma coluna
// à direita, encostando cada uma na ponta da anterior, a partir do traço do
// zero. Onde a última termina é a soma dos erros. Com y = 350 as setas para
// baixo e para cima se cancelam e a fila volta ao zero, embora a reta seja
// ruim. Botões trocam a reta.

const LINES = [
  {m: 0, n: 350},
  {m: 10, n: -250},
  {m: 5, n: 50},
  {m: 5, n: 40},
];
const Y_MIN = 140;
const Y_MAX = 520;
const ZERO = 340;
const COL_X = 99;
const COL_GAP = 2.4;

// Trecho da reta entre x = 32 e x = 88 que cabe na janela.
function lineSegment(m, n) {
  let a = 32;
  let b = 88;
  if (Math.abs(m) > 1e-9) {
    const xa = (Y_MIN - n) / m;
    const xb = (Y_MAX - n) / m;
    a = Math.max(a, Math.min(xa, xb));
    b = Math.min(b, Math.max(xa, xb));
  }
  return [[a, m * a + n], [b, m * b + n]];
}

export default function FitErrorStack({initial = 0, lines = LINES, caption}) {
  const [idx, setIdx] = useState(initial);
  const {m, n} = lines[idx];
  const errs = errorsOf(m, n);
  const cum = errs.reduce((acc, e) => [...acc, acc[acc.length - 1] + e], [0]);
  const total = cum[cum.length - 1];

  const duration = 4.4;
  const {ref, t, play, playing} = useAnimation({duration});

  const segments = [{from: lineSegment(m, n)[0], to: lineSegment(m, n)[1], tone: 2}];
  segments.push({from: [COL_X - 4, ZERO], to: [COL_X + COL_GAP * 4 + 4, ZERO], muted: true});
  const labels = [
    {at: [COL_X - 4, ZERO], math: '0', dx: -8, anchor: 'end', fontSize: 13},
    {at: [COL_X + COL_GAP * 2, Y_MAX], math: '\\text{fila dos erros}', dy: 14, fontSize: 12},
  ];

  errs.forEach((e, i) => {
    if (Math.abs(e) < 0.5) return;
    const x = AREAS[i];
    const yp = m * x + n;
    const s = stage(t, 0.7 + 0.65 * i, 1.3 + 0.65 * i);
    const fromA = [x, yp];
    const toA = [x, PRICES[i]];
    const fromB = [COL_X + COL_GAP * i, ZERO + cum[i]];
    const toB = [COL_X + COL_GAP * i, ZERO + cum[i + 1]];
    const lerp = (p, q) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s];
    segments.push({from: lerp(fromA, fromB), to: lerp(toA, toB), tone: 3, arrow: true});
    // um tracejado fica no lugar de onde a seta saiu
    if (s > 0.02) segments.push({from: fromA, to: toA, tone: 3, dashed: true});
  });

  const done = t >= duration - 0.3;
  if (done) {
    labels.push({
      at: [COL_X + COL_GAP * 4, ZERO + total],
      math: `\\text{soma} = ${tnum(total)}`,
      tone: 3,
      dx: 10,
      dy: Math.abs(total) < 1e-9 ? 14 : 0,
      anchor: 'start',
      fontSize: 13,
    });
  }

  const points = AREAS.map((x, i) => ({at: [x, PRICES[i]], tone: 1, label: String(i + 1), dx: -12, dy: 4, fontSize: 12}));
  const sumTex = errs.map((e, i) => (i === 0 ? tnum(e) : e < 0 ? `(${tnum(e)})` : tnum(e))).join(' + ');

  return (
    <div className={shared.wrapper} data-explorer="fit-error-stack">
      <div ref={ref}>
        <CartesianPlane
          xMin={30}
          xMax={122}
          yMin={Y_MIN}
          yMax={Y_MAX}
          xUnit={6}
          yUnit={1.1}
          xStep={10}
          yStep={40}
          xTicks={[40, 50, 60, 70, 80].map((at) => ({at}))}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'Cada erro é uma seta verde, da reta até o ponto: para cima quando o apartamento custou mais que a previsão, para baixo quando custou menos. A animação encosta as setas uma na ponta da outra, a partir do zero, na coluna da direita. Onde a fila termina é a soma dos erros.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\text{reta } ${lineTex(m, n)}: \\quad \\text{soma dos erros} = ${sumTex} = ${tnum(total)}`} />
        </p>
      </div>
      <div className={shared.buttons}>
        {lines.map((l, j) => (
          <button
            key={`${l.m},${l.n}`}
            type="button"
            disabled={playing}
            aria-pressed={j === idx}
            onClick={() => {
              setIdx(j);
              play();
            }}
          >
            {lineText(l.m, l.n)}
          </button>
        ))}
        <button type="button" disabled={playing} onClick={() => play()}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
