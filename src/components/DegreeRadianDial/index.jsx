import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {arcPath, onCircle, fmt, piFraction, fractionOf180} from '../mathviz/useAnimation';

// Um mostrador com duas escalas, como o velocímetro com km/h e mph: graus por
// fora, radianos por dentro. O ponteiro é o mesmo; só muda a régua em que se
// lê o ângulo.
//
// O painel faz a conversão pelo raciocínio que a lição ensina primeiro — "que
// pedaço de 180° é esse? pegue o mesmo pedaço de π" — e não pela fórmula
// × π/180, que vem depois como resumo desse raciocínio.
//
// Os pedaços coloridos da borda são raios colados, como na figura da contagem
// de raios (RadianCount): o aluno vê quantos raios cabem até o ponteiro.

const S = 400;
const C = 200;
const R = 132;
const OUTER = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const INNER = [
  [0, '0'],
  [90, '\\frac{\\pi}{2}'],
  [180, '\\pi'],
  [270, '\\frac{3\\pi}{2}'],
];

const tone = (k) => (k % 2 ? 'var(--mv-tone-3)' : 'var(--mv-tone-2)');

export default function DegreeRadianDial({
  initial = 135,
  caption = 'O mesmo ponteiro lido em duas escalas: graus por fora, radianos por dentro. Os pedaços coloridos da borda são raios colados.',
}) {
  const [deg, setDeg] = useState(initial);
  const th = (deg * Math.PI) / 180;
  const [px, py] = onCircle(C, C, R - 6, th);

  const pieces = [];
  for (let k = 0; k < 7; k += 1) {
    const b = Math.min(th, k + 1);
    if (b > k) {
      pieces.push(
        <path key={k} d={arcPath(C, C, R, k, b)} fill="none" stroke={tone(k)} strokeWidth={7} />,
      );
    }
  }

  let reasoning;
  if (deg === 0) {
    reasoning = <>Sem giro: <Formula math="0^\circ = 0\text{ rad}" />.</>;
  } else if (deg === 180) {
    reasoning = <>É a meia volta inteira, então é o <Formula math="\pi" /> inteiro: <Formula math="180^\circ = \pi\text{ rad}" />.</>;
  } else {
    reasoning = (
      <>
        <Formula math={`${deg}^\\circ`} /> são <Formula math={fractionOf180(deg)} /> de{' '}
        <Formula math="180^\circ" />. Então o ângulo é <Formula math={fractionOf180(deg)} /> de{' '}
        <Formula math="\pi" />: <Formula math={`${piFraction(deg)}\\text{ rad} \\approx ${fmt(th, 2).replace(',', '{,}')}\\text{ rad}`} />.
      </>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="degree-radian-dial">
      <figure className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${S} ${S}`}
          style={{maxWidth: '380px'}}
          role="img"
          aria-label={`Mostrador: ${deg} graus, que são ${fmt(th, 2)} radianos.`}
        >
          <circle cx={C} cy={C} r={R} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          {Array.from({length: 24}, (_, i) => i * 15).map((d) => {
            const a = (d * Math.PI) / 180;
            const long = d % 90 === 0;
            const [x1, y1] = onCircle(C, C, R, a);
            const [x2, y2] = onCircle(C, C, R + (long ? 14 : 8), a);
            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ifm-font-color-base)" strokeWidth={long ? 2 : 1} />;
          })}
          {OUTER.map((d) => {
            const [x, y] = onCircle(C, C, R + 34, (d * Math.PI) / 180);
            return <SvgMath key={d} x={x} y={y} math={`${d}^\\circ`} fontSize={d % 90 === 0 ? 15 : 12} />;
          })}
          {INNER.map(([d, tex]) => {
            const [x, y] = onCircle(C, C, R - 30, (d * Math.PI) / 180);
            return <SvgMath key={d} x={x} y={y} math={tex} tone={1} fontSize={16} />;
          })}
          {pieces}
          <line x1={C} y1={C} x2={px} y2={py} stroke="var(--ifm-font-color-base)" strokeWidth={3} strokeLinecap="round" />
          <circle cx={C} cy={C} r={5} fill="var(--ifm-font-color-base)" />
          <SvgMath x={C} y={C + 44} math="\text{graus por fora}" fontSize={11} />
          <SvgMath x={C} y={C + 60} math="\text{radianos por dentro}" tone={1} fontSize={11} />
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p style={{fontSize: '1.15rem'}}>
          <Formula math={`${deg}^\\circ = ${piFraction(deg)}\\text{ rad}`} />
        </p>
        <p>{reasoning}</p>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo: {deg}°</span>
          <span className={shared.hint}>De 15° em 15°. Antes de soltar, tente prever a fração de π.</span>
          <input
            type="range"
            min={0}
            max={360}
            step={15}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            aria-label="Ângulo em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
      </div>
    </div>
  );
}
