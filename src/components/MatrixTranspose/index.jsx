import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {Cell, num} from '../MatrixKit';

// A transposta como reflexo na diagonal, e não como giro (lição 11.3).
//
// À esquerda fica a matriz original. Cada linha tem a sua cor (linha 1
// azul, linha 2 laranja, linha 3 verde), e a cor vai junto com o número.
// "Transpor": uma linha de cada vez acende na original (borda grossa), e os
// números dela aparecem, na mesma ordem, como a coluna de mesmo número da
// tabela da direita: a linha 1 vira a coluna 1, a linha 2 vira a coluna 2. Na tabela pronta, a diagonal
// tracejada passa pelos mesmos números da diagonal da original. "Girar um
// quarto de volta": a cópia inteira gira no sentido horário como uma folha;
// a linha 1 vira a última coluna e a diagonal sai do lugar. Os dois
// resultados têm o mesmo formato e números em casas diferentes.
//
// Na transposição as casas não voam de uma tabela à outra: os caminhos se
// cruzariam e um número passaria por cima de outro no meio da animação.

const C = 40;
const GY = 34;

export default function MatrixTranspose({
  matrix = [
    [3, 2, 5, 4],
    [10, 0, 20, 6],
    [1, 5, 2, 3],
  ],
  name = 'A',
  initialKind = 'transpose',
  caption,
}) {
  const m = matrix.length;
  const n = matrix[0].length;
  const big = Math.max(m, n);
  const LX = 16;
  const RX = LX + n * C + 56;
  const W = RX + big * C + 16;
  const H = GY + big * C + 14;

  const [kind, setKind] = useState(initialKind);
  const ROW = 0.8;
  const rowStart = (i) => 0.3 + i * ROW;
  const duration = Math.max(2.6, rowStart(m) + 0.4);
  const {ref, t, play, playing} = useAnimation({duration});
  const k = stage(t, 0.3, duration - 0.4);
  const doneK = stage(t, duration - 0.4, duration);

  const center = ((m - 1) * C) / 2;
  const theta = (Math.PI / 2) * k;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  // posição absoluta da cópia da casa (i, j) e o quanto ela já andou
  const placed = (i, j) => {
    if (kind === 'transpose') {
      const kp = stage(t, rowStart(i) + j * 0.08, rowStart(i) + j * 0.08 + 0.5);
      return {x: RX + i * C - 14 * (1 - kp), y: GY + j * C, kp};
    }
    const dx = j * C - center;
    const dy = i * C - center;
    return {x: RX + center + dx * cos - dy * sin, y: GY + center + dx * sin + dy * cos, kp: k};
  };

  const toneOf = (i) => (i % 3) + 1;
  const rowOn = (i) => kind === 'transpose' && t >= rowStart(i) && t < rowStart(i) + ROW && t < duration;
  const outM = n;
  const outN = m;
  const diagLen = big * C;
  const rightTitle =
    kind === 'transpose' ? `${name}^{\\mathsf{T}}` : `\\text{${name} girada (não é } ${name}^{\\mathsf{T}})`;

  const run = (next) => {
    setKind(next);
    play();
  };

  return (
    <div className={shared.wrapper} data-explorer="matrix-transpose">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W + 40}px`}}
          role="img"
          aria-label={
            kind === 'transpose'
              ? 'A matriz original e a transposta: cada linha da original virou a coluna de mesmo número.'
              : 'A matriz original e a mesma tabela girada um quarto de volta: a primeira linha virou a última coluna.'
          }
        >
          <SvgMath x={LX + (n * C) / 2} y={14} math={name} fontSize={15} />
          {matrix.map((row, i) =>
            row.map((v, j) => (
              <Cell key={`o${i}-${j}`} x={LX + j * C} y={GY + i * C} w={C} h={C} math={num(v)} fill={toneOf(i)} tone={toneOf(i)} halo strong={rowOn(i)} />
            )),
          )}

          {/* diagonal da original */}
          <line
            x1={LX}
            y1={GY}
            x2={LX + diagLen}
            y2={GY + diagLen}
            stroke="var(--mv-guide)"
            strokeWidth={1.5}
            strokeDasharray="6 5"
          />

          {/* contorno do formato final e diagonal */}
          <g opacity={doneK}>
            <rect
              x={RX}
              y={GY}
              width={outN * C}
              height={outM * C}
              fill="none"
              stroke="var(--mv-guide)"
              strokeDasharray="4 4"
            />
          </g>
          <g opacity={doneK}>
            <SvgMath x={RX + (outN * C) / 2} y={14} math={rightTitle} fontSize={kind === 'transpose' ? 15 : 13} />
          </g>
          {(() => {
            const list = [];
            matrix.forEach((row, i) =>
              row.forEach((v, j) => {
                const {x, y, kp} = placed(i, j);
                if (kind === 'transpose' && kp <= 0) return;
                list.push({i, j, v, x, y, kp, moving: kp > 0 && kp < 1});
              }),
            );
            // as que estão em movimento por cima das paradas
            list.sort((a, b) => Number(a.moving) - Number(b.moving));
            return list.map(({i, j, v, x, y, kp}) => (
              <Cell
                opacity={kind === 'transpose' ? kp : 1}
                key={`c${i}-${j}`}
                x={x}
                y={y}
                w={C}
                h={C}
                math={num(v)}
                fill={toneOf(i)}
                tone={toneOf(i)}
                halo
                solid
              />
            ));
          })()}
          {/* a diagonal fica por cima das casas; os números têm halo */}
          <line
            x1={RX}
            y1={GY}
            x2={RX + diagLen}
            y2={GY + diagLen}
            stroke="var(--mv-guide)"
            strokeWidth={1.5}
            strokeDasharray="6 5"
          />
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          {kind === 'transpose'
            ? 'Transpor: a linha 1 (azul) da original virou a coluna 1 da direita, e cada linha seguinte virou a coluna de mesmo número. Cada número foi para a casa simétrica em relação à diagonal tracejada, e os números que estão sobre a diagonal são os mesmos nas duas tabelas.'
            : 'Girar: a tabela inteira deu um quarto de volta. A linha 1 (azul) virou a última coluna, e a diagonal não tem mais os mesmos números. O formato é o mesmo da transposta, mas os números estão em outras casas.'}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" disabled={playing} aria-pressed={kind === 'transpose'} onClick={() => run('transpose')}>
          Transpor: refletir na diagonal
        </button>
        <button type="button" disabled={playing} aria-pressed={kind === 'rotate'} onClick={() => run('rotate')}>
          Girar um quarto de volta
        </button>
      </div>
    </div>
  );
}
