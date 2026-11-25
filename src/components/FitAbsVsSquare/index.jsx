import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {tnum, pnum} from '../FitLineExplorer/apartamentos';

// Valor absoluto contra quadrado (lição 11.12).
//
// Dois apartamentos dividem 40 mil de erro: um erra a, o outro erra 40 − a.
// O deslizante move a de 0 a 40. Em cima, um quadrado para cada erro (lado
// igual ao erro). Embaixo, duas barras: a soma dos erros sem sinal, que fica
// sempre em 40, e a soma dos quadrados, que muda e é menor quando os dois
// erros são iguais (20 e 20). O valor absoluto não distingue “errar 40 num
// só” de “errar 20 em cada”; o quadrado distingue.

const TOTAL = 40;
const W = 370;
const H = 330;
const S = 3.1; // px por mil reais no lado do quadrado
const BASE = 160;
const BAR_LEFT = 30;
const BAR_W = 300;
const tone = (k) => `var(--mv-tone-${k})`;

export default function FitAbsVsSquare({initial = 0, caption}) {
  const [a, setA] = useState(initial);
  const b = TOTAL - a;
  const sq = a * a + b * b;

  const sqA = a * S;
  const sqB = b * S;
  const xA = 28;
  const xB = xA + TOTAL * S + 40;

  const absScale = BAR_W / TOTAL;
  const sqScale = BAR_W / (TOTAL * TOTAL);

  return (
    <div className={shared.wrapper} data-explorer="fit-abs-vs-square">
      <figure style={{margin: 0}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width: '100%', maxWidth: W, display: 'block', margin: '0 auto'}} role="img" aria-label="Dois quadrados de erro e duas barras de soma">
          {/* quadrados */}
          {a > 0 && (
            <rect x={xA} y={BASE - sqA} width={sqA} height={sqA} fill={tone(3)} fillOpacity={0.25} stroke={tone(3)} strokeWidth={1.5} />
          )}
          {b > 0 && (
            <rect x={xB} y={BASE - sqB} width={sqB} height={sqB} fill={tone(1)} fillOpacity={0.25} stroke={tone(1)} strokeWidth={1.5} />
          )}
          <line x1={xA - 10} x2={xB + TOTAL * S + 10} y1={BASE} y2={BASE} stroke="var(--mv-tone-0)" strokeWidth={1} />
          <SvgMath x={xA + (TOTAL * S) / 2} y={BASE + 16} math={`\\text{apartamento A erra } ${tnum(a)}`} tone={3} fontSize={13} />
          <SvgMath x={xB + (TOTAL * S) / 2} y={BASE + 16} math={`\\text{apartamento B erra } ${tnum(b)}`} tone={1} fontSize={13} />
          {a >= 10 && <SvgMath x={xA + sqA / 2} y={BASE - sqA / 2} math={tnum(a * a)} tone={3} fontSize={13} />}
          {b >= 10 && <SvgMath x={xB + sqB / 2} y={BASE - sqB / 2} math={tnum(b * b)} tone={1} fontSize={13} />}

          {/* barra dos valores absolutos */}
          <SvgMath x={BAR_LEFT} y={205} anchor="start" math={`\\text{sem sinal: } ${tnum(a)} + ${tnum(b)} = 40`} fontSize={13} />
          <rect x={BAR_LEFT} y={218} width={a * absScale} height={16} fill={tone(3)} fillOpacity={0.55} />
          <rect x={BAR_LEFT + a * absScale} y={218} width={b * absScale} height={16} fill={tone(1)} fillOpacity={0.55} />

          {/* barra dos quadrados */}
          <SvgMath x={BAR_LEFT} y={265} anchor="start" math={`\\text{quadrados: } ${tnum(a * a)} + ${tnum(b * b)} = ${tnum(sq)}`} fontSize={13} />
          <rect x={BAR_LEFT} y={278} width={a * a * sqScale} height={16} fill={tone(3)} fillOpacity={0.55} />
          <rect x={BAR_LEFT + a * a * sqScale} y={278} width={b * b * sqScale} height={16} fill={tone(1)} fillOpacity={0.55} />
          <line x1={BAR_LEFT + 800 * sqScale} x2={BAR_LEFT + 800 * sqScale} y1={276} y2={300} stroke="var(--mv-tone-0)" strokeDasharray="3 3" />
          <SvgMath x={BAR_LEFT + 800 * sqScale} y={312} math={'800'} fontSize={12} />
          <line x1={BAR_LEFT + BAR_W} x2={BAR_LEFT + BAR_W} y1={276} y2={300} stroke="var(--mv-tone-0)" strokeDasharray="3 3" />
          <SvgMath x={BAR_LEFT + BAR_W} y={312} math={'1\\,600'} fontSize={12} />
        </svg>
        <figcaption className={shared.caption}>
          {caption ??
            'Dois apartamentos dividem 40 mil de erro. Em cima, um quadrado sobre cada erro. Embaixo, a soma dos erros sem sinal (sempre 40) e a soma dos quadrados (o tracejado marca 800, o menor valor, e 1 600, o maior).'}
        </figcaption>
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Erro do apartamento A: <strong>{a}</strong> mil (o B erra {b} mil)
          </span>
          <input
            type="range"
            min={0}
            max={TOTAL}
            step={5}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            aria-label="Erro do apartamento A, em mil reais"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\lvert ${tnum(a)} \\rvert + \\lvert ${tnum(b)} \\rvert = 40 \\qquad ${tnum(a)}^2 + ${tnum(b)}^2 = ${tnum(sq)}`} />
        </p>
        <p>
          {a === 20
            ? 'Erros iguais, 20 e 20: a soma dos quadrados chega ao menor valor, 800. A soma sem sinal continua 40.'
            : a === 0 || a === 40
              ? `Um apartamento leva o erro inteiro: a soma dos quadrados vale ${pnum(sq)}, o dobro de quando os dois erram 20. A soma sem sinal não muda: 40.`
              : `A soma sem sinal continua 40. A dos quadrados vale ${pnum(sq)}, mais que os 800 dos erros iguais.`}
        </p>
      </div>
    </div>
  );
}
