import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage, arcPath, onCircle} from '../mathviz/useAnimation';

// A definição de 1 radiano, acontecendo: um barbante do tamanho do raio é
// levantado, encostado na borda e enrolado nela; depois saem as duas linhas do
// centro e aparece o ângulo.
//
// O enrolamento é o de um barbante de verdade, sem esticar nem encolher: a
// parte já enrolada fica sobre a circunferência, e a parte ainda solta segue
// reta pela tangente a partir do último ponto enrolado. Assim o comprimento do
// barbante é o mesmo em todos os quadros — que é justamente o ponto: o arco
// final tem o comprimento do raio.
//
// Etapas (segundos):
//   0,0–1,2  uma cópia do raio gira em torno da ponta e fica em pé na borda;
//   1,4–3,4  o barbante se enrola na borda;
//   3,5–4,3  as duas linhas do centro e o ângulo aparecem;
//   4,3–5,0  o valor em graus aparece.

const W = 420;
const H = 300;
const CX = 150;
const CY = 196;
const R = 104;
const N = 60;
const DURATION = 5;

function stringPoints(t) {
  const lift = stage(t, 0, 1.2); // 0: deitado sobre o raio; 1: em pé
  const wrap = stage(t, 1.4, 3.4); // fração do barbante já enrolada
  const pts = [];
  const bx = CX + R;
  const by = CY;
  if (wrap === 0) {
    // Gira em torno da ponta (bx, by): de apontar para o centro (ângulo π)
    // até apontar para cima (ângulo π/2).
    const phi = Math.PI - (lift * Math.PI) / 2;
    for (let i = 0; i <= N; i += 1) {
      const u = (R * i) / N;
      pts.push([bx + u * Math.cos(phi), by - u * Math.sin(phi)]);
    }
    return pts;
  }
  const w = wrap * R; // comprimento já enrolado
  const a = w / R; // ângulo do último ponto enrolado
  const [px, py] = onCircle(CX, CY, R, a);
  // direção da tangente (anti-horária), já no sistema do SVG
  const tx = -Math.sin(a);
  const ty = -Math.cos(a);
  for (let i = 0; i <= N; i += 1) {
    const u = (R * i) / N;
    if (u <= w) pts.push(onCircle(CX, CY, R, u / R));
    else pts.push([px + (u - w) * tx, py + (u - w) * ty]);
  }
  return pts;
}

export default function RadianString({
  caption = 'Um barbante do tamanho do raio, colado na borda. A abertura entre as duas linhas que saem do centro é 1 radiano.',
}) {
  const {ref, t, play} = useAnimation({duration: DURATION});
  const pts = stringPoints(t);
  const lines = stage(t, 3.5, 4.3);
  const degrees = stage(t, 4.3, 5.0);
  const labelString = 1 - stage(t, 1.4, 2.2);
  const [ex, ey] = onCircle(CX, CY, R, 1);
  const [lx, ly] = onCircle(CX, CY, 52, 0.5);
  const [sx, sy] = onCircle(CX, CY, R + 24, 0.5);

  return (
    <div className={shared.wrapper} data-explorer="radian-string">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label="Um barbante do tamanho do raio é enrolado na borda do círculo. O ângulo central que ele determina é 1 radiano, cerca de 57,3 graus."
        >
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.5} />
          <line x1={CX} y1={CY} x2={CX + R} y2={CY} stroke="var(--ifm-font-color-base)" strokeWidth={3} strokeLinecap="round" />
          <SvgMath x={CX + R / 2} y={CY + 16} math="r" fontSize={16} />

          <g opacity={lines}>
            <line x1={CX} y1={CY} x2={ex} y2={ey} stroke="var(--ifm-font-color-base)" strokeWidth={3} strokeLinecap="round" />
            <path d={arcPath(CX, CY, 30, 0, 1)} fill="none" stroke="var(--mv-tone-1)" strokeWidth={2} />
            <SvgMath x={lx} y={ly} math="1\text{ rad}" tone={1} fontSize={15} halo />
          </g>

          <polyline
            points={pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
            fill="none"
            stroke="var(--mv-tone-2)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g opacity={labelString}>
            <SvgMath x={CX + R + 14} y={CY - R / 2} math="\text{barbante} = r" anchor="start" space={W - CX - R - 16} tone={2} fontSize={14} />
          </g>
          <g opacity={lines}>
            <SvgMath x={sx} y={sy} math="\text{arco} = r" anchor="start" space={W - sx - 4} tone={2} fontSize={14} />
          </g>
          <g opacity={degrees}>
            <SvgMath x={W - 20} y={H - 30} math="1\text{ rad} \approx 57{,}3^\circ" anchor="end" tone={1} fontSize={17} />
          </g>
          <circle cx={CX} cy={CY} r={4} fill="var(--ifm-font-color-base)" />
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
