import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath} from '../mathviz/useAnimation';

// A relação fundamental como identidade: vale para todo giro.
//
// À esquerda, o ciclo com o triângulo do ponto P: cosseno (verde) no eixo
// horizontal, seno (laranja) subindo até P, raio 1 (azul). À direita, duas
// réguas com a mesma escala:
//
// - na de cima, os QUADRADOS: um trecho verde de comprimento cos²θ seguido de
//   um laranja de comprimento sen²θ. Os dois juntos terminam sempre no 1,
//   em qualquer giro;
// - na de baixo, os números SEM quadrado: a seta verde anda cos θ e a laranja
//   anda sen θ a partir dali (para a esquerda quando o número é negativo). O
//   ponto final muda com o giro e quase nunca cai no 1.
//
// Ao entrar na tela, o giro varre de 0° até `initial`; depois o aluno arrasta.

const D = Math.PI / 180;

function head(x, y, dx, size = 7) {
  const s = Math.sign(dx) || 1;
  return `M ${x} ${y} L ${x - s * size} ${y - size * 0.55} L ${x - s * size} ${y + size * 0.55} Z`;
}

const tidy = (v) => (Math.abs(v) < 1e-9 ? 0 : v);
const rel = (v, d = 3) => (Math.abs(v - Number(v.toFixed(d))) < 1e-9 ? '=' : '\\approx');

// --- ciclo ----------------------------------------------------------------
const CW = 250;
const CH = 250;
const CCX = 125;
const CCY = 125;
const CR = 88;

function Cycle({deg}) {
  const th = deg * D;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const px = CCX + CR * c;
  const py = CCY - CR * s;
  const fx = px; // pé da perpendicular no eixo horizontal
  const thr = ((deg % 360) + 360) % 360;
  return (
    <svg className={geo.svg} viewBox={`0 0 ${CW} ${CH}`} style={{maxWidth: `${CW}px`}} role="img"
      aria-label={`Ciclo de raio 1 com o ponto P no giro de ${deg} graus e o triângulo de catetos cosseno e seno.`}>
      <line x1={10} y1={CCY} x2={CW - 10} y2={CCY} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
      <line x1={CCX} y1={CH - 10} x2={CCX} y2={10} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
      <circle cx={CCX} cy={CCY} r={CR} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.75} />
      {thr > 2 && <path d={arcPath(CCX, CCY, 20, 0, thr * D)} fill="none" stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.25} />}
      {/* raio = hipotenusa */}
      <line x1={CCX} y1={CCY} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={2.5} />
      {/* cosseno no eixo horizontal */}
      {Math.abs(c) > 0.01 && <line x1={CCX} y1={CCY} x2={fx} y2={CCY} stroke="var(--mv-tone-3)" strokeWidth={4} strokeLinecap="round" />}
      {/* seno: do pé até P */}
      {Math.abs(s) > 0.01 && <line x1={fx} y1={CCY} x2={px} y2={py} stroke="var(--mv-tone-2)" strokeWidth={4} strokeLinecap="round" />}
      <circle cx={px} cy={py} r={4.5} fill="var(--ifm-font-color-base)" />
      <SvgMath x={px + (c >= 0 ? 12 : -12)} y={py + (s >= 0 ? -12 : 12)} math="P" anchor={c >= 0 ? 'start' : 'end'} fontSize={14} halo />
      {/* 1 no meio do raio, do lado de fora do triângulo */}
      {(() => {
        const mx = (CCX + px) / 2;
        const my = (CCY + py) / 2;
        // normal ao raio, apontando para longe do triângulo
        const nx = -Math.sin(th) * (c * s >= 0 ? 1 : -1);
        const ny = -Math.cos(th) * (c * s >= 0 ? 1 : -1);
        return <SvgMath x={mx + 13 * nx} y={my + 13 * ny} math="1" tone={1} fontSize={14} halo />;
      })()}
    </svg>
  );
}

// --- réguas ---------------------------------------------------------------
const RW = 380;
const RH = 225;
const X0 = 30;
const X1 = RW - 20;
const MIN = -1.5;
const MAX = 1.5;
const X = (v) => X0 + ((v - MIN) / (MAX - MIN)) * (X1 - X0);
const ROW1 = 70;
const ROW2 = 180;

function Rulers({deg}) {
  const th = deg * D;
  const c = tidy(Math.cos(th));
  const s = tidy(Math.sin(th));
  const c2 = c * c;
  const sum = c + s;
  const hits = Math.abs(sum - 1) < 1e-9;
  const ticks = [-1, 0, 1];
  const ruler = (y) => (
    <>
      <line x1={X0 - 10} y1={y} x2={X1 + 8} y2={y} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={y - 5} x2={X(v)} y2={y + 5} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <SvgMath x={X(v)} y={y + 18} math={v < 0 ? '-1' : String(v)} fontSize={12} />
        </g>
      ))}
    </>
  );
  return (
    <svg className={geo.svg} viewBox={`0 0 ${RW} ${RH}`} style={{maxWidth: `${RW}px`}} role="img"
      aria-label={`Na régua de cima, cosseno ao quadrado mais seno ao quadrado termina em 1. Na de baixo, cosseno mais seno termina em ${mathNumber(sum, 2)}.`}>
      {/* linha do 1, atravessando as duas réguas */}
      <line x1={X(1)} y1={ROW1 - 30} x2={X(1)} y2={ROW1 + 6} stroke="var(--mv-tone-1)" strokeWidth={1.25} strokeDasharray="5 4" />
      <line x1={X(1)} y1={ROW1 + 28} x2={X(1)} y2={ROW2 + 6} stroke="var(--mv-tone-1)" strokeWidth={1.25} strokeDasharray="5 4" />

      <SvgMath x={X0 - 10} y={ROW1 - 44} math="\cos^2\theta + \sen^2\theta" anchor="start" fontSize={14} />
      {ruler(ROW1)}
      {c2 > 0.002 && <rect x={X(0)} y={ROW1 - 16} width={X(c2) - X(0)} height={11} fill="var(--mv-tone-3)" rx={2} />}
      {1 - c2 > 0.002 && <rect x={X(c2)} y={ROW1 - 16} width={X(1) - X(c2)} height={11} fill="var(--mv-tone-2)" rx={2} />}

      <SvgMath x={X0 - 10} y={ROW2 - 50} math="\cos\theta + \sen\theta" anchor="start" fontSize={14} />
      {ruler(ROW2)}
      {Math.abs(c) > 0.01 && (
        <>
          <line x1={X(0)} y1={ROW2 - 24} x2={X(c)} y2={ROW2 - 24} stroke="var(--mv-tone-3)" strokeWidth={3.5} />
          <path d={head(X(c), ROW2 - 24, c)} fill="var(--mv-tone-3)" />
        </>
      )}
      {Math.abs(s) > 0.01 && (
        <>
          <line x1={X(c)} y1={ROW2 - 14} x2={X(sum)} y2={ROW2 - 14} stroke="var(--mv-tone-2)" strokeWidth={3.5} />
          <path d={head(X(sum), ROW2 - 14, s)} fill="var(--mv-tone-2)" />
        </>
      )}
      <line x1={X(c)} y1={ROW2 - 28} x2={X(c)} y2={ROW2 - 10} stroke="var(--ifm-color-emphasis-500)" strokeWidth={1} strokeDasharray="2 2" />
      <circle cx={X(sum)} cy={ROW2} r={5} fill={hits ? 'var(--mv-tone-1)' : 'var(--ifm-font-color-base)'} />
    </svg>
  );
}

export default function IdentityBars({
  initial = 300,
  duration = 5,
  caption = 'Arraste o giro. Em cima, os quadrados: o trecho verde mede cos²θ, o laranja mede sen²θ, e juntos terminam sempre no 1. Embaixo, os números sem o quadrado: a soma cos θ + sen θ muda com o giro e quase nunca cai no 1.',
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration});
  const shown = playing ? Math.round(ease(t / duration) * deg) : deg;
  const th = shown * D;
  const c = tidy(Math.cos(th));
  const s = tidy(Math.sin(th));
  const c2 = c * c;
  const s2 = s * s;
  const sum = c + s;

  return (
    <div className={shared.wrapper} data-explorer="identity-bars">
      <figure ref={ref} className={geo.figure} style={{margin: 0}}>
        <div className={shared.plots}>
          <Cycle deg={shown} />
          <Rulers deg={shown} />
        </div>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <div className={shared.formula}>
          <Formula math={`\\theta = ${shown}^\\circ`} />
        </div>
        <div className={shared.formula}>
          <Formula math={`\\cos\\theta ${rel(c)} ${mathNumber(c)} \\qquad \\sen\\theta ${rel(s)} ${mathNumber(s)}`} />
        </div>
        <div className={shared.formula}>
          <Formula math={`\\cos^2\\theta + \\sen^2\\theta ${rel(c2) === '=' && rel(s2) === '=' ? '=' : '\\approx'} ${mathNumber(c2)} + ${mathNumber(s2)} = 1`} />
        </div>
        <div className={shared.formula}>
          <Formula math={`\\cos\\theta + \\sen\\theta ${rel(sum)} ${mathNumber(sum)}${Math.abs(sum - 1) < 1e-9 ? '' : ' \\neq 1'}`} />
        </div>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro: {deg}°</span>
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
        {[0, 45, 140, 225, 300].map((p) => (
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
