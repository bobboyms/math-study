import React, {useMemo, useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {applyOp, mul, opTex, texFr, toFr, fr} from '../SystemElimination/frac';

// O escalonamento animado com o determinante acompanhando (lição 11.9).
//
// Cópia enxuta do SystemElimination (lição 11.4) para matriz quadrada, sem a
// barra da matriz aumentada. Em cada passo, a linha que muda fica pintada de
// laranja, a linha que empresta fica contornada de azul, e a operação aparece
// à direita, com o efeito dela no determinante embaixo: “det não muda”, “det
// troca de sinal” ou “det × k”. No fim, a diagonal ganha caixas verdes, os
// zeros embaixo dela ficam sombreados, e o painel multiplica a diagonal e
// corrige pelas trocas.
//
// Props:
//   start  linhas da matriz quadrada (inteiros)
//   steps  [{ops: [{op: 'add', row: 2, from: 1, k: -2}, ...], text}]
//   startText

const STEP = 1.7;
const END = 1.0;
const RH = 42;
const TOP = 30;
const CW = 50;
const X0 = 52;

const effectOf = (op) => {
  if (op.op === 'swap') return {k: fr(-1), tex: '\\det \\text{ troca de sinal}'};
  if (op.op === 'scale') return {k: toFr(op.k), tex: `\\det \\times ${texFr(toFr(op.k))}`};
  return {k: fr(1), tex: '\\det \\text{ não muda}'};
};

export default function DetElimination({start, steps = [], startText = 'A matriz de partida.', caption}) {
  const m = start.length;
  const states = useMemo(() => {
    const out = [start.map((r) => r.map(toFr))];
    steps.forEach((s) => out.push(s.ops.reduce((acc, op) => applyOp(acc, op), out[out.length - 1])));
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
  const endK = manual ? (base === S ? stage(one.t, STEP * 0.55, STEP) : 0) : stage(main.t, S * STEP, total);

  let s = 0;
  let p = 1;
  if (pos <= 0) p = 0;
  else {
    s = Math.ceil(pos) - 1;
    p = pos - s;
  }
  const from = states[s];
  const to = states[s + 1] ?? states[s];
  const ops = S ? steps[s].ops : [];
  const show = S > 0 && pos > 0;
  const hl = show ? stage(p, 0, 0.22) * (1 - endK) : 0;
  const swap = ops.find((o) => o.op === 'swap');
  const targets = ops.filter((o) => o.op !== 'swap').map((o) => o.row - 1);
  const sources = ops.filter((o) => o.op === 'add').map((o) => o.from - 1);
  const k = show ? stage(p, 0.25, 0.75) : 0;

  const cx = (c) => X0 + 30 + c * CW;
  const rowY = (i) => TOP + i * RH;
  const rb = cx(m - 1) + 28;
  const annX = rb + 20;
  const W = annX + 170;
  const H = TOP + (m - 1) * RH + RH / 2 + 8;
  const top = TOP - RH / 2 + 2;
  const bottom = TOP + (m - 1) * RH + RH / 2 - 2;

  const yOf = (i) => {
    if (!swap || !show) return rowY(i);
    const [a, b] = swap.rows.map((r) => r - 1);
    if (i === a) return rowY(a) + (rowY(b) - rowY(a)) * k;
    if (i === b) return rowY(b) + (rowY(a) - rowY(b)) * k;
    return rowY(i);
  };

  // Efeitos acumulados até o passo atual (inclusive, se já começou).
  const doneSteps = pos <= 0 ? 0 : Math.min(S, Math.ceil(pos - 1e-9));
  let factor = fr(1);
  let swaps = 0;
  for (let i = 0; i < doneSteps; i += 1)
    steps[i].ops.forEach((op) => {
      factor = mul(factor, effectOf(op).k);
      if (op.op === 'swap') swaps += 1;
    });

  const fin = states[S];
  const diag = fin.map((r, i) => r[i]);
  const prod = diag.reduce((acc, v) => mul(acc, v), fr(1));
  const par = (v) => (v.n < 0 ? `(${texFr(v)})` : texFr(v));
  const finalDet = mul(prod, fr(factor.d, factor.n)); // divide pelo fator acumulado

  const atEnd = pos >= S && endK > 0.5;
  let info;
  if (pos <= 0) info = {text: startText};
  else if (atEnd) {
    const diagTex = diag.map(par).join(' \\times ');
    const sign = swaps % 2 === 1;
    info = {
      text: `A matriz ficou triangular. Multiplique a diagonal (caixas verdes). ${swaps === 0 ? 'Não houve troca de linhas' : swaps === 1 ? 'Houve uma troca de linhas' : `Houve ${swaps} trocas de linhas`}${sign ? ', então o sinal do resultado troca' : ''}.`,
      calc: `\\det = ${sign ? '-' : ''}${sign ? '(' : ''}${diagTex}${sign ? ')' : ''} = ${texFr(finalDet)}`,
    };
  } else {
    const eff = steps[s].ops.map((op) => effectOf(op).tex);
    info = {text: `Passo ${s + 1} de ${S}. ${steps[s].text ?? ''}`, calc: eff[0]};
  }

  const bracket = (x, dir) => `M ${x + 7 * dir} ${top} L ${x} ${top} L ${x} ${bottom} L ${x + 7 * dir} ${bottom}`;
  // zeros embaixo da diagonal
  const shade = [];
  for (let i = 1; i < m; i += 1) for (let c = 0; c < i; c += 1) shade.push([i, c]);

  return (
    <div className={shared.wrapper} data-explorer="det-elimination">
      <figure ref={main.ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label="Matriz sendo escalonada até a forma triangular, com o efeito de cada passo no determinante">
          {shade.map(([i, c]) => (
            <rect key={`z${i}${c}`} x={cx(c) - CW / 2 + 2} y={rowY(i) - RH / 2 + 2} width={CW - 4} height={RH - 4} rx={4} fill="var(--mv-tone-3)" fillOpacity={0.12 * endK} />
          ))}
          {targets.map((r) => (
            <rect key={`t${r}`} x={X0 + 5} y={rowY(r) - RH / 2 + 4} width={rb - X0 - 10} height={RH - 8} rx={5} fill="var(--mv-tone-2)" fillOpacity={0.16 * hl} stroke="var(--mv-tone-2)" strokeOpacity={0.8 * hl} strokeWidth={1.5} />
          ))}
          {sources.map((r) => (
            <rect key={`s${r}`} x={X0 + 5} y={rowY(r) - RH / 2 + 4} width={rb - X0 - 10} height={RH - 8} rx={5} fill="none" stroke="var(--mv-tone-1)" strokeOpacity={hl} strokeWidth={1.5} strokeDasharray="5 4" />
          ))}
          <path d={bracket(X0, 1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <path d={bracket(rb, -1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          {from.map((_, i) => (
            <SvgMath key={`L${i}`} x={22} y={rowY(i)} math={`L_{${i + 1}}`} fontSize={13} />
          ))}
          {from.map((row, i) => {
            const changes = targets.includes(i);
            return row.map((v, c) => {
              const x = cx(c);
              if (!changes) return <SvgMath key={`v${i}-${c}`} x={x} y={yOf(i)} math={texFr(v)} fontSize={16} />;
              const nv = to[i][c];
              if (nv.n === v.n && nv.d === v.d) return <SvgMath key={`v${i}-${c}`} x={x} y={rowY(i)} math={texFr(v)} fontSize={16} />;
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
          {diag.map((_, i) => (
            <rect key={`d${i}`} x={cx(i) - 19} y={rowY(i) - 15} width={38} height={30} rx={4} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2} opacity={endK} />
          ))}
          {show &&
            ops.map((op, i) => {
              const y = op.op === 'swap' ? (rowY(op.rows[0] - 1) + rowY(op.rows[1] - 1)) / 2 : rowY(op.row - 1);
              return (
                <g key={`op${i}`} opacity={hl}>
                  <SvgMath x={annX} y={y - 9} math={opTex(op)} anchor="start" space={W - annX - 2} fontSize={14} tone={2} />
                  <SvgMath x={annX} y={y + 11} math={effectOf(op).tex} anchor="start" space={W - annX - 2} fontSize={12} />
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
        {!atEnd && pos > 0 && (
          <p className={shared.hint}>
            Trocas de linha até aqui: {swaps}.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" disabled={playing} onClick={() => { setManual(false); main.play(); }}>
          Ver tudo de novo
        </button>
        <button type="button" disabled={playing} onClick={() => { setManual(true); setBase(0); }}>
          Voltar ao início
        </button>
        <button type="button" disabled={playing || (manual ? base >= S : true)} onClick={() => { setBase(base + 1); one.play(); }}>
          Próximo passo
        </button>
      </div>
    </div>
  );
}
