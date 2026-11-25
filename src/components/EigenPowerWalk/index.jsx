import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, Label, frame} from '../LinearGridMorph/plane';
import {lineEnds, numText} from '../EigenGridMorph/eigen';

// Aplicar a mesma matriz muitas vezes (lição 11.11).
//
// B = [[4, 1], [2, 3]] tem autovetores v1 = (1, 1), com λ = 5, e
// v2 = (1, −2), com λ = 2. A seta inicial x = (2, −1) é v1 + v2. Depois de n
// aplicações, Bⁿx = 5ⁿ v1 + 2ⁿ v2: a parte de v1 cresce mais depressa, e a
// seta vai se alinhando com a reta de v1.
//
// Os números explodem (5⁶ = 15 625), então o desenho mostra só a DIREÇÃO:
// cada Bⁿx é encolhida até o mesmo comprimento, junto com as suas duas
// partes (azul ao longo de v1, laranja ao longo de v2). As direções
// anteriores ficam marcadas como pontos no círculo. A tabela traz os números
// verdadeiros de cada passo.

const V1 = [1, 1];
const V2 = [1, -2];
const L1 = 5;
const L2 = 2;
const MAXN = 8;
const R = 2.4;

const xAt = (n) => [L1 ** n * V1[0] + L2 ** n * V2[0], L1 ** n * V1[1] + L2 ** n * V2[1]];
const angleTo = (u, v) => {
  const a = Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]);
  return Math.abs((a * 180) / Math.PI);
};

function intText(x) {
  const s = String(Math.abs(Math.round(x))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return x < 0 ? `−${s}` : s;
}

const intTex = (x) => intText(x).replace(/\u2009/g, '\\,').replace('−', '-');

export default function EigenPowerWalk({initial = 6, caption}) {
  const [n, setN] = useState(initial);
  const [manual, setManual] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: 5.6, onFrame: () => setManual(false)});

  const animN = Math.min(initial, Math.floor((t / 5.6) * (initial + 1)));
  const cur = playing || !manual ? (playing ? animN : initial) : n;

  const win = [-3, 3, -3, 3];
  const f = frame(win, 54);

  const x = xAt(cur);
  const L = Math.hypot(x[0], x[1]);
  const sc = R / L;
  const leg1 = [sc * L1 ** cur * V1[0], sc * L1 ** cur * V1[1]];
  const tip = [x[0] * sc, x[1] * sc];

  const lines = [
    {d: V1, tone: 1},
    {d: V2, tone: 2},
  ].map((ln) => lineEnds(ln.d, win).map((p) => f.P(p)).concat([ln.tone]));

  const rows = [];
  for (let k = 0; k <= cur; k += 1) rows.push(k);

  return (
    <div className={shared.wrapper} data-explorer="eigen-power-walk">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label="A direção de B elevado a n vezes x, passo a passo">
          <ClipDefs f={f} id="eigpow-clip" />
          <FixedGrid f={f} />
          <Axes f={f} />
          {lines.map(([a, b, tone]) => (
            <line key={tone} clipPath="url(#eigpow-clip)" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={`var(--mv-tone-${tone})`} strokeWidth={1.6} strokeDasharray="7 5" opacity={0.8} />
          ))}
          <circle cx={f.X(0)} cy={f.Y(0)} r={R * f.unit} fill="none" stroke="var(--mv-guide)" strokeWidth={1.2} strokeDasharray="4 4" />
          {rows.slice(0, -1).map((k) => {
            const xk = xAt(k);
            const lk = Math.hypot(xk[0], xk[1]);
            const p = f.P([(R * xk[0]) / lk, (R * xk[1]) / lk]);
            return (
              <g key={k}>
                <circle cx={p[0]} cy={p[1]} r={4} fill="var(--mv-tone-3)" opacity={0.55} />
                {!playing && k <= 2 && (
                  <Label f={f} at={[(R * xk[0]) / lk, (R * xk[1]) / lk]} math={`n = ${k}`} fontSize={11} dx={30} dy={4} />
                )}
              </g>
            );
          })}
          <Arrow f={f} to={leg1} tone={1} width={2.4} head={9} />
          <Arrow f={f} from={leg1} to={tip} tone={2} width={2.4} head={9} />
          <Arrow f={f} to={tip} tone={3} width={3} label={playing ? null : cur === 0 ? '\\vec{x}' : `B^{${cur}}\\vec{x}`} offset={cur === 0 ? [10, 10, 'start'] : [8, -12, 'start']} />
          {!playing && <Label f={f} at={[2.05, 2.55]} math={'\\text{reta de } (1,\\ 1)'} tone={1} fontSize={12} anchor="end" dx={-4} />}
          {!playing && <Label f={f} at={[-1.25, 2.55]} math={'\\text{reta de } (1,\\ -2)'} tone={2} fontSize={12} anchor="end" dx={-8} />}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`B^{${cur}}\\vec{x} = 5^{${cur}}(1,\\ 1) + 2^{${cur}}(1,\\ -2) = ${intTex(L1 ** cur)}(1,\\ 1) + ${intTex(L2 ** cur)}(1,\\ -2) = (${intTex(x[0])},\\ ${intTex(x[1])})`}
          />
        </p>
        <div style={{overflowX: 'auto'}}>
          <table>
            <thead>
              <tr>
                <th>n</th>
                <th>Bⁿx</th>
                <th>parte azul: 5ⁿ</th>
                <th>parte laranja: 2ⁿ</th>
                <th>laranja ÷ azul</th>
                <th>ângulo até a reta de (1, 1)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((k) => {
                const xk = xAt(k);
                return (
                  <tr key={k}>
                    <td>{k}</td>
                    <td style={{whiteSpace: 'nowrap'}}>
                      ({intText(xk[0])}, {intText(xk[1])})
                    </td>
                    <td>{intText(L1 ** k)}</td>
                    <td>{intText(L2 ** k)}</td>
                    <td>{numText((L2 / L1) ** k, 4)}</td>
                    <td>{numText(angleTo(V1, xk), 2)}°</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          disabled={playing || cur >= MAXN}
          onClick={() => {
            setN(Math.min(MAXN, cur + 1));
            setManual(true);
          }}
        >
          Aplicar B mais uma vez
        </button>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setN(0);
            setManual(true);
          }}
        >
          Voltar para x
        </button>
        <button
          type="button"
          disabled={playing}
          onClick={() => {
            setManual(false);
            play();
          }}
        >
          Ver o movimento de novo
        </button>
      </div>
    </div>
  );
}
