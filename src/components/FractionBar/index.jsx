import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

const PAD = 12;
const BAR_H = 46;
const BAR_GAP = 14;
const LABEL_GAP = 18;
const LABEL_W = 96;

export default function FractionBar({bars, barWidth = 400, caption}) {
  const hasLabels = bars.some((bar) => bar.label);
  const viewW = PAD * 2 + barWidth + (hasLabels ? LABEL_GAP + LABEL_W : 0);
  const viewH = PAD * 2 + bars.length * BAR_H + (bars.length - 1) * BAR_GAP;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${viewW}px`}}
        role="img"
        aria-label={
          caption ||
          bars
            .map((bar) => `${bar.filled} de ${bar.parts} partes pintadas`)
            .join('; ')
        }
      >
        {bars.map((bar, index) => {
          const y = PAD + index * (BAR_H + BAR_GAP);
          const cellW = barWidth / bar.parts;
          const tone = `var(--mv-tone-${bar.tone ?? 1})`;
          return (
            <g key={`bar-${index}`} style={{'--tone': tone}}>
              {Array.from({length: bar.parts}, (unused, part) => (
                <rect
                  key={part}
                  className={part < bar.filled ? styles.filled : styles.empty}
                  x={PAD + part * cellW}
                  y={y}
                  width={cellW}
                  height={BAR_H}
                />
              ))}
              <rect
                className={styles.outline}
                x={PAD}
                y={y}
                width={barWidth}
                height={BAR_H}
              />
              {bar.label && (
                <SvgMath
                  x={PAD + barWidth + LABEL_GAP}
                  y={y + BAR_H / 2}
                  math={bar.label}
                  anchor="start"
                  space={LABEL_W}
                  fontSize={18}
                />
              )}
            </g>
          );
        })}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
