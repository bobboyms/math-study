import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Do sistema com letras para a matriz aumentada (lição 11.4).
//
// As equações aparecem escritas por extenso, com cada incógnita na sua
// coluna. Na animação, as letras, os sinais de mais e os iguais se apagam, os
// coeficientes deslizam até formar as colunas da tabela, e surgem os
// colchetes, a barra no lugar do igual e o nome de cada coluna. Um
// coeficiente que não aparece na equação (a incógnita faltando) surge como 0
// na tabela. O botão de volta faz o caminho contrário: a tabela vira de novo
// as equações.

const DUR = 3.4;
const TOP = 46;
const RH = 40;
const NAME_X = 100;

function termTex(a, v, first) {
  const abs = Math.abs(a);
  const cs = abs === 1 ? '' : String(abs);
  if (first) return `${a < 0 ? '-' : ''}${cs}${v}`;
  return `${cs}${v}`;
}

export default function SystemAugmented({
  rows,
  vars = ['x', 'y', 'z'],
  rowNames,
  resultName = '\\text{meta}',
  caption,
}) {
  const n = vars.length;
  const m = rows.length;
  const {ref, t, play, playing} = useAnimation({duration: DUR});
  const [back, setBack] = useState(false);
  const tau = back ? DUR - t : t;

  const TX = vars.map((_, j) => 142 + 74 * j);
  const OX = vars.slice(1).map((_, j) => (TX[j] + TX[j + 1]) / 2);
  const EQX = TX[n - 1] + 44;
  const CL = EQX + 36;
  const MX = vars.map((_, j) => 150 + 52 * j);
  const barX = MX[n - 1] + 27;
  const MC = barX + 30;
  const lb = MX[0] - 30;
  const rb = MC + 28;
  const W = Math.max(CL + 44, rb + 20);
  const H = TOP + (m - 1) * RH + 30;
  const top = TOP - RH / 2 + 4;
  const bottom = TOP + (m - 1) * RH + RH / 2 - 4;

  const opsK = 1 - stage(tau, 0.3, 1.0);
  const move = stage(tau, 0.8, 2.2);
  const swapK = stage(tau, 0.8, 1.6);
  const frame = stage(tau, 2.0, 2.8);

  return (
    <div className={shared.wrapper} data-explorer="system-augmented">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label="O sistema escrito com letras vira a matriz aumentada: as letras e os sinais saem, os números ficam nas colunas."
        >
          <g opacity={frame}>
            {vars.map((v, j) => (
              <SvgMath key={v} x={MX[j]} y={16} math={v} fontSize={13} tone={1} />
            ))}
            <SvgMath x={MC} y={16} math={resultName} fontSize={13} tone={2} />
            <path d={`M ${lb + 7} ${top} L ${lb} ${top} L ${lb} ${bottom} L ${lb + 7} ${bottom}`} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
            <path d={`M ${rb - 7} ${top} L ${rb} ${top} L ${rb} ${bottom} L ${rb - 7} ${bottom}`} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
            <line x1={barX} x2={barX} y1={top + 2} y2={bottom - 2} stroke="var(--mv-tone-2)" strokeWidth={1.6} />
          </g>
          {rows.map((row, i) => {
            const y = TOP + i * RH;
            const firstShown = row.findIndex((a, j) => j < n && a !== 0);
            return (
              <g key={i}>
                {rowNames && (
                  <SvgMath x={NAME_X} y={y} math={`\\text{${rowNames[i]}}`} anchor="end" space={NAME_X - 2} fontSize={13} />
                )}
                {row.slice(0, n).map((a, j) => {
                  const x = TX[j] + (MX[j] - TX[j]) * move;
                  const letter = a === 0 ? null : termTex(a, vars[j], j === firstShown);
                  return (
                    <g key={j}>
                      {letter && (
                        <g opacity={1 - swapK}>
                          <SvgMath x={x} y={y} math={letter} fontSize={16} />
                        </g>
                      )}
                      <g opacity={swapK}>
                        <SvgMath x={x} y={y} math={String(a)} fontSize={16} />
                      </g>
                    </g>
                  );
                })}
                <g opacity={opsK}>
                  {OX.map((x, j) => {
                    const a = row[j + 1];
                    const before = row.slice(0, j + 1).some((b) => b !== 0);
                    if (a === 0 || !before) return null;
                    return <SvgMath key={j} x={x} y={y} math={a < 0 ? '-' : '+'} fontSize={16} />;
                  })}
                  <SvgMath x={EQX} y={y} math="=" fontSize={16} />
                </g>
                <SvgMath x={CL + (MC - CL) * move} y={y} math={String(row[n])} fontSize={16} />
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          {back
            ? 'De volta às equações: cada linha da tabela é uma equação, e cada coluna diz a que letra o número pertence.'
            : 'Só os números ficaram. A coluna diz a que letra cada número pertence, e a barra está no lugar do sinal de igual.'}
        </p>
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setBack(false);
            play();
          }}
        >
          Guardar só os números
        </button>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setBack(true);
            play();
          }}
        >
          Voltar para as equações
        </button>
      </div>
    </div>
  );
}
