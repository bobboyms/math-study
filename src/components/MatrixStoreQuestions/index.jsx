import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {Cell, num} from '../MatrixKit';

// Problema motivador da lição 11.3: a planilha de pedidos de três lojas.
//
// A figura faz as duas perguntas do gerente sobre a mesma planilha.
// Primeiro percorre as linhas, uma loja de cada vez (azul): cada linha,
// com os preços de cima, dá o total daquela loja, ainda desconhecido (?).
// Depois acende uma coluna só, a do queijo (laranja): o preço passa de
// R$ 10 para R$ 11, e a pergunta é quanto muda a conta de cada loja. A
// primeira pergunta lê a planilha por linhas; a segunda, por uma coluna.

const CW = 46;
const CH = 34;
const NAME_W = 80;
const GX = 10 + NAME_W;
const GY = 58;
const EXTRA_W = 62;

export default function MatrixStoreQuestions({
  matrix = [
    [3, 2, 5, 4],
    [10, 0, 20, 6],
    [1, 5, 2, 3],
  ],
  rowNames = ['Centro', 'Bairro', 'Shopping'],
  colNames = ['café', 'queijo', 'pão', 'leite'],
  prices = [4, 10, 2, 5],
  changed = 1,
  caption,
}) {
  const m = matrix.length;
  const n = matrix[0].length;
  const X_TOTAL = GX + n * CW + 12;
  const X_DELTA = X_TOTAL + EXTRA_W + 8;
  const W = X_DELTA + EXTRA_W + 8;
  const H = GY + m * CH + 16;

  const rowA = (i) => 0.7 + i * 0.6;
  const Q2 = rowA(m) + 0.3;
  const duration = Q2 + 1.9;
  const {ref, t, play, playing} = useAnimation({duration});

  const showTable = stage(t, 0, 0.5);
  const rowOn = (i) => t >= rowA(i) && t < rowA(i) + 0.6 && t < Q2;
  const colK = stage(t, Q2, Q2 + 0.5);
  const priceK = stage(t, Q2 + 0.5, Q2 + 1.0);
  const deltaK = stage(t, Q2 + 1.0, Q2 + 1.6);

  return (
    <div className={shared.wrapper} data-explorer="matrix-store-questions">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W + 40}px`}}
          role="img"
          aria-label="Planilha de pedidos de três lojas e quatro produtos, com os preços em cima. As linhas pedem o total de cada loja; a coluna do queijo pede o aumento de cada conta."
        >
          <g opacity={showTable}>
            {colNames.map((c, j) => (
              <SvgMath
                key={`n${j}`}
                x={GX + j * CW + CW / 2}
                y={12}
                math={`\\text{${c}}`}
                fontSize={12}
                tone={j === changed && colK > 0 ? 2 : undefined}
              />
            ))}
            {prices.map((p, j) => {
              const isChanged = j === changed;
              return (
                <g key={`p${j}`}>
                  <g opacity={isChanged ? 1 - priceK : 1}>
                    <SvgMath x={GX + j * CW + CW / 2} y={36} math={`\\text{R\\$ ${num(p)}}`} fontSize={12} />
                  </g>
                  {isChanged && (
                    <g opacity={priceK}>
                      <SvgMath x={GX + j * CW + CW / 2} y={36} math={`\\text{R\\$ ${num(p + 1)}}`} fontSize={12} tone={2} />
                    </g>
                  )}
                </g>
              );
            })}
            <SvgMath x={GX - 6} y={36} math="\text{preço}" fontSize={11} anchor="end" space={NAME_W - 4} />
            <SvgMath x={X_TOTAL + EXTRA_W / 2} y={12} math="\text{total}" fontSize={12} tone={1} />
            <g opacity={deltaK}>
              <SvgMath x={X_DELTA + EXTRA_W / 2} y={12} math="\text{aumento}" fontSize={12} tone={2} />
            </g>

            {matrix.map((row, i) => {
              const y = GY + i * CH;
              const on = rowOn(i);
              const asked = stage(t, rowA(i) + 0.3, rowA(i) + 0.6);
              return (
                <g key={`r${i}`}>
                  <SvgMath
                    x={GX - 6}
                    y={y + CH / 2}
                    math={`\\text{${rowNames[i]}}`}
                    fontSize={13}
                    anchor="end"
                    space={NAME_W - 4}
                    tone={on ? 1 : undefined}
                  />
                  {row.map((v, j) => (
                    <Cell
                      key={j}
                      x={GX + j * CW}
                      y={y}
                      w={CW}
                      h={CH}
                      math={num(v)}
                      fill={on ? 1 : j === changed && colK > 0 ? 2 : 0}
                    />
                  ))}
                  <g opacity={asked}>
                    <line
                      x1={GX + n * CW + 1}
                      x2={X_TOTAL - 2}
                      y1={y + CH / 2}
                      y2={y + CH / 2}
                      stroke="var(--mv-tone-1)"
                      strokeWidth={1.5}
                    />
                    <Cell x={X_TOTAL} y={y + 3} w={EXTRA_W} h={CH - 6} math="?" tone={1} fontSize={14} />
                  </g>
                  <g opacity={deltaK}>
                    <Cell x={X_DELTA} y={y + 3} w={EXTRA_W} h={CH - 6} math="?" tone={2} fontSize={14} />
                  </g>
                </g>
              );
            })}
            <g opacity={colK}>
              <rect
                x={GX + changed * CW - 2}
                y={GY - 2}
                width={CW + 4}
                height={m * CH + 4}
                rx={5}
                fill="none"
                stroke="var(--mv-tone-2)"
                strokeWidth={2.2}
              />
            </g>
          </g>
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver as duas perguntas de novo
        </button>
      </div>
    </div>
  );
}
