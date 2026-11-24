import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import {arcPath, onCircle} from '../mathviz/useAnimation';
import {num, rel} from '../WaveTracer/wave';

// Em radianos, a entrada e a saída do seno se medem com a mesma régua.
// Um quarto do círculo de raio 1, ampliado. O arco percorrido (tom 1) mede x,
// porque o ângulo em radianos é o comprimento do arco no círculo de raio 1.
// A altura do ponto (tom 2) mede sen x. À direita, os dois comprimentos
// esticados lado a lado, no mesmo chão: para x pequeno, quase iguais.

const R = 170;
const CX = 34;
const CY = 300;
const BAR_X = CX + R + 62;
const W = BAR_X + 150;
const H = CY + 30;

export default function ArcHeightCompare({initial = 50}) {
  const [x100, setX100] = useState(initial); // x em centésimos de radiano
  const x = x100 / 100;
  const s = Math.sin(x);
  const [px, py] = onCircle(CX, CY, R, x);
  const deg = (x * 180) / Math.PI;

  return (
    <div className={shared.wrapper} data-explorer="arc-height">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Arco de ${num(x, 2)} raio e altura de ${num(s, 3)} raio.`}>
          <line x1={CX - 10} y1={CY} x2={CX + R + 24} y2={CY} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <line x1={CX} y1={CY + 10} x2={CX} y2={CY - R - 24} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <path d={arcPath(CX, CY, R, 0, Math.PI / 2)} fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
          <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--mv-guide)" strokeWidth={1.5} />
          <path d={arcPath(CX, CY, R, 0, x)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={5} strokeLinecap="round" />
          <line x1={px} y1={CY} x2={px} y2={py} stroke="var(--mv-tone-2)" strokeWidth={4} strokeLinecap="round" />
          <circle cx={px} cy={py} r={4.5} fill="var(--ifm-font-color-base)" />
          <SvgMath x={CX + R + 4} y={CY + 16} math="1" fontSize={13} />
          <SvgMath x={CX - 6} y={CY - R} math="1" anchor="end" fontSize={13} space={20} />
          <SvgMath x={CX + 8} y={CY - 14} math="0" anchor="start" fontSize={12} space={20} />

          {/* os dois comprimentos esticados no mesmo chão */}
          <line x1={BAR_X - 24} y1={CY} x2={BAR_X + 104} y2={CY} stroke="var(--ifm-color-emphasis-700)" strokeWidth={1.5} />
          <line x1={CX} y1={CY - R} x2={BAR_X + 104} y2={CY - R} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="4 4" />
          <SvgMath x={BAR_X + 106} y={CY - R} math="1\ \text{raio}" anchor="start" fontSize={12} space={60} />
          <rect x={BAR_X} y={CY - x * R} width={26} height={x * R} fill="var(--mv-tone-1)" fillOpacity={0.35} stroke="var(--mv-tone-1)" strokeWidth={2} />
          <rect x={BAR_X + 52} y={CY - s * R} width={26} height={s * R} fill="var(--mv-tone-2)" fillOpacity={0.35} stroke="var(--mv-tone-2)" strokeWidth={2} />
          <SvgMath x={BAR_X + 13} y={CY + 16} math="x" tone={1} fontSize={14} />
          <SvgMath x={BAR_X + 65} y={CY + 16} math="\sen x" tone={2} fontSize={14} />
        </svg>
        <figcaption className={geo.caption}>
          Azul: o arco percorrido, que mede x raios. Laranja: a altura do ponto, sen x. À direita, os dois esticados lado a lado, sobre o mesmo chão.
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Arco <Formula math={`x = ${num(x, 2)}`} />, altura{' '}
          <Formula math={`\\sen ${num(x, 2)} ${rel(s)} ${num(s)}`} />. A altura é{' '}
          <Formula math={`${rel(s / x)} ${num((s / x) * 100, 1)}\\%`} /> do arco.
        </p>
        <p>
          O mesmo giro em graus é <Formula math={`${rel(deg, 1)} ${num(deg, 1)}^\\circ`} />. O número{' '}
          <Formula math={num(deg, 1)} /> não é um comprimento medido em raios, e por isso não tem como se parecer
          com a altura <Formula math={num(s)} />.
        </p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Giro x, em radianos: {num(x, 2).replace('{,}', ',')}</span>
          <input type="range" min={5} max={157} step={1} value={x100}
            onChange={(e) => setX100(Number(e.target.value))}
            aria-label="Giro em radianos" aria-valuetext={`${num(x, 2).replace('{,}', ',')} radiano`} />
        </label>
      </div>
      <div className={shared.buttons}>
        {[10, 50, 100, 157].map((p) => (
          <button key={p} type="button" onClick={() => setX100(p)}>
            x = {num(p / 100, 2).replace('{,}', ',')}
          </button>
        ))}
      </div>
    </div>
  );
}
