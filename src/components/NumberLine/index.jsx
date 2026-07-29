import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

const PAD = {x: 26, top: 12, bottom: 14};
const TICK = 7;
const NUMBER_DROP = 24;
const MARK_LABEL_DROP = 50;
const ARC_BASE = 40;
const ARC_STEP = 34;
// O ápice real de uma bezier quadrática fica a 80% da altura do ponto de
// controle. Sem essa conta o rótulo de um salto pousa em cima do arco do salto
// de cima.
const APEX_RATIO = 0.8;

// Geometria do arco de um salto: bezier quadrática, ápice e tangente final
// (que dá a direção da ponta da seta).
function arcGeometry(jump, px, yLine) {
  const x1 = px(jump.from);
  const x2 = px(jump.to);
  const height = ARC_BASE + (jump.level ?? 0) * ARC_STEP;
  const controlY = yLine - height * 2 * APEX_RATIO;
  return {
    x1,
    x2,
    apexY: yLine - height * APEX_RATIO,
    path: `M ${x1} ${yLine - 3} Q ${(x1 + x2) / 2} ${controlY} ${x2} ${yLine - 3}`,
    dx: x2 - (x1 + x2) / 2,
    dy: yLine - 3 - controlY,
  };
}

// Ponta de seta triangular apontando na direção (dx, dy).
function arrowHead(x, y, dx, dy, size = 7) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x - ux * size;
  const by = y - uy * size;
  const nx = -uy * size * 0.5;
  const ny = ux * size * 0.5;
  return `M ${x} ${y} L ${bx + nx} ${by + ny} L ${bx - nx} ${by - ny} Z`;
}

export default function NumberLine({
  min,
  max,
  step = 1,
  labelEvery = 1,
  unit = 44,
  marks = [],
  jumps = [],
  spans = [],
  caption,
}) {
  const span = max - min;
  const maxLevel = jumps.reduce((top, jump) => Math.max(top, jump.level ?? 0), 0);
  const arcSpace = jumps.length
    ? APEX_RATIO * (ARC_BASE + maxLevel * ARC_STEP) + 26
    : 0;
  const hasMarkLabels = marks.some((mark) => mark.label);

  const yLine = PAD.top + arcSpace;
  const viewW = PAD.x * 2 + span * unit;
  const viewH =
    yLine +
    NUMBER_DROP +
    (hasMarkLabels ? MARK_LABEL_DROP - NUMBER_DROP : 0) +
    PAD.bottom +
    10;

  const px = (value) => PAD.x + (value - min) * unit;

  const ticks = [];
  for (let value = min; value <= max + 1e-9; value += step) {
    ticks.push(Number(value.toFixed(6)));
  }

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 320)}px`}}
        role="img"
        aria-label={caption || `Reta numérica de ${min} a ${max}.`}
      >
        <line
          className={styles.axis}
          x1={PAD.x - 14}
          y1={yLine}
          x2={viewW - PAD.x + 14}
          y2={yLine}
        />
        <path
          className={styles.axisArrow}
          d={arrowHead(viewW - PAD.x + 14, yLine, 1, 0)}
        />
        <path className={styles.axisArrow} d={arrowHead(PAD.x - 14, yLine, -1, 0)} />

        {spans.map((item, index) => (
          <line
            key={`span-${index}`}
            className={styles.span}
            style={{'--tone': `var(--mv-tone-${item.tone ?? 3})`}}
            x1={px(item.from)}
            y1={yLine}
            x2={px(item.to)}
            y2={yLine}
          />
        ))}

        {ticks.map((value, index) => (
          <g key={`tick-${value}`}>
            <line
              className={styles.tick}
              x1={px(value)}
              y1={yLine - TICK}
              x2={px(value)}
              y2={yLine + TICK}
            />
            {index % labelEvery === 0 && (
              <text
                className={styles.number}
                x={px(value)}
                y={yLine + NUMBER_DROP}
                textAnchor="middle"
              >
                {value}
              </text>
            )}
          </g>
        ))}

        {/* Duas camadas: primeiro todos os arcos, depois todos os rótulos.
            Num único laço, o arco de um salto passaria por cima do rótulo do
            salto anterior. */}
        {jumps.map((jump, index) => {
          const geometry = arcGeometry(jump, px, yLine);
          return (
            <g
              key={`jump-${index}`}
              style={{'--tone': `var(--mv-tone-${jump.tone ?? 1})`}}
            >
              <path className={styles.jumpArc} d={geometry.path} />
              <path
                className={styles.jumpHead}
                d={arrowHead(
                  geometry.x2,
                  yLine - 3,
                  geometry.dx,
                  geometry.dy,
                )}
              />
            </g>
          );
        })}

        {jumps.map((jump, index) => {
          if (!jump.label) {
            return null;
          }
          const geometry = arcGeometry(jump, px, yLine);
          return (
            <SvgMath
              key={`jump-label-${index}`}
              x={(geometry.x1 + geometry.x2) / 2}
              y={geometry.apexY - 11}
              math={jump.label}
              fontSize={14}
              tone={jump.tone ?? 1}
              halo
            />
          );
        })}

        {marks.map((mark, index) => (
          <g key={`mark-${index}`}>
            {/* O miolo da bola vazia precisa apagar o traço da escala e a faixa
                que passam por baixo, senão o ponto sai cruzado em vez de oco.
                O raio cobre o tique inteiro, que vai de -TICK a +TICK. */}
            {mark.open && (
              <circle
                className={styles.markDotMask}
                cx={px(mark.at)}
                cy={yLine}
                r={TICK + 1}
              />
            )}
            <circle
              className={mark.open ? styles.markDotOpen : styles.markDot}
              style={{'--tone': `var(--mv-tone-${mark.tone ?? 2})`}}
              cx={px(mark.at)}
              cy={yLine}
              r={6}
            />
            {mark.label && (
              <SvgMath
                x={px(mark.at)}
                y={yLine + MARK_LABEL_DROP}
                math={mark.label}
                fontSize={14}
                tone={mark.tone ?? 2}
              />
            )}
          </g>
        ))}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
