import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Cubo de aresta a + b, cortado nos oito pedaços de (a + b)^3.
//
// É o AreaModel um grau acima: lá o produto era área e as partes cruzadas eram
// faixas; aqui o produto é volume e as partes cruzadas são lajes.
//
// A projeção é a cavaleira — a profundidade recua para cima e para a direita, a
// 45°, com escala reduzida (`depth`). É a convenção mais simples que ainda deixa
// as três dimensões legíveis, e, como só encurta a profundidade, as arestas da
// frente continuam com o comprimento de verdade.
//
// Com `gap = 0` os oito pedaços encostam e o desenho é o cubo inteiro, com as
// linhas de corte à mostra. Com `gap > 0` eles se afastam e os oito aparecem.

const PAD = {top: 30, right: 24, bottom: 30, left: 30};
const BASE_GAP = 30; // espaço extra embaixo quando há colchete da aresta inteira

// Quantas arestas b o pedaço tem: 0 → a³, 1 → a²b, 2 → ab², 3 → b³. O tom vem
// daí, então pedaços do mesmo tipo saem da mesma cor — é o que mostra, sem
// precisar contar, que a²b aparece três vezes. O tipo a³ fica no tom neutro:
// ele é o volume que já existia antes de a aresta crescer.
const CLASS_TONE = [0, 1, 2, 3];

// Topo, frente e lado com opacidades diferentes dão relevo sem gastar um
// segundo tom no mesmo pedaço — o limite de três cores continua valendo.
const FACE_OPACITY = {top: 0.34, front: 0.22, side: 0.12};

const labelSize = (edge) => (edge < 34 ? 10 : edge < 52 ? 12 : 14);

export default function CubeModel({
  a = 4,
  b = 2,
  unit = 30,
  gap = 0,
  // A folga vertical é separada porque a profundidade recua na diagonal para
  // cima e para a direita: com folga igual nos três eixos, cada pedaço de trás
  // pousa exatamente atrás do pedaço da frente que está uma casa na diagonal, e
  // o rótulo dele some. Abrir mais a vertical desfaz esse alinhamento.
  gapY = gap,
  // Quanto a profundidade recua.
  depth = 0.5,
  aLabel = 'a',
  bLabel = 'b',
  pieceLabels = ['a^3', 'a^2b', 'ab^2', 'b^3'],
  showPieceLabels = true,
  showEdgeLabels = true,
  baseLabel,
  caption,
}) {
  const sizes = [a * unit, b * unit];
  const g = gap * unit;
  const gy = gapY * unit;
  const offsets = [0, sizes[0] + g];
  const offsetsY = [0, sizes[0] + gy];
  const total = sizes[0] + sizes[1] + g;
  const totalY = sizes[0] + sizes[1] + gy;

  const spanW = total + depth * total;
  const spanH = totalY + depth * total;
  const ox = PAD.left;
  const oy = PAD.top + spanH;

  const viewW = PAD.left + spanW + PAD.right;
  const viewH = PAD.top + spanH + PAD.bottom + (baseLabel ? BASE_GAP : 0);

  const proj = (x, y, z) => [ox + x + depth * z, oy - y - depth * z];
  const poly = (points) =>
    points.map(([x, y, z]) => proj(x, y, z).join(',')).join(' ');

  const pieces = [];
  [0, 1].forEach((i) =>
    [0, 1].forEach((j) =>
      [0, 1].forEach((k) =>
        pieces.push({
          key: `${i}${j}${k}`,
          x: offsets[i],
          y: offsetsY[j],
          z: offsets[k],
          w: sizes[i],
          h: sizes[j],
          d: sizes[k],
          cls: i + j + k,
        }),
      ),
    ),
  );

  // Pintor: o que está mais fundo vai primeiro, para os pedaços da frente
  // cobrirem o que passa por trás deles.
  pieces.sort((p, q) => q.z - p.z);

  const edgeMarks = [
    {label: aLabel, at: offsets[0] + sizes[0] / 2, edge: sizes[0]},
    {label: bLabel, at: offsets[1] + sizes[1] / 2, edge: sizes[1]},
  ];
  const edgeMarksY = [
    {label: aLabel, at: offsetsY[0] + sizes[0] / 2, edge: sizes[0]},
    {label: bLabel, at: offsetsY[1] + sizes[1] / 2, edge: sizes[1]},
  ];

  const bottomY = oy;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 320)}px`}}
        role="img"
        aria-label={
          caption || 'Cubo de aresta a mais b dividido em oito pedaços.'
        }
      >
        {pieces.map(({key, x, y, z, w, h, d, cls}) => {
          const tone = `var(--mv-tone-${CLASS_TONE[cls]})`;
          const faces = [
            {
              name: 'side',
              points: [
                [x + w, y, z],
                [x + w, y, z + d],
                [x + w, y + h, z + d],
                [x + w, y + h, z],
              ],
            },
            {
              name: 'top',
              points: [
                [x, y + h, z],
                [x + w, y + h, z],
                [x + w, y + h, z + d],
                [x, y + h, z + d],
              ],
            },
            {
              name: 'front',
              points: [
                [x, y, z],
                [x + w, y, z],
                [x + w, y + h, z],
                [x, y + h, z],
              ],
            },
          ];
          const [cx, cy] = proj(x + w / 2, y + h / 2, z);
          return (
            <g key={key}>
              {/* Forro opaco na cor do papel antes do tom. Sem ele as faces
                  ficam translúcidas, o desenho vira um emaranhado de arestas e
                  o algoritmo do pintor não esconde nada. */}
              {faces.map((face) => (
                <polygon
                  key={`${face.name}-forro`}
                  className={styles.backing}
                  points={poly(face.points)}
                />
              ))}
              {faces.map((face) => (
                <polygon
                  key={face.name}
                  className={styles.face}
                  style={{
                    '--tone': tone,
                    fillOpacity: FACE_OPACITY[face.name],
                  }}
                  points={poly(face.points)}
                />
              ))}
              {showPieceLabels && (
                <SvgMath
                  x={cx}
                  y={cy}
                  math={pieceLabels[cls]}
                  fontSize={labelSize(Math.min(w, h))}
                />
              )}
            </g>
          );
        })}

        {showEdgeLabels &&
          edgeMarks.map(({label, at, edge}) => (
            <g key={`x-${label}`}>
              <path
                className={styles.guide}
                d={`M ${ox + at - edge / 2} ${bottomY + 8} L ${ox + at - edge / 2} ${bottomY + 14} L ${ox + at + edge / 2} ${bottomY + 14} L ${ox + at + edge / 2} ${bottomY + 8}`}
              />
              <SvgMath x={ox + at} y={bottomY + 26} math={label} fontSize={14} />
            </g>
          ))}

        {showEdgeLabels &&
          edgeMarksY.map(({label, at, edge}) => (
            <g key={`y-${label}`}>
              <path
                className={styles.guide}
                d={`M ${ox - 8} ${bottomY - at + edge / 2} L ${ox - 14} ${bottomY - at + edge / 2} L ${ox - 14} ${bottomY - at - edge / 2} L ${ox - 8} ${bottomY - at - edge / 2}`}
              />
              <SvgMath
                x={ox - 18}
                y={bottomY - at}
                math={label}
                anchor="end"
                space={PAD.left - 18}
                fontSize={14}
              />
            </g>
          ))}

        {baseLabel && (
          <g>
            <path
              className={styles.guide}
              d={`M ${ox} ${bottomY + 36} L ${ox} ${bottomY + 42} L ${ox + total} ${bottomY + 42} L ${ox + total} ${bottomY + 36}`}
            />
            <SvgMath
              x={ox + total / 2}
              y={bottomY + 56}
              math={baseLabel}
              fontSize={14}
            />
          </g>
        )}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
