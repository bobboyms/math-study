import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation from '../mathviz/useAnimation';
import {PI, piLabel, num} from '../TrigEqCycleLine/angles';

// A roda-gigante da lição de equações trigonométricas.
//
// Roda de 40 m de diâmetro, eixo a 25 m do chão, uma volta a cada 2 minutos,
// cabine partindo do ponto mais baixo: h(t) = 25 − 20 cos(πt), t em minutos.
// À esquerda, a roda; à direita, o gráfico de h(t) em duas voltas, com a
// mesma escala vertical da roda (a reta da altura procurada atravessa os
// dois desenhos na mesma altura).
//
// - showTimes: rotula os instantes em que a cabine está na altura `level`.
// - band: pinta os trechos em que a cabine está na altura `level` ou acima.
//
// Na primeira vez que aparece, a roda gira as duas voltas e o gráfico se
// desenha. Depois, o deslizante escolhe o instante.

const W = 616;
const K = 4.4; // pixels por metro, na roda e no gráfico
const GROUND = 240;
const CX = 112;
const CYW = GROUND - 25 * K;
const R = 20 * K;
const GX0 = 246;
const PXM = 84; // pixels por minuto
const T_MAX = 4;
const GX1 = GX0 + T_MAX * PXM;
const H = GROUND + 40;
const DURATION = 5;

const hOf = (t) => 25 - 20 * Math.cos(PI * t);
const gy = (h) => GROUND - h * K;
const gt = (t) => GX0 + t * PXM;

// 2/3 → '\\frac{2}{3}'
function fracLabel(v) {
  const p = piLabel(v * PI);
  if (!p) return num(v, 2);
  return p.replace('{\\pi}', '{1}').replace(/(\d)\\pi/, '$1').replace('\\pi', '1');
}

function timeText(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec - 60 * m);
  if (m === 0) return `${s} s`;
  return s === 0 ? `${m} min` : `${m} min ${s} s`;
}

export default function TrigEqWheel({level = 35, showTimes = false, band: showWindow = false, initial = 240, caption}) {
  const [sec, setSec] = useState(initial);
  const {ref, t: ta, play, playing} = useAnimation({duration: DURATION});
  const tNow = playing ? (ta / DURATION) * T_MAX : sec / 60;
  const h = hOf(tNow);

  // Instantes em que h = level, em [0, 4].
  const cc = (25 - level) / 20;
  const times = [];
  if (Math.abs(cc) <= 1) {
    const a = Math.acos(cc) / PI; // em minutos
    for (let k = 0; k <= 2; k += 1) {
      [a + 2 * k, 2 - a + 2 * k].forEach((x) => {
        if (x >= -1e-9 && x <= T_MAX + 1e-9 && !times.some((y) => Math.abs(y - x) < 1e-7)) times.push(x);
      });
    }
    times.sort((p, q) => p - q);
  }
  const windows = [];
  for (let i = 0; i + 1 < times.length; i += 2) windows.push([times[i], times[i + 1]]);

  // Curva traçada até o instante atual.
  const curve = (t1) => {
    const n = Math.max(2, Math.ceil(t1 * 60));
    let d = '';
    for (let i = 0; i <= n; i += 1) {
      const t = (t1 * i) / n;
      d += `${i === 0 ? 'M' : 'L'} ${gt(t).toFixed(2)} ${gy(hOf(t)).toFixed(2)} `;
    }
    return d.trim();
  };

  const phi = -PI / 2 + PI * tNow;
  const cabX = CX + R * Math.cos(phi);
  const cabY = CYW - R * Math.sin(phi);
  const above = h >= level - 1e-9;

  // Arco da roda acima da altura procurada (modo janela).
  let arcAbove = null;
  if (showWindow && Math.abs(cc) <= 1) {
    const yl = (level - 25) / 20; // em raios, acima do eixo
    const a0 = Math.asin(yl);
    const x0 = CX + R * Math.cos(a0);
    const y0 = CYW - R * Math.sin(a0);
    const x1 = CX - R * Math.cos(a0);
    arcAbove = `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 0 0 ${x1.toFixed(2)} ${y0.toFixed(2)}`;
  }

  const rel = Math.abs(h - Number(h.toFixed(1))) < 1e-6 ? '=' : '\\approx';

  return (
    <div className={shared.wrapper} data-explorer="trig-eq-wheel">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Roda-gigante e gráfico da altura da cabine em duas voltas; reta na altura de ${level} metros.`}>
          {/* chão e suporte */}
          <line x1={12} y1={GROUND} x2={CX + R + 24} y2={GROUND} stroke="var(--ifm-color-emphasis-600)" strokeWidth={2} />
          <path d={`M ${CX - 40} ${GROUND} L ${CX} ${CYW} L ${CX + 40} ${GROUND}`} fill="none" stroke="var(--mv-guide)" strokeWidth={5} strokeLinejoin="round" />
          {/* janelas no gráfico */}
          {showWindow && windows.map(([t0, t1]) => (
            <rect key={t0} x={gt(t0)} y={gy(47)} width={gt(t1) - gt(t0)} height={gy(0) - gy(47)} fill="var(--mv-tone-3)" fillOpacity={0.14} />
          ))}
          {/* roda */}
          <circle cx={CX} cy={CYW} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2.5} />
          {Array.from({length: 8}, (_, i) => {
            const a = phi + (i * PI) / 4;
            return i === 0 ? null : (
              <line key={i} x1={CX} y1={CYW} x2={CX + R * Math.cos(a)} y2={CYW - R * Math.sin(a)} stroke="var(--mv-guide)" strokeWidth={1.25} />
            );
          })}
          {arcAbove && <path d={arcAbove} fill="none" stroke="var(--mv-tone-3)" strokeWidth={6} opacity={0.75} />}
          <line x1={CX} y1={CYW} x2={cabX} y2={cabY} stroke="var(--mv-tone-1)" strokeWidth={2.5} />
          <circle cx={CX} cy={CYW} r={4} fill="var(--ifm-font-color-base)" />

          {/* eixos do gráfico */}
          <line x1={GX0} y1={gy(0)} x2={GX1 + 16} y2={gy(0)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={`M ${GX1 + 16} ${gy(0)} l -7 -4 v 8 z`} fill="var(--ifm-color-emphasis-700)" />
          <line x1={GX0} y1={gy(0)} x2={GX0} y2={gy(49)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={`M ${GX0} ${gy(49) - 6} l -4 7 h 8 z`} fill="var(--ifm-color-emphasis-700)" />
          <SvgMath x={GX0 + 8} y={gy(49)} math="h\ (\text{m})" anchor="start" fontSize={12} space={80} />
          {[5, 25, 45].map((v) => (
            <g key={v}>
              <line x1={GX0} y1={gy(v)} x2={GX1} y2={gy(v)} stroke="var(--mv-guide)" strokeWidth={0.75} strokeDasharray="2 5" />
              <SvgMath x={GX0 - 6} y={gy(v)} math={String(v)} anchor="end" fontSize={12} space={30} />
            </g>
          ))}
          {[1, 2, 3, 4].map((v) => (
            <g key={v}>
              <line x1={gt(v)} y1={gy(0) - 4} x2={gt(v)} y2={gy(0) + 4} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={gt(v)} y={gy(0) + 16} math={String(v)} fontSize={12} halo space={30} />
            </g>
          ))}
          <SvgMath x={GX1 + 16} y={gy(0) + 16} math="t\ (\text{min})" anchor="end" fontSize={12} space={70} halo />
          <SvgMath x={GX0 - 6} y={gy(0) + 12} math="0" anchor="end" fontSize={12} space={20} />

          {/* a curva inteira (tracejada) e o trecho já percorrido */}
          <path d={curve(T_MAX)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="3 4" />
          {tNow > 0.001 && <path d={curve(tNow)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2.5} />}

          {/* a altura procurada, atravessando a roda e o gráfico */}
          <line x1={12} y1={gy(level)} x2={GX1} y2={gy(level)} stroke="var(--mv-tone-1)" strokeWidth={1.75} strokeDasharray="7 4" />
          <SvgMath x={gt(2)} y={gy(level) + 14} math={`h = ${level}\\text{ m}`} fontSize={12} tone={1} halo space={90} />

          {/* instantes na altura procurada */}
          {times.map((x, i) => {
            const reached = tNow >= x - 1e-9;
            const rising = Math.sin(PI * x) > 0;
            return reached ? (
              <g key={x}>
                {showTimes && <line x1={gt(x)} y1={gy(level)} x2={gt(x)} y2={gy(0)} stroke="var(--mv-tone-1)" strokeWidth={1} strokeDasharray="3 3" />}
                <circle cx={gt(x)} cy={gy(level)} r={5} fill="var(--mv-tone-1)" stroke="var(--mv-paper)" strokeWidth={1.5} />
                {showTimes && (
                  <SvgMath x={gt(x) + (rising ? -7 : 7)} y={gy(level) - 15} math={fracLabel(x)} anchor={rising ? 'end' : 'start'} fontSize={13} tone={1} halo space={40} />
                )}
              </g>
            ) : null;
          })}

          {/* ligação da cabine ao ponto do gráfico */}
          <line x1={cabX} y1={cabY} x2={gt(tNow)} y2={gy(h)} stroke="var(--mv-tone-2)" strokeWidth={1} strokeDasharray="3 4" />
          <circle cx={gt(tNow)} cy={gy(h)} r={4.5} fill="var(--mv-tone-2)" />
          <rect x={cabX - 9} y={cabY - 7} width={18} height={14} rx={3} fill="var(--mv-tone-2)" fillOpacity={0.3} stroke="var(--mv-tone-2)" strokeWidth={2} />
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'A cabine parte do ponto mais baixo e dá uma volta a cada 2 minutos. O gráfico da direita registra a altura dela, na mesma escala da roda. A reta tracejada azul é a altura procurada.'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <strong>{timeText(Math.round(tNow * 60))}</strong> depois da partida:{' '}
          <Formula math={`h ${rel} ${num(h, 1)}\\text{ m}`} />.
          {showWindow && (above ? ` A cabine está a ${level} m ou mais.` : ` A cabine está abaixo de ${level} m.`)}
        </p>
        {showTimes && times.length > 0 && (
          <p>
            Na altura de {level} m: <Formula math={`t = ${times.map(fracLabel).join(',\\ ')}`} /> minutos.
          </p>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Tempo desde a partida: {timeText(sec)}</span>
          <input type="range" min={0} max={240} step={5} value={sec}
            onChange={(e) => setSec(Number(e.target.value))} disabled={playing}
            aria-label="Tempo desde a partida, em segundos" aria-valuetext={timeText(sec)} />
        </label>
      </div>
      <div className={shared.buttons}>
        {showTimes && times.filter((x) => x <= 2).map((x) => (
          <button key={x} type="button" onClick={() => setSec(Math.round(x * 60))} disabled={playing}>
            {timeText(Math.round(x * 60))}
          </button>
        ))}
        <button type="button" onClick={() => { setSec(240); play(); }} disabled={playing}>
          Ver as duas voltas de novo
        </button>
      </div>
    </div>
  );
}
