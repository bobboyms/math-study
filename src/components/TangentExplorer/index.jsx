import React, {useState} from 'react';
import katex from 'katex';
import CartesianPlane from '../CartesianPlane';
import macros from '@site/src/katexMacros';
import styles from './styles.module.css';

// Explorador da tangente: um controle deslizante para h desenha a secante
// entre (a, f(a)) e (a + h, f(a + h)) e escreve a inclinação dela, calculada
// dos valores da função — a figura não tem como discordar da conta.
//
// É interativo porque mexer em h É a ideia da lição de derivada: ver a secante
// girar e a inclinação se aproximar de um número enquanto h encolhe. Uma figura
// que só ilustrasse seria um CartesianPlane estático.
//
// O desenho reaproveita o CartesianPlane, e por isso herda os três tons, os
// rótulos em KaTeX e o tema escuro sem código novo. O JSXGraph, usado no
// FunctionGraph, ficou de fora de propósito: ele desenha com cor fixa e fonte
// de interface, e a figura destoaria das fórmulas ao redor.

function Formula({math, display = false}) {
  return (
    <span
      className={display ? styles.displayFormula : styles.inlineFormula}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(math, {
          displayMode: display,
          throwOnError: false,
          macros: {...macros},
        }),
      }}
    />
  );
}

// Número em português dentro de uma fórmula: vírgula decimal protegida com
// {,} e sinal de menos do próprio KaTeX.
function num(value, digits) {
  const fixed = Number(value).toFixed(digits);
  const trimmed = digits > 0 ? fixed.replace(/\.?0+$/, '') : fixed;
  return trimmed.replace('.', '{,}');
}

export default function TangentExplorer({
  f,
  a = 2,
  hMin = -1.5,
  hMax = 2,
  hStep = 0.05,
  hInitial,
  expression = 'f(x)',
  digits = 3,
  showTangent = true,
  xMin = -1,
  xMax = 5,
  yMin = -1,
  yMax = 17,
  xUnit = 58,
  yUnit = 17,
  yStep = 2,
  axisLabels = ['x', 'y'],
  caption,
}) {
  const start = hInitial ?? Math.min(1, hMax);
  const [h, setH] = useState(start);

  const fa = f(a);
  const isZero = Math.abs(h) < 1e-9;
  const fb = f(a + h);
  const slope = isZero ? null : (fb - fa) / h;

  // Inclinação da tangente por diferença central — só para desenhar a reta
  // tracejada; a lição deduz o valor exato, e os dois têm que bater.
  const eps = 1e-5;
  const tangentSlope = (f(a + eps) - f(a - eps)) / (2 * eps);

  const points = [{at: [a, fa], label: 'A', tone: 3, dx: -18, dy: 6}];
  const lines = [];
  const segments = [];
  const labels = [];

  if (showTangent) {
    lines.push({m: tangentSlope, n: fa - tangentSlope * a, dashed: true, tone: 3});
  }

  if (!isZero) {
    points.push({at: [a + h, fb], label: 'B', tone: 2, dx: 18, dy: -6});
    lines.push({through: [[a, fa], [a + h, fb]], tone: 2});
    segments.push({from: [a, fa], to: [a + h, fa], dashed: true, tone: 2});
    segments.push({from: [a + h, fa], to: [a + h, fb], dashed: true, tone: 2});
    labels.push({
      at: [a + h / 2, fa],
      math: 'h',
      tone: 2,
      dy: h > 0 ? 16 : 16,
    });
  }

  const readout = isZero
    ? null
    : `\\frac{f(a+h)-f(a)}{h}=\\frac{${num(fb, digits)}-${num(fa, digits)}}{${num(h, 2)}}=${num(slope, digits)}`;

  return (
    <div className={styles.wrapper}>
      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnit={xUnit}
        yUnit={yUnit}
        yStep={yStep}
        functions={[{f, tone: 1}]}
        lines={lines}
        segments={segments}
        points={points}
        labels={labels}
        axisLabels={axisLabels}
      />

      <div className={styles.readout} aria-live="polite">
        <div className={styles.readoutLine}>
          <Formula math={`${expression},\\qquad a=${num(a, 2)},\\qquad h=${num(h, 2)}`} />
        </div>
        {isZero ? (
          <p className={styles.warning}>
            Com <Formula math="h=0" /> os dois pontos coincidem e a divisão por{' '}
            <Formula math="h" /> não existe. A reta tracejada é o que sobra: a
            posição de que as secantes se aproximam.
          </p>
        ) : (
          <div className={styles.readoutLine}>
            <Formula math={readout} display />
          </div>
        )}
      </div>

      <label className={styles.control}>
        <span className={styles.controlLabel}>
          <Formula math={`h=${num(h, 2)}`} />
        </span>
        <span className={styles.controlHint}>
          Arraste para aproximar o ponto B do ponto A.
        </span>
        <input
          type="range"
          min={hMin}
          max={hMax}
          step={hStep}
          value={h}
          onChange={(event) => setH(Number(event.target.value))}
          aria-label="Valor de h"
        />
      </label>

      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
}
