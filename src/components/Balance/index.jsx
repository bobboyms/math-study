import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// A equação como balança. Cada estado é uma linha; entre duas linhas fica a
// operação aplicada **aos dois lados**, que é a única coisa que preserva o
// equilíbrio. Ver os dois pratos descerem juntos é o argumento — sem isso,
// "passar para o outro lado" vira truque.

const PAD = 14;
const PAN_W = 168;
const PAN_H = 46;
const GAP = 54;
const STEP_GAP = 62;
const FULCRUM_H = 18;

export default function Balance({states, caption}) {
  const linhaAltura = PAN_H + FULCRUM_H;
  const viewW = PAD * 2 + PAN_W * 2 + GAP;
  const viewH =
    PAD * 2 + states.length * linhaAltura + (states.length - 1) * STEP_GAP;

  const xEsq = PAD;
  const xDir = PAD + PAN_W + GAP;
  const centro = viewW / 2;

  const yDe = (i) => PAD + i * (linhaAltura + STEP_GAP);

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${viewW}px`}}
        role="img"
        aria-label={
          caption ||
          states.map((s) => `${s.left} igual a ${s.right}`).join('; depois ')
        }
      >
        {states.map((estado, i) => {
          const y = yDe(i);
          const yMeio = y + PAN_H / 2;
          const yBase = y + PAN_H;
          return (
            <g key={`estado-${i}`}>
              <line
                className={styles.beam}
                x1={xEsq + PAN_W / 2}
                y1={yBase + 3}
                x2={xDir + PAN_W / 2}
                y2={yBase + 3}
              />
              <path
                className={styles.fulcrum}
                d={`M ${centro} ${yBase + 3} L ${centro - 11} ${yBase + FULCRUM_H} L ${centro + 11} ${yBase + FULCRUM_H} Z`}
              />

              <rect
                className={styles.pan}
                style={{'--tone': 'var(--mv-tone-1)'}}
                x={xEsq}
                y={y}
                width={PAN_W}
                height={PAN_H}
                rx={7}
              />
              <SvgMath
                x={xEsq + PAN_W / 2}
                y={yMeio}
                math={estado.left}
                fontSize={17}
                space={PAN_W}
              />

              <text className={styles.equals} x={centro} y={yMeio + 6} textAnchor="middle">
                =
              </text>

              <rect
                className={styles.pan}
                style={{'--tone': 'var(--mv-tone-3)'}}
                x={xDir}
                y={y}
                width={PAN_W}
                height={PAN_H}
                rx={7}
              />
              <SvgMath
                x={xDir + PAN_W / 2}
                y={yMeio}
                math={estado.right}
                fontSize={17}
                space={PAN_W}
              />

              {estado.op && i > 0 && (
                <SvgMath
                  x={centro}
                  y={y - STEP_GAP / 2}
                  math={estado.op}
                  fontSize={14}
                  space={viewW - 40}
                  tone={2}
                />
              )}
              {i > 0 && (
                <>
                  <line
                    className={styles.dropLine}
                    x1={centro}
                    y1={y - STEP_GAP + 6}
                    x2={centro}
                    y2={y - STEP_GAP / 2 - 14}
                  />
                  <line
                    className={styles.dropLine}
                    x1={centro}
                    y1={y - STEP_GAP / 2 + 12}
                    x2={centro}
                    y2={y - 10}
                  />
                  <path
                    className={styles.dropHead}
                    d={`M ${centro} ${y - 4} L ${centro - 5} ${y - 12} L ${centro + 5} ${y - 12} Z`}
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
