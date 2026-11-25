import React, {useMemo, useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {applyOp, leadCol, opTex, texFr, toFr} from './frac';

// O escalonamento animado linha a linha (lição 11.4, Sistemas lineares e
// escalonamento).
//
// A matriz aumentada passa pelas operações de `steps`, um passo de cada vez.
// Em cada passo, a linha que muda fica pintada de laranja, a linha que
// empresta os números fica contornada de azul, a operação aparece escrita à
// direita da linha e os números antigos dão lugar aos novos. Numa troca, as
// duas linhas trocam de altura. No fim, a escada é desenhada embaixo dos
// pivôs, e os pivôs ganham caixas.
//
// O aluno também pode andar um passo de cada vez ("Voltar ao início" e
// "Próximo passo"), e o painel embaixo da figura diz o que o passo fez e a
// conta de uma das linhas.
//
// Props:
//   start  linhas da matriz aumentada (números inteiros)
//   steps  [{ops: [{op: 'add', row: 2, from: 1, k: -2}, ...], text, calc}]
//          (ops como em ./frac.js; `text` é texto simples; `calc`, LaTeX)
//   vars   rótulos das colunas, por exemplo ['x', 'y', 'z', '\\text{meta}']
//   startText, endText  painel antes do primeiro passo e depois do último
//   staircase  false para não desenhar a escada no fim

const STEP = 1.6;
const END = 0.9;
const RH = 42;
const TOP = 52;
const CW = 50;
const X0 = 52;

const cx = (c, n) => X0 + 30 + c * CW + (c >= n ? 12 : 0);

export default function SystemElimination({
  start,
  steps = [],
  vars,
  startText = 'A matriz aumentada de partida.',
  endText,
  staircase = true,
  caption,
}) {
  const m = start.length;
  const cols = start[0].length;
  const n = cols - 1;
  const heads = vars ?? [...['x', 'y', 'z', 'w'].slice(0, n), ''];

  const states = useMemo(() => {
    const out = [start.map((r) => r.map(toFr))];
    steps.forEach((s) => {
      out.push(s.ops.reduce((acc, op) => applyOp(acc, op), out[out.length - 1]));
    });
    return out;
  }, [start, steps]);
  const S = steps.length;

  const total = S * STEP + END;
  const main = useAnimation({duration: total});
  const one = useAnimation({duration: STEP, autoplay: false});
  const [manual, setManual] = useState(false);
  const [base, setBase] = useState(0);

  const pos = manual ? Math.max(0, base - 1 + one.t / STEP) : Math.min(S, main.t / STEP);
  const playing = main.playing || one.playing;
  const stairK = S === 0 ? 1 : manual ? (base === S ? stage(one.t, STEP * 0.55, STEP) : 0) : stage(main.t, S * STEP, total);

  // Passo em andamento e progresso dentro dele. Numa posição inteira, o passo
  // que acabou de terminar continua à vista (progresso 1), com o destaque.
  let s = 0;
  let p = 1;
  if (S > 0 && pos <= 0) p = 0;
  else if (S > 0) {
    s = Math.ceil(pos) - 1;
    p = pos - s;
  }
  const from = S === 0 ? states[0] : states[s];
  const to = S === 0 ? states[0] : states[s + 1];
  const ops = S === 0 ? [] : steps[s].ops;
  const show = S > 0 && pos > 0;
  // os destaques somem enquanto a escada aparece: o quadro final é a escada
  const hl = show ? stage(p, 0, 0.22) * (1 - stairK) : 0;
  const swap = ops.find((o) => o.op === 'swap');
  const targets = ops.filter((o) => o.op !== 'swap').map((o) => o.row - 1);
  const sources = ops.filter((o) => o.op === 'add').map((o) => o.from - 1);
  const k = show ? stage(p, 0.25, 0.75) : 0;

  const rowY = (i) => TOP + i * RH;
  const barX = X0 + 30 + (n - 0.5) * CW + 6;
  const lastX = cx(n, n);
  const rb = lastX + 28;
  const annX = rb + 20;
  const W = annX + 166;
  const H = TOP + (m - 1) * RH + RH / 2 + 10;
  const top = TOP - RH / 2 + 2;
  const bottom = TOP + (m - 1) * RH + RH / 2 - 2;

  // Posição vertical de cada linha do estado antigo durante uma troca.
  const yOf = (i) => {
    if (!swap || !show) return rowY(i);
    const [a, b] = swap.rows.map((r) => r - 1);
    if (i === a) return rowY(a) + (rowY(b) - rowY(a)) * k;
    if (i === b) return rowY(b) + (rowY(a) - rowY(b)) * k;
    return rowY(i);
  };

  // A escada, desenhada a partir da matriz final.
  const fin = states[S];
  const leads = fin.map((r) => leadCol(r, n));
  const xL = (c) => cx(c, n) - CW / 2;
  const stairPts = [];
  const pivotRows = leads.map((c, i) => [c, i]).filter(([c]) => c >= 0);
  pivotRows.forEach(([c, i], idx) => {
    const y0 = rowY(i) - RH / 2;
    const y1 = rowY(i) + RH / 2;
    stairPts.push([xL(c), y0], [xL(c), y1]);
    const next = pivotRows[idx + 1];
    stairPts.push([next ? xL(next[0]) : barX, y1]);
  });
  const shade =
    stairPts.length > 0
      ? [...stairPts, [barX, bottom], [xL(0), bottom], [xL(0), stairPts[0][1]]]
      : [];

  const info =
    S === 0
      ? {text: endText}
      : pos <= 0
        ? {text: startText}
        : pos >= S && stairK > 0.5 && endText
          ? {text: endText}
          : {text: `Passo ${s + 1} de ${S}. ${steps[s].text ?? ''}`, calc: steps[s].calc};

  const bracket = (x, dir) =>
    `M ${x + 7 * dir} ${top} L ${x} ${top} L ${x} ${bottom} L ${x + 7 * dir} ${bottom}`;

  return (
    <div className={shared.wrapper} data-explorer="system-elimination">
      <figure ref={main.ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label="Matriz aumentada sendo escalonada, um passo de cada vez, até a forma de escada."
        >
          {heads.map((h, c) =>
            h ? <SvgMath key={`h${c}`} x={cx(c, n)} y={18} math={h} fontSize={13} /> : null,
          )}

          {/* zeros embaixo da escada */}
          {staircase && shade.length > 0 && (
            <polygon
              points={shade.map((q) => q.join(',')).join(' ')}
              fill="var(--mv-tone-3)"
              fillOpacity={0.1 * stairK}
              stroke="none"
            />
          )}

          {/* destaques do passo */}
          {targets.map((r) => (
            <rect
              key={`t${r}`}
              x={X0 + 5}
              y={rowY(r) - RH / 2 + 4}
              width={rb - X0 - 10}
              height={RH - 8}
              rx={5}
              fill="var(--mv-tone-2)"
              fillOpacity={0.16 * hl}
              stroke="var(--mv-tone-2)"
              strokeOpacity={0.8 * hl}
              strokeWidth={1.5}
            />
          ))}
          {sources.map((r) => (
            <rect
              key={`s${r}`}
              x={X0 + 5}
              y={rowY(r) - RH / 2 + 4}
              width={rb - X0 - 10}
              height={RH - 8}
              rx={5}
              fill="none"
              stroke="var(--mv-tone-1)"
              strokeOpacity={hl}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          ))}

          {/* colchetes e barra */}
          <path d={bracket(X0, 1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <path d={bracket(rb, -1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <line x1={barX} x2={barX} y1={top + 2} y2={bottom - 2} stroke="var(--ifm-font-color-base)" strokeWidth={1.2} />

          {/* nomes das linhas (posições fixas) */}
          {from.map((_, i) => (
            <SvgMath key={`L${i}`} x={22} y={rowY(i)} math={`L_{${i + 1}}`} fontSize={13} />
          ))}

          {/* números */}
          {from.map((row, i) => {
            const changes = targets.includes(i);
            return row.map((v, c) => {
              const x = cx(c, n);
              if (!changes) {
                return <SvgMath key={`v${i}-${c}`} x={x} y={yOf(i)} math={texFr(v)} fontSize={16} />;
              }
              const nv = to[i][c];
              const same = nv.n === v.n && nv.d === v.d;
              if (same) return <SvgMath key={`v${i}-${c}`} x={x} y={rowY(i)} math={texFr(v)} fontSize={16} />;
              return (
                <g key={`v${i}-${c}`}>
                  <g opacity={1 - Math.min(1, k * 2)}>
                    <SvgMath x={x} y={rowY(i) - 8 * k} math={texFr(v)} fontSize={16} />
                  </g>
                  <g opacity={Math.max(0, k * 2 - 1)}>
                    <SvgMath x={x} y={rowY(i) + 8 * (1 - k)} math={texFr(nv)} fontSize={16} />
                  </g>
                </g>
              );
            });
          })}

          {/* caixas dos pivôs */}
          {staircase &&
            leads.map((c, i) =>
              c >= 0 ? (
                <rect
                  key={`p${i}`}
                  x={cx(c, n) - 18}
                  y={rowY(i) - 15}
                  width={36}
                  height={30}
                  rx={4}
                  fill="none"
                  stroke="var(--mv-tone-3)"
                  strokeWidth={2}
                  opacity={stairK}
                />
              ) : null,
            )}
          {staircase && stairPts.length > 0 && (
            <polyline
              points={stairPts.map((q) => q.join(',')).join(' ')}
              fill="none"
              stroke="var(--mv-tone-3)"
              strokeWidth={2.2}
              strokeDasharray="6 4"
              opacity={stairK}
            />
          )}

          {/* operação escrita ao lado da linha */}
          {show &&
            ops.map((op, idx) => {
              const y = op.op === 'swap' ? (rowY(op.rows[0] - 1) + rowY(op.rows[1] - 1)) / 2 : rowY(op.row - 1);
              return (
                <g key={`op${idx}`} opacity={hl}>
                  <SvgMath x={annX} y={y} math={opTex(op)} anchor="start" space={W - annX - 2} fontSize={14} tone={2} />
                </g>
              );
            })}
          {show && swap && (
            <g opacity={hl} stroke="var(--mv-tone-2)" strokeWidth={1.6} fill="none">
              <line x1={38} x2={38} y1={rowY(swap.rows[0] - 1) + 8} y2={rowY(swap.rows[1] - 1) - 8} />
              <path d={`M 34 ${rowY(swap.rows[0] - 1) + 14} L 38 ${rowY(swap.rows[0] - 1) + 8} L 42 ${rowY(swap.rows[0] - 1) + 14}`} />
              <path d={`M 34 ${rowY(swap.rows[1] - 1) - 14} L 38 ${rowY(swap.rows[1] - 1) - 8} L 42 ${rowY(swap.rows[1] - 1) - 14}`} />
            </g>
          )}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {info.text && <p>{info.text}</p>}
        {info.calc && (
          <p className={shared.formula}>
            <Formula math={info.calc} />
          </p>
        )}
      </div>
      {S > 0 && (
        <div className={shared.buttons}>
          <button
            type="button"
            disabled={playing}
            onClick={() => {
              setManual(false);
              main.play();
            }}
          >
            Ver tudo de novo
          </button>
          <button
            type="button"
            disabled={playing}
            onClick={() => {
              setManual(true);
              setBase(0);
            }}
          >
            Voltar ao início
          </button>
          <button
            type="button"
            disabled={playing || (manual ? base >= S : true)}
            onClick={() => {
              setBase(base + 1);
              one.play();
            }}
          >
            Próximo passo
          </button>
        </div>
      )}
    </div>
  );
}
