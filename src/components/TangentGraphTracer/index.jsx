import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation from '../mathviz/useAnimation';

// O gráfico da tangente nascendo do ciclo.
//
// À esquerda, o ciclo de raio 1 com a reta x = 1. A reta do raio, prolongada
// para a frente ou para trás pelo centro, corta x = 1 no ponto T. À direita,
// o gráfico, com a MESMA escala vertical do ciclo: a altura de T é levada na
// horizontal, por um tracejado, até o ponto (θ, tg θ) do gráfico. É esse
// tracejado que diz ao aluno que o gráfico é a altura de T, e nada mais.
//
// Modo normal: ao aparecer, o giro anda de 0 até `initial` com velocidade
// constante e o gráfico vai sendo traçado atrás do ponto. Depois o deslizante
// controla o giro, de 0° a 360°, e o traço vai de 0 até o giro atual.
//
// Modo `pair` (período): o gráfico aparece inteiro; o deslizante escolhe θ
// entre 0° e 179°, e o desenho mostra também o ponto oposto, θ + 180°. A reta
// do raio é a mesma, T é o mesmo, e os dois pontos do gráfico ficam na mesma
// altura, separados por π.

const S = 50; // pixels por unidade, no ciclo e na vertical do gráfico
const CLAMP = 3; // altura máxima desenhada
const PAD = 24;
const CX = 66;
const CY = PAD + (CLAMP + 0.25) * S;
const X1 = CX + S; // a reta x = 1
const GX = 186; // origem do gráfico
const HX = 44; // pixels por radiano no eixo horizontal do gráfico
const W = GX + 2 * Math.PI * HX + 30;
const H = 2 * CY;
const TOP = CY - (CLAMP + 0.25) * S;
const BOT = CY + (CLAMP + 0.25) * S;

const rad = (deg) => (deg * Math.PI) / 180;
const gX = (x) => GX + x * HX;
const Yv = (y) => CY - y * S;
const isVertical = (deg) => Math.abs(Math.cos(rad(deg))) < 1e-9;

// Caminho do gráfico de `a` até `b` (radianos), quebrado nas assíntotas e
// cortado fora da faixa desenhada.
function graphPath(a, b) {
  if (b <= a) return '';
  const steps = Math.max(2, Math.round((b - a) * HX * 2));
  let d = '';
  let pen = false;
  let prev = null;
  for (let i = 0; i <= steps; i += 1) {
    const x = a + ((b - a) * i) / steps;
    const y = Math.tan(x);
    const ok = Number.isFinite(y) && Math.abs(y) <= CLAMP + 0.3;
    const jump = prev !== null && Math.abs(y - prev) > 2 * CLAMP;
    if (!ok || jump) pen = false;
    if (ok) {
      d += `${pen ? 'L' : 'M'} ${gX(x).toFixed(2)} ${Yv(y).toFixed(2)} `;
      pen = true;
    }
    prev = y;
  }
  return d;
}

// Reta do raio: de P (no círculo) até T (em x = 1), passando pelo centro
// quando P está à esquerda. Se T sai da faixa, a reta para na borda, na
// direção certa.
function rayLine(deg, both = false) {
  const a = rad(deg);
  const tg = Math.tan(a);
  const clipped = Math.abs(tg) > CLAMP;
  const ey = clipped ? Math.sign(tg) * CLAMP : tg;
  const ex = clipped ? ey / tg : 1;
  const px = Math.cos(a);
  const py = Math.sin(a);
  // Com `both`, a reta vai do ponto da esquerda (P ou o oposto) até T,
  // passando pelos dois pontos do giro.
  const start = px < 0 ? [px, py] : both ? [-px, -py] : [0, 0];
  return {from: start, to: [ex, ey]};
}

function CyclePart({deg, tone, showT = true, both = false, label = 'T'}) {
  const a = rad(deg);
  const px = CX + S * Math.cos(a);
  const py = CY - S * Math.sin(a);
  const vertical = isVertical(deg);
  const tg = Math.tan(a);
  const inside = !vertical && Math.abs(tg) <= CLAMP;
  const ray = !vertical ? rayLine(deg, both) : null;
  return (
    <g>
      {ray && showT && (
        <line
          x1={CX + ray.from[0] * S}
          y1={CY - ray.from[1] * S}
          x2={CX + ray.to[0] * S}
          y2={CY - ray.to[1] * S}
          stroke="var(--mv-guide)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
      )}
      <line x1={CX} y1={CY} x2={px} y2={py} stroke={`var(--mv-tone-${tone})`} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={px} cy={py} r={4.5} fill={`var(--mv-tone-${tone})`} />
      {inside && showT && (
        <>
          <line x1={X1} y1={CY} x2={X1} y2={Yv(tg)} stroke="var(--mv-tone-2)" strokeWidth={4} strokeLinecap="round" />
          <circle cx={X1} cy={Yv(tg)} r={4.5} fill="var(--mv-tone-2)" />
          <SvgMath x={X1 - 9} y={Yv(tg) + (tg >= 0 ? -13 : 13)} math={label} anchor="end" space={X1 - 12} tone={2} fontSize={14} halo />
        </>
      )}
    </g>
  );
}

export default function TangentGraphTracer({
  initial = 300,
  from = 0,
  duration = 6,
  pair = false,
  presets,
  caption,
}) {
  const [deg, setDeg] = useState(pair ? Math.min(initial, 179) : initial);
  const {ref, t, play, playing} = useAnimation({duration});
  const shown = playing ? from + (t / duration) * (deg - from) : deg;

  const th = rad(shown);
  const vertical = isVertical(shown);
  const tg = Math.tan(th);
  const inside = !vertical && Math.abs(tg) <= CLAMP;
  const thPair = th + Math.PI;

  const buttons = presets ?? (pair ? [30, 45, 60, 120, 150] : [45, 80, 90, 135, 225, 315]);
  const defaultCaption = pair
    ? 'O giro θ (azul) e o giro θ + 180° (verde) apontam em sentidos opostos sobre a mesma reta. Os dois cortam x = 1 no mesmo ponto T, e no gráfico os dois pontos ficam na mesma altura, a π de distância.'
    : 'A altura de T, na reta x = 1, é levada pelo tracejado horizontal até o gráfico, na mesma escala. O gráfico da tangente é o registro dessa altura, giro a giro.';

  // marcas do eixo horizontal do gráfico
  const xTicks = [
    [Math.PI / 2, '\\frac{\\pi}{2}'],
    [Math.PI, '\\pi'],
    [(3 * Math.PI) / 2, '\\frac{3\\pi}{2}'],
    [2 * Math.PI, '2\\pi'],
  ];

  const tgText = (v) => (Math.abs(v) < 1e-9 ? 0 : v);
  const rel = (v) => (Math.abs(v - Number(v.toFixed(2))) < 1e-9 ? '=' : '\\approx');
  const roundDeg = Math.round(shown);
  // O painel usa o giro arredondado: perto de 90° ou 270° ele não pode
  // escrever um valor para tg 90° ou tg 270°.
  const verticalText = isVertical(roundDeg);

  return (
    <div className={shared.wrapper} data-explorer="tangent-graph-tracer">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Ciclo e gráfico da tangente, com o giro em ${roundDeg} graus.`}
        >
          <defs>
            <clipPath id="tgt-clip">
              <rect x={GX - 2} y={TOP} width={W - GX} height={BOT - TOP} />
            </clipPath>
          </defs>

          {/* ciclo: eixos, círculo e a reta x = 1 */}
          <line x1={CX - S - 12} y1={CY} x2={X1 + 22} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <line x1={CX} y1={CY + S + 12} x2={CX} y2={CY - S - 12} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <circle cx={CX} cy={CY} r={S} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2} />
          <line x1={X1} y1={TOP} x2={X1} y2={BOT} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <SvgMath x={X1} y={TOP - 11} math="x = 1" fontSize={12} />

          {/* linhas de altura inteira, comuns ao ciclo e ao gráfico */}
          {[-3, -2, -1, 1, 2, 3].map((v) => (
            <g key={v}>
              <line x1={X1 - 4} y1={Yv(v)} x2={X1 + 4} y2={Yv(v)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <line x1={GX} y1={Yv(v)} x2={W - 18} y2={Yv(v)} stroke="var(--mv-guide)" strokeOpacity={0.35} strokeWidth={1} />
              <SvgMath x={GX - 8} y={Yv(v)} math={String(v)} anchor="end" space={30} fontSize={12} />
            </g>
          ))}

          {/* gráfico: eixos */}
          <line x1={GX} y1={CY} x2={W - 10} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <line x1={GX} y1={BOT} x2={GX} y2={TOP} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <SvgMath x={W - 14} y={CY - 13} math="\theta" fontSize={13} />
          {xTicks.map(([x, label]) => (
            <g key={label}>
              <line x1={gX(x)} y1={CY - 4} x2={gX(x)} y2={CY + 4} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />
              <SvgMath x={gX(x) + (x === Math.PI / 2 || x === 1.5 * Math.PI ? 13 : 0)} y={CY + 18} math={label} fontSize={12} halo />
            </g>
          ))}

          {/* assíntotas */}
          {[Math.PI / 2, (3 * Math.PI) / 2].map((x) => (
            <line key={x} x1={gX(x)} y1={TOP} x2={gX(x)} y2={BOT} stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="5 5" />
          ))}

          {/* o traço do gráfico */}
          <g clipPath="url(#tgt-clip)">
            {pair && (
              <path d={graphPath(0, 2 * Math.PI)} fill="none" stroke="var(--mv-tone-2)" strokeOpacity={0.45} strokeWidth={2} />
            )}
            {!pair && (
              <path d={graphPath(rad(from), th)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2.5} strokeLinejoin="round" />
            )}
          </g>

          {/* ciclo: o giro (e, no modo pair, o giro oposto) */}
          {shown > 0.5 && (
            <path
              d={(() => {
                const n = Math.max(6, Math.round(shown / 4));
                let d = '';
                for (let i = 0; i <= n; i += 1) {
                  const a = (th * i) / n;
                  const r = 14 + (a / (2 * Math.PI)) * 3;
                  d += `${i ? 'L' : 'M'} ${(CX + r * Math.cos(a)).toFixed(2)} ${(CY - r * Math.sin(a)).toFixed(2)} `;
                }
                return d;
              })()}
              fill="none"
              stroke="var(--mv-tone-1)"
              strokeWidth={1.5}
            />
          )}
          {pair && <CyclePart deg={shown + 180} tone={3} showT={false} />}
          <CyclePart deg={shown} tone={1} both={pair} />

          {/* transporte da altura de T até o gráfico */}
          {inside && (
            <>
              <line x1={X1 + 6} y1={Yv(tg)} x2={gX(th)} y2={Yv(tg)} stroke="var(--mv-tone-2)" strokeWidth={1.25} strokeDasharray="3 4" />
              <line x1={gX(th)} y1={CY} x2={gX(th)} y2={Yv(tg)} stroke="var(--mv-tone-2)" strokeWidth={1.25} strokeDasharray="3 4" strokeOpacity={0.7} />
              <circle cx={gX(th)} cy={Yv(tg)} r={5} fill="var(--mv-tone-2)" />
              {pair && (
                <>
                  <line x1={gX(th)} y1={Yv(tg)} x2={gX(thPair)} y2={Yv(tg)} stroke="var(--mv-tone-3)" strokeWidth={1.5} />
                  <circle cx={gX(thPair)} cy={Yv(tg)} r={5} fill="var(--mv-tone-3)" />
                  <SvgMath x={(gX(th) + gX(thPair)) / 2} y={Yv(tg) + (tg >= 0 ? -13 : 13)} math="\pi" tone={3} fontSize={14} halo />
                </>
              )}
            </>
          )}
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {verticalText ? (
          <p>
            Em <strong>{roundDeg}°</strong> a reta do raio fica em pé, paralela à reta x = 1. Não existe T, e{' '}
            <Formula math={`\\tg ${roundDeg}^\\circ`} /> não existe: o gráfico não tem ponto em{' '}
            <Formula math={roundDeg === 90 ? '\\frac{\\pi}{2}' : '\\frac{3\\pi}{2}'} />.
          </p>
        ) : (
          <p>
            <Formula math={`\\theta = ${roundDeg}^\\circ \\approx ${mathNumber(rad(roundDeg), 2)}\\text{ rad}`} />, e{' '}
            <Formula math={`\\tg ${roundDeg}^\\circ ${rel(tgText(Math.tan(rad(roundDeg))))} ${mathNumber(tgText(Math.tan(rad(roundDeg))), 2)}`} />.
            {!inside && ' O ponto T está fora da parte desenhada da reta x = 1, e o ponto do gráfico também.'}
          </p>
        )}
        {pair && !verticalText && (
          <p>
            O giro oposto, <Formula math={`${roundDeg + 180}^\\circ`} />, dá a mesma tangente:{' '}
            <Formula math={`\\tg ${roundDeg + 180}^\\circ ${rel(tgText(Math.tan(rad(roundDeg))))} ${mathNumber(tgText(Math.tan(rad(roundDeg))), 2)}`} />.
          </p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro θ: {deg}°</span>
          <input
            type="range"
            min={0}
            max={pair ? 179 : 360}
            step={1}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            disabled={playing}
            aria-label="Giro em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {buttons.map((p) => (
          <button key={p} type="button" onClick={() => setDeg(p)} disabled={playing}>
            {p}°
          </button>
        ))}
        <button type="button" onClick={() => play()}>
          {pair ? 'Ver o giro de novo' : 'Traçar de novo'}
        </button>
      </div>
    </div>
  );
}
