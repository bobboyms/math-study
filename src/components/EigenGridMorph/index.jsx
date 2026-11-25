import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, Dot, FixedGrid, Label, MovedGrid, frame, polygonPath, toneVar} from '../LinearGridMorph/plane';
import {apply, bmatrix, fromEigen, lineEnds, mix, numText, pairText} from './eigen';

// A malha do plano se deformando aos poucos, da identidade até a matriz, com
// as retas dos autovetores marcadas (lição 11.11).
//
// A matriz do meio do caminho é (1 − s)I + sA. Ela tem os mesmos autovetores
// de A, com autovalor 1 − s + sλ. Por isso, durante todo o movimento, as
// setas sobre as retas marcadas só esticam, encolhem ou viram; a seta fora
// delas gira.
//
// Três usos:
// - `presets`: botões com matrizes (cada uma com as suas retas, setas e
//   pontos que caminham ao longo de uma reta);
// - `lambdaSlider`: a matriz é montada a partir de dois autovetores fixos e de
//   um autovalor escolhido no deslizante (o outro fica fixo);
// - `gridToggle`: alterna entre a malha quadriculada e a malha dos
//   autovetores (linhas paralelas a v1 e a v2). Na segunda, a matriz só
//   espaça as linhas: é a diagonalização vista no desenho.
//
// O quadro final (o do build e o de quem pediu menos movimento) é a matriz
// inteira. Os rótulos só aparecem com a figura parada.

function eigenLattice(f, M, d1, d2, n, clipId, ghost = false) {
  const out = [];
  const R = n + 2;
  for (let j = -2 * n; j <= 2 * n; j += 1) {
    const i = j / 2;
    const a1 = apply(M, [i * d1[0] - R * d2[0], i * d1[1] - R * d2[1]]);
    const b1 = apply(M, [i * d1[0] + R * d2[0], i * d1[1] + R * d2[1]]);
    const a2 = apply(M, [i * d2[0] - R * d1[0], i * d2[1] - R * d1[1]]);
    const b2 = apply(M, [i * d2[0] + R * d1[0], i * d2[1] + R * d1[1]]);
    const p = [f.P(a1), f.P(b1), f.P(a2), f.P(b2)];
    out.push(
      <line key={`a${i}`} x1={p[0][0]} y1={p[0][1]} x2={p[1][0]} y2={p[1][1]} stroke="var(--mv-tone-2)" strokeOpacity={ghost ? 0.3 : i === 0 ? 0.9 : 0.5} strokeWidth={i === 0 ? 1.8 : 1.1} strokeDasharray={ghost ? '3 4' : undefined} />,
      <line key={`b${i}`} x1={p[2][0]} y1={p[2][1]} x2={p[3][0]} y2={p[3][1]} stroke="var(--mv-tone-1)" strokeOpacity={ghost ? 0.3 : i === 0 ? 0.9 : 0.5} strokeWidth={i === 0 ? 1.8 : 1.1} strokeDasharray={ghost ? '3 4' : undefined} />,
    );
  }
  return <g clipPath={`url(#${clipId})`}>{out}</g>;
}

export default function EigenGridMorph({
  presets,
  initialPreset = 0,
  lambdaSlider,
  gridToggle = false,
  name = 'A',
  window: win = [-4, 4, -3, 3],
  unit = 34,
  extent = 8,
  duration = 3,
  showSquare = false,
  caption,
  label = 'Malha do plano se deformando, com as retas dos autovetores marcadas',
}) {
  const uid = useId().replace(/:/g, '-');
  const [idx, setIdx] = useState(initialPreset);
  const [lam, setLam] = useState(lambdaSlider?.initial ?? 2);
  const [grid, setGrid] = useState(gridToggle ? 'eigen' : 'square');
  const {ref, t, play, playing} = useAnimation({duration});

  // A especificação da vez.
  let spec;
  if (lambdaSlider) {
    const {dirs, mu = 1} = lambdaSlider;
    spec = {
      matrix: fromEigen(dirs[0], dirs[1], lam, mu),
      lines: [
        {dir: dirs[0], lambda: lam, tone: 1, label: lambdaSlider.lineLabels?.[0]},
        {dir: dirs[1], lambda: mu, tone: 2, label: lambdaSlider.lineLabels?.[1]},
      ],
      vectors: lambdaSlider.vectors ?? [
        {v: dirs[0], tone: 1, label: '\\vec{v}_1', imageLabel: 'A\\vec{v}_1'},
        {v: dirs[1], tone: 2, label: '\\vec{v}_2', imageLabel: 'A\\vec{v}_2'},
      ],
    };
  } else {
    spec = presets[idx];
  }
  const A = spec.matrix;

  const s = stage(t, 0.2, Math.max(0.4, duration - 0.15));
  const M = mix(A, s);
  const map = (p) => apply(M, p);
  const still = !playing;
  const done = s >= 0.999;
  const atStart = s <= 0.001;

  const W0 = spec.window ?? win;
  const f = frame(W0, spec.unit ?? unit);
  const clipId = `clip${uid}`;
  const lines = spec.lines ?? [];
  const digits = spec.digits ?? 2;

  // Pontos que caminham sobre uma reta (para ver a reta inteira ir junto).
  const walkers = [];
  (spec.lineDots ?? []).forEach((ld) => {
    for (let k = ld.from; k <= ld.to + 1e-9; k += ld.step) {
      if (Math.abs(k) < 1e-9) continue;
      walkers.push({at: [k * ld.dir[0], k * ld.dir[1]], tone: ld.tone ?? 3});
    }
  });

  const recipe = gridToggle && spec.recipe;
  const recipeSteps = () => {
    if (!recipe) return [];
    const out = [];
    let cur = [0, 0];
    const parts = grid === 'eigen' ? [[recipe.coords[0], lines[0].dir, 1], [recipe.coords[1], lines[1].dir, 2]] : [[recipe.v[0], [1, 0], 1], [recipe.v[1], [0, 1], 2]];
    parts.forEach(([c, d, tone]) => {
      const n = Math.round(Math.abs(c));
      const sg = Math.sign(c);
      const step = map([sg * d[0], sg * d[1]]);
      for (let i = 0; i < n; i += 1) {
        const nx = [cur[0] + step[0], cur[1] + step[1]];
        out.push({a: cur, b: nx, tone});
        cur = nx;
      }
    });
    return out;
  };

  // Painel de números
  const factorAt = (l) => 1 - s + s * l;
  const readout = (
    <div className={shared.readout} aria-live="polite">
      <p className={shared.formula}>
        <Formula math={`${done ? spec.name ?? name : '\\text{agora}'} = ${bmatrix(M, digits)}`} />
      </p>
      {lines.map((ln, i) => {
        const fac = done ? ln.lambda : factorAt(ln.lambda);
        let what;
        if (Math.abs(fac) < 1e-9) what = 'toda seta dela é achatada até a origem';
        else if (Math.abs(fac - 1) < 1e-9) what = 'as setas dela não mudam';
        else if (fac < 0) {
          const m = Math.abs(fac);
          if (Math.abs(m - 1) < 1e-9) what = 'as setas dela viram para o lado oposto, com o mesmo tamanho';
          else if (m > 1) what = `as setas dela viram para o lado oposto e ficam ${numText(m, 2)} vezes maiores`;
          else what = `as setas dela viram para o lado oposto e encolhem para ${numText(m * 100, 0)}% do tamanho`;
        }
        else if (fac > 1) what = `as setas dela ficam ${numText(fac, 2)} vezes maiores`;
        else what = `as setas dela encolhem para ${numText(fac * 100, 0)}% do tamanho`;
        return (
          <p key={`r${i}`}>
            <span className={styles[`col${ln.tone ?? i + 1}`]}>Reta de {pairText(ln.dir, 0)}</span>: {what}
            {done ? ` (fator ${numText(ln.lambda, 2)}).` : '.'}
          </p>
        );
      })}
      {spec.note && done && <p>{spec.note}</p>}
    </div>
  );

  return (
    <div className={shared.wrapper} data-explorer="eigen-grid-morph">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={label}>
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          {grid === 'square' ? (
            <MovedGrid f={f} map={map} extent={extent} clipId={clipId} />
          ) : (
            <>
              {!atStart && eigenLattice(f, [[1, 0], [0, 1]], lines[0].dir, lines[1].dir, extent, clipId, true)}
              {eigenLattice(f, M, lines[0].dir, lines[1].dir, extent, clipId)}
            </>
          )}
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
          {grid === 'square' &&
            !gridToggle &&
            lines.map((ln, i) => {
              const [a, b] = lineEnds(ln.dir, W0);
              const pa = f.P(a);
              const pb = f.P(b);
              return (
                <line
                  key={`l${i}`}
                  x1={pa[0]}
                  y1={pa[1]}
                  x2={pb[0]}
                  y2={pb[1]}
                  stroke={toneVar(ln.tone ?? i + 1)}
                  strokeWidth={2.2}
                  strokeDasharray="7 5"
                  opacity={0.85}
                  clipPath={`url(#${clipId})`}
                />
              );
            })}
          {walkers.map((w, i) => {
            const a = f.P(w.at);
            const q = map(w.at);
            const b = f.P(q);
            return (
              <g key={`w${i}`}>
                {!atStart && <circle cx={a[0]} cy={a[1]} r={3} fill="var(--mv-paper)" stroke={toneVar(w.tone)} strokeWidth={1.3} />}
                {!atStart && <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={toneVar(w.tone)} strokeWidth={1.1} strokeDasharray="3 3" />}
                <Dot f={f} at={q} tone={w.tone} r={4} />
              </g>
            );
          })}
          {recipeSteps().map((sg, j) => {
            const a = f.P(sg.a);
            const b = f.P(sg.b);
            return (
              <g key={`st${j}`}>
                <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={toneVar(sg.tone)} strokeWidth={6} strokeOpacity={0.45} strokeLinecap="round" />
                <circle cx={b[0]} cy={b[1]} r={3} fill={toneVar(sg.tone)} />
              </g>
            );
          })}
          {(spec.vectors ?? []).map((vv, i) => {
            const lab = still ? (done ? vv.imageLabel : atStart ? vv.label : null) : null;
            const off = done ? vv.imageOffset : vv.offset;
            return (
              <g key={`v${i}`}>
                {vv.ghost !== false && !atStart && <Arrow f={f} to={vv.v} tone={vv.tone ?? 3} opacity={0.35} width={2} head={9} />}
                <Arrow f={f} to={map(vv.v)} tone={vv.tone ?? 3} label={lab} offset={off} />
              </g>
            );
          })}
          {still &&
            grid === 'square' &&
            lines.map((ln, i) =>
              ln.label ? (
                <Label key={`ll${i}`} f={f} at={ln.label.at} math={ln.label.math} tone={ln.tone ?? i + 1} dx={ln.label.dx ?? 0} dy={ln.label.dy ?? 0} anchor={ln.label.anchor ?? 'middle'} fontSize={12} />
              ) : null,
            )}
          {(spec.labels ?? []).map((lb, i) =>
            still && (!lb.when || (lb.when === 'done' ? done : atStart)) ? (
              <Label key={`fl${i}`} f={f} at={lb.at} math={lb.math} tone={lb.tone} dx={lb.dx ?? 0} dy={lb.dy ?? 0} anchor={lb.anchor ?? 'middle'} fontSize={lb.fontSize ?? 13} />
            ) : null,
          )}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      {presets && presets.length > 1 && (
        <div className={shared.buttons} role="group" aria-label="Escolha a matriz">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={i === idx ? styles.active : undefined}
              aria-pressed={i === idx}
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
      {gridToggle && (
        <div className={shared.buttons} role="group" aria-label="Escolha a malha">
          {[
            ['square', 'Malha quadriculada'],
            ['eigen', 'Malha dos autovetores'],
          ].map(([key, txt]) => (
            <button
              key={key}
              type="button"
              className={grid === key ? styles.active : undefined}
              aria-pressed={grid === key}
              onClick={() => {
                setGrid(key);
                play();
              }}
            >
              {txt}
            </button>
          ))}
        </div>
      )}
      {lambdaSlider && (
        <div className={shared.controls} style={{marginTop: '0.8rem'}}>
          <label className={shared.control}>
            <span>
              {lambdaSlider.label ?? 'Autovalor λ da reta azul'}: <strong>{numText(lam, 2)}</strong>
            </span>
            <input
              type="range"
              min={lambdaSlider.min}
              max={lambdaSlider.max}
              step={lambdaSlider.step}
              value={lam}
              disabled={playing}
              onChange={(e) => setLam(Number(e.target.value))}
              aria-label={lambdaSlider.label ?? 'Autovalor da reta azul'}
            />
          </label>
        </div>
      )}
      {readout}
      {recipe && done && (
        <p className={shared.hint}>
          {grid === 'eigen'
            ? recipe.eigenText
            : recipe.squareText}
        </p>
      )}
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o movimento de novo
        </button>
      </div>
    </div>
  );
}
