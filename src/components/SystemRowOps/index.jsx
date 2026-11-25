import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath, plainNumber, signedMath} from '../VectorSumKit';
import {eqTex} from '../SystemLines';

// As operações com as linhas mudam as retas, mas não o cruzamento
// (lição 11.4).
//
// À esquerda, a matriz aumentada de um sistema de duas equações; à direita,
// as duas retas. Cada linha da matriz tem a cor da sua reta.
//
// mode="ops": um botão por operação elementar, sempre a partir do sistema
//   original, e "Desfazer". Trocar as linhas só muda a ordem da lista;
//   multiplicar a segunda linha por 3 não move a reta; somar à segunda linha
//   um múltiplo da primeira gira a reta em volta do cruzamento. Multiplicar
//   por 0 é o contraexemplo: a reta some, e pontos que não eram solução
//   passam a ser. Essa não se desfaz. Ao entrar na tela, a figura faz a
//   operação L2 ← L2 − 2L1.
// mode="slider": a operação L2 ← L2 + kL1 com k num deslizante. Ao entrar na
//   tela, o k passeia (0 → 1 → −2): a reta laranja gira, passa pela vertical
//   x = 2 e termina na horizontal y = 3, sempre pelo mesmo ponto.

const DUR = 2.4;
const INTRO = 4.2;
const MW = 330;
const MH = 150;
const RH = 40;
const TOP = 36;
const COLS = [70, 118, 172];
const BAR = 145;

const n2 = (v) => mathNumber(v, 2);
const cellTex = (v) => n2(v);
const kTex = (k) => {
  const a = Math.abs(k);
  const coef = Math.abs(a - 1) < 1e-9 ? '' : n2(a);
  return `L_2 \\leftarrow L_2 ${k < 0 ? '-' : '+'} ${coef}L_1`;
};

const OPS = {
  swap: {
    label: 'Trocar as linhas',
    tex: 'L_1 \\leftrightarrow L_2',
    undoTex: 'L_1 \\leftrightarrow L_2',
    apply: (R) => [R[1], R[0]],
  },
  scale: {
    label: 'Multiplicar a linha 2 por 3',
    tex: 'L_2 \\leftarrow 3L_2',
    undoTex: 'L_2 \\leftarrow \\tfrac{1}{3}L_2',
    apply: (R) => [R[0], {...R[1], v: R[1].v.map((x) => 3 * x)}],
  },
  add: {
    label: 'Tirar da linha 2 duas vezes a linha 1',
    tex: 'L_2 \\leftarrow L_2 - 2L_1',
    undoTex: 'L_2 \\leftarrow L_2 + 2L_1',
    apply: (R) => [R[0], {...R[1], v: R[1].v.map((x, c) => x - 2 * R[0].v[c])}],
  },
  zero: {
    label: 'Multiplicar a linha 2 por 0',
    tex: 'L_2 \\leftarrow 0 \\times L_2',
    apply: (R) => [R[0], {...R[1], v: [0, 0, 0]}],
  },
};

function MatrixPanel({rows, ys, fade, opText, opK}) {
  // rows: [{id, v}] na ordem antiga; ys: altura de cada uma; fade: para cada
  // linha, {old, new, k} quando os números estão mudando.
  return (
    <svg viewBox={`0 0 ${MW} ${MH}`} style={{width: '100%', maxWidth: `${MW}px`, display: 'block', margin: '0 auto'}} role="img" aria-label="Matriz aumentada do sistema, uma linha por equação.">
      <SvgMath x={COLS[0]} y={12} math="x" fontSize={13} />
      <SvgMath x={COLS[1]} y={12} math="y" fontSize={13} />
      {[0, 1].map((i) => (
        <SvgMath key={i} x={16} y={TOP + i * RH} math={`L_{${i + 1}}`} fontSize={13} />
      ))}
      <path d={`M 47 ${TOP - 18} L 40 ${TOP - 18} L 40 ${TOP + RH + 18} L 47 ${TOP + RH + 18}`} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
      <path d={`M 193 ${TOP - 18} L 200 ${TOP - 18} L 200 ${TOP + RH + 18} L 193 ${TOP + RH + 18}`} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
      <line x1={BAR} x2={BAR} y1={TOP - 15} y2={TOP + RH + 15} stroke="var(--ifm-font-color-base)" strokeWidth={1.2} />
      {rows.map((r, i) => {
        const y = ys[i];
        const tone = r.id + 1;
        const fd = fade[i];
        return (
          <g key={r.id}>
            <rect x={44} y={y - 15} width={152} height={30} rx={5} fill={`var(--mv-tone-${tone})`} fillOpacity={0.1} stroke="none" />
            {r.v.map((x, c) =>
              fd ? (
                <g key={c}>
                  <g opacity={1 - Math.min(1, fd.k * 2)}>
                    <SvgMath x={COLS[c]} y={y - 6 * fd.k} math={cellTex(fd.old[c])} fontSize={16} />
                  </g>
                  <g opacity={Math.max(0, fd.k * 2 - 1)}>
                    <SvgMath x={COLS[c]} y={y + 6 * (1 - fd.k)} math={cellTex(fd.new[c])} fontSize={16} />
                  </g>
                </g>
              ) : (
                <SvgMath key={c} x={COLS[c]} y={y} math={cellTex(x)} fontSize={16} />
              ),
            )}
            <SvgMath x={210} y={y} math={`{${eqTex(fd && fd.k > 0.5 ? fd.new : r.v)}}`} anchor="start" space={MW - 212} fontSize={13} tone={tone} />
          </g>
        );
      })}
      {opText && (
        <g opacity={opK}>
          <SvgMath x={120} y={TOP + RH + 44} math={opText} fontSize={15} tone={2} />
        </g>
      )}
    </svg>
  );
}

export default function SystemRowOps({
  eqs = [
    [1, 1, 5],
    [2, -1, 1],
  ],
  mode = 'ops',
  point = [2, 3],
  window: win = {xMin: -1, xMax: 6, yMin: -2, yMax: 7},
  xUnit = 36,
  caption,
}) {
  const original = eqs.map((v, id) => ({id, v}));
  const [op, setOp] = useState('add');
  const [undone, setUndone] = useState(false);
  const [k, setK] = useState(-2);

  const ops = useAnimation({duration: DUR, autoplay: mode === 'ops'});
  const intro = useAnimation({
    duration: INTRO,
    autoplay: mode === 'slider',
    onFrame: (time) => {
      if (mode !== 'slider') return;
      let kk;
      if (time <= 1.5) kk = 1 * stage(time, 0.2, 1.5);
      else kk = 1 - 3 * stage(time, 1.9, 3.6);
      setK(Math.round(kk * 10) / 10);
    },
  });

  const lineOf = (v, tone, dashed, muted) => {
    const [a, b, c] = v;
    if (Math.abs(b) > 1e-9) return {through: [[win.xMin, (c - a * win.xMin) / b], [win.xMax, (c - a * win.xMax) / b]], tone, dashed, muted};
    if (Math.abs(a) > 1e-9) return {x: c / a, tone, dashed, muted};
    return null;
  };

  let rows;
  let ys;
  let fade = [null, null];
  let opText = null;
  let opK = 1;
  const lines = [];
  const points = [];
  let note;

  if (mode === 'slider') {
    const v2 = eqs[1].map((x, c) => x + k * eqs[0][c]);
    rows = [original[0], {id: 1, v: v2}];
    ys = [TOP, TOP + RH];
    opText = kTex(k);
    lines.push(lineOf(eqs[1], 2, true, true));
    lines.push(lineOf(eqs[0], 1));
    const l2 = lineOf(v2, 2);
    if (l2) lines.push(l2);
    points.push({at: point, tone: 3, r: 6, label: pairMath(...point), dx: 34, dy: -14});
    const lhs = v2[0] * point[0] + v2[1] * point[1];
    note = (
      <>
        <p className={shared.formula}>
          <Formula
            math={`\\text{em } ${pairMath(...point)}:\\ ${signedMath(v2[0])} \\times ${point[0]} + ${signedMath(v2[1])} \\times ${point[1]} = ${n2(lhs)}`}
          />
        </p>
        <p>
          A equação nova pede <Formula math={n2(v2[2])} /> depois do igual, e o ponto{' '}
          <Formula math={pairMath(...point)} /> dá exatamente <Formula math={n2(lhs)} />. Com qualquer{' '}
          <Formula math="k" />, a reta nova passa pelo cruzamento.
          {Math.abs(v2[1]) < 1e-9 ? ' Com este k, o y sumiu da segunda equação: a reta ficou vertical.' : ''}
          {Math.abs(v2[0]) < 1e-9 ? ' Com este k, o x sumiu da segunda equação: a reta ficou horizontal.' : ''}
        </p>
      </>
    );
  } else {
    const spec = OPS[op];
    const after = spec.apply(original);
    const p = stage(ops.t, 0.35, 1.7);
    const [A, B] = undone ? [after, original] : [original, after];
    // A = estado antigo, B = estado novo, ambos como lista ordenada
    opK = stage(ops.t, 0, 0.35);
    opText = undone ? spec.undoTex : spec.tex;
    if (op === 'swap') {
      rows = A;
      ys = A.map((r) => {
        const from = A.indexOf(r);
        const to = B.findIndex((q) => q.id === r.id);
        return TOP + (from + (to - from) * p) * RH;
      });
    } else {
      rows = A;
      ys = [TOP, TOP + RH];
      fade = [null, {old: A[1].v, new: B[1].v, k: p}];
    }
    // retas: coeficientes interpolados (a reta gira em volta do cruzamento)
    const cur = A.map((r, i) => {
      if (op === 'swap') return r;
      const nv = B[i].v;
      return {...r, v: r.v.map((x, c) => x + (nv[c] - x) * p)};
    });
    const showGhost = op === 'add' && !undone && p > 0;
    if (showGhost) lines.push(lineOf(eqs[1], 2, true, true));
    cur.forEach((r) => {
      if (op === 'zero' && r.id === 1) {
        const gone = undone ? 1 - p : p;
        if (gone < 0.5) lines.push(lineOf(eqs[1], 2));
        else if (gone < 0.98) lines.push(lineOf(eqs[1], 2, true, true));
        return;
      }
      const l = lineOf(r.v, r.id + 1);
      if (l) lines.push(l);
    });
    points.push({at: point, tone: 3, r: 6, label: pairMath(...point), dx: 34, dy: -14});
    const zeroDone = op === 'zero' && p > 0.98;
    if (zeroDone) {
      // agora todo ponto da reta azul é solução
      [-0.5, 0.5, 1.5, 3, 4, 5].forEach((x) => points.push({at: [x, eqs[0][2] - x], tone: 3, r: 3.5}));
      points.push({at: [1, 4], tone: 2, r: 6, label: '(1,\\ 4)', dx: 30, dy: -10});
    }
    const texts = {
      swap: undone
        ? 'Trocar de novo devolve as linhas à ordem original. Nada mudou nas retas.'
        : 'As linhas trocaram de lugar, cada uma levando a sua cor. As duas retas são as mesmas de antes: só a ordem da lista mudou. O cruzamento continua no mesmo ponto.',
      scale: undone
        ? 'Multiplicar a linha 2 por 1/3 desfaz o triplo: voltam 2, −1 e 1.'
        : 'Cada número da linha 2 foi multiplicado por 3, inclusive o que está depois da barra. A reta laranja não se mexeu: quem satisfaz 2x − y = 1 satisfaz 6x − 3y = 3, e o contrário também vale.',
      add: undone
        ? 'Somar de volta duas vezes a linha 1 desfaz a operação: 0 + 2 × 1 = 2, −3 + 2 × 1 = −1 e −9 + 2 × 5 = 1.'
        : 'A linha 2 perdeu duas vezes a linha 1, coluna por coluna: 2 − 2 × 1 = 0, −1 − 2 × 1 = −3 e 1 − 2 × 5 = −9. A reta laranja girou até ficar horizontal (−3y = −9, ou y = 3), mas continua passando pelo cruzamento. O tracejado cinza é a reta antiga.',
      zero: 'A linha 2 virou 0x + 0y = 0, que vale para qualquer par. A reta laranja sumiu, e agora todo ponto da reta azul é solução: (1, 4), por exemplo, que não satisfazia 2x − y = 1. Essa operação não tem volta: nenhum número vezes 0 devolve 2, −1 e 1.',
    };
    note = <p>{texts[op]}</p>;
  }

  const busy = ops.playing || intro.playing;

  return (
    <div className={shared.wrapper} data-explorer="system-row-ops">
      <div ref={mode === 'ops' ? ops.ref : intro.ref}>
        <div className={shared.plots}>
          <figure style={{margin: 0}}>
            <MatrixPanel rows={rows} ys={ys} fade={fade} opText={opText} opK={opK} />
          </figure>
          <CartesianPlane {...win} xUnit={xUnit} axisLabels={['x', 'y']} lines={lines} points={points} />
        </div>
        {caption && <p className={shared.caption}>{caption}</p>}
      </div>
      {mode === 'slider' && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>
              Número k: <strong>{plainNumber(k)}</strong>
            </span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.5}
              value={k}
              disabled={busy}
              onChange={(e) => setK(Number(e.target.value))}
              aria-label="Número k da operação L2 ← L2 + k L1"
              aria-valuetext={plainNumber(k)}
            />
          </label>
        </div>
      )}
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {note}
      </div>
      <div className={shared.buttons}>
        {mode === 'ops' ? (
          <>
            {Object.entries(OPS).map(([key, spec]) => (
              <button
                key={key}
                type="button"
                disabled={busy}
                aria-pressed={op === key && !undone}
                onClick={() => {
                  setOp(key);
                  setUndone(false);
                  ops.play();
                }}
              >
                {spec.label}
              </button>
            ))}
            <button
              type="button"
              disabled={busy || undone || op === 'zero'}
              onClick={() => {
                setUndone(true);
                ops.play();
              }}
            >
              Desfazer
            </button>
          </>
        ) : (
          <button type="button" disabled={busy} onClick={() => intro.play()}>
            Ver o passeio do k de novo
          </button>
        )}
      </div>
    </div>
  );
}
