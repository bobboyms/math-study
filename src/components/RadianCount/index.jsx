import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {arcPath, onCircle, fmt} from '../mathviz/useAnimation';

// Quantos raios cabem na volta? Barbantes do tamanho do raio são colados na
// borda, um depois do outro, e os mesmos barbantes aparecem esticados numa
// régua embaixo. As duas figuras estão na mesma escala: cada pedaço da régua
// tem exatamente o comprimento do raio desenhado.
//
// Os pedaços alternam duas cores só para dar para contar; os dois tons
// representam a mesma coisa (um raio de comprimento). O terceiro tom marca o
// ponteiro e os valores π/2, π e 2π.
//
// Os botões animam até um quarto de volta, meia volta ou a volta inteira, na
// mesma velocidade, para o aluno ver a contagem acontecer.

const W = 440;
const H = 330;
const R = 60;
const CX = 104;
const CY = 112;
const X0 = 24; // começo da régua
const RY = 286; // altura da régua
const SPEED = 1.25; // radianos por segundo

const TARGETS = [
  {key: 'quarto', label: 'Um quarto de volta', value: Math.PI / 2, tex: '\\frac{\\pi}{2}', deg: 90},
  {key: 'meia', label: 'Meia volta', value: Math.PI, tex: '\\pi', deg: 180},
  {key: 'volta', label: 'Volta inteira', value: 2 * Math.PI, tex: '2\\pi', deg: 360},
];

const tone = (k) => (k % 2 ? 'var(--mv-tone-3)' : 'var(--mv-tone-2)');

export default function RadianCount({
  initial = 'meia',
  caption = 'Cada pedaço colorido é um barbante do tamanho do raio. Em cima, colados na borda; embaixo, os mesmos pedaços esticados numa régua.',
}) {
  const [target, setTarget] = useState(
    TARGETS.find((item) => item.key === initial) ?? TARGETS[1],
  );
  const duration = target.value / SPEED;
  const {ref, t, play, playing} = useAnimation({duration});
  const th = playing || t < duration ? Math.min(target.value, t * SPEED) : target.value;
  const done = Math.abs(th - target.value) < 1e-9;

  const go = (item) => {
    setTarget(item);
    play({duration: item.value / SPEED});
  };

  const pieces = [];
  for (let k = 0; k < 7; k += 1) {
    const a = k;
    const b = Math.min(th, k + 1);
    if (b > a) {
      pieces.push(
        <g key={k}>
          <path d={arcPath(CX, CY, R, a, b)} fill="none" stroke={tone(k)} strokeWidth={6} />
          <line x1={X0 + a * R} y1={RY} x2={X0 + b * R} y2={RY} stroke={tone(k)} strokeWidth={7} />
        </g>,
      );
    }
  }
  const [px, py] = onCircle(CX, CY, R, th);

  return (
    <div className={shared.wrapper} data-explorer="radian-count">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Cabem ${fmt(th, 2)} raios na borda, o que corresponde a ${Math.round((th * 180) / Math.PI)} graus.`}
        >
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.25} />
          <line x1={CX - R - 8} y1={CY} x2={CX + R + 8} y2={CY} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="4 4" />
          {pieces}
          <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-1)" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={px} cy={py} r={4.5} fill="var(--mv-tone-1)" />
          <circle cx={CX} cy={CY} r={3} fill="var(--ifm-font-color-base)" />

          <SvgMath x={214} y={70} math={`${fmt(th, 2).replace(',', '{,}')}\\text{ raios}`} anchor="start" fontSize={20} />
          <SvgMath x={214} y={100} math={`${Math.round((th * 180) / Math.PI)}^\\circ`} anchor="start" fontSize={16} />
          {done && (
            <SvgMath x={214} y={136} math={`${target.tex}\\text{ rad} = ${target.deg}^\\circ`} anchor="start" tone={1} fontSize={17} />
          )}

          <SvgMath x={X0} y={RY - 44} math="\text{os mesmos barbantes, esticados:}" anchor="start" fontSize={12} />
          <line x1={X0} y1={RY} x2={X0 + 2 * Math.PI * R} y2={RY} stroke="var(--ifm-font-color-base)" strokeWidth={1} />
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <g key={k}>
              <line x1={X0 + k * R} y1={RY - 6} x2={X0 + k * R} y2={RY + 6} stroke="var(--ifm-font-color-base)" strokeWidth={1.25} />
              <SvgMath x={X0 + k * R} y={RY + 20} math={String(k)} fontSize={12} />
            </g>
          ))}
          {TARGETS.map((item) => (
            <g key={item.key}>
              <line x1={X0 + item.value * R} y1={RY - 12} x2={X0 + item.value * R} y2={RY + 4} stroke="var(--mv-tone-1)" strokeWidth={2} />
              <SvgMath x={X0 + item.value * R} y={RY - 24} math={item.tex} tone={1} fontSize={14} />
            </g>
          ))}
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>
      <div className={shared.buttons}>
        {TARGETS.map((item) => (
          <button key={item.key} type="button" onClick={() => go(item)} aria-pressed={target.key === item.key}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
