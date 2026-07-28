import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Figura geométrica plana em coordenadas do autor, com y para cima.
//
// Por que um componente genérico e não um por figura: ângulo, triângulo,
// trapézio e figura composta são o mesmo desenho — segmentos, arcos e rótulos —
// com dados diferentes. Um componente por figura multiplicaria o mesmo código
// de conversão de coordenadas e de posicionamento de rótulo.
//
// O autor escreve em unidades da própria figura (cm, metros, unidades do
// problema) e com y crescendo para cima, como na matemática. A conversão para o
// sistema do SVG, onde y cresce para baixo, acontece só aqui.

const DEFAULT_UNIT = 34;
const DEFAULT_PAD = 44;
const ANGLE_RADIUS = 26;
const RIGHT_SIZE = 13;
const TICK_LEN = 9;

const toRad = (deg) => (deg * Math.PI) / 180;

// Direção unitária de a para b, já no sistema do SVG.
function direction(a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

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

// Todos os pontos citados em qualquer prop, para o enquadramento automático.
function collectPoints({polygons, segments, angles, points, labels, dims, arcs}) {
  const all = [];
  polygons.forEach((item) => all.push(...item.points));
  segments.forEach((item) => all.push(item.from, item.to));
  dims.forEach((item) => all.push(item.from, item.to));
  angles.forEach((item) => all.push(item.at, item.from, item.to));
  arcs.forEach((item) => all.push(item.at));
  points.forEach((item) => all.push(item.at));
  labels.forEach((item) => all.push(item.at));
  return all;
}

const PLACE = {
  above: [0, -1],
  below: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  'above-left': [-0.8, -0.8],
  'above-right': [0.8, -0.8],
  'below-left': [-0.8, 0.8],
  'below-right': [0.8, 0.8],
};

export default function GeoFigure({
  polygons = [],
  segments = [],
  angles = [],
  arcs = [],
  points = [],
  labels = [],
  dims = [],
  ticks = [],
  unit = DEFAULT_UNIT,
  padding = DEFAULT_PAD,
  bounds,
  caption,
}) {
  const collected = collectPoints({
    polygons,
    segments,
    angles,
    points,
    labels,
    dims,
    arcs,
  });

  const xs = collected.map((p) => p[0]);
  const ys = collected.map((p) => p[1]);
  const xMin = bounds ? bounds[0] : Math.min(...xs);
  const yMin = bounds ? bounds[1] : Math.min(...ys);
  const xMax = bounds ? bounds[2] : Math.max(...xs);
  const yMax = bounds ? bounds[3] : Math.max(...ys);

  const viewW = padding * 2 + (xMax - xMin) * unit;
  const viewH = padding * 2 + (yMax - yMin) * unit;

  // Ponto do autor -> ponto do SVG.
  const P = (p) => [
    padding + (p[0] - xMin) * unit,
    padding + (yMax - p[1]) * unit,
  ];

  const toneVar = (tone) =>
    tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 280)}px`}}
        role="img"
        aria-label={caption || 'Figura geométrica.'}
      >
        {polygons.map((item, index) => {
          const path = item.points.map(P);
          const d =
            path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') +
            (item.open ? '' : ' Z');
          return (
            <path
              key={`poly-${index}`}
              className={item.fill === false ? styles.outline : styles.face}
              style={{'--tone': toneVar(item.tone)}}
              d={d}
            />
          );
        })}

        {segments.map((item, index) => {
          const a = P(item.from);
          const b = P(item.to);
          return (
            <g key={`seg-${index}`} style={{'--tone': toneVar(item.tone)}}>
              <line
                className={item.dashed ? styles.dashed : styles.stroke}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
              />
              {item.arrow && (
                <path
                  className={styles.head}
                  d={arrowHead(b[0], b[1], b[0] - a[0], b[1] - a[1])}
                />
              )}
              {item.arrow === 'both' && (
                <path
                  className={styles.head}
                  d={arrowHead(a[0], a[1], a[0] - b[0], a[1] - b[1])}
                />
              )}
            </g>
          );
        })}

        {/* Cota: seta de duas pontas paralela ao lado, deslocada para fora, com
            o rótulo no meio. É o que escreve "base = 8 cm" sem encostar na
            figura. */}
        {dims.map((item, index) => {
          const a = P(item.from);
          const b = P(item.to);
          const [ux, uy] = direction(a, b);
          const off = item.offset ?? 18;
          const nx = -uy * off;
          const ny = ux * off;
          const a2 = [a[0] + nx, a[1] + ny];
          const b2 = [b[0] + nx, b[1] + ny];
          const mid = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2];
          const labelOff = item.labelOffset ?? 15;
          return (
            <g key={`dim-${index}`} style={{'--tone': toneVar(item.tone)}}>
              <line
                className={styles.dimLine}
                x1={a2[0]}
                y1={a2[1]}
                x2={b2[0]}
                y2={b2[1]}
              />
              <line className={styles.dimTie} x1={a[0]} y1={a[1]} x2={a2[0]} y2={a2[1]} />
              <line className={styles.dimTie} x1={b[0]} y1={b[1]} x2={b2[0]} y2={b2[1]} />
              <path className={styles.head} d={arrowHead(a2[0], a2[1], -ux, -uy, 6)} />
              <path className={styles.head} d={arrowHead(b2[0], b2[1], ux, uy, 6)} />
              {item.label && (
                <SvgMath
                  x={mid[0] + (nx / off) * labelOff}
                  y={mid[1] + (ny / off) * labelOff}
                  math={item.label}
                  fontSize={item.fontSize ?? 14}
                  tone={item.tone}
                  halo
                />
              )}
            </g>
          );
        })}

        {ticks.map((item, index) => {
          const a = P(item.from);
          const b = P(item.to);
          const [ux, uy] = direction(a, b);
          const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          const count = item.count ?? 1;
          const gap = 5;
          return (
            <g key={`tick-${index}`} style={{'--tone': toneVar(item.tone)}}>
              {Array.from({length: count}, (_, i) => {
                const shift = (i - (count - 1) / 2) * gap;
                const cx = mid[0] + ux * shift;
                const cy = mid[1] + uy * shift;
                return (
                  <line
                    key={i}
                    className={styles.tick}
                    x1={cx - (-uy * TICK_LEN) / 2}
                    y1={cy - (ux * TICK_LEN) / 2}
                    x2={cx + (-uy * TICK_LEN) / 2}
                    y2={cy + (ux * TICK_LEN) / 2}
                  />
                );
              })}
            </g>
          );
        })}

        {angles.map((item, index) => {
          const v = P(item.at);
          const [ax, ay] = direction(v, P(item.from));
          const [bx, by] = direction(v, P(item.to));
          const r = item.radius ?? ANGLE_RADIUS;

          if (item.right) {
            const c1 = [v[0] + ax * RIGHT_SIZE, v[1] + ay * RIGHT_SIZE];
            const c3 = [v[0] + bx * RIGHT_SIZE, v[1] + by * RIGHT_SIZE];
            const c2 = [c1[0] + bx * RIGHT_SIZE, c1[1] + by * RIGHT_SIZE];
            return (
              <path
                key={`ang-${index}`}
                className={styles.rightMark}
                style={{'--tone': toneVar(item.tone)}}
                d={`M ${c1[0]} ${c1[1]} L ${c2[0]} ${c2[1]} L ${c3[0]} ${c3[1]}`}
              />
            );
          }

          const start = [v[0] + ax * r, v[1] + ay * r];
          const end = [v[0] + bx * r, v[1] + by * r];
          // Cruzamento dos dois vetores: decide de que lado o arco passa, para
          // ele sempre cobrir o ângulo menor que 180°.
          const cross = ax * by - ay * bx;
          const sweep = cross > 0 ? 1 : 0;
          const bis = [ax + bx, ay + by];
          const bisLen = Math.hypot(bis[0], bis[1]) || 1;
          const labelR = item.labelRadius ?? r + 18;

          return (
            <g key={`ang-${index}`} style={{'--tone': toneVar(item.tone)}}>
              <path
                className={styles.arc}
                d={`M ${start[0]} ${start[1]} A ${r} ${r} 0 0 ${sweep} ${end[0]} ${end[1]}`}
              />
              {item.label && (
                <SvgMath
                  x={v[0] + (bis[0] / bisLen) * labelR}
                  y={v[1] + (bis[1] / bisLen) * labelR}
                  math={item.label}
                  fontSize={item.fontSize ?? 14}
                  tone={item.tone}
                  halo
                />
              )}
            </g>
          );
        })}

        {/* Arco solto: usado quando o desenho precisa de um pedaço de
            circunferência sem os dois lados do ângulo. */}
        {arcs.map((item, index) => {
          const c = P(item.at);
          const r = item.r * unit;
          const a1 = toRad(item.from);
          const a2 = toRad(item.to);
          const p1 = [c[0] + r * Math.cos(a1), c[1] - r * Math.sin(a1)];
          const p2 = [c[0] + r * Math.cos(a2), c[1] - r * Math.sin(a2)];
          const large = Math.abs(item.to - item.from) > 180 ? 1 : 0;
          const sweep = item.to > item.from ? 0 : 1;
          const d =
            item.sector
              ? `M ${c[0]} ${c[1]} L ${p1[0]} ${p1[1]} A ${r} ${r} 0 ${large} ${sweep} ${p2[0]} ${p2[1]} Z`
              : `M ${p1[0]} ${p1[1]} A ${r} ${r} 0 ${large} ${sweep} ${p2[0]} ${p2[1]}`;
          return (
            <path
              key={`arc-${index}`}
              className={item.sector ? styles.face : styles.arcThick}
              style={{'--tone': toneVar(item.tone)}}
              d={d}
            />
          );
        })}

        {points.map((item, index) => {
          const p = P(item.at);
          const place = PLACE[item.place ?? 'above'] ?? PLACE.above;
          const dist = item.distance ?? 20;
          return (
            <g key={`pt-${index}`}>
              <circle
                className={item.open ? styles.dotOpen : styles.dot}
                style={{'--tone': toneVar(item.tone ?? 1)}}
                cx={p[0]}
                cy={p[1]}
                r={item.r ?? 5}
              />
              {item.label && (
                <SvgMath
                  x={p[0] + place[0] * dist}
                  y={p[1] + place[1] * dist}
                  math={item.label}
                  fontSize={item.fontSize ?? 14}
                  tone={item.tone}
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
