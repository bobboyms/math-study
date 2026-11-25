import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import MiniPlane, {Arrow, makePlane, toneVar} from '../SpanCombo/plane';

// O núcleo é o que a matriz manda para a origem (lição 11.10).
//
// A malha do plano se deforma aos poucos, da identidade até
// A = [[1, 2], [2, 4]] (a matriz do meio do caminho é (1 − s)I + sA). A reta
// do núcleo, os múltiplos de (−2, 1), fica em faixa laranja e encolhe até a
// origem, e a seta (−2, 1) some. Uma reta paralela a ela, pelos pontos
// (1, 0), (−1, 1) e (3, −1) (tom 1), encolhe até um ponto só, (1, 2):
// entradas diferentes, mesma saída. No fim aparece a reta y = 2x (verde), o
// espaço coluna: o plano inteiro cai nela.

const A = [
  [1, 2],
  [2, 4],
];
const KER = [-2, 1];
const FIBER = [
  [1, 0],
  [-1, 1],
  [3, -1],
];

const apply = (s, p) => {
  const M = [
    [1 - s + s * A[0][0], s * A[0][1]],
    [s * A[1][0], 1 - s + s * A[1][1]],
  ];
  return [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];
};

export default function KernelCollapse({caption}) {
  const duration = 4;
  const [manual, setManual] = useState(null);
  const {ref, t, play, playing} = useAnimation({duration, onFrame: () => setManual(null)});
  const s = manual ?? stage(t, 0.5, 3.4);
  const pl = makePlane({xMin: -4, xMax: 4, yMin: -3, yMax: 5}, 32);
  const P = (p) => pl.P(apply(s, p));

  const grid = [];
  for (let i = -8; i <= 8; i += 1) {
    grid.push([P([i, -10]), P([i, 10])]);
    grid.push([P([-10, i]), P([10, i])]);
  }
  const ghost = [];
  for (let i = -5; i <= 5; i += 1) {
    ghost.push([pl.P([i, -4]), pl.P([i, 6])]);
    ghost.push([pl.P([-5, i]), pl.P([5, i])]);
  }
  const kerA = P([3 * KER[0], 3 * KER[1]]);
  const kerB = P([-3 * KER[0], -3 * KER[1]]);
  const fibA = P([FIBER[0][0] + 3 * KER[0], FIBER[0][1] + 3 * KER[1]]);
  const fibB = P([FIBER[0][0] - 3 * KER[0], FIBER[0][1] - 3 * KER[1]]);
  const end = stage(s, 0.85, 1);
  const col = [pl.P([-5, -10]), pl.P([5, 10])];

  const clipped = (
    <>
      {ghost.map(([a, b], i) => (
        <line key={`g${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--mv-guide)" strokeWidth={0.8} opacity={0.35} />
      ))}
      {grid.map(([a, b], i) => (
        <line key={`m${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--ifm-color-emphasis-600)" strokeWidth={0.9} opacity={0.55} />
      ))}
      {end > 0 && <line x1={col[0][0]} y1={col[0][1]} x2={col[1][0]} y2={col[1][1]} stroke={toneVar(3)} strokeWidth={9} strokeOpacity={0.3 * end} />}
      {s > 0.05 && (
        <>
          <line x1={pl.X(6)} y1={pl.Y(-3)} x2={pl.X(-6)} y2={pl.Y(3)} stroke={toneVar(2)} strokeWidth={1.4} strokeDasharray="3 5" opacity={0.7} />
          <line x1={pl.X(7)} y1={pl.Y(-3)} x2={pl.X(-5)} y2={pl.Y(3)} stroke={toneVar(1)} strokeWidth={1.2} strokeDasharray="3 5" opacity={0.6} />
        </>
      )}
      <line x1={kerA[0]} y1={kerA[1]} x2={kerB[0]} y2={kerB[1]} stroke={toneVar(2)} strokeWidth={7} strokeOpacity={0.35} strokeLinecap="round" />
      <line x1={fibA[0]} y1={fibA[1]} x2={fibB[0]} y2={fibB[1]} stroke={toneVar(1)} strokeWidth={2.4} strokeDasharray="7 5" strokeLinecap="round" />
      <Arrow pl={pl} from={[0, 0]} to={apply(s, KER)} tone={2} width={3} />
    </>
  );

  const still = !playing;
  const fiberPts = FIBER.map((p) => P(p));
  const lbl = (p, math, tone, dx, dy, anchor = 'middle') => (
    <SvgMath x={p[0] + dx} y={p[1] + dy} math={math} fontSize={13} tone={tone} halo anchor={anchor} space={80} />
  );
  const over = (
    <>
      {fiberPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={5} fill={toneVar(1)} stroke="var(--mv-paper)" strokeWidth={1.2} />
      ))}
      <circle cx={pl.X(0)} cy={pl.Y(0)} r={4.5} fill={toneVar(2)} />
      {still && s < 0.05 && (
        <>
          {lbl(pl.P(KER), '(-2,\\ 1)', 2, -6, -16, 'end')}
          {lbl(fiberPts[0], '(1,\\ 0)', 1, 6, -14, 'start')}
          {lbl(fiberPts[1], '(-1,\\ 1)', 1, 8, -14, 'start')}
          {lbl(fiberPts[2], '(3,\\ -1)', 1, -10, 16, 'end')}
        </>
      )}
      {still && s > 0.95 && (
        <>
          {lbl(pl.P([1, 2]), '(1,\\ 2)', 1, 12, 0, 'start')}
          {lbl(pl.P([0, 0]), '\\vec{0}', 2, -12, -14, 'end')}
          {lbl(pl.P([2.2, 4.4]), 'y = 2x', 3, -10, 0, 'end')}
        </>
      )}
    </>
  );

  const pct = Math.round(s * 100);
  return (
    <div className={shared.wrapper} data-explorer="kernel-collapse">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <MiniPlane pl={pl} ticksEvery={1} clipped={clipped} over={over} ariaLabel={caption} maxWidth={360} />
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Quanto da transformação <Formula math="\vec{x} \mapsto A\vec{x}" /> já aconteceu: <strong>{pct}%</strong>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={pct}
            disabled={playing}
            onChange={(e) => setManual(Number(e.target.value) / 100)}
            aria-label="Quanto da transformação já aconteceu"
          />
        </label>
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {s > 0.98 ? (
          <>
            <p className={shared.formula}>
              <Formula math="A(-2,\ 1) = (0,\ 0)" />: a seta laranja, do núcleo, foi parar na origem. A reta inteira dos múltiplos dela também.
            </p>
            <p className={shared.formula}>
              <Formula math="A(1,\ 0) = A(-1,\ 1) = A(3,\ -1) = (1,\ 2)" />: três entradas diferentes, uma saída só. Elas diferem por múltiplos de{' '}
              <Formula math="(-2,\ 1)" />.
            </p>
            <p>
              O plano (2 dimensões) caiu na reta <Formula math="y = 2x" /> (1 dimensão, o posto). A direção do núcleo (1 dimensão) sumiu:{' '}
              <Formula math="2 = 1 + 1" />.
            </p>
          </>
        ) : (
          <p>
            A malha cinza é o plano no meio da transformação. A faixa laranja (múltiplos de <Formula math="(-2,\ 1)" />) encolhe em direção à origem; a reta
            azul tracejada encolhe em direção a um ponto só.
          </p>
        )}
      </div>

      <div className={shared.buttons}>
        <button
          type="button"
          onClick={() => {
            setManual(null);
            play();
          }}
          disabled={playing}
        >
          Ver de novo
        </button>
      </div>
    </div>
  );
}
