import React from 'react';
import CartesianPlane from '../CartesianPlane';
import styles from './styles.module.css';

// Soma de Riemann: retângulos sobre o gráfico de f em [a, b], com a soma
// calculada a partir dos parâmetros e escrita na legenda — como o FactorTree
// faz com o número, a figura não tem como discordar da conta.
//
// Três tons: a curva (1), a parte de cada retângulo que fica abaixo da curva
// (2) e o excesso que passa por cima dela (3). Onde o retângulo fica todo sob
// a curva, sobra à mostra a faixa que ele deixou de cobrir — sem cor, porque
// não faz parte da soma.
//
// Estático de propósito: a lição compara valores de n em tabela, e o que
// ensina é a soma escrita ao lado de cada figura, não o gesto de arrastar.

const SAMPLES = 14;

function fmt(value, digits) {
  return Number(value)
    .toFixed(digits)
    .replace(/\.?0+$/, '')
    .replace('.', ',')
    .replace('-', '−');
}

const METHOD_LABEL = {
  left: 'pela esquerda',
  right: 'pela direita',
  mid: 'pelo ponto médio',
};

export default function RiemannSum({
  f,
  a = 0,
  b = 3,
  n = 10,
  method = 'left',
  digits = 3,
  showSum = true,
  showRectangles = true,
  xMin,
  xMax,
  yMin,
  yMax,
  xUnit = 58,
  yUnit,
  xStep,
  yStep,
  xLabelEvery,
  yLabelEvery,
  axisLabels = ['x', 'y'],
  functions = [],
  points = [],
  labels = [],
  caption,
}) {
  const width = (b - a) / n;
  const polygons = [];
  let sum = 0;

  for (let i = 0; i < n; i += 1) {
    const x0 = a + i * width;
    const x1 = x0 + width;
    const sample =
      method === 'right' ? x1 : method === 'mid' ? (x0 + x1) / 2 : x0;
    const height = f(sample);
    sum += height * width;

    if (!showRectangles) continue;

    // Amostra a curva dentro do retângulo para separar o que fica sob ela do
    // que passa por cima. Com altura negativa a lógica espelha: "sob a curva"
    // passa a ser entre o eixo e a curva, e o excesso é o que desce além dela.
    const xs = [];
    for (let k = 0; k <= SAMPLES; k += 1) {
      xs.push(x0 + (width * k) / SAMPLES);
    }
    const sign = height >= 0 ? 1 : -1;
    const clamp = (y) => sign * Math.min(sign * y, sign * height);
    const inner = xs.map((x) => [x, clamp(f(x))]);

    // Parte coberta: do eixo até min(curva, topo do retângulo).
    polygons.push({
      points: [[x0, 0], ...inner, [x1, 0]],
      tone: 2,
    });

    // Excesso: do min(curva, topo) até o topo, onde houver.
    const excess = inner.some((p) => sign * (height - p[1]) > 1e-9);
    if (excess) {
      polygons.push({
        points: [[x0, height], [x1, height], ...inner.slice().reverse()],
        tone: 3,
      });
    }
  }

  const values = [];
  for (let k = 0; k <= 60; k += 1) values.push(f(a + ((b - a) * k) / 60));
  const top = Math.max(0, ...values);
  const bottom = Math.min(0, ...values);
  const span = Math.max(top - bottom, 1);

  const win = {
    xMin: xMin ?? a - (b - a) * 0.15,
    xMax: xMax ?? b + (b - a) * 0.15,
    yMin: yMin ?? bottom - span * 0.12,
    yMax: yMax ?? top + span * 0.12,
  };

  const sumText = showSum
    ? `Soma ${METHOD_LABEL[method] ?? METHOD_LABEL.left} com n = ${n}: ${fmt(sum, digits)}.`
    : '';
  const fullCaption = [caption, sumText].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper}>
      <CartesianPlane
        xMin={win.xMin}
        xMax={win.xMax}
        yMin={win.yMin}
        yMax={win.yMax}
        xUnit={xUnit}
        yUnit={yUnit ?? Math.max(8, Math.round((xUnit * (b - a)) / span))}
        xStep={xStep}
        yStep={yStep}
        xLabelEvery={xLabelEvery}
        yLabelEvery={yLabelEvery}
        polygons={polygons}
        functions={[{f, tone: 1}, ...functions]}
        points={points}
        labels={labels}
        axisLabels={axisLabels}
        caption={fullCaption || undefined}
      />
    </div>
  );
}
