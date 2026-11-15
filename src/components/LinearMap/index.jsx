import React, {useId} from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// O plano antes e depois de uma matriz 2×2.
//
// A ideia que o desenho ensina: uma matriz não mexe num ponto de cada vez de
// um jeito qualquer. Ela leva a malha quadriculada inteira numa malha de
// paralelogramos, e basta saber para onde vão os dois vetores da base
// (e1 e e2, as colunas da matriz) para saber para onde vai todo o resto.
//
// Convenções iguais às do CartesianPlane: y para cima, tons 1 a 3, rótulos em
// KaTeX. e1 e sua imagem usam o tom 1; e2 e sua imagem, o tom 2; o quadrado
// unitário e sua imagem, o tom 3 em preenchimento claro.

const PAD = 30;

const toneVar = (tone) =>
  tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';

const fmt = (v) => {
  const r = Math.round(v * 100) / 100;
  return String(r).replace('.', '{,}');
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

function Panel({
  M,
  win,
  unit,
  extent,
  vectors,
  showBasis,
  showSquare,
  basisLabels,
  title,
  uid,
  imageSide,
}) {
  const [xMin, xMax, yMin, yMax] = win;
  const W = PAD * 2 + (xMax - xMin) * unit;
  const H = PAD * 2 + (yMax - yMin) * unit + (title ? 26 : 0);
  const top = PAD + (title ? 26 : 0);
  const X = (x) => PAD + (x - xMin) * unit;
  const Y = (y) => top + (yMax - y) * unit;
  const apply = (p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];
  const S = (p) => {
    const q = apply(p);
    return [X(q[0]), Y(q[1])];
  };

  const ks = [];
  for (let k = -extent; k <= extent; k += 1) ks.push(k);

  // Sem deslocamento informado, o rótulo vai 20 px além da ponta, na mesma
  // direção da seta: assim ele nunca cai em cima do próprio traço.
  const arrow = (from, to, tone, key, label, labelDx, labelDy) => {
    const a = [X(from[0]), Y(from[1])];
    const b = [X(to[0]), Y(to[1])];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1) return null;
    // Seta apontando para o lado: o rótulo se ancora pela borda, para que um
    // rótulo largo como (−1, 0) não volte por cima da ponta.
    let anchor = 'middle';
    if (labelDx === undefined || labelDy === undefined) {
      const ux = (b[0] - a[0]) / len;
      const uy = (b[1] - a[1]) / len;
      if (ux > 0.45) {
        anchor = 'start';
        labelDx = 8;
        labelDy = uy * 16;
      } else if (ux < -0.45) {
        anchor = 'end';
        labelDx = -8;
        labelDy = uy * 16;
      } else {
        labelDx = ux * 16;
        labelDy = uy * 20;
      }
    }
    const cut = Math.min(9, len / 2);
    const end = [b[0] - ((b[0] - a[0]) / len) * cut, b[1] - ((b[1] - a[1]) / len) * cut];
    return (
      <g key={key} style={{'--tone': toneVar(tone)}}>
        <line className={styles.vec} x1={a[0]} y1={a[1]} x2={end[0]} y2={end[1]} />
        <path className={styles.head} d={arrowHead(b[0], b[1], b[0] - a[0], b[1] - a[1])} />
        {label && (
          <SvgMath
            x={b[0] + labelDx}
            y={b[1] + labelDy}
            anchor={anchor}
            math={label}
            fontSize={13}
            tone={tone}
            halo
          />
        )}
      </g>
    );
  };

  const e1 = apply([1, 0]);
  const e2 = apply([0, 1]);
  const sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(S);

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${W} ${H}`}
      style={{maxWidth: `${W}px`}}
      role="img"
      aria-label={title || 'Plano transformado por uma matriz.'}
    >
      <defs>
        <clipPath id={`clip-${uid}`}>
          <rect x={PAD} y={top} width={W - PAD * 2} height={H - top - PAD} />
        </clipPath>
      </defs>
      {title && (
        <SvgMath x={W / 2} y={14} math={title} fontSize={14} />
      )}
      <g clipPath={`url(#clip-${uid})`}>
        {/* malha original, sempre fixa, bem clara */}
        <g className={styles.gridFixed}>
          {Array.from({length: Math.floor(xMax) - Math.ceil(xMin) + 1}, (_, i) => Math.ceil(xMin) + i).map((v) => (
            <line key={`fx-${v}`} x1={X(v)} y1={top} x2={X(v)} y2={H - PAD} />
          ))}
          {Array.from({length: Math.floor(yMax) - Math.ceil(yMin) + 1}, (_, i) => Math.ceil(yMin) + i).map((v) => (
            <line key={`fy-${v}`} x1={PAD} y1={Y(v)} x2={W - PAD} y2={Y(v)} />
          ))}
        </g>
        {/* malha levada pela matriz */}
        {imageSide && (
          <g className={styles.gridMoved}>
            {ks.map((k) => {
              const a = S([k, -extent]);
              const b = S([k, extent]);
              const c = S([-extent, k]);
              const d = S([extent, k]);
              return (
                <g key={`m-${k}`} className={k === 0 ? styles.gridMovedAxis : undefined}>
                  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
                  <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} />
                </g>
              );
            })}
          </g>
        )}
        {showSquare && (
          <path
            className={styles.square}
            d={`M ${sq.map((p) => `${p[0]} ${p[1]}`).join(' L ')} Z`}
          />
        )}
      </g>
      <line className={styles.axis} x1={PAD} y1={Y(0)} x2={W - PAD} y2={Y(0)} />
      <line className={styles.axis} x1={X(0)} y1={top} x2={X(0)} y2={H - PAD} />
      {showBasis && arrow([0, 0], e1, 1, 'e1', basisLabels[0], basisLabels[2]?.[0], basisLabels[2]?.[1])}
      {showBasis && arrow([0, 0], e2, 2, 'e2', basisLabels[1], basisLabels[3]?.[0], basisLabels[3]?.[1])}
      {vectors.map((v, i) => {
        const to = imageSide ? apply(v.v) : v.v;
        const label = imageSide ? v.imageLabel : v.label;
        const off = imageSide ? v.imageOffset : v.offset;
        return arrow([0, 0], to, v.tone ?? 3, `v-${i}`, label, off?.[0], off?.[1]);
      })}
    </svg>
  );
}

export default function LinearMap({
  matrix = [[1, 0], [0, 1]],
  layout = 'side',
  extent = 4,
  window: win,
  unit = 34,
  vectors = [],
  showBasis = true,
  showSquare = true,
  basisLabels,
  titles = ['\\text{antes}', '\\text{depois}'],
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const M = matrix;
  // Janela automática: cabe o quadrado unitário transformado, os vetores e
  // suas imagens, com folga de uma unidade.
  let w = win;
  if (!w) {
    const pts = [[0, 0], [1, 0], [0, 1], [1, 1], ...vectors.map((v) => v.v)];
    const imgs = pts.map((p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]]);
    const all = [...pts, ...imgs];
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    w = [
      Math.floor(Math.min(...xs, -1)) - 1,
      Math.ceil(Math.max(...xs, 1)) + 1,
      Math.floor(Math.min(...ys, -1)) - 1,
      Math.ceil(Math.max(...ys, 1)) + 1,
    ];
  }
  const ident = [[1, 0], [0, 1]];
  const labelsBefore = basisLabels?.before ?? ['\\vec{e}_1', '\\vec{e}_2'];
  const labelsAfter = basisLabels?.after ?? [
    `(${fmt(M[0][0])},\\ ${fmt(M[1][0])})`,
    `(${fmt(M[0][1])},\\ ${fmt(M[1][1])})`,
  ];

  return (
    <figure className={styles.figure}>
      <div className={layout === 'side' ? styles.row : styles.single}>
        {layout === 'side' && (
          <Panel
            M={ident}
            win={w}
            unit={unit}
            extent={extent}
            vectors={vectors}
            showBasis={showBasis}
            showSquare={showSquare}
            basisLabels={labelsBefore}
            title={titles[0]}
            uid={`${uid}-a`}
            imageSide={false}
          />
        )}
        <Panel
          M={M}
          win={w}
          unit={unit}
          extent={extent}
          vectors={vectors}
          showBasis={showBasis}
          showSquare={showSquare}
          basisLabels={labelsAfter}
          title={layout === 'side' ? titles[1] : undefined}
          uid={`${uid}-b`}
          imageSide
        />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
