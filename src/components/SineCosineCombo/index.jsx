import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {arcPath} from '../mathviz/useAnimation';
import {makeFrame} from '../WaveTracer/frame';
import {curvePath, num} from '../WaveTracer/wave';

// A sen x + B cos x é uma única onda R sen(x + φ).
//
// Esquerda: o ponto (A, B) no plano. A distância até a origem é
// R = √(A² + B²) e o ângulo com o eixo x é φ, porque R cos φ = A e
// R sen φ = B.
// Direita: A sen x e B cos x em cinza (tracejado e pontilhado), a soma em
// laranja e a onda R sen(x + φ) em azul tracejado por cima. As duas coincidem
// para qualquer A e B. O pico da soma vale R, e não A + B.

const S = 30; // pixels por unidade no plano da esquerda
const PMIN = -0.6;
const PMAX = 5.7;
const PW = Math.round((PMAX - PMIN) * S + 16);
const PX = (x) => 8 + (x - PMIN) * S;
const PY = (y) => 8 + (PMAX - y) * S;

export default function SineCosineCombo({A: A0 = 3, B: B0 = 4}) {
  const [A, setA] = useState(A0);
  const [B, setB] = useState(B0);
  const R = Math.hypot(A, B);
  const phi = Math.atan2(B, A);
  const phiDeg = (phi * 180) / Math.PI;
  const X0 = -0.35;
  const X1 = 2 * Math.PI + 0.25;
  const fr = makeFrame({xMin: X0, xMax: X1, yMin: -7.6, yMax: 7.6, G: 40, K: 16, yTicks: [-5, 5], top: 14});
  const {gx, gy} = fr;
  const peakX = Math.PI / 2 - phi;
  const zero = R < 1e-9;
  const n = (v, d = 2) => num(v, d);

  return (
    <div className={shared.wrapper} data-explorer="sine-cosine-combo">
      <div className={shared.plots}>
        <figure className={geo.figure}>
          <svg className={geo.svg} viewBox={`0 0 ${PW} ${PW}`} style={{maxWidth: `${PW}px`}} role="img"
            aria-label={`O ponto (${A}, ${B}) a distância ${n(R)} da origem.`}>
            <line x1={PX(PMIN)} y1={PY(0)} x2={PX(PMAX)} y2={PY(0)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
            <line x1={PX(0)} y1={PY(PMIN)} x2={PX(0)} y2={PY(PMAX)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
            {[1, 2, 3, 4, 5].map((v) => (
              <g key={v}>
                <line x1={PX(v)} y1={PY(0) - 3} x2={PX(v)} y2={PY(0) + 3} stroke="var(--ifm-color-emphasis-700)" />
                <line x1={PX(0) - 3} y1={PY(v)} x2={PX(0) + 3} y2={PY(v)} stroke="var(--ifm-color-emphasis-700)" />
              </g>
            ))}
            <SvgMath x={PX(5)} y={PY(0) + 14} math="5" fontSize={11} />
            <SvgMath x={PX(0) - 8} y={PY(5)} math="5" anchor="end" fontSize={11} space={20} />
            {!zero && (
              <g>
                <line x1={PX(A)} y1={PY(0)} x2={PX(A)} y2={PY(B)} stroke="var(--mv-guide)" strokeDasharray="3 3" />
                <line x1={PX(0)} y1={PY(B)} x2={PX(A)} y2={PY(B)} stroke="var(--mv-guide)" strokeDasharray="3 3" />
                <line x1={PX(0)} y1={PY(0)} x2={PX(A)} y2={PY(B)} stroke="var(--mv-tone-1)" strokeWidth={3} />
                <circle cx={PX(A)} cy={PY(B)} r={4.5} fill="var(--mv-tone-1)" />
                <path d={arcPath(PX(0), PY(0), 24, 0, phi)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
                {phiDeg > 12 && phiDeg < 80 && (
                  <SvgMath x={PX(0) + 36 * Math.cos(phi / 2)} y={PY(0) - 36 * Math.sin(phi / 2)} math="\varphi" fontSize={13} halo />
                )}
                <SvgMath x={(PX(0) + PX(A)) / 2 - 18 * Math.sin(phi)} y={(PY(0) + PY(B)) / 2 - 18 * Math.cos(phi)} math="R" tone={1} fontSize={14} halo />
                {A > 0 && <SvgMath x={PX(A)} y={PY(0) + 14} math="A" fontSize={12} halo />}
                {B > 0 && <SvgMath x={PX(0) - 8} y={PY(B)} math="B" anchor="end" fontSize={12} space={20} halo />}
              </g>
            )}
          </svg>
          <figcaption className={geo.caption}>O ponto (A, B): a distância até a origem é R, e o ângulo com o eixo horizontal é φ.</figcaption>
        </figure>
        <figure className={geo.figure}>
          <svg className={geo.svg} viewBox={`0 0 ${fr.W} ${fr.H}`} style={{maxWidth: `${fr.W}px`}} role="img"
            aria-label="Gráfico da soma A sen x + B cos x e da onda R sen(x + φ), que coincidem.">
            {fr.axes}
            <path d={curvePath((x) => A * Math.sin(x), X0, X1, gx, gy)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="6 4" />
            <path d={curvePath((x) => B * Math.cos(x), X0, X1, gx, gy)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="1.5 3" />
            <path d={curvePath((x) => A * Math.sin(x) + B * Math.cos(x), X0, X1, gx, gy)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={4} />
            <path d={curvePath((x) => R * Math.sin(x + phi), X0, X1, gx, gy)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={2} strokeDasharray="7 5" />
            {!zero && (
              <g>
                <line x1={gx(peakX)} y1={gy(0)} x2={gx(peakX)} y2={gy(R)} stroke="var(--mv-tone-1)" strokeWidth={1} strokeDasharray="2 3" />
                <circle cx={gx(peakX)} cy={gy(R)} r={4} fill="var(--mv-tone-1)" />
                <SvgMath x={gx(peakX) + 8} y={gy(R) - 10} math={`R ${Number.isInteger(R) ? '=' : '\\approx'} ${n(R)}`} anchor="start" tone={1} fontSize={12} halo space={90} />
              </g>
            )}
          </svg>
          <figcaption className={geo.caption}>Cinza tracejado: A sen x. Cinza pontilhado: B cos x. Laranja: a soma das duas. Azul tracejado: R sen(x + φ).</figcaption>
        </figure>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {zero ? (
          <p>Com A = 0 e B = 0 não há onda: a soma vale zero em todo x.</p>
        ) : (
          <>
            <div className={shared.formula}>
              <Formula math={`R = \\sqrt{A^2 + B^2} = \\sqrt{${n(A, 1)}^2 + ${n(B, 1)}^2} ${Number.isInteger(R) ? '=' : '\\approx'} ${n(R)}`} />
            </div>
            <p>
              {A === 0
                ? <>Com <Formula math="A = 0" />, o ponto está no eixo vertical: <Formula math="\varphi = 90^\circ" />, e a onda é o próprio cosseno multiplicado por <Formula math="B" />.</>
                : <>Ângulo: <Formula math={`\\tg\\varphi = \\frac{B}{A} = \\frac{${n(B, 1)}}{${n(A, 1)}}`} />, então <Formula math={`\\varphi \\approx ${n(phiDeg)}^\\circ`} /> (ou <Formula math={`${n(phi, 3)}`} /> rad).</>}
            </p>
            <p>
              A curva laranja e a azul tracejada coincidem em todo <Formula math="x" />. O pico vale{' '}
              <Formula math={`R ${Number.isInteger(R) ? '=' : '\\approx'} ${n(R)}`} />{A > 0 && B > 0 ? <>, menos que <Formula math={`A + B = ${n(A + B, 1)}`} />: os dois picos cinzas não acontecem no mesmo <Formula math="x" /></> : null}.
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>A (quanto de seno): {String(A).replace('.', ',')}</span>
          <input type="range" min={0} max={5} step={0.5} value={A} onChange={(e) => setA(Number(e.target.value))} aria-label="Coeficiente A do seno" />
        </label>
        <label className={shared.control}>
          <span>B (quanto de cosseno): {String(B).replace('.', ',')}</span>
          <input type="range" min={0} max={5} step={0.5} value={B} onChange={(e) => setB(Number(e.target.value))} aria-label="Coeficiente B do cosseno" />
        </label>
      </div>
    </div>
  );
}
