import React, {useId} from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Plano cartesiano: eixos numerados, malha e o que for desenhado sobre eles —
// pontos, segmentos, retas, circunferências e gráficos de funções.
//
// É o irmão do GeoFigure para quando a posição importa: lá a figura flutua no
// papel, aqui cada ponto tem endereço. Os dois compartilham as convenções de
// tom e de rótulo em KaTeX.
//
// Toda curva é recortada pela caixa do gráfico (clipPath). Sem isso, a
// tangente, que dispara para o infinito, sairia por cima do texto da lição.

const PAD = 34;
const TICK = 5;

const toneVar = (tone) =>
  tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';

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

// Sinal de menos tipográfico (U+2212), o mesmo que o KaTeX usa. Com o hífen
// comum, os números negativos do eixo destoam das fórmulas ao redor.
const fmt = (v) => String(v).replace('-', '−');

function range(min, max, step) {
  const out = [];
  for (let v = min; v <= max + 1e-9; v += step) {
    out.push(Number(v.toFixed(6)));
  }
  return out;
}

export default function CartesianPlane({
  xMin = -6,
  xMax = 6,
  yMin = -6,
  yMax = 6,
  xUnit = 30,
  yUnit,
  xStep = 1,
  yStep = 1,
  xLabelEvery = 1,
  yLabelEvery = 1,
  xTicks,
  yTicks,
  showGrid = true,
  showNumbers = true,
  axisLabels,
  functions = [],
  points = [],
  segments = [],
  lines = [],
  circles = [],
  polygons = [],
  labels = [],
  padding = PAD,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const uy = yUnit ?? xUnit;

  const viewW = padding * 2 + (xMax - xMin) * xUnit;
  const viewH = padding * 2 + (yMax - yMin) * uy;

  const X = (x) => padding + (x - xMin) * xUnit;
  const Y = (y) => padding + (yMax - y) * uy;
  const P = (p) => [X(p[0]), Y(p[1])];

  const x0 = X(0);
  const y0 = Y(0);
  const axisX = Math.min(Math.max(x0, padding), viewW - padding);
  const axisY = Math.min(Math.max(y0, padding), viewH - padding);

  const gridXs = range(Math.ceil(xMin / xStep) * xStep, xMax, xStep);
  const gridYs = range(Math.ceil(yMin / yStep) * yStep, yMax, yStep);

  const numberedX =
    xTicks ?? gridXs.filter((v, i) => i % xLabelEvery === 0 && v !== 0).map((v) => ({at: v}));
  const numberedY =
    yTicks ?? gridYs.filter((v, i) => i % yLabelEvery === 0 && v !== 0).map((v) => ({at: v}));

  // Amostragem de uma função em passos de 1 pixel. O caminho é quebrado quando
  // o valor deixa de existir, sai muito da janela ou dá um salto grande — é
  // assim que a tangente não ganha uma linha vertical falsa ligando -infinito a
  // +infinito.
  const samplePath = (fn) => {
    const a = fn.domain ? fn.domain[0] : xMin;
    const b = fn.domain ? fn.domain[1] : xMax;
    const steps = Math.max(2, Math.round((b - a) * xUnit));
    const pieces = [];
    let current = [];
    let prevY = null;
    for (let i = 0; i <= steps; i += 1) {
      const x = a + ((b - a) * i) / steps;
      const y = fn.f(x);
      const inside = Number.isFinite(y) && y >= yMin - 2 && y <= yMax + 2;
      const jumped = prevY !== null && Math.abs(y - prevY) > (yMax - yMin);
      if (!inside || jumped) {
        if (current.length > 1) pieces.push(current);
        current = [];
      }
      if (inside) current.push([X(x), Y(y)]);
      prevY = Number.isFinite(y) ? y : null;
    }
    if (current.length > 1) pieces.push(current);
    return pieces
      .map((piece) =>
        piece.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' '),
      )
      .join(' ');
  };

  // Reta descrita de três formas: por dois pontos, por y = mx + n, ou vertical.
  const lineEnds = (item) => {
    if (item.x !== undefined) {
      return [
        [X(item.x), padding],
        [X(item.x), viewH - padding],
      ];
    }
    let m;
    let n;
    if (item.through) {
      const [p, q] = item.through;
      if (Math.abs(q[0] - p[0]) < 1e-9) {
        return [
          [X(p[0]), padding],
          [X(p[0]), viewH - padding],
        ];
      }
      m = (q[1] - p[1]) / (q[0] - p[0]);
      n = p[1] - m * p[0];
    } else {
      m = item.m ?? 0;
      n = item.n ?? 0;
    }
    return [
      [X(xMin), Y(m * xMin + n)],
      [X(xMax), Y(m * xMax + n)],
    ];
  };

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 300)}px`}}
        role="img"
        aria-label={caption || 'Gráfico no plano cartesiano.'}
      >
        <defs>
          <clipPath id={`clip-${uid}`}>
            <rect
              x={padding}
              y={padding}
              width={viewW - padding * 2}
              height={viewH - padding * 2}
            />
          </clipPath>
        </defs>

        {showGrid && (
          <g className={styles.grid}>
            {gridXs.map((v) => (
              <line key={`gx-${v}`} x1={X(v)} y1={padding} x2={X(v)} y2={viewH - padding} />
            ))}
            {gridYs.map((v) => (
              <line key={`gy-${v}`} x1={padding} y1={Y(v)} x2={viewW - padding} y2={Y(v)} />
            ))}
          </g>
        )}

        <g clipPath={`url(#clip-${uid})`}>
          {polygons.map((item, index) => {
            const path = item.points.map(P);
            const d =
              path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
            return (
              <path
                key={`poly-${index}`}
                className={item.fill === false ? styles.outline : styles.face}
                style={{'--tone': toneVar(item.tone)}}
                d={d}
              />
            );
          })}

          {circles.map((item, index) => (
            <ellipse
              key={`circ-${index}`}
              className={item.dashed ? styles.curveDashed : styles.outline}
              style={{'--tone': toneVar(item.tone ?? 1)}}
              cx={X(item.center[0])}
              cy={Y(item.center[1])}
              rx={item.r * xUnit}
              ry={item.r * uy}
            />
          ))}

          {lines.map((item, index) => {
            const [a, b] = lineEnds(item);
            return (
              <line
                key={`line-${index}`}
                className={item.dashed ? styles.curveDashed : styles.curve}
                style={{'--tone': toneVar(item.tone ?? 1)}}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
              />
            );
          })}

          {functions.map((item, index) => (
            <path
              key={`fn-${index}`}
              className={item.dashed ? styles.curveDashed : styles.curve}
              style={{'--tone': toneVar(item.tone ?? 1)}}
              d={samplePath(item)}
            />
          ))}
        </g>

        {/* Eixos por cima da malha e por baixo dos pontos. */}
        <line className={styles.axis} x1={padding - 10} y1={axisY} x2={viewW - padding + 10} y2={axisY} />
        <line className={styles.axis} x1={axisX} y1={viewH - padding + 10} x2={axisX} y2={padding - 10} />
        <path className={styles.axisHead} d={arrowHead(viewW - padding + 10, axisY, 1, 0)} />
        <path className={styles.axisHead} d={arrowHead(axisX, padding - 10, 0, -1)} />

        {showNumbers && (
          <g>
            {numberedX.map((tick) => (
              <g key={`nx-${tick.at}`}>
                <line
                  className={styles.tick}
                  x1={X(tick.at)}
                  y1={axisY - TICK}
                  x2={X(tick.at)}
                  y2={axisY + TICK}
                />
                {tick.label ? (
                  <SvgMath x={X(tick.at)} y={axisY + 22} math={tick.label} fontSize={13} halo />
                ) : (
                  <text className={styles.number} x={X(tick.at)} y={axisY + 18} textAnchor="middle">
                    {fmt(tick.at)}
                  </text>
                )}
              </g>
            ))}
            {numberedY.map((tick) => (
              <g key={`ny-${tick.at}`}>
                <line
                  className={styles.tick}
                  x1={axisX - TICK}
                  y1={Y(tick.at)}
                  x2={axisX + TICK}
                  y2={Y(tick.at)}
                />
                {tick.label ? (
                  <SvgMath
                    x={axisX - 12}
                    y={Y(tick.at)}
                    math={tick.label}
                    anchor="end"
                    space={axisX - 12}
                    fontSize={13}
                    halo
                  />
                ) : (
                  <text
                    className={styles.numberRight}
                    x={axisX - 9}
                    y={Y(tick.at) + 4}
                    textAnchor="end"
                  >
                    {fmt(tick.at)}
                  </text>
                )}
              </g>
            ))}
          </g>
        )}

        {axisLabels && (
          <g>
            <SvgMath
              x={viewW - padding + 6}
              y={axisY + 20}
              math={axisLabels[0]}
              fontSize={14}
              halo
            />
            <SvgMath x={axisX + 22} y={padding - 8} math={axisLabels[1]} fontSize={14} halo />
          </g>
        )}

        {segments.map((item, index) => {
          const a = P(item.from);
          const b = P(item.to);
          const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          return (
            <g key={`seg-${index}`} style={{'--tone': toneVar(item.tone ?? 2)}}>
              <line
                className={item.dashed ? styles.segDashed : styles.seg}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
              />
              {item.label && (
                <SvgMath
                  x={mid[0] + (item.dx ?? 0)}
                  y={mid[1] + (item.dy ?? -14)}
                  math={item.label}
                  fontSize={13}
                  tone={item.tone ?? 2}
                  halo
                />
              )}
            </g>
          );
        })}

        {points.map((item, index) => {
          const p = P(item.at);
          return (
            <g key={`pt-${index}`}>
              <circle
                className={item.open ? styles.dotOpen : styles.dot}
                style={{'--tone': toneVar(item.tone ?? 2)}}
                cx={p[0]}
                cy={p[1]}
                r={item.r ?? 5}
              />
              {item.label && (
                <SvgMath
                  x={p[0] + (item.dx ?? 0)}
                  y={p[1] + (item.dy ?? -18)}
                  math={item.label}
                  fontSize={item.fontSize ?? 13}
                  tone={item.tone ?? 2}
                  halo
                />
              )}
            </g>
          );
        })}

        {labels.map((item, index) => {
          const p = P(item.at);
          return (
            <SvgMath
              key={`lbl-${index}`}
              x={p[0] + (item.dx ?? 0)}
              y={p[1] + (item.dy ?? 0)}
              math={item.math}
              anchor={item.anchor ?? 'middle'}
              fontSize={item.fontSize ?? 14}
              tone={item.tone}
              halo={item.halo ?? true}
            />
          );
        })}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
