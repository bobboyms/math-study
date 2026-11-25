import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath} from '../VectorSumKit';

// Andar uma fração do caminho (lição 7.29): T = A + t·AB.
//
// A seta azul tracejada é o caminho inteiro, de A até B. A seta laranja é a
// fração t dele, saindo de A, e o ponto T fica na ponta. O deslizante anda em
// doze avos do caminho, para passar por 1/4, 1/3, 1/2, 2/3 e 3/4. Ao entrar
// na tela, o t vai sozinho de 0 até 1/2: o ponto médio.

const TWELFTHS = 12;
const DURATION = 2.2;

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const fracMath = (n, d) => {
  if (n === 0) return '0';
  const g = gcd(n, d);
  const p = n / g;
  const q = d / g;
  return q === 1 ? `${p}` : `\\tfrac{${p}}{${q}}`;
};
const fracPlain = (n, d) => {
  if (n === 0) return '0';
  const g = gcd(n, d);
  return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`;
};
const approx = (value) => {
  const exact = Math.abs(value * 100 - Math.round(value * 100)) < 1e-9;
  return {text: mathNumber(value, 2), exact};
};

export default function PathFraction({A = [2, 2], B = [11, 7], initial = 6, caption}) {
  const [n, setN] = useState(initial);
  const {ref, play, playing} = useAnimation({
    duration: DURATION,
    onFrame: (time) => setN(Math.round(initial * stage(time, 0.2, DURATION))),
  });

  const AB = [B[0] - A[0], B[1] - A[1]];
  const t = n / TWELFTHS;
  const T = [A[0] + t * AB[0], A[1] + t * AB[1]];
  const tx = approx(T[0]);
  const ty = approx(T[1]);
  const exact = tx.exact && ty.exact;
  const sep = tx.text.includes('{,}') || ty.text.includes('{,}') ? ';' : ',';
  const tMath = fracMath(n, TWELFTHS);

  const segments = [{from: A, to: B, tone: 1, arrow: true, dashed: true}];
  if (n > 0) segments.push({from: A, to: T, tone: 2, arrow: true});

  const points = [
    {at: A, tone: 1, r: 4, label: 'A', dx: -14, dy: -6},
    {at: B, tone: 1, r: 4, label: 'B', dx: 14, dy: -6},
    {at: T, tone: 3, r: 5, label: 'T', dx: -6, dy: -18},
  ];

  return (
    <div className={shared.wrapper} data-explorer="path-fraction">
      <div ref={ref}>
        <CartesianPlane
          xMin={-1}
          xMax={12}
          yMin={-1}
          yMax={8}
          xUnit={30}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          caption={
            caption ??
            'A seta azul tracejada é o caminho inteiro de A até B. A seta laranja é a fração t desse caminho, saindo de A. O ponto T fica na ponta dela.'
          }
        />
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Fração do caminho: <strong>t = {fracPlain(n, TWELFTHS)}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={TWELFTHS}
            step={1}
            value={n}
            disabled={playing}
            onChange={(e) => setN(Number(e.target.value))}
            aria-label="Fração t do caminho de A até B, em doze avos"
            aria-valuetext={fracPlain(n, TWELFTHS)}
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`T = A + ${tMath}\\overrightarrow{AB} = ${pairMath(...A)} + ${tMath}${pairMath(...AB)} ${exact ? '=' : '\\approx'} (${tx.text}${sep}\\ ${ty.text})`}
          />
        </p>
        {n === 6 && <p>Com t = 1/2, o ponto T é o ponto médio de A e B.</p>}
        {n === 0 && <p>Com t = 0, não se anda nada: T fica em A.</p>}
        {n === TWELFTHS && <p>Com t = 1, anda-se o caminho inteiro: T chega a B.</p>}
      </div>
      <div className={shared.buttons}>
        {[4, 6, 8].map((k) => (
          <button key={k} type="button" disabled={playing} aria-pressed={n === k} onClick={() => setN(k)}>
            t = {fracPlain(k, TWELFTHS)}
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
