import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath, onCircle} from '../mathviz/useAnimation';

// Ângulo de referência: todo ponto do ciclo é o espelho de um ponto do
// primeiro quadrante.
//
// O ponto P do giro θ sai no tom 1. O ponto do primeiro quadrante com a mesma
// abertura até o eixo horizontal (o ângulo de referência α) sai no tom 2, com
// o raio tracejado. Os dois arcos de α, um junto de P e outro junto do ponto
// do primeiro quadrante, têm o mesmo tamanho: é a observação que a lição pede.
//
// O tracejado entre os dois pontos é o espelho: horizontal no segundo
// quadrante (mesma altura), vertical no quarto (mesma posição horizontal) e
// passando pelo centro no terceiro (lado oposto).
//
// A animação leva um ponto do primeiro quadrante até P por esse tracejado. Ela
// roda quando a figura entra na tela e no botão "Ver o espelho".

const W = 380;
const H = 330;
const CX = 190;
const CY = 165;
const R = 118;
const DURATION = 1.8;
const D = Math.PI / 180;

const QUAD_NAME = ['', 'primeiro', 'segundo', 'terceiro', 'quarto'];
const QUAD_PLACE = ['', 'à direita e acima', 'à esquerda e acima', 'à esquerda e abaixo', 'à direita e abaixo'];

function analyse(deg) {
  const d = ((deg % 360) + 360) % 360;
  if (d % 90 === 0) return {axis: true, d};
  if (d < 90) return {q: 1, d, alpha: d, formula: `\\alpha = \\theta = ${d}^\\circ`, sSin: 1, sCos: 1};
  if (d < 180) return {q: 2, d, alpha: 180 - d, formula: `\\alpha = 180^\\circ - ${d}^\\circ = ${180 - d}^\\circ`, sSin: 1, sCos: -1};
  if (d < 270) return {q: 3, d, alpha: d - 180, formula: `\\alpha = ${d}^\\circ - 180^\\circ = ${d - 180}^\\circ`, sSin: -1, sCos: -1};
  return {q: 4, d, alpha: 360 - d, formula: `\\alpha = 360^\\circ - ${d}^\\circ = ${360 - d}^\\circ`, sSin: -1, sCos: 1};
}

const rel = (v) => (Math.abs(v - Number(v.toFixed(3))) < 1e-9 ? '=' : '\\approx');
const tidy = (v) => (Math.abs(v) < 1e-9 ? 0 : v);

export default function ReferenceAngle({
  initial = 150,
  presets = [30, 150, 210, 330],
  caption = 'O ponto P do giro (azul) e o ponto do primeiro quadrante com a mesma abertura até o eixo horizontal (laranja). O tracejado entre eles é o espelho.',
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const info = analyse(deg);
  const th = deg * D;
  const [px, py] = onCircle(CX, CY, R, th);

  let gx = px;
  let gy = py;
  let mx = px;
  let my = py;
  if (!info.axis) {
    [gx, gy] = onCircle(CX, CY, R, info.alpha * D);
    const k = playing ? ease(t / DURATION) : 1;
    mx = gx + (px - gx) * k;
    my = gy + (py - gy) * k;
  }
  const showGhost = !info.axis && info.q !== 1;

  // arco de α junto de P, entre o raio e a metade do eixo horizontal mais próxima
  let refArc = null;
  if (!info.axis) {
    const a = info.alpha * D;
    const spans = {
      1: [0, a],
      2: [Math.PI - a, Math.PI],
      3: [Math.PI, Math.PI + a],
      4: [2 * Math.PI - a, 2 * Math.PI],
    };
    const [a0, a1] = spans[info.q];
    const [lx, ly] = onCircle(CX, CY, 58, (a0 + a1) / 2);
    refArc = {d: arcPath(CX, CY, 40, a0, a1), lx, ly};
  }
  const [glx, gly] = onCircle(CX, CY, 58, (info.alpha * D) / 2);

  const sin = Math.sin(th);
  const cos = Math.cos(th);
  const aRad = (info.alpha ?? 0) * D;
  const sinA = Math.sin(aRad);
  const cosA = Math.cos(aRad);
  const sign = (s) => (s < 0 ? '-' : '');

  return (
    <div className={shared.wrapper} data-explorer="reference-angle">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Ciclo trigonométrico com o giro de ${deg} graus${info.axis ? '' : ` e ângulo de referência de ${info.alpha} graus`}.`}
        >
          <line x1={CX - R - 30} y1={CY} x2={CX + R + 30} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
          <line x1={CX} y1={CY - R - 24} x2={CX} y2={CY + R + 24} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2} />

          {/* o espelho: tracejado entre o ponto do 1º quadrante e P */}
          {showGhost && (
            <line x1={gx} y1={gy} x2={px} y2={py} stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="5 4" />
          )}

          {/* ponto do primeiro quadrante com a mesma abertura */}
          {showGhost && (
            <>
              <line x1={CX} y1={CY} x2={gx} y2={gy} stroke="var(--mv-tone-2)" strokeWidth={2} strokeDasharray="6 4" />
              <path d={arcPath(CX, CY, 40, 0, info.alpha * D)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2} />
              {info.alpha >= 12 && <SvgMath x={glx} y={gly} math="\alpha" tone={2} fontSize={14} halo />}
              <circle cx={gx} cy={gy} r={5} fill="var(--mv-paper)" stroke="var(--mv-tone-2)" strokeWidth={2} />
            </>
          )}

          {/* o giro θ */}
          {th > 0.02 && (
            <path d={arcPath(CX, CY, 20, 0, th)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.5} />
          )}
          <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={2.5} strokeLinecap="round" />
          {refArc && (
            <>
              <path d={refArc.d} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2.5} />
              {info.alpha >= 12 && (info.q !== 1) && (
                <SvgMath x={refArc.lx} y={refArc.ly} math="\alpha" tone={2} fontSize={14} halo />
              )}
              {info.q === 1 && info.alpha >= 12 && (
                <SvgMath x={glx} y={gly} math="\alpha = \theta" tone={2} fontSize={13} halo />
              )}
            </>
          )}

          {/* ponto em movimento (durante a animação) e P */}
          {playing && showGhost && <circle cx={mx} cy={my} r={6} fill="var(--mv-tone-1)" opacity={0.6} />}
          {(!playing || !showGhost) && <circle cx={px} cy={py} r={6} fill="var(--mv-tone-1)" />}
          {/* Rótulo para fora do círculo e para o lado de fora do ponto, para não
              cobrir o próprio ponto nem o raio. */}
          <SvgMath
            x={px + (Math.cos(th) >= 0 ? 12 : -12)}
            y={py + (Math.sin(th) >= 0 ? -16 : 16)}
            math={`P\\ (${deg}^\\circ)`}
            anchor={Math.cos(th) >= 0 ? 'start' : 'end'}
            space={Math.cos(th) >= 0 ? W - px - 14 : px - 14}
            tone={1}
            fontSize={13}
            halo
          />
          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {info.axis ? (
          <p>
            Em <strong>{deg}°</strong> o ponto está sobre um eixo, e não dentro de um quadrante. Os
            valores se leem direto no desenho:{' '}
            <Formula math={`\\cos ${deg}^\\circ = ${mathNumber(tidy(cos))},\\ \\sen ${deg}^\\circ = ${mathNumber(tidy(sin))}`} />.
          </p>
        ) : (
          <>
            <p>
              <strong>{deg}°</strong> está no {QUAD_NAME[info.q]} quadrante: P fica {QUAD_PLACE[info.q]}.{' '}
              {info.q === 1 ? 'A referência é o próprio giro: ' : 'Ângulo de referência: '}
              <Formula math={info.formula} />.
            </p>
            <p>
              <Formula
                math={`\\sen ${deg}^\\circ = ${sign(info.sSin)}\\sen ${info.alpha}^\\circ ${rel(sin)} ${mathNumber(tidy(sin))}`}
              />
              {' e '}
              <Formula
                math={`\\cos ${deg}^\\circ = ${sign(info.sCos)}\\cos ${info.alpha}^\\circ ${rel(cos)} ${mathNumber(tidy(cos))}`}
              />
              . Os números vêm de{' '}
              <Formula math={`\\sen ${info.alpha}^\\circ ${rel(sinA)} ${mathNumber(sinA)}`} /> e de{' '}
              <Formula math={`\\cos ${info.alpha}^\\circ ${rel(cosA)} ${mathNumber(cosA)}`} />; o sinal vem do
              quadrante.
            </p>
          </>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro θ: {deg}°</span>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            disabled={playing}
            aria-label="Giro em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {presets.map((p) => (
          <button key={p} type="button" onClick={() => setDeg(p)} disabled={playing}>
            {p}°
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={!showGhost}>
          Ver o espelho
        </button>
      </div>
    </div>
  );
}
