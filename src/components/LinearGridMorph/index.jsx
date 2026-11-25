import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from './styles.module.css';
import {
  Arrow,
  Axes,
  ClipDefs,
  Dot,
  FixedGrid,
  Label,
  MovedGrid,
  bmatrix,
  clamp01,
  frame,
  lerp,
  num,
  pair,
  pairText,
  polygonPath,
  toneVar,
} from './plane';

// A malha do plano se deformando aos poucos, da identidade até a
// transformação (lição 11.6).
//
// O caminho do movimento depende do tipo de transformação:
// - matriz qualquer: a matriz do meio do caminho é (1 − s)I + sA, então cada
//   ponto anda em linha reta até o destino;
// - rotação (`rotation`, em graus): o ângulo cresce de 0 até θ, e a malha gira
//   inteira, sem se deformar no meio (a mistura de I com A encolheria);
// - translação (`shift`): a malha escorrega; com matriz e translação juntas,
//   primeiro age a matriz e depois a malha escorrega (camada W x + b);
// - mapas que entortam (`warp`): 'parabola' é (x, y + x²/4), 'square' é
//   (x², y). As linhas da malha são amostradas e saem curvas.
//
// O quadro final (o do build e o de quem pediu menos movimento) é a
// transformação inteira. Rótulos só aparecem com a figura parada, para nenhum
// quadro do meio ter rótulo atravessando o desenho.

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

const apply = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];

function stateAt(spec, s) {
  if (spec.warp === 'parabola') {
    return {map: (p) => [p[0], p[1] + (s * p[0] * p[0]) / 4], curved: true};
  }
  if (spec.warp === 'square') {
    return {map: (p) => [lerp(p[0], p[0] * p[0], s), p[1]], curved: true};
  }
  const hasLin = spec.rotation != null || !!spec.matrix;
  const hasShift = !!spec.shift;
  let s1 = s;
  let s2 = 0;
  if (hasLin && hasShift) {
    s1 = clamp01(s / 0.55);
    s2 = clamp01((s - 0.6) / 0.4);
  } else if (hasShift) {
    s1 = 0;
    s2 = s;
  }
  let M = I;
  if (spec.rotation != null) M = rot(spec.rotation * s1);
  else if (spec.matrix) M = mix(spec.matrix, s1);
  const b = hasShift ? [spec.shift[0] * s2, spec.shift[1] * s2] : [0, 0];
  const map = (p) => {
    const q = apply(M, p);
    return [q[0] + b[0], q[1] + b[1]];
  };
  return {map, M, b, curved: false, s1, s2, angle: spec.rotation != null ? spec.rotation * s1 : null};
}

// A especificação que o deslizante produz, a partir do valor escolhido.
function sliderSpec(kind, value) {
  if (kind === 'rotation') return {rotation: value};
  if (kind === 'shear') return {matrix: [[1, value], [0, 1]]};
  if (kind === 'scaleX') return {matrix: [[value, 0], [0, 1]]};
  if (kind === 'uniform') return {matrix: [[value, 0], [0, value]]};
  return null;
}

function arcD(f, r, a0, a1) {
  const p0 = f.P([r * Math.cos(a0), r * Math.sin(a0)]);
  const p1 = f.P([r * Math.cos(a1), r * Math.sin(a1)]);
  const R = r * f.unit;
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 >= a0 ? 0 : 1;
  return `M ${p0[0]} ${p0[1]} A ${R} ${R} 0 ${large} ${sweep} ${p1[0]} ${p1[1]}`;
}

export default function LinearGridMorph({
  matrix,
  rotation,
  shift,
  warp,
  formula,
  note,
  presets,
  initialPreset = 0,
  slider,
  vectors = [],
  points = [],
  dots,
  dotTrails = false,
  polygon,
  trace,
  labels = [],
  showGrid = true,
  ghost = true,
  showBasis = true,
  showSquare = true,
  showCircle = false,
  showAngle = false,
  showOrigin = false,
  readout = true,
  basisLabels,
  basisOffsets,
  window: win = [-4, 4, -3, 3],
  unit = 34,
  extent = 7,
  duration = 3,
  replayLabel = 'Ver o movimento de novo',
  caption,
  label = 'Malha do plano se deformando',
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initialPreset);
  const [value, setValue] = useState(slider?.initial ?? 0);
  const [manual, setManual] = useState(null); // deslizante de progresso

  const {ref, t, play, playing} = useAnimation({
    duration,
    onFrame: () => setManual(null),
  });

  // A especificação atual: a do botão escolhido, ou a das props; o deslizante
  // de parâmetro, se houver, troca a matriz.
  const base = presets
    ? presets[idx]
    : {matrix, rotation, shift, warp, formula, note, vectors, points, polygon, basisLabels, basisOffsets};
  let spec = {...base};
  if (slider && slider.kind !== 'progress') spec = {...spec, ...sliderSpec(slider.kind, value)};
  const specVectors = base.vectors ?? vectors;
  const specPoints = base.points ?? points;
  const specPolygon = base.polygon ?? polygon;
  const specBasisLabels = base.basisLabels ?? basisLabels;

  let s = stage(t, 0.2, Math.max(0.4, duration - 0.15));
  if (!playing && manual !== null) s = manual;
  const st = stateAt(spec, s);
  const {map} = st;
  const still = !playing;
  const done = s >= 0.999;
  const atStart = s <= 0.001;

  const f = frame(win, unit);
  const clipId = `clip${uid}`;

  const o = map([0, 0]);
  const t1 = map([1, 0]);
  const t2 = map([0, 1]);
  const c1 = [t1[0] - o[0], t1[1] - o[1]];
  const c2 = [t2[0] - o[0], t2[1] - o[1]];
  const digits = spec.digits ?? (spec.rotation != null ? 3 : 2);
  const linear = !spec.warp;

  // Rótulos da base: e1 e e2 no começo; no fim, os de `basisLabels` ou as
  // coordenadas das colunas (que valem em qualquer instante).
  let lb1 = null;
  let lb2 = null;
  if (still && specBasisLabels !== false) {
    if (atStart) {
      lb1 = '\\vec{e}_1';
      lb2 = '\\vec{e}_2';
    } else if (specBasisLabels) {
      if (done) [lb1, lb2] = specBasisLabels;
    } else if (linear && !spec.shift) {
      lb1 = pair(c1, digits);
      lb2 = pair(c2, digits);
    }
  }
  const lbOff = base.basisOffsets ?? [];

  const lattice = [];
  if (dots) {
    for (let x = dots[0]; x <= dots[1]; x += 1) for (let y = dots[2]; y <= dots[3]; y += 1) lattice.push([x, y]);
  }

  const steps = (vv) => {
    const out = [];
    let cur = o;
    const n1 = Math.round(Math.abs(vv[0]));
    const n2 = Math.round(Math.abs(vv[1]));
    const sg1 = Math.sign(vv[0]);
    const sg2 = Math.sign(vv[1]);
    for (let i = 0; i < n1; i += 1) {
      const nx = [cur[0] + sg1 * c1[0], cur[1] + sg1 * c1[1]];
      out.push({a: cur, b: nx, tone: 1});
      cur = nx;
    }
    for (let i = 0; i < n2; i += 1) {
      const nx = [cur[0] + sg2 * c2[0], cur[1] + sg2 * c2[1]];
      out.push({a: cur, b: nx, tone: 2});
      cur = nx;
    }
    return out;
  };

  const traceSamples = () => {
    const pts = [];
    const n = 40;
    for (let i = 0; i <= n; i += 1) {
      const si = (s * i) / n;
      pts.push(f.P(stateAt(spec, si).map(trace.at)));
    }
    return `M ${pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')}`;
  };

  // ---------------------------------------------------------------------
  // Painel de números
  let readoutBody = null;
  if (readout) {
    const lines = [];
    if (spec.formula) {
      lines.push(
        <p key="f" className={shared.formula}>
          <Formula math={spec.formula} />
        </p>,
      );
    } else if (linear) {
      const M = [
        [c1[0], c2[0]],
        [c1[1], c2[1]],
      ];
      const lead = st.angle != null ? `\\text{giro de } ${num(st.angle, 1)}^\\circ\\text{:}\\quad ` : '';
      lines.push(
        <p key="m" className={shared.formula}>
          <Formula math={`${lead}${bmatrix(M, digits)}`} />
        </p>,
      );
      lines.push(
        <p key="c">
          <span className={styles.col1}>Primeira coluna {pairText(c1, digits)}</span>: para onde foi e₁.{' '}
          <span className={styles.col2}>Segunda coluna {pairText(c2, digits)}</span>: para onde foi e₂.
        </p>,
      );
    }
    if (spec.note) lines.push(<p key="n">{spec.note}</p>);
    readoutBody = (
      <div className={shared.readout} aria-live="polite">
        {lines}
      </div>
    );
  }

  const sliderValue = slider?.kind === 'progress' ? Math.round(s * 100) : value;

  return (
    <div className={shared.wrapper} data-explorer="linear-grid-morph">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={label}>
          <ClipDefs f={f} id={clipId} />
          {ghost && <FixedGrid f={f} clipId={clipId} />}
          {showGrid && <MovedGrid f={f} map={map} extent={extent} curved={st.curved} clipId={clipId} />}
          {showSquare && (
            <path
              d={polygonPath(f, [[0, 0], [1, 0], [1, 1], [0, 1]], map, st.curved)}
              fill="var(--mv-tone-3)"
              fillOpacity="var(--mv-fill-opacity)"
              stroke="var(--mv-tone-3)"
              strokeWidth={1.5}
              clipPath={`url(#${clipId})`}
            />
          )}
          <Axes f={f} />
          {showCircle && (
            <circle cx={f.X(0)} cy={f.Y(0)} r={unit} fill="none" stroke="var(--mv-guide)" strokeWidth={1.4} strokeDasharray="4 4" />
          )}
          {showAngle && st.angle != null && Math.abs(st.angle) > 1 && (
            <g>
              <path d={arcD(f, 0.42, 0, (st.angle * Math.PI) / 180)} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
              {still && (
                <Label
                  f={f}
                  at={[0.75 * Math.cos((st.angle * Math.PI) / 360), 0.75 * Math.sin((st.angle * Math.PI) / 360)]}
                  math={`${num(st.angle, 0)}^\\circ`}
                  fontSize={12}
                  dx={6}
                />
              )}
            </g>
          )}
          {specPolygon && (
            <g>
              {!atStart && (
                <path
                  d={polygonPath(f, specPolygon.points, (p) => p)}
                  fill="none"
                  stroke={toneVar(specPolygon.ghostTone ?? 0)}
                  strokeWidth={1.4}
                  strokeDasharray="5 4"
                  opacity={0.7}
                />
              )}
              <path
                d={polygonPath(f, specPolygon.points, map, st.curved)}
                fill={toneVar(specPolygon.tone ?? 1)}
                fillOpacity={0.28}
                stroke={toneVar(specPolygon.tone ?? 1)}
                strokeWidth={2}
              />
            </g>
          )}
          {lattice.map((p) => {
            const q = map(p);
            const a = f.P(p);
            const b = f.P(q);
            return (
              <g key={`d${p[0]},${p[1]}`}>
                {dotTrails && !atStart && (
                  <>
                    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--mv-guide)" strokeWidth={1.2} strokeDasharray="3 3" />
                    <circle cx={a[0]} cy={a[1]} r={3} fill="var(--mv-paper)" stroke="var(--mv-guide)" strokeWidth={1.2} />
                  </>
                )}
                <circle cx={b[0]} cy={b[1]} r={3.6} fill="var(--ifm-color-emphasis-700)" />
              </g>
            );
          })}
          {specVectors.map((vv, i) =>
            vv.steps
              ? steps(vv.v).map((sg, j) => {
                  const a = f.P(sg.a);
                  const b = f.P(sg.b);
                  return (
                    <g key={`st${i}-${j}`}>
                      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={toneVar(sg.tone)} strokeWidth={6} strokeOpacity={0.4} strokeLinecap="round" />
                      <circle cx={b[0]} cy={b[1]} r={3} fill={toneVar(sg.tone)} />
                    </g>
                  );
                })
              : null,
          )}
          {specPoints.map((pt, i) => {
            const q = map(pt.at);
            const a = f.P(pt.at);
            const b = f.P(q);
            const off = done ? pt.imageOffset : pt.offset;
            const lab = done ? pt.imageLabel : atStart ? pt.label : null;
            return (
              <g key={`p${i}`}>
                {pt.trail && !atStart && (
                  <>
                    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={toneVar(pt.tone ?? 3)} strokeWidth={1.4} strokeDasharray="4 4" />
                    <circle cx={a[0]} cy={a[1]} r={4} fill="var(--mv-paper)" stroke={toneVar(pt.tone ?? 3)} strokeWidth={1.6} />
                  </>
                )}
                <Dot f={f} at={q} tone={pt.tone ?? 3} r={5} />
                {still && lab && (
                  <Label f={f} at={q} math={lab} tone={pt.tone ?? 3} dx={off?.[0] ?? 0} dy={off?.[1] ?? -16} anchor={off?.[2] ?? 'middle'} />
                )}
              </g>
            );
          })}
          {specVectors.map((vv, i) => {
            let lab = still ? (done ? vv.imageLabel : atStart ? vv.label : null) : null;
            if (still && !atStart && vv.imageLabel === 'auto') lab = pair(map(vv.v), digits);
            const off = atStart ? vv.offset : vv.imageOffset;
            return (
              <Arrow key={`v${i}`} f={f} from={[0, 0]} to={map(vv.v)} tone={vv.tone ?? 3} label={lab} offset={off} />
            );
          })}
          {showBasis && (
            <>
              <Arrow f={f} from={o} to={t1} tone={1} label={lb1} offset={lbOff[0]} />
              <Arrow f={f} from={o} to={t2} tone={2} label={lb2} offset={lbOff[1]} />
            </>
          )}
          {specPolygon?.labels?.map((lb, i) => {
            const lab = still ? (done ? lb.imageLabel : atStart ? lb.label : null) : null;
            if (!lab) return null;
            const off = done ? lb.imageOffset : lb.offset;
            return (
              <g key={`pl${i}`}>
                <Dot f={f} at={map(lb.at)} tone={specPolygon.tone ?? 1} r={3.5} />
                <Label f={f} at={map(lb.at)} math={lab} tone={specPolygon.tone ?? 1} dx={off?.[0] ?? 0} dy={off?.[1] ?? -14} anchor={off?.[2] ?? 'middle'} fontSize={12} />
              </g>
            );
          })}
          {(base.labels ?? labels).map((lb, i) => (
            <Label key={`fl${i}`} f={f} at={lb.at} math={lb.math} tone={lb.tone} dx={lb.dx ?? 0} dy={lb.dy ?? 0} anchor={lb.anchor ?? 'middle'} fontSize={lb.fontSize ?? 13} />
          ))}
          {showOrigin && Math.hypot(o[0], o[1]) > 0.02 && (
            <g>
              <Dot f={f} at={[0, 0]} tone={2} r={5} open />
              <Dot f={f} at={o} tone={2} r={5.5} />
              {still && done && (
                <Label
                  f={f}
                  at={o}
                  math={`T(\\vec{0}) = ${pair(o)}`}
                  tone={2}
                  dx={f.X(o[0]) + 130 > f.W ? -10 : 10}
                  dy={16}
                  anchor={f.X(o[0]) + 130 > f.W ? 'end' : 'start'}
                />
              )}
            </g>
          )}
          {trace && (
            <g>
              {!atStart && <path d={traceSamples()} fill="none" stroke={toneVar(trace.tone ?? 2)} strokeWidth={1.6} strokeDasharray="4 4" />}
              <Dot f={f} at={map(trace.at)} tone={trace.tone ?? 2} r={5} />
              {still && trace.label && (
                <Label
                  f={f}
                  at={map(trace.at)}
                  math={trace.label}
                  tone={trace.tone ?? 2}
                  dx={trace.offset?.[0] ?? 0}
                  dy={trace.offset?.[1] ?? -18}
                  anchor={trace.offset?.[2] ?? 'middle'}
                />
              )}
            </g>
          )}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      {presets && (
        <div className={shared.buttons} role="group" aria-label="Escolha a transformação">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={i === idx ? styles.active : undefined}
              aria-pressed={i === idx}
              onClick={() => {
                setIdx(i);
                setManual(null);
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
              {slider.label}: <strong>{slider.kind === 'progress' ? `${sliderValue}%` : numText(sliderValue, slider.digits ?? 2)}{slider.unit ?? ''}</strong>
            </span>
            <input
              type="range"
              min={slider.kind === 'progress' ? 0 : slider.min}
              max={slider.kind === 'progress' ? 100 : slider.max}
              step={slider.kind === 'progress' ? 5 : slider.step}
              value={sliderValue}
              disabled={playing}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (slider.kind === 'progress') setManual(val / 100);
                else setValue(val);
              }}
              aria-label={slider.label}
            />
          </label>
        </div>
      )}
      {readoutBody}
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

function numText(v, digits) {
  const r = Number(Number(v).toFixed(digits));
  return String(Object.is(r, -0) ? 0 : r).replace('.', ',').replace('-', '−');
}
