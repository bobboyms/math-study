import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {num, factor, pairTex, WideMath} from '../MatrixKit';

// Uma camada de rede neural, y = Wx + b, desenhada como neurônios (lição 11.3).
//
// À esquerda, as entradas; à direita, os neurônios de saída. Cada linha da
// matriz W é o conjunto de pesos que chega a um neurônio: as setas do
// neurônio 1 são azuis e trazem a linha 1 de W; as do neurônio 2 são laranja
// e trazem a linha 2. Peso zero sai tracejado e apagado. Na animação, cada
// neurônio acende as suas setas, faz o produto escalar da sua linha com a
// entrada, soma o seu viés e escreve a saída. Depois o aluno muda as entradas
// e o painel mostra que aumentar uma entrada em 1 muda as saídas pela coluna
// daquela entrada.

const W_SVG = 430;
const IX = 58;
const OX = 300;
const R_IN = 19;
const R_OUT = 22;

const bmat = (M) => `\\begin{bmatrix} ${M.map((row) => row.map(num).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
const bcol = (v) => `\\begin{bmatrix} ${v.map(num).join(' \\\\ ')} \\end{bmatrix}`;

export default function NeuralLayerMatrix({
  weights = [
    [1, 0, 2],
    [-1, 3, 1],
  ],
  bias = [1, -2],
  input = [2, 1, 3],
  range = [-2, 4],
  caption,
}) {
  const nOut = weights.length;
  const nIn = weights[0].length;
  const [x, setX] = useState(input);

  const inY = (i) => 44 + i * 70;
  const span = (nIn - 1) * 70;
  const outY = (o) => 44 + span / 2 + (o - (nOut - 1) / 2) * 70;
  const LY0 = 44 + span + 50;
  const H = LY0 + nOut * 26;

  const phase = (o) => [0.3 + o * 1.5, 1.7 + o * 1.5];
  const duration = phase(nOut - 1)[1] + 0.3;
  const {ref, t, play, playing} = useAnimation({duration});
  const animating = t < duration;
  const activeOut = (() => {
    for (let o = 0; o < nOut; o += 1) {
      const [a, b] = phase(o);
      if (t >= a && t < b) return o;
    }
    return -1;
  })();

  const wx = weights.map((row) => row.reduce((s, w, j) => s + w * x[j], 0));
  const y = wx.map((v, o) => v + bias[o]);
  const outShown = (o) => stage(t, phase(o)[1] - 0.5, phase(o)[1]);
  const lineShown = (o) => stage(t, phase(o)[0], phase(o)[0] + 0.4);

  const deltas = x.map((v, j) => v - input[j]);
  const changed = deltas.map((d, j) => [d, j]).filter(([d]) => d !== 0);
  const y0 = weights.map((row, o) => row.reduce((s, w, j) => s + w * input[j], 0) + bias[o]);

  const edgeLabel = (i, o) => {
    const f = 0.3;
    return [IX + f * (OX - IX), inY(i) + f * (outY(o) - inY(i))];
  };

  return (
    <div className={shared.wrapper} data-explorer="neural-layer-matrix">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W_SVG} ${H}`}
          style={{maxWidth: `${W_SVG + 40}px`}}
          role="img"
          aria-label={`Camada com ${nIn} entradas e ${nOut} neurônios. Cada neurônio recebe uma linha da matriz de pesos. Saídas: ${y.map((v) => num(v).replace('-', '−')).join(' e ')}.`}
        >
          {/* setas: pesos */}
          {weights.map((row, o) =>
            row.map((w, i) => {
              const dim = animating && activeOut !== -1 && activeOut !== o;
              const zero = w === 0;
              const stroke = zero ? 'var(--mv-guide)' : `var(--mv-tone-${o + 1})`;
              const x1 = IX + R_IN;
              const x2 = OX - R_OUT - 4;
              const yy1 = inY(i);
              const yy2 = outY(o);
              const len = Math.hypot(x2 - x1, yy2 - yy1);
              const ux = (x2 - x1) / len;
              const uy = (yy2 - yy1) / len;
              const head = `M ${x2} ${yy2} L ${x2 - ux * 8 - uy * 4} ${yy2 - uy * 8 + ux * 4} L ${x2 - ux * 8 + uy * 4} ${yy2 - uy * 8 - ux * 4} Z`;
              const [lx, ly] = edgeLabel(i, o);
              return (
                <g key={`e${o}-${i}`} opacity={dim ? 0.18 : 1}>
                  <line
                    x1={x1}
                    y1={yy1}
                    x2={x2}
                    y2={yy2}
                    stroke={stroke}
                    strokeWidth={zero ? 1.2 : 1.4 + 0.35 * Math.abs(w)}
                    strokeDasharray={zero ? '4 4' : undefined}
                  />
                  {!zero && <path d={head} fill={stroke} />}
                  <SvgMath x={lx} y={ly} math={num(w)} fontSize={13} tone={zero ? undefined : o + 1} halo />
                </g>
              );
            }),
          )}

          {/* entradas */}
          {x.map((v, i) => (
            <g key={`in${i}`}>
              <circle cx={IX} cy={inY(i)} r={R_IN} fill="var(--mv-paper)" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
              <SvgMath x={IX} y={inY(i)} math={num(v)} fontSize={14} />
              <SvgMath x={IX - R_IN - 6} y={inY(i)} math={`x_${i + 1}`} fontSize={13} anchor="end" space={30} />
            </g>
          ))}

          {/* neurônios de saída */}
          {weights.map((_, o) => {
            const tone = o + 1;
            const on = activeOut === o;
            return (
              <g key={`out${o}`}>
                <circle
                  cx={OX}
                  cy={outY(o)}
                  r={R_OUT}
                  fill={`var(--mv-tone-${tone})`}
                  fillOpacity={on ? 0.3 : 0.14}
                  stroke={`var(--mv-tone-${tone})`}
                  strokeWidth={on ? 2.6 : 1.6}
                />
                <g opacity={outShown(o)}>
                  <SvgMath x={OX} y={outY(o)} math={num(y[o])} fontSize={15} />
                </g>
                <SvgMath
                  x={OX + R_OUT + 8}
                  y={outY(o) - 10}
                  math={`\\text{viés } {${num(bias[o])}}`}
                  fontSize={12}
                  anchor="start"
                  space={W_SVG - OX - R_OUT - 10}
                  tone={tone}
                />
                <g opacity={outShown(o)}>
                  <SvgMath
                    x={OX + R_OUT + 8}
                    y={outY(o) + 12}
                    math={`y_${o + 1} = ${num(y[o])}`}
                    fontSize={13}
                    anchor="start"
                    space={W_SVG - OX - R_OUT - 10}
                  />
                </g>
              </g>
            );
          })}

          {/* contas */}
          {weights.map((row, o) => (
            <g key={`l${o}`} opacity={lineShown(o)}>
              <WideMath
                x={8}
                y={LY0 + o * 26}
                math={`y_${o + 1} = ${row.map((w, j) => `${factor(w)} \\times ${factor(x[j])}`).join(' + ')} ${bias[o] < 0 ? '-' : '+'} ${num(Math.abs(bias[o]))} = ${num(wx[o])} ${bias[o] < 0 ? '-' : '+'} ${num(Math.abs(bias[o]))} = ${num(y[o])}`}
                fontSize={13}
                width={W_SVG - 10}
                tone={o + 1}
              />
            </g>
          ))}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        {x.map((v, j) => (
          <label key={j} className={shared.control}>
            <span>
              Entrada {j + 1}: <strong>x{['₁', '₂', '₃', '₄'][j]} = {String(v).replace('-', '−')}</strong>
            </span>
            <input
              type="range"
              min={range[0]}
              max={range[1]}
              step={1}
              value={v}
              disabled={playing}
              onChange={(e) => {
                const next = [...x];
                next[j] = Number(e.target.value);
                setX(next);
              }}
              aria-label={`Entrada ${j + 1}`}
            />
          </label>
        ))}
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`W\\vec{x} + \\vec{b} = ${bmat(weights)}${bcol(x)} + ${bcol(bias)} = ${bcol(wx)} + ${bcol(bias)} = ${bcol(y)}`} />
        </p>
        {changed.length > 0 ? (
          <p className={shared.formula}>
            Comparado com a entrada inicial: <Formula math={`\\vec{y} = ${pairTex(y0)} ${changed
              .map(([d, j]) => `${d < 0 ? '-' : '+'} ${Math.abs(d) === 1 ? '' : num(Math.abs(d))}${pairTex(weights.map((row) => row[j]))}`)
              .join(' ')} = ${pairTex(y)}`} />. Cada entrada que mudou trouxe a sua coluna de W.
          </p>
        ) : (
          <p>Aumente uma entrada em 1 e compare as saídas com as de agora.</p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver os neurônios calcularem de novo
        </button>
        <button type="button" disabled={playing || changed.length === 0} onClick={() => setX(input)}>
          Voltar à entrada inicial
        </button>
      </div>
    </div>
  );
}
