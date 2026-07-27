import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Uma cadeia de transformações: valor, operação, novo valor. É a figura da
// expressão lida como procedimento — "entra x, dobra, soma 5, sai 2x + 5" —
// antes de ela virar uma fórmula estática.
//
// `back` desenha a seta de volta por baixo, para os pares que desfazem um ao
// outro (quadrado e raiz, multiplicar e dividir).

const PAD = 12;
const CHIP_W = 82;
const CHIP_H = 40;
const ARROW_W = 124;
const OP_LIFT = 16;
const BACK_DROP = 46;

function arrowHead(x, y, dir = 1, size = 7) {
  return `M ${x} ${y} L ${x - dir * size} ${y - size * 0.5} L ${x - dir * size} ${y + size * 0.5} Z`;
}

export default function FunctionMachine({input, steps, back, caption}) {
  const chips = [input, ...steps.map((s) => s.value)];
  const viewW =
    PAD * 2 + chips.length * CHIP_W + steps.length * ARROW_W;
  const yMid = PAD + OP_LIFT + CHIP_H / 2;
  const viewH = PAD * 2 + OP_LIFT + CHIP_H + (back ? BACK_DROP : 0);

  const chipX = (i) => PAD + i * (CHIP_W + ARROW_W);

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 320)}px`}}
        role="img"
        aria-label={
          caption ||
          `Entrada ${input}, transformada em ${chips[chips.length - 1]}.`
        }
      >
        {steps.map((step, i) => {
          const x1 = chipX(i) + CHIP_W;
          const x2 = chipX(i + 1);
          return (
            <g key={`seta-${i}`} style={{'--tone': `var(--mv-tone-${step.tone ?? 1})`}}>
              <line
                className={styles.arrow}
                x1={x1 + 6}
                y1={yMid}
                x2={x2 - 10}
                y2={yMid}
              />
              <path className={styles.head} d={arrowHead(x2 - 4, yMid)} />
              <SvgMath
                x={(x1 + x2) / 2}
                y={yMid - 20}
                math={step.op}
                fontSize={13}
                space={ARROW_W + 20}
                tone={step.tone ?? 1}
                halo
              />
            </g>
          );
        })}

        {chips.map((valor, i) => (
          <g key={`chip-${i}`}>
            <rect
              className={i === 0 ? styles.chipEntrada : styles.chip}
              x={chipX(i)}
              y={PAD + OP_LIFT}
              width={CHIP_W}
              height={CHIP_H}
              rx={7}
            />
            <SvgMath
              x={chipX(i) + CHIP_W / 2}
              y={yMid}
              math={valor}
              fontSize={16}
              space={CHIP_W}
            />
          </g>
        ))}

        {back && (
          <g style={{'--tone': 'var(--mv-tone-2)'}}>
            <path
              className={styles.backArc}
              d={`M ${chipX(chips.length - 1) + CHIP_W / 2} ${PAD + OP_LIFT + CHIP_H + 6}
                  Q ${viewW / 2} ${viewH - 4}
                  ${chipX(0) + CHIP_W / 2} ${PAD + OP_LIFT + CHIP_H + 6}`}
            />
            <path
              className={styles.backHead}
              d={arrowHead(chipX(0) + CHIP_W / 2 + 4, PAD + OP_LIFT + CHIP_H + 8, -1)}
            />
            <SvgMath
              x={viewW / 2}
              y={viewH - 14}
              math={back}
              fontSize={13}
              space={viewW - 60}
              tone={2}
              halo
            />
          </g>
        )}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
