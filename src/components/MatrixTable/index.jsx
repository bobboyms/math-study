import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {Cell, num, plain} from '../MatrixKit';

// A matriz como tabela: linha primeiro, coluna depois (lição 11.3).
//
// Ao entrar na tela, a figura conta as linhas de cima para baixo (1, 2, 3) e
// depois as colunas da esquerda para a direita (1, 2, 3, 4), e escreve a
// dimensão "3 × 4" com as linhas na frente. Depois o aluno escolhe a linha i
// e a coluna j: a linha acende em azul, a coluna em laranja, e a casa do
// cruzamento (verde) é a entrada a_ij. Os botões de atalho mostram que a_23 e
// a_32 são casas diferentes.

const CW = 52;
const CH = 36;
const IDX_W = 26;
const GY = 50;

export default function MatrixTable({
  matrix,
  rowNames,
  colNames,
  entry = 'a',
  initial = [2, 3],
  presets = [
    [2, 3],
    [3, 2],
  ],
  caption,
}) {
  const m = matrix.length;
  const n = matrix[0].length;
  const nameW = rowNames ? 84 : 0;
  const GX = 10 + nameW + IDX_W;
  const W = GX + n * CW + 14;
  const H = GY + m * CH + 50;

  const rowStart = (i) => 0.3 + i * 0.5;
  const C0 = rowStart(m) + 0.2;
  const colStart = (j) => C0 + j * 0.45;
  const dimStart = colStart(n);
  const duration = dimStart + 1.0;

  const {ref, t, play, playing} = useAnimation({duration});
  const [sel, setSel] = useState(initial);
  const [si, sj] = sel;

  const done = stage(t, duration - 0.5, duration);
  const rowActive = (i) => (t >= rowStart(i) && t < rowStart(i) + 0.55 && t < duration ? 1 : 0);
  const colActive = (j) => (t >= colStart(j) && t < colStart(j) + 0.5 && t < duration ? 1 : 0);

  const value = matrix[si - 1][sj - 1];
  const idxTex = `${entry}_{${si}${sj}}`;

  return (
    <div className={shared.wrapper} data-explorer="matrix-table">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W + 40}px`}}
          role="img"
          aria-label={`Matriz de ${m} linhas e ${n} colunas. Destacada a linha ${si}, a coluna ${sj} e a entrada do cruzamento, ${plain(value)}.`}
        >
          {/* nomes das colunas e números das colunas */}
          {colNames &&
            colNames.map((c, j) => (
              <SvgMath key={`cn${j}`} x={GX + j * CW + CW / 2} y={12} math={`\\text{${c}}`} fontSize={12} />
            ))}
          {Array.from({length: n}, (_, j) => {
            const show = stage(t, colStart(j), colStart(j) + 0.3);
            const isSel = done > 0 && j === sj - 1;
            return (
              <g key={`ci${j}`} opacity={show}>
                <SvgMath
                  x={GX + j * CW + CW / 2}
                  y={33}
                  math={`${j + 1}`}
                  fontSize={13}
                  tone={isSel || colActive(j) ? 2 : undefined}
                />
              </g>
            );
          })}
          <g opacity={stage(t, colStart(0), colStart(0) + 0.3)}>
            <SvgMath x={GX - 4} y={33} math="\text{coluna}" fontSize={11} anchor="end" space={GX - 6} />
          </g>

          {/* linhas */}
          {matrix.map((row, i) => {
            const y = GY + i * CH;
            const show = stage(t, rowStart(i), rowStart(i) + 0.3);
            const rowSel = done > 0 && i === si - 1;
            return (
              <g key={`r${i}`}>
                {rowNames && (
                  <SvgMath
                    x={10 + nameW - 6}
                    y={y + CH / 2}
                    math={`\\text{${rowNames[i]}}`}
                    fontSize={13}
                    anchor="end"
                    space={nameW - 6}
                  />
                )}
                <g opacity={show}>
                  <SvgMath
                    x={GX - IDX_W / 2}
                    y={y + CH / 2}
                    math={`${i + 1}`}
                    fontSize={13}
                    tone={rowSel || rowActive(i) ? 1 : undefined}
                  />
                </g>
                {row.map((v, j) => {
                  const colSel = done > 0 && j === sj - 1;
                  const both = rowSel && colSel;
                  let fill = 0;
                  if (rowActive(i)) fill = 1;
                  else if (colActive(j)) fill = 2;
                  else if (both) fill = 3;
                  else if (rowSel) fill = 1;
                  else if (colSel) fill = 2;
                  return (
                    <Cell
                      key={j}
                      x={GX + j * CW}
                      y={y}
                      w={CW}
                      h={CH}
                      math={num(v)}
                      fill={fill}
                      tone={both ? 3 : 0}
                      strong={both}
                    />
                  );
                })}
              </g>
            );
          })}
          <g opacity={stage(t, rowStart(0), rowStart(0) + 0.3)}>
            <SvgMath x={GX - IDX_W / 2} y={GY - 4 + m * CH + 14} math="\text{linha}" fontSize={11} />
          </g>

          {/* dimensão */}
          <g opacity={stage(t, dimStart, dimStart + 0.5)}>
            <SvgMath
              x={GX + (n * CW) / 2 - 10}
              y={GY + m * CH + 34}
              math={`${m}\\ \\text{linhas}`}
              fontSize={14}
              tone={1}
              anchor="end"
              space={GX + (n * CW) / 2 - 14}
            />
            <SvgMath x={GX + (n * CW) / 2} y={GY + m * CH + 34} math="\times" fontSize={14} />
            <SvgMath
              x={GX + (n * CW) / 2 + 10}
              y={GY + m * CH + 34}
              math={`${n}\\ \\text{colunas}`}
              fontSize={14}
              tone={2}
              anchor="start"
              space={W - (GX + (n * CW) / 2 + 12)}
            />
          </g>
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Linha: <strong>i = {si}</strong>
          </span>
          <input
            type="range"
            min={1}
            max={m}
            step={1}
            value={si}
            disabled={playing}
            onChange={(e) => setSel([Number(e.target.value), sj])}
            aria-label="Número da linha, i"
          />
        </label>
        <label className={shared.control}>
          <span>
            Coluna: <strong>j = {sj}</strong>
          </span>
          <input
            type="range"
            min={1}
            max={n}
            step={1}
            value={sj}
            disabled={playing}
            onChange={(e) => setSel([si, Number(e.target.value)])}
            aria-label="Número da coluna, j"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math={`${idxTex} = ${num(value)}`} />: linha {si}
          {rowNames ? ` (${rowNames[si - 1]})` : ''}, coluna {sj}
          {colNames ? ` (${colNames[sj - 1]})` : ''}. O primeiro índice é a linha; o segundo, a coluna.
        </p>
      </div>
      <div className={shared.buttons}>
        {presets.map(([i, j]) => (
          <button
            key={`${i}${j}`}
            type="button"
            disabled={playing}
            aria-pressed={si === i && sj === j}
            onClick={() => setSel([i, j])}
          >
            Mostrar {entry}
            <sub>
              {i}
              {j}
            </sub>
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Contar linhas e colunas de novo
        </button>
      </div>
    </div>
  );
}
