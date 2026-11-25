import React, {useId, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, frame} from '../LinearGridMorph/plane';
import {bmatrix, det, eigenvector, lineEnds, minusLambda, niceDir, num, numText, pair, pairText, trace} from '../EigenGridMorph/eigen';

// Os autovalores são os λ que fazem A − λI achatar o plano (lição 11.11).
//
// O deslizante escolhe λ (de décimo em décimo). À esquerda, as colunas de
// A − λI (azul e laranja) e o paralelogramo em que elas transformam o
// quadrado de lado 1 (verde): a área com sinal é det(A − λI). À direita, o
// mesmo número como função de λ, a parábola λ² − (traço)λ + det A. Quando o
// paralelogramo achata num segmento, o ponto da parábola está no eixo, o λ é
// autovalor e entra no registro; a figura mostra o vetor que A − λI leva até
// a origem, que é o autovetor.

const par = (x) => (x < -1e-9 ? `(${num(x, 1)})` : num(x, 1));

export default function EigenCharSlider({
  matrix = [
    [4, 1],
    [2, 3],
  ],
  name = 'B',
  min = -1,
  max = 7,
  initial = 0,
  window: win = [-4, 6, -5, 5],
  unit = 24,
  graphY = [-4, 18],
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const [tenths, setTenths] = useState(Math.round(initial * 10));
  const [found, setFound] = useState([]);
  const sweepRef = useRef(false);

  const pOf = (l) => det(minusLambda(matrix, l));
  const register = (tt) => {
    const l = tt / 10;
    if (Math.abs(pOf(l)) < 1e-9) setFound((old) => (old.includes(tt) ? old : [...old, tt].sort((a, b) => a - b)));
  };

  const {ref, play, playing} = useAnimation({
    duration: 6,
    autoplay: false,
    onFrame: (tt, total) => {
      if (!sweepRef.current) return;
      const val = Math.round(min * 10 + ((max - min) * 10 * tt) / total);
      setTenths(val);
      register(val);
      if (tt >= total) sweepRef.current = false;
    },
  });

  const lam = tenths / 10;
  const M = minusLambda(matrix, lam);
  const D = det(M);
  const flat = Math.abs(D) < 1e-9;
  const c1 = [M[0][0], M[1][0]];
  const c2 = [M[0][1], M[1][1]];

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const quad = [[0, 0], c1, [c1[0] + c2[0], c1[1] + c2[1]], c2].map((p) => f.P(p));
  const quadPath = `M ${quad.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')} Z`;

  let killed = null;
  let flatLine = null;
  if (flat) {
    const ev = eigenvector(matrix, lam);
    killed = niceDir(ev) ?? ev;
    const col = Math.hypot(c1[0], c1[1]) > 1e-9 ? c1 : c2;
    flatLine = lineEnds(col, win).map((p) => f.P(p));
  }

  // Gráfico de p(λ)
  const GW = 300;
  const GH = f.H;
  const gx0 = 40;
  const gx1 = GW - 14;
  const gy0 = 14;
  const gy1 = GH - 30;
  const [y0, y1] = graphY;
  const GX = (l) => gx0 + ((gx1 - gx0) * (l - min)) / (max - min);
  const GY = (y) => gy0 + ((gy1 - gy0) * (y1 - y)) / (y1 - y0);
  let curve = '';
  for (let i = 0; i <= 160; i += 1) {
    const l = min + ((max - min) * i) / 160;
    curve += `${i ? ' L' : 'M'} ${GX(l).toFixed(1)} ${GY(pOf(l)).toFixed(1)}`;
  }
  const xt = [];
  for (let l = Math.ceil(min); l <= max; l += 1) xt.push(l);
  const yt = [];
  for (let y = Math.ceil(y0 / 4) * 4; y <= y1; y += 4) yt.push(y);

  const tr = trace(matrix);
  const dA = det(matrix);
  const a = matrix[0][0];
  const b = matrix[0][1];
  const c = matrix[1][0];
  const d = matrix[1][1];

  return (
    <div className={shared.wrapper} data-explorer="eigen-char-slider">
      <figure className={styles.figure} ref={ref}>
        <div className={styles.row}>
          <svg viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={`Colunas de ${name} menos lambda I e o paralelogramo delas`}>
            <ClipDefs f={f} id={clipId} />
            <FixedGrid f={f} clipId={clipId} />
            <Axes f={f} />
            {flatLine && (
              <line x1={flatLine[0][0]} y1={flatLine[0][1]} x2={flatLine[1][0]} y2={flatLine[1][1]} stroke="var(--mv-tone-3)" strokeWidth={1.6} strokeDasharray="6 4" clipPath={`url(#${clipId})`} />
            )}
            <path d={quadPath} fill="var(--mv-tone-3)" fillOpacity={flat ? 0 : 0.3} stroke="var(--mv-tone-3)" strokeWidth={flat ? 4 : 1.6} />
            {killed && (
              <Arrow
                f={f}
                to={killed}
                tone={0}
                dashed
                width={2.2}
                label={playing ? null : pair(killed, 0)}
                offset={killed[1] < 0 ? [10, 12, 'start'] : [10, 6, 'start']}
              />
            )}
            <Arrow f={f} to={c1} tone={1} />
            <Arrow f={f} to={c2} tone={2} />
          </svg>
          <svg viewBox={`0 0 ${GW} ${GH}`} style={{maxWidth: `${GW}px`}} role="img" aria-label="Gráfico de det(B − λI) em função de λ">
            {yt.map((y) => (
              <g key={`y${y}`}>
                <line x1={gx0} y1={GY(y)} x2={gx1} y2={GY(y)} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
                <text x={gx0 - 6} y={GY(y) + 4} textAnchor="end" fontSize={11} fill="var(--ifm-color-emphasis-800)">
                  {String(y).replace('-', '−')}
                </text>
              </g>
            ))}
            {xt.map((l) => (
              <g key={`x${l}`}>
                <line x1={GX(l)} y1={gy0} x2={GX(l)} y2={gy1} stroke="var(--ifm-color-emphasis-200)" strokeWidth={1} />
                <text x={GX(l)} y={gy1 + 15} textAnchor="middle" fontSize={11} fill="var(--ifm-color-emphasis-800)">
                  {String(l).replace('-', '−')}
                </text>
              </g>
            ))}
            <line x1={gx0} y1={GY(0)} x2={gx1} y2={GY(0)} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
            <line x1={GX(0)} y1={gy0} x2={GX(0)} y2={gy1} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} />
            <text x={gx1} y={GH - 2} textAnchor="end" fontSize={12} fill="var(--ifm-color-emphasis-800)">
              λ
            </text>
            <path d={curve} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2} />
            {found.map((tt) => (
              <circle key={tt} cx={GX(tt / 10)} cy={GY(0)} r={6} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2.4} />
            ))}
            <line x1={GX(lam)} y1={GY(0)} x2={GX(lam)} y2={GY(D)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.2} strokeDasharray="3 3" />
            <circle cx={GX(lam)} cy={GY(D)} r={5} fill="var(--ifm-color-emphasis-800)" />
          </svg>
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Número λ: <strong>{numText(lam, 1)}</strong>
          </span>
          <input
            type="range"
            min={min * 10}
            max={max * 10}
            step={1}
            value={tenths}
            disabled={playing}
            onChange={(e) => {
              const v = Number(e.target.value);
              setTenths(v);
              register(v);
            }}
            aria-label="Número lambda"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`${name} - ${num(lam, 1)}I = ${bmatrix(M, 1)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\det(${name} - ${num(lam, 1)}I) = ${par(a - lam)} \\times ${par(d - lam)} - ${par(b)} \\times ${par(c)} = ${num(D, 2)}`}
          />
        </p>
        {flat ? (
          <p>
            <strong>O paralelogramo achatou num segmento.</strong> As duas colunas caíram na mesma reta, e a área é zero. Por isso{' '}
            {numText(lam, 1)} é autovalor de {name}: o vetor {pairText(killed, 0)} (tracejado) vai para a origem, isto é,{' '}
            ({name} − {numText(lam, 1)}I){pairText(killed, 0)} = (0, 0), que é o mesmo que {name}
            {pairText(killed, 0)} = {numText(lam, 1)} × {pairText(killed, 0)}.
          </p>
        ) : (
          <p>
            O paralelogramo tem área {numText(Math.abs(D), 2)}
            {D < 0 ? ' e está virado (determinante negativo)' : ''}. Como a área não é zero, só o vetor (0, 0) vai para a origem, e{' '}
            {numText(lam, 1)} não é autovalor.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            sweepRef.current = true;
            play();
          }}
        >
          Varrer λ de {numText(min, 0)} a {numText(max, 0)}
        </button>
        <button type="button" disabled={playing || !found.length} onClick={() => setFound([])}>
          Limpar o registro
        </button>
      </div>
      <p className={shared.hint}>
        {found.length === 0
          ? `Registro: nenhum λ achatou o paralelogramo ainda. A parábola é λ² − ${numText(tr, 2)}λ + ${numText(dA, 2)}: procure onde ela corta o eixo.`
          : `Registro: o paralelogramo achatou com λ = ${found.map((tt) => numText(tt / 10, 1)).join(' e com λ = ')}.`}
      </p>
    </div>
  );
}

