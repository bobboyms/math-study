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
  frame,
  lerp,
  pair,
  polygonPath,
  toneVar,
} from '../LinearGridMorph/plane';

// A malha do plano passando por uma sequência de transformações, uma depois
// da outra (lição 11.8, Matriz inversa).
//
// Cada etapa age sobre o plano que a etapa anterior deixou: durante a etapa k,
// a matriz do instante é S_k(s) vezes o acumulado das etapas anteriores, em que
// S_k(s) vai da identidade até a matriz da etapa (em linha reta, ou girando o
// ângulo, numa rotação). Assim “A e depois A⁻¹” mostra a malha indo e
// voltando, e “S, A, A⁻¹, S⁻¹” mostra a meia e o sapato.
//
// Os pontos marcados deixam um rastro tracejado pelas paradas. Entre uma
// etapa e outra há uma pausa: com tudo parado, os pontos mostram as
// coordenadas. O painel escreve o caminho de cada ponto, etapa por etapa.

const ID = [
  [1, 0],
  [0, 1],
];

const mul = (A, B) => [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];

const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

const rot = (deg) => {
  const a = (deg * Math.PI) / 180;
  return [
    [Math.cos(a), -Math.sin(a)],
    [Math.sin(a), Math.cos(a)],
  ];
};

const mix = (A, s) => [
  [lerp(1, A[0][0], s), lerp(0, A[0][1], s)],
  [lerp(0, A[1][0], s), lerp(1, A[1][1], s)],
];

const stageMatrix = (st, s) => (st.rotation != null ? rot(st.rotation * s) : mix(st.matrix, s));

const MOVE = 1.7; // segundos de cada etapa
const PAUSE = 0.6; // pausa entre etapas
const LEAD = 0.3;

export default function InverseRoundTrip({
  stages,
  points = [],
  presets,
  initialPreset = 0,
  note,
  showBasis = true,
  showSquare = true,
  window: win = [-3, 5, -2, 4],
  unit = 38,
  extent = 9,
  digits = 2,
  replayLabel = 'Ver de novo',
  caption,
  label = 'Malha do plano passando por transformações em sequência',
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initialPreset);
  const spec = presets ? presets[idx] : {stages, points, note};
  const sts = spec.stages;
  const pts = spec.points ?? points;
  const n = sts.length;
  const duration = LEAD + n * MOVE + (n - 1) * PAUSE + 0.2;

  const {ref, t, play, playing} = useAnimation({duration});

  // Acumulados: cum[k] é o efeito das k primeiras etapas.
  const cum = [ID];
  sts.forEach((st) => cum.push(mul(stageMatrix(st, 1), cum[cum.length - 1])));

  // Em que etapa estamos, e quanto dela já aconteceu.
  let k = n - 1;
  let s = 1;
  let moving = false;
  for (let i = 0; i < n; i += 1) {
    const a = LEAD + i * (MOVE + PAUSE);
    const b = a + MOVE;
    if (t < a) {
      k = i;
      s = 0;
      break;
    }
    if (t <= b) {
      k = i;
      s = stage(t, a, b);
      moving = s > 0.001 && s < 0.999;
      break;
    }
  }
  const M = mul(stageMatrix(sts[k], s), cum[k]);
  const map = (p) => apply(M, p);
  // quantas etapas já terminaram
  const doneCount = s >= 0.999 ? k + 1 : k;
  const still = !moving;
  const finished = doneCount === n && !playing;

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const o = map([0, 0]);
  const t1 = map([1, 0]);
  const t2 = map([0, 1]);

  // Caminho de cada ponto pelas paradas já feitas, mais a posição atual.
  const trailOf = (p) => {
    const stops = [];
    for (let i = 0; i <= doneCount; i += 1) stops.push(apply(cum[i], p));
    if (moving) stops.push(map(p));
    return stops;
  };

  const chainTex = (p) => {
    let out = pair(p, digits);
    for (let i = 0; i < doneCount; i += 1) {
      out += ` \\xrightarrow{\\;${sts[i].tex}\\;} ${pair(apply(cum[i + 1], p), digits)}`;
    }
    return out;
  };

  return (
    <div className={shared.wrapper} data-explorer="inverse-round-trip">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={label}>
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <MovedGrid f={f} map={map} extent={extent} clipId={clipId} />
          {showSquare && (
            <path
              d={polygonPath(f, [[0, 0], [1, 0], [1, 1], [0, 1]], map)}
              fill="var(--mv-tone-3)"
              fillOpacity="var(--mv-fill-opacity)"
              stroke="var(--mv-tone-3)"
              strokeWidth={1.5}
              clipPath={`url(#${clipId})`}
            />
          )}
          <Axes f={f} />
          {showBasis && (
            <>
              <Arrow f={f} from={o} to={t1} tone={1} />
              <Arrow f={f} from={o} to={t2} tone={2} />
            </>
          )}
          {pts.map((pt, i) => {
            const stops = trailOf(pt.at);
            const tone = pt.tone ?? 3;
            const cur = stops[stops.length - 1];
            const start = pt.at;
            const back = Math.hypot(cur[0] - start[0], cur[1] - start[1]) < 0.02;
            const d = stops.map((q) => f.P(q)).map((q, j) => `${j ? 'L' : 'M'} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
            const offs = pt.offsets ?? [];
            const off = offs[doneCount] ?? pt.offset ?? [0, -16, 'middle'];
            return (
              <g key={`p${i}`}>
                {stops.length > 1 && (
                  <path d={d} fill="none" stroke={toneVar(tone)} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.85} />
                )}
                {doneCount > 0 && !back && <Dot f={f} at={start} tone={tone} r={4.5} open />}
                {/* paradas intermediárias: bolinha vazada e, com tudo parado, as coordenadas */}
                {(() => {
                  const seen = new Set([`${start[0].toFixed(3)},${start[1].toFixed(3)}`, `${cur[0].toFixed(3)},${cur[1].toFixed(3)}`]);
                  const out = [];
                  stops.slice(1, -1).forEach((q, j) => {
                    const key = `${q[0].toFixed(3)},${q[1].toFixed(3)}`;
                    if (seen.has(key)) return;
                    seen.add(key);
                    const so = pt.stopOffsets?.[j] ?? [10, -12, 'start'];
                    out.push(
                      <g key={`s${j}`}>
                        <Dot f={f} at={q} tone={tone} r={3.5} open />
                        {still && (
                          <Label f={f} at={q} math={pair(q, digits)} tone={tone} dx={so[0]} dy={so[1]} anchor={so[2] ?? 'start'} fontSize={12} />
                        )}
                      </g>,
                    );
                  });
                  return out;
                })()}
                <Dot f={f} at={cur} tone={tone} r={5.5} />
                {still && (
                  <Label f={f} at={cur} math={pair(cur, digits)} tone={tone} dx={off[0]} dy={off[1]} anchor={off[2] ?? 'middle'} />
                )}
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      {presets && (
        <div className={shared.buttons} role="group" aria-label="Escolha a sequência">
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
      <div className={shared.readout} aria-live="polite">
        <p>
          {sts.map((st, i) => {
            const active = i === k && moving;
            const done = i < doneCount;
            return (
              <span
                key={`c${i}`}
                style={{
                  display: 'inline-block',
                  margin: '0 0.4rem 0.3rem 0',
                  padding: '0.1rem 0.5rem',
                  borderRadius: '4px',
                  border: `1px solid ${active ? 'var(--mv-tone-2)' : 'var(--ifm-color-emphasis-300)'}`,
                  background: active ? 'color-mix(in srgb, var(--mv-tone-2) 14%, transparent)' : 'transparent',
                  opacity: done || active ? 1 : 0.6,
                }}
              >
                {i + 1}. {st.text ?? ''} <Formula math={st.tex} />
              </span>
            );
          })}
        </p>
        {pts.map((pt, i) => (
          <p key={`r${i}`} className={shared.formula}>
            <Formula math={chainTex(pt.at)} />
          </p>
        ))}
        {finished && spec.note && <p>{spec.note}</p>}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
