import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';

// Decodificar é resolver um sistema; resolvido uma vez com letras no lado
// direito, ele vira uma matriz (lição 11.8, Matriz inversa).
//
// A animação resolve 2x + y = p, x + y = q em três passos: subtrair as
// equações (sai x = p − q), trocar esse x na segunda (sai y = −p + 2q) e
// escrever os coeficientes de p e de q à vista. Os quatro coeficientes então
// voam para dentro de uma matriz: os de p formam a primeira coluna (tom 1),
// os de q, a segunda (tom 2). Os botões trocam (p, q) pelos pares recebidos e
// o painel faz as duas contas.

const W = 480;
const H = 272;
const Y1 = 26;
const Y2 = 58;
const Y3 = 102;
const Y4 = 138;
const Y5 = 172;
const MY1 = 218;
const MY2 = 248;
const MX1 = 236;
const MX2 = 280;
const OPX = 300;

const DUR = 5.8;

function Fade({k, children}) {
  return <g opacity={Math.max(0, Math.min(1, k))}>{children}</g>;
}

const fmtInt = (v) => String(v).replace('-', '−');

export default function InverseFromSystem({
  pairs = [
    [49, 27],
    [32, 18],
    [31, 26],
  ],
  caption,
}) {
  const {ref, t, play, playing} = useAnimation({duration: DUR});
  const [sel, setSel] = useState(0);

  const k1 = stage(t, 0.7, 1.4); // passo 1: subtrair
  const k1r = stage(t, 1.2, 1.7);
  const k2 = stage(t, 1.9, 2.5); // passo 2: trocar x
  const k2r = stage(t, 2.5, 3.0);
  const k3 = stage(t, 3.3, 3.9); // coeficientes à vista
  const k4 = stage(t, 4.2, 5.4); // coeficientes voam
  const kM = stage(t, 4.0, 4.5); // moldura da matriz
  const hl1 = k1 * (1 - k2);
  const hl2 = k2 * (1 - k3);

  // Coeficientes: [texto, posição de partida, posição na matriz, tom]
  const coefs = [
    {tex: '1', from: [94, Y3], to: [MX1, MY1], tone: 1},
    {tex: '-1', from: [180, Y3], to: [MX2, MY1], tone: 2},
    {tex: '-1', from: [94, Y5], to: [MX1, MY2], tone: 1},
    {tex: '2', from: [180, Y5], to: [MX2, MY2], tone: 2},
  ];

  const lerp = (a, b, s) => a + (b - a) * s;
  const [p, q] = pairs[sel];
  const x = p - q;
  const y = -p + 2 * q;
  const letter = (v) => (v >= 1 && v <= 26 ? String.fromCharCode(64 + v) : '?');
  const bracket = (xl, xr, y0, y1) => (
    <g fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.4}>
      <path d={`M ${xl + 6} ${y0} L ${xl} ${y0} L ${xl} ${y1} L ${xl + 6} ${y1}`} />
      <path d={`M ${xr - 6} ${y0} L ${xr} ${y0} L ${xr} ${y1} L ${xr - 6} ${y1}`} />
    </g>
  );

  return (
    <div className={shared.wrapper} data-explorer="inverse-from-system">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label="O sistema 2x + y = p, x + y = q resolvido com letras, e os coeficientes formando a matriz inversa">
          {/* destaques dos passos */}
          <rect x={14} y={Y1 - 15} width={260} height={Y2 - Y1 + 30} rx={6} fill="var(--mv-tone-2)" fillOpacity={0.12 * hl1} stroke="var(--mv-tone-2)" strokeOpacity={0.8 * hl1} strokeWidth={1.4} />
          <rect x={14} y={Y4 - 15} width={260} height={Y5 - Y4 + 30} rx={6} fill="var(--mv-tone-2)" fillOpacity={0.12 * hl2} stroke="var(--mv-tone-2)" strokeOpacity={0.8 * hl2} strokeWidth={1.4} />

          {/* o sistema */}
          <SvgMath x={30} y={Y1} math="2x + y = p" anchor="start" fontSize={17} />
          <SvgMath x={30} y={Y2} math="\phantom{2}x + y = q" anchor="start" fontSize={17} />

          {/* passo 1 */}
          <Fade k={hl1 > 0 ? hl1 : 0}>
            <SvgMath x={OPX} y={(Y1 + Y2) / 2} math="\text{primeira} - \text{segunda}" anchor="start" fontSize={14} tone={2} space={W - OPX} />
          </Fade>
          <Fade k={k1r * (1 - k3)}>
            <SvgMath x={30} y={Y3} math="x = p - q" anchor="start" fontSize={17} />
          </Fade>

          {/* passo 2 */}
          <Fade k={hl2 > 0 ? hl2 : 0}>
            <SvgMath x={OPX} y={(Y4 + Y5) / 2} math="\text{troque o } x \text{ na segunda}" anchor="start" fontSize={14} tone={2} space={W - OPX} />
          </Fade>
          <Fade k={k2 * (1 - 0.6 * k3)}>
            <SvgMath x={30} y={Y4} math="(p - q) + y = q" anchor="start" fontSize={17} />
          </Fade>
          <Fade k={k2r * (1 - k3)}>
            <SvgMath x={30} y={Y5} math="y = -p + 2q" anchor="start" fontSize={17} />
          </Fade>

          {/* passo 3: os coeficientes à vista */}
          <Fade k={k3}>
            <SvgMath x={30} y={Y3} math="x =" anchor="start" fontSize={17} />
            <SvgMath x={138} y={Y3} math="p \;+" fontSize={17} />
            <SvgMath x={220} y={Y3} math="q" fontSize={17} />
            <SvgMath x={30} y={Y5} math="y =" anchor="start" fontSize={17} />
            <SvgMath x={138} y={Y5} math="p \;+" fontSize={17} />
            <SvgMath x={220} y={Y5} math="q" fontSize={17} />
            <SvgMath x={OPX} y={(Y3 + Y5) / 2} math="\text{coeficientes à vista}" anchor="start" fontSize={14} tone={2} space={W - OPX} />
          </Fade>
          {coefs.map((c, i) => {
            const pos = [lerp(c.from[0], c.to[0], k4), lerp(c.from[1], c.to[1], k4)];
            const paren = k4 < 0.5;
            const tex = paren ? `(${c.tex})` : c.tex;
            return (
              <Fade key={`c${i}`} k={k3}>
                {/* cópia que fica no lugar, apagada */}
                {k4 > 0 && (
                  <g opacity={0.35}>
                    <SvgMath x={c.from[0]} y={c.from[1]} math={`(${c.tex})`} fontSize={17} tone={c.tone} />
                  </g>
                )}
                <SvgMath x={pos[0]} y={pos[1]} math={tex} fontSize={17} tone={c.tone} />
              </Fade>
            );
          })}

          {/* a matriz */}
          <Fade k={kM}>
            <SvgMath x={206} y={(MY1 + MY2) / 2} math="\begin{bmatrix} x \\ y \end{bmatrix} =" anchor="end" fontSize={16} />
            {bracket(MX1 - 22, MX2 + 22, MY1 - 16, MY2 + 16)}
            <SvgMath x={MX2 + 30} y={(MY1 + MY2) / 2} math="\begin{bmatrix} p \\ q \end{bmatrix}" anchor="start" fontSize={16} />
          </Fade>
          <Fade k={stage(t, 5.3, 5.7)}>
            <SvgMath x={MX2 + 84} y={(MY1 + MY2) / 2} math="\text{a inversa}" anchor="start" fontSize={14} tone={3} space={W - MX2 - 86} />
          </Fade>
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.buttons} role="group" aria-label="Escolha o par recebido">
        {pairs.map((pr, i) => (
          <button
            key={`${pr[0]}-${pr[1]}`}
            type="button"
            className={i === sel ? styles.active : undefined}
            aria-pressed={i === sel}
            onClick={() => setSel(i)}
          >
            ({pr[0]}, {pr[1]})
          </button>
        ))}
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`\\begin{bmatrix} 1 & -1 \\\\ -1 & 2 \\end{bmatrix}\\begin{bmatrix} ${p} \\\\ ${q} \\end{bmatrix} = \\begin{bmatrix} ${p} - ${q} \\\\ -${p} + 2 \\times ${q} \\end{bmatrix} = \\begin{bmatrix} ${x} \\\\ ${y} \\end{bmatrix}`}
          />
        </p>
        <p>
          O par ({fmtInt(p)}, {fmtInt(q)}) veio do par ({fmtInt(x)}, {fmtInt(y)}): as letras {letter(x)} e {letter(y)}. Nenhum
          escalonamento novo foi preciso, só uma matriz vezes um vetor.
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a resolução de novo
        </button>
      </div>
    </div>
  );
}
