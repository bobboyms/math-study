import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {leadCol, texFr, toFr} from '../SystemElimination/frac';
import {comboTex, nullBasis} from '../RankColumnKeeper/exact';

// O teorema do posto como contagem (lição 11.10).
//
// A forma escalonada fica no alto, com os pivôs circulados. Cada coluna vira
// um cartão que desce, um de cada vez, para uma de duas caixas: "com pivô"
// (tom 1, conta para o posto) ou "sem pivô" (tom 2, cada uma dá um vetor da
// base do núcleo). No fim, a conta n = posto + dimensão do núcleo aparece
// embaixo, e o painel lista os vetores do núcleo e as relações que eles
// escrevem.

const CW = 42;
const CH = 28;

export default function RankNullityTally({cases, initial = 0, caption}) {
  const [ci, setCi] = useState(initial);
  const c = cases[ci];
  const rows = c.echelon.map((r) => r.map(toFr));
  const m = rows.length;
  const n = rows[0].length;
  const per = 0.6;
  const dur = (cols) => 0.7 + per * cols + 1.1;
  const {ref, t, play, playing} = useAnimation({duration: dur(n)});

  const piv = rows.map((r) => leadCol(r, n));
  const pivotCols = piv.filter((j) => j >= 0);
  const freeCols = [...Array(n).keys()].filter((j) => !pivotCols.includes(j));
  const kernel = nullBasis(c.echelon);

  const W = 420;
  const matW = n * CW;
  const mx = (W - matW) / 2;
  const topM = 34;
  const colX = (j) => mx + j * CW + CW / 2;
  const rowY = (i) => topM + i * CH + CH / 2;
  const binTop = topM + m * CH + 46;
  const binH = 62;
  const binW = 190;
  const bins = [
    {x: 12, label: 'com pivô: guardadas', tone: 1},
    {x: W - 12 - binW, label: 'sem pivô: refeitas', tone: 2},
  ];
  const cardW = 38;
  const cardH = 30;
  const slot = (bin, k) => [bins[bin].x + 14 + k * (cardW + 6) + cardW / 2, binTop + 18 + cardH / 2];

  const cards = [...Array(n).keys()].map((j) => {
    const bin = pivotCols.includes(j) ? 0 : 1;
    const k = bin === 0 ? pivotCols.indexOf(j) : freeCols.indexOf(j);
    const s = stage(t, 0.7 + per * j, 0.7 + per * j + per * 0.9);
    const from = [colX(j), topM + m * CH + 16];
    const to = slot(bin, k);
    return {j, bin, s, x: from[0] + (to[0] - from[0]) * s, y: from[1] + (to[1] - from[1]) * s};
  });
  const countIn = (bin) => cards.filter((cd) => cd.bin === bin && cd.s > 0.98).length;
  const eq = stage(t, 0.7 + per * n, dur(n) - 0.1);
  const H = binTop + binH + 26;

  return (
    <div className={shared.wrapper} data-explorer="rank-nullity-tally">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{display: 'block', width: '100%', maxWidth: '480px', height: 'auto', margin: '0 auto'}} role="img" aria-label={caption}>
          {c.names.map((nm, j) => (
            <SvgMath key={`n${j}`} x={colX(j)} y={topM - 16} math={nm} fontSize={13} />
          ))}
          <path
            d={`M ${mx + 6} ${topM - 2} L ${mx} ${topM - 2} L ${mx} ${topM + m * CH + 2} L ${mx + 6} ${topM + m * CH + 2}`}
            fill="none"
            stroke="var(--ifm-font-color-base)"
            strokeWidth={1.3}
          />
          <path
            d={`M ${mx + matW - 6} ${topM - 2} L ${mx + matW} ${topM - 2} L ${mx + matW} ${topM + m * CH + 2} L ${mx + matW - 6} ${topM + m * CH + 2}`}
            fill="none"
            stroke="var(--ifm-font-color-base)"
            strokeWidth={1.3}
          />
          {rows.map((r, i) =>
            r.map((v, j) => <SvgMath key={`${i}-${j}`} x={colX(j)} y={rowY(i)} math={texFr(v)} fontSize={13} />),
          )}
          {piv.map((j, i) => (j >= 0 ? <circle key={`p${i}`} cx={colX(j)} cy={rowY(i)} r={11} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2} /> : null))}

          {bins.map((b, bi) => (
            <g key={bi}>
              <rect x={b.x} y={binTop} width={binW} height={binH} rx={8} fill={`var(--mv-tone-${b.tone})`} fillOpacity={0.1} stroke={`var(--mv-tone-${b.tone})`} strokeWidth={1.4} />
              <text x={b.x + binW / 2} y={binTop + binH + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill={`var(--mv-tone-${b.tone})`}>
                {b.label}: {countIn(bi)}
              </text>
            </g>
          ))}
          {cards.map((cd) => (
            <g key={`c${cd.j}`}>
              <rect
                x={cd.x - cardW / 2}
                y={cd.y - cardH / 2}
                width={cardW}
                height={cardH}
                rx={5}
                fill="var(--ifm-background-surface-color)"
                stroke={cd.s > 0.02 ? `var(--mv-tone-${cd.bin + 1})` : 'var(--ifm-color-emphasis-500)'}
                strokeWidth={1.8}
              />
              <SvgMath x={cd.x} y={cd.y} math={c.names[cd.j]} fontSize={13} />
            </g>
          ))}
        </svg>
        <p style={{textAlign: 'center', margin: '0.4rem 0 0', opacity: eq}}>
          <Formula math={`\\underbrace{${n}}_{\\text{colunas}} = \\underbrace{${pivotCols.length}}_{\\text{posto}} + \\underbrace{${freeCols.length}}_{\\text{dimensão do núcleo}}`} />
        </p>
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          {c.label}: {n} colunas. Com pivô: {pivotCols.length} (o posto). Sem pivô: {freeCols.length} (a dimensão do núcleo).
        </p>
        {eq > 0.5 &&
          (freeCols.length === 0 ? (
            <p>
              Nenhuma coluna sem pivô: o núcleo é só <Formula math="\vec{0}" />, de dimensão 0.
            </p>
          ) : (
            freeCols.map((j, k) => {
              const v = kernel[k];
              // relação: coluna j = − soma dos outros termos
              const others = [...Array(n).keys()].filter((i) => i !== j && v[i].n !== 0);
              const coef = others.map((i) => ({n: -v[i].n, d: v[i].d}));
              return (
                <p key={j} className={shared.formula}>
                  Coluna <Formula math={c.names[j]} /> sem pivô: vetor do núcleo <Formula math={`(${v.map(texFr).join(',\\ ')})`} />, que diz{' '}
                  <Formula math={`${c.names[j]} = ${comboTex(coef, others.map((i) => c.names[i]))}`} />.
                </p>
              );
            })
          ))}
      </div>

      <div className={shared.buttons}>
        {cases.map((cs, i) => (
          <button
            key={cs.label}
            type="button"
            aria-pressed={i === ci}
            disabled={playing}
            onClick={() => {
              setCi(i);
              play({duration: dur(cs.echelon[0].length)});
            }}
          >
            {cs.label}
          </button>
        ))}
        <button type="button" onClick={() => play({duration: dur(n)})} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
