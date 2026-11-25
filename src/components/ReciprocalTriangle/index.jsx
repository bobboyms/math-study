import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath} from '../mathviz/useAnimation';

// Dividir a relação fundamental por cos² (ou por sen²) é ampliar o triângulo.
//
// O triângulo do ciclo tem catetos cos θ (verde) e sen θ (laranja) e
// hipotenusa 1 (azul). A animação multiplica os três lados pelo mesmo número,
// com o vértice O parado:
//
// - modo 'cos': o número é 1/cos θ. O cateto verde vira 1, e o triângulo
//   encosta na reta x = 1 (a reta das tangentes da lição de redução): o
//   cateto laranja vira tg θ e a hipotenusa vira sec θ;
// - modo 'sen': o número é 1/sen θ. O cateto laranja vira 1, e o triângulo
//   encosta na reta y = 1: o cateto verde vira cotg θ e a hipotenusa vira
//   cossec θ.
//
// Quadro final: o triângulo ampliado, com o triângulo do ciclo tracejado por
// dentro. Pitágoras no triângulo grande é a identidade derivada.

const D = Math.PI / 180;
const S = 112; // pixels por unidade
const DURATION = 3;

const MODES = {
  cos: {min: 20, max: 65, xMax: 1, yMax: Math.tan(65 * D)},
  sen: {min: 25, max: 80, xMax: 1 / Math.tan(25 * D), yMax: 1},
};

export default function ReciprocalTriangle({
  mode = 'cos',
  initial = 50,
  caption,
}) {
  const cfg = MODES[mode];
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const k = ease((t - 0.5) / (DURATION - 0.8));
  const done = !playing && k > 0.99;

  const th = deg * D;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const factor = mode === 'cos' ? 1 / c : 1 / s;
  const f = 1 + k * (factor - 1);

  const padL = 80;
  const padR = mode === 'cos' ? 120 : 60;
  const padT = 40;
  const padB = 40;
  const W = Math.round(padL + Math.max(cfg.xMax, 1.05) * S + padR);
  const H = Math.round(padT + Math.max(cfg.yMax, 1.05) * S + padB);
  const ox = padL;
  const oy = H - padB;
  const X = (x) => ox + x * S;
  const Y = (y) => oy - y * S;

  // vértices: O, Q (pé no eixo), P (ponta)
  const qx = X(c * f);
  const px = X(c * f);
  const py = Y(s * f);
  const sq = 9;

  const g = (v) => mathNumber(v, 3);
  const eq = (v) => (Math.abs(v - Number(v.toFixed(3))) < 1e-9 ? '=' : '\\approx');

  const tg = s / c;
  const sec = 1 / c;
  const cotg = c / s;
  const cossec = 1 / s;

  const labels = mode === 'cos'
    ? {h: '1', v: '\\tg\\theta', hyp: '\\sec\\theta'}
    : {h: '\\cotg\\theta', v: '1', hyp: '\\cossec\\theta'};

  // normal à hipotenusa, apontando para cima e para a esquerda (fora do triângulo)
  const nx = -s;
  const ny = -c;

  const defaultCaption = mode === 'cos'
    ? 'Os três lados do triângulo do ciclo são multiplicados pelo mesmo número, 1/cos θ. O cateto verde vira 1, o triângulo encosta na reta x = 1, o laranja vira tg θ e a hipotenusa vira sec θ. O triângulo do ciclo fica tracejado por dentro.'
    : 'Os três lados do triângulo do ciclo são multiplicados pelo mesmo número, 1/sen θ. O cateto laranja vira 1, o triângulo encosta na reta y = 1, o verde vira cotg θ e a hipotenusa vira cossec θ. O triângulo do ciclo fica tracejado por dentro.';

  return (
    <div className={shared.wrapper} data-explorer="reciprocal-triangle">
      <figure ref={ref} className={geo.figure} style={{margin: 0}}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Triângulo do ciclo com giro de ${deg} graus, ampliado pelo fator ${g(factor)}.`}>
          {/* eixos */}
          <line x1={ox - 14} y1={oy} x2={W - 12} y2={oy} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          {/* quarto do ciclo */}
          <path d={arcPath(ox, oy, S, 0, Math.PI / 2)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.25} />
          {/* a reta x = 1 ou y = 1 */}
          {mode === 'cos' ? (
            <>
              <line x1={X(1)} y1={oy + 10} x2={X(1)} y2={12} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="5 4" />
              <SvgMath x={X(1) + 8} y={22} math="x = 1" anchor="start" fontSize={12} />
            </>
          ) : (
            <>
              <line x1={ox - 10} y1={Y(1)} x2={W - 14} y2={Y(1)} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="5 4" />
              <SvgMath x={W - 14} y={Y(1) - 13} math="y = 1" anchor="end" fontSize={12} />
            </>
          )}

          {/* triângulo do ciclo, tracejado, quando a ampliação já começou */}
          {k > 0.05 && (
            <polygon
              points={`${ox},${oy} ${X(c)},${oy} ${X(c)},${Y(s)}`}
              fill="none"
              stroke="var(--ifm-color-emphasis-600)"
              strokeWidth={1.25}
              strokeDasharray="4 3"
            />
          )}

          {/* triângulo que cresce */}
          <polygon points={`${ox},${oy} ${qx},${oy} ${px},${py}`} fill="var(--mv-tone-1)" fillOpacity={0.1} stroke="none" />
          <line x1={ox} y1={oy} x2={qx} y2={oy} stroke="var(--mv-tone-3)" strokeWidth={4} strokeLinecap="round" />
          <line x1={qx} y1={oy} x2={px} y2={py} stroke="var(--mv-tone-2)" strokeWidth={4} strokeLinecap="round" />
          <line x1={ox} y1={oy} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={3} strokeLinecap="round" />
          {/* ângulo reto em Q */}
          <path d={`M ${qx - sq} ${oy} L ${qx - sq} ${oy - sq} L ${qx} ${oy - sq}`} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
          {/* ângulo θ em O */}
          <path d={arcPath(ox, oy, 26, 0, th)} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <SvgMath x={ox + 40 * Math.cos(th / 2)} y={oy - 40 * Math.sin(th / 2)} math="\theta" fontSize={13} />
          <circle cx={ox} cy={oy} r={3.5} fill="var(--ifm-font-color-base)" />
          <SvgMath x={ox - 12} y={oy + 14} math="O" fontSize={13} />

          {/* rótulos: antes da ampliação, os do ciclo; no fim, os novos */}
          {k < 0.02 && (
            <>
              <SvgMath x={(ox + qx) / 2} y={oy + 16} math="\cos\theta" tone={3} fontSize={13} halo />
              <SvgMath x={px + 8} y={(oy + py) / 2} math="\sen\theta" anchor="start" tone={2} fontSize={13} halo />
              <SvgMath x={(ox + px) / 2 + 16 * nx} y={(oy + py) / 2 + 16 * ny} math="1" tone={1} fontSize={14} halo />
            </>
          )}
          {done && (
            <>
              <SvgMath x={(ox + qx) / 2} y={oy + 16} math={labels.h} tone={3} fontSize={13} halo />
              <SvgMath x={px + 8} y={oy + (py - oy) * (mode === 'sen' ? 0.78 : 0.5)} math={labels.v} anchor="start" tone={2} fontSize={13} halo />
              <SvgMath x={ox + (px - ox) * 0.6 + 14 * nx} y={oy + (py - oy) * 0.6 + 14 * ny} math={labels.hyp} anchor="end" tone={1} fontSize={14} halo />
            </>
          )}
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <div className={shared.formula}>
          <Formula
            math={mode === 'cos'
              ? `\\theta = ${deg}^\\circ \\qquad \\text{fator} = \\frac{1}{\\cos\\theta} ${eq(sec)} ${g(sec)}`
              : `\\theta = ${deg}^\\circ \\qquad \\text{fator} = \\frac{1}{\\sen\\theta} ${eq(cossec)} ${g(cossec)}`}
          />
        </div>
        {(mode === 'cos'
          ? ['\\cos\\theta \\to 1', `\\sen\\theta ${eq(s)} ${g(s)} \\to \\tg\\theta ${eq(tg)} ${g(tg)}`, `1 \\to \\sec\\theta ${eq(sec)} ${g(sec)}`]
          : ['\\sen\\theta \\to 1', `\\cos\\theta ${eq(c)} ${g(c)} \\to \\cotg\\theta ${eq(cotg)} ${g(cotg)}`, `1 \\to \\cossec\\theta ${eq(cossec)} ${g(cossec)}`]
        ).map((m) => (
          <div key={m} className={shared.formula}>
            <Formula math={m} />
          </div>
        ))}
        {(mode === 'cos'
          ? [`1^2 + \\tg^2\\theta \\approx ${g(1 + tg * tg)}`, `\\sec^2\\theta \\approx ${g(sec * sec)}`]
          : [`\\cotg^2\\theta + 1^2 \\approx ${g(1 + cotg * cotg)}`, `\\cossec^2\\theta \\approx ${g(cossec * cossec)}`]
        ).map((m) => (
          <div key={m} className={shared.formula}>
            <Formula math={m} />
          </div>
        ))}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro: {deg}°</span>
          <input
            type="range"
            min={cfg.min}
            max={cfg.max}
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
        <button type="button" onClick={() => play()}>
          Ampliar de novo
        </button>
      </div>
    </div>
  );
}
