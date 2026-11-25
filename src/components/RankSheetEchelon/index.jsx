import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {applyOp, opTex, toFr, texFr, leadCol, fr} from '../SystemElimination/frac';
import {comboTex, rref} from '../RankColumnKeeper/exact';

// Escalonar uma planilha e contar as colunas que carregam informação
// (lição 11.10).
//
// As colunas têm nome (o vetor e o título da planilha). Cada passo aplica
// uma ou mais operações "L_i ← L_i + k L_j": as linhas que mudam ganham uma
// faixa azul, a operação aparece à direita da linha, e os números novos
// aparecem no lugar dos velhos. No fim, os pivôs ganham círculo verde, as
// colunas com pivô são marcadas "guardada" e as sem pivô ficam sombreadas,
// marcadas "refeita". O painel escreve o posto e a receita de cada coluna
// sem pivô em termos das colunas originais com pivô (lidas na forma
// escalonada reduzida, conta exata).

const CELL_W = 60;
const CELL_H = 38;
const LEFT = 26;
const TOP = 74;
const RIGHT = 92;

const renderText = (s) =>
  s.split('$').map((part, i) => (i % 2 ? <Formula key={i} math={part} /> : <span key={i}>{part}</span>));

export default function RankSheetEchelon({names, headers, start, steps, startText, caption}) {
  const nSteps = steps.length;
  const stepDur = 1.8;
  const t0 = 0.5;
  const duration = t0 + stepDur * nSteps + 1.3;
  const {ref, t, play, playing, stop} = useAnimation({duration});
  const [manual, setManual] = useState(null);

  const mats = [start.map((r) => r.map(toFr))];
  steps.forEach((s) => {
    let m = mats[mats.length - 1];
    s.ops.forEach((op) => {
      m = applyOp(m, {op: 'add', ...op});
    });
    mats.push(m);
  });

  const auto = Math.max(0, Math.min(nSteps, Math.floor((t - t0) / stepDur) + 1));
  const k = manual ?? (t < t0 ? 0 : auto);
  const local = manual !== null ? stepDur : t - t0 - (k - 1) * stepDur;
  const fadeIn = k === 0 ? 1 : manual !== null ? 1 : stage(local, 0.25, 0.9);
  const marks = manual !== null ? (k === nSteps ? 1 : 0) : stage(t, t0 + stepDur * nSteps, duration - 0.2);
  const cur = mats[k];
  const prev = mats[Math.max(0, k - 1)];
  const changedRows = k > 0 ? steps[k - 1].ops.map((o) => o.row - 1) : [];

  const rows = start.length;
  const cols = start[0].length;
  const W = LEFT + cols * CELL_W + RIGHT;
  const H = TOP + rows * CELL_H + 34;
  const cx = (j) => LEFT + 10 + j * CELL_W + CELL_W / 2;
  const cy = (i) => TOP + i * CELL_H + CELL_H / 2;

  const final = mats[nSteps];
  const piv = final.map((row) => leadCol(row, cols));
  const pivotCols = piv.filter((j) => j >= 0);
  const freeCols = [...Array(cols).keys()].filter((j) => !pivotCols.includes(j));

  // receitas das colunas sem pivô, pela forma reduzida da matriz original
  const {m: red, pivots} = rref(start);
  const relations = freeCols.map((j) => {
    const coef = pivots.map((_, i) => red[i][j]);
    return `${names[j]} = ${comboTex(coef, pivots.map((c) => names[c]))}`;
  });

  const bracket = (side) => {
    const x = side === 'left' ? LEFT + 6 : LEFT + 14 + cols * CELL_W;
    const d = side === 'left' ? 7 : -7;
    return `M ${x + d} ${TOP - 2} L ${x} ${TOP - 2} L ${x} ${TOP + rows * CELL_H + 2} L ${x + d} ${TOP + rows * CELL_H + 2}`;
  };

  const opShort = (op) => {
    const q = toFr(op.k);
    const a = fr(Math.abs(q.n), q.d);
    const coef = a.n === 1 && a.d === 1 ? '' : texFr(a);
    return `${q.n < 0 ? '-' : '+'}\\,${coef}L_{${op.from}}`;
  };

  let text;
  if (k === 0) text = startText ?? 'A planilha como matriz: uma coluna por informação, uma linha por cliente.';
  else if (marks > 0.5) text = null;
  else text = steps[k - 1].text;

  return (
    <div className={shared.wrapper} data-explorer="rank-sheet-echelon">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{display: 'block', width: '100%', maxWidth: `${Math.min(W * 1.2, 560)}px`, height: 'auto', margin: '0 auto'}}
          role="img"
          aria-label={caption}
        >
          {headers &&
            headers.map((h, j) => (
              <text key={`h${j}`} x={cx(j)} y={TOP - 46} textAnchor="middle" fontSize={11} fill="var(--ifm-color-emphasis-800)">
                {h}
              </text>
            ))}
          {names.map((nm, j) => (
            <SvgMath key={`n${j}`} x={cx(j)} y={TOP - 22} math={nm} fontSize={15} />
          ))}
          {freeCols.map((j) => (
            <g key={`f${j}`} opacity={marks}>
              <rect x={cx(j) - CELL_W / 2 + 4} y={TOP - 4} width={CELL_W - 8} height={rows * CELL_H + 8} rx={6} fill="var(--mv-tone-2)" fillOpacity={0.18} />
            </g>
          ))}
          {[...Array(cols).keys()].map((j) => (
            <text
              key={`m${j}`}
              x={cx(j)}
              y={TOP + rows * CELL_H + 22}
              textAnchor="middle"
              fontSize={11.5}
              fontWeight={600}
              fill={freeCols.includes(j) ? 'var(--mv-tone-2)' : 'var(--mv-tone-1)'}
              opacity={marks}
            >
              {freeCols.includes(j) ? 'refeita' : 'guardada'}
            </text>
          ))}
          {changedRows.map((i) => (
            <rect
              key={`c${i}`}
              x={LEFT + 12}
              y={TOP + i * CELL_H + 3}
              width={cols * CELL_W - 4}
              height={CELL_H - 6}
              rx={5}
              fill="var(--mv-tone-1)"
              fillOpacity={0.14 * (1 - marks)}
            />
          ))}
          <path d={bracket('left')} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <path d={bracket('right')} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          {cur.map((row, i) =>
            row.map((val, j) => {
              const old = prev[i][j];
              const same = !changedRows.includes(i) || (old.n === val.n && old.d === val.d);
              return (
                <g key={`${i}-${j}`}>
                  {!same && (
                    <g opacity={1 - fadeIn}>
                      <SvgMath x={cx(j)} y={cy(i)} math={texFr(old)} fontSize={16} />
                    </g>
                  )}
                  <g opacity={same ? 1 : fadeIn}>
                    <SvgMath x={cx(j)} y={cy(i)} math={texFr(val)} fontSize={16} />
                  </g>
                </g>
              );
            }),
          )}
          {k > 0 &&
            steps[k - 1].ops.map((op) => (
              <g key={`o${op.row}`} opacity={1 - marks}>
                <SvgMath x={LEFT + 24 + cols * CELL_W} y={cy(op.row - 1)} math={opShort(op)} fontSize={13} tone={1} anchor="start" space={RIGHT - 10} />
              </g>
            ))}
          {piv.map((j, i) =>
            j >= 0 ? <circle key={`p${i}`} cx={cx(j)} cy={cy(i)} r={15} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2.4} opacity={marks} /> : null,
          )}
          {piv.map((j, i) =>
            j < 0 ? (
              <text key={`z${i}`} x={LEFT + 24 + cols * CELL_W} y={cy(i) + 4} fontSize={11} fill="var(--ifm-color-emphasis-800)" opacity={marks}>
                sem pivô
              </text>
            ) : null,
          )}
        </svg>
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {k > 0 && marks <= 0.5 && (
          <p className={shared.formula}>
            Passo {k} de {nSteps}: <Formula math={steps[k - 1].ops.map((op) => opTex({op: 'add', ...op})).join(',\\quad ')} />
          </p>
        )}
        {text && <p>{renderText(text)}</p>}
        {marks > 0.5 && (
          <>
            <p>
              Pivôs nas colunas de <Formula math={pivotCols.map((j) => names[j]).join(',\\ ')} />: o posto é <strong>{pivotCols.length}</strong>. {pivotCols.length < cols ? `Só ${pivotCols.length} das ${cols} colunas carregam informação.` : 'Todas as colunas carregam informação.'}
            </p>
            {relations.length > 0 && (
              <p className={shared.formula}>
                {relations.length === 1 ? 'A coluna sem pivô é refeita' : 'As colunas sem pivô são refeitas'} pelas colunas originais com pivô:{' '}
                {relations.map((r, i) => (
                  <span key={r}>
                    {i > 0 && '; '}
                    <Formula math={r} />
                  </span>
                ))}
                .
              </p>
            )}
          </>
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
          Ver tudo de novo
        </button>
        <button
          type="button"
          onClick={() => {
            stop();
            setManual(0);
          }}
        >
          Voltar ao início
        </button>
        <button
          type="button"
          onClick={() => {
            stop();
            setManual((old) => Math.min(nSteps, (old ?? k) + 1));
          }}
        >
          Próximo passo
        </button>
      </div>
    </div>
  );
}
