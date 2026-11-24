import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath, onCircle} from '../mathviz/useAnimation';

// O braço robótico de 1 m da lição de funções trigonométricas inversas.
//
// mode 'sen' (o problema): o braço gira de 0° a 180° acima da mesa. O sensor
// mede só a altura da garra, h = sen θ (régua à direita, tom 3). A
// calculadora recebe h e devolve arcsen h: o braço fantasma, tracejado no
// tom 2. Até 90° os dois coincidem; depois, o fantasma fica do outro lado.
//
// mode 'tg' (a solução): o braço gira a volta inteira e o sistema conhece as
// duas coordenadas da garra. O fantasma é atan(y/x), que só aponta para a
// direita; o painel compara com atan2(y, x), que usa os sinais de x e de y.
//
// Ao aparecer, o braço gira de `from` até `initial`.

const W = 380;
const D = Math.PI / 180;
const R = 118;

const isRound = (v, digits = 3) => Math.abs(v - Number(v.toFixed(digits))) < 1e-9;
const tidy = (v) => (Math.abs(v) < 1e-9 ? 0 : v);
function deg(a) {
  const r = Math.round(a * 10) / 10;
  return `${Number.isInteger(r) ? r : r.toFixed(1).replace('.', '{,}')}^\\circ`;
}
const plain = (tex) => tex.replace('{,}', ',').replace('-', '−');

function Arm({cx, cy, a, tone, dashed, width = 7}) {
  const [x, y] = onCircle(cx, cy, R, a * D);
  const [ux, uy] = [Math.cos(a * D), -Math.sin(a * D)];
  // garra: duas pontas abertas, perpendiculares ao braço
  const nx = -uy;
  const ny = ux;
  const tip = (side) => `M ${x} ${y} L ${x + ux * 10 + nx * 7 * side} ${y + uy * 10 + ny * 7 * side}`;
  const color = `var(--mv-tone-${tone})`;
  return (
    <g>
      <line
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={dashed ? 2.5 : width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '7 5' : undefined}
        opacity={dashed ? 1 : 0.9}
      />
      <path d={`${tip(1)} ${tip(-1)}`} stroke={color} strokeWidth={dashed ? 2 : 3} fill="none" strokeLinecap="round" />
      <circle cx={x} cy={y} r={dashed ? 4 : 5} fill={dashed ? 'var(--mv-paper)' : color} stroke={color} strokeWidth={2} />
    </g>
  );
}

export default function RobotArmInverse({mode = 'sen', initial, from, presets, caption}) {
  const full = mode === 'tg';
  const start = initial ?? 150;
  const [theta, setTheta] = useState(start);
  const {ref, t, play, playing} = useAnimation({duration: 2.8});
  const begin = from ?? (full ? 0 : 30);
  const shown = playing ? Math.round(begin + ease(t / 2.8) * (theta - begin)) : theta;

  const H = full ? 330 : 236;
  const CX = full ? 175 : 165;
  const CY = full ? 165 : 172;
  const th = shown * D;
  const cos = tidy(Math.cos(th));
  const sin = tidy(Math.sin(th));
  const [gx, gy] = onCircle(CX, CY, R, th);

  // resposta da calculadora
  let ghost = null;
  if (!full) ghost = Math.asin(Math.max(-1, Math.min(1, sin))) / D;
  else if (Math.abs(cos) > 1e-9) ghost = Math.atan(sin / cos) / D;
  const agrees = ghost !== null && Math.abs(((shown - ghost) % 360 + 360) % 360) < 0.05;
  const atan2 = Math.atan2(sin, cos) / D;

  const ruler = CX + R + 46;
  const hTex = mathNumber(sin, 2);
  const hRel = isRound(sin, 2) ? '=' : '\\approx';

  return (
    <div className={shared.wrapper} data-explorer={`robot-arm-${mode}`}>
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Braço robótico de 1 metro girado ${shown} graus.`}
        >
          {/* trajetória da garra */}
          {full ? (
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="4 5" />
          ) : (
            <path d={arcPath(CX, CY, R, 0, Math.PI)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} strokeDasharray="4 5" />
          )}

          {/* mesa (sen) ou eixos (tg) */}
          {full ? (
            <>
              <line x1={CX - R - 30} y1={CY} x2={CX + R + 30} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
              <line x1={CX} y1={CY - R - 26} x2={CX} y2={CY + R + 26} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
              <SvgMath x={CX + R + 34} y={CY - 12} math="x" fontSize={14} />
              <SvgMath x={CX + 12} y={CY - R - 22} math="y" fontSize={14} anchor="start" />
            </>
          ) : (
            <>
              <line x1={CX - R - 34} y1={CY} x2={CX + R + 34} y2={CY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
              <rect x={CX - 18} y={CY} width={36} height={18} rx={3} fill="var(--ifm-color-emphasis-300)" stroke="var(--ifm-color-emphasis-600)" />
            </>
          )}

          {/* projeções da garra (tg) */}
          {full && (
            <>
              <line x1={gx} y1={gy} x2={gx} y2={CY} stroke="var(--mv-tone-3)" strokeWidth={2} strokeDasharray="5 4" />
              <line x1={gx} y1={gy} x2={CX} y2={gy} stroke="var(--mv-tone-3)" strokeWidth={2} strokeDasharray="5 4" />
            </>
          )}

          {/* régua da altura (sen) */}
          {!full && (
            <>
              <line x1={ruler} y1={CY} x2={ruler} y2={CY - R} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
              {[0, 0.5, 1].map((v) => (
                <g key={v}>
                  <line x1={ruler - 5} y1={CY - v * R} x2={ruler + 5} y2={CY - v * R} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
                  <SvgMath x={ruler + 9} y={CY - v * R} math={v === 0 ? '0' : v === 1 ? '1\\ \\text{m}' : '0{,}5'} anchor="start" space={W - ruler - 10} fontSize={12} />
                </g>
              ))}
              <line x1={gx} y1={gy} x2={ruler} y2={gy} stroke="var(--mv-tone-3)" strokeWidth={2} strokeDasharray="5 4" />
              <line x1={ruler} y1={CY} x2={ruler} y2={gy} stroke="var(--mv-tone-3)" strokeWidth={5} strokeLinecap="round" />
              <SvgMath x={ruler - 8} y={(CY + gy) / 2} math="h" anchor="end" tone={3} fontSize={14} halo />
            </>
          )}

          {/* o giro */}
          {shown > 2 && <path d={arcPath(CX, CY, 26, 0, th)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.8} />}

          {ghost !== null && !agrees && <Arm cx={CX} cy={CY} a={ghost} tone={2} dashed />}
          <Arm cx={CX} cy={CY} a={shown} tone={1} />
          <circle cx={CX} cy={CY} r={6} fill="var(--ifm-font-color-base)" />

          {ghost !== null && !agrees && (() => {
            const [lx, ly] = onCircle(CX, CY, R + 24, ghost * D);
            return <SvgMath x={lx} y={ly} math={deg(ghost)} anchor="start" space={W - lx} tone={2} fontSize={13} halo />;
          })()}
          {(() => {
            const [lx, ly] = onCircle(CX, CY, R + 26, th);
            const right = Math.cos(th) > 0.3;
            const left = Math.cos(th) < -0.3;
            return (
              <SvgMath
                x={lx}
                y={ly}
                math={deg(shown)}
                anchor={right ? 'start' : left ? 'end' : 'middle'}
                space={left ? lx : W - lx}
                tone={1}
                fontSize={13}
                halo
              />
            );
          })()}
        </svg>
        {caption && <figcaption className={geo.caption}>{caption}</figcaption>}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {!full ? (
          <>
            <p>
              O sensor mede a altura da garra: <Formula math={`h = \\sen ${shown}^\\circ ${hRel} ${hTex}`} /> m. A
              calculadora recebe só esse número e devolve{' '}
              <Formula math={`\\arcsen(${hTex}) ${isRound(sin, 2) && isRound(ghost, 1) ? '=' : '\\approx'} ${deg(ghost)}`} />.
            </p>
            <p>
              {agrees
                ? `Aqui ela acerta: o braço está mesmo em ${shown}°.`
                : `Aqui ela erra: o braço está em ${shown}°, do outro lado. Os dois giros deixam a garra na mesma altura.`}
            </p>
          </>
        ) : (
          <>
            <p>
              A garra está em{' '}
              <Formula math={`(x;\\ y) ${isRound(cos, 2) && isRound(sin, 2) ? '=' : '\\approx'} (${mathNumber(cos, 2)};\\ ${mathNumber(sin, 2)})`} /> m.
            </p>
            {ghost === null ? (
              <p>
                Com <Formula math="x = 0" />, a divisão <Formula math="y \div x" /> não existe, e{' '}
                <code>atan(y/x)</code> não tem o que calcular. Já <code>atan2(y, x)</code> devolve{' '}
                <Formula math={deg(atan2)} />
                {Math.abs(atan2 - shown) > 0.05 ? `, que é o mesmo lugar que ${shown}°` : ''}.
              </p>
            ) : (
              <p>
                <code>atan(y/x)</code> calcula{' '}
                <Formula math={`\\arctg(${mathNumber(sin / cos, 3)}) ${isRound(sin / cos, 3) && isRound(ghost, 1) ? '=' : '\\approx'} ${deg(ghost)}`} />.{' '}
                {agrees
                  ? 'Aqui acerta, porque a garra está à direita do eixo vertical, a metade em que o arctg procura.'
                  : `Aqui erra por 180°: a garra está à esquerda do eixo vertical, e o arctg só procura à direita. A divisão apagou os sinais: (${plain(mathNumber(cos, 2))}; ${plain(mathNumber(sin, 2))}) e (${plain(mathNumber(-cos, 2))}; ${plain(mathNumber(-sin, 2))}) dão o mesmo quociente.`}{' '}
                <code>atan2(y, x)</code> recebe os dois números e devolve <Formula math={deg(atan2)} />
                {Math.abs(atan2 - shown) > 0.05 ? `, que é o mesmo lugar que ${shown}°` : ''}.
              </p>
            )}
          </>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro do braço θ: {shown}°</span>
          <input
            type="range"
            min={0}
            max={full ? 355 : 180}
            step={5}
            value={theta}
            onChange={(event) => setTheta(Number(event.target.value))}
            disabled={playing}
            aria-label="Giro do braço em graus"
            aria-valuetext={`${theta} graus`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {(presets ?? (full ? [45, 150, 210, 270, 330] : [30, 60, 120, 150])).map((p) => (
          <button key={p} type="button" onClick={() => setTheta(p)} disabled={playing}>
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
