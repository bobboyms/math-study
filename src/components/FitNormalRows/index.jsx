import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {AREAS, errorsOf, tnum, lineText} from '../FitLineExplorer/apartamentos';

// As condições de perpendicularidade, uma por coluna (lição 11.12).
//
// Cada linha de A transposta é uma coluna de A deitada. Multiplicar A
// transposta pelo resto r é fazer, linha por linha, o produto escalar de cada
// coluna com r. A animação multiplica coordenada com coordenada (os produtos
// aparecem um de cada vez) e soma. Com a reta y = 5x + 50 as duas somas dão 0:
// o resto é perpendicular às duas colunas. Com y = 5x + 40 nenhuma das duas
// dá 0. Botões trocam a reta.

const CASES = [
  {m: 5, n: 50},
  {m: 5, n: 40},
];
const W = 610;
const COLS = [
  {name: '\\vec{a}', row: 'A^{\\mathsf{T}}', values: AREAS},
  {name: '\\vec{1}', row: 'A^{\\mathsf{T}}', values: [1, 1, 1, 1, 1]},
];
const cx = (j) => 160 + j * 86;
const BLOCK = 128;
const tone = (k) => `var(--mv-tone-${k})`;

export default function FitNormalRows({initial = 0, caption}) {
  const [idx, setIdx] = useState(initial);
  const {m, n} = CASES[idx];
  const r = errorsOf(m, n);

  const duration = 5;
  const {ref, t, play, playing} = useAnimation({duration});
  const H = 40 + BLOCK * 2 + 40;

  const sums = COLS.map((c) => c.values.reduce((s, v, j) => s + v * r[j], 0));
  const allZero = sums.every((s) => Math.abs(s) < 1e-9);

  return (
    <div className={shared.wrapper} data-explorer="fit-normal-rows">
      <figure style={{margin: 0}} ref={ref}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', maxWidth: W, display: 'block', margin: '0 auto'}} role="img" aria-label="Produto de cada coluna com o resto, coordenada a coordenada">
          {COLS.map((c, k) => {
            const y0 = 30 + k * BLOCK;
            const t0 = k === 0 ? 0.3 : 2.6;
            const step = k === 0 ? 0.36 : 0.3;
            const sumShow = stage(t, t0 + step * 5 + 0.1, t0 + step * 5 + 0.4);
            return (
              <g key={k}>
                <SvgMath x={12} y={y0} anchor="start" math={`\\text{linha ${k + 1} de } A^{\\mathsf{T}}:`} fontSize={13} />
                <SvgMath x={12} y={y0 + 18} anchor="start" math={`\\text{a coluna } ${c.name} \\text{ deitada}`} fontSize={12} tone={2} />
                <SvgMath x={12} y={y0 + 38} anchor="start" math={'\\text{o resto } \\vec{r}'} fontSize={12} tone={3} />
                <SvgMath x={cx(0) - 32} y={y0 + 38} math={'\\times'} fontSize={13} />
                {c.values.map((v, j) => {
                  const show = stage(t, t0 + step * j, t0 + step * j + 0.25);
                  const prod = v * r[j];
                  return (
                    <g key={j}>
                      <SvgMath x={cx(j)} y={y0 + 6} math={tnum(v)} tone={2} fontSize={14} />
                      <SvgMath x={cx(j)} y={y0 + 38} math={tnum(r[j])} tone={3} fontSize={14} />
                      <line x1={cx(j) - 26} x2={cx(j) + 26} y1={y0 + 56} y2={y0 + 56} stroke="var(--ifm-color-emphasis-400)" strokeWidth={1} />
                      <g opacity={show}>
                        <SvgMath x={cx(j)} y={y0 + 76} math={j > 0 && prod < 0 ? `(${tnum(prod)})` : tnum(prod)} fontSize={14} />
                        {j > 0 && <SvgMath x={cx(j) - 43} y={y0 + 76} math={'+'} fontSize={13} />}
                      </g>
                    </g>
                  );
                })}
                <g opacity={sumShow}>
                  <SvgMath
                    x={cx(4) + 40}
                    y={y0 + 76}
                    anchor="start"
                    math={`= \\mathbf{${tnum(sums[k])}}`}
                    fontSize={15}
                    tone={Math.abs(sums[k]) < 1e-9 ? 3 : undefined}
                  />
                </g>
              </g>
            );
          })}
          <g opacity={stage(t, 4.5, 4.9)}>
            <SvgMath
              x={12}
              y={40 + BLOCK * 2 + 6}
              anchor="start"
              math={`A^{\\mathsf{T}}\\vec{r} = \\begin{bmatrix} ${tnum(sums[0])} \\\\ ${tnum(sums[1])} \\end{bmatrix} ${allZero ? '= \\vec{0}' : '\\neq \\vec{0}'}`}
              fontSize={15}
            />
          </g>
        </svg>
        <figcaption className={shared.caption}>
          {caption ??
            'Cada linha de A transposta é uma coluna de A deitada (laranja). Embaixo dela, o resto (verde). Multiplique coordenada com coordenada e some: a soma é o produto escalar da coluna com o resto. As duas somas juntas formam A transposta vezes o resto.'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p>
          {allZero
            ? 'Reta y = 5x + 50: as duas somas dão zero. O resto é perpendicular às duas colunas.'
            : `Reta y = 5x + 40: as somas dão ${tnum(sums[0]).replace('\\,', ' ')} e ${tnum(sums[1])}. O resto não é perpendicular às colunas, e essa reta não é a melhor.`}
        </p>
      </div>
      <div className={shared.buttons}>
        {CASES.map((cs, j) => (
          <button
            key={j}
            type="button"
            disabled={playing}
            aria-pressed={j === idx}
            onClick={() => {
              setIdx(j);
              play();
            }}
          >
            Reta {lineText(cs.m, cs.n)}
          </button>
        ))}
        <button type="button" disabled={playing} onClick={() => play()}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
