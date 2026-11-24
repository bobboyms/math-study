import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath, onCircle, fmt} from '../mathviz/useAnimation';

// A roda-gigante do problema motivador da lição do ciclo trigonométrico.
//
// Roda de 20 m de raio, centro a 22 m do chão, desenhada em escala: 1 m vale
// K pixels na roda e na régua de altura. A cadeirinha embarca à direita, na
// altura do centro, e a roda gira no sentido anti-horário.
//
// A régua à direita mostra a altura da cadeirinha. Com `showHeight`, ela se
// divide em duas partes: os 22 m do chão até o centro (neutro) e o quanto a
// cadeirinha está acima ou abaixo do centro (no tom do seno, 2). Abaixo do
// centro essa segunda parte desce, e é ela que a lição chama de 20 sen θ.
// Sem `showHeight` (no problema motivador, quando o seno do ciclo ainda não
// foi construído), a régua aparece inteira e o painel mostra a pergunta.
//
// Na primeira vez que aparece na tela, a roda gira de 0 até o giro inicial.

const W = 440;
const H = 300;
const K = 5; // pixels por metro
const RM = 20; // raio, em metros
const HC = 22; // altura do centro, em metros
const R = RM * K;
const GROUND = 272;
const CX = 150;
const CY = GROUND - HC * K;
const RULER_X = 330;
const BRACKET_X = RULER_X + 72; // à direita da régua: nenhuma linha de nível chega até aqui
const SPOKES = 8;
const DURATION = 3;

// "=" quando o arredondamento não perde nada (sen 30° = 0,5); "≈" quando perde.
const rel = (v, digits) => (Math.abs(v - Number(v.toFixed(digits))) < 1e-9 ? '=' : '\\approx');
const paren = (tex, v) => (v < -1e-12 ? `(${tex})` : tex);

function turnText(deg) {
  if (deg < 360) return `${deg}°`;
  const k = Math.floor(deg / 360);
  const rest = deg - 360 * k;
  const voltas = k === 1 ? '1 volta' : `${k} voltas`;
  return rest === 0 ? `${deg}° (${voltas})` : `${deg}° (${voltas} e mais ${rest}°)`;
}

export default function FerrisWheel({
  initial = 150,
  max = 540,
  showHeight = false,
  presets = [30, 150, 210, 540],
  caption,
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const shown = playing ? Math.round(ease(t / DURATION) * deg) : deg;

  const th = (shown * Math.PI) / 180;
  const s = Math.sin(th);
  const [px, py] = onCircle(CX, CY, R, th);
  const h = HC + RM * s;
  const mod = ((shown % 360) + 360) % 360;
  const thMod = (mod * Math.PI) / 180;
  const [lx, ly] = onCircle(CX, CY, 36, thMod / 2);
  const above = py < CY - 1;
  const below = py > CY + 1;

  const defaultCaption = showHeight
    ? 'A régua da direita é a altura da cadeirinha: 22 m do chão até o centro, mais (ou menos) o trecho laranja, que é quanto ela está acima ou abaixo do centro.'
    : 'A cadeirinha embarca à direita, na altura do centro, e a roda gira no sentido anti-horário. A régua da direita acompanha a altura dela.';

  return (
    <div className={shared.wrapper} data-explorer="ferris-wheel">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Roda-gigante: a roda girou ${shown} graus e a cadeirinha está a ${fmt(h, 1)} metros do chão.`}
        >
          {/* chão e suporte */}
          <line x1={16} y1={GROUND} x2={W - 16} y2={GROUND} stroke="var(--ifm-color-emphasis-600)" strokeWidth={2} />
          <path
            d={`M ${CX - 46} ${GROUND} L ${CX} ${CY} L ${CX + 46} ${GROUND}`}
            fill="none"
            stroke="var(--mv-guide)"
            strokeWidth={5}
            strokeLinejoin="round"
          />

          {/* roda: aro e raios, que giram junto */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={2.5} />
          {Array.from({length: SPOKES}, (_, i) => {
            const a = th + (i * 2 * Math.PI) / SPOKES;
            const [sx, sy] = onCircle(CX, CY, R, a);
            return i === 0 ? null : (
              <line key={i} x1={CX} y1={CY} x2={sx} y2={sy} stroke="var(--mv-guide)" strokeWidth={1.25} />
            );
          })}

          {/* linha da altura do centro, de ponta a ponta até a régua */}
          <line x1={CX - R - 12} y1={CY} x2={RULER_X + 14} y2={CY} stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="5 4" />

          {/* o giro: raio até a cadeirinha e arco do ângulo */}
          <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={3} strokeLinecap="round" />
          {thMod > 0.02 && (
            <path d={arcPath(CX, CY, 22, 0, thMod)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.75} />
          )}
          {mod >= 25 && <SvgMath x={lx} y={ly} math="\theta" tone={1} fontSize={13} halo />}
          <circle cx={CX} cy={CY} r={4} fill="var(--ifm-font-color-base)" />

          {/* linha de nível da cadeirinha até a régua */}
          <line x1={px} y1={py} x2={RULER_X} y2={py} stroke="var(--mv-tone-2)" strokeWidth={1.25} strokeDasharray="3 4" />

          {/* cadeirinha */}
          <rect x={px - 9} y={py - 7} width={18} height={14} rx={3} fill="var(--mv-tone-2)" fillOpacity={0.3} stroke="var(--mv-tone-2)" strokeWidth={2} />

          {/* régua da altura */}
          {showHeight ? (
            <>
              {/* colchete dos 22 m, do chão até o centro */}
              <g stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5}>
                <line x1={BRACKET_X} y1={GROUND} x2={BRACKET_X} y2={CY} />
                <line x1={BRACKET_X - 5} y1={GROUND} x2={BRACKET_X + 5} y2={GROUND} />
                <line x1={BRACKET_X - 5} y1={CY} x2={BRACKET_X + 5} y2={CY} />
              </g>
              <SvgMath x={BRACKET_X + 7} y={(GROUND + CY) / 2} math="22" anchor="start" space={W - BRACKET_X - 8} fontSize={13} halo />
              <line x1={RULER_X} y1={GROUND} x2={RULER_X} y2={Math.max(py, CY)} stroke="var(--ifm-color-emphasis-700)" strokeWidth={6} />
              {(above || below) && (
                <line x1={RULER_X} y1={CY} x2={RULER_X} y2={py} stroke="var(--mv-tone-2)" strokeWidth={6} />
              )}
              {Math.abs(py - CY) > 14 && (
                <SvgMath
                  x={RULER_X - 10}
                  y={(CY + py) / 2}
                  math={`${above ? '+' : '-'}${mathNumber(Math.abs(RM * s), 1)}`}
                  anchor="end"
                  tone={2}
                  fontSize={13}
                  halo
                />
              )}
            </>
          ) : (
            <line x1={RULER_X} y1={GROUND} x2={RULER_X} y2={py} stroke="var(--mv-tone-2)" strokeWidth={6} />
          )}
          <line x1={RULER_X - 9} y1={py} x2={RULER_X + 9} y2={py} stroke="var(--mv-tone-2)" strokeWidth={2} />
          <SvgMath
            x={RULER_X + 16}
            y={py}
            math={showHeight ? `${mathNumber(h, 1)}\\text{ m}` : '\\text{altura?}'}
            anchor="start"
            space={W - RULER_X - 18}
            tone={2}
            fontSize={13}
            halo
          />
          <SvgMath x={RULER_X + 16} y={CY + (above ? 16 : -16)} math="\text{centro}" anchor="start" space={W - RULER_X - 18} fontSize={11} />
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          A roda girou <strong>{turnText(shown)}</strong>.
          {above && ' A cadeirinha está acima do centro.'}
          {below && ' A cadeirinha está abaixo do centro.'}
          {!above && !below && ' A cadeirinha está na altura do centro.'}
        </p>
        {showHeight ? (
          <p>
            <Formula math={`\\sen ${shown}^\\circ ${rel(s, 3)} ${mathNumber(s)}`} />, então{' '}
            <Formula
              math={`h = 22 + 20 \\times ${paren(mathNumber(s), s)} ${rel(h, 1)} ${mathNumber(h, 1)}\\text{ m}`}
            />
            .
          </p>
        ) : (
          <p>Que altura é essa, em metros? A lição constrói a ferramenta que responde.</p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro da roda: {deg}°</span>
          <input
            type="range"
            min={0}
            max={max}
            step={5}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            disabled={playing}
            aria-label="Giro da roda em graus"
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
