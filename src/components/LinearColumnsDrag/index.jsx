import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {
  Arrow,
  Axes,
  ClipDefs,
  FixedGrid,
  MovedGrid,
  PAD,
  bmatrix,
  frame,
  lerp,
  num,
  pair,
  pairText,
  polygonPath,
  toneVar,
} from '../LinearGridMorph/plane';

// As colunas da matriz são os destinos de e1 e e2 (lição 11.6).
//
// O aluno arrasta as pontas das setas azul (destino de e1) e laranja (destino
// de e2). A malha inteira acompanha, e o painel escreve a matriz com essas
// duas setas como colunas. O vetor v (padrão (1, 2)) é refeito na malha nova
// com a mesma receita: x passos do novo e1 (faixa azul) e y passos do novo e2
// (faixa laranja). A ponta verde é T(v), e o painel faz a conta pelas colunas.
//
// As pontas também andam pelo teclado (setas, de meia em meia casa). Ao
// entrar na tela, as pontas saem de e1 e e2 e caminham até a matriz inicial.

const DEFAULT_PRESETS = [
  {label: 'Começo', cols: [[2, 1], [-1, 1]]},
  {label: 'Identidade', cols: [[1, 0], [0, 1]]},
  {label: 'Esticar', cols: [[2, 0], [0, 1]]},
  {label: 'Girar 90°', cols: [[0, 1], [-1, 0]]},
  {label: 'Cisalhar', cols: [[1, 0], [1, 1]]},
  {label: 'Achatar', cols: [[1, 0], [0, 0]]},
];

export default function LinearColumnsDrag({
  initial = [[2, 1], [-1, 1]],
  v = [1, 2],
  presets = DEFAULT_PRESETS,
  window: win = [-4, 4, -2, 4],
  unit = 40,
  snap = 0.5,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const svgRef = useRef(null);
  const [cols, setCols] = useState(initial);
  const [drag, setDrag] = useState(null);

  const {ref, play, playing} = useAnimation({
    duration: 2.6,
    onFrame: (time) => {
      const s = stage(time, 0.2, 2.4);
      setCols([
        [lerp(1, initial[0][0], s), lerp(0, initial[0][1], s)],
        [lerp(0, initial[1][0], s), lerp(1, initial[1][1], s)],
      ]);
    },
  });

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const [c1, c2] = cols;
  const map = (p) => [p[0] * c1[0] + p[1] * c2[0], p[0] * c1[1] + p[1] * c2[1]];
  const Tv = map(v);
  const det = c1[0] * c2[1] - c1[1] * c2[0];

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
    const d = {ArrowLeft: [-snap, 0], ArrowRight: [snap, 0], ArrowUp: [0, snap], ArrowDown: [0, -snap]}[e.key];
    if (!d) return;
    e.preventDefault();
    const c = cols[which];
    setCol(which, [c[0] + d[0], c[1] + d[1]]);
  };

  // Receita de v na malha nova: x passos de c1, depois y passos de c2.
  const steps = [];
  {
    let cur = [0, 0];
    const n1 = Math.round(Math.abs(v[0]));
    const n2 = Math.round(Math.abs(v[1]));
    for (let i = 0; i < n1; i += 1) {
      const nx = [cur[0] + Math.sign(v[0]) * c1[0], cur[1] + Math.sign(v[0]) * c1[1]];
      steps.push({a: cur, b: nx, tone: 1});
      cur = nx;
    }
    for (let i = 0; i < n2; i += 1) {
      const nx = [cur[0] + Math.sign(v[1]) * c2[0], cur[1] + Math.sign(v[1]) * c2[1]];
      steps.push({a: cur, b: nx, tone: 2});
      cur = nx;
    }
  }

  // Rótulo de T(v): perto de uma das pontas, vai para o outro lado na vertical,
  // para não cair em cima do rótulo da ponta.
  const near = [c1, c2].find((c) => Math.hypot(c[0] - Tv[0], c[1] - Tv[1]) < 1.6);
  const tvOffset = near ? [0, Tv[1] >= near[1] ? -18 : 24] : undefined;

  const M = [
    [c1[0], c2[0]],
    [c1[1], c2[1]],
  ];
  const handle = (which, c, tone) => {
    const p = f.P(c);
    return (
      <g
        className={styles.handle}
        tabIndex={0}
        role="button"
        aria-label={`Ponta da seta para onde vai e${which + 1}, agora em ${pairText(c)}. Arraste ou use as setas do teclado.`}
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
    <div className={shared.wrapper} data-explorer="linear-columns-drag">
      <figure className={styles.figure} ref={ref}>
        <svg
          ref={svgRef}
          className={`${styles.svg} ${drag !== null ? styles.dragging : ''}`}
          viewBox={`0 0 ${f.W} ${f.H}`}
          style={{maxWidth: `${f.W}px`, touchAction: drag !== null ? 'none' : undefined}}
          role="img"
          aria-label="Malha transformada pela matriz cujas colunas são as duas setas arrastáveis"
        >
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <MovedGrid f={f} map={map} extent={8} clipId={clipId} />
          <path
            d={polygonPath(f, [[0, 0], [1, 0], [1, 1], [0, 1]], map)}
            fill="var(--mv-tone-3)"
            fillOpacity="var(--mv-fill-opacity)"
            stroke="var(--mv-tone-3)"
            strokeWidth={1.5}
            clipPath={`url(#${clipId})`}
          />
          <Axes f={f} />
          {steps.map((sg, j) => {
            const a = f.P(sg.a);
            const b = f.P(sg.b);
            return (
              <g key={j}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={toneVar(sg.tone)} strokeWidth={6} strokeOpacity={0.4} strokeLinecap="round" />
                <circle cx={b[0]} cy={b[1]} r={3} fill={toneVar(sg.tone)} />
              </g>
            );
          })}
          <Arrow
            f={f}
            to={Tv}
            tone={3}
            label={playing || drag !== null ? null : 'T(\\vec{v})'}
            offset={tvOffset}
          />
          <Arrow f={f} to={c1} tone={1} label={playing ? null : pair(c1)} offset={c1[1] < -0.2 ? [0, 22] : undefined} />
          <Arrow f={f} to={c2} tone={2} label={playing ? null : pair(c2)} offset={c2[1] < -0.2 ? [0, 22] : undefined} />
          {handle(0, c1, 1)}
          {handle(1, c2, 2)}
        </svg>
        <figcaption className={styles.caption}>
          {caption ??
            'Arraste as pontas redondas: a azul é para onde vai e₁, a laranja é para onde vai e₂. A malha inteira acompanha. A faixa colorida refaz a receita de v na malha nova (1 passo azul, 2 passos laranja) e termina na ponta verde, T(v).'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`A = ${bmatrix(M)}`} />
        </p>
        <p>
          <span className={styles.col1}>Primeira coluna {pairText(c1)}</span>: a ponta azul, para onde foi e₁.{' '}
          <span className={styles.col2}>Segunda coluna {pairText(c2)}</span>: a ponta laranja, para onde foi e₂.
        </p>
        <p className={shared.formula}>
          <Formula
            math={`T${pair(v)} = ${num(v[0])}${pair(c1)} + ${num(v[1])}${pair(c2)} = ${pair(Tv)}`}
          />
        </p>
        {Math.abs(det) < 1e-9 && (
          <p>As duas colunas estão na mesma reta (ou uma delas é a origem): a malha achatou, e o plano inteiro cai numa reta ou num ponto.</p>
        )}
        <p className={shared.hint}>
          A última conta é a leitura pelas colunas do produto{' '}
          <Formula math={`A\\begin{bmatrix} ${num(v[0])} \\\\ ${num(v[1])} \\end{bmatrix}`} />: {num(v[0]).replace('{,}', ',')} vez a
          primeira coluna, mais {num(v[1]).replace('{,}', ',')} vezes a segunda.
        </p>
      </div>
      <div className={shared.buttons} role="group" aria-label="Escolher as duas colunas">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={playing}
            onClick={() => setCols(p.cols)}
          >
            {p.label}
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver as pontas saírem de e₁ e e₂
        </button>
      </div>
    </div>
  );
}
