import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {applyOp, div, eq, fr, isZero, leadCol, mul, neg, opTex, sub, texFr, toFr} from '../SystemElimination/frac';

// Contar os pivôs classifica o sistema (lição 11.4).
//
// À esquerda, a matriz aumentada; à direita, a forma escalonada, com os
// pivôs em caixas verdes. Um deslizante muda o número depois do igual de uma
// linha, e um botão troca um coeficiente dessa linha. O painel conta os pivôs
// das colunas das incógnitas e diz se a coluna depois da barra ganhou um
// pivô (a linha 0 = c, em laranja), e daí lê o desfecho: nenhuma, uma ou
// infinitas soluções, com a solução escrita.
//
// Props:
//   rows  matriz aumentada inicial (inteiros)
//   vary  {row, col, options: [a, b], k: [min, max, step]}: `col` é a coluna
//         do coeficiente que o botão alterna; `k` é a faixa do número depois
//         do igual da mesma linha.

const VARS = ['x', 'y', 'z', 'w'];
const CW = 38;
const RH = 38;
const TOP = 46;

function eliminate(rows0, n) {
  let R = rows0.map((r) => r.slice());
  const ops = [];
  let r = 0;
  for (let c = 0; c < n && r < R.length; c++) {
    let p = -1;
    for (let i = r; i < R.length; i++) {
      if (!isZero(R[i][c])) {
        p = i;
        break;
      }
    }
    if (p === -1) continue;
    if (p !== r) {
      const op = {op: 'swap', rows: [r + 1, p + 1]};
      R = applyOp(R, op);
      ops.push(op);
    }
    for (let i = r + 1; i < R.length; i++) {
      if (isZero(R[i][c])) continue;
      const op = {op: 'add', row: i + 1, from: r + 1, k: neg(div(R[i][c], R[r][c]))};
      R = applyOp(R, op);
      ops.push(op);
    }
    r += 1;
  }
  return {R, ops};
}

// Solução de trás para a frente, cada incógnita como c0 + c1 t (uma variável
// livre no máximo, que é o caso desta figura).
function backSolve(R, n) {
  const leads = R.map((row) => leadCol(row, n));
  const pivotCols = new Set(leads.filter((c) => c >= 0));
  const free = [...Array(n).keys()].filter((c) => !pivotCols.has(c));
  if (free.length > 1) return null;
  const val = Array(n).fill(null);
  free.forEach((c) => {
    val[c] = [fr(0), fr(1)];
  });
  for (let i = R.length - 1; i >= 0; i--) {
    const c = leads[i];
    if (c < 0) continue;
    let c0 = R[i][n];
    let c1 = fr(0);
    for (let j = c + 1; j < n; j++) {
      c0 = sub(c0, mul(R[i][j], val[j][0]));
      c1 = sub(c1, mul(R[i][j], val[j][1]));
    }
    val[c] = [div(c0, R[i][c]), div(c1, R[i][c])];
  }
  return {val, free};
}

function affineTex([c0, c1]) {
  if (isZero(c1)) return texFr(c0);
  const tPart = eq(c1, fr(1)) ? 't' : eq(c1, fr(-1)) ? '-t' : `${texFr(c1)}t`;
  if (isZero(c0)) return tPart;
  const sign = c1.n < 0 ? '-' : '+';
  const abs = fr(Math.abs(c1.n), c1.d);
  const tAbs = eq(abs, fr(1)) ? 't' : `${texFr(abs)}t`;
  return `${texFr(c0)} ${sign} ${tAbs}`;
}

function Matrix({R, x0, n, leads, badRow}) {
  const cx = (c) => x0 + 22 + c * CW + (c >= n ? 10 : 0);
  const m = R.length;
  const top = TOP - RH / 2 + 3;
  const bottom = TOP + (m - 1) * RH + RH / 2 - 3;
  const barX = x0 + 22 + (n - 0.5) * CW + 5;
  const rb = cx(n) + 22;
  return (
    <g>
      {VARS.slice(0, n).map((v, c) => (
        <SvgMath key={v} x={cx(c)} y={16} math={v} fontSize={12} />
      ))}
      <path d={`M ${x0 + 6} ${top} L ${x0} ${top} L ${x0} ${bottom} L ${x0 + 6} ${bottom}`} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.4} />
      <path d={`M ${rb - 6} ${top} L ${rb} ${top} L ${rb} ${bottom} L ${rb - 6} ${bottom}`} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.4} />
      <line x1={barX} x2={barX} y1={top + 2} y2={bottom - 2} stroke="var(--ifm-font-color-base)" strokeWidth={1.1} />
      {leads &&
        leads.map((c, i) =>
          c >= 0 ? (
            <rect key={i} x={cx(c) - 17} y={TOP + i * RH - 14} width={34} height={28} rx={4} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2} />
          ) : null,
        )}
      {badRow !== undefined && badRow >= 0 && (
        <rect x={cx(n) - 17} y={TOP + badRow * RH - 14} width={34} height={28} rx={4} fill="var(--mv-tone-2)" fillOpacity={0.15} stroke="var(--mv-tone-2)" strokeWidth={2} />
      )}
      {R.map((row, i) =>
        row.map((v, c) => <SvgMath key={`${i}-${c}`} x={cx(c)} y={TOP + i * RH} math={texFr(v)} fontSize={15} />),
      )}
    </g>
  );
}

export default function SystemPivotCount({rows, vary, caption}) {
  const n = rows[0].length - 1;
  const [opt, setOpt] = useState(0);
  const [kv, setKv] = useState(rows[vary.row - 1][n]);

  const A = rows.map((r, i) =>
    r.map((v, c) => {
      if (i !== vary.row - 1) return toFr(v);
      if (c === vary.col) return toFr(vary.options[opt]);
      if (c === n) return toFr(kv);
      return toFr(v);
    }),
  );
  const {R, ops} = eliminate(A, n);
  const leads = R.map((row) => leadCol(row, n));
  const pivots = leads.filter((c) => c >= 0).length;
  const badRow = R.findIndex((row, i) => leads[i] < 0 && !isZero(row[n]));
  const W = 470;
  const H = TOP + (rows.length - 1) * RH + 30;

  let verdict;
  let solution = null;
  if (badRow >= 0) {
    verdict = (
      <>
        A linha {badRow + 1} da forma escalonada é <Formula math={`0 = ${texFr(R[badRow][n])}`} />: a coluna depois da
        barra ganhou um pivô. <strong>Nenhuma solução.</strong>
      </>
    );
  } else if (pivots === n) {
    verdict = (
      <>
        {pivots} pivôs para {n} incógnitas, e nenhuma linha <Formula math="0 = c" />. <strong>Uma solução.</strong>
      </>
    );
    const s = backSolve(R, n);
    solution = `(${VARS.slice(0, n).join(',\\ ')}) = (${s.val.map((v) => texFr(v[0])).join(',\\ ')})`;
  } else {
    verdict = (
      <>
        {pivots} pivôs para {n} incógnitas, e nenhuma linha <Formula math="0 = c" />. Sobra{n - pivots > 1 ? 'm' : ''}{' '}
        {n - pivots} coluna{n - pivots > 1 ? 's' : ''} sem pivô: <strong>infinitas soluções</strong>, com{' '}
        {n - pivots} variáve{n - pivots > 1 ? 'is' : 'l'} livre{n - pivots > 1 ? 's' : ''}.
      </>
    );
    const s = backSolve(R, n);
    if (s) {
      solution = `(${VARS.slice(0, n).join(',\\ ')}) = (${s.val.map(affineTex).join(',\\ ')})`;
    }
  }

  return (
    <div className={shared.wrapper} data-explorer="system-pivot-count">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={`Matriz aumentada e sua forma escalonada, com ${pivots} pivôs nas colunas das incógnitas.`}>
          <Matrix R={A} x0={8} n={n} />
          <SvgMath x={222} y={TOP + RH - 14} math="\text{escalonar}" fontSize={12} />
          <line x1={194} x2={250} y1={TOP + RH} y2={TOP + RH} stroke="var(--ifm-font-color-base)" strokeWidth={1.4} />
          <path d={`M 244 ${TOP + RH - 5} L 251 ${TOP + RH} L 244 ${TOP + RH + 5}`} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.4} />
          <Matrix R={R} x0={270} n={n} leads={leads} badRow={badRow} />
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Número depois do igual na equação {vary.row}: <strong>{String(kv).replace('-', '−')}</strong>
          </span>
          <input
            type="range"
            min={vary.k[0]}
            max={vary.k[1]}
            step={vary.k[2] ?? 1}
            value={kv}
            onChange={(e) => setKv(Number(e.target.value))}
            aria-label={`Número depois do igual na equação ${vary.row}`}
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={ops.map(opTex).join(',\\quad ')} />
        </p>
        <p>
          Pivôs nas colunas das incógnitas (o <strong>posto</strong> da matriz dos coeficientes): <strong>{pivots}</strong>.
          Incógnitas: <strong>{n}</strong>.
        </p>
        <p>{verdict}</p>
        {solution && (
          <p className={shared.formula}>
            <Formula math={solution} />
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        {vary.options.map((o, i) => (
          <button key={o} type="button" aria-pressed={opt === i} onClick={() => setOpt(i)}>
            {`Coeficiente do ${VARS[vary.col]} na equação ${vary.row}: ${o}`}
          </button>
        ))}
      </div>
    </div>
  );
}
