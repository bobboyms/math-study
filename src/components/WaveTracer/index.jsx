import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath, onCircle} from '../mathviz/useAnimation';
import {halfPiLabel, curvePath, rel, num, paren, turnText} from './wave';

// O ciclo desenrolado: o círculo à esquerda, o gráfico à direita, com a MESMA
// escala vertical. O ponto P gira; a coordenada escolhida (seno: altura de P;
// cosseno: abscissa de P) é levada até o gráfico, cuja entrada é o giro já
// percorrido. Enquanto P gira, a curva vai sendo traçada.
//
// Modo seno: o segmento laranja vertical em P (o seno) é transportado por uma
// linha horizontal até o gráfico. Modo cosseno: o segmento verde horizontal
// (o cosseno) primeiro "fica em pé" (gira um quarto de volta em torno do
// centro, arco pontilhado) e só então é transportado.
//
// Com `wheel`, o círculo é uma roda-gigante: raio `amp` (m), centro a `mid`
// do chão, raios e cadeirinha. `dots` marca no gráfico os giros anotados
// (em graus), cada um aparecendo quando a roda passa por ele. Com
// `showCurve={false}` só os pontos aparecem: é a pergunta do motivador.
//
// Na primeira vez que aparece na tela, o giro anda de 0 até `initial`.

const TONE = {sin: 2, cos: 3};

export default function WaveTracer({
  fn = 'sin',
  amp = 1,
  mid = 0,
  rpx = 62,
  gu,
  turns = 1,
  initial = 360,
  duration = 4,
  step = 5,
  presets = [90, 180, 270, 360],
  xAxis = 'rad',
  yTicks,
  yLabel,
  dots = [],
  showCurve = true,
  ghost = false,
  wheel = false,
  showFormula = false,
  unit = '',
  caption,
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration});
  const shown = playing ? Math.round(ease(t / duration) * deg) : deg;
  const tone = TONE[fn];
  const f = fn === 'sin' ? Math.sin : Math.cos;
  const value = (th) => mid + amp * f(th);

  // ---- geometria do desenho (pixels) ----
  const k = rpx / amp; // pixels por unidade vertical
  const G = gu ?? rpx; // pixels por radiano no gráfico
  const lowVal = Math.min(0, mid - amp);
  const top = 30;
  const CY = top + rpx + (wheel ? 0 : 6);
  const py = (v) => CY - (v - mid) * k;
  const bottom = py(lowVal) + (xAxis === 'deg' || !wheel ? 30 : 28);
  const CX = 22 + rpx;
  const GX0 = CX + rpx + (wheel ? 46 : 40);
  const maxTh = turns * 2 * Math.PI;
  const gx = (th) => GX0 + th * G;
  const W = Math.ceil(gx(maxTh) + 34);
  const H = Math.ceil(bottom);

  const th = (shown * Math.PI) / 180;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const [px, pyP] = onCircle(CX, CY, rpx, th);
  const v = value(th);
  const qx = gx(th);
  const qy = py(v);
  const mod = ((shown % 360) + 360) % 360;
  const thMod = (mod * Math.PI) / 180;
  const [lx, ly] = onCircle(CX, CY, wheel ? 34 : 26, thMod / 2);
  const axisY = py(0);

  const ticksY = yTicks ?? [-1, 1];
  const yName = yLabel ?? (fn === 'sin' ? '\\sen\\theta' : '\\cos\\theta');

  // marcas do eixo horizontal
  const xTicks = [];
  if (xAxis === 'rad') {
    const every = G * (Math.PI / 2) >= 34 ? 1 : 2;
    for (let i = every; i <= 4 * turns; i += every) {
      xTicks.push({at: (i * Math.PI) / 2, label: halfPiLabel(i)});
    }
  } else {
    const every = G * (Math.PI / 2) >= 40 ? 90 : 180;
    for (let d = every; d <= 360 * turns; d += every) {
      xTicks.push({at: (d * Math.PI) / 180, label: `${d}^\\circ`});
    }
  }

  // modo cosseno: o segmento horizontal fica em pé no eixo vertical
  const cosStandY = CY - c * rpx;

  const traced = showCurve && th > 0
    ? curvePath(value, 0, Math.min(th, maxTh), gx, py)
    : '';

  const ariaValue = fn === 'sin' ? 'altura' : 'abscissa';
  const defaultCaption = wheel
    ? 'A roda gira; cada giro anotado vira um ponto do gráfico: o giro na horizontal, a altura da cadeirinha na vertical.'
    : fn === 'sin'
      ? 'P gira no círculo de raio 1. A altura de P (segmento laranja) é levada por uma linha horizontal até o gráfico, na entrada igual ao giro já percorrido.'
      : 'A abscissa de P (segmento verde) fica em pé, girando um quarto de volta em torno do centro, e é levada até o gráfico, na entrada igual ao giro já percorrido.';

  return (
    <div className={shared.wrapper} data-explorer="wave-tracer">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Giro de ${shown} graus; a ${ariaValue} do ponto vale ${num(v, 2)} e é marcada no gráfico.`}
        >
          {/* chão (roda) ou eixo horizontal do círculo, prolongado até o gráfico */}
          {wheel ? (
            <>
              <line x1={8} y1={axisY} x2={W - 10} y2={axisY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={2} />
              <path
                d={`M ${CX - 0.45 * rpx} ${axisY} L ${CX} ${CY} L ${CX + 0.45 * rpx} ${axisY}`}
                fill="none" stroke="var(--mv-guide)" strokeWidth={4} strokeLinejoin="round"
              />
              <line x1={CX - rpx - 8} y1={CY} x2={gx(maxTh) + 6} y2={CY} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="5 4" />
              <SvgMath x={gx(maxTh) + 8} y={CY - 12} math="\text{centro}" anchor="end" fontSize={11} space={80} />
            </>
          ) : (
            <>
              <line x1={CX - rpx - 10} y1={CY} x2={CX + rpx + 10} y2={CY} stroke="var(--mv-guide)" strokeWidth={1.25} />
              <line x1={CX} y1={CY - rpx - 10} x2={CX} y2={CY + rpx + 10} stroke="var(--mv-guide)" strokeWidth={1.25} />
              <line x1={CX + rpx + 10} y1={CY} x2={GX0} y2={CY} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="2 4" />
            </>
          )}

          {/* eixos do gráfico */}
          <line x1={GX0} y1={axisY} x2={gx(maxTh) + 22} y2={axisY} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={`M ${gx(maxTh) + 22} ${axisY} l -7 -4 v 8 z`} fill="var(--ifm-color-emphasis-700)" />
          <line x1={GX0} y1={py(mid + amp) - 14} x2={GX0} y2={wheel ? axisY : py(mid - amp) + 12} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <SvgMath x={GX0 + 6} y={py(mid + amp) - 20} math={yName} anchor="start" fontSize={13} space={120} />
          <SvgMath x={gx(maxTh) + 20} y={axisY - 14} math="\theta" anchor="middle" fontSize={13} />

          {/* linhas-guia das alturas marcadas */}
          {ticksY.map((yv) => (
            <g key={yv}>
              <line x1={GX0 - 4} y1={py(yv)} x2={gx(maxTh)} y2={py(yv)} stroke="var(--mv-guide)" strokeWidth={0.75} strokeDasharray="2 5" />
              <SvgMath x={GX0 - 7} y={py(yv)} math={num(yv, 1)} anchor="end" fontSize={12} space={40} halo />
            </g>
          ))}
          {xTicks.map(({at, label}) => (
            <g key={at}>
              <line x1={gx(at)} y1={axisY - 4} x2={gx(at)} y2={axisY + 4} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={gx(at)} y={axisY + 16} math={label} fontSize={12} halo />
            </g>
          ))}

          {/* círculo (ou aro da roda) */}
          <circle cx={CX} cy={CY} r={rpx} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={wheel ? 2.5 : 2} />
          {wheel && Array.from({length: 8}, (_, i) => {
            if (i === 0) return null;
            const a = th + (i * Math.PI) / 4;
            const [sx, sy] = onCircle(CX, CY, rpx, a);
            return <line key={i} x1={CX} y1={CY} x2={sx} y2={sy} stroke="var(--mv-guide)" strokeWidth={1.1} />;
          })}

          {/* a curva inteira, tracejada, para mostrar aonde o traço vai chegar */}
          {ghost && <path d={curvePath(value, 0, maxTh, gx, py)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="3 4" />}
          {/* a curva traçada até aqui */}
          {traced && <path d={traced} fill="none" stroke={`var(--mv-tone-${tone})`} strokeWidth={2.5} strokeLinejoin="round" />}

          {/* pontos anotados */}
          {dots.filter((d) => d <= shown).map((d) => {
            const a = (d * Math.PI) / 180;
            return (
              <circle key={d} cx={gx(a)} cy={py(value(a))} r={4.2} fill={`var(--mv-tone-${tone})`} stroke="var(--mv-paper)" strokeWidth={1.2} />
            );
          })}

          {/* o giro */}
          <line x1={CX} y1={CY} x2={px} y2={pyP} stroke="var(--mv-tone-1)" strokeWidth={2.5} strokeLinecap="round" />
          {thMod > 0.03 && <path d={arcPath(CX, CY, wheel ? 22 : 15, 0, thMod)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.75} />}
          {mod >= 30 && <SvgMath x={lx} y={ly} math="\theta" tone={1} fontSize={13} halo />}

          {/* a coordenada transportada */}
          {fn === 'sin' ? (
            <>
              <line x1={px} y1={py(mid)} x2={px} y2={pyP} stroke={`var(--mv-tone-${tone})`} strokeWidth={4} strokeLinecap="round" />
              <line x1={px} y1={pyP} x2={qx} y2={qy} stroke={`var(--mv-tone-${tone})`} strokeWidth={1.25} strokeDasharray="4 4" />
            </>
          ) : (
            <>
              <line x1={CX} y1={CY} x2={CX + c * rpx} y2={CY} stroke={`var(--mv-tone-${tone})`} strokeWidth={4} strokeLinecap="round" />
              {Math.abs(c) > 0.04 && (
                <path
                  d={c > 0 ? arcPath(CX, CY, c * rpx, 0, Math.PI / 2) : arcPath(CX, CY, -c * rpx, Math.PI, 1.5 * Math.PI)}
                  fill="none" stroke={`var(--mv-tone-${tone})`} strokeWidth={1.25} strokeDasharray="2 3"
                />
              )}
              <line x1={CX} y1={CY} x2={CX} y2={cosStandY} stroke={`var(--mv-tone-${tone})`} strokeWidth={2} strokeOpacity={0.6} />
              <line x1={CX} y1={cosStandY} x2={qx} y2={qy} stroke={`var(--mv-tone-${tone})`} strokeWidth={1.25} strokeDasharray="4 4" />
            </>
          )}
          <line x1={qx} y1={py(mid)} x2={qx} y2={qy} stroke={`var(--mv-tone-${tone})`} strokeWidth={4} strokeLinecap="round" />

          {wheel ? (
            <rect x={px - 8} y={pyP - 6} width={16} height={12} rx={3} fill="var(--mv-tone-2)" fillOpacity={0.3} stroke="var(--mv-tone-2)" strokeWidth={2} />
          ) : (
            <circle cx={px} cy={pyP} r={4.5} fill="var(--mv-tone-1)" />
          )}
          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />
          <circle cx={qx} cy={qy} r={5} fill={`var(--mv-tone-${tone})`} stroke="var(--mv-paper)" strokeWidth={1.5} />
          {!wheel && (
            <SvgMath
              x={px + (c >= 0 ? 10 : -10)}
              y={pyP + (s >= 0 ? -11 : 11)}
              math="P"
              anchor={c >= 0 ? 'start' : 'end'}
              tone={1}
              fontSize={13}
              halo
            />
          )}
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <Readout {...{fn, shown, th, s, c, v, wheel, showFormula, mid, amp, unit, xAxis}} />
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro θ: {deg}°</span>
          <input
            type="range"
            min={0}
            max={360 * turns}
            step={step}
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
        <button type="button" onClick={() => play()}>
          Ver o giro de novo
        </button>
      </div>
    </div>
  );
}

function Readout({fn, shown, th, s, c, v, wheel, showFormula, mid, amp, unit, xAxis}) {
  const radText = `\\theta = ${shown}^\\circ ${rel(th)} ${num(th)}\\text{ rad}`;
  if (wheel) {
    const u = unit ? `\\text{ ${unit}}` : '';
    return (
      <>
        <p>
          A roda girou <strong>{turnText(shown)}</strong>
          {xAxis === 'rad' && <>, ou seja, <Formula math={radText} /></>}.
        </p>
        {showFormula ? (
          <p>
            <Formula math={`h = ${num(mid)} + ${num(amp)} \\times \\sen ${shown}^\\circ ${rel(v, 1)} ${num(mid)} + ${num(amp)} \\times ${paren(s)} ${rel(v, 1)} ${num(v, 1)}${u}`} />
          </p>
        ) : (
          <p>
            Altura da cadeirinha: {rel(v, 1) === '=' ? '' : 'cerca de '}<Formula math={`${num(v, 1)}${u}`} />.
          </p>
        )}
      </>
    );
  }
  const val = fn === 'sin' ? s : c;
  const name = fn === 'sin' ? '\\sen' : '\\cos';
  const coord = fn === 'sin' ? 'a altura (ordenada) de P' : 'a abscissa de P';
  return (
    <>
      <p>
        Giro <Formula math={radText} />
        {shown >= 360 ? ` ${turnText(shown).replace(/^\d+° /, '')}` : ''}.
      </p>
      <p>
        <Formula math={`P ${rel(c) === '=' && rel(s) === '=' ? '=' : '\\approx'} (${num(c)};\\ ${num(s)})`} />. O
        gráfico recebe {coord}, <Formula math={`${name}\\theta ${rel(val)} ${num(val)}`} />, no ponto{' '}
        <Formula math={`(${num(th)};\\ ${num(val)})`} />.
      </p>
    </>
  );
}
