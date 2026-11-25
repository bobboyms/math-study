import React, {useId, useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {fr, mul, add, texFr} from '../SystemElimination/frac';
import {Arrow, Axes, ClipDefs, FixedGrid, frame, polygonPath} from '../LinearGridMorph/plane';

// A fórmula da inversa 2 × 2 como receita animada (lição 11.8, Matriz
// inversa).
//
// Os quatro números de A descem da linha de cima para a de baixo: a e d
// trocam de lugar (cada um faz um arco), b e c descem retos e ganham o sinal
// de menos. Depois aparece o fator 1/(ad − bc) na frente e, por fim, a
// matriz já dividida. Ao lado, um plano pequeno mostra as colunas de A como
// setas e o paralelogramo que elas formam: quando ad − bc é zero, ele fica
// achatado.
//
// O aluno troca os números com os botões − e + (de −5 a 5) ou escolhe uma
// matriz pronta. O painel confere A vezes a inversa.

const W = 470;
const H = 196;
const R1 = 46; // linha de cima: A
const R2 = 146; // linha de baixo: A⁻¹
const GAP = 15; // meia altura entre as linhas de uma matriz
const DUR = 4.4;

function Fade({k, children}) {
  return <g opacity={Math.max(0, Math.min(1, k))}>{children}</g>;
}

const lerp = (a, b, s) => a + (b - a) * s;

function bracketPath(xl, xr, yc, h) {
  return `M ${xl + 6} ${yc - h} L ${xl} ${yc - h} L ${xl} ${yc + h} L ${xl + 6} ${yc + h} M ${xr - 6} ${yc - h} L ${xr} ${yc - h} L ${xr} ${yc + h} L ${xr - 6} ${yc + h}`;
}

const neg = (v) => (v === 0 ? '0' : v < 0 ? `${-v}` : `-${v}`);

const DEFAULT_PRESETS = [
  {label: 'Começo', m: [[3, 2], [1, 1]]},
  {label: 'A do código', m: [[2, 1], [1, 1]]},
  {label: 'Com frações', m: [[2, 1], [4, 3]]},
  {label: 'B da colega', m: [[2, 4], [1, 2]]},
];

export default function InverseFormula2x2({initial = [[3, 2], [1, 1]], presets = DEFAULT_PRESETS, caption}) {
  const uid = useId().replace(/:/g, '-');
  const [m, setM] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DUR});

  const [[a, b], [c, d]] = m;
  const det = a * d - b * c;

  // Posições das entradas
  const ax = [96, 140]; // colunas da matriz A (linha de cima)
  const bx = [176, 222]; // colunas da matriz do meio (linha de baixo)
  const k1 = stage(t, 0.4, 1.6); // descer, a e d trocando
  const k2 = stage(t, 1.6, 2.2); // sinais de menos
  const k3 = stage(t, 2.4, 3.0); // fator na frente
  const k4 = stage(t, 3.2, 3.9); // resultado
  const moving = playing;

  // a: de (ax0, R1-GAP) até (bx1, R2+GAP), em arco por fora; d ao contrário.
  const arc = (p0, p1, s, bulge) => {
    const mx = (p0[0] + p1[0]) / 2 + bulge;
    const my = (p0[1] + p1[1]) / 2;
    const u = 1 - s;
    return [u * u * p0[0] + 2 * u * s * mx + s * s * p1[0], u * u * p0[1] + 2 * u * s * my + s * s * p1[1]];
  };
  const pa = arc([ax[0], R1 - GAP], [bx[1], R2 + GAP], k1, -70);
  const pd = arc([ax[1], R1 + GAP], [bx[0], R2 - GAP], k1, 70);
  const pb = [lerp(ax[1], bx[1], k1), lerp(R1 - GAP, R2 - GAP, k1)];
  const pc = [lerp(ax[0], bx[0], k1), lerp(R1 + GAP, R2 + GAP, k1)];

  // Inversa com frações exatas
  const inv =
    det === 0
      ? null
      : [
          [fr(d, det), fr(-b, det)],
          [fr(-c, det), fr(a, det)],
        ];
  // Conferência: A vezes a inversa
  let check = null;
  if (inv) {
    const A = m.map((r) => r.map((v) => fr(v)));
    check = [0, 1].map((i) => [0, 1].map((j) => add(mul(A[i][0], inv[0][j]), mul(A[i][1], inv[1][j]))));
  }

  const setEntry = (i, j, delta) => {
    setM((old) => {
      const nm = old.map((r) => r.slice());
      nm[i][j] = Math.max(-5, Math.min(5, nm[i][j] + delta));
      return nm;
    });
  };

  // Plano pequeno com as colunas de A
  const f = frame([-5.5, 5.5, -5.5, 5.5], 20);
  const clipId = `clip${uid}`;
  const map = (p) => [a * p[0] + b * p[1], c * p[0] + d * p[1]];

  const rx = 300; // matriz resultado
  const big = inv && inv.flat().some((v) => v.d !== 1);
  const rcol = big ? [rx + 16, rx + 76] : [rx + 16, rx + 58];

  const stepper = (i, j, name) => (
    <span key={name} style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.8rem'}}>
      <Formula math={name} />
      <span className={shared.buttons} style={{marginTop: 0, gap: '0.2rem'}}>
        <button type="button" aria-label={`Diminuir ${name}`} onClick={() => setEntry(i, j, -1)} disabled={m[i][j] <= -5}>
          −
        </button>
        <span style={{minWidth: '1.6rem', textAlign: 'center', fontWeight: 600}}>{String(m[i][j]).replace('-', '−')}</span>
        <button type="button" aria-label={`Aumentar ${name}`} onClick={() => setEntry(i, j, 1)} disabled={m[i][j] >= 5}>
          +
        </button>
      </span>
    </span>
  );

  return (
    <div className={shared.wrapper} data-explorer="inverse-formula-2x2">
      <figure className={styles.figure} ref={ref}>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
          <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`, flex: `1 1 ${W - 100}px`}} role="img" aria-label="A matriz A e, embaixo, a sua inversa montada pela receita: trocar a diagonal, trocar dois sinais, dividir">
            {/* linha de cima: A */}
            <SvgMath x={64} y={R1} math="A =" anchor="end" fontSize={17} />
            <path d={bracketPath(ax[0] - 22, ax[1] + 22, R1, GAP + 15)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.4} />
            {k1 > 0.02 && (
              <g>
                <SvgMath x={ax[0]} y={R1 - GAP} math={String(a)} fontSize={17} tone={1} />
                <SvgMath x={ax[1]} y={R1 - GAP} math={String(b)} fontSize={17} tone={2} />
                <SvgMath x={ax[0]} y={R1 + GAP} math={String(c)} fontSize={17} tone={2} />
                <SvgMath x={ax[1]} y={R1 + GAP} math={String(d)} fontSize={17} tone={1} />
              </g>
            )}
            {!moving && (
              <>
                <SvgMath x={ax[1] + 40} y={R1 - GAP} math="\text{diagonal: } a,\ d" anchor="start" fontSize={13} tone={1} space={W - ax[1] - 42} />
                <SvgMath x={ax[1] + 40} y={R1 + GAP} math="\text{fora dela: } b,\ c" anchor="start" fontSize={13} tone={2} space={W - ax[1] - 42} />
              </>
            )}

            {/* linha de baixo: A⁻¹ */}
            <Fade k={k1 > 0.9 ? 1 : 0}>
              <SvgMath x={106} y={R2} math={det === 0 ? 'A^{-1} \\overset{?}{=}' : 'A^{-1} ='} anchor="end" fontSize={17} />
            </Fade>
            <Fade k={k3}>
              <SvgMath x={126} y={R2} math={`\\dfrac{1}{${det}}`} fontSize={17} />
            </Fade>
            <Fade k={k1 > 0.9 ? 1 : 0}>
              <path d={bracketPath(bx[0] - 24, bx[1] + 24, R2, GAP + 15)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.4} />
            </Fade>
            <SvgMath x={pa[0]} y={pa[1]} math={String(a)} fontSize={17} tone={1} />
            <SvgMath x={pd[0]} y={pd[1]} math={String(d)} fontSize={17} tone={1} />
            <SvgMath x={pb[0]} y={pb[1]} math={k2 > 0.5 ? neg(b) : String(b)} fontSize={17} tone={2} />
            <SvgMath x={pc[0]} y={pc[1]} math={k2 > 0.5 ? neg(c) : String(c)} fontSize={17} tone={2} />
            {k2 > 0 && k2 < 1 && (
              <g opacity={Math.sin(Math.PI * k2)}>
                <circle cx={pb[0]} cy={pb[1]} r={15} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.6} />
                <circle cx={pc[0]} cy={pc[1]} r={15} fill="none" stroke="var(--mv-tone-2)" strokeWidth={1.6} />
              </g>
            )}

            {/* resultado */}
            <Fade k={k4}>
              <SvgMath x={rx - 22} y={R2} math="=" fontSize={17} />
              {inv ? (
                <>
                  <path d={bracketPath(rcol[0] - 24, rcol[1] + 24, R2, GAP + 15)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.4} />
                  {[0, 1].map((i) =>
                    [0, 1].map((j) => (
                      <SvgMath key={`r${i}${j}`} x={rcol[j]} y={R2 + (i ? GAP : -GAP)} math={texFr(inv[i][j])} fontSize={16} />
                    )),
                  )}
                </>
              ) : (
                <SvgMath x={rx} y={R2} math="\text{divisão por zero}" anchor="start" fontSize={15} tone={2} space={W - rx} />
              )}
            </Fade>
          </svg>
          <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`, flex: `0 1 ${f.W}px`}} role="img" aria-label="As colunas de A como setas e o paralelogramo que elas formam">
            <ClipDefs f={f} id={clipId} />
            <FixedGrid f={f} clipId={clipId} />
            <path
              d={polygonPath(f, [[0, 0], [1, 0], [1, 1], [0, 1]], map)}
              fill="var(--mv-tone-3)"
              fillOpacity="var(--mv-fill-opacity)"
              stroke="var(--mv-tone-3)"
              strokeWidth={2}
              clipPath={`url(#${clipId})`}
            />
            <Axes f={f} />
            <Arrow f={f} to={[a, c]} width={2.4} head={9} />
            <Arrow f={f} to={[b, d]} width={2.4} head={9} />
          </svg>
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem 0'}}>
        {stepper(0, 0, 'a')}
        {stepper(0, 1, 'b')}
        {stepper(1, 0, 'c')}
        {stepper(1, 1, 'd')}
      </div>
      {presets && (
        <div className={shared.buttons} role="group" aria-label="Matrizes prontas">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              disabled={playing}
              onClick={() => {
                setM(p.m.map((r) => r.slice()));
                play();
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`ad - bc = ${a} \\times ${d < 0 ? `(${d})` : d} - ${b < 0 ? `(${b})` : b} \\times ${c < 0 ? `(${c})` : c} = ${det}`} />
        </p>
        {inv ? (
          <p className={shared.formula}>
            <Formula
              math={`\\text{Conferência: } A\\,A^{-1} = \\begin{bmatrix} ${texFr(check[0][0])} & ${texFr(check[0][1])} \\\\ ${texFr(check[1][0])} & ${texFr(check[1][1])} \\end{bmatrix} = I`}
            />
          </p>
        ) : (
          <p>
            O número ad − bc é zero: a fórmula mandaria dividir por zero. As duas colunas de A estão na mesma reta (ou uma delas é
            nula), e o paralelogramo do plano ficou achatado. Essa matriz não tem inversa.
          </p>
        )}
        <p>
          As duas setas do plano são as colunas de A, ({String(a).replace('-', '−')}, {String(c).replace('-', '−')}) e ({String(b).replace('-', '−')}, {String(d).replace('-', '−')}). O quadrado verde de lado 1 vira o paralelogramo das duas.
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a receita de novo
        </button>
      </div>
    </div>
  );
}
