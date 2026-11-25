import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {
  Arrow,
  Axes,
  ClipDefs,
  Dot,
  FixedGrid,
  Label,
  MovedGrid,
  bmatrix,
  frame,
  lerp,
  num,
  pair,
  polygonPath,
  toneVar,
} from '../LinearGridMorph/plane';

// Uma matriz sem inversa achata o plano, e dois pontos diferentes caem no
// mesmo lugar (lição 11.8, Matriz inversa).
//
// Modo animado (padrão): a malha vai da identidade até a matriz. Dois pontos
// (azul e laranja) viajam e terminam no mesmo ponto. Depois, duas setas
// tracejadas tentam voltar desse ponto, uma para cada lugar de onde ele pode
// ter vindo, com um “?”: a volta não sabe qual escolher.
//
// Modo deslizante (`slider`): a matriz [[a, b], [c, k]] com o k num
// deslizante. O painel calcula ad − bc e as imagens dos dois pontos; quando
// ad − bc chega a zero, as imagens se encontram e a malha vira uma reta. Ao
// entrar na tela, o k caminha do valor inicial até o valor que achata.

const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];
const mix = (A, s) => [
  [lerp(1, A[0][0], s), lerp(0, A[0][1], s)],
  [lerp(0, A[1][0], s), lerp(1, A[1][1], s)],
];

function numText(v, digits = 2) {
  const r = Number(Number(v).toFixed(digits));
  return String(Object.is(r, -0) ? 0 : r).replace('.', ',').replace('-', '−');
}

export default function InverseCollapse({
  presets,
  initialPreset = 0,
  matrix,
  points = [
    [1, -1],
    [-3, 1],
  ],
  slider,
  window: win = [-5, 4, -3, 3],
  unit = 36,
  extent = 9,
  imageOffset = [12, 18, 'start'],
  replayLabel = 'Ver de novo',
  caption,
  label = 'Malha do plano sendo achatada por uma matriz sem inversa',
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initialPreset);
  const [kVal, setK] = useState(slider ? slider.initial : 0);

  const DUR = slider ? 2.6 : 4.2;
  const {ref, t, play, playing} = useAnimation({
    duration: DUR,
    onFrame: slider
      ? (time) => {
          const s = stage(time, 0.3, 2.4);
          const raw = lerp(slider.tourFrom ?? slider.initial, slider.initial, s);
          setK(Math.round(raw / slider.step) * slider.step);
        }
      : undefined,
  });

  const spec = presets ? presets[idx] : {matrix, points};
  const pts = spec.points ?? points;

  let A;
  let s = 1;
  let back = 1;
  if (slider) {
    const base = slider.base;
    A = [
      [base[0][0], base[0][1]],
      [base[1][0], kVal],
    ];
  } else {
    A = spec.matrix;
    s = stage(t, 0.2, 2.5);
    back = stage(t, 2.8, 3.9);
  }
  const M = slider ? A : mix(A, s);
  const map = (p) => apply(M, p);
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  const flat = Math.abs(det) < 1e-9;
  const moving = playing && !slider && (s < 0.999 || (back > 0.001 && back < 0.999));
  const still = !moving;

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const tones = [1, 2];
  const imgs = pts.map((p) => map(p));
  const same = Math.hypot(imgs[0][0] - imgs[1][0], imgs[0][1] - imgs[1][1]) < 1e-6;
  const showReturn = !slider && back > 0.001 && same;
  // o painel fala sempre do fim do movimento
  const finals = pts.map((p) => apply(A, p));
  const sameFinal = Math.hypot(finals[0][0] - finals[1][0], finals[0][1] - finals[1][1]) < 1e-6;

  // Seta tracejada de volta, crescendo do ponto de chegada até cada origem.
  const returnArrow = (target, tone, key) => {
    const from = imgs[0];
    const to = [lerp(from[0], target[0], back), lerp(from[1], target[1], back)];
    return <Arrow key={key} f={f} from={from} to={to} tone={tone} dashed width={2} head={9} />;
  };

  const sliderLabel = slider?.label ?? 'k';

  return (
    <div className={shared.wrapper} data-explorer="inverse-collapse">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={label}>
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <MovedGrid f={f} map={map} extent={extent} clipId={clipId} />
          <path
            d={polygonPath(f, [[0, 0], [1, 0], [1, 1], [0, 1]], map)}
            fill="var(--mv-tone-3)"
            fillOpacity="var(--mv-fill-opacity)"
            stroke="var(--mv-tone-3)"
            strokeWidth={2}
            clipPath={`url(#${clipId})`}
          />
          <Axes f={f} />
          {pts.map((p, i) => {
            const a = f.P(p);
            const b = f.P(imgs[i]);
            return (
              <g key={`t${i}`}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={toneVar(tones[i])} strokeWidth={1.4} strokeDasharray="3 4" opacity={0.8} />
                <Dot f={f} at={p} tone={tones[i]} r={4.5} open />
                {still && (
                  <Label
                    f={f}
                    at={p}
                    math={pair(p)}
                    tone={tones[i]}
                    dx={(spec.labelOffsets?.[i] ?? [0, -16])[0]}
                    dy={(spec.labelOffsets?.[i] ?? [0, -16])[1]}
                    anchor={(spec.labelOffsets?.[i] ?? [0, -16, 'middle'])[2] ?? 'middle'}
                  />
                )}
              </g>
            );
          })}
          {showReturn && pts.map((p, i) => returnArrow(p, tones[i], `r${i}`))}
          {showReturn && still && (
            <Label
              f={f}
              at={[(imgs[0][0] + pts[0][0] + imgs[0][0] + pts[1][0]) / 4, (imgs[0][1] + pts[0][1] + imgs[0][1] + pts[1][1]) / 4]}
              math="?"
              fontSize={22}
              dx={spec.questionOffset?.[0] ?? 0}
              dy={spec.questionOffset?.[1] ?? 0}
            />
          )}
          {imgs.map((q, i) => (
            <Dot key={`i${i}`} f={f} at={q} tone={tones[i]} r={i === 0 ? 7 : 4.5} />
          ))}
          {still && same && (
            <Label
              f={f}
              at={imgs[0]}
              math={pair(imgs[0])}
              dx={(spec.imageOffset ?? imageOffset)[0]}
              dy={(spec.imageOffset ?? imageOffset)[1]}
              anchor={(spec.imageOffset ?? imageOffset)[2]}
            />
          )}
          {still &&
            !same &&
            imgs.map((q, i) => (
              <Label key={`il${i}`} f={f} at={q} math={pair(q)} tone={tones[i]} dx={14} dy={i === 0 ? -14 : 16} anchor="start" />
            ))}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      {presets && (
        <div className={shared.buttons} role="group" aria-label="Escolha a matriz">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={i === idx ? styles.active : undefined}
              aria-pressed={i === idx}
              disabled={playing}
              onClick={() => {
                setIdx(i);
                play();
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      {slider && (
        <div className={shared.controls} style={{marginTop: '0.8rem'}}>
          <label className={shared.control}>
            <span>
              {sliderLabel}: <strong>{numText(kVal)}</strong>
            </span>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={kVal}
              disabled={playing}
              onChange={(e) => setK(Number(e.target.value))}
              aria-label={sliderLabel}
            />
          </label>
        </div>
      )}
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`${bmatrix(A)}\\qquad ad - bc = ${num(A[0][0])} \\times ${num(A[1][1])} - ${num(A[0][1])} \\times ${num(A[1][0])} = ${num(det)}`}
          />
        </p>
        <p className={shared.formula}>
          <span className={styles.col1}>
            <Formula math={`${pair(pts[0])} \\mapsto ${pair(finals[0])}`} />
          </span>
          <span style={{display: 'inline-block', width: '2rem'}} />
          <span className={styles.col2}>
            <Formula math={`${pair(pts[1])} \\mapsto ${pair(finals[1])}`} />
          </span>
        </p>
        <p>
          {flat
            ? sameFinal
              ? 'O número ad − bc é zero. A malha inteira caiu numa reta (ou num ponto), e os dois pontos foram para o mesmo lugar. Olhando só o ponto de chegada, não há como saber de qual dos dois ele veio: a matriz não tem inversa.'
              : 'O número ad − bc é zero, e a malha caiu numa reta.'
            : 'O número ad − bc não é zero. A malha continua cobrindo o plano, e os dois pontos chegam a lugares diferentes. Cada ponto de chegada diz de onde veio.'}
        </p>
      </div>
      {!slider && (
        <div className={shared.buttons}>
          <button type="button" onClick={() => play()} disabled={playing}>
            {replayLabel}
          </button>
        </div>
      )}
    </div>
  );
}
