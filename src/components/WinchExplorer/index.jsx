import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {
  ease,
  arcPath,
  onCircle,
  fmt,
  piFraction,
} from '../mathviz/useAnimation';

// O guincho do problema motivador da lição de radianos.
//
// O tambor gira, o cabo se enrola nele e a carga sobe. O desenho está em
// escala: o tambor tem 25 cm de raio e R pixels, então 1 cm vale R/25 pixels
// tanto na borda do tambor quanto na subida da carga. Por isso o arco laranja
// (cabo enrolado) e a barra laranja ao lado da carga (quanto ela subiu) têm o
// MESMO comprimento no desenho — é a observação que a lição quer que o aluno
// faça antes de qualquer fórmula.
//
// Na primeira vez que aparece na tela, o tambor gira de 0 até o ângulo
// inicial. Depois o aluno controla o giro pelo deslizante.
//
// `showRadians` acrescenta ao painel a conta em radianos; fica desligado no
// problema motivador, quando o radiano ainda não foi apresentado.

const W = 440;
// Com o giro máximo de 180°, a carga sobe 25π ≈ 78,5 cm ≈ 151 px e o topo
// dela para 6 px abaixo do tambor: a carga nunca encosta no desenho do tambor.
const H = 350;
const CX = 150;
const CY = 78;
const R = 48;
const DRUM_CM = 25;
const K = R / DRUM_CM; // pixels por centímetro
const GROUND = 336;
const LOAD_W = 64;
const LOAD_H = 44;
const LOAD_TOP0 = GROUND - 8 - LOAD_H; // topo da carga antes de girar
const BAR_X = CX + R + LOAD_W / 2 + 26;

export default function WinchExplorer({
  initial = 80,
  max = 180,
  showRadians = false,
  caption = 'O tambor gira, o cabo se enrola na borda e a carga sobe. O cabo enrolado (arco laranja) e a subida da carga (barra laranja) têm o mesmo comprimento.',
}) {
  const [deg, setDeg] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: 2.4});
  const shown = playing ? Math.round(ease(t / 2.4) * deg) : deg;

  const th = (shown * Math.PI) / 180;
  const sCm = DRUM_CM * th;
  const top = LOAD_TOP0 - sCm * K;
  const cableX = CX + R;
  const [mx, my] = onCircle(CX, CY, R, th);
  const midA = th / 2;
  const [lx, ly] = onCircle(CX, CY, 34, midA);

  return (
    <div className={shared.wrapper} data-explorer="winch">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Guincho: o tambor girou ${shown} graus e a carga subiu ${fmt(sCm, 1)} centímetros.`}
        >
          {/* chão e suporte */}
          <line x1={20} y1={GROUND} x2={W - 20} y2={GROUND} stroke="var(--ifm-color-emphasis-600)" strokeWidth={2} />
          <path
            d={`M ${CX - 52} ${GROUND} L ${CX} ${CY} L ${CX + 8} ${GROUND}`}
            fill="none"
            stroke="var(--mv-guide)"
            strokeWidth={5}
            strokeLinejoin="round"
          />

          {/* tambor */}
          <circle cx={CX} cy={CY} r={R} fill="var(--mv-paper)" stroke="var(--ifm-font-color-base)" strokeWidth={2.5} />
          <line x1={CX} y1={CY} x2={CX + R} y2={CY} stroke="var(--mv-guide)" strokeWidth={2} strokeDasharray="5 4" />
          <line x1={CX} y1={CY} x2={mx} y2={my} stroke="var(--mv-tone-1)" strokeWidth={3} strokeLinecap="round" />
          {th > 0.02 && (
            <path d={arcPath(CX, CY, 20, 0, th)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.75} />
          )}
          {th > 0.35 && (
            <SvgMath x={lx} y={ly} math={`${shown}^\\circ`} tone={1} fontSize={12} />
          )}
          {th > 0 && (
            <path d={arcPath(CX, CY, R, 0, th)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={7} strokeLinecap="round" />
          )}
          <circle cx={CX} cy={CY} r={4.5} fill="var(--ifm-font-color-base)" />
          <SvgMath x={CX} y={CY - R - 16} math="\text{tambor: raio } 25\text{ cm}" fontSize={13} />

          {/* cabo e carga */}
          <line x1={cableX} y1={CY} x2={cableX} y2={top} stroke="var(--ifm-font-color-base)" strokeWidth={2.5} />
          <rect
            x={cableX - LOAD_W / 2}
            y={LOAD_TOP0}
            width={LOAD_W}
            height={LOAD_H}
            rx={4}
            fill="none"
            stroke="var(--mv-guide)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <rect
            x={cableX - LOAD_W / 2}
            y={top}
            width={LOAD_W}
            height={LOAD_H}
            rx={4}
            fill="var(--mv-tone-1)"
            fillOpacity={0.22}
            stroke="var(--mv-tone-1)"
            strokeWidth={2}
          />
          <SvgMath x={cableX} y={top + LOAD_H / 2} math="\text{carga}" fontSize={13} />

          {/* quanto subiu */}
          {sCm > 0.5 && (
            <g stroke="var(--mv-tone-2)">
              <line x1={BAR_X} y1={LOAD_TOP0} x2={BAR_X} y2={top} strokeWidth={7} strokeLinecap="round" />
              <line x1={BAR_X - 9} y1={LOAD_TOP0} x2={BAR_X + 9} y2={LOAD_TOP0} strokeWidth={1.5} />
              <line x1={BAR_X - 9} y1={top} x2={BAR_X + 9} y2={top} strokeWidth={1.5} />
            </g>
          )}
          {sCm > 0.5 && (
            <SvgMath
              x={BAR_X + 14}
              y={(LOAD_TOP0 + top) / 2}
              math={`\\text{subiu } ${fmt(sCm, 1)}\\text{ cm}`}
              anchor="start"
              space={W - BAR_X - 16}
              tone={2}
              fontSize={13}
            />
          )}
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          O tambor girou <strong>{shown}°</strong> e a carga subiu{' '}
          <strong>{fmt(sCm, 1)} cm</strong>.
        </p>
        {showRadians && (
          <p>
            Em radianos:{' '}
            <Formula
              math={`${shown}^\\circ = ${piFraction(shown)}\\text{ rad} \\approx ${fmt(th, 3).replace(',', '{,}')}\\text{ rad}`}
            />
            , e <Formula math={`s = ${fmt(th, 3).replace(',', '{,}')} \\times 25 \\approx ${fmt(sCm, 1).replace(',', '{,}')}\\text{ cm}`} />.
          </p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro do tambor: {deg}°</span>
          <input
            type="range"
            min={0}
            max={max}
            step={5}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            aria-label="Giro do tambor em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>
          Ver o giro de novo
        </button>
      </div>
    </div>
  );
}
