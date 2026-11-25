import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, MovedGrid, PAD, frame, lerp, num, pair, pairText, toneVar} from '../LinearGridMorph/plane';

// A área do paralelogramo das colunas e o determinante, juntos (lição 11.9).
//
// O aluno arrasta as pontas das duas colunas: azul (para onde vai e1) e
// laranja (para onde vai e2). O paralelogramo das colunas fica verde. O
// painel faz a conta ad − bc e dá a área. Um arco com seta mostra o giro mais
// curto da coluna azul até a laranja: anti-horário (como de e1 para e2) ou
// horário (o plano foi virado). Quando o determinante é negativo, o
// paralelogramo fica hachurado: é o verso da folha. Embaixo, uma reta numérica
// marca o determinante, e a faixa verde vai do zero até ele.
//
// `path: {to}` anima a coluna laranja da posição inicial até `to`, em linha
// reta (para mostrar o determinante passando por zero). Sem `path`, as pontas
// saem de e1 e e2 e caminham até as colunas iniciais.

const DEFAULT_PRESETS = [
  {label: 'Loteamento', cols: [[3, 1], [1, 2]]},
  {label: 'Colunas trocadas', cols: [[1, 2], [3, 1]]},
  {label: 'Reflexão no eixo y', cols: [[-1, 0], [0, 1]]},
  {label: 'Colunas na mesma reta', cols: [[2, 1], [-2, -1]]},
];

const BAR = 12;

export default function DetColumnsDrag({
  initial = [[3, 1], [1, 2]],
  path,
  presets = DEFAULT_PRESETS,
  window: win = [-3, 5, -3, 4],
  unit = 40,
  snap = 0.5,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const svgRef = useRef(null);
  const [cols, setCols] = useState(path ? [initial[0], path.to] : initial);
  const [drag, setDrag] = useState(null);

  const {ref, play, playing} = useAnimation({
    duration: path ? 4 : 2.6,
    onFrame: (time) => {
      if (path) {
        const s = stage(time, 0.4, 3.6);
        setCols([initial[0], [lerp(initial[1][0], path.to[0], s), lerp(initial[1][1], path.to[1], s)]]);
      } else {
        const s = stage(time, 0.2, 2.4);
        setCols([
          [lerp(1, initial[0][0], s), lerp(0, initial[0][1], s)],
          [lerp(0, initial[1][0], s), lerp(1, initial[1][1], s)],
        ]);
      }
    },
  });

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const hatchId = `hatch${uid}`;
  const [c1, c2] = cols;
  const map = (p) => [p[0] * c1[0] + p[1] * c2[0], p[0] * c1[1] + p[1] * c2[1]];
  const det = c1[0] * c2[1] - c2[0] * c1[1];
  const flat = Math.abs(det) < 1e-9;
  const atRest = !playing && drag === null;

  const clampSnap = (x, lo, hi) => Math.min(hi, Math.max(lo, Math.round(x / snap) * snap));
  const toMath = (e) => {
    const svg = svgRef.current;
    if (!svg || !svg.getScreenCTM) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const q = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [f.xMin + (q.x - PAD) / unit, f.yMax - (q.y - PAD) / unit];
  };
  const setCol = (which, p) => {
    const q = [clampSnap(p[0], f.xMin + 0.5, f.xMax - 0.5), clampSnap(p[1], f.yMin + 0.5, f.yMax - 0.5)];
    setCols((old) => (which === 0 ? [q, old[1]] : [old[0], q]));
  };
  const onMove = (e) => {
    if (drag === null) return;
    const p = toMath(e);
    if (p) setCol(drag, p);
  };
  const onKey = (which) => (e) => {
    const dd = {ArrowLeft: [-snap, 0], ArrowRight: [snap, 0], ArrowUp: [0, snap], ArrowDown: [0, -snap]}[e.key];
    if (!dd) return;
    e.preventDefault();
    const c = cols[which];
    setCol(which, [c[0] + dd[0], c[1] + dd[1]]);
  };

  // Arco do giro mais curto da coluna azul até a laranja.
  const a1 = Math.atan2(c1[1], c1[0]);
  const a2 = Math.atan2(c2[1], c2[0]);
  let diff = a2 - a1;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff <= -Math.PI) diff += 2 * Math.PI;
  const r = 0.8 * unit;
  const O = f.P([0, 0]);
  const arcPts = [];
  for (let i = 0; i <= 24; i += 1) {
    const a = a1 + (diff * i) / 24;
    arcPts.push([O[0] + r * Math.cos(a), O[1] - r * Math.sin(a)]);
  }
  const showArc = !flat && Math.hypot(...c1) > 0.4 && Math.hypot(...c2) > 0.4 && Math.abs(diff) > 0.12;
  const end = arcPts[arcPts.length - 1];
  const prev = arcPts[arcPts.length - 3];
  const ux = end[0] - prev[0];
  const uy = end[1] - prev[1];
  const ul = Math.hypot(ux, uy) || 1;
  const hx = ux / ul;
  const hy = uy / ul;
  const head = `M ${end[0] + hx * 4} ${end[1] + hy * 4} L ${end[0] - hx * 6 - hy * 5} ${end[1] - hy * 6 + hx * 5} L ${end[0] - hx * 6 + hy * 5} ${end[1] - hy * 6 - hx * 5} Z`;

  const quad = [[0, 0], c1, [c1[0] + c2[0], c1[1] + c2[1]], c2].map((p) => f.P(p).map((v) => v.toFixed(1)).join(' '));
  const quadPath = `M ${quad.join(' L ')} Z`;

  // Reta numérica do determinante.
  const BW = f.W;
  const BH = 64;
  const bx = (v) => PAD + ((Math.max(-BAR, Math.min(BAR, v)) + BAR) / (2 * BAR)) * (BW - 2 * PAD);
  const by = 26;

  const par = (v) => (v < 0 ? `(${num(v)})` : num(v));
  const orient = flat
    ? 'As duas colunas estão na mesma reta (ou uma delas é a origem): não há giro de uma para a outra, e o plano foi achatado.'
    : det > 0
      ? 'Da coluna azul para a laranja, o giro mais curto é anti-horário, como de e₁ para e₂ no plano original. O plano não foi virado.'
      : 'Da coluna azul para a laranja, o giro mais curto é horário, o contrário de e₁ para e₂. O plano foi virado: o paralelogramo mostra o verso (hachurado).';

  const handle = (which, c, tone) => {
    const p = f.P(c);
    return (
      <g
        className={styles.handle}
        tabIndex={0}
        role="button"
        aria-label={`Ponta da coluna ${which + 1}, agora em ${pairText(c)}. Arraste ou use as setas do teclado.`}
        onPointerDown={(e) => {
          if (playing) return;
          e.preventDefault();
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setDrag(which);
        }}
        onPointerMove={onMove}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
        onKeyDown={onKey(which)}
      >
        <circle cx={p[0]} cy={p[1]} r={16} fill="transparent" />
        <circle cx={p[0]} cy={p[1]} r={8} fill="var(--mv-paper)" stroke={toneVar(tone)} strokeWidth={2.6} />
      </g>
    );
  };

  return (
    <div className={shared.wrapper} data-explorer="det-columns-drag">
      <figure className={styles.figure} ref={ref}>
        <svg
          ref={svgRef}
          className={`${styles.svg} ${drag !== null ? styles.dragging : ''}`}
          viewBox={`0 0 ${f.W} ${f.H}`}
          style={{maxWidth: `${f.W}px`, touchAction: drag !== null ? 'none' : undefined}}
          role="img"
          aria-label="Paralelogramo das duas colunas arrastáveis, com a área e o determinante"
        >
          <defs>
            <pattern id={hatchId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="var(--mv-tone-3)" fillOpacity="0.12" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="var(--mv-tone-3)" strokeWidth="2.2" strokeOpacity="0.75" />
            </pattern>
          </defs>
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <MovedGrid f={f} map={map} extent={8} clipId={clipId} />
          <Axes f={f} />
          <path
            d={quadPath}
            fill={det < 0 ? `url(#${hatchId})` : 'var(--mv-tone-3)'}
            fillOpacity={det < 0 ? 1 : 0.3}
            stroke="var(--mv-tone-3)"
            strokeWidth={2}
            clipPath={`url(#${clipId})`}
          />
          {showArc && (
            <g>
              <path
                d={`M ${arcPts.map((q) => q.map((v) => v.toFixed(1)).join(' ')).join(' L ')}`}
                fill="none"
                stroke="var(--ifm-color-emphasis-800)"
                strokeWidth={2}
              />
              <path d={head} fill="var(--ifm-color-emphasis-800)" />
            </g>
          )}
          <Arrow f={f} to={c1} tone={1} label={atRest ? pair(c1) : null} offset={c1[1] < -0.2 ? [0, 22] : undefined} />
          <Arrow f={f} to={c2} tone={2} label={atRest ? pair(c2) : null} offset={c2[1] < -0.2 ? [0, 22] : undefined} />
          {handle(0, c1, 1)}
          {handle(1, c2, 2)}
        </svg>
        <svg className={styles.svg} viewBox={`0 0 ${BW} ${BH}`} style={{maxWidth: `${BW}px`}} role="img" aria-label={`Reta numérica com o determinante em ${num(det).replace('{,}', ',')}`}>
          <line x1={PAD} x2={BW - PAD} y1={by} y2={by} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
          {[-10, -5, 0, 5, 10].map((v) => (
            <g key={v}>
              <line x1={bx(v)} x2={bx(v)} y1={by - 5} y2={by + 5} stroke="var(--ifm-color-emphasis-600)" strokeWidth={v === 0 ? 2 : 1.2} />
              <SvgMath x={bx(v)} y={by + 18} math={String(v)} fontSize={12} />
            </g>
          ))}
          <line x1={bx(0)} x2={bx(det)} y1={by} y2={by} stroke="var(--mv-tone-3)" strokeWidth={7} strokeOpacity={0.7} strokeLinecap="round" />
          <circle cx={bx(det)} cy={by} r={6} fill="var(--mv-tone-3)" />
          <SvgMath x={bx(det)} y={by - 15} math={`\\det = ${num(det)}`} fontSize={13} tone={3} halo />
        </svg>
        <figcaption className={styles.caption}>
          {caption ??
            'Arraste as pontas redondas: a azul é para onde vai e₁, a laranja é para onde vai e₂. O arco com seta mostra o giro mais curto da coluna azul até a laranja. Embaixo, a faixa verde vai do zero até o determinante.'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`\\det \\begin{bmatrix} ${num(c1[0])} & ${num(c2[0])} \\\\ ${num(c1[1])} & ${num(c2[1])} \\end{bmatrix} = ${par(c1[0])} \\times ${par(c2[1])} - ${par(c2[0])} \\times ${par(c1[1])} = ${num(det)}`}
          />
        </p>
        <p>
          Área do paralelogramo verde: <strong>{num(Math.abs(det)).replace('{,}', ',')}</strong>, o determinante sem o
          sinal.
        </p>
        <p>{orient}</p>
      </div>
      <div className={shared.buttons} role="group" aria-label="Escolher as duas colunas">
        {presets.map((p) => (
          <button key={p.label} type="button" disabled={playing} onClick={() => setCols(p.cols)}>
            {p.label}
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          {path ? 'Ver a coluna laranja atravessar de novo' : 'Ver de novo'}
        </button>
      </div>
    </div>
  );
}
