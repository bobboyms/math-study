import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, Label, bmatrix, frame, num, numText, pair, toneVar} from '../LinearGridMorph/plane';
import {apply2, stageMatrix} from '../DetGridMorph/det';
import {svd2} from './svd';

// O círculo de raio 1 virando a sua imagem pela matriz (lição 11.13).
//
// A matriz do instante anda da identidade até a matriz em linha reta
// ((1 − s)I + sA); uma rotação (`rotation`, em graus) gira sem encolher. Oito
// pontos do círculo viajam junto (`dots`). Com `singular`, as setas v1 e v2
// (direções de maior e menor esticamento) viajam até Av1 e Av2, com o ângulo
// reto marcado nos dois pares. Com `orientation`, o quarto de disco entre as
// duas setas de partida fica pintado, com um arco que vai da primeira para a
// segunda: depois de um espelho, o arco anda no sentido contrário.
//
// O painel escreve a matriz e, com a figura parada, o que o círculo virou:
// elipse (semieixos σ1 e σ2), círculo, segmento ou ponto.

const PRE = 0.3;
const RIGHT = 0.28;

function shapeOf(s1, s2) {
  if (s1 < 1e-7) return 'point';
  if (s2 < 1e-7) return 'segment';
  if (Math.abs(s1 - s2) < 1e-7) return 'circle';
  return 'ellipse';
}

function curvePath(f, pts) {
  return `M ${pts.map((p) => {
    const q = f.P(p);
    return `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  }).join(' L ')}`;
}

// Marca de ângulo reto entre as direções a e b, na origem (em pixels).
function RightMark({f, a, b, size = RIGHT, tone}) {
  const la = Math.hypot(a[0], a[1]);
  const lb = Math.hypot(b[0], b[1]);
  if (la < 1e-6 || lb < 1e-6) return null;
  const k = size;
  const p1 = [(a[0] / la) * k, (a[1] / la) * k];
  const p3 = [(b[0] / lb) * k, (b[1] / lb) * k];
  const p2 = [p1[0] + p3[0], p1[1] + p3[1]];
  return (
    <path
      d={`M ${f.X(p1[0])} ${f.Y(p1[1])} L ${f.X(p2[0])} ${f.Y(p2[1])} L ${f.X(p3[0])} ${f.Y(p3[1])}`}
      fill="none"
      stroke={toneVar(tone)}
      strokeWidth={1.4}
    />
  );
}

export default function SvdCircleMorph({
  presets,
  initial = 0,
  window: rootWindow = [-3, 3, -3, 3],
  unit = 44,
  duration = 2.6,
  replayLabel = 'Ver de novo',
  caption,
  label,
  ...rootConfig
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initial);
  const cfg = presets ? {...rootConfig, ...presets[idx]} : rootConfig;
  const total = PRE + duration + 0.2;
  const {ref, t, play, playing} = useAnimation({duration: total});
  const s = stage(Math.min(t, total), PRE, PRE + duration);
  const atRest = !playing;

  const st = cfg.rotation != null ? {rotation: cfg.rotation} : {matrix: cfg.matrix};
  const A = stageMatrix(st, 1);
  const C = stageMatrix(st, s);
  const map = (p) => apply2(C, p);
  const d = svd2(A, cfg.v1);
  const shape = shapeOf(d.s1, d.s2);

  const win = cfg.window ?? rootWindow;
  const f = frame(win, cfg.unit ?? unit);
  const clipId = `clip${uid}`;

  const N = 144;
  const circle = [];
  for (let i = 0; i <= N; i += 1) {
    const a = (i / N) * 2 * Math.PI;
    circle.push([Math.cos(a), Math.sin(a)]);
  }
  const image = circle.map(map);

  const singular = cfg.singular ?? false;
  const showDots = cfg.dots ?? !singular;
  const orientation = cfg.orientation ?? false;
  const base1 = singular || orientation ? d.v1 : [1, 0];
  const base2 = singular || orientation ? d.v2 : [0, 1];

  // Quarto de disco entre as duas setas de partida, e o arco de orientação.
  const a0 = Math.atan2(base1[1], base1[0]);
  const sector = [[0, 0]];
  for (let i = 0; i <= 24; i += 1) {
    const a = a0 + (i / 24) * (Math.PI / 2);
    sector.push([Math.cos(a), Math.sin(a)]);
  }
  const arc = [];
  for (let i = 0; i <= 20; i += 1) {
    const a = a0 + 0.18 + (i / 20) * (Math.PI / 2 - 0.36);
    arc.push([0.55 * Math.cos(a), 0.55 * Math.sin(a)]);
  }
  const arcImg = arc.map(map);
  const tipA = f.P(arcImg[arcImg.length - 2]);
  const tipB = f.P(arcImg[arcImg.length - 1]);
  const ux = tipB[0] - tipA[0];
  const uy = tipB[1] - tipA[1];
  const ul = Math.hypot(ux, uy) || 1;
  const hx = ux / ul;
  const hy = uy / ul;
  const head = `M ${tipB[0] + hx * 4} ${tipB[1] + hy * 4} L ${tipB[0] - hx * 5 - hy * 4} ${tipB[1] - hy * 5 + hx * 4} L ${tipB[0] - hx * 5 + hy * 4} ${tipB[1] - hy * 5 - hx * 4} Z`;

  const dots = [];
  for (let k = 0; k < 8; k += 1) {
    const a = (k * Math.PI) / 4;
    dots.push([Math.cos(a), Math.sin(a)]);
  }

  const name = cfg.name ?? 'A';
  const im1 = map(base1);
  const im2 = map(base2);
  const lab = cfg.arrowLabels ?? {};
  const off = cfg.offsets ?? {};

  let shapeText;
  if (shape === 'point') shapeText = <>O círculo inteiro foi parar num <strong>ponto</strong>, a origem: a matriz leva todo vetor no vetor nulo. Os dois valores singulares são 0.</>;
  else if (shape === 'segment')
    shapeText = (
      <>
        O círculo foi achatado num <strong>segmento</strong> de meio comprimento σ₁ = {numText(d.s1)}: uma direção foi esmagada até a
        origem, e σ₂ = 0.
      </>
    );
  else if (shape === 'circle')
    shapeText = (
      <>
        O círculo continua um <strong>círculo</strong>, de raio {numText(d.s1)}: nenhuma direção estica mais que outra, e σ₁ = σ₂ ={' '}
        {numText(d.s1)}.
      </>
    );
  else
    shapeText = (
      <>
        O círculo virou uma <strong>elipse</strong>. Semieixo maior σ₁ ≈ {numText(d.s1)}; semieixo menor σ₂ ≈ {numText(d.s2)}.
      </>
    );

  const readout = (
    <div className={shared.readout} aria-live="polite">
      <p className={shared.formula}>
        <Formula math={`${name} = ${cfg.matrixTex ?? bmatrix(A, 2)}`} />
      </p>
      {atRest && <p>{shapeText}</p>}
      {atRest && singular && shape !== 'point' && (
        <p className={shared.formula}>
          <Formula
            math={`\\vec{v}_1 = ${pair(d.v1)},\\ ${name}\\vec{v}_1 = ${pair(d.Av1)}; \\qquad \\vec{v}_2 = ${pair(d.v2)},\\ ${name}\\vec{v}_2 = ${pair(d.Av2)}`}
          />
        </p>
      )}
      {atRest && cfg.note && <p className={shared.hint}>{cfg.note}</p>}
    </div>
  );

  return (
    <div className={shared.wrapper} data-explorer="svd-circle-morph">
      <figure className={styles.figure} ref={ref}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${f.W} ${f.H}`}
          style={{maxWidth: `${f.W}px`}}
          role="img"
          aria-label={label ?? `O círculo de raio 1 virando a sua imagem pela matriz ${name}`}
        >
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <Axes f={f} />
          <g clipPath={`url(#${clipId})`}>
            <path d={`${curvePath(f, circle)} Z`} fill="none" stroke="var(--mv-guide)" strokeWidth={1.4} strokeDasharray="5 4" />
            {orientation && (
              <path d={`${curvePath(f, sector.map(map))} Z`} fill="var(--mv-tone-3)" fillOpacity={0.25} stroke="none" />
            )}
            <path d={`${curvePath(f, image)} Z`} fill="var(--mv-tone-3)" fillOpacity={0.1} stroke="var(--mv-tone-3)" strokeWidth={2.4} />
            {orientation && (
              <g>
                <path d={curvePath(f, arcImg)} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2} />
                {ul > 0.5 && <path d={head} fill="var(--mv-tone-3)" />}
              </g>
            )}
            {showDots &&
              dots.map((p, k) => {
                const q = f.P(map(p));
                return <circle key={k} cx={q[0]} cy={q[1]} r={3.6} fill="var(--ifm-color-emphasis-700)" />;
              })}
          </g>

          {(singular || orientation) && (
            <>
              {singular && atRest && s > 0.99 && (
                <>
                  <Arrow f={f} to={base1} tone={1} opacity={0.45} width={2} label={lab.v1 ?? '\\vec{v}_1'} offset={off.v1} />
                  <Arrow f={f} to={base2} tone={2} opacity={0.45} width={2} label={lab.v2 ?? '\\vec{v}_2'} offset={off.v2} />
                  <RightMark f={f} a={base1} b={base2} tone={0} />
                  {shape === 'ellipse' || shape === 'circle' ? <RightMark f={f} a={im1} b={im2} tone={3} size={0.42} /> : null}
                </>
              )}
              <Arrow f={f} to={im1} tone={1} label={atRest ? (s > 0.99 ? lab.Av1 ?? `${name}\\vec{v}_1` : lab.v1 ?? '\\vec{v}_1') : null} offset={s > 0.99 ? off.Av1 : off.v1} />
              <Arrow f={f} to={im2} tone={2} label={atRest ? (s > 0.99 ? lab.Av2 ?? `${name}\\vec{v}_2` : lab.v2 ?? '\\vec{v}_2') : null} offset={s > 0.99 ? off.Av2 : off.v2} />
            </>
          )}
          {atRest && (cfg.labels ?? []).map((lb, i) => (
            <Label key={i} f={f} at={lb.at} math={lb.math} tone={lb.tone} dx={lb.dx ?? 0} dy={lb.dy ?? 0} anchor={lb.anchor ?? 'middle'} />
          ))}
        </svg>
        {(cfg.caption ?? caption) && <figcaption className={styles.caption}>{cfg.caption ?? caption}</figcaption>}
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
      {readout}
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
