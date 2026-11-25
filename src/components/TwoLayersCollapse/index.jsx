import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import styles from './styles.module.css';

// Duas camadas do tipo W x + b valem por uma; a ReLU entre elas quebra isso
// (lição 11.7).
//
// À esquerda, a rede pequena da lição: 3 entradas, 2 neurônios no meio, 1
// saída, com os números da entrada atual. À direita, o gráfico da saída
// quando a entrada anda pela reta x = (t, 0, 0). A camada única equivalente
// (tom 1, tracejada) desenha sempre uma reta. A rede (tom 2) desenha a mesma
// reta sem a ReLU e uma linha dobrada com a ReLU. Na animação, t vai de −4 a
// 2 e a curva da rede é traçada; depois, o deslizante move t.

const mulMV = (M, v) => M.map((row) => row.reduce((a, w, j) => a + w * v[j], 0));
const relu = (v) => v.map((x) => (x < 0 ? 0 : x));
const fmt = (x) => {
  const r = Math.round(x * 100) / 100;
  const v = Object.is(r, -0) ? 0 : r;
  return String(v).replace('.', '{,}');
};
const vecTex = (v) => `(${v.map(fmt).join(',\\ ')})`;

export default function TwoLayersCollapse({
  W1 = [
    [1, 0, 2],
    [-1, 3, 1],
  ],
  b1 = [1, -2],
  W2 = [[2, 1]],
  b2 = [3],
  relu: reluInitial = false,
  toggle = true,
  tRange = [-4, 2],
  yRange = [-1.5, 9.5],
  initialT = 0,
  caption,
  label = 'Rede de duas camadas e o gráfico da saída',
}) {
  const [useRelu, setUseRelu] = useState(reluInitial);
  const [tSel, setTSel] = useState(initialT);
  const duration = 3.6;
  const {ref, t: at, play, playing} = useAnimation({duration});

  const [t0, t1] = tRange;
  const sweep = playing ? t0 + ((t1 - t0) * Math.max(0, at - 0.3)) / (duration - 0.3) : tSel;
  const tCont = Math.min(t1, Math.max(t0, sweep));
  // os números da rede andam de meia em meia unidade, para caberem nos círculos
  const tNow = playing ? Math.round(tCont * 2) / 2 : tCont;

  const xOf = (t) => [t, 0, 0];
  const net = (t, r) => {
    const h = mulMV(W1, xOf(t)).map((v, i) => v + b1[i]);
    const hh = r ? relu(h) : h;
    const y = mulMV(W2, hh)[0] + b2[0];
    return {h, hh, y};
  };
  // a camada única: matriz W2 W1 e vetor W2 b1 + b2
  const W = [W1[0].map((_, j) => W2[0].reduce((a, w, i) => a + w * W1[i][j], 0))];
  const bb = mulMV(W2, b1)[0] + b2[0];
  const single = (t) => mulMV(W, xOf(t))[0] + bb;

  const cur = net(tNow, useRelu);
  const ys = single(tNow);

  // ---------------------------------------------------------------------
  // Gráfico
  const xu = 40;
  const yu = 21;
  const PAD = 30;
  const [y0, y1] = yRange;
  const gx0 = t0 - 0.5;
  const gx1 = t1 + 0.5;
  const GW = PAD * 2 + (gx1 - gx0) * xu;
  const GH = PAD * 2 + (y1 - y0) * yu;
  const X = (t) => PAD + (t - gx0) * xu;
  const Y = (y) => PAD + (y1 - y) * yu;
  const path = (fn, a, b) => {
    const pts = [];
    const N = 120;
    for (let i = 0; i <= N; i += 1) {
      const t = a + ((b - a) * i) / N;
      pts.push(`${X(t).toFixed(1)} ${Y(fn(t)).toFixed(1)}`);
    }
    return `M ${pts.join(' L ')}`;
  };
  const traceEnd = playing ? tCont : t1;
  const xt = [];
  for (let t = Math.ceil(gx0); t <= Math.floor(gx1); t += 1) xt.push(t);
  const yt = [];
  for (let y = Math.ceil(y0); y <= Math.floor(y1); y += 1) yt.push(y);

  // ---------------------------------------------------------------------
  // Rede
  const NW = 300;
  const NH = 210;
  const inX = 46;
  const hidX = 158;
  const outX = 262;
  const inY = [45, 105, 165];
  const hidY = [70, 140];
  const outY = 105;
  const xin = xOf(tNow);

  return (
    <div className={shared.wrapper} data-explorer="two-layers-collapse">
      <figure className={styles.figure} ref={ref} aria-label={label}>
        <div className={styles.row}>
          <svg className={styles.svg} viewBox={`0 0 ${NW} ${NH}`} style={{maxWidth: `${NW}px`}} role="img" aria-label="A rede: três entradas, dois neurônios no meio e uma saída">
            {inY.map((yI, i) =>
              hidY.map((yH, k) => (
                <line key={`e${i}${k}`} x1={inX + 20} y1={yI} x2={hidX - 24} y2={yH} stroke="var(--ifm-color-emphasis-400)" strokeWidth={1.2} />
              )),
            )}
            {hidY.map((yH, k) => (
              <line key={`o${k}`} x1={hidX + 24} y1={yH} x2={outX - 22} y2={outY} stroke="var(--ifm-color-emphasis-400)" strokeWidth={1.2} />
            ))}
            {inY.map((yI, i) => (
              <g key={`in${i}`}>
                <circle cx={inX} cy={yI} r={20} fill="var(--mv-paper)" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
                <SvgMath x={inX} y={yI} math={fmt(xin[i])} fontSize={14} />
                <SvgMath x={inX - 26} y={yI} math={`x_${i + 1}`} fontSize={12} anchor="end" />
              </g>
            ))}
            {hidY.map((yH, k) => {
              const clipped = useRelu && cur.h[k] < 0;
              return (
                <g key={`h${k}`}>
                  <rect x={hidX - 24} y={yH - 20} width={48} height={40} rx={8} fill="var(--mv-tone-1)" fillOpacity={0.12} stroke="var(--mv-tone-1)" strokeWidth={1.6} />
                  <SvgMath x={hidX} y={yH} math={fmt(cur.hh[k])} fontSize={14} />
                  {clipped && (
                    <SvgMath x={hidX} y={yH + 31} math={`\\text{era }{${fmt(cur.h[k])}}`} fontSize={11} tone={2} />
                  )}
                </g>
              );
            })}
            <SvgMath x={hidX} y={18} math={useRelu ? '\\text{camada 1, ReLU}' : '\\text{camada 1}'} fontSize={12} tone={1} />
            <circle cx={outX} cy={outY} r={22} fill="var(--mv-tone-2)" fillOpacity={0.14} stroke="var(--mv-tone-2)" strokeWidth={1.6} />
            <SvgMath x={outX} y={outY} math={fmt(cur.y)} fontSize={14} />
            <SvgMath x={outX} y={outY - 36} math="\text{camada 2}" fontSize={12} tone={2} />
          </svg>
          <svg className={styles.svg} viewBox={`0 0 ${GW} ${GH}`} style={{maxWidth: `${GW}px`}} role="img" aria-label="Gráfico da saída contra t">
            {xt.map((t) => (
              <line key={`gx${t}`} x1={X(t)} y1={Y(y1)} x2={X(t)} y2={Y(y0)} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
            ))}
            {yt.map((y) => (
              <line key={`gy${y}`} x1={X(gx0)} y1={Y(y)} x2={X(gx1)} y2={Y(y)} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
            ))}
            <line x1={X(gx0)} y1={Y(0)} x2={X(gx1)} y2={Y(0)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
            <line x1={X(0)} y1={Y(y0)} x2={X(0)} y2={Y(y1)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
            {[-2, 2].map((t) => (
              <SvgMath key={`lx${t}`} x={X(t)} y={Y(0) + 13} math={String(t)} fontSize={11} />
            ))}
            {[2, 4, 6, 8].map((y) => (
              <SvgMath key={`ly${y}`} x={X(0) - 8} y={Y(y)} math={String(y)} fontSize={11} anchor="end" />
            ))}
            <SvgMath x={X(gx1) - 4} y={Y(0) - 12} math="t" fontSize={13} anchor="end" />
            <SvgMath x={X(0) + 8} y={Y(y1) + 8} math="\text{saída}" fontSize={12} anchor="start" />
            {traceEnd > t0 && (
              <path d={path((t) => net(t, useRelu).y, t0, traceEnd)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={4} strokeLinejoin="round" opacity={0.85} />
            )}
            <path d={path(single, t0, t1)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={2} strokeDasharray="6 5" />
            <circle cx={X(tCont)} cy={Y(single(tCont))} r={4.5} fill="var(--mv-paper)" stroke="var(--mv-tone-1)" strokeWidth={2} />
            <circle cx={X(tCont)} cy={Y(net(tCont, useRelu).y)} r={5.5} fill="var(--mv-tone-2)" />
            {!playing && (
              <>
                <SvgMath x={X(0.25)} y={Y(single(0.25)) + 22} math="\text{camada única}" fontSize={12} tone={1} anchor="start" halo />
                <SvgMath
                  x={useRelu ? X(-3.4) : X(-0.4)}
                  y={useRelu ? Y(net(-3.4, true).y) - 18 : Y(single(-0.4)) - 16}
                  math={useRelu ? '\\text{rede com ReLU}' : '\\text{rede sem ReLU}'}
                  fontSize={12}
                  tone={2}
                  anchor={useRelu ? 'start' : 'end'}
                  halo
                />
              </>
            )}
          </svg>
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls} style={{marginTop: '0.6rem'}}>
        <label className={shared.control}>
          <span>
            Entrada <Formula math={`\\vec{x} = (t,\\ 0,\\ 0)`} />, com t = <strong>{fmt(tNow).replace('{,}', ',').replace('-', '−')}</strong>
          </span>
          <input
            type="range"
            min={t0}
            max={t1}
            step={0.5}
            value={tNow}
            disabled={playing}
            onChange={(e) => setTSel(Number(e.target.value))}
            aria-label="Valor de t"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`W_1\\vec{x} + \\vec{b}_1 = ${vecTex(cur.h)}`} />
          {useRelu && (
            <>
              {'  '}
              <Formula math={`\\xrightarrow{\\ \\operatorname{ReLU}\\ } ${vecTex(cur.hh)}`} />
            </>
          )}
        </p>
        <p className={shared.formula}>
          <span className={styles.c2}>Rede: </span>
          <Formula math={`W_2${vecTex(cur.hh)} + ${fmt(b2[0])} = ${fmt(cur.y)}`} />
        </p>
        <p className={shared.formula}>
          <span className={styles.c1}>Camada única: </span>
          <Formula math={`\\begin{bmatrix} ${W[0].map(fmt).join(' & ')} \\end{bmatrix}\\vec{x} + ${fmt(bb)} = ${fmt(ys)}`} />
        </p>
        <p className={styles.small}>
          {Math.abs(cur.y - ys) < 1e-9
            ? 'As duas saídas são iguais.'
            : `As duas saídas são diferentes: a ReLU trocou ${cur.h.filter((v) => v < 0).length === 2 ? 'os dois números negativos' : 'o número negativo'} do meio por 0.`}
        </p>
      </div>
      <div className={shared.buttons}>
        {toggle && (
          <button
            type="button"
            className={useRelu ? styles.active : undefined}
            aria-pressed={useRelu}
            disabled={playing}
            onClick={() => {
              setUseRelu((r) => !r);
              play();
            }}
          >
            {useRelu ? 'Tirar a ReLU do meio' : 'Pôr a ReLU entre as camadas'}
          </button>
        )}
        <button type="button" onClick={() => play()} disabled={playing}>
          Traçar de novo
        </button>
      </div>
    </div>
  );
}
