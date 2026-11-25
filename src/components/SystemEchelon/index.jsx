import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {leadCol, texFr, toFr} from '../SystemElimination/frac';

// Está ou não está na forma escalonada? (lição 11.4)
//
// Para cada linha, o primeiro número diferente de zero (à esquerda da barra)
// ganha um círculo, e uma linha tracejada liga esses números de cima para
// baixo, como uma escada. Se cada degrau começa mais à direita que o de cima,
// e as linhas de zeros estão embaixo, a escada desce sempre para a direita: a
// matriz está escalonada, e os números circulados são os pivôs. Se algum
// degrau volta para a esquerda, ou uma linha de zeros está acima de outra, o
// trecho errado sai em laranja e o painel diz qual regra falhou.
//
// Props: matrices [{name, rows}]: um botão por matriz quando há mais de uma.

const RH = 42;
const TOP = 52;
const CW = 50;
const X0 = 52;
const cx = (c, n) => X0 + 30 + c * CW + (c >= n ? 12 : 0);

function analyse(rows, n) {
  const leads = rows.map((r) => leadCol(r, n));
  const problems = [];
  leads.forEach((c, i) => {
    if (i === 0) return;
    const prev = leads[i - 1];
    if (prev === -1 && c !== -1) {
      problems.push({row: i, kind: 'zero', text: `A linha ${i} é toda de zeros à esquerda da barra, e está acima da linha ${i + 1}, que não é. As linhas de zeros ficam embaixo de todas as outras.`});
    } else if (c !== -1 && prev !== -1 && c <= prev) {
      problems.push({row: i, kind: 'back', text: `O primeiro número diferente de zero da linha ${i + 1} está na coluna ${c + 1}. Ele não está mais à direita que o da linha ${i}, que está na coluna ${prev + 1}: a escada voltou.`});
    }
  });
  return {leads, problems};
}

export default function SystemEchelon({matrices, caption}) {
  const [which, setWhich] = useState(0);
  const {rows: raw, name} = matrices[which];
  const rows = raw.map((r) => r.map(toFr));
  const m = rows.length;
  const n = rows[0].length - 1;
  const {leads, problems} = analyse(rows, n);
  const ok = problems.length === 0;
  const badRows = new Set(problems.map((q) => q.row));

  const rowY = (i) => TOP + i * RH;
  const barX = X0 + 30 + (n - 0.5) * CW + 6;
  const rb = cx(n, n) + 28;
  const W = rb + 150;
  const H = TOP + (m - 1) * RH + RH / 2 + 10;
  const top = TOP - RH / 2 + 2;
  const bottom = TOP + (m - 1) * RH + RH / 2 - 2;
  const xL = (c) => cx(c, n) - CW / 2;

  // Escada: só pelas linhas que têm algum número diferente de zero.
  const segs = [];
  const nz = leads.map((c, i) => [c, i]).filter(([c]) => c >= 0);
  nz.forEach(([c, i], idx) => {
    const bad = badRows.has(i);
    const y0 = rowY(i) - RH / 2;
    const y1 = rowY(i) + RH / 2;
    if (idx > 0) {
      const [pc, pi] = nz[idx - 1];
      segs.push({pts: [[xL(pc), rowY(pi) + RH / 2], [xL(c), rowY(pi) + RH / 2]], bad});
    }
    segs.push({pts: [[xL(c), y0], [xL(c), y1]], bad});
  });

  const bracket = (x, dir) =>
    `M ${x + 7 * dir} ${top} L ${x} ${top} L ${x} ${bottom} L ${x + 7 * dir} ${bottom}`;

  return (
    <div className={shared.wrapper} data-explorer="system-echelon">
      <figure className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={ok ? 'Matriz na forma escalonada, com a escada descendo para a direita.' : 'Matriz fora da forma escalonada: a escada volta para a esquerda.'}
        >
          {['x', 'y', 'z', 'w'].slice(0, n).map((h, c) => (
            <SvgMath key={h} x={cx(c, n)} y={18} math={h} fontSize={13} />
          ))}
          <path d={bracket(X0, 1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <path d={bracket(rb, -1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <line x1={barX} x2={barX} y1={top + 2} y2={bottom - 2} stroke="var(--ifm-font-color-base)" strokeWidth={1.2} />

          {segs.map((sg, i) => (
            <polyline
              key={i}
              points={sg.pts.map((q) => q.join(',')).join(' ')}
              fill="none"
              stroke={sg.bad ? 'var(--mv-tone-2)' : 'var(--mv-tone-3)'}
              strokeWidth={2.2}
              strokeDasharray="6 4"
            />
          ))}

          {rows.map((row, i) => (
            <g key={i}>
              <SvgMath x={22} y={rowY(i)} math={`L_{${i + 1}}`} fontSize={13} />
              {leads[i] === -1 && badRows.has(i + 1) && (
                <rect x={X0 + 5} y={rowY(i) - RH / 2 + 4} width={rb - X0 - 10} height={RH - 8} rx={5} fill="var(--mv-tone-2)" fillOpacity={0.14} stroke="var(--mv-tone-2)" strokeWidth={1.5} />
              )}
              {leads[i] >= 0 && (
                <circle
                  cx={cx(leads[i], n)}
                  cy={rowY(i)}
                  r={15}
                  fill="none"
                  stroke={badRows.has(i) ? 'var(--mv-tone-2)' : 'var(--mv-tone-3)'}
                  strokeWidth={2}
                />
              )}
              {row.map((v, c) => (
                <SvgMath key={c} x={cx(c, n)} y={rowY(i)} math={texFr(v)} fontSize={16} />
              ))}
            </g>
          ))}
          <SvgMath
            x={rb + 16}
            y={TOP + ((m - 1) * RH) / 2}
            math={ok ? '\\text{escalonada}' : '\\text{não escalonada}'}
            anchor="start"
            space={W - rb - 18}
            fontSize={14}
            tone={ok ? 3 : 2}
          />
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {ok ? (
          <p>
            {name ? `${name}: ` : ''}cada degrau começa mais à direita que o de cima, e não há linha de zeros acima
            de outra. Os números circulados são os pivôs.
          </p>
        ) : (
          problems.map((q) => <p key={q.row}>{q.text}</p>)
        )}
      </div>
      {matrices.length > 1 && (
        <div className={shared.buttons}>
          {matrices.map((mt, i) => (
            <button key={mt.name} type="button" aria-pressed={which === i} onClick={() => setWhich(i)}>
              {mt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
