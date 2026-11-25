import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, FixedGrid, Label, frame, toneVar} from '../LinearGridMorph/plane';
import {fr, texFr, plainFr} from '../SystemElimination/frac';

// O escorregão que não muda a área (lição 11.9).
//
// O paralelogramo das colunas u = (3, 1) e v = (1, 2). O lado u fica parado.
// O lado v escorrega na direção de u: v − t·u. A ponta de v anda sobre a reta
// tracejada paralela a u, então a distância até a reta de u (a altura) não
// muda, e a área também não. A animação escorrega até t = 1/3, quando o lado
// fica em pé: (0, 5/3), e a área se lê como 3 × 5/3 = 5. Depois o deslizante
// escolhe t em doze avos, de −4/12 a 8/12.

const U = [3, 1];
const V = [1, 2];
const N_END = 4; // t = 4/12 = 1/3
const NMIN = -4;
const NMAX = 8;

export default function DetShearSlide({unit = 50, caption}) {
  const [n, setN] = useState(N_END);
  const [manual, setManual] = useState(false);
  const {ref, t, play, playing} = useAnimation({
    duration: 3.2,
    onFrame: () => setManual(false),
  });
  const nCont = manual ? n : N_END * stage(t, 0.4, 2.8);
  const tc = nCont / 12;
  const v = [V[0] - tc * U[0], V[1] - tc * U[1]];
  const top = [U[0] + v[0], U[1] + v[1]];
  const f = frame([-2, 5.6, -1.2, 3.8], unit);

  // Altura: pé da perpendicular da ponta de v sobre a reta de u.
  const uu = U[0] * U[0] + U[1] * U[1];
  const proj = (v[0] * U[0] + v[1] * U[1]) / uu;
  const foot = [proj * U[0], proj * U[1]];
  const height = 5 / Math.sqrt(uu);

  const atRest = !playing;
  const exact = atRest ? (manual ? n : N_END) : null;
  const upright = exact === N_END;

  // Coordenadas exatas de v, em doze avos.
  const tFr = exact != null ? fr(exact, 12) : null;
  const vx = exact != null ? fr(12 - 3 * exact, 12) : null; // 1 − 3t
  const vy = exact != null ? fr(24 - exact, 12) : null; // 2 − t
  const par = (x) => (x.n < 0 ? `(${texFr(x)})` : texFr(x));

  const P = (p) => f.P(p).map((q) => q.toFixed(1)).join(' ');
  const para = (a, b) => `M ${P([0, 0])} L ${P(a)} L ${P([a[0] + b[0], a[1] + b[1]])} L ${P(b)} Z`;

  // Reta de u e a paralela por v (trilho da ponta).
  const far = (base) => [
    [base[0] - 3 * U[0], base[1] - 3 * U[1]],
    [base[0] + 3 * U[0], base[1] + 3 * U[1]],
  ];
  const [l1a, l1b] = far([0, 0]);
  const [l2a, l2b] = far(V);

  return (
    <div className={shared.wrapper} data-explorer="det-shear-slide">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label="O lado v do paralelogramo escorrega na direção do lado u, sem mudar a área">
          <defs>
            <clipPath id="det-shear-clip">
              <rect x={f.X(f.xMin)} y={f.Y(f.yMax)} width={f.X(f.xMax) - f.X(f.xMin)} height={f.Y(f.yMin) - f.Y(f.yMax)} />
            </clipPath>
          </defs>
          <FixedGrid f={f} />
          <Axes f={f} />
          <g clipPath="url(#det-shear-clip)">
            <line x1={f.X(l1a[0])} y1={f.Y(l1a[1])} x2={f.X(l1b[0])} y2={f.Y(l1b[1])} stroke="var(--mv-tone-1)" strokeOpacity={0.45} strokeWidth={1.3} strokeDasharray="6 5" />
            <line x1={f.X(l2a[0])} y1={f.Y(l2a[1])} x2={f.X(l2b[0])} y2={f.Y(l2b[1])} stroke="var(--mv-tone-2)" strokeOpacity={0.7} strokeWidth={1.3} strokeDasharray="6 5" />
          </g>
          {/* paralelogramo original, só contorno */}
          <path d={para(U, V)} fill="none" stroke="var(--mv-tone-3)" strokeWidth={1.4} strokeDasharray="5 4" />
          {/* paralelogramo do instante */}
          <path d={para(U, v)} fill="var(--mv-tone-3)" fillOpacity={0.28} stroke="var(--mv-tone-3)" strokeWidth={2} />
          {/* altura */}
          {!upright && (
            <g stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.4}>
              <line x1={f.X(v[0])} y1={f.Y(v[1])} x2={f.X(foot[0])} y2={f.Y(foot[1])} strokeDasharray="2 3" />
            </g>
          )}
          {upright && (
            <g stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.2}>
              <line x1={f.X(0)} y1={f.Y(-0.55)} x2={f.X(3)} y2={f.Y(-0.55)} />
              <line x1={f.X(0)} y1={f.Y(-0.55) - 5} x2={f.X(0)} y2={f.Y(-0.55) + 5} />
              <line x1={f.X(3)} y1={f.Y(-0.55) - 5} x2={f.X(3)} y2={f.Y(-0.55) + 5} />
              <line x1={f.X(3)} y1={f.Y(1)} x2={f.X(3)} y2={f.Y(-0.55)} strokeDasharray="2 3" />
            </g>
          )}
          <Arrow f={f} to={U} tone={1} label={atRest ? '\\vec{u} = (3,\\ 1)' : null} offset={[8, 14, 'start']} />
          <Arrow
            f={f}
            to={v}
            tone={2}
            label={atRest && exact != null ? `(${texFr(vx)},\\ ${texFr(vy)})` : null}
            offset={v[0] < 0.2 ? [-8, -4, 'end'] : [-8, -10, 'end']}
          />
          {atRest && !upright && (
            <Label f={f} at={[(v[0] + foot[0]) / 2, (v[1] + foot[1]) / 2]} math={'\\text{altura}'} dx={10} dy={4} anchor="start" fontSize={12} />
          )}
          {upright && atRest && <Label f={f} at={[1.5, -0.55]} math="3" dy={12} fontSize={14} />}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Quanto o lado escorregou (t): <strong>{exact != null ? plainFr(tFr) : (tc).toFixed(2).replace('.', ',')}</strong>
          </span>
          <input
            type="range"
            min={NMIN}
            max={NMAX}
            step={1}
            value={manual ? n : N_END}
            disabled={playing}
            onChange={(e) => {
              setManual(true);
              setN(Number(e.target.value));
            }}
            aria-label="Quanto o lado v escorregou na direção de u, em doze avos"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        {exact != null ? (
          <>
            <p className={shared.formula}>
              <Formula
                math={`\\vec{v} - t\\,\\vec{u} = (1,\\ 2) - ${texFr(tFr).startsWith('-') ? `(${texFr(tFr)})` : texFr(tFr)}(3,\\ 1) = \\left(${texFr(vx)},\\ ${texFr(vy)}\\right)`}
              />
            </p>
            <p className={shared.formula}>
              <Formula math={`\\det \\begin{bmatrix} 3 & ${texFr(vx)} \\\\ 1 & ${texFr(vy)} \\end{bmatrix} = 3 \\times ${par(vy)} - ${par(vx)} \\times 1 = 5`} />
            </p>
            <p>
              {upright
                ? 'O lado laranja ficou em pé, com comprimento 5/3. A distância até o lado oposto é 3, a primeira coordenada de u. Área: 3 × 5/3 = 5.'
                : `A base u não mudou, e a altura continua ${height.toFixed(2).replace('.', ',')}, porque a ponta só andou sobre a reta tracejada. A área continua 5.`}
            </p>
          </>
        ) : (
          <p>O lado v escorrega na direção de u. A ponta anda sobre a reta tracejada laranja.</p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o escorregão de novo
        </button>
      </div>
    </div>
  );
}
