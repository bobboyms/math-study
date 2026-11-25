import React, {useMemo, useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {applyOp, eq, fr, isZero, opTex, texFr, toFr} from '../SystemElimination/frac';

// O método de Gauss-Jordan animado: [A | I] vira [I | A⁻¹] (lição 11.8,
// Matriz inversa).
//
// Mesma linguagem visual do SystemElimination (lição 11.4): em cada passo, a
// linha que muda fica pintada de laranja, a linha que empresta os números
// fica contornada de azul (tracejado), os números antigos dão lugar aos
// novos, e numa troca as duas linhas trocam de altura. A diferença é a barra,
// que fica no meio: à esquerda a matriz A, à direita a identidade. A operação
// do passo é escrita embaixo da matriz (e não ao lado), para a figura caber
// no celular.
//
// No fim, se a esquerda virou a identidade, a parte esquerda ganha uma caixa
// verde com o nome I e a direita, uma caixa azul com o nome A⁻¹. Se a
// esquerda ganhou uma linha de zeros, essa linha fica marcada em laranja.
//
// Props:
//   start   linhas de A (números inteiros); a identidade é acrescentada
//   steps   [{ops: [...], text, calc}] como no SystemElimination
//   name    nome da matriz (padrão 'A')
//   startText, endText

const STEP = 1.7;
const END = 1.1;
const RH = 40;
const TOP = 44;
const CW = 48;
const X0 = 46;

export default function InverseGaussJordan({start, steps = [], name = 'A', startText, endText, caption}) {
  const n = start.length;
  const cols = 2 * n;
  const cx = (c) => X0 + 30 + c * CW + (c >= n ? 16 : 0);

  const states = useMemo(() => {
    const first = start.map((r, i) => [...r.map(toFr), ...Array.from({length: n}, (_, j) => fr(i === j ? 1 : 0))]);
    const out = [first];
    steps.forEach((s) => {
      out.push(s.ops.reduce((acc, op) => applyOp(acc, op), out[out.length - 1]));
    });
    return out;
  }, [start, steps, n]);
  const S = steps.length;

  const total = S * STEP + END;
  const main = useAnimation({duration: total});
  const one = useAnimation({duration: STEP, autoplay: false});
  const [manual, setManual] = useState(false);
  const [base, setBase] = useState(0);

  const pos = manual ? Math.max(0, base - 1 + one.t / STEP) : Math.min(S, main.t / STEP);
  const playing = main.playing || one.playing;
  const endK =
    S === 0 ? 1 : manual ? (base === S ? stage(one.t, STEP * 0.55, STEP) : 0) : stage(main.t, S * STEP, total);

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
  const hl = show ? stage(p, 0, 0.22) * (1 - endK) : 0;
  const swap = ops.find((o) => o.op === 'swap');
  const targets = ops.filter((o) => o.op !== 'swap').map((o) => o.row - 1);
  const sources = ops.filter((o) => o.op === 'add').map((o) => o.from - 1);
  const k = show ? stage(p, 0.25, 0.75) : 0;

  const rowY = (i) => TOP + i * RH;
  const barX = (cx(n - 1) + cx(n)) / 2;
  const lb = X0;
  const rb = cx(cols - 1) + 28;
  const W = rb + 24;
  const opY = TOP + (n - 1) * RH + RH / 2 + 26;
  const H = opY + 20;
  const top = TOP - RH / 2 + 2;
  const bottom = TOP + (n - 1) * RH + RH / 2 - 2;

  const yOf = (i) => {
    if (!swap || !show) return rowY(i);
    const [a, b] = swap.rows.map((r) => r - 1);
    if (i === a) return rowY(a) + (rowY(b) - rowY(a)) * k;
    if (i === b) return rowY(b) + (rowY(a) - rowY(b)) * k;
    return rowY(i);
  };

  // Como terminou: a esquerda virou I? Alguma linha da esquerda é toda zero?
  const fin = states[S];
  const leftIsI = fin.every((row, i) => row.slice(0, n).every((v, j) => eq(v, fr(i === j ? 1 : 0))));
  const zeroRows = fin.map((row, i) => (row.slice(0, n).every(isZero) ? i : -1)).filter((i) => i >= 0);

  const info =
    S === 0
      ? {text: endText}
      : pos <= 0
        ? {text: startText}
        : pos >= S && endK > 0.5 && endText
          ? {text: endText}
          : {text: `Passo ${s + 1} de ${S}. ${steps[s].text ?? ''}`, calc: steps[s].calc};

  const bracket = (x, dir) => `M ${x + 7 * dir} ${top} L ${x} ${top} L ${x} ${bottom} L ${x + 7 * dir} ${bottom}`;
  const leftL = cx(0) - CW / 2 + 2;
  const leftR = barX - 6;
  const rightL = barX + 6;
  const rightR = cx(cols - 1) + CW / 2 - 2;

  const headLeft = leftIsI && endK > 0.5 ? 'I' : name;
  const headRight = leftIsI && endK > 0.5 ? `${name}^{-1}` : 'I';
  const headTone = leftIsI ? 3 : undefined;

  return (
    <div className={shared.wrapper} data-explorer="inverse-gauss-jordan">
      <figure ref={main.ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Matriz ${name} ao lado da identidade sendo escalonada, um passo de cada vez.`}
        >
          {/* nomes dos dois blocos */}
          <SvgMath x={(leftL + leftR) / 2} y={12} math={headLeft} fontSize={15} tone={endK > 0.5 ? headTone : undefined} />
          <SvgMath x={(rightL + rightR) / 2} y={12} math={headRight} fontSize={15} tone={endK > 0.5 && leftIsI ? 1 : undefined} />

          {/* destaques do passo */}
          {targets.map((r) => (
            <rect
              key={`t${r}`}
              x={lb + 5}
              y={rowY(r) - RH / 2 + 4}
              width={rb - lb - 10}
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
              x={lb + 5}
              y={rowY(r) - RH / 2 + 4}
              width={rb - lb - 10}
              height={RH - 8}
              rx={5}
              fill="none"
              stroke="var(--mv-tone-1)"
              strokeOpacity={hl}
              strokeWidth={1.5}
              strokeDasharray="5 4"
            />
          ))}

          {/* fim: caixas de I e de A⁻¹, ou a linha de zeros */}
          {leftIsI && (
            <g opacity={endK}>
              <rect x={leftL} y={top + 2} width={leftR - leftL} height={bottom - top - 4} rx={6} fill="var(--mv-tone-3)" fillOpacity={0.12} stroke="var(--mv-tone-3)" strokeWidth={2} />
              <rect x={rightL} y={top + 2} width={rightR - rightL} height={bottom - top - 4} rx={6} fill="var(--mv-tone-1)" fillOpacity={0.1} stroke="var(--mv-tone-1)" strokeWidth={2} />
            </g>
          )}
          {!leftIsI &&
            zeroRows.map((r) => (
              <rect
                key={`z${r}`}
                x={leftL}
                y={rowY(r) - RH / 2 + 5}
                width={leftR - leftL}
                height={RH - 10}
                rx={5}
                fill="var(--mv-tone-2)"
                fillOpacity={0.14 * endK}
                stroke="var(--mv-tone-2)"
                strokeWidth={2}
                opacity={endK}
              />
            ))}

          {/* colchetes e barra */}
          <path d={bracket(lb, 1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <path d={bracket(rb, -1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <line x1={barX} x2={barX} y1={top + 2} y2={bottom - 2} stroke="var(--ifm-font-color-base)" strokeWidth={1.2} />

          {from.map((_, i) => (
            <SvgMath key={`L${i}`} x={18} y={rowY(i)} math={`L_{${i + 1}}`} fontSize={13} />
          ))}

          {/* números */}
          {from.map((row, i) => {
            const changes = targets.includes(i);
            return row.map((v, c) => {
              const x = cx(c);
              if (!changes) {
                return <SvgMath key={`v${i}-${c}`} x={x} y={yOf(i)} math={texFr(v)} fontSize={16} />;
              }
              const nv = to[i][c];
              if (eq(nv, v)) return <SvgMath key={`v${i}-${c}`} x={x} y={rowY(i)} math={texFr(v)} fontSize={16} />;
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

          {/* operação do passo, embaixo da matriz */}
          {show && (
            <g opacity={hl}>
              <SvgMath
                x={W / 2}
                y={opY}
                math={ops.map((op) => opTex(op)).join('\\qquad ')}
                fontSize={14}
                tone={2}
                space={W}
              />
            </g>
          )}
          {show && swap && (
            <g opacity={hl} stroke="var(--mv-tone-2)" strokeWidth={1.6} fill="none">
              <line x1={34} x2={34} y1={rowY(swap.rows[0] - 1) + 8} y2={rowY(swap.rows[1] - 1) - 8} />
              <path d={`M 30 ${rowY(swap.rows[0] - 1) + 14} L 34 ${rowY(swap.rows[0] - 1) + 8} L 38 ${rowY(swap.rows[0] - 1) + 14}`} />
              <path d={`M 30 ${rowY(swap.rows[1] - 1) - 14} L 34 ${rowY(swap.rows[1] - 1) - 8} L 38 ${rowY(swap.rows[1] - 1) - 14}`} />
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
