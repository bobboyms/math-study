import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, Dot, FixedGrid, Label, PAD, frame, lerp, num, pair, pairText, toneVar} from '../LinearGridMorph/plane';

// Com a inversa, A x = b tem exatamente uma solução (lição 11.8, Matriz
// inversa).
//
// O aluno arrasta o ponto b (laranja), de meia em meia casa, dentro do
// quadrado tracejado. Com a matriz A do código, aparece o único x (azul) com
// A x = b, x = A⁻¹ b, e uma seta tracejada de x até b com o nome A. Com a
// matriz B da colega, o plano inteiro vai para a reta tracejada laranja: se b
// está fora dela, nenhum x serve; se está nela, servem todos os pontos de uma
// reta inteira (azul). Ao entrar na tela, o b faz um pequeno passeio.

const PRESETS = [
  {label: 'A, do código', matrix: [[2, 1], [1, 1]], name: 'A'},
  {label: 'B, da colega', matrix: [[2, 4], [1, 2]], name: 'B'},
];

const TOUR = [
  [1, 2],
  [-1, 1],
  [2, -1],
];

export default function InverseSolveDrag({
  window: win = [-4.5, 4.5, -6.5, 6.5],
  unit = 25,
  box = [-2, 2, -2, 2],
  snap = 0.5,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const svgRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [b, setB] = useState(TOUR[TOUR.length - 1]);
  const [drag, setDrag] = useState(false);

  const {ref, playing} = useAnimation({
    duration: 3.2,
    onFrame: (time) => {
      const seg = Math.min(TOUR.length - 2, Math.floor(Math.max(0, time - 0.3) / 1.3));
      const s = stage(time, 0.3 + seg * 1.3, 0.3 + seg * 1.3 + 1.1);
      const p0 = TOUR[seg];
      const p1 = TOUR[seg + 1];
      setB([lerp(p0[0], p1[0], s), lerp(p0[1], p1[1], s)]);
    },
  });

  const {matrix: M, name} = PRESETS[idx];
  const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const f = frame(win, unit);
  const clipId = `clip${uid}`;

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
  const setFrom = (p) => setB([clampSnap(p[0], box[0], box[1]), clampSnap(p[1], box[2], box[3])]);
  const onKey = (e) => {
    const d = {ArrowLeft: [-snap, 0], ArrowRight: [snap, 0], ArrowUp: [0, snap], ArrowDown: [0, -snap]}[e.key];
    if (!d) return;
    e.preventDefault();
    setFrom([b[0] + d[0], b[1] + d[1]]);
  };

  // Solução
  let x = null;
  let onLine = false;
  if (det !== 0) {
    x = [(M[1][1] * b[0] - M[0][1] * b[1]) / det, (-M[1][0] * b[0] + M[0][0] * b[1]) / det];
  } else {
    // B = [[2, 4], [1, 2]]: alcança só os múltiplos de (2, 1); B x = b pede x + 2y = b2 e b1 = 2 b2
    onLine = Math.abs(b[0] - 2 * b[1]) < 1e-9;
  }

  const P = f.P(b);

  // Rótulos de x e de b em lados opostos: cada um do lado contrário ao outro
  // ponto. Sem x (matriz B), o rótulo de b fica para dentro do quadro.
  const side = (u, v) => ({dx: u >= 0 ? 12 : -12, anchor: u >= 0 ? 'start' : 'end', dy: v >= 0 ? -18 : 20});
  let lb;
  let lx;
  if (x && Math.hypot(b[0] - x[0], b[1] - x[1]) > 1e-9) {
    const ux = b[0] - x[0];
    const uy = b[1] - x[1];
    lb = side(ux, uy);
    lx = side(-ux, -uy);
  } else {
    lb = side(b[0] > 0 ? -1 : 1, 1);
    lx = side(1, -1);
  }
  // perto da borda, o rótulo vira para dentro (largura estimada de 95 px)
  const fit = (lab, at) => {
    const px = f.X(at[0]);
    if (lab.anchor === 'start' && px + 12 + 95 > f.W) return {...lab, dx: -12, anchor: 'end'};
    if (lab.anchor === 'end' && px - 12 - 95 < 0) return {...lab, dx: 12, anchor: 'start'};
    return lab;
  };
  lb = fit(lb, b);
  if (x) lx = fit(lx, x);
  const boxPts = [f.P([box[0], box[3]]), f.P([box[1], box[2]])];
  const ext = 20;

  let text;
  if (det !== 0) {
    text = (
      <>
        Para este b, existe um x só: x = {name}⁻¹ b = {pairText(x)}. Arraste o b para qualquer lugar do quadrado: o x muda junto, e
        nunca aparecem dois.
      </>
    );
  } else if (onLine) {
    text = (
      <>
        Este b está na reta que B alcança. Servem todos os pontos da reta azul, x + 2y = {String(b[1]).replace('.', ',').replace('-', '−')}:
        infinitas soluções, e nenhuma delas é “a” resposta.
      </>
    );
  } else {
    text = (
      <>
        Este b está fora da reta tracejada, e B leva o plano inteiro para essa reta. Nenhum x tem B x = b: o sistema não tem solução.
        Tente um b em cima da reta, como (2, 1).
      </>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="inverse-solve-drag">
      <figure className={styles.figure} ref={ref}>
        <svg
          ref={svgRef}
          className={`${styles.svg} ${drag ? styles.dragging : ''}`}
          viewBox={`0 0 ${f.W} ${f.H}`}
          style={{maxWidth: `${f.W}px`, touchAction: drag ? 'none' : undefined}}
          role="img"
          aria-label="O ponto b arrastável e a solução x do sistema"
        >
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <Axes f={f} />
          <rect
            x={boxPts[0][0]}
            y={boxPts[0][1]}
            width={boxPts[1][0] - boxPts[0][0]}
            height={boxPts[1][1] - boxPts[0][1]}
            fill="var(--mv-tone-2)"
            fillOpacity={0.05}
            stroke="var(--mv-tone-2)"
            strokeOpacity={0.5}
            strokeDasharray="4 4"
          />
          {det === 0 && (
            <g clipPath={`url(#${clipId})`}>
              <line
                x1={f.X(-ext * M[0][0])}
                y1={f.Y(-ext * M[1][0])}
                x2={f.X(ext * M[0][0])}
                y2={f.Y(ext * M[1][0])}
                stroke="var(--mv-tone-2)"
                strokeWidth={3}
                strokeDasharray="8 5"
                opacity={0.75}
              />
            </g>
          )}
          {det === 0 && onLine && (
            <g clipPath={`url(#${clipId})`}>
              {/* x + 2y = b2, com o ponto (b2, 0) e a direção (2, −1) */}
              <line
                x1={f.X(b[1] - 2 * ext)}
                y1={f.Y(ext)}
                x2={f.X(b[1] + 2 * ext)}
                y2={f.Y(-ext)}
                stroke="var(--mv-tone-1)"
                strokeWidth={3}
              />
              {[-2, -1, 0, 1, 2].map((s) => (
                <Dot key={s} f={f} at={[b[1] + 2 * s, -s]} tone={1} r={4} />
              ))}
            </g>
          )}
          {x && (
            <>
              <Arrow f={f} from={x} to={b} dashed width={1.6} head={9} />
              {(() => {
                // nome A ao lado do meio da seta, afastado na perpendicular
                const px = f.P(x);
                const pb = f.P(b);
                const len = Math.hypot(pb[0] - px[0], pb[1] - px[1]) || 1;
                const nx = -(pb[1] - px[1]) / len;
                const ny = (pb[0] - px[0]) / len;
                if (Math.hypot(x[0] - b[0], x[1] - b[1]) < 1.6) return null;
                return (
                  <Label f={f} at={[(x[0] + b[0]) / 2, (x[1] + b[1]) / 2]} math={name} dx={nx * 13} dy={ny * 13} fontSize={13} />
                );
              })()}
              <Dot f={f} at={x} tone={1} r={6} />
              {!playing && (
                <Label f={f} at={x} math={`\\vec{x} = ${pair(x)}`} tone={1} dx={lx.dx} dy={lx.dy} anchor={lx.anchor} />
              )}
            </>
          )}
          <g
            className={styles.handle}
            tabIndex={0}
            role="button"
            aria-label={`Ponto b, agora em ${pairText(b)}. Arraste ou use as setas do teclado.`}
            onPointerDown={(e) => {
              if (playing) return;
              e.preventDefault();
              e.currentTarget.setPointerCapture?.(e.pointerId);
              setDrag(true);
            }}
            onPointerMove={(e) => {
              if (!drag) return;
              const p = toMath(e);
              if (p) setFrom(p);
            }}
            onPointerUp={() => setDrag(false)}
            onPointerCancel={() => setDrag(false)}
            onKeyDown={onKey}
          >
            <circle cx={P[0]} cy={P[1]} r={16} fill="transparent" />
            <circle cx={P[0]} cy={P[1]} r={8} fill="var(--mv-paper)" stroke={toneVar(2)} strokeWidth={2.8} />
          </g>
          {!playing && (
            <Label f={f} at={b} math={`\\vec{b} = ${pair(b)}`} tone={2} dx={lb.dx} dy={lb.dy} anchor={lb.anchor} />
          )}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.buttons} role="group" aria-label="Escolha a matriz">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            className={i === idx ? styles.active : undefined}
            aria-pressed={i === idx}
            disabled={playing}
            onClick={() => {
              setIdx(i);
              if (i === 1) setB([2, 1]);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={
              det !== 0
                ? `\\vec{x} = ${name}^{-1}\\vec{b} = \\begin{bmatrix} 1 & -1 \\\\ -1 & 2 \\end{bmatrix}\\begin{bmatrix} ${num(b[0])} \\\\ ${num(b[1])} \\end{bmatrix} = ${pair(x)}`
                : `${name}\\vec{x} = \\vec{b}:\\quad 2x + 4y = ${num(b[0])},\\quad x + 2y = ${num(b[1])}`
            }
          />
        </p>
        <p>{text}</p>
      </div>
    </div>
  );
}
