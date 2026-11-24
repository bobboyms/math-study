import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease, arcPath, onCircle} from '../mathviz/useAnimation';

// Setor circular com deslizantes de ângulo e de raio: o aspersor da lição de
// arco e setor.
//
// O setor (tom 1) abre simétrico em torno da vertical, como o jato de um
// aspersor. O arco sai grosso no tom 2: é o comprimento s. A circunferência
// inteira fica em cinza, para o aluno comparar a fatia com o todo. Ao aparecer
// na tela, o jato varre de 0 até o ângulo inicial.
//
// `showFormulas` liga o painel com as contas (θ em radianos, s = rθ,
// A = ½r²θ, borda 2r + s). Desligado, no problema motivador, o painel só
// mostra a fração da volta e pergunta a área e a borda.
//
// `inner` transforma o setor num setor de coroa (o limpador de para-brisa):
// a parte de dentro do raio interno fica vazia, e o painel faz
// A = ½θ(R² − r²).

const W = 400;
const H = 270;
const CX = W / 2;
const CY = 238;
const MAXPX = 200; // raio máximo em pixels
const DURATION = 2.5;
const D = Math.PI / 180;

function sectorPath(r1, r2, a0, a1) {
  const [x1, y1] = onCircle(CX, CY, r2, a0);
  const [x2, y2] = onCircle(CX, CY, r2, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  if (r1 <= 0.5) {
    return `M ${CX} ${CY} L ${x1} ${y1} A ${r2} ${r2} 0 ${large} 0 ${x2} ${y2} Z`;
  }
  const [x3, y3] = onCircle(CX, CY, r1, a1);
  const [x4, y4] = onCircle(CX, CY, r1, a0);
  return `M ${x4} ${y4} L ${x1} ${y1} A ${r2} ${r2} 0 ${large} 0 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 ${large} 1 ${x4} ${y4} Z`;
}

const num = (v, d = 2) => mathNumber(v, d);
const approx = (v, d) => (Math.abs(v - Number(v.toFixed(d))) < 1e-9 ? '=' : '\\approx');

export default function SectorExplorer({
  initialDeg = 120,
  initialR = 8,
  rMax = 10,
  inner = null,
  unit = 'm',
  showFormulas = true,
  caption,
}) {
  const [deg, setDeg] = useState(initialDeg);
  const [r, setR] = useState(initialR);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const shownDeg = playing ? Math.round(ease(t / DURATION) * deg) : deg;

  const px = MAXPX / rMax; // pixels por unidade de comprimento
  const R = r * px;
  const Ri = inner ? inner * px : 0;
  const th = shownDeg * D;
  const a0 = Math.PI / 2 - th / 2;
  const a1 = Math.PI / 2 + th / 2;

  const thRad = deg * D;
  const s = r * thRad;
  const A = inner ? 0.5 * thRad * (r * r - inner * inner) : 0.5 * r * r * thRad;
  const per = 2 * r + s;
  const frac = deg / 360;

  const [lx, ly] = onCircle(CX, CY, inner ? Ri + 16 : 30, Math.PI / 2);
  const [sx, sy] = onCircle(CX, CY, R + 16, Math.PI / 2);
  const [rx, ry] = onCircle(CX, CY, R * 0.55, a0);

  const u2 = `\\text{ ${unit}}^2`;
  const u1 = `\\text{ ${unit}}`;
  const defaultCaption = inner
    ? 'A palheta varre a faixa entre o raio interno e o externo. A área limpa é o setor grande menos o setor pequeno.'
    : 'O jato cobre uma fatia do círculo: um setor. O arco grosso é a parte curva da borda.';

  return (
    <div className={shared.wrapper} data-explorer="sector">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Setor de raio ${r} e ângulo de ${shownDeg} graus.`}
        >
          {/* metade de cima da circunferência inteira, para comparar */}
          <path d={arcPath(CX, CY, R, 0, Math.PI)} fill="none" stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="5 4" />
          <line x1={CX - MAXPX - 4} y1={CY} x2={CX + MAXPX + 4} y2={CY} stroke="var(--mv-guide)" strokeWidth={1} />

          {th > 0.005 && (
            <>
              <path d={sectorPath(Ri, R, a0, a1)} fill="var(--mv-tone-1)" fillOpacity={0.18} stroke="var(--mv-tone-1)" strokeWidth={2} strokeLinejoin="round" />
              <path d={arcPath(CX, CY, R, a0, a1)} fill="none" stroke="var(--mv-tone-2)" strokeWidth={5} strokeLinecap="round" />
              {inner && <path d={arcPath(CX, CY, Ri, a0, a1)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={2} />}
              {!inner && <path d={arcPath(CX, CY, 22, a0, a1)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={1.5} />}
            </>
          )}
          {shownDeg >= 25 && <SvgMath x={lx} y={ly - 2} math={`${shownDeg}^\\circ`} tone={1} fontSize={12} halo />}
          {!playing && th > 0.2 && (
            <SvgMath x={sx} y={sy} math="s" tone={2} fontSize={15} halo />
          )}
          {/* Rótulo do raio: começa um pouco abaixo e à direita do meio do raio
              da direita, e cresce para a direita, longe da linha. */}
          {!playing && th > 0.2 && (
            <SvgMath
              x={rx + 8}
              y={ry + 12}
              math={`${inner ? 'R' : 'r'} = ${mathNumber(r, 1)}`}
              anchor="start"
              space={W - rx - 10}
              tone={1}
              fontSize={12}
              halo
            />
          )}
          {inner && !playing && th > 0.2 && (() => {
            const [ix, iy] = onCircle(CX, CY, Ri, a0);
            return (
              <>
                <line x1={CX} y1={CY} x2={ix} y2={iy} stroke="var(--ifm-font-color-base)" strokeWidth={1.25} strokeDasharray="4 3" />
                <SvgMath x={ix + 8} y={iy + 12} math={`r = ${mathNumber(inner, 1)}`} anchor="start" space={W - ix - 10} fontSize={11} halo />
              </>
            );
          })()}
          <circle cx={CX} cy={CY} r={4} fill="var(--ifm-font-color-base)" />
        </svg>
        <figcaption className={geo.caption}>{caption ?? defaultCaption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Ângulo de <strong>{deg}°</strong>: a fração{' '}
          <Formula math={`\\frac{${deg}}{360} ${approx(frac, 3)} ${num(frac, 3)}`} /> da volta.
        </p>
        {showFormulas ? (
          <>
            <div className={shared.formula}>
              <Formula math={`\\theta = ${deg} \\times \\frac{\\pi}{180} \\approx ${num(thRad, 4)}\\text{ rad}`} />
            </div>
            {inner ? (
              <div className={shared.formula}>
                <Formula
                  math={`A = \\frac{1}{2}\\theta(R^2 - r^2) \\approx \\frac12 \\times ${num(thRad, 4)} \\times (${num(r * r, 2)} - ${num(inner * inner, 2)}) \\approx ${num(A, 1)}${u2}`}
                />
              </div>
            ) : (
              <>
                <div className={shared.formula}>
                  <Formula math={`s = r\\theta \\approx ${mathNumber(r, 1)} \\times ${num(thRad, 4)} \\approx ${num(s, 2)}${u1}`} />
                </div>
                <div className={shared.formula}>
                  <Formula
                    math={`A = \\frac12 r^2\\theta \\approx \\frac12 \\times ${num(r * r, 2)} \\times ${num(thRad, 4)} \\approx ${num(A, 1)}${u2}`}
                  />
                </div>
                <div className={shared.formula}>
                  <Formula math={`\\text{borda} = 2r + s \\approx ${num(2 * r, 1)} + ${num(s, 2)} \\approx ${num(per, 2)}${u1}`} />
                </div>
              </>
            )}
          </>
        ) : (
          <p>Que área o jato cobre? E quantos metros tem a borda da fatia?</p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ângulo: {deg}°</span>
          <input
            type="range"
            min={5}
            max={180}
            step={5}
            value={deg}
            onChange={(event) => setDeg(Number(event.target.value))}
            disabled={playing}
            aria-label="Ângulo do setor em graus"
            aria-valuetext={`${deg} graus`}
          />
        </label>
        <label className={shared.control}>
          <span>
            {inner ? 'Raio externo' : 'Raio'}: {String(r).replace('.', ',')} {unit}
          </span>
          <input
            type="range"
            min={inner ? inner + 1 : 1}
            max={rMax}
            step={inner ? 1 : 0.5}
            value={r}
            onChange={(event) => setR(Number(event.target.value))}
            disabled={playing}
            aria-label="Raio"
            aria-valuetext={`${r} ${unit}`}
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
