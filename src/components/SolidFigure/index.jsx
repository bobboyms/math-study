import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Sólidos em perspectiva simples: bloco, cilindro, cone e esfera.
//
// A convenção de desenho é a mesma dos livros: a base circular vira uma elipse,
// e a metade escondida dela é tracejada. Isso não é enfeite — é o que deixa
// visível que a base é um círculo inteiro, e o círculo inteiro é o que a
// fórmula da área da base usa.

const toneVar = (tone) =>
  tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';

function arrowHead(x, y, dx, dy, size = 6) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x - ux * size;
  const by = y - uy * size;
  const nx = -uy * size * 0.5;
  const ny = ux * size * 0.5;
  return `M ${x} ${y} L ${bx + nx} ${by + ny} L ${bx - nx} ${by - ny} Z`;
}

export default function SolidFigure({
  kind = 'cylinder',
  rx = 62,
  ry = 22,
  height = 150,
  depth = 46,
  width,
  tone = 1,
  radiusLabel,
  heightLabel,
  slantLabel,
  extraLabels = [],
  caption,
}) {
  const w = width ?? rx * 2;
  const pad = 46;
  const isRound = kind !== 'box';
  const halfW = isRound ? rx : w / 2;
  const viewW = pad * 2 + halfW * 2 + (kind === 'box' ? depth : 0) + 40;
  const viewH =
    pad * 2 + (kind === 'sphere' ? rx * 2 : height + ry * 2) + (kind === 'box' ? depth : 0);

  const cx = pad + halfW + 10;
  const topY = pad + (kind === 'box' ? depth : ry);
  const botY = topY + (kind === 'sphere' ? 0 : height);

  const style = {'--tone': toneVar(tone)};

  const body = () => {
    if (kind === 'cylinder') {
      return (
        <g style={style}>
          <path
            className={styles.face}
            d={`M ${cx - rx} ${topY} L ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${botY} L ${cx + rx} ${topY} Z`}
          />
          <ellipse className={styles.face} cx={cx} cy={topY} rx={rx} ry={ry} />
          <path
            className={styles.hidden}
            d={`M ${cx - rx} ${botY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${botY}`}
          />
        </g>
      );
    }
    if (kind === 'cone') {
      return (
        <g style={style}>
          <path
            className={styles.face}
            d={`M ${cx} ${topY - ry} L ${cx - rx} ${botY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${botY} Z`}
          />
          <path
            className={styles.hidden}
            d={`M ${cx - rx} ${botY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${botY}`}
          />
        </g>
      );
    }
    if (kind === 'sphere') {
      return (
        <g style={style}>
          <circle className={styles.face} cx={cx} cy={topY + rx} r={rx} />
          <ellipse className={styles.hidden} cx={cx} cy={topY + rx} rx={rx} ry={ry} />
        </g>
      );
    }
    // box
    const x0 = cx - w / 2;
    const x1 = cx + w / 2;
    const y0 = topY;
    const y1 = topY + height;
    const dx = depth * 0.7;
    const dy = -depth * 0.55;
    return (
      <g style={style}>
        <path className={styles.face} d={`M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`} />
        <path
          className={styles.faceSoft}
          d={`M ${x0} ${y0} L ${x0 + dx} ${y0 + dy} L ${x1 + dx} ${y0 + dy} L ${x1} ${y0} Z`}
        />
        <path
          className={styles.faceSoft}
          d={`M ${x1} ${y0} L ${x1 + dx} ${y0 + dy} L ${x1 + dx} ${y1 + dy} L ${x1} ${y1} Z`}
        />
        <path className={styles.hidden} d={`M ${x0} ${y1} L ${x0 + dx} ${y1 + dy} L ${x1 + dx} ${y1 + dy}`} />
        <path className={styles.hidden} d={`M ${x0 + dx} ${y0 + dy} L ${x0 + dx} ${y1 + dy}`} />
      </g>
    );
  };

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 240)}px`}}
        role="img"
        aria-label={caption || 'Sólido geométrico.'}
      >
        {body()}

        {radiusLabel && kind !== 'box' && (
          <g style={{'--tone': `var(--mv-tone-2)`}}>
            <line
              className={styles.measure}
              x1={cx}
              y1={kind === 'sphere' ? topY + rx : botY}
              x2={cx + rx}
              y2={kind === 'sphere' ? topY + rx : botY}
            />
            <path
              className={styles.head}
              d={arrowHead(cx + rx, kind === 'sphere' ? topY + rx : botY, 1, 0)}
            />
            <SvgMath
              x={cx + rx / 2}
              y={(kind === 'sphere' ? topY + rx : botY) - 19}
              math={radiusLabel}
              fontSize={14}
              tone={2}
              halo
            />
          </g>
        )}

        {heightLabel && kind !== 'sphere' && (
          <g style={{'--tone': `var(--mv-tone-3)`}}>
            <line
              className={styles.measure}
              x1={cx + halfW + 24}
              y1={kind === 'cone' ? topY - ry : topY}
              x2={cx + halfW + 24}
              y2={botY}
            />
            <path className={styles.head} d={arrowHead(cx + halfW + 24, botY, 0, 1)} />
            <path
              className={styles.head}
              d={arrowHead(cx + halfW + 24, kind === 'cone' ? topY - ry : topY, 0, -1)}
            />
            <SvgMath
              x={cx + halfW + 44}
              y={(topY + botY) / 2}
              math={heightLabel}
              fontSize={14}
              tone={3}
              halo
            />
          </g>
        )}

        {slantLabel && kind === 'cone' && (
          <SvgMath
            x={cx - rx / 2 - 8}
            y={(topY - ry + botY) / 2}
            math={slantLabel}
            fontSize={14}
            tone={1}
            halo
          />
        )}

        {extraLabels.map((item, index) => (
          <SvgMath
            key={`ex-${index}`}
            x={item.x}
            y={item.y}
            math={item.math}
            fontSize={item.fontSize ?? 14}
            tone={item.tone}
            halo
          />
        ))}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
