import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {arcPath, onCircle} from '../mathviz/useAnimation';
import {makeFrame} from '../WaveTracer/frame';
import {curvePath, num, rel, TAU} from '../WaveTracer/wave';

// Girar θ para a frente e θ para trás. No círculo, os dois pontos são
// espelhos no eixo horizontal: mesma abscissa, alturas opostas. No gráfico
// (mesma escala vertical), isso vira a simetria da curva:
//   seno: (θ, sen θ) e (−θ, −sen θ), simétricos pela origem (função ímpar);
//   cosseno: (θ, cos θ) e (−θ, cos θ), simétricos pelo eixo vertical (par).

const R = 56;
const CW = 2 * R + 46; // largura da parte do círculo

export default function WaveSymmetry({fn = 'sin', initial = 50, caption}) {
  const [deg, setDeg] = useState(initial);
  const th = (deg * Math.PI) / 180;
  const isSin = fn === 'sin';
  const f = isSin ? Math.sin : Math.cos;
  const tone = isSin ? 2 : 3;
  const name = isSin ? '\\sen' : '\\cos';
  const fr = makeFrame({xMin: -TAU - 0.2, xMax: TAU + 0.2, yMin: -1.4, yMax: 1.4, G: 27, K: R, top: 16, left: 26, yName: `${name} x`, labelZero: false});
  const {gx, gy, W, H} = fr;
  const CX = 18 + R;
  const CY = gy(0);
  const [px, py] = onCircle(CX, CY, R, th);
  const [qx, qy] = onCircle(CX, CY, R, -th);
  const a = [gx(th), gy(f(th))];
  const b = [gx(-th), gy(f(-th))];
  const val = f(th);
  const small = deg > 0 && deg < 360;

  return (
    <div className={shared.wrapper} data-explorer="wave-symmetry">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${CW + W} ${H}`} style={{maxWidth: `${CW + W}px`}} role="img"
          aria-label={`Giro de ${deg} graus e de menos ${deg} graus, no círculo e no gráfico.`}>
          {/* círculo */}
          <line x1={CX - R - 10} y1={CY} x2={CX + R + 10} y2={CY} stroke="var(--mv-guide)" strokeWidth={1.25} />
          <line x1={CX} y1={CY - R - 10} x2={CX} y2={CY + R + 10} stroke="var(--mv-guide)" strokeWidth={1.25} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2} />
          {small && <path d={arcPath(CX, CY, 16, 0, th % TAU)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.75} />}
          {small && <path d={arcPath(CX, CY, 22, -(th % TAU), 0)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.75} strokeDasharray="3 3" />}
          <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={2.25} />
          <line x1={CX} y1={CY} x2={qx} y2={qy} stroke="var(--mv-tone-1)" strokeWidth={2.25} strokeDasharray="5 3" />
          {isSin ? (
            <>
              <line x1={px} y1={CY} x2={px} y2={py} stroke={`var(--mv-tone-${tone})`} strokeWidth={4} strokeLinecap="round" />
              <line x1={qx} y1={CY} x2={qx} y2={qy} stroke={`var(--mv-tone-${tone})`} strokeWidth={4} strokeLinecap="round" strokeOpacity={0.6} />
            </>
          ) : (
            <line x1={CX} y1={CY} x2={px} y2={CY} stroke={`var(--mv-tone-${tone})`} strokeWidth={4} strokeLinecap="round" />
          )}
          <line x1={px} y1={py} x2={qx} y2={qy} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="2 3" />
          <circle cx={px} cy={py} r={4.5} fill="var(--mv-tone-1)" />
          <circle cx={qx} cy={qy} r={4.5} fill="var(--mv-paper)" stroke="var(--mv-tone-1)" strokeWidth={2} />
          {small && Math.abs(Math.sin(th)) > 0.15 && (
            <>
              <SvgMath x={px + (Math.cos(th) >= 0 ? 9 : -9)} y={py + (Math.sin(th) > 0 ? -10 : 10)} math="\theta" anchor={Math.cos(th) >= 0 ? 'start' : 'end'} tone={1} fontSize={12} halo />
              <SvgMath x={qx + (Math.cos(th) >= 0 ? 9 : -9)} y={qy + (Math.sin(th) > 0 ? 10 : -10)} math="-\theta" anchor={Math.cos(th) >= 0 ? 'start' : 'end'} tone={1} fontSize={12} halo />
            </>
          )}

          {/* gráfico */}
          <g transform={`translate(${CW}, 0)`}>
            {fr.axes}
            <path d={curvePath(f, -TAU - 0.2, TAU + 0.2, gx, gy)} fill="none" stroke={`var(--mv-tone-${tone})`} strokeWidth={2.5} />
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--mv-tone-1)" strokeWidth={1.25} strokeDasharray="4 4" />
            {isSin && <circle cx={gx(0)} cy={gy(0)} r={3} fill="var(--mv-tone-1)" />}
            <line x1={a[0]} y1={gy(0)} x2={a[0]} y2={a[1]} stroke={`var(--mv-tone-${tone})`} strokeWidth={3} />
            <line x1={b[0]} y1={gy(0)} x2={b[0]} y2={b[1]} stroke={`var(--mv-tone-${tone})`} strokeWidth={3} strokeOpacity={0.6} />
            <circle cx={a[0]} cy={a[1]} r={5} fill="var(--mv-tone-1)" stroke="var(--mv-paper)" strokeWidth={1.5} />
            <circle cx={b[0]} cy={b[1]} r={5} fill="var(--mv-paper)" stroke="var(--mv-tone-1)" strokeWidth={2} />
          </g>
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? (isSin
            ? 'Girar θ para trás (tracejado) espelha o ponto no eixo horizontal: a altura troca de sinal. No gráfico, os pontos de θ e de −θ ficam em lados opostos da origem, à mesma distância dela.'
            : 'Girar θ para trás (tracejado) espelha o ponto no eixo horizontal, e a abscissa não muda. No gráfico, os pontos de θ e de −θ ficam à mesma altura, espelhados no eixo vertical.')}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math={`${name}\\,${deg}^\\circ ${rel(val)} ${num(val)}`} /> e{' '}
          <Formula math={`${name}(-${deg}^\\circ) ${rel(val)} ${num(isSin ? -val : val)}`} />
          {isSin
            ? '. Os dois valores são opostos: mesmo tamanho, sinal trocado.'
            : '. Os dois valores são iguais.'}
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro θ: {deg}° (e o giro para trás, −{deg}°)</span>
          <input type="range" min={0} max={360} step={5} value={deg}
            onChange={(e) => setDeg(Number(e.target.value))}
            aria-label="Giro em graus" aria-valuetext={`${deg} graus`} />
        </label>
      </div>
    </div>
  );
}
