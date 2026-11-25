import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, MovedGrid, frame, num} from '../LinearGridMorph/plane';
import {apply2, det2, mix2, mul2} from '../DetGridMorph/det';
import {fr, texFr} from '../SystemElimination/frac';

// O efeito de cada operação de linha no determinante (lição 11.9).
//
// Começa na matriz do loteamento, M = [[3, 1], [1, 2]], com o paralelogramo
// das colunas em contorno tracejado. Cada botão faz uma operação de linha, que
// é multiplicar M pela esquerda por uma matriz E. Por isso as colunas novas
// são E vezes as colunas antigas: o plano inteiro passa por E (malha cinza),
// e o paralelogramo das colunas vai junto. O painel compara o determinante
// antes e depois.

const M0 = [
  [3, 1],
  [1, 2],
];

// Entradas exatas da matriz depois de cada operação, como frações [n, d].
const OPS = [
  {
    label: 'L₂ ← L₂ − ⅓L₁',
    tex: 'L_2 \\leftarrow L_2 - \\tfrac{1}{3}L_1',
    E: [
      [1, 0],
      [-1 / 3, 1],
    ],
    exact: [[[3, 1], [1, 1]], [[0, 1], [5, 3]]],
    effect: 'Nenhum efeito: o determinante continua 5. A matriz E é um cisalhamento na vertical: cada ponto sobe ou desce, e anda mais quanto mais longe ele está do eixo vertical. A malha escorrega, e as áreas não mudam.',
  },
  {
    label: 'L₁ ↔ L₂',
    tex: 'L_1 \\leftrightarrow L_2',
    E: [
      [0, 1],
      [1, 0],
    ],
    exact: [[[1, 1], [2, 1]], [[3, 1], [1, 1]]],
    effect: 'O sinal troca: 5 vira −5. A matriz E troca x com y em cada ponto, que é o espelho na reta y = x. A área continua 5, e o plano foi virado.',
  },
  {
    label: 'L₂ ← 2L₂',
    tex: 'L_2 \\leftarrow 2L_2',
    E: [
      [1, 0],
      [0, 2],
    ],
    exact: [[[3, 1], [1, 1]], [[2, 1], [4, 1]]],
    effect: 'O determinante fica multiplicado por 2: 5 vira 10. A matriz E estica o plano 2 vezes na vertical, e toda área dobra.',
  },
  {
    label: 'L₂ ← −L₂',
    tex: 'L_2 \\leftarrow -L_2',
    E: [
      [1, 0],
      [0, -1],
    ],
    exact: [[[3, 1], [1, 1]], [[-1, 1], [-2, 1]]],
    effect: 'O determinante fica multiplicado por −1: 5 vira −5. A matriz E espelha o plano no eixo x. A área fica multiplicada por 1 (o valor de −1 sem o sinal), e o plano foi virado.',
  },
];

export default function DetRowOps({unit = 36, caption}) {
  const [idx, setIdx] = useState(0);
  const {ref, t, play, playing} = useAnimation({duration: 3});
  const op = OPS[idx];
  const s = stage(t, 0.3, 2.6);
  const Es = mix2(op.E, s);
  const M = mul2(Es, M0);
  const c1 = [M[0][0], M[1][0]];
  const c2 = [M[0][1], M[1][1]];
  const o1 = [M0[0][0], M0[1][0]];
  const o2 = [M0[0][1], M0[1][1]];
  const f = frame([-1.5, 4.8, -3.4, 6.4], unit);
  const clipId = 'det-rowops-clip';
  const map = (p) => apply2(Es, p);
  const P = (p) => f.P(p).map((v) => v.toFixed(1)).join(' ');
  const quad = (a, b) => `M ${P([0, 0])} L ${P(a)} L ${P([a[0] + b[0], a[1] + b[1]])} L ${P(b)} Z`;
  const d = det2(M);
  const atRest = !playing;

  const ex = op.exact.map((row) => row.map(([n, dd]) => texFr(fr(n, dd))));
  const after = `\\begin{bmatrix} ${ex[0][0]} & ${ex[0][1]} \\\\ ${ex[1][0]} & ${ex[1][1]} \\end{bmatrix}`;

  return (
    <div className={shared.wrapper} data-explorer="det-row-ops">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label="O paralelogramo das colunas antes e depois de uma operação de linha">
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <MovedGrid f={f} map={map} extent={10} clipId={clipId} />
          <Axes f={f} />
          <path d={quad(o1, o2)} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.4} strokeDasharray="5 4" />
          <path d={quad(c1, c2)} fill="var(--mv-tone-3)" fillOpacity={0.3} stroke="var(--mv-tone-3)" strokeWidth={2} clipPath={`url(#${clipId})`} />
          <Arrow f={f} to={c1} tone={1} label={!atRest ? null : s > 0.999 ? `(${ex[0][0]},\\ ${ex[1][0]})` : s < 0.001 ? '(3,\\ 1)' : null} offset={c1[1] < 0 ? [10, 16, 'start'] : undefined} />
          <Arrow f={f} to={c2} tone={2} label={!atRest ? null : s > 0.999 ? `(${ex[0][1]},\\ ${ex[1][1]})` : s < 0.001 ? '(1,\\ 2)' : null} offset={c2[1] < 0 ? [-8, 14, 'end'] : idx === 1 ? [-8, -8, 'end'] : undefined} />
        </svg>
        <figcaption className={styles.caption}>
          {caption ??
            'O contorno tracejado é o paralelogramo das colunas de M, área 5. Cada botão faz uma operação de linha. As colunas novas (setas) formam o paralelogramo verde; a malha cinza mostra o que a operação fez com o plano inteiro.'}
        </figcaption>
      </figure>
      <div className={shared.buttons} role="group" aria-label="Escolher a operação de linha">
        {OPS.map((o, i) => (
          <button
            key={o.label}
            type="button"
            className={i === idx ? styles.active : undefined}
            aria-pressed={i === idx}
            disabled={playing}
            onClick={() => {
              setIdx(i);
              play();
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`\\begin{bmatrix} 3 & 1 \\\\ 1 & 2 \\end{bmatrix} \\xrightarrow{${op.tex}} ${atRest ? after : '\\ldots'}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`\\det: \\ 5 \\ \\longrightarrow \\ ${num(d)}`} />
        </p>
        {atRest && <p>{op.effect}</p>}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a operação de novo
        </button>
      </div>
    </div>
  );
}
