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
  num,
  numText,
  pair,
  polygonPath,
  toneVar,
} from '../LinearGridMorph/plane';
import {I2, apply2, clean, det2, mul2, signedArea, stageMatrix} from './det';

// A malha do plano se deformando, com o determinante acompanhando (lição 11.9).
//
// Uma ou mais etapas (`stages`), aplicadas em sequência: cada etapa é uma
// matriz (cada ponto anda em linha reta, (1 − s)I + sM) ou uma rotação (o
// ângulo cresce, sem encolher no meio). O painel mostra o determinante da
// transformação do instante e, com mais de uma etapa, a cadeia de fatores
// 1 → ×det → ×det.
//
// Peças opcionais, no tom 3 (as áreas): o quadrado de lado 1, um terreno de
// lotes (`lots: [w, h]`, w × h quadrados de lado 1) ou uma região qualquer
// (`region`), com a área antes e agora no painel. `points` acompanha pontos,
// com rastro. Com `hideNumbers`, o painel não entrega as áreas (motivador).
//
// Os botões (`presets`) trocam a configuração inteira e animam de novo.
// Rótulos só com a figura parada.

const PRE = 0.3;
const GAP = 0.6;

function normalize(c) {
  if (c.stages) return c.stages;
  if (c.rotation != null) return [{rotation: c.rotation}];
  if (c.matrix) return [{matrix: c.matrix}];
  return [];
}

const stageDet = (st) => (st.rotation != null ? 1 : det2(st.matrix));

export default function DetGridMorph({
  presets,
  initial = 0,
  window: rootWindow = [-2, 5, -2, 4],
  unit = 40,
  extent = 10,
  stageDuration = 2.4,
  hideNumbers = false,
  replayLabel = 'Ver de novo',
  label,
  caption,
  ...rootConfig
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initial);
  const cfg = presets ? {...rootConfig, ...presets[idx]} : rootConfig;
  const stages = normalize(cfg);
  const n = stages.length;
  const D = cfg.stageDuration ?? stageDuration;
  const duration = PRE + n * D + Math.max(0, n - 1) * GAP + 0.2;

  const {ref, t, play, playing} = useAnimation({duration});
  const tt = Math.min(t, duration);

  // Matriz acumulada no instante.
  let C = I2;
  const progress = stages.map((st, i) => {
    const a = PRE + i * (D + GAP);
    const s = stage(tt, a, a + D);
    C = mul2(stageMatrix(st, s), C);
    return s;
  });
  const done = progress.filter((s) => s >= 1).length;
  const atRest = !playing;
  const d = det2(C);
  const map = (p) => apply2(C, p);

  const win = cfg.window ?? rootWindow;
  const f = frame(win, unit);
  const clipId = `clip${uid}`;

  const col1 = [C[0][0], C[1][0]];
  const col2 = [C[0][1], C[1][1]];
  const showBasis = cfg.showBasis ?? true;
  const showSquare = cfg.showSquare ?? !cfg.lots;
  const basisOffsets = cfg.basisOffsets ?? [];
  const finalM = stages.reduce((acc, st) => mul2(stageMatrix(st, 1), acc), I2);
  const finalDet = clean(det2(finalM));

  // Terreno de lotes.
  const lots = cfg.lots;
  const cells = [];
  if (lots) {
    for (let i = 0; i < lots[0]; i += 1)
      for (let j = 0; j < lots[1]; j += 1)
        cells.push([
          [i, j],
          [i + 1, j],
          [i + 1, j + 1],
          [i, j + 1],
        ]);
  }

  // Região com área medida.
  const region = cfg.region;
  const areaBefore = region ? Math.abs(signedArea(region.points)) : 0;
  const areaNow = region ? Math.abs(signedArea(region.points.map(map))) : 0;
  const centroid = (pts) => [
    pts.reduce((s, p) => s + p[0], 0) / pts.length,
    pts.reduce((s, p) => s + p[1], 0) / pts.length,
  ];

  const square = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];

  const absD = Math.abs(d);
  const areaTex = num(absD);
  const areaTxt = numText(absD);

  // Cadeia de fatores (mais de uma etapa).
  let chain = '1';
  let acc = 1;
  stages.forEach((st, i) => {
    if (i < done) {
      const k = clean(stageDet(st));
      acc = clean(acc * k);
      chain += ` \\xrightarrow{${st.name ? `${st.name}:\\ ` : ''}\\times ${num(k)}} ${num(acc)}`;
    }
  });

  const readout = (
    <div className={shared.readout} aria-live="polite">
      {hideNumbers ? (
        <p className={shared.formula}>
          <Formula math={`${cfg.name ?? 'A'} = ${bmatrix(finalM)}`} />
        </p>
      ) : (
        <>
          <p className={shared.formula}>
            <Formula math={`\\det ${bmatrix(C)} = ${num(d)}`} />
          </p>
          {n > 1 && (
            <>
              <p>Área com sinal do quadrado de lado 1, etapa por etapa:</p>
              <p className={shared.formula}>
                <Formula math={chain} />
              </p>
            </>
          )}
          {n <= 1 && !lots && !region && (
            <p>
              O quadrado de lado 1 (verde) tem agora área <strong>{areaTxt}</strong>.
            </p>
          )}
          {lots && (
            <p>
              Cada lote tem agora <strong>{areaTxt} hectare{absD >= 2 || absD === 0 ? 's' : ''}</strong>. O
              terreno de {lots[0]} × {lots[1]} = {lots[0] * lots[1]} lotes tem agora{' '}
              <strong>{numText(lots[0] * lots[1] * absD)} hectares</strong>.
            </p>
          )}
          {region && (
            <p>
              Área da região: antes <strong>{numText(areaBefore)}</strong>, agora{' '}
              <strong>{numText(areaNow)}</strong>.{' '}
              {areaBefore > 0 && tt > PRE + 0.05 && (
                <>
                  Ela ficou <strong>{numText(areaNow / areaBefore)}</strong> vezes maior; o quadrado de
                  lado 1 ficou <strong>{areaTxt}</strong> vezes maior.
                </>
              )}
            </p>
          )}
          {atRest && finalDet < 0 && (
            <p>O determinante é negativo: a área é o valor sem o sinal, e o plano foi virado.</p>
          )}
          {atRest && finalDet === 0 && (
            <p>O determinante é zero: o plano inteiro foi achatado numa reta, e toda área virou zero.</p>
          )}
        </>
      )}
      {cfg.note && atRest && <p className={shared.hint}>{cfg.note}</p>}
    </div>
  );

  return (
    <div className={shared.wrapper} data-explorer="det-grid-morph">
      <figure className={styles.figure} ref={ref}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${f.W} ${f.H}`}
          style={{maxWidth: `${f.W}px`}}
          role="img"
          aria-label={label ?? 'A malha do plano se deformando até a transformação'}
        >
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <MovedGrid f={f} map={map} extent={extent} clipId={clipId} />
          <Axes f={f} />

          <g clipPath={`url(#${clipId})`}>
            {cells.map((c, i) => (
              <path
                key={`c${i}`}
                d={polygonPath(f, c, map)}
                fill="var(--mv-tone-3)"
                fillOpacity={i === 0 ? 0.42 : 0.14}
                stroke="var(--mv-tone-3)"
                strokeWidth={i === 0 ? 2 : 1.2}
              />
            ))}
            {region && (
              <>
                <path d={polygonPath(f, region.points, (p) => p)} fill="none" stroke="var(--mv-tone-3)" strokeWidth={1.2} strokeDasharray="5 4" />
                <path
                  d={polygonPath(f, region.points, map)}
                  fill="var(--mv-tone-3)"
                  fillOpacity={0.3}
                  stroke="var(--mv-tone-3)"
                  strokeWidth={2}
                />
              </>
            )}
            {showSquare && !region && (
              <path
                d={polygonPath(f, square, map)}
                fill="var(--mv-tone-3)"
                fillOpacity={0.3}
                stroke="var(--mv-tone-3)"
                strokeWidth={1.6}
              />
            )}
            {(cfg.points ?? []).map((pt, i) => {
              const a = f.P(pt.at);
              const b = f.P(map(pt.at));
              return (
                <g key={`p${i}`}>
                  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={toneVar(pt.tone ?? 2)} strokeWidth={1.4} strokeDasharray="4 4" />
                  <Dot f={f} at={pt.at} tone={pt.tone ?? 2} open />
                  <Dot f={f} at={map(pt.at)} tone={pt.tone ?? 2} />
                </g>
              );
            })}
          </g>

          {showBasis && (
            <>
              <Arrow f={f} to={col1} tone={1} label={atRest ? pair(col1) : null} offset={basisOffsets[0]} />
              <Arrow f={f} to={col2} tone={2} label={atRest ? pair(col2) : null} offset={basisOffsets[1]} />
            </>
          )}

          {atRest && lots && Math.abs(finalDet) > 1e-9 && (
            <Label
              f={f}
              at={map([0.5, 0.5])}
              math={hideNumbers ? '?' : `${areaTex}\\ \\text{ha}`}
              tone={3}
              dx={cfg.lotLabelOffset?.[0] ?? 0}
              dy={cfg.lotLabelOffset?.[1] ?? 0}
              fontSize={14}
            />
          )}
          {atRest && region?.label && (
            <Label f={f} at={centroid(region.points.map(map))} math={region.label} tone={3} dx={region.offset?.[0] ?? 0} dy={region.offset?.[1] ?? 0} />
          )}
          {atRest &&
            (cfg.points ?? []).map((pt, i) => (
              <g key={`pl${i}`}>
                {pt.label && (
                  <Label f={f} at={pt.at} math={pt.label} tone={pt.tone ?? 2} dx={pt.offset?.[0] ?? 0} dy={pt.offset?.[1] ?? -14} anchor={pt.offset?.[2] ?? 'middle'} />
                )}
                {pt.imageLabel && (
                  <Label
                    f={f}
                    at={map(pt.at)}
                    math={pt.imageLabel}
                    tone={pt.tone ?? 2}
                    dx={pt.imageOffset?.[0] ?? 0}
                    dy={pt.imageOffset?.[1] ?? -14}
                    anchor={pt.imageOffset?.[2] ?? 'middle'}
                  />
                )}
              </g>
            ))}
          {atRest &&
            (cfg.labels ?? []).map((lb, i) => (
              <Label key={`l${i}`} f={f} at={lb.at} math={lb.math} tone={lb.tone} dx={lb.dx ?? 0} dy={lb.dy ?? 0} anchor={lb.anchor ?? 'middle'} />
            ))}
        </svg>
        {(cfg.caption ?? caption) && <figcaption className={styles.caption}>{cfg.caption ?? caption}</figcaption>}
      </figure>
      {presets && (
        <div className={shared.buttons} role="group" aria-label="Escolha a transformação">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={i === idx ? styles.active : undefined}
              aria-pressed={i === idx}
              disabled={playing}
              onClick={() => {
                const k = normalize({...rootConfig, ...p}).length;
                const dd = p.stageDuration ?? stageDuration;
                setIdx(i);
                play({duration: PRE + k * dd + Math.max(0, k - 1) * GAP + 0.2});
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      {readout}
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
