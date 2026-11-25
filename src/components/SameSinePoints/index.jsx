import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';

// Um valor do seno, dois pontos do ciclo.
//
// A reta horizontal na altura s (laranja) corta o ciclo em dois pontos, um de
// cada lado do eixo vertical. Os dois têm o mesmo seno, s, e cossenos de mesmo
// tamanho e sinais contrários (segmentos verdes, do eixo vertical até cada
// ponto). A relação fundamental entrega esse tamanho, √(1 − s²); o lado do
// eixo, isto é, o quadrante, entrega o sinal.

const W = 360;
const H = 300;
const CX = 165; // à esquerda do meio: o rótulo da reta fica à direita do ciclo
const CY = 150;
const R = 110;

const QUAD = [
  {q: 'I', x: 1, y: 1},
  {q: 'II', x: -1, y: 1},
  {q: 'III', x: -1, y: -1},
  {q: 'IV', x: 1, y: -1},
];

export default function SameSinePoints({
  initial = 0.28,
  caption = 'Arraste a altura. A reta laranja corta o ciclo em dois pontos com o mesmo seno. Os segmentos verdes mostram que os cossenos têm o mesmo tamanho e sinais contrários.',
}) {
  const [sv, setSv] = useState(initial);
  const s = sv;
  const c = Math.sqrt(Math.max(0, 1 - s * s));
  const one = c < 1e-9;
  const y = CY - R * s;
  const xr = CX + R * c;
  const xl = CX - R * c;
  const exact = (v) => Math.abs(v - Number(v.toFixed(3))) < 1e-9;
  const cTex = mathNumber(c, 3);
  const quadR = s > 0 ? 'I' : s < 0 ? 'IV' : null;
  const quadL = s > 0 ? 'II' : s < 0 ? 'III' : null;
  const sTex = mathNumber(s, 2);

  return (
    <div className={shared.wrapper} data-explorer="same-sine">
      <figure className={geo.figure} style={{margin: 0}}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Reta horizontal na altura ${sTex} cortando o ciclo em dois pontos, de cossenos ${cTex} e menos ${cTex}.`}>
          <line x1={14} y1={CY} x2={284} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <line x1={CX} y1={H - 12} x2={CX} y2={12} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.75} />
          {QUAD.map(({q, x, y: qy}) => (
            <SvgMath key={q} x={CX + x * 128} y={CY - qy * 128} math={`\\text{${q}}`} fontSize={13} tone={0} />
          ))}
          {/* a reta da altura s */}
          <line x1={30} y1={y} x2={282} y2={y} stroke="var(--mv-tone-2)" strokeWidth={1.5} strokeDasharray="6 4" />
          <SvgMath x={W - 6} y={y} math={`y = ${sTex}`} anchor="end" tone={2} fontSize={13} />
          {/* cossenos: do eixo vertical até cada ponto */}
          {!one && (
            <>
              <line x1={CX} y1={y} x2={xr} y2={y} stroke="var(--mv-tone-3)" strokeWidth={4} strokeLinecap="round" />
              <line x1={CX} y1={y} x2={xl} y2={y} stroke="var(--mv-tone-3)" strokeWidth={4} strokeLinecap="round" />
              {R * c >= 34 ? (
                <>
                  <SvgMath x={(CX + xr) / 2} y={y + (s >= 0 ? 15 : -15)} math={`+${cTex}`} tone={3} fontSize={13} halo />
                  <SvgMath x={(CX + xl) / 2} y={y + (s >= 0 ? 15 : -15)} math={`-${cTex}`} tone={3} fontSize={13} halo />
                </>
              ) : (
                <>
                  <SvgMath x={xr + 10} y={y + (s >= 0 ? 15 : -15)} math={`+${cTex}`} anchor="start" tone={3} fontSize={13} halo />
                  <SvgMath x={xl - 10} y={y + (s >= 0 ? 15 : -15)} math={`-${cTex}`} anchor="end" tone={3} fontSize={13} halo />
                </>
              )}
            </>
          )}
          <circle cx={xr} cy={y} r={5} fill="var(--ifm-font-color-base)" />
          {!one && <circle cx={xl} cy={y} r={5} fill="var(--ifm-font-color-base)" />}
          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <div className={shared.formula}>
          <Formula math={`\\cos^2\\theta = 1 - (${sTex})^2 ${exact(c * c) ? '=' : '\\approx'} ${mathNumber(c * c, 4)}`} />
        </div>
        {one ? (
          <p>
            A reta só encosta no ciclo, num ponto só. Ali o cosseno é 0, e não há sinal para escolher.
          </p>
        ) : (
          <>
            <div className={shared.formula}>
              <Formula math={`\\cos\\theta ${exact(c) ? '=' : '\\approx'} +${cTex} \\quad\\text{ou}\\quad \\cos\\theta ${exact(c) ? '=' : '\\approx'} -${cTex}`} />
            </div>
            <p>
              {quadR
                ? `Ponto da direita (quadrante ${quadR}): cosseno positivo. Ponto da esquerda (quadrante ${quadL}): cosseno negativo.`
                : 'Os dois pontos estão sobre o eixo horizontal: o da direita tem cosseno 1, o da esquerda, −1.'}
            </p>
          </>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Seno (altura da reta): {sTex.replace('{,}', ',').replace('-', '−')}</span>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.02}
            value={sv}
            onChange={(event) => setSv(Number(event.target.value))}
            aria-label="Valor do seno"
            aria-valuetext={sTex.replace('{,}', ',')}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {[0.28, 0.6, -0.6, 1].map((p) => (
          <button key={p} type="button" onClick={() => setSv(p)}>
            {String(p).replace('.', ',').replace('-', '−')}
          </button>
        ))}
      </div>
    </div>
  );
}
