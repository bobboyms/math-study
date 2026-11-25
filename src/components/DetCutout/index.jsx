import React from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {FixedGrid, Label, frame, num, toneVar} from '../LinearGridMorph/plane';

// O recorte que mede a área do paralelogramo das colunas (lição 11.9).
//
// O paralelogramo das colunas (a, c) e (b, d), em azul, fica dentro do
// retângulo de (a + b) por (c + d) que o envolve. As seis peças de fora
// (quatro triângulos laranja e dois retângulos verdes) saem do retângulo aos
// pares, cada par na sua vez, e o painel vai subtraindo as áreas. No quadro
// final as peças ficam afastadas, com a área de cada uma escrita, e o
// paralelogramo mostra o que sobrou.
//
// `letters` troca os números pelas letras: o mesmo recorte vira a conta
// (a + b)(c + d) − ac − bd − 2bc = ad − bc.

const T = [1.2, 2.6, 4.0, 5.4];
const DUR = 1.0;
const TOTAL = 7.0;

export default function DetCutout({cols = [[3, 1], [1, 2]], letters = false, unit = 54, caption}) {
  const [[a, c], [b, d]] = cols;
  const {ref, t, play, playing} = useAnimation({duration: TOTAL});
  const fade = stage(t, 0, 0.9);
  const k = T.map((s) => stage(t, s, s + DUR));

  const W = a + b;
  const H = c + d;
  const f = frame([-1.5, W + 0.9, -1.35, H + 0.85], unit);
  const L = letters;

  const n = (v) => num(v, 2);
  const pieces = [
    // [pontos, tom, deslocamento ao sair, etapa, rótulo da área]
    {pts: [[0, 0], [a, 0], [a, c]], tone: 2, out: [0, -0.45], step: 0, area: L ? '\\tfrac{ac}{2}' : n((a * c) / 2), dy: 4},
    {pts: [[b, d], [W, H], [b, H]], tone: 2, out: [0, 0.45], step: 0, area: L ? '\\tfrac{ac}{2}' : n((a * c) / 2), dy: -4},
    {pts: [[0, 0], [b, d], [0, d]], tone: 2, out: [-0.45, 0], step: 1, area: L ? '\\tfrac{bd}{2}' : n((b * d) / 2), dx: -4},
    {pts: [[a, c], [W, c], [W, H]], tone: 2, out: [0.45, 0], step: 1, area: L ? '\\tfrac{bd}{2}' : n((b * d) / 2), dx: 4},
    {pts: [[a, 0], [W, 0], [W, c], [a, c]], tone: 3, out: [0.32, -0.32], step: 2, area: L ? 'bc' : n(b * c)},
    {pts: [[0, d], [b, d], [b, H], [0, H]], tone: 3, out: [-0.32, 0.32], step: 2, area: L ? 'bc' : n(b * c)},
  ];

  const path = (pts, off = [0, 0]) =>
    `M ${pts.map((p) => f.P([p[0] + off[0], p[1] + off[1]]).map((v) => v.toFixed(1)).join(' ')).join(' L ')} Z`;
  const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

  const para = [[0, 0], [a, c], [W, H], [b, d]];
  const area = a * d - b * c;

  // Conta do painel, uma parcela por etapa concluída.
  const parts = L
    ? ['(a + b)(c + d)', '- ac', '- bd', '- 2bc']
    : [`${n(W)} \\times ${n(H)}`, `- ${n(a * c)}`, `- ${n(b * d)}`, `- ${n(2 * b * c)}`];
  const doneSteps = k.slice(0, 3).filter((v) => v > 0.5).length;
  const finished = k[3] > 0.5;
  let formula = `\\text{área} = ${parts[0]}`;
  for (let i = 0; i < Math.min(doneSteps, 3); i += 1) formula += ` ${parts[i + 1]}`;
  if (finished) formula += L ? ' = ad - bc' : ` = ${n(area)}`;

  const texts = L
    ? [
        'O retângulo que envolve tudo tem lados a + b e c + d.',
        'Saem os dois triângulos de catetos a e c: cada um tem metade de a vezes c, e os dois juntos têm ac.',
        'Saem os dois triângulos de catetos b e d: os dois juntos têm bd.',
        'Saem os dois retângulos dos cantos, de lados b e c: os dois juntos têm 2bc.',
      ]
    : [
        `O retângulo que envolve tudo tem ${n(W)} por ${n(H)}: área ${n(W * H)}.`,
        `Saem os dois triângulos de catetos ${n(a)} e ${n(c)}: ${n((a * c) / 2).replace('{,}', ',')} cada, ${n(a * c)} ao todo.`,
        `Saem os dois triângulos de catetos ${n(b)} e ${n(d)}: ${n((b * d) / 2).replace('{,}', ',')} cada, ${n(b * d)} ao todo.`,
        `Saem os dois quadrados dos cantos, de lado ${n(b)}: ${n(2 * b * c)} ao todo.`,
      ];
  const text = finished
    ? L
      ? 'Sobrou o paralelogramo. Juntando as parcelas iguais, a conta dá ad − bc.'
      : `Sobrou o paralelogramo: área ${n(area)}.`
    : texts[Math.min(doneSteps, 3)];

  // Cotas embaixo e à esquerda.
  const dims = [
    {from: [0, -0.95], to: [a, -0.95], math: L ? 'a' : n(a), at: [a / 2, -0.95], dy: 13},
    {from: [a, -0.95], to: [W, -0.95], math: L ? 'b' : n(b), at: [a + b / 2, -0.95], dy: 13},
    {from: [-1.0, 0], to: [-1.0, d], math: L ? 'd' : n(d), at: [-1.0, d / 2], dx: -12},
    {from: [-1.0, d], to: [-1.0, H], math: L ? 'c' : n(c), at: [-1.0, d + c / 2], dx: -12},
  ];

  return (
    <div className={shared.wrapper} data-explorer="det-cutout">
      <figure className={styles.figure} ref={ref}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${f.W} ${f.H}`}
          style={{maxWidth: `${f.W}px`}}
          role="img"
          aria-label="O paralelogramo das colunas dentro do retângulo que o envolve; as seis peças de fora saem aos pares"
        >
          <FixedGrid f={f} />
          {/* retângulo que envolve */}
          <path d={path([[0, 0], [W, 0], [W, H], [0, H]])} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.4} strokeDasharray="6 4" />
          {/* paralelogramo */}
          <path d={path(para)} fill="var(--mv-tone-1)" fillOpacity={0.22} stroke="var(--mv-tone-1)" strokeWidth={2.2} />
          {/* peças */}
          {pieces.map((p, i) => {
            const s = k[p.step];
            const off = [p.out[0] * s, p.out[1] * s];
            return (
              <path
                key={i}
                d={path(p.pts, off)}
                fill={toneVar(p.tone)}
                fillOpacity={0.28 * fade}
                stroke={toneVar(p.tone)}
                strokeWidth={1.4}
                strokeOpacity={fade}
              />
            );
          })}
          {/* cotas */}
          {dims.map((dm, i) => {
            const A = f.P(dm.from);
            const B = f.P(dm.to);
            const vertical = dm.from[0] === dm.to[0];
            const tick = (P) =>
              vertical ? <line x1={P[0] - 5} x2={P[0] + 5} y1={P[1]} y2={P[1]} /> : <line x1={P[0]} x2={P[0]} y1={P[1] - 5} y2={P[1] + 5} />;
            return (
              <g key={`d${i}`} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.2}>
                <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} />
                {tick(A)}
                {tick(B)}
              </g>
            );
          })}
          {dims.map((dm, i) => (
            <Label key={`dl${i}`} f={f} at={dm.at} math={dm.math} dx={dm.dx ?? 0} dy={dm.dy ?? 0} fontSize={14} />
          ))}
          {/* áreas das peças, quando elas já saíram (ou com a figura parada) */}
          {pieces.map((p, i) => {
            const s = k[p.step];
            if (fade < 1) return null;
            const ctr = centroid(p.pts);
            return (
              <g key={`a${i}`} opacity={playing ? Math.max(0.0, s) : 1}>
                <Label f={f} at={[ctr[0] + p.out[0] * s, ctr[1] + p.out[1] * s]} math={p.area} tone={p.tone} dx={p.dx ?? 0} dy={p.dy ?? 0} fontSize={L ? 15 : 13} />
              </g>
            );
          })}
          <Label
            f={f}
            at={[W / 2, H / 2]}
            math={finished ? (L ? 'ad - bc' : n(area)) : '?'}
            tone={1}
            fontSize={finished ? 17 : 19}
          />
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p>{text}</p>
        <p className={shared.formula}>
          <Formula math={formula} />
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o recorte de novo
        </button>
      </div>
    </div>
  );
}
