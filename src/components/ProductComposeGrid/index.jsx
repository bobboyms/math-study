import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import own from './styles.module.css';
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
  pair,
  pairText,
  polygonPath,
  toneVar,
} from '../LinearGridMorph/plane';

// Produto de matrizes como comandos em sequência (lição 11.7).
//
// A malha do plano passa por uma transformação de cada vez: primeiro o passo
// 1 inteiro, uma pausa, depois o passo 2 a partir de onde o passo 1 deixou, e
// assim por diante. Na pausa, as setas e1 e e2 e os pontos ganham rótulo com o
// lugar onde estão; durante o movimento, nenhum rótulo aparece.
//
// Vários painéis lado a lado (`panels`) animam ao mesmo tempo: é assim que a
// figura compara AB com BA (o mesmo logotipo indo para lugares diferentes) ou
// (AB)C com A(BC) (caminhos diferentes, mesmo lugar no fim).
//
// Caminho de cada passo: rotação (`rotation`, graus) gira sem deformar; matriz
// qualquer anda em linha reta, (1 − s)I + sA, aplicada sobre o que os passos
// anteriores já fizeram.

const I = [
  [1, 0],
  [0, 1],
];

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

const mul = (A, B) => [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];

const rounded = (M) => M.flat().some((x) => Math.abs(x * 100 - Math.round(x * 100)) > 1e-6);

const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

const fullOf = (step) => (step.rotation != null ? rot(step.rotation) : step.matrix);
const partialOf = (step, s) => (step.rotation != null ? rot(step.rotation * s) : mix(step.matrix, s));

// Nome do produto acumulado: o passo mais recente fica à esquerda, e letras
// iguais seguidas viram potência (C, C, C → C^3).
function cumName(steps, k) {
  const names = steps.slice(0, k + 1).map((st) => st.name).reverse();
  const out = [];
  names.forEach((n) => {
    const last = out[out.length - 1];
    if (last && last.n === n) last.c += 1;
    else out.push({n, c: 1});
  });
  return out.map(({n, c}) => (c > 1 ? `${n}^{${c}}` : n)).join('');
}

// Estado de um painel no progresso u (de 0 até o número de passos).
function stateAt(steps, u) {
  let M = I;
  const marks = [I];
  for (let k = 0; k < steps.length; k += 1) {
    const s = Math.max(0, Math.min(1, u - k));
    if (s <= 0) break;
    M = mul(partialOf(steps[k], s), M);
    if (s >= 1) marks.push(M);
  }
  return {M, marks};
}

function Panel({
  panel,
  u,
  moving,
  win,
  unit,
  extent,
  showGrid,
  showBasis,
  showSquare,
  polygon,
  points,
  basisLabels,
  basisOffsets,
  uid,
}) {
  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const {steps} = panel;
  const {M, marks} = stateAt(steps, u);
  const map = (p) => apply(M, p);
  const n = steps.length;
  const k = Math.round(u); // passo em que a figura está parada
  const paused = !moving && Math.abs(u - k) < 1e-3;
  const atStart = paused && k === 0;
  const done = paused && k === n;
  const c1 = [M[0][0], M[1][0]];
  const c2 = [M[0][1], M[1][1]];

  const pPolygon = panel.polygon ?? polygon;
  const pPoints = panel.points ?? points;
  const pBasis = panel.basisLabels ?? basisLabels;

  let lb1 = null;
  let lb2 = null;
  if (paused && pBasis !== false) {
    if (atStart) {
      lb1 = '\\vec{e}_1';
      lb2 = '\\vec{e}_2';
    } else if (pBasis && pBasis[k - 1]) {
      [lb1, lb2] = pBasis[k - 1];
    } else if (!pBasis) {
      lb1 = pair(c1);
      lb2 = pair(c2);
    }
  }
  const bOff = ((panel.basisOffsets ?? basisOffsets) || [])[k] || [];

  return (
    <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={panel.aria ?? 'Malha do plano passando pelos comandos, um de cada vez'}>
      <ClipDefs f={f} id={clipId} />
      <FixedGrid f={f} clipId={clipId} />
      {showGrid && <MovedGrid f={f} map={map} extent={extent} clipId={clipId} />}
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
      {pPolygon && (
        <g>
          {u > 1e-3 && (
            <path
              d={polygonPath(f, pPolygon.points, (p) => p)}
              fill="none"
              stroke={toneVar(pPolygon.tone ?? 3)}
              strokeWidth={1.4}
              strokeDasharray="5 4"
              opacity={0.75}
            />
          )}
          <path
            d={polygonPath(f, pPolygon.points, map)}
            fill={toneVar(pPolygon.tone ?? 3)}
            fillOpacity={0.3}
            stroke={toneVar(pPolygon.tone ?? 3)}
            strokeWidth={2}
            clipPath={`url(#${clipId})`}
          />
        </g>
      )}
      {showBasis && (
        <>
          <Arrow f={f} from={[0, 0]} to={c1} tone={1} label={lb1} offset={bOff[0]} />
          <Arrow f={f} from={[0, 0]} to={c2} tone={2} label={lb2} offset={bOff[1]} />
        </>
      )}
      {pPoints.map((pt, i) => {
        const tone = pt.tone ?? 3;
        // rastro: o ponto em cada parada já alcançada, e o ponto agora
        const path = marks.map((Mk) => f.P(apply(Mk, pt.at)));
        path.push(f.P(map(pt.at)));
        const d = `M ${path.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')}`;
        let lab = null;
        if (paused) {
          if (pt.labels && pt.labels[k] !== undefined) lab = pt.labels[k];
          else lab = pair(map(pt.at));
        }
        const off = (pt.offsets && pt.offsets[k]) || [0, -16, 'middle'];
        return (
          <g key={`p${i}`}>
            {pt.trail !== false && u > 1e-3 && (
              <>
                <path d={d} fill="none" stroke={toneVar(tone)} strokeWidth={1.5} strokeDasharray="4 4" />
                {marks
                  .filter((_, j) => j < marks.length - (paused ? 1 : 0))
                  .map((Mk, j) => (
                    <Dot key={j} f={f} at={apply(Mk, pt.at)} tone={tone} r={3.6} open />
                  ))}
              </>
            )}
            <Dot f={f} at={map(pt.at)} tone={tone} r={5} />
            {lab && <Label f={f} at={map(pt.at)} math={lab} tone={tone} dx={off[0]} dy={off[1]} anchor={off[2] ?? 'middle'} fontSize={13} />}
          </g>
        );
      })}
      {(panel.labels ?? []).map((lb, i) => (
        <Label key={`fl${i}`} f={f} at={lb.at} math={lb.math} tone={lb.tone} dx={lb.dx ?? 0} dy={lb.dy ?? 0} anchor={lb.anchor ?? 'middle'} fontSize={lb.fontSize ?? 13} />
      ))}
    </svg>
  );
}

export default function ProductComposeGrid({
  steps,
  panels,
  cumNames,
  presets,
  initialPreset = 0,
  polygon,
  points = [],
  basisLabels,
  basisOffsets,
  showGrid = true,
  showBasis = true,
  showSquare = true,
  readout = true,
  progress = false,
  window: win = [-3, 3, -2, 3],
  unit = 34,
  extent = 8,
  stepDuration = 1.5,
  pause = 0.8,
  caption,
  label = 'Comandos aplicados ao plano, um de cada vez',
  replayLabel = 'Ver os comandos de novo',
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initialPreset);
  const [manual, setManual] = useState(null);

  const base = presets ? presets[idx] : {steps, panels, cumNames};
  const list = base.panels ?? [{steps: base.steps, cumNames: base.cumNames}];
  const lead = 0.3;
  const stepsOf = (b) => Math.max(...(b.panels ?? [{steps: b.steps}]).map((p) => p.steps.length));
  const durationOf = (b) => {
    const m = stepsOf(b);
    return lead + m * stepDuration + (m - 1) * pause + 0.2;
  };
  const n = stepsOf(base);
  const duration = durationOf(base);

  const {ref, t, play, playing} = useAnimation({
    duration,
    onFrame: () => setManual(null),
  });

  // progresso u: 0 no começo, k ao fim do passo k
  let u = n;
  let moving = false;
  if (playing || manual === null) {
    u = 0;
    for (let k = 0; k < n; k += 1) {
      const a = lead + k * (stepDuration + pause);
      const s = ease((t - a) / stepDuration);
      u += s;
      if (playing && s > 0.001 && s < 0.999) moving = true;
    }
  }
  if (!playing && manual !== null) {
    u = manual;
    moving = Math.abs(u - Math.round(u)) > 1e-3;
  }

  const stepChip = (st, k, panelSteps) => {
    const active = u > k + 1e-3 && u < k + 1 - 1e-3;
    const finished = u >= k + 1 - 1e-3;
    return (
      <span key={k} className={`${own.chip} ${active ? own.chipActive : ''} ${finished ? own.chipDone : ''}`}>
        {k + 1}. <Formula math={st.name} />
        {st.text ? `: ${st.text}` : ''}
      </span>
    );
  };

  const readoutFor = (p, pi) => {
    if (!readout) return null;
    const lines = [];
    const reached = Math.floor(u + 1e-3);
    for (let k = 0; k < Math.min(reached, p.steps.length); k += 1) {
      const Mk = stateAt(p.steps, k + 1).M;
      const nm = p.cumNames?.[k] ?? cumName(p.steps, k);
      lines.push(
        <p key={k} className={shared.formula}>
          <Formula math={`\\text{depois do passo ${k + 1}:}\\quad ${nm} ${rounded(Mk) ? '\\approx' : '='} ${bmatrix(Mk)}`} />
        </p>,
      );
    }
    if (lines.length === 0) {
      lines.push(<p key="z">Nenhum comando ainda: a matriz é a identidade.</p>);
    }
    if (reached >= p.steps.length) {
      const Mn = stateAt(p.steps, p.steps.length).M;
      lines.push(
        <p key="c" className={own.small}>
          <span className={styles.col1}>Primeira coluna {pairText([Mn[0][0], Mn[1][0]])}</span>: onde e₁ terminou.{' '}
          <span className={styles.col2}>Segunda coluna {pairText([Mn[0][1], Mn[1][1]])}</span>: onde e₂ terminou.
        </p>,
      );
    }
    if (p.note && reached >= p.steps.length) lines.push(<p key="n" className={own.small}>{p.note}</p>);
    return (
      <div className={shared.readout} aria-live="polite" key={`r${pi}`}>
        {lines}
      </div>
    );
  };

  return (
    <div className={shared.wrapper} data-explorer="product-compose-grid">
      <figure className={styles.figure} ref={ref} aria-label={label}>
        <div className={own.panels}>
          {list.map((p, pi) => (
            <div className={own.panel} key={pi}>
              {p.title && (
                <div className={own.title}>
                  <Formula math={p.title} />
                </div>
              )}
              <div className={own.chips}>{p.steps.map((st, k) => stepChip(st, k, p.steps))}</div>
              <Panel
                panel={p}
                u={Math.min(u, p.steps.length)}
                moving={moving && u < p.steps.length}
                win={p.window ?? base.window ?? win}
                unit={p.unit ?? base.unit ?? unit}
                extent={extent}
                showGrid={showGrid}
                showBasis={showBasis}
                showSquare={p.showSquare ?? base.showSquare ?? showSquare}
                polygon={base.polygon ?? polygon}
                points={base.points ?? points}
                basisLabels={base.basisLabels ?? basisLabels}
                basisOffsets={base.basisOffsets ?? basisOffsets}
                uid={`${uid}-${idx}-${pi}`}
              />
              {readoutFor(p, pi)}
            </div>
          ))}
        </div>
        {(base.caption ?? caption) && <figcaption className={styles.caption}>{base.caption ?? caption}</figcaption>}
      </figure>
      {base.note && <p className={own.note}>{base.note}</p>}
      {presets && (
        <div className={shared.buttons} role="group" aria-label="Escolha os comandos">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={i === idx ? styles.active : undefined}
              aria-pressed={i === idx}
              onClick={() => {
                setIdx(i);
                setManual(null);
                // a duração vem do botão novo: com três passos, a animação é mais longa
                play({duration: durationOf(p)});
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      {progress && (
        <div className={shared.controls} style={{marginTop: '0.8rem'}}>
          <label className={shared.control}>
            <span>
              Quanto dos comandos já aconteceu: <strong>{Math.round((u / n) * 100)}%</strong>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={Math.round((u / n) * 100)}
              disabled={playing}
              onChange={(e) => setManual((Number(e.target.value) / 100) * n)}
              aria-label="Quanto dos comandos já aconteceu"
            />
          </label>
        </div>
      )}
      <div className={shared.buttons}>
        <button
          type="button"
          onClick={() => {
            setManual(null);
            play();
          }}
          disabled={playing}
        >
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
