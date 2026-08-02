import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Peças algébricas: o quadrado de lado x, a tira de x por 1 e o quadradinho de
// lado 1.
//
// É o AreaModel visto do outro lado. Lá o retângulo já vem montado e o desenho
// mostra em que pedaços ele se corta; aqui as peças vêm soltas e a pergunta é
// se elas fecham um retângulo. As duas figuras precisam conviver na mesma
// lição, porque fatorar é exatamente o caminho de volta: dado o monte de
// peças, achar os dois lados.
//
// Por isso cada peça é desenhada **uma a uma**, e não como um bloco rotulado
// "5x": o argumento da lição é que as tiras do meio se contam (5 + 3 = 8) e
// que os quadradinhos do canto formam uma grade (3 × 5 = 15). Um bloco único
// com o rótulo pronto esconde justamente a contagem.
//
// O x é desenhado com comprimento que não é múltiplo inteiro do quadradinho
// (3,2 unidades), de propósito: se coubessem exatamente 3 ou 4 quadradinhos na
// tira, o desenho estaria afirmando um valor para x.

const PAD = {top: 40, right: 16, bottom: 16};
const LABEL_GAP = 22; // do colchete até o rótulo da linha
const BASE_GAP = 30; // espaço extra embaixo quando há colchete da base inteira
const LOOSE_GAP = 0.3; // vão entre peças soltas, em unidades
const GROUP_GAP = 0.8; // vão entre os montes de peças soltas, em unidades

// Um tom por tipo de peça: quadrado, tira, quadradinho. São três, o limite da
// casa, e a cor passa a ser o próprio nome da peça.
const TONE = {x2: 1, x: 2, one: 3};

const tileType = (rowType, colType) =>
  rowType === 'x' && colType === 'x'
    ? 'x2'
    : rowType === 'x' || colType === 'x'
      ? 'x'
      : 'one';

// 'x' vira uma célula de comprimento x; um número n vira n células de lado 1 —
// é o que faz cada quadradinho aparecer separado do vizinho.
const expand = (items, xLen) =>
  items.flatMap((item) =>
    item === 'x'
      ? [{type: 'x', size: xLen}]
      : Array.from({length: item}, () => ({type: '1', size: 1})),
  );

// Células vizinhas do mesmo tipo formam um colchete só: 'x' e depois cinco
// unidades saem como dois colchetes, "x" e "5", e não como seis.
const runs = (cells) =>
  cells.reduce((acc, cell, i) => {
    const last = acc[acc.length - 1];
    if (last && last.type === cell.type) {
      last.count += 1;
      last.end = i;
      return acc;
    }
    return [...acc, {type: cell.type, count: 1, start: i, end: i}];
  }, []);

const runLabel = (run) =>
  run.type === 'x'
    ? run.count === 1
      ? 'x'
      : `${run.count}x`
    : `${run.count}`;

const sideLabelOf = (cells) => runs(cells).map(runLabel).join(' + ');

const tileLabel = (type) =>
  type === 'x2' ? 'x^2' : type === 'x' ? 'x' : null;

const labelSize = (w, h) => {
  const short = Math.min(w, h);
  if (short < 22) {
    return 0; // não cabe: a peça fica sem rótulo e continua contável
  }
  return short < 34 ? 11 : 14;
};

export default function TileModel({
  rows,
  cols,
  loose,
  xLen = 3.2,
  unit = 26,
  ghost = [],
  splitAfter,
  splitGap = 0.7,
  bandLabels,
  perRow = 8,
  showLabels = true,
  baseLabel,
  caption,
  labelWidth = 44,
}) {
  const padLeft = labelWidth + LABEL_GAP;

  if (loose) {
    return (
      <LoosePile
        loose={loose}
        xLen={xLen}
        unit={unit}
        perRow={perRow}
        padLeft={padLeft}
        labelWidth={labelWidth}
        caption={caption}
      />
    );
  }

  const rowCells = expand(rows, xLen);
  const colCells = expand(cols, xLen);

  const colWidths = colCells.map((cell) => cell.size * unit);
  const rowHeights = rowCells.map((cell) => cell.size * unit);

  const x0 = padLeft;
  const y0 = PAD.top;

  const colX = colWidths.reduce(
    (acc, w) => [...acc, acc[acc.length - 1] + w],
    [x0],
  );
  // O vão do agrupamento entra entre duas linhas: as faixas se separam sem que
  // nenhuma peça mude de tamanho.
  const rowY = rowHeights.reduce(
    (acc, h, i) => [
      ...acc,
      acc[acc.length - 1] + h + (i === splitAfter ? splitGap * unit : 0),
    ],
    [y0],
  );

  const totalW = colX[colX.length - 1] - x0;
  const totalH = rowY[rowY.length - 1] - y0;
  const bandRight = bandLabels ? 96 : 0;

  // Sem a prop, o colchete de baixo sai automático ("x + 5"); `null` remove.
  const showBase = baseLabel !== null;
  const baseText = baseLabel ?? sideLabelOf(colCells);

  const viewW = padLeft + totalW + bandRight + PAD.right;
  const viewH = PAD.top + totalH + PAD.bottom + (showBase ? BASE_GAP : 0);
  const bottomY = y0 + totalH;

  const isGhost = (r, c) => ghost.some(([gr, gc]) => gr === r && gc === c);

  const colRuns = runs(colCells);
  const rowRuns = runs(rowCells);

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 320)}px`}}
        role="img"
        aria-label={caption || 'Retângulo montado com peças algébricas.'}
      >
        {rowCells.map((row, r) =>
          colCells.map((col, c) => {
            const type = tileType(row.type, col.type);
            const w = colWidths[c];
            const h = rowHeights[r];
            const size = labelSize(w, h);
            const missing = isGhost(r, c);
            return (
              <g key={`${r}-${c}`}>
                <rect
                  className={missing ? styles.ghost : styles.tile}
                  style={
                    missing
                      ? undefined
                      : {'--tile-tone': `var(--mv-tone-${TONE[type]})`}
                  }
                  x={colX[c]}
                  y={rowY[r]}
                  width={w}
                  height={h}
                />
                {showLabels && !missing && size > 0 && tileLabel(type) && (
                  <SvgMath
                    x={colX[c] + w / 2}
                    y={rowY[r] + h / 2}
                    math={tileLabel(type)}
                    fontSize={size}
                  />
                )}
              </g>
            );
          }),
        )}

        {colRuns.map((run) => (
          <g key={`col-${run.start}`}>
            <path
              className={styles.guide}
              d={`M ${colX[run.start]} ${y0 - 8} L ${colX[run.start]} ${y0 - 14} L ${colX[run.end + 1]} ${y0 - 14} L ${colX[run.end + 1]} ${y0 - 8}`}
            />
            <SvgMath
              x={(colX[run.start] + colX[run.end + 1]) / 2}
              y={y0 - 26}
              math={runLabel(run)}
              fontSize={15}
            />
          </g>
        ))}

        {rowRuns.map((run) => (
          <g key={`row-${run.start}`}>
            <path
              className={styles.guide}
              d={`M ${x0 - 8} ${rowY[run.start]} L ${x0 - 14} ${rowY[run.start]} L ${x0 - 14} ${rowY[run.end] + rowHeights[run.end]} L ${x0 - 8} ${rowY[run.end] + rowHeights[run.end]}`}
            />
            <SvgMath
              x={x0 - LABEL_GAP}
              y={(rowY[run.start] + rowY[run.end] + rowHeights[run.end]) / 2}
              math={runLabel(run)}
              anchor="end"
              space={labelWidth}
              fontSize={15}
            />
          </g>
        ))}

        {bandLabels &&
          bandLabels.map((label, i) => {
            // A faixa i vai da primeira linha depois do vão anterior até a
            // linha do vão seguinte.
            const first = i === 0 ? 0 : splitAfter + 1;
            const last = i === 0 ? splitAfter : rowCells.length - 1;
            return (
              <SvgMath
                key={`band-${i}`}
                x={x0 + totalW + 14}
                y={(rowY[first] + rowY[last] + rowHeights[last]) / 2}
                math={label}
                anchor="start"
                space={bandRight}
                fontSize={15}
              />
            );
          })}

        {showBase && (
          <g>
            <path
              className={styles.guide}
              d={`M ${x0} ${bottomY + 8} L ${x0} ${bottomY + 14} L ${x0 + totalW} ${bottomY + 14} L ${x0 + totalW} ${bottomY + 8}`}
            />
            <SvgMath
              x={x0 + totalW / 2}
              y={bottomY + 30}
              math={baseText}
              fontSize={15}
            />
          </g>
        )}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

// Modo "peças soltas": o monte que a expressão entrega, antes de qualquer
// tentativa de montagem. Cada tipo ganha uma linha, com o rótulo à esquerda.
// Os quadradinhos são quebrados em linhas de `perRow` — se saíssem numa grade
// certinha, o desenho já entregaria a fatoração que o aluno deveria procurar.
function LoosePile({loose, xLen, unit, perRow, padLeft, labelWidth, caption}) {
  const groups = [
    {
      type: 'x2',
      count: loose.x2 ?? 0,
      w: xLen,
      h: xLen,
      label: (n) => (n === 1 ? 'x^2' : `${n}x^2`),
      tile: 'x^2',
    },
    {
      type: 'x',
      count: loose.x ?? 0,
      w: 1,
      h: xLen,
      label: (n) => (n === 1 ? 'x' : `${n}x`),
      tile: 'x',
    },
    {
      type: 'one',
      count: loose.one ?? 0,
      w: 1,
      h: 1,
      label: (n) => `${n}`,
      tile: null,
    },
  ].filter((group) => group.count > 0);

  let y = PAD.top - 20;
  const laid = groups.map((group) => {
    const lines = Math.ceil(group.count / perRow);
    const height =
      lines * group.h * unit + (lines - 1) * LOOSE_GAP * unit;
    const block = {...group, y, height, lines};
    y += height + GROUP_GAP * unit;
    return block;
  });

  const totalH = y - GROUP_GAP * unit - (PAD.top - 20);
  const widest = Math.max(
    ...laid.map((group) => {
      const perLine = Math.min(group.count, perRow);
      return perLine * group.w * unit + (perLine - 1) * LOOSE_GAP * unit;
    }),
  );

  const viewW = padLeft + widest + PAD.right;
  const viewH = PAD.top - 20 + totalH + PAD.bottom;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 320)}px`}}
        role="img"
        aria-label={caption || 'Peças algébricas soltas.'}
      >
        {laid.map((group) => (
          <g key={group.type}>
            {Array.from({length: group.count}, (_, i) => {
              const line = Math.floor(i / perRow);
              const col = i % perRow;
              const w = group.w * unit;
              const h = group.h * unit;
              const x = padLeft + col * (w + LOOSE_GAP * unit);
              const ty = group.y + line * (h + LOOSE_GAP * unit);
              const size = labelSize(w, h);
              return (
                <g key={i}>
                  <rect
                    className={styles.tile}
                    style={{'--tile-tone': `var(--mv-tone-${TONE[group.type]})`}}
                    x={x}
                    y={ty}
                    width={w}
                    height={h}
                  />
                  {group.tile && size > 0 && (
                    <SvgMath
                      x={x + w / 2}
                      y={ty + h / 2}
                      math={group.tile}
                      fontSize={size}
                    />
                  )}
                </g>
              );
            })}
            <SvgMath
              x={padLeft - LABEL_GAP}
              y={group.y + group.height / 2}
              math={group.label(group.count)}
              anchor="end"
              space={labelWidth}
              fontSize={15}
            />
          </g>
        ))}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
