import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import styles from './styles.module.css';

// A parte numérica do fator comum, contada com as mãos.
//
// A expressão 12x + 18 vira peças: 12 tiras (cada uma vale x) e 18
// quadradinhos (cada um vale 1), com as cores das peças do TileModel. O aluno
// escolhe em quantos montes quer distribuir as peças, e elas são distribuídas
// como cartas: uma para cada monte, de novo uma para cada monte, até acabar.
//
// Se todos os montes ficam iguais, o número de montes é um fator comum, e cada
// monte é o que fica dentro do parêntese: 6 montes de (2x + 3). Se algum monte
// fica diferente, aquele número não serve. O painel guarda os números que já
// deram certo, e o maior deles é o MDC dos coeficientes — a contagem chega ao
// MDC antes de a lição dizer o nome.
//
// As peças deslizam até o monte novo (transição CSS). Para quem pediu ao
// sistema menos movimento, elas aparecem direto no lugar.

const W = 440;
const U = 12; // lado do quadradinho
const BAR = 3.2 * U; // comprimento da tira: não é múltiplo do quadradinho
const PITCH = U + 3; // distância entre colunas de peças
const PAD = 7; // folga dentro da caixa do monte
const GROUP_GAP = 10;
const LINE_H = BAR + 2 * PAD + 34;
const MARGIN = 8;

const termTex = (coef, letter) => {
  if (coef === 0) return '';
  if (!letter) return String(coef);
  return coef === 1 ? letter : `${coef}${letter}`;
};

const groupTex = (b, u, letter) =>
  [termTex(b, letter), termTex(u)].filter(Boolean).join(' + ') || '0';

function deal(count, k) {
  return Array.from({length: count}, (_, i) => ({group: i % k, slot: Math.floor(i / k)}));
}

export default function EqualGroups({
  bars = 12,
  units = 18,
  letter = 'x',
  min = 1,
  max = 9,
  initial = 1,
  caption = 'Cada tira vale x e cada quadradinho vale 1. As peças são distribuídas como cartas: uma para cada monte, até acabar.',
}) {
  const [k, setK] = useState(initial);
  const [worked, setWorked] = useState(() =>
    bars % initial === 0 && units % initial === 0 ? [initial] : [],
  );

  const choose = (next) => {
    setK(next);
    if (bars % next === 0 && units % next === 0) {
      setWorked((list) => (list.includes(next) ? list : [...list, next].sort((a, b) => a - b)));
    }
  };

  const barPlaces = deal(bars, k);
  const unitPlaces = deal(units, k);
  const counts = Array.from({length: k}, (_, g) => ({
    b: barPlaces.filter((p) => p.group === g).length,
    u: unitPlaces.filter((p) => p.group === g).length,
  }));
  const equal = bars % k === 0 && units % k === 0;

  // Largura de cada monte: uma coluna por tira e uma coluna a cada três
  // quadradinhos, empilhados de baixo para cima.
  const widthOf = (c) => (c.b + Math.ceil(c.u / 3)) * PITCH - 3 + 2 * PAD;
  const boxes = [];
  let cx = MARGIN;
  let line = 0;
  counts.forEach((c) => {
    const w = widthOf(c);
    if (cx + w > W - MARGIN && cx > MARGIN) {
      line += 1;
      cx = MARGIN;
    }
    boxes.push({x: cx, y: 10 + line * LINE_H, w, ...c});
    cx += w + GROUP_GAP;
  });
  const H = 10 + (line + 1) * LINE_H;

  // Peças: posições dentro do monte de cada uma.
  const pieces = [];
  barPlaces.forEach((place, i) => {
    const box = boxes[place.group];
    pieces.push({
      id: `b${i}`,
      kind: 'bar',
      x: box.x + PAD + place.slot * PITCH,
      y: box.y + PAD,
    });
  });
  unitPlaces.forEach((place, i) => {
    const box = boxes[place.group];
    const col = Math.floor(place.slot / 3);
    const row = place.slot % 3;
    pieces.push({
      id: `u${i}`,
      kind: 'unit',
      x: box.x + PAD + (box.b + col) * PITCH,
      y: box.y + PAD + BAR - U - row * PITCH,
    });
  });

  const each = counts[0];
  const total = `${termTex(bars, letter)} + ${units}`;

  return (
    <div className={shared.wrapper} data-explorer="equal-groups">
      <figure className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={
            equal
              ? `${k} montes iguais, cada um com ${groupTex(each.b, each.u, letter)}.`
              : `${k} montes, mas eles não ficaram iguais.`
          }
        >
          {boxes.map((box, g) => (
            <g key={`box${g}`}>
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={BAR + 2 * PAD}
                rx={5}
                fill="none"
                stroke={equal ? 'var(--mv-tone-1)' : 'var(--mv-guide)'}
                strokeWidth={equal ? 1.75 : 1.25}
                strokeDasharray={equal ? undefined : '4 3'}
              />
              <SvgMath
                x={box.x + box.w / 2}
                y={box.y + BAR + 2 * PAD + 14}
                math={groupTex(box.b, box.u, letter)}
                tone={equal ? 1 : undefined}
                fontSize={12}
              />
            </g>
          ))}
          {pieces.map((piece) => (
            <rect
              key={piece.id}
              className={styles.piece}
              style={{transform: `translate(${piece.x}px, ${piece.y}px)`}}
              x={0}
              y={0}
              width={U}
              height={piece.kind === 'bar' ? BAR : U}
              rx={1.5}
              fill={piece.kind === 'bar' ? 'var(--mv-tone-2)' : 'var(--mv-tone-3)'}
              fillOpacity={0.3}
              stroke={piece.kind === 'bar' ? 'var(--mv-tone-2)' : 'var(--mv-tone-3)'}
              strokeWidth={1.25}
            />
          ))}
        </svg>
        <figcaption className={geo.caption}>{caption}</figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {equal ? (
          <p>
            Com <strong>{k}</strong> {k === 1 ? 'monte' : 'montes'}, todos ficam iguais: cada um tem{' '}
            <Formula math={groupTex(each.b, each.u, letter)} />. Então{' '}
            <span className={styles.nowrap}>
              <Formula math={`${total} = ${k}(${groupTex(each.b, each.u, letter)})`} />.
            </span>
          </p>
        ) : (
          <p>
            Com <strong>{k}</strong> montes, eles <strong>não</strong> ficam iguais:{' '}
            {bars % k === 0
              ? `as ${bars} tiras se dividem (${bars / k} em cada), mas os ${units} quadradinhos não.`
              : units % k === 0
                ? `os ${units} quadradinhos se dividem (${units / k} em cada), mas as ${bars} tiras não.`
                : `nem as ${bars} tiras nem os ${units} quadradinhos se dividem igualmente.`}{' '}
            Então {k} não é fator comum.
          </p>
        )}
        <p>
          Números de montes que deram certo até agora:{' '}
          <strong>{worked.length ? worked.join(', ') : 'nenhum'}</strong>.
        </p>
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Número de montes: {k}</span>
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={k}
            onChange={(event) => choose(Number(event.target.value))}
            aria-label="Número de montes"
          />
        </label>
      </div>
    </div>
  );
}
