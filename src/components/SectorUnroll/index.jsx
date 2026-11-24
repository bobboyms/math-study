import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';

// O setor que vira triângulo: A = ½ × r × s.
//
// O setor abre para cima, com a ponta no centro. Ele está cortado em fatias
// finas, todas com a ponta no centro. A animação estica o arco sobre a reta
// que toca o círculo no topo: cada pedacinho de arco vai para a reta com o
// mesmo comprimento, e a ponta de cada fatia fica onde estava. No fim, as
// fatias formam um triângulo de base s (o arco esticado) e altura r (do centro
// até a reta). Cada fatia fina já era quase um triângulo de altura r; o
// desenho só as põe lado a lado.
//
// Quadro final: o triângulo, com o contorno do setor original tracejado.

const W = 380;
const H = 250;
const CX = W / 2;
const CY = 220;
const R = 170;
const THETA = (100 * Math.PI) / 180;
const SLICES = 10;
const STEPS = 60;
const DURATION = 3;

// Ponto da borda curva (k = 0) ou da base esticada (k = 1), no parâmetro u
// de 0 (ponta direita) a 1 (ponta esquerda).
function edgePoint(u, k) {
  const phi = Math.PI / 2 - THETA / 2 + u * THETA;
  const ax = CX + R * Math.cos(phi);
  const ay = CY - R * Math.sin(phi);
  const s = R * THETA;
  const bx = CX + s / 2 - u * s;
  const by = CY - R;
  return [ax + (bx - ax) * k, ay + (by - ay) * k];
}

export default function SectorUnroll({
  caption = 'As fatias finas do setor têm a ponta no centro. Esticando o arco sobre a reta que toca o topo do círculo, elas ficam lado a lado e formam um triângulo de base s e altura r.',
}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const k = ease((t - 0.4) / (DURATION - 0.6));

  const edge = [];
  for (let i = 0; i <= STEPS; i += 1) edge.push(edgePoint(i / STEPS, k));
  const outline = `M ${CX} ${CY} ${edge.map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} Z`;
  const ghost = [];
  for (let i = 0; i <= STEPS; i += 1) ghost.push(edgePoint(i / STEPS, 0));
  const ghostPath = `M ${CX} ${CY} ${ghost.map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} Z`;

  const baseY = CY - R;
  const done = k > 0.98;

  return (
    <div className={shared.wrapper} data-explorer="sector-unroll">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label="Setor circular cortado em fatias, que se esticam até formar um triângulo de base igual ao arco e altura igual ao raio."
        >
          {/* reta que toca o círculo no topo */}
          <line x1={20} y1={baseY} x2={W - 20} y2={baseY} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="4 4" />
          {k > 0.05 && <path d={ghostPath} fill="none" stroke="var(--mv-guide)" strokeWidth={1.25} strokeDasharray="5 4" />}

          <path d={outline} fill="var(--mv-tone-1)" fillOpacity={0.18} stroke="var(--mv-tone-1)" strokeWidth={2} strokeLinejoin="round" />
          {Array.from({length: SLICES - 1}, (_, i) => {
            const [x, y] = edgePoint((i + 1) / SLICES, k);
            return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--mv-tone-1)" strokeWidth={0.9} opacity={0.6} />;
          })}
          {/* o arco (ou a base esticada) em destaque */}
          <polyline
            points={edge.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
            fill="none"
            stroke="var(--mv-tone-2)"
            strokeWidth={4}
            strokeLinecap="round"
          />

          {/* r: do centro até o topo do arco, que é também a altura do
              triângulo. O mesmo segmento vale nos dois quadros. */}
          <line x1={CX} y1={CY} x2={CX} y2={baseY} stroke="var(--mv-tone-3)" strokeWidth={2} strokeDasharray="6 3" />
          <SvgMath x={CX + 12} y={(CY + baseY) / 2 + 20} math="r" anchor="start" tone={3} fontSize={15} halo />
          <SvgMath x={CX} y={baseY - 14} math={done ? 's\\ (\\text{esticado})' : 's'} tone={2} fontSize={14} halo />
          <circle cx={CX} cy={CY} r={4} fill="var(--ifm-font-color-base)" />
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()}>
          Esticar o arco de novo
        </button>
      </div>
    </div>
  );
}
