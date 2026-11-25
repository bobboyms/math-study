import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// A conta do produto escalar como a conta de uma nota de compra (lição 7.31,
// Produto escalar).
//
// Duas listas na mesma ordem ficam lado a lado, uma linha por par. Na
// animação, cada linha multiplica o seu par e escreve o produto na coluna da
// direita; no fim, os produtos descem e são somados num número só. O que a
// figura deixa à vista é que o resultado não é uma lista: os produtos
// separados ainda não são a resposta, e só a soma deles é.
//
// Botões opcionais (`controls`):
// - 'swap' troca as duas colunas de lugar (comutativa): os produtos não mudam;
// - 'double' dobra a primeira lista: cada produto dobra, e o total dobra junto.

const W = 440;
const ROW_H = 46;
const TOP = 50;
const X_NAME = 92; // borda direita do nome da linha
const X_A = 150;
const X_TIMES = 196;
const X_B = 242;
const X_EQ = 290;
const X_P = 350;
const CHIP_W = 58;
const CHIP_H = 30;

const tex = (n) => {
  const s = Number.isInteger(n) ? String(n) : String(n).replace('.', '{,}');
  return s.startsWith('-') ? `-${s.slice(1)}` : s;
};
const texP = (n) => (n < 0 ? `(${tex(n)})` : tex(n));

function Chip({x, y, math, tone, opacity = 1, filled = false}) {
  const stroke = tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-600)';
  return (
    <g opacity={opacity}>
      <rect
        x={x - CHIP_W / 2}
        y={y - CHIP_H / 2}
        width={CHIP_W}
        height={CHIP_H}
        rx={6}
        fill={filled && tone ? stroke : 'var(--mv-paper)'}
        fillOpacity={filled && tone ? 0.16 : 1}
        stroke={stroke}
        strokeWidth={1.5}
      />
      <SvgMath x={x} y={y} math={math} fontSize={15} />
    </g>
  );
}

export default function DotPairs({
  a,
  b,
  names,
  headA = '\\text{quantidade}',
  headB = '\\text{preço}',
  headP = '\\text{produto}',
  unit = '',
  controls = [],
  caption,
}) {
  const n = a.length;
  const duration = 1.2 + n * 0.8 + 1.6;
  const {ref, t, play, playing} = useAnimation({duration});
  const [swapped, setSwapped] = useState(false);
  const [doubled, setDoubled] = useState(false);

  const k = doubled ? 2 : 1;
  const A0 = a.map((x) => x * k);
  const colA = swapped ? b : A0;
  const colB = swapped ? A0 : b;
  const hA = swapped ? headB : headA;
  const hB = swapped ? headA : headB;
  const products = colA.map((x, i) => x * colB[i]);
  const total = products.reduce((s, x) => s + x, 0);

  const showRows = stage(t, 0, 0.8);
  const rowK = (i) => stage(t, 1.0 + i * 0.8, 1.6 + i * 0.8);
  const sumK = stage(t, 1.2 + n * 0.8, 1.2 + n * 0.8 + 1.2);

  const rowY = (i) => TOP + i * ROW_H + ROW_H / 2;
  const lineY = TOP + n * ROW_H + 6;
  const sumY = lineY + 34;
  const H = sumY + 34;

  const sumText = `${products.map((p, i) => (i === 0 ? tex(p) : p < 0 ? `- ${tex(-p)}` : `+ ${tex(p)}`)).join(' ')} = ${tex(total)}${unit ? `\\ \\text{${unit}}` : ''}`;

  return (
    <div className={shared.wrapper} data-explorer="dot-pairs">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={`Duas listas lado a lado. Cada par é multiplicado e os produtos são somados: ${total}.`}
        >
          <g opacity={showRows}>
            <SvgMath x={X_A} y={TOP - 22} math={hA} fontSize={13} tone={swapped ? 2 : 1} />
            <SvgMath x={X_B} y={TOP - 22} math={hB} fontSize={13} tone={swapped ? 1 : 2} />
          </g>
          <g opacity={stage(t, 1.0, 1.6)}>
            <SvgMath x={X_P} y={TOP - 22} math={headP} fontSize={13} tone={3} />
          </g>

          {colA.map((x, i) => {
            const y = rowY(i);
            const rk = rowK(i);
            return (
              <g key={i}>
                <g opacity={showRows}>
                  {names && (
                    <SvgMath x={X_NAME} y={y} math={`\\text{${names[i]}}`} anchor="end" space={X_NAME - 4} fontSize={14} />
                  )}
                  <Chip x={X_A} y={y} math={tex(x)} tone={swapped ? 2 : 1} />
                  <SvgMath x={X_TIMES} y={y} math="\times" fontSize={15} />
                  <Chip x={X_B} y={y} math={tex(colB[i])} tone={swapped ? 1 : 2} />
                </g>
                <g opacity={rk}>
                  <SvgMath x={X_EQ} y={y} math="=" fontSize={15} />
                  <Chip x={X_P - 20 * (1 - rk)} y={y} math={tex(products[i])} tone={3} filled />
                </g>
              </g>
            );
          })}

          <g opacity={sumK}>
            <line
              x1={X_P - CHIP_W / 2 - 8}
              x2={X_P + CHIP_W / 2 + 8}
              y1={lineY}
              y2={lineY}
              stroke="var(--mv-tone-3)"
              strokeWidth={1.5}
            />
            <SvgMath x={W - 8} y={sumY} math={`\\text{soma: } ${sumText}`} anchor="end" space={W - 12} fontSize={15} tone={3} />
          </g>
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          {swapped
            ? 'As colunas trocaram de lugar. Cada linha multiplica os mesmos dois números, só que na outra ordem, e por isso os produtos e o total não mudam.'
            : doubled
              ? 'A primeira lista dobrou. Cada produto dobrou junto, e por isso o total também dobrou.'
              : 'Os produtos separados ainda não são a resposta. A resposta é a soma deles: um número só.'}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a conta de novo
        </button>
        {controls.includes('swap') && (
          <button
            type="button"
            aria-pressed={swapped}
            disabled={playing}
            onClick={() => {
              setSwapped(!swapped);
              play();
            }}
          >
            {swapped ? 'Voltar à ordem inicial' : 'Trocar a ordem das colunas'}
          </button>
        )}
        {controls.includes('double') && (
          <button
            type="button"
            aria-pressed={doubled}
            disabled={playing}
            onClick={() => {
              setDoubled(!doubled);
              play();
            }}
          >
            {doubled ? 'Voltar à primeira lista original' : 'Dobrar a primeira lista'}
          </button>
        )}
      </div>
    </div>
  );
}
