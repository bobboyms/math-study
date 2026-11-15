import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Eixos x, y, z em perspectiva cavaleira: y para a direita, z para cima e x
// saindo do papel em direção ao leitor, desenhado na diagonal para baixo e
// para a esquerda, encurtado. É a convenção dos livros de geometria analítica.
//
// O desenho que este componente existe para fazer é a "caixa" de um ponto:
// o ponto (x, y, z), sua sombra (x, y, 0) no chão e as três linhas tracejadas
// que mostram que cada coordenada é um deslocamento ao longo de um eixo. É ela
// que permite ver Pitágoras duas vezes na fórmula da distância no espaço.

const toneVar = (tone) =>
  tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';

// Direção do eixo x na tela: 210° (para baixo e para a esquerda), encurtado.
const DEPTH = 0.6;
const ANG = (210 * Math.PI) / 180;
const XS = DEPTH * Math.cos(ANG); // ≈ -0,52
const YS = DEPTH * Math.sin(ANG); // ≈ -0,30

function arrowHead(x, y, dx, dy, size = 11) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x - ux * size;
  const by = y - uy * size;
  const nx = -uy * size * 0.5;
  const ny = ux * size * 0.5;
  return `M ${x} ${y} L ${bx + nx} ${by + ny} L ${bx - nx} ${by - ny} Z`;
}

export default function Space3D({
  max = [4, 4, 4],
  min = [0, 0, 0],
  unit = 40,
  points = [],
  vectors = [],
  segments = [],
  boxes = [],
  labels = [],
  ticks = true,
  axisLabels = ['x', 'y', 'z'],
  padding = 40,
  caption,
}) {
  // Projeção para coordenadas de tela antes de enquadrar.
  const proj = (p) => [unit * (p[1] + XS * p[0]), -unit * (p[2] + YS * p[0])];

  const axisEnds = [
    // O eixo x é encurtado na tela (fator 0,6): ele precisa ir mais longe além
    // do último traço, senão o número desse traço encosta na ponta da seta.
    [[min[0], 0, 0], [max[0] + 1.5, 0, 0]],
    [[0, min[1], 0], [0, max[1] + 0.8, 0]],
    [[0, 0, min[2]], [0, 0, max[2] + 0.8]],
  ];
  const allPts = [
    ...axisEnds.flat(),
    ...points.map((p) => p.at),
    ...vectors.flatMap((v) => [v.from ?? [0, 0, 0], v.to]),
  ].map(proj);
  const xs = allPts.map((p) => p[0]);
  const ys = allPts.map((p) => p[1]);
  // Os nomes dos eixos ficam fora das pontas das setas: o de y à direita, o
  // de x abaixo e à esquerda, o de z acima. A margem cresce com o tamanho do
  // nome (≈ 8 px por letra), para que “comédia” não seja cortado na borda.
  const nameW = (i) => (axisLabels ? String(axisLabels[i]).replace(/\\[a-z]+|[{}]/g, '').length * 8 : 0);
  const left = Math.min(...xs) - padding - nameW(0);
  const topY = Math.min(...ys) - padding;
  const W = Math.max(...xs) - left + padding + nameW(1);
  const H = Math.max(...ys) - topY + padding;
  const S = (p) => {
    const q = proj(p);
    return [q[0] - left, q[1] - topY];
  };

  const line = (a, b, cls, key, tone) => {
    const p = S(a);
    const q = S(b);
    return (
      <line
        key={key}
        className={cls}
        style={tone !== undefined ? {'--tone': toneVar(tone)} : undefined}
        x1={p[0]}
        y1={p[1]}
        x2={q[0]}
        y2={q[1]}
      />
    );
  };

  const arrow = (from, to, tone, key, label, dx, dy) => {
    const a = S(from);
    const b = S(to);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    let anchor = 'middle';
    if (dx === undefined || dy === undefined) {
      const ux = (b[0] - a[0]) / len;
      const uy = (b[1] - a[1]) / len;
      if (ux > 0.45) {
        anchor = 'start';
        dx = 8;
        dy = uy * 16;
      } else if (ux < -0.45) {
        anchor = 'end';
        dx = -8;
        dy = uy * 16;
      } else {
        dx = ux * 16;
        dy = uy * 20;
      }
    }
    const cut = Math.min(9, len / 2);
    const end = [b[0] - ((b[0] - a[0]) / len) * cut, b[1] - ((b[1] - a[1]) / len) * cut];
    return (
      <g key={key} style={{'--tone': toneVar(tone)}}>
        <line className={styles.vec} x1={a[0]} y1={a[1]} x2={end[0]} y2={end[1]} />
        <path className={styles.head} d={arrowHead(b[0], b[1], b[0] - a[0], b[1] - a[1])} />
        {label && (
          <SvgMath x={b[0] + dx} y={b[1] + dy} anchor={anchor} math={label} fontSize={13} tone={tone} halo />
        )}
      </g>
    );
  };

  // A "caixa" de um ponto: do ponto à sombra no chão, e da sombra aos eixos.
  const boxLines = (p, key) => {
    const [x, y, z] = p;
    const out = [];
    out.push(line([x, y, z], [x, y, 0], styles.guide, `${key}-v`));
    out.push(line([x, y, 0], [x, 0, 0], styles.guide, `${key}-a`));
    out.push(line([x, y, 0], [0, y, 0], styles.guide, `${key}-b`));
    out.push(line([0, 0, 0], [x, y, 0], styles.guideFloor, `${key}-d`));
    return out;
  };

  const tickMarks = [];
  if (ticks) {
    for (let k = 1; k <= max[0]; k += 1) {
      const p = S([k, 0, 0]);
      tickMarks.push(
        <g key={`tx-${k}`}>
          <line className={styles.tick} x1={p[0] - 4} y1={p[1]} x2={p[0] + 4} y2={p[1]} />
          <text className={styles.number} x={p[0] - 12} y={p[1] + 4} textAnchor="end">{k}</text>
        </g>,
      );
    }
    for (let k = 1; k <= max[1]; k += 1) {
      const p = S([0, k, 0]);
      tickMarks.push(
        <g key={`ty-${k}`}>
          <line className={styles.tick} x1={p[0]} y1={p[1] - 4} x2={p[0]} y2={p[1] + 4} />
          <text className={styles.number} x={p[0]} y={p[1] + 18} textAnchor="middle">{k}</text>
        </g>,
      );
    }
    for (let k = 1; k <= max[2]; k += 1) {
      const p = S([0, 0, k]);
      tickMarks.push(
        <g key={`tz-${k}`}>
          <line className={styles.tick} x1={p[0] - 4} y1={p[1]} x2={p[0] + 4} y2={p[1]} />
          <text className={styles.number} x={p[0] - 9} y={p[1] + 4} textAnchor="end">{k}</text>
        </g>,
      );
    }
  }

  const axisLabelPos = [0, 1, 2];

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        style={{maxWidth: `${W}px`}}
        role="img"
        aria-label={caption || 'Eixos x, y e z no espaço.'}
      >
        {axisEnds.map(([a, b], i) => {
          const p = S(a);
          const q = S(b);
          return (
            <g key={`ax-${i}`}>
              <line className={styles.axis} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />
              <path className={styles.axisHead} d={arrowHead(q[0], q[1], q[0] - p[0], q[1] - p[1], 8)} />
            </g>
          );
        })}
        {tickMarks}
        {axisLabels &&
          axisLabelPos.map((p, i) => {
            const tip = S(axisEnds[i][1]);
            const place = [
              {x: tip[0] - 8, y: tip[1] + 12, anchor: 'end'},
              {x: tip[0] + 10, y: tip[1], anchor: 'start'},
              {x: tip[0], y: tip[1] - 16, anchor: 'middle'},
            ][i];
            return (
              <SvgMath
                key={`al-${i}`}
                x={place.x}
                y={place.y}
                anchor={place.anchor}
                math={axisLabels[i]}
                fontSize={14}
              />
            );
          })}
        {boxes.map((b, i) => boxLines(b, `box-${i}`))}
        {segments.map((sg, i) =>
          line(sg.from, sg.to, sg.dashed ? styles.segDashed : styles.seg, `sg-${i}`, sg.tone ?? 2),
        )}
        {vectors.map((v, i) =>
          arrow(v.from ?? [0, 0, 0], v.to, v.tone ?? 1, `v-${i}`, v.label, v.dx, v.dy),
        )}
        {points.map((pt, i) => {
          const s = S(pt.at);
          return (
            <g key={`pt-${i}`}>
              <circle className={styles.dot} style={{'--tone': toneVar(pt.tone ?? 2)}} cx={s[0]} cy={s[1]} r={4.5} />
              {pt.label && (
                <SvgMath
                  x={s[0] + (pt.dx ?? 0)}
                  y={s[1] + (pt.dy ?? -16)}
                  math={pt.label}
                  fontSize={13}
                  tone={pt.tone ?? 2}
                  halo
                />
              )}
            </g>
          );
        })}
        {labels.map((lb, i) => {
          const s = S(lb.at);
          return (
            <SvgMath
              key={`lb-${i}`}
              x={s[0] + (lb.dx ?? 0)}
              y={s[1] + (lb.dy ?? 0)}
              math={lb.math}
              anchor={lb.anchor ?? 'middle'}
              fontSize={13}
              tone={lb.tone}
              halo
            />
          );
        })}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
