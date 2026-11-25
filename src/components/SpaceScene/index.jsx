import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from '../Space3D/styles.module.css';

// Cena em três dimensões para as figuras da lição 7.34 (Vetores no espaço).
//
// Mesma convenção do Space3D: y para a direita, z para cima e x saindo do
// papel, desenhado na diagonal para baixo e para a esquerda e encurtado. A
// diferença é que esta cena recebe uma lista de peças (linhas, setas, pontos,
// polígonos, marcas de ângulo reto e arcos) e pode ser girada em torno do eixo
// z (`view`, em graus). As figuras animadas montam a lista a cada quadro.
//
// O enquadramento é calculado só a partir de `frame` (pontos que precisam
// caber) e de `frameViews` (vistas em que eles precisam caber). Assim a figura
// não muda de tamanho enquanto as peças se movem ou a vista gira.
//
// O eixo x vai na tela para (−0,5; −0,25) por unidade. Com esses números, o
// ponto (x, y, z) cai no papel em (y − 0,5x; z − 0,25x). Por isso (0, 2, 3) e
// (4, 4, 4) caem exatamente no mesmo lugar: é o exemplo da figura da
// profundidade (DepthTwins).

export const XS = -0.5;
export const YS = -0.25;

const toneVar = (tone) =>
  tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';

export const add = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
export const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
export const times = (k, p) => [k * p[0], k * p[1], k * p[2]];
export const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
export const norm = (p) => Math.sqrt(dot(p, p));
export const lerp = (p, q, s) => add(p, times(s, sub(q, p)));
export const cross = (p, q) => [
  p[1] * q[2] - p[2] * q[1],
  p[2] * q[0] - p[0] * q[2],
  p[0] * q[1] - p[1] * q[0],
];

// Gira o ponto em torno do eixo z, `deg` graus no sentido anti-horário visto
// de cima.
export function turn(p, deg) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
}

// Posição no papel, em unidades (y da tela para baixo).
export function project(p, view = 0) {
  const q = view ? turn(p, view) : p;
  return [q[1] + XS * q[0], -(q[2] + YS * q[0])];
}

// Número com vírgula decimal e sinal de menos tipográfico.
export const num = (value, digits = 2) => {
  const r = Number(Number(value).toFixed(digits));
  const s = String(Object.is(r, -0) ? 0 : r).replace('.', ',');
  return s.replace('-', '−');
};
// O mesmo número para dentro de uma fórmula KaTeX.
export const tex = (value, digits = 2) => {
  const r = Number(Number(value).toFixed(digits));
  return String(Object.is(r, -0) ? 0 : r).replace('.', '{,}');
};
// Terna na notação da casa: vírgula entre coordenadas inteiras, ponto e
// vírgula quando alguma coordenada tem vírgula decimal.
export const triple = (p, digits = 2) => {
  const parts = p.map((v) => tex(v, digits));
  const sep = parts.some((s) => s.includes('{,}')) ? ';\\ ' : ',\\ ';
  return `(${parts.join(sep)})`;
};

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

// Arco de ângulo entre as direções `a` e `b`, saindo de `center`, com raio
// `r` (em unidades do espaço). Devolve a lista de pontos do arco.
export function arcPoints(center, a, b, r, steps = 28) {
  const ua = times(1 / norm(a), a);
  const ub = times(1 / norm(b), b);
  const cosT = Math.max(-1, Math.min(1, dot(ua, ub)));
  const T = Math.acos(cosT);
  const out = [];
  for (let i = 0; i <= steps; i += 1) {
    const s = i / steps;
    let d;
    if (Math.sin(T) < 1e-6) d = ua;
    else {
      const k1 = Math.sin((1 - s) * T) / Math.sin(T);
      const k2 = Math.sin(s * T) / Math.sin(T);
      d = add(times(k1, ua), times(k2, ub));
    }
    out.push(add(center, times(r, d)));
  }
  return out;
}

// A "caixa" do ponto p, como no Space3D: do ponto até a sombra (x, y, 0) no
// chão, da sombra até os dois eixos, e a diagonal do chão pontilhada.
export function pointBox(p, {opacity = 1, floorDiagonal = true} = {}) {
  const [x, y] = p;
  const out = [];
  if (p[2] !== 0) out.push({type: 'line', from: p, to: [x, y, 0], guide: true, opacity});
  if (y !== 0) out.push({type: 'line', from: [x, y, 0], to: [x, 0, 0], guide: true, opacity});
  if (x !== 0) out.push({type: 'line', from: [x, y, 0], to: [0, y, 0], guide: true, opacity});
  if (floorDiagonal && x !== 0 && y !== 0) out.push({type: 'line', from: [0, 0, 0], to: [x, y, 0], dotted: true, opacity});
  return out;
}

// As 12 arestas da caixa com cantos opostos a e b, tracejadas.
export function fullBox(a, b, {opacity = 1} = {}) {
  const c = (i, j, k) => [i ? b[0] : a[0], j ? b[1] : a[1], k ? b[2] : a[2]];
  const out = [];
  const pairs = [];
  for (let i = 0; i < 2; i += 1)
    for (let j = 0; j < 2; j += 1)
      for (let k = 0; k < 2; k += 1) {
        if (!i) pairs.push([c(0, j, k), c(1, j, k)]);
        if (!j) pairs.push([c(i, 0, k), c(i, 1, k)]);
        if (!k) pairs.push([c(i, j, 0), c(i, j, 1)]);
      }
  pairs.forEach(([p, q]) => {
    if (norm(sub(p, q)) > 1e-9) out.push({type: 'line', from: p, to: q, guide: true, opacity});
  });
  return out;
}

export default function SpaceScene({
  items = [],
  view = 0,
  unit = 40,
  frame = [],
  frameViews,
  axes = {max: [4, 4, 4], min: [0, 0, 0]},
  axisLabels = ['x', 'y', 'z'],
  padding = 34,
  axesOpacity = 1,
  maxWidth,
  caption,
  ariaLabel,
  children,
}) {
  const views = frameViews ?? [view];
  const axisEnds = axes
    ? [
        [[axes.min?.[0] ?? 0, 0, 0], [axes.max[0] + 1.2, 0, 0]],
        [[0, axes.min?.[1] ?? 0, 0], [0, axes.max[1] + 0.8, 0]],
        [[0, 0, axes.min?.[2] ?? 0], [0, 0, axes.max[2] + 0.8]],
      ]
    : [];
  const pts = [...axisEnds.flat(), ...frame];
  const prj = views.flatMap((v) => pts.map((p) => project(p, v)));
  const xs = prj.map((p) => p[0] * unit);
  const ys = prj.map((p) => p[1] * unit);
  const left = Math.min(...xs) - padding - 10;
  const top = Math.min(...ys) - padding;
  const W = Math.max(...xs) - left + padding + 14;
  const H = Math.max(...ys) - top + padding;
  const S = (p) => {
    const q = project(p, view);
    return [q[0] * unit - left, q[1] * unit - top];
  };

  const drawItem = (it, i) => {
    const op = it.opacity ?? 1;
    if (op <= 0.001) return null;
    const style = {'--tone': toneVar(it.tone)};
    if (it.type === 'line') {
      const a = S(it.from);
      const b = S(it.to);
      const cls = it.dashed ? styles.segDashed : it.dotted ? styles.guideFloor : it.guide ? styles.guide : styles.seg;
      return (
        <line
          key={i}
          className={cls}
          style={{...style, opacity: op, strokeWidth: it.width}}
          x1={a[0]}
          y1={a[1]}
          x2={b[0]}
          y2={b[1]}
        />
      );
    }
    if (it.type === 'arrow') {
      const a = S(it.from ?? [0, 0, 0]);
      const b = S(it.to);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 2) return null;
      const cut = Math.min(9, len / 2);
      const end = [b[0] - ((b[0] - a[0]) / len) * cut, b[1] - ((b[1] - a[1]) / len) * cut];
      return (
        <g key={i} style={style} opacity={op}>
          <line
            className={styles.vec}
            style={it.dashed ? {strokeDasharray: '7 5'} : undefined}
            x1={a[0]}
            y1={a[1]}
            x2={end[0]}
            y2={end[1]}
          />
          <path className={styles.head} d={arrowHead(b[0], b[1], b[0] - a[0], b[1] - a[1], Math.min(11, len * 0.6))} />
        </g>
      );
    }
    if (it.type === 'point') {
      const s = S(it.at);
      return (
        <circle
          key={i}
          className={styles.dot}
          style={{'--tone': toneVar(it.tone ?? 2), opacity: op}}
          cx={s[0]}
          cy={s[1]}
          r={it.r ?? 4.5}
        />
      );
    }
    if (it.type === 'poly') {
      const d = it.pts.map((p, k) => `${k ? 'L' : 'M'} ${S(p)[0].toFixed(2)} ${S(p)[1].toFixed(2)}`).join(' ');
      return (
        <path
          key={i}
          d={`${d} Z`}
          fill={toneVar(it.tone)}
          fillOpacity={(it.fill ?? 0.16) * op}
          stroke={it.stroke ? toneVar(it.tone) : 'none'}
          strokeWidth={1.2}
        />
      );
    }
    if (it.type === 'right') {
      const s = it.size ?? 0.35;
      const ea = times(s / norm(it.a), it.a);
      const eb = times(s / norm(it.b), it.b);
      const p1 = S(add(it.at, ea));
      const p2 = S(add(add(it.at, ea), eb));
      const p3 = S(add(it.at, eb));
      return (
        <path
          key={i}
          d={`M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]}`}
          fill="none"
          stroke={toneVar(it.tone)}
          strokeWidth={1.4}
          opacity={op}
        />
      );
    }
    if (it.type === 'arc') {
      const ptsA = arcPoints(it.at, it.a, it.b, it.r ?? 0.6);
      const d = ptsA.map((p, k) => `${k ? 'L' : 'M'} ${S(p)[0].toFixed(2)} ${S(p)[1].toFixed(2)}`).join(' ');
      return (
        <path key={i} d={d} fill="none" stroke={toneVar(it.tone)} strokeWidth={1.8} opacity={op} />
      );
    }
    return null;
  };

  // Rótulos por último, por cima de tudo.
  const drawLabel = (it, i) => {
    const op = it.opacity ?? 1;
    if (op <= 0.001 || !it.math) return null;
    let at = it.at;
    if (it.type === 'arrow' || it.type === 'line') at = it.labelAt ?? it.to;
    if (it.type === 'arc') {
      const mid = arcPoints(it.at, it.a, it.b, it.labelR ?? (it.r ?? 0.6) * 1.6, 2)[1];
      at = mid;
    }
    if (!at) return null;
    const s = S(at);
    return (
      <g key={`lb-${i}`} opacity={op}>
        <SvgMath
          x={s[0] + (it.dx ?? 0)}
          y={s[1] + (it.dy ?? 0)}
          math={it.math}
          anchor={it.anchor ?? 'middle'}
          fontSize={it.size ?? 13}
          tone={it.labelTone ?? it.tone}
          halo
        />
      </g>
    );
  };

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W.toFixed(1)} ${H.toFixed(1)}`}
        style={{maxWidth: `${maxWidth ?? W}px`}}
        role="img"
        aria-label={ariaLabel || caption || 'Figura no espaço, com os eixos x, y e z.'}
      >
        {axisEnds.map(([a, b], i) => {
          const p = S(a);
          const q = S(b);
          return (
            <g key={`ax-${i}`} opacity={axesOpacity}>
              <line className={styles.axis} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />
              <path className={styles.axisHead} d={arrowHead(q[0], q[1], q[0] - p[0], q[1] - p[1], 8)} />
            </g>
          );
        })}
        {axes &&
          axisLabels &&
          axisEnds.map(([a, b], i) => {
            const p = S(a);
            const q = S(b);
            const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
            const ux = (q[0] - p[0]) / len;
            const uy = (q[1] - p[1]) / len;
            return (
              <g key={`al-${i}`} opacity={axesOpacity}>
                <SvgMath x={q[0] + ux * 14} y={q[1] + uy * 14} math={axisLabels[i]} fontSize={14} />
              </g>
            );
          })}
        {items.map(drawItem)}
        {children && children(S)}
        {items.map(drawLabel)}
      </svg>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
