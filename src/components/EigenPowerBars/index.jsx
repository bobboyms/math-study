import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from '../LinearGridMorph/styles.module.css';
import {num, numText} from '../EigenGridMorph/eigen';

// As potências de um autovalor, λ⁰ a λ¹⁰, como barras (lição 11.11).
//
// É o que acontece, aplicação após aplicação, com a parte de um vetor que
// está na reta de um autovetor de autovalor λ: ela é multiplicada por λ a
// cada vez. O deslizante escolhe λ; os botões levam aos casos da lição.
// Barras para cima são positivas, para baixo negativas. A escala vertical se
// ajusta para caber a maior barra, e o painel diz qual é a escala.

const K = 10;

export default function EigenPowerBars({initial = 0.7, caption}) {
  const [tenths, setTenths] = useState(Math.round(initial * 10));
  const lam = tenths / 10;
  const vals = [];
  for (let k = 0; k <= K; k += 1) vals.push(lam ** k);
  const top = Math.max(1, ...vals.map(Math.abs));

  const W = 460;
  const H = 260;
  const x0 = 44;
  const x1 = W - 12;
  const mid = H / 2;
  const half = H / 2 - 26;
  const bw = (x1 - x0) / (K + 1);
  const Y = (v) => mid - (half * v) / top;

  let verdict;
  const a = Math.abs(lam);
  if (lam === 0) verdict = 'Com λ = 0, a parte some já na primeira aplicação.';
  else if (a < 1 && lam > 0) verdict = `Com λ entre 0 e 1, a parte encolhe a cada aplicação e some: depois de 10 aplicações sobra ${numText(lam ** 10 * 100, 2)}% dela.`;
  else if (a < 1) verdict = `Com λ entre −1 e 0, a parte troca de sentido a cada aplicação e, mesmo assim, some: depois de 10 aplicações sobra ${numText(Math.abs(lam) ** 10 * 100, 2)}% do tamanho.`;
  else if (lam === 1) verdict = 'Com λ = 1, a parte fica igual para sempre.';
  else if (lam === -1) verdict = 'Com λ = −1, a parte troca de sentido a cada aplicação e mantém o tamanho: não some nem cresce.';
  else if (lam > 1) verdict = `Com λ maior que 1, a parte cresce sem parar: depois de 10 aplicações ela está ${numText(lam ** 10, 2)} vezes maior.`;
  else verdict = `Com λ menor que −1, a parte troca de sentido a cada aplicação e cresce: depois de 10 aplicações ela está ${numText(Math.abs(lam) ** 10, 2)} vezes maior.`;

  const presets = [0.7, 1, 1.1, -0.5, -1, -1.2];

  return (
    <div className={shared.wrapper} data-explorer="eigen-power-bars">
      <figure className={styles.figure}>
        <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label="Potências de lambda, de 0 a 10">
          {[top, top / 2, 0, -top / 2, -top].map((v) => (
            <g key={v}>
              <line x1={x0} y1={Y(v)} x2={x1} y2={Y(v)} stroke={v === 0 ? 'var(--ifm-color-emphasis-600)' : 'var(--ifm-color-emphasis-200)'} strokeWidth={v === 0 ? 1.4 : 1} />
              <text x={x0 - 6} y={Y(v) + 4} textAnchor="end" fontSize={11} fill="var(--ifm-color-emphasis-800)">
                {numText(v, top >= 10 ? 1 : 2)}
              </text>
            </g>
          ))}
          {vals.map((v, k) => {
            const xa = x0 + k * bw + bw * 0.18;
            const y = Y(v);
            return (
              <g key={k}>
                <rect x={xa} y={Math.min(y, mid)} width={bw * 0.64} height={Math.max(0.8, Math.abs(y - mid))} fill={v >= 0 ? 'var(--mv-tone-1)' : 'var(--mv-tone-2)'} rx={2} />
                <text x={xa + bw * 0.32} y={v >= 0 ? mid + 14 : mid - 6} textAnchor="middle" fontSize={11} fill="var(--ifm-color-emphasis-800)">
                  {k}
                </text>
              </g>
            );
          })}
          <text x={x1} y={H - 4} textAnchor="end" fontSize={11} fill="var(--ifm-color-emphasis-800)">
            número de aplicações
          </text>
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Autovalor λ: <strong>{numText(lam, 1)}</strong>
          </span>
          <input type="range" min={-15} max={15} step={1} value={tenths} onChange={(e) => setTenths(Number(e.target.value))} aria-label="Autovalor lambda" />
        </label>
      </div>
      <div className={shared.buttons} role="group" aria-label="Casos da lição">
        {presets.map((p) => (
          <button key={p} type="button" className={Math.abs(p - lam) < 1e-9 ? styles.active : undefined} aria-pressed={Math.abs(p - lam) < 1e-9} onClick={() => setTenths(Math.round(p * 10))}>
            λ = {numText(p, 1)}
          </button>
        ))}
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\lambda^{10} = ${lam < 0 ? `(${num(lam, 1)})` : num(lam, 1)}^{10} ${Math.abs(lam ** 10 - Number((lam ** 10).toFixed(4))) < 1e-12 ? '=' : '\\approx'} ${num(lam ** 10, 4)}`} />
        </p>
        <p>{verdict}</p>
      </div>
    </div>
  );
}
