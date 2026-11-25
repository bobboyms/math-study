import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// O teste por escalonamento (lição 11.5): os vetores entram como colunas, a
// matriz é escalonada uma operação por vez, e no fim cada pivô ganha um
// círculo. Coluna sem pivô fica sombreada (vetor que sobra: dependência).
// Linha sem pivô (toda de zeros) ganha um aviso à direita (há alvos fora do
// alcance).
//
// Cada caso traz a matriz inicial e as operações, com a matriz depois de cada
// uma. A animação mostra a linha que muda, e os números novos aparecem no
// lugar dos velhos.

function fracTex(x) {
  if (Math.abs(x) < 1e-9) return '0';
  for (let d = 1; d <= 12; d += 1) {
    const n = Math.round(x * d);
    if (Math.abs(n / d - x) < 1e-9) {
      if (d === 1) return String(n);
      return `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`;
    }
  }
  return String(x).replace('.', '{,}');
}

const pivotsOf = (m) =>
  m.map((row) => {
    const j = row.findIndex((x) => Math.abs(x) > 1e-9);
    return j;
  });

const CELL_W = 58;
const CELL_H = 40;
const LEFT = 30;
const TOP = 70;

export default function PivotColumns({cases, initial = 0, caption}) {
  const [index, setIndex] = useState(initial);
  const c = cases[index];
  const nSteps = c.steps.length;
  const stepDur = 1.5;
  const duration = 0.6 + stepDur * nSteps + 1.2;
  const {ref, t, play, playing} = useAnimation({duration});

  const k = Math.max(0, Math.min(nSteps, Math.floor((t - 0.6) / stepDur) + 1));
  const local = t - 0.6 - (k - 1) * stepDur; // tempo dentro do passo k
  const mats = [c.start, ...c.steps.map((s) => s.m)];
  const cur = mats[k];
  const prev = mats[Math.max(0, k - 1)];
  const fadeIn = k === 0 ? 1 : stage(local, 0.2, 0.8);
  const marks = stage(t, 0.6 + stepDur * nSteps, duration - 0.2);

  const rows = c.start.length;
  const cols = c.start[0].length;
  const W = LEFT + cols * CELL_W + 150;
  const H = TOP + rows * CELL_H + 46;
  const cx = (j) => LEFT + 12 + j * CELL_W + CELL_W / 2;
  const cy = (i) => TOP + i * CELL_H + CELL_H / 2;

  const final = mats[nSteps];
  const piv = pivotsOf(final);
  const pivotCols = new Set(piv.filter((j) => j >= 0));
  const freeCols = [...Array(cols).keys()].filter((j) => !pivotCols.has(j));
  const zeroRows = piv.map((j, i) => (j < 0 ? i : -1)).filter((i) => i >= 0);
  const changed = k > 0 ? c.steps[k - 1].row : -1;

  const bracket = (side) => {
    const x = side === 'left' ? LEFT + 8 : LEFT + 16 + cols * CELL_W;
    const d = side === 'left' ? 7 : -7;
    return `M ${x + d} ${TOP - 2} L ${x} ${TOP - 2} L ${x} ${TOP + rows * CELL_H + 2} L ${x + d} ${TOP + rows * CELL_H + 2}`;
  };

  const verdict = [];
  if (freeCols.length) {
    verdict.push(
      `${freeCols.length === 1 ? 'A coluna' : 'As colunas'} de ${freeCols.map((j) => `$${c.names[j]}$`).join(' e ')} ${freeCols.length === 1 ? 'ficou' : 'ficaram'} sem pivô: os vetores são dependentes.`,
    );
  } else verdict.push('Toda coluna tem pivô: os vetores são independentes.');
  if (zeroRows.length) verdict.push('Uma linha ficou sem pivô, toda de zeros: há alvos que os vetores não alcançam.');
  else verdict.push('Toda linha tem pivô: nenhum alvo produz a linha impossível, e os vetores alcançam tudo.');

  // o texto usa $...$ para os nomes; aqui ele vira Formula
  const renderText = (s) =>
    s.split('$').map((part, i) => (i % 2 ? <Formula key={i} math={part} /> : <span key={i}>{part}</span>));

  return (
    <div className={shared.wrapper} data-explorer="pivot-columns">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{display: 'block', width: '100%', maxWidth: `${Math.min(W * 1.15, 520)}px`, height: 'auto', margin: '0 auto'}}
          role="img"
          aria-label={caption}
        >
          {/* operação em curso */}
          <SvgMath
            x={LEFT + 8}
            y={18}
            anchor="start"
            space={W - LEFT}
            math={k === 0 ? '\\text{os vetores como colunas}' : `${c.steps[k - 1].op}`}
            fontSize={14}
          />
          {/* nomes das colunas */}
          {c.names.map((nm, j) => (
            <SvgMath key={nm} x={cx(j)} y={TOP - 22} math={nm} fontSize={14} />
          ))}
          {/* sombra das colunas sem pivô */}
          {freeCols.map((j) => (
            <g key={`f${j}`} opacity={marks}>
              <rect x={cx(j) - CELL_W / 2 + 4} y={TOP - 4} width={CELL_W - 8} height={rows * CELL_H + 8} rx={6} fill="var(--mv-tone-2)" fillOpacity={0.18} />
              <text x={cx(j)} y={TOP + rows * CELL_H + 22} textAnchor="middle" fontSize={12} fill="var(--mv-tone-2)" fontWeight={600}>
                sem pivô
              </text>
            </g>
          ))}
          {/* linha que acabou de mudar */}
          {changed >= 0 && k <= nSteps && (
            <rect
              x={LEFT + 14}
              y={TOP + changed * CELL_H + 3}
              width={cols * CELL_W - 4}
              height={CELL_H - 6}
              rx={5}
              fill="var(--mv-tone-1)"
              fillOpacity={0.14 * (1 - marks)}
            />
          )}
          <path d={bracket('left')} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <path d={bracket('right')} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          {cur.map((row, i) =>
            row.map((val, j) => {
              const old = prev[i][j];
              const same = Math.abs(old - val) < 1e-12 || i !== changed;
              return (
                <g key={`${i}-${j}`}>
                  {!same && <g opacity={1 - fadeIn}><SvgMath x={cx(j)} y={cy(i)} math={fracTex(old)} fontSize={16} /></g>}
                  <g opacity={same ? 1 : fadeIn}>
                    <SvgMath x={cx(j)} y={cy(i)} math={fracTex(val)} fontSize={16} />
                  </g>
                </g>
              );
            }),
          )}
          {/* pivôs */}
          {piv.map((j, i) =>
            j >= 0 ? (
              <circle key={`p${i}`} cx={cx(j)} cy={cy(i)} r={19} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2.4} opacity={marks} />
            ) : null,
          )}
          {zeroRows.map((i) => (
            <text key={`z${i}`} x={LEFT + 24 + cols * CELL_W} y={cy(i) + 4} fontSize={12} fill="var(--ifm-color-emphasis-800)" opacity={marks}>
              linha sem pivô
            </text>
          ))}
        </svg>
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {marks > 0.5 ? verdict.map((s, i) => <p key={i}>{renderText(s)}</p>) : <p>Escalonando: uma operação por vez.</p>}
      </div>

      <div className={shared.buttons}>
        {cases.map((cs, i) => (
          <button
            key={cs.label}
            type="button"
            aria-pressed={i === index}
            disabled={playing}
            onClick={() => {
              setIndex(i);
              // a duração depende do número de operações do caso escolhido
              play({duration: 0.6 + stepDur * cs.steps.length + 1.2});
            }}
          >
            {cs.label}
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
