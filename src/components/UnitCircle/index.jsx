import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// A circunferência de raio 1 com o ângulo marcado a partir do eixo horizontal.
//
// A ideia que o desenho precisa carregar é uma só: o ponto onde o lado do
// ângulo encosta na circunferência tem coordenadas $(\cos\theta,\sen\theta)$ —
// cosseno é a posição horizontal, seno é a altura. Por isso as projeções nos
// eixos são desenhadas como segmentos coloridos, e não como linhas auxiliares
// quaisquer: elas *são* o seno e o cosseno.
//
// O arco do ângulo é amostrado em vez de traçado com um comando de arco do SVG.
// Isso permite ângulo negativo (sentido horário) e ângulo maior que uma volta,
// que aparecem como espiral — e é exatamente esse desenho que explica por que
// 390° e 30° caem no mesmo ponto.

const toRad = (deg) => (deg * Math.PI) / 180;

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

const QUADRANT_CENTER = [45, 135, 225, 315];

export default function UnitCircle({
  scale = 120,
  angles = [],
  marks = [],
  quadrants,
  quadrantNotes,
  showTangent = false,
  tangentClamp = 2.2,
  axisLabels = ['x', 'y'],
  showUnitTicks = true,
  padding = 46,
  caption,
}) {
  const xExtent = showTangent ? 1.9 : 1.32;
  const yExtent = 1.32;

  const viewW = padding * 2 + 2 * xExtent * scale;
  const viewH = padding * 2 + 2 * yExtent * scale;
  const cx = padding + xExtent * scale;
  const cy = padding + yExtent * scale;

  const X = (x) => cx + x * scale;
  const Y = (y) => cy - y * scale;

  // Espiral do ângulo: raio cresce um pouco a cada volta, para duas voltas não
  // se sobreporem.
  const anglePath = (deg, baseR) => {
    const steps = Math.max(8, Math.round(Math.abs(deg) / 2));
    const pts = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = (deg * i) / steps;
      const r = baseR + (Math.abs(t) / 360) * 0.07;
      pts.push([X(r * Math.cos(toRad(t))), Y(r * Math.sin(toRad(t)))]);
    }
    return {
      d: pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' '),
      end: pts[pts.length - 1],
      prev: pts[pts.length - 2],
    };
  };

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 300)}px`}}
        role="img"
        aria-label={caption || 'Circunferência trigonométrica.'}
      >
        {quadrantNotes && (
          <g>
            {quadrantNotes.map((note, index) => {
              const a = toRad(QUADRANT_CENTER[note.quadrant - 1]);
              const r = note.r ?? 0.62;
              return (
                <SvgMath
                  key={`qn-${index}`}
                  x={X(r * Math.cos(a))}
                  y={Y(r * Math.sin(a))}
                  math={note.math}
                  fontSize={note.fontSize ?? 15}
                  tone={note.tone}
                />
              );
            })}
          </g>
        )}

        {quadrants && (
          <g>
            {['\\text{I}', '\\text{II}', '\\text{III}', '\\text{IV}'].map((roman, index) => {
              const a = toRad(QUADRANT_CENTER[index]);
              return (
                <SvgMath
                  key={`q-${index}`}
                  x={X(1.13 * Math.cos(a))}
                  y={Y(1.13 * Math.sin(a))}
                  math={roman}
                  fontSize={14}
                />
              );
            })}
          </g>
        )}

        <line className={styles.axis} x1={X(-xExtent) + 6} y1={cy} x2={X(xExtent) - 6} y2={cy} />
        <line className={styles.axis} x1={cx} y1={Y(-yExtent) + 6} x2={cx} y2={Y(yExtent) + 6} />
        <path className={styles.axisHead} d={arrowHead(X(xExtent) - 6, cy, 1, 0)} />
        <path className={styles.axisHead} d={arrowHead(cx, Y(yExtent) + 6, 0, -1)} />

        <circle className={styles.circle} cx={cx} cy={cy} r={scale} />

        {showUnitTicks && (
          <g>
            {[
              // Deslocados para fora do traço da circunferência: encostados
              // nele, o halo do rótulo não dá conta e a curva corta o número.
              [1, 0, '1', 13, 21],
              [-1, 0, '-1', -13, 21],
              [0, 1, '1', -19, -3],
              [0, -1, '-1', -21, 3],
            ].map(([px, py, text, dx, dy], index) => (
              <SvgMath
                key={`ut-${index}`}
                x={X(px) + dx}
                y={Y(py) + dy}
                math={text}
                fontSize={13}
                halo
              />
            ))}
          </g>
        )}

        {showTangent && (
          <g>
            <line
              className={styles.tangentAxis}
              x1={X(1)}
              y1={Y(tangentClamp)}
              x2={X(1)}
              y2={Y(-tangentClamp)}
            />
            <SvgMath
              x={X(1) + 26}
              y={Y(tangentClamp) - 6}
              math="\text{eixo das tangentes}"
              fontSize={12}
              anchor="middle"
            />
          </g>
        )}

        {angles.map((item, index) => {
          const tone = item.tone ?? 1;
          const a = toRad(item.deg);
          const px = Math.cos(a);
          const py = Math.sin(a);
          const arc = anglePath(item.deg, item.arcRadius ?? 0.24);
          return (
            <g key={`ang-${index}`} style={{'--tone': toneVar(tone)}}>
              {item.showProjections && (
                <>
                  <line
                    className={styles.helper}
                    x1={X(px)}
                    y1={Y(py)}
                    x2={X(px)}
                    y2={Y(0)}
                  />
                  <line
                    className={styles.helper}
                    x1={X(px)}
                    y1={Y(py)}
                    x2={X(0)}
                    y2={Y(py)}
                  />
                  <line
                    className={styles.cos}
                    style={{'--tone': `var(--mv-tone-${item.cosTone ?? 3})`}}
                    x1={X(0)}
                    y1={Y(0)}
                    x2={X(px)}
                    y2={Y(0)}
                  />
                  <line
                    className={styles.sin}
                    style={{'--tone': `var(--mv-tone-${item.sinTone ?? 2})`}}
                    x1={X(0)}
                    y1={Y(0)}
                    x2={X(0)}
                    y2={Y(py)}
                  />
                </>
              )}

              {item.showTangentSegment && (
                <>
                  <line
                    className={styles.helper}
                    x1={X(0)}
                    y1={Y(0)}
                    x2={X(1)}
                    y2={Y(Math.max(-tangentClamp, Math.min(tangentClamp, Math.tan(a))))}
                  />
                  <line
                    className={styles.tangentSeg}
                    x1={X(1)}
                    y1={Y(0)}
                    x2={X(1)}
                    y2={Y(Math.max(-tangentClamp, Math.min(tangentClamp, Math.tan(a))))}
                  />
                </>
              )}

              <line className={styles.radius} x1={cx} y1={cy} x2={X(px)} y2={Y(py)} />
              <path className={styles.angleArc} d={arc.d} />
              <path
                className={styles.angleHead}
                d={arrowHead(
                  arc.end[0],
                  arc.end[1],
                  arc.end[0] - arc.prev[0],
                  arc.end[1] - arc.prev[1],
                  6,
                )}
              />
              {item.label && (
                <SvgMath
                  x={X((item.labelRadius ?? 0.4) * Math.cos(toRad(item.deg / 2)))}
                  y={Y((item.labelRadius ?? 0.4) * Math.sin(toRad(item.deg / 2)))}
                  math={item.label}
                  fontSize={item.fontSize ?? 15}
                  tone={tone}
                  halo
                />
              )}
              <circle className={styles.dot} cx={X(px)} cy={Y(py)} r={5.5} />
              {/* O rótulo do ponto é ancorado para o lado de fora e recebe
                  `space` até a borda: sem isso, um rótulo longo como
                  P(cos θ, sen θ) é recortado pelo viewBox. */}
              {item.pointLabel &&
                (() => {
                  const toRight = px >= 0;
                  const lx = X(px) + (item.pointDx ?? (toRight ? 12 : -12));
                  return (
                    <SvgMath
                      x={lx}
                      y={Y(py) + (item.pointDy ?? (py >= 0 ? -18 : 18))}
                      math={item.pointLabel}
                      anchor={toRight ? 'start' : 'end'}
                      space={toRight ? viewW - lx - 4 : lx - 4}
                      fontSize={item.pointFontSize ?? 14}
                      tone={tone}
                      halo
                    />
                  );
                })()}
            </g>
          );
        })}

        {marks.map((item, index) => {
          const a = toRad(item.deg);
          const px = Math.cos(a);
          const py = Math.sin(a);
          const lr = item.labelRadius ?? 1.19;
          return (
            <g key={`mk-${index}`} style={{'--tone': toneVar(item.tone ?? 1)}}>
              <circle className={styles.markDot} cx={X(px)} cy={Y(py)} r={4} />
              {item.label && (
                <SvgMath
                  x={X(lr * px)}
                  y={Y(lr * py)}
                  math={item.label}
                  fontSize={item.fontSize ?? 13}
                  tone={item.tone}
                  halo
                />
              )}
            </g>
          );
        })}

        <SvgMath x={X(xExtent) - 4} y={cy + 20} math={axisLabels[0]} fontSize={14} halo />
        <SvgMath x={cx + 20} y={Y(yExtent) + 4} math={axisLabels[1]} fontSize={14} halo />
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
