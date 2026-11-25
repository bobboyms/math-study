import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {pairMath, plainNumber} from '../VectorSumKit';
import {applyOp, div, isZero, neg, opTex, texFr, toFr} from '../SystemElimination/frac';

// Cada equação com duas incógnitas é uma reta; a solução do sistema é o ponto
// que está em todas (lição 11.4).
//
// As equações ax + by = c são desenhadas no plano, uma cor por equação. O
// painel diz o desfecho: um ponto comum (marcado em verde), retas paralelas
// (nenhum ponto comum) ou a mesma reta (todos os pontos dela).
//
// - `slider`: deslizantes para o coeficiente do x e o número depois do igual
//   de uma equação. Arrastando o coeficiente, a reta gira; só um valor a deixa
//   paralela à outra, e só um número depois do igual faz as duas coincidirem.
// - `presets`: botões que trocam o sistema inteiro.
// - `echelon`: (duas equações) o painel mostra a matriz aumentada antes e
//   depois de zerar o número embaixo do primeiro pivô, e lê a última linha.
// - Com três equações, o painel diz se as três passam pelo mesmo ponto ou se
//   formam um triângulo, com os pontos de cada par.

const EPS = 1e-9;
const num = (v) => mathNumber(v, 2);

export function eqTex([a, b, c]) {
  const term = (coef, v, first) => {
    if (Math.abs(coef) < EPS) return '';
    const abs = Math.abs(coef);
    const cs = Math.abs(abs - 1) < EPS ? '' : num(abs);
    if (first) return `${coef < 0 ? '-' : ''}${cs}${v}`;
    return ` ${coef < 0 ? '-' : '+'} ${cs}${v}`;
  };
  let left = term(a, 'x', true);
  left += term(b, 'y', left === '');
  if (!left) left = '0x + 0y';
  return `${left} = ${num(c)}`;
}

function meet(e1, e2) {
  const [a1, b1, c1] = e1;
  const [a2, b2, c2] = e2;
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < EPS) {
    const same = Math.abs(a1 * c2 - a2 * c1) < EPS && Math.abs(b1 * c2 - b2 * c1) < EPS;
    return {kind: same ? 'same' : 'parallel'};
  }
  return {kind: 'point', p: [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det]};
}

// Ponto da reta ax + by = c a uma fração f do trecho visível na janela.
function along([a, b, c], f, win) {
  const n2 = a * a + b * b;
  if (n2 < EPS) return null;
  const p0 = [(a * c) / n2, (b * c) / n2];
  const d = [b, -a];
  const m = 0.35;
  let lo = -Infinity;
  let hi = Infinity;
  [
    [0, win.xMin + m, win.xMax - m],
    [1, win.yMin + m, win.yMax - m],
  ].forEach(([k, mn, mx]) => {
    if (Math.abs(d[k]) < EPS) {
      if (p0[k] < mn || p0[k] > mx) {
        lo = Infinity;
        hi = -Infinity;
      }
      return;
    }
    const t1 = (mn - p0[k]) / d[k];
    const t2 = (mx - p0[k]) / d[k];
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
  });
  if (!(hi > lo)) return null;
  // percorre da esquerda para a direita (ou de baixo para cima, se vertical)
  const s = d[0] < -EPS || (Math.abs(d[0]) < EPS && d[1] < 0) ? -1 : 1;
  const tt = s > 0 ? lo + (hi - lo) * f : hi - (hi - lo) * f;
  return [p0[0] + d[0] * tt, p0[1] + d[1] * tt];
}

function lineItem([a, b, c], tone, win, dashed) {
  if (Math.abs(b) > EPS) {
    return {through: [[win.xMin, (c - a * win.xMin) / b], [win.xMax, (c - a * win.xMax) / b]], tone, dashed};
  }
  if (Math.abs(a) > EPS) return {x: c / a, tone, dashed};
  return null;
}

export default function SystemLines({
  eqs: initial,
  presets = [],
  slider,
  echelon = false,
  labelPlaces = [],
  window: win = {xMin: -2, xMax: 8, yMin: -2, yMax: 8},
  xUnit = 34,
  caption,
}) {
  const [eqs, setEqs] = useState(initial);
  const [preset, setPreset] = useState(presets.length ? 0 : -1);
  const tones = [1, 2, 3];

  // Posicionamento dos rótulos: cada candidato vira uma caixa em pixels, e
  // ganha a caixa mais longe das retas, dos eixos (com os números), dos
  // pontos e dos rótulos já postos.
  const Wpx = (win.xMax - win.xMin) * xUnit;
  const Hpx = (win.yMax - win.yMin) * xUnit;
  const toPx = (p) => [(p[0] - win.xMin) * xUnit, (win.yMax - p[1]) * xUnit];
  const toPlane = (q) => [win.xMin + q[0] / xUnit, win.yMax - q[1] / xUnit];
  const [ax0, ay0] = toPx([0, 0]);
  const boxes = [];
  const dotPx = [];
  // `own`: índice da reta do próprio rótulo. Ela não entra no mínimo (o
  // rótulo já sai deslocado dela), mas a caixa não pode cruzá-la.
  const clearance = (q, own) => {
    const [X, Y] = toPlane(q);
    let d = 40;
    eqs.forEach(([a, b, c], i) => {
      const n = Math.hypot(a, b);
      if (n < EPS) return;
      const di = (Math.abs(a * X + b * Y - c) / n) * xUnit;
      const mine = own >= 0 && (i === own || meet(eqs[own], [a, b, c]).kind === 'same');
      d = Math.min(d, mine ? 40 : di);
    });
    // eixos, com a faixa dos números (abaixo do eixo x, à esquerda do y)
    d = Math.min(d, Math.max(0, Math.abs(q[1] - (ay0 + 9)) - 11));
    d = Math.min(d, Math.max(0, Math.abs(q[0] - (ax0 - 11)) - 13));
    dotPx.forEach((pp) => {
      d = Math.min(d, Math.hypot(q[0] - pp[0], q[1] - pp[1]) - 6);
    });
    boxes.forEach(([x0, y0, x1, y1]) => {
      const dx = Math.max(x0 - q[0], 0, q[0] - x1);
      const dy = Math.max(y0 - q[1], 0, q[1] - y1);
      d = Math.min(d, Math.hypot(dx, dy));
    });
    return d;
  };
  const scoreBox = (bx, own = -1) => {
    if (bx[0] < 4 || bx[1] < 4 || bx[2] > Wpx - 4 || bx[3] > Hpx - 4) return -10;
    // uma reta que atravessa a caixa (cantos de lados opostos) estraga o
    // rótulo; a própria reta, ou uma que coincide com ela, mais ainda
    const corners = [[bx[0], bx[1]], [bx[2], bx[1]], [bx[0], bx[3]], [bx[2], bx[3]]].map(toPlane);
    let crossOwn = false;
    let crossOther = false;
    eqs.forEach(([a, b, c], i) => {
      const sg = corners.map(([X, Y]) => Math.sign(a * X + b * Y - c));
      if (Math.min(...sg) < 0 && Math.max(...sg) > 0) {
        const same = own >= 0 && (i === own || meet(eqs[own], eqs[i]).kind === 'same');
        if (same) crossOwn = true;
        else crossOther = true;
      }
    });
    if (crossOwn) return -8;
    if (crossOther) return -2;
    let d = 40;
    for (let i = 0; i <= 4; i++) {
      for (let j = 0; j <= 2; j++) {
        d = Math.min(d, clearance([bx[0] + ((bx[2] - bx[0]) * i) / 4, bx[1] + ((bx[3] - bx[1]) * j) / 2], own));
      }
    }
    return d;
  };
  const boxOf = (cx, cy, w, anchor) => {
    const x0 = anchor === 'start' ? cx : anchor === 'end' ? cx - w : cx - w / 2;
    return [x0, cy - 10, x0 + w, cy + 10];
  };
  const texWidth = (tex) => {
    const plain = tex.replace(/\\[a-z]+/g, '').replace(/[{}\s]/g, '');
    const ops = (plain.match(/[-+=]/g) || []).length;
    return 8.6 * plain.length + 8 * ops + 6;
  };

  // pontos de encontro (calculados antes, para os rótulos desviarem deles)
  const points = [];
  let outcome;
  const inWin = (p) => p[0] >= win.xMin && p[0] <= win.xMax && p[1] >= win.yMin && p[1] <= win.yMax;
  const pointLabel = (p, tone) => {
    const tex = pairMath(...p);
    const w = texWidth(tex) - 6;
    const q = toPx(p);
    let best = null;
    [
      [30, -16],
      [30, 16],
      [-30, -16],
      [-30, 16],
      [0, -22],
      [0, 22],
    ].forEach(([dx, dy], idx) => {
      const sc = scoreBox(boxOf(q[0] + dx, q[1] + dy, w, 'middle')) - idx * 0.01;
      if (!best || sc > best.sc) best = {sc, dx, dy};
    });
    boxes.push(boxOf(q[0] + best.dx, q[1] + best.dy, w, 'middle'));
    dotPx.push(q);
    return {at: p, tone, r: 6, label: tex, dx: best.dx, dy: best.dy};
  };

  const lines = [];
  eqs.forEach((e, i) => {
    // a segunda reta tracejada quando coincide com a primeira, para as duas
    // continuarem visíveis
    const coincide = i > 0 && meet(eqs[0], e).kind === 'same';
    const item = lineItem(e, tones[i], win, coincide);
    if (item) lines.push(item);
  });
  // desfecho
  if (eqs.length === 2) {
    const r = meet(eqs[0], eqs[1]);
    if (r.kind === 'point') {
      if (inWin(r.p)) points.push(pointLabel(r.p, 3));
      outcome = (
        <>
          As retas se cruzam num ponto só, <Formula math={pairMath(...r.p)} />
          {inWin(r.p) ? '' : ' (fora da janela do desenho)'}. O sistema tem <strong>uma</strong> solução.
        </>
      );
    } else if (r.kind === 'parallel') {
      outcome = (
        <>
          As retas são paralelas: nenhum ponto está nas duas. O sistema <strong>não tem</strong> solução.
        </>
      );
    } else {
      outcome = (
        <>
          As duas equações desenham a mesma reta: todos os pontos dela satisfazem as duas. O sistema tem{' '}
          <strong>infinitas</strong> soluções.
        </>
      );
    }
  } else {
    const pairs = [
      [0, 1],
      [0, 2],
      [1, 2],
    ].map(([i, j]) => meet(eqs[i], eqs[j]));
    const ps = pairs.filter((q) => q.kind === 'point').map((q) => q.p);
    const common =
      pairs[0].kind === 'point' &&
      eqs.every(([a, b, c]) => Math.abs(a * pairs[0].p[0] + b * pairs[0].p[1] - c) < 1e-7);
    if (common) {
      points.push(pointLabel(pairs[0].p, 0));
      outcome = (
        <>
          As três retas passam pelo mesmo ponto, <Formula math={pairMath(...pairs[0].p)} />. O sistema tem{' '}
          <strong>uma</strong> solução.
        </>
      );
    } else {
      ps.forEach((p) => {
        points.push({at: p, tone: 0, r: 5, open: true});
        dotPx.push(toPx(p));
      });
      outcome = (
        <>
          Cada par de retas se cruza num ponto diferente:{' '}
          {ps.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 ? (i === ps.length - 1 ? ' e ' : ', ') : ''}
              <Formula math={pairMath(...p)} />
            </React.Fragment>
          ))}
          . Nenhum ponto está nas três retas: o sistema <strong>não tem</strong> solução.
        </>
      );
    }
  }

  // rótulos das retas
  const labels = [];
  eqs.forEach((e, i) => {
    const place = labelPlaces[i] ?? {};
    const tex = eqTex(e);
    const w = texWidth(tex);
    const len = Math.hypot(e[0], e[1]) || 1;
    let nx0 = e[0] / len;
    let ny0 = -e[1] / len; // y do SVG cresce para baixo
    if (ny0 > 0 || (Math.abs(ny0) < EPS && nx0 < 0)) {
      nx0 = -nx0;
      ny0 = -ny0;
    }
    const pref = place.f ?? [0.15, 0.85, 0.5][i];
    const fs = place.f !== undefined ? [place.f] : Array.from({length: 22}, (_, k) => 0.06 + k * 0.042);
    const sides = place.side !== undefined ? [place.side] : [1, -1];
    let best = null;
    fs.forEach((f) => {
      const at = along(e, f, win);
      if (!at) return;
      sides.forEach((side) => {
        const nx = nx0 * side;
        const ny = ny0 * side;
        // âncoras e distâncias variadas: numa reta inclinada, o rótulo
        // centrado cruza a reta; ancorado pela ponta, não
        ['middle', 'start', 'end'].forEach((anchor) => {
          [12, 20, 30].forEach((dist) => {
            const dx = (place.dx ?? 0) + nx * dist;
            const dy = (place.dy ?? 0) + ny * dist;
            const q = toPx(at);
            const bx = boxOf(q[0] + dx, q[1] + dy, w, anchor);
            const sc =
              scoreBox(bx, i) - Math.abs(f - pref) * 4 - (side < 0 ? 0.5 : 0) - dist * 0.05 - (anchor === 'middle' ? 0 : 0.3);
            if (!best || sc > best.sc) best = {sc, at, anchor, dx, dy, bx};
          });
        });
      });
    });
    if (!best) return;
    boxes.push(best.bx);
    labels.push({at: best.at, math: tex, tone: tones[i], anchor: best.anchor, dx: best.dx, dy: best.dy, fontSize: 13});
  });

  // escalonamento de duas equações: zerar o número embaixo do primeiro pivô
  let ech = null;
  if (echelon && eqs.length === 2 && Math.abs(eqs[0][0]) > EPS) {
    const rows = eqs.map((e) => e.map((v) => toFr(v))); // coeficientes inteiros
    const k = neg(div(rows[1][0], rows[0][0]));
    const op = {op: 'add', row: 2, from: 1, k};
    const after = isZero(k) ? rows : applyOp(rows, op);
    const mat = (R) =>
      `\\left[\\begin{array}{cc|c} ${R.map((r) => r.map(texFr).join(' & ')).join(' \\\\ ')} \\end{array}\\right]`;
    const [, b2, c2] = after[1];
    const reading = !isZero(b2) ? (
      <>
        A segunda linha tem pivô na coluna do <Formula math="y" />. Dois pivôs, um para cada incógnita: uma solução.
      </>
    ) : !isZero(c2) ? (
      <>
        A segunda linha diz <Formula math={`0x + 0y = ${texFr(c2)}`} />, isto é, <Formula math={`0 = ${texFr(c2)}`} />.
        Nenhum par torna isso verdadeiro: nenhuma solução.
      </>
    ) : (
      <>
        A segunda linha diz <Formula math="0 = 0" />, que vale sempre. A segunda equação repetia a primeira: infinitas
        soluções.
      </>
    );
    ech = (
      <>
        <p className={shared.formula}>
          <Formula math={`${mat(rows)} \\xrightarrow{${opTex(op)}} ${mat(after)}`} />
        </p>
        <p>{reading}</p>
      </>
    );
  }

  const sl = slider ? eqs[slider.row - 1] : null;
  const setCoef = (idx, v) => {
    const next = eqs.map((e) => e.slice());
    next[slider.row - 1][idx] = v;
    setEqs(next);
    setPreset(-1);
  };

  return (
    <div className={shared.wrapper} data-explorer="system-lines">
      <CartesianPlane
        {...win}
        xUnit={xUnit}
        axisLabels={['x', 'y']}
        lines={lines}
        labels={labels}
        points={points}
        caption={caption}
      />
      {slider && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>
              Coeficiente do x na equação {slider.row}: <strong>{plainNumber(sl[0])}</strong>
            </span>
            <input
              type="range"
              min={slider.a[0]}
              max={slider.a[1]}
              step={slider.a[2] ?? 1}
              value={sl[0]}
              onChange={(e) => setCoef(0, Number(e.target.value))}
              aria-label={`Coeficiente do x na equação ${slider.row}`}
              aria-valuetext={plainNumber(sl[0])}
            />
          </label>
          <label className={shared.control}>
            <span>
              Número depois do igual na equação {slider.row}: <strong>{plainNumber(sl[2])}</strong>
            </span>
            <input
              type="range"
              min={slider.c[0]}
              max={slider.c[1]}
              step={slider.c[2] ?? 1}
              value={sl[2]}
              onChange={(e) => setCoef(2, Number(e.target.value))}
              aria-label={`Número depois do igual na equação ${slider.row}`}
              aria-valuetext={plainNumber(sl[2])}
            />
          </label>
        </div>
      )}
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\begin{cases} ${eqs.map(eqTex).join(' \\\\ ')} \\end{cases}`} />
        </p>
        <p>{outcome}</p>
        {ech}
      </div>
      {presets.length > 0 && (
        <div className={shared.buttons}>
          {presets.map((pr, i) => (
            <button
              key={pr.label}
              type="button"
              aria-pressed={preset === i}
              onClick={() => {
                setEqs(pr.eqs.map((e) => e.slice()));
                setPreset(i);
              }}
            >
              {pr.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
