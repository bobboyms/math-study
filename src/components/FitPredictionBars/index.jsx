import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {AREAS, PRICES, tnum, pnum} from '../FitLineExplorer/apartamentos';

// A lista de previsões como combinação das colunas (lição 11.12).
//
// Uma barra por apartamento. A parte escura (laranja) tem altura m × área: é
// m vezes a coluna das áreas. Em cima dela, a parte clara (laranja, borda
// tracejada) tem altura n, a mesma em todas as barras: é n vezes a coluna de
// uns. Com n negativo, a parte clara é descontada de cima para baixo. A
// altura final de cada barra é a previsão da reta. O traço azul é o preço
// observado, e o segmento verde, o erro. Deslizantes para m e n.

const W = 520;
const H = 360;
const Y0 = 318;
const SC = 0.42; // px por mil reais
const TOP = 680;
const BAR = 30;
const cx = (i) => 112 + i * 88;
const tone = (k) => `var(--mv-tone-${k})`;
const yPx = (v) => Y0 - Math.max(0, Math.min(TOP, v)) * SC;

export default function FitPredictionBars({initial = [5, 50], caption}) {
  const [[m, n], setMn] = useState(initial);
  const parts = AREAS.map((x) => m * x);
  const preds = parts.map((p) => p + n);
  const res = preds.map((p, i) => PRICES[i] - p);

  const list = (v) => `\\begin{bmatrix} ${v.map((z) => tnum(z)).join(' \\\\ ')} \\end{bmatrix}`;

  return (
    <div className={shared.wrapper} data-explorer="fit-prediction-bars">
      <figure style={{margin: 0}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', maxWidth: W, display: 'block', margin: '0 auto'}} role="img" aria-label="Cinco barras de previsão, uma por apartamento">
          {[0, 200, 400, 600].map((v) => (
            <g key={v}>
              <line x1={58} x2={W - 10} y1={yPx(v)} y2={yPx(v)} stroke="var(--ifm-color-emphasis-300)" strokeWidth={v === 0 ? 1.4 : 0.8} />
              <SvgMath x={50} y={yPx(v)} anchor="end" math={tnum(v)} fontSize={12} />
            </g>
          ))}
          <SvgMath x={60} y={16} anchor="start" math={'\\text{R\\$ mil}'} fontSize={12} />
          {AREAS.map((x, i) => {
            const c = cx(i);
            const base = parts[i];
            const top = preds[i];
            const lo = Math.min(base, top);
            const hi = Math.max(base, top);
            return (
              <g key={x}>
                {/* parte escura: m × área; com n negativo, só até a previsão (o resto é o trecho que n desconta) */}
                <rect x={c - BAR / 2} y={yPx(n < 0 ? top : base)} width={BAR} height={Y0 - yPx(n < 0 ? top : base)} fill={tone(2)} fillOpacity={0.6} />
                {Math.abs(n) > 0.5 && (
                  <rect
                    x={c - BAR / 2}
                    y={yPx(hi)}
                    width={BAR}
                    height={yPx(lo) - yPx(hi)}
                    fill={tone(2)}
                    fillOpacity={n > 0 ? 0.18 : 0}
                    stroke={tone(2)}
                    strokeDasharray="4 3"
                    strokeWidth={1.3}
                  />
                )}
                {/* topo da barra: a previsão */}
                <line x1={c - BAR / 2 - 3} x2={c + BAR / 2 + 3} y1={yPx(top)} y2={yPx(top)} stroke={tone(2)} strokeWidth={3} />
                {/* preço observado */}
                <line x1={c - BAR / 2 - 6} x2={c + BAR / 2 + 6} y1={yPx(PRICES[i])} y2={yPx(PRICES[i])} stroke={tone(1)} strokeWidth={3} />
                {/* erro */}
                {Math.abs(res[i]) > 0.5 && (
                  <line x1={c + BAR / 2 + 10} x2={c + BAR / 2 + 10} y1={yPx(top)} y2={yPx(PRICES[i])} stroke={tone(3)} strokeWidth={2.4} />
                )}
                <SvgMath x={c} y={Y0 + 16} math={`${x}\\text{ m}^2`} fontSize={12} />
                <SvgMath x={c} y={Y0 + 34} math={`m \\times ${x}`} fontSize={11} tone={2} />
              </g>
            );
          })}
        </svg>
        <figcaption className={shared.caption}>
          {caption ??
            'Uma barra por apartamento. A parte escura é m vezes a área; a parte clara, de borda tracejada, é n, igual nas cinco. O topo da barra (traço laranja) é a previsão da reta, o traço azul é o preço observado, e o segmento verde é o erro. Com n negativo, a parte clara vira um trecho tracejado sem cor no alto da barra: é o que n desconta de m vezes a área.'}
        </figcaption>
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            <strong>m = {pnum(m, 1)}</strong> (peso da coluna das áreas)
          </span>
          <input type="range" min={0} max={10} step={0.5} value={m} onChange={(e) => setMn([Number(e.target.value), n])} aria-label="Peso m" />
        </label>
        <label className={shared.control}>
          <span>
            <strong>n = {pnum(n)}</strong> (peso da coluna de uns)
          </span>
          <input type="range" min={-250} max={400} step={5} value={n} onChange={(e) => setMn([m, Number(e.target.value)])} aria-label="Peso n" />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          {/* três blocos que não se partem por dentro: a quebra de linha, quando
              precisa, fica entre eles, e nunca separa b − A c do seu valor */}
          <Formula math={`{${tnum(m)}${list(AREAS)} ${n < 0 ? '-' : '+'} ${tnum(Math.abs(n))}${list([1, 1, 1, 1, 1])} = ${list(preds)}}`} />
          {' '}
          <span style={{display: 'inline-block', width: '1.5em'}} />{' '}
          <Formula math={`{\\vec{b} = ${list(PRICES)}}`} />
          {' '}
          <span style={{display: 'inline-block', width: '1.5em'}} />{' '}
          <Formula math={`{\\vec{b} - A\\vec{c} = ${list(res)}}`} />
        </p>
      </div>
    </div>
  );
}
