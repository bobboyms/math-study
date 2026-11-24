import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, piFraction} from '../mathviz/useAnimation';
import {makeFrame} from '../WaveTracer/frame';
import {curvePath} from '../WaveTracer/wave';

// A curva y = sen(x + h) desliza para a esquerda conforme h cresce, sobre o
// cosseno tracejado, que fica parado. Em h = π/2 as duas coincidem:
// cos x = sen(x + π/2). Em h = π a curva cai sobre −sen x (de cabeça para
// baixo), que NÃO é o cosseno. Ao aparecer, h anda de 0 até π/2.
//
// A seta acompanha um pico: do pico original do seno até onde ele foi parar.

const STEP = Math.PI / 12; // 15°
const X0 = -Math.PI - 0.2;
const X1 = 2.5 * Math.PI + 0.3;
const DURATION = 3;

export default function WaveShift({initial = 6, caption}) {
  const [k, setK] = useState(initial); // h = k · π/12
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const kShown = playing ? ease(t / DURATION) * k : k;
  const h = kShown * STEP;
  const fr = makeFrame({xMin: X0, xMax: X1, yMin: -1.35, yMax: 1.6, G: 48, K: 58, top: 12, labelZero: false});
  const {gx, gy, W, H} = fr;

  const peak = h <= Math.PI + 1e-9 ? Math.PI / 2 : 2.5 * Math.PI;
  const moved = peak - h;
  const yArrow = 1.32;
  const hTex = k === 0 ? '0' : piFraction(15 * k);

  let status;
  if (k === 6) status = <>A curva deslocada caiu sobre o cosseno: <Formula math="\cos x = \sen\left(x + \frac{\pi}{2}\right)" />.</>;
  else if (k === 12) status = <>Meia volta: a curva caiu sobre <Formula math="-\sen x" />, o seno de cabeça para baixo. Ela <strong>não</strong> coincide com o cosseno.</>;
  else if (k === 18) status = <>Três quartos de volta: a curva caiu sobre <Formula math="-\cos x" />.</>;
  else if (k === 24 || k === 0) status = <>{k === 0 ? 'Sem deslocamento: ' : 'Uma volta inteira: '}a curva é o próprio seno.</>;
  else status = <>A curva laranja não coincide com o cosseno tracejado. Continue arrastando.</>;

  return (
    <div className={shared.wrapper} data-explorer="wave-shift">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="A curva y = sen(x + h) deslizando para a esquerda sobre o cosseno.">
          {fr.axes}
          <path d={curvePath(Math.sin, X0, X1, gx, gy)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.5} />
          <path d={curvePath(Math.cos, X0, X1, gx, gy)} fill="none" stroke="var(--mv-tone-3)" strokeWidth={3} strokeDasharray="7 5" />
          <path d={curvePath((x) => Math.sin(x + h), X0, X1, gx, gy)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2.5} />
          {h > 0.05 && (
            <g>
              <line x1={gx(peak)} y1={gy(yArrow)} x2={gx(moved) + 7} y2={gy(yArrow)} stroke="var(--mv-tone-1)" strokeWidth={2} />
              <path d={`M ${gx(moved)} ${gy(yArrow)} l 8 -4.5 v 9 z`} fill="var(--mv-tone-1)" />
              <line x1={gx(peak)} y1={gy(yArrow) - 5} x2={gx(peak)} y2={gy(1)} stroke="var(--mv-tone-1)" strokeWidth={1} strokeDasharray="2 2" />
              {!playing && <SvgMath x={(gx(peak) + gx(moved)) / 2} y={gy(yArrow) - 12} math={`h = ${hTex}`} tone={1} fontSize={13} halo />}
            </g>
          )}
        </svg>
        <figcaption className={geo.caption}>
          {caption ?? 'Cinza: sen x, parado. Laranja: sen(x + h), que desliza para a esquerda conforme h cresce. Verde tracejado: cos x. A seta liga um pico do seno ao lugar para onde ele foi.'}
        </figcaption>
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <Formula math={`h = ${hTex}`} /> (ou {15 * k}°): a curva laranja é{' '}
          <Formula math={k === 0 ? 'y = \\sen x' : `y = \\sen\\left(x + ${hTex}\\right)`} />.
        </p>
        <p>{playing ? 'A curva laranja está deslizando para a esquerda.' : status}</p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Deslocamento h: {15 * k}°</span>
          <input type="range" min={0} max={24} step={1} value={k}
            onChange={(e) => setK(Number(e.target.value))} disabled={playing}
            aria-label="Deslocamento h, de 15 em 15 graus" aria-valuetext={`${15 * k} graus`} />
        </label>
      </div>
      <div className={shared.buttons}>
        {[6, 12, 24].map((p) => (
          <button key={p} type="button" onClick={() => setK(p)} disabled={playing}>
            {p === 6 ? 'h = π/2' : p === 12 ? 'h = π' : 'h = 2π'}
          </button>
        ))}
        <button type="button" onClick={() => play()}>Ver o deslize de novo</button>
      </div>
    </div>
  );
}
