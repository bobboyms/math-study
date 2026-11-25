import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, MovedGrid, bmatrix, frame, numText} from '../LinearGridMorph/plane';
import {I2, apply2, mix2, mul2, rot2} from '../DetGridMorph/det';
import {orthoKind, svd2} from '../SvdCircleMorph/svd';

// Girar, esticar, girar: A = UΣVᵀ em três passos (lição 11.13).
//
// O círculo de raio 1, as setas v1 (tom 1) e v2 (tom 2) e o quarto de disco
// entre elas passam por Vᵀ, depois por Σ, depois por U. Um giro anima o
// ângulo; um espelho anima o plano virando como uma página (a direção
// perpendicular à reta do espelho encolhe até zero e volta do outro lado), e
// a reta do espelho aparece tracejada. O arco verde vai de v1 para v2:
// depois de um espelho, ele anda no sentido contrário.
//
// Botões: ver os três passos, próximo passo, voltar ao começo; e os botões
// das matrizes (`presets`). Com `showMatrices`, o painel escreve Vᵀ, Σ e U
// (exatas, se o preset trouxer `tex`). Rótulos só com a figura parada.

const STEP = 2.2;
const GAP = 0.35;

function stepMatrix(Q, kind, s) {
  if (kind.kind === 'rotation') return rot2(kind.angle * s);
  return mix2(Q, s);
}

function curvePath(f, pts) {
  return `M ${pts.map((p) => {
    const q = f.P(p);
    return `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  }).join(' L ')}`;
}

const vezes = (x) => `${numText(x, 2)} ${Math.abs(x - 1) < 1e-9 ? 'vez' : 'vezes'}`;

const degText = (x) => `${numText(Math.abs(x), Math.abs(Math.abs(x) - Math.round(Math.abs(x))) > 0.005 ? 2 : 0)}°`;

function describe(kind, who, target) {
  if (kind.kind === 'identity') return `${who} não faz nada: ${target}`;
  if (kind.kind === 'rotation')
    return `${who} gira o plano ${degText(kind.angle)} no sentido ${kind.angle >= 0 ? 'anti-horário' : 'horário'}: ${target}`;
  return `${who} espelha o plano na reta tracejada, que faz ${degText(kind.angle)} com o eixo x: o plano vira do avesso, e ${target}`;
}

export default function SvdThreeSteps({
  presets,
  initial = 0,
  window: rootWindow = [-7.5, 7.5, -7.5, 7.5],
  unit = 26,
  showMatrices = false,
  caption,
  label,
  ...rootConfig
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initial);
  const cfg = presets ? {...rootConfig, ...presets[idx]} : rootConfig;
  const A = cfg.matrix;
  const name = cfg.name ?? 'A';
  const d = svd2(A, cfg.v1);
  const kVt = orthoKind(d.Vt);
  const kU = orthoKind(d.U);

  // Passos: de `span[0]` a `span[1]` (0 = antes de tudo, 3 = depois de U).
  const span = useRef([0, 3]);
  const [rest, setRest] = useState(3);
  const total = (n) => n * STEP + Math.max(0, n - 1) * GAP + 0.3;
  const {ref, t, play, playing} = useAnimation({
    duration: total(3),
    onFrame: (tt, tot) => {
      // Antes de começar (figura esperando entrar na tela), o quadro é o do
      // começo do trecho; no fim, o do fim.
      if (tt === 0) setRest(span.current[0]);
      if (tt >= tot) setRest(span.current[1]);
    },
  });

  const [from, to] = playing ? span.current : [rest, rest];
  const progress = [0, 0, 0];
  for (let k = 0; k < 3; k += 1) {
    if (k < from) progress[k] = 1;
    else if (k >= to) progress[k] = 0;
    else {
      const a = 0.15 + (k - from) * (STEP + GAP);
      progress[k] = stage(t, a, a + STEP);
    }
  }
  // Matriz acumulada: primeiro Vᵀ, depois Σ, depois U.
  let C = I2;
  C = mul2(stepMatrix(d.Vt, kVt, progress[0]), C);
  C = mul2(mix2(d.Sigma, progress[1]), C);
  C = mul2(stepMatrix(d.U, kU, progress[2]), C);
  const map = (p) => apply2(C, p);
  const done = playing ? -1 : rest;

  const win = cfg.window ?? rootWindow;
  const f = frame(win, cfg.unit ?? unit);
  const clipId = `clip${uid}`;

  const N = 144;
  const circle = [];
  for (let i = 0; i <= N; i += 1) {
    const a = (i / N) * 2 * Math.PI;
    circle.push([Math.cos(a), Math.sin(a)]);
  }
  const a0 = Math.atan2(d.v1[1], d.v1[0]);
  const sector = [[0, 0]];
  for (let i = 0; i <= 24; i += 1) {
    const a = a0 + (i / 24) * (Math.PI / 2);
    sector.push([Math.cos(a), Math.sin(a)]);
  }
  const arc = [];
  for (let i = 0; i <= 20; i += 1) {
    const a = a0 + 0.18 + (i / 20) * (Math.PI / 2 - 0.36);
    arc.push([0.6 * Math.cos(a), 0.6 * Math.sin(a)]);
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

  // Reta do espelho do passo que está acontecendo (ou do último feito).
  let mirror = null;
  const active = playing ? progress.findIndex((p) => p > 0 && p < 1) : rest - 1;
  if (active === 0 && kVt.kind === 'mirror') mirror = kVt.angle;
  if (active === 2 && kU.kind === 'mirror') mirror = kU.angle;
  const mirrorLine = () => {
    const r = (mirror * Math.PI) / 180;
    const R = 20;
    return {x1: f.X(-R * Math.cos(r)), y1: f.Y(-R * Math.sin(r)), x2: f.X(R * Math.cos(r)), y2: f.Y(R * Math.sin(r))};
  };

  const im1 = map(d.v1);
  const im2 = map(d.v2);
  const labels = [
    ['\\vec{v}_1', '\\vec{v}_2'],
    ['\\vec{e}_1', '\\vec{e}_2'],
    ['\\sigma_1\\vec{e}_1', '\\sigma_2\\vec{e}_2'],
    [`${name}\\vec{v}_1`, `${name}\\vec{v}_2`],
  ];
  const off = cfg.offsets?.[done] ?? [];

  const steps = [
    {
      who: 'Vᵀ',
      text: describe(kVt, 'Vᵀ', 'v₁ vai parar em e₁, e v₂ em e₂.'),
      tex: cfg.tex?.Vt ?? bmatrix(d.Vt, 2),
      name: 'V^{\\mathsf{T}}',
    },
    {
      who: 'Σ',
      text: `Σ estica o eixo x ${vezes(d.s1)} e o eixo y ${vezes(d.s2)}${d.s2 < 1 ? ' (menos que 1 vez é encolher)' : ''}. O círculo vira uma elipse deitada.`,
      tex: cfg.tex?.Sigma ?? bmatrix(d.Sigma, 2),
      name: '\\Sigma',
    },
    {
      who: 'U',
      text: describe(kU, 'U', 'e₁ vai para a direção de u₁, e e₂ para a de u₂. A elipse chega à posição final.'),
      tex: cfg.tex?.U ?? bmatrix(d.U, 2),
      name: 'U',
    },
  ];
  const current = playing ? (active >= 0 ? active : -1) : rest - 1;

  const go = (a, b) => {
    span.current = [a, b];
    play({duration: total(b - a)});
  };

  return (
    <div className={shared.wrapper} data-explorer="svd-three-steps">
      <figure className={styles.figure} ref={ref}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${f.W} ${f.H}`}
          style={{maxWidth: `${f.W}px`}}
          role="img"
          aria-label={label ?? 'O círculo de raio 1 passando por três matrizes: girar, esticar, girar'}
        >
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <g opacity={0.55}>
            <MovedGrid f={f} map={map} extent={12} clipId={clipId} />
          </g>
          <Axes f={f} />
          <g clipPath={`url(#${clipId})`}>
            {mirror != null && <line {...mirrorLine()} stroke="var(--ifm-color-emphasis-800)" strokeWidth={1.6} strokeDasharray="8 5" />}
            <path d={`${curvePath(f, circle)} Z`} fill="none" stroke="var(--mv-guide)" strokeWidth={1.3} strokeDasharray="5 4" />
            <path d={`${curvePath(f, sector.map(map))} Z`} fill="var(--mv-tone-3)" fillOpacity={0.25} stroke="none" />
            <path d={`${curvePath(f, circle.map(map))} Z`} fill="var(--mv-tone-3)" fillOpacity={0.08} stroke="var(--mv-tone-3)" strokeWidth={2.4} />
            <path d={curvePath(f, arcImg)} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2} />
            {ul > 0.5 && <path d={head} fill="var(--mv-tone-3)" />}
          </g>
          <Arrow f={f} to={im1} tone={1} label={done >= 0 ? labels[done][0] : null} offset={off[0]} />
          <Arrow f={f} to={im2} tone={2} label={done >= 0 ? labels[done][1] : null} offset={off[1]} />
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
                setRest(0);
                go(0, 3);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`${name} = ${cfg.matrixTex ?? bmatrix(A, 2)}${showMatrices ? ` = ${steps[2].tex}\\,${steps[1].tex}\\,${steps[0].tex}` : ''}`} />
        </p>
        {showMatrices && (
          <p className={shared.hint}>
            Lida da direita para a esquerda: primeiro Vᵀ, depois Σ, depois U.
          </p>
        )}
        <ol style={{margin: 0, paddingLeft: '1.3rem'}}>
          {steps.map((sp, k) => (
            <li key={k} style={{fontWeight: k === current ? 600 : 400, opacity: !playing && k >= rest ? 0.55 : 1}}>
              <strong>Passo {k + 1}.</strong> {sp.text}
            </li>
          ))}
        </ol>
        {!playing && rest === 3 && cfg.note && <p className={shared.hint}>{cfg.note}</p>}
      </div>
      <div className={shared.buttons}>
        <button type="button" disabled={playing} onClick={() => go(0, 3)}>
          Ver os três passos
        </button>
        <button type="button" disabled={playing || rest >= 3} onClick={() => go(rest, rest + 1)}>
          Próximo passo
        </button>
        <button type="button" disabled={playing || rest === 0} onClick={() => setRest(0)}>
          Voltar ao começo
        </button>
      </div>
    </div>
  );
}
