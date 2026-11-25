import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {add, clipLine, dot, kOf, lerp, norm, rightAngle, sub, times, num, numText, pair, pairText} from '../mathviz/projection';

// O ponto da reta mais perto de P (lição 7.32).
//
// A reta passa por A e segue a direção u; P fica fora dela. A animação faz os
// três passos do texto: (1) a seta de A até P (laranja), chegada menos saída;
// (2) a linha em ângulo reto que desce de P até a reta, e a sombra de AP
// (verde) crescendo a partir de A; (3) o pé H, a marca de ângulo reto e a
// distância, que é o tamanho do resto.
//
// `error`: um botão mostra o erro de projetar o próprio P, como se a reta
// passasse pela origem. O ponto que sai cai fora da reta.
// `compare`: um deslizante escolhe outro ponto Q da reta, e o painel mostra
// por Pitágoras que PQ é sempre maior que PH.

const DURATION = 4.6;

const off = (d, L) => {
  const n = norm(d) || 1;
  return {dx: (d[0] / n) * L, dy: (-d[1] / n) * L};
};

export default function PointToLine({
  A = [0, 3],
  u = [1, 2],
  P = [1, 8],
  box = [-1, 4.6, -0.6, 9.6],
  unit = 44,
  lineLabel = 'y = 2x + 3',
  error = false,
  compare = false,
  caption,
}) {
  const [wrong, setWrong] = useState(false);
  const [s, setS] = useState(1);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});

  const AP = sub(P, A);
  const k = kOf(AP, u);
  const proj = times(k, u);
  const H = add(A, proj);
  const r = sub(P, H);
  const d = norm(r);

  const a = stage(t, 0.3, 1.3); // a seta de A até P
  const b = stage(t, 1.5, 2.6); // a linha desce de P
  const c = stage(t, 2.7, 3.8); // a sombra cresce a partir de A
  const e = stage(t, 3.9, 4.4); // ângulo reto, H e distância

  const segments = [];
  const points = [
    {at: A, label: 'A', tone: 1, ...off([-1, -0.3], 16)},
    {at: P, label: 'P', tone: 2, ...off([-1, 0.4], 16)},
  ];
  const labels = [];

  const line = clipLine(A, u, box);
  if (line) segments.push({from: line[0], to: line[1], tone: 1});
  // O nome da reta fica à direita dela, um pouco abaixo de A, onde não há
  // nenhuma seta (a seta de A até P e a sombra sobem a partir de A).
  if (lineLabel && line) labels.push({at: lerp(line[0], line[1], 0.2), math: lineLabel, tone: 1, anchor: 'start', dx: 12, dy: 6});

  if (a > 0.01) segments.push({from: A, to: lerp(A, P, a), tone: 2, arrow: true});
  if (b > 0.01) segments.push({from: P, to: lerp(P, H, b), tone: e > 0.5 ? 2 : 0, dashed: true});
  if (c > 0.01) segments.push({from: A, to: lerp(A, H, c), tone: 3, arrow: true});
  if (e > 0.5) {
    segments.push(...rightAngle(H, times(-1, u), r, 0.22));
    points.push({at: H, label: 'H', tone: 3, ...off([u[1], -u[0]], 16)});
    labels.push({at: lerp(P, H, 0.5), math: `d \\approx ${num(d, 2)}`, tone: 2, ...off(u, 30)});
  }

  let W = null;
  if (error && wrong && !playing) {
    W = times(kOf(P, u), u);
    const l0 = clipLine([0, 0], u, box);
    if (l0) segments.push({from: l0[0], to: l0[1], muted: true, dashed: true});
    segments.push({from: [0, 0], to: P, muted: true, arrow: true});
    points.push({at: W, label: pair(W, 2), tone: 0, open: true, ...off([1, -0.2], 44)});
  }

  let Q = null;
  if (compare && !playing) {
    Q = add(A, times(s, u));
    if (Math.abs(s - k) > 0.01) {
      segments.push({from: P, to: Q, tone: 0, dashed: true});
      points.push({at: Q, label: 'Q', tone: 0, r: 4, ...off([u[1], -u[0]], 16)});
    }
  }

  return (
    <div className={shared.wrapper} data-explorer="point-to-line">
      <div ref={ref}>
        <CartesianPlane
          xMin={box[0]}
          xMax={box[1]}
          yMin={box[2]}
          yMax={box[3]}
          xUnit={unit}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'A reta (azul) passa por A. A seta laranja vai de A até P. Da ponta P desce uma linha em ângulo reto até a reta, e a sombra de AP (verde) cresce a partir de A até o pé H. A distância de P à reta é o tamanho do resto, de H até P.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\overrightarrow{AP} = ${pair(P, 2)} - ${pair(A, 2)} = ${pair(AP, 2)}, \\qquad k = \\frac{${num(dot(AP, u), 2)}}{${num(dot(u, u), 2)}} = ${num(k, 3)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`H = A + ${num(k, 3)}\\,${pair(u, 2)} = ${pair(A, 2)} + ${pair(proj, 2)} = ${pair(H, 2)}, \\qquad d = \\lVert P - H \\rVert = \\lVert ${pair(r, 2)} \\rVert \\approx ${num(d, 3)}`}
          />
        </p>
        {W && (
          <p>
            O ponto vazado é o erro: a projeção do próprio P sobre {pairText(u)}, como se a reta passasse pela origem (cinza
            tracejada). Ele dá <Formula math={pair(W, 2)} />, que não está na reta azul: lá, com x ={' '}
            {numText(W[0], 2)}, a altura seria {numText(A[1] + (u[1] / u[0]) * (W[0] - A[0]), 2)}, e não {numText(W[1], 2)}.
          </p>
        )}
        {Q && Math.abs(s - k) > 0.01 && (
          <p className={shared.formula}>
            <Formula
              math={`\\lVert P - Q \\rVert^2 = \\lVert P - H \\rVert^2 + \\lVert H - Q \\rVert^2 = ${num(d * d, 2)} + ${num(dot(sub(H, Q), sub(H, Q)), 2)} = ${num(dot(sub(P, Q), sub(P, Q)), 2)}`}
            />
          </p>
        )}
        {Q && Math.abs(s - k) > 0.01 && (
          <p>
            Q está na reta, a {numText(norm(sub(H, Q)), 2)} de H. A distância de P até Q é cerca de{' '}
            {numText(norm(sub(P, Q)), 2)}, maior que os {numText(d, 2)} até H.
          </p>
        )}
      </div>
      {compare && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>Outro ponto da reta: Q = A + {numText(s, 1)} × {pairText(u)}</span>
            <input
              type="range"
              min={0}
              max={3.4}
              step={0.2}
              value={s}
              onChange={(ev) => setS(Math.round(Number(ev.target.value) * 10) / 10)}
              aria-label="Posição do ponto Q sobre a reta"
            />
          </label>
        </div>
      )}
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver os passos de novo
        </button>
        {error && (
          <button type="button" onClick={() => setWrong(!wrong)} disabled={playing} aria-pressed={wrong}>
            {wrong ? 'Esconder o erro' : 'Mostrar o erro: projetar o próprio P'}
          </button>
        )}
      </div>
    </div>
  );
}
