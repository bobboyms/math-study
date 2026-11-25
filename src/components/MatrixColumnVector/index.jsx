import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {Cell, Brackets, num, mix} from '../MatrixKit';

// O vetor coluna (lição 11.3): o mesmo vetor, escrito em pé.
//
// O vetor de preços aparece deitado, como sempre foi escrito no curso. Uma
// cópia de cada coordenada sai do lugar e desce, na mesma ordem, até formar
// uma coluna: a primeira coordenada fica em cima, a última embaixo. O nome de
// cada coordenada vai junto. No fim, as duas escritas ficam lado a lado com um
// sinal de igual: nenhum número mudou, nem a ordem.

const CHIP_W = 40;
const CHIP_H = 28;
const STEP_X = 52;
const STEP_Y = 34;

export default function MatrixColumnVector({
  vector = [4, 10, 2, 5],
  names = ['café', 'queijo', 'pão', 'leite'],
  name = '\\vec{p}',
  caption,
}) {
  const n = vector.length;
  const TOP = 34;
  const colH = n * STEP_Y;
  const midY = TOP + colH / 2;
  const LX0 = 34; // centro da primeira coordenada deitada
  const lyingX = (j) => LX0 + j * STEP_X;
  const lyingEnd = lyingX(n - 1) + CHIP_W / 2 + 10;
  const EQ_X = lyingEnd + 26;
  const CX = EQ_X + 44; // centro da coluna
  const colY = (j) => TOP + j * STEP_Y + STEP_Y / 2;
  const W = CX + CHIP_W / 2 + 90;
  const LANE = TOP + colH + CHIP_H / 2 + 8; // faixa por onde as cópias andam
  const H = LANE + CHIP_H / 2 + 6;

  const duration = 0.6 + n * 0.35 + 1.4;
  const {ref, t, play, playing} = useAnimation({duration});
  const moveK = (j) => stage(t, 0.6 + j * 0.35, 1.6 + j * 0.35);
  const endK = stage(t, duration - 0.6, duration);

  return (
    <div className={shared.wrapper} data-explorer="matrix-column-vector">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W + 40}px`}}
          role="img"
          aria-label={`O vetor (${vector.join(', ')}) escrito deitado e escrito em pé, com as mesmas coordenadas na mesma ordem.`}
        >
          {/* deitado */}
          <SvgMath x={(LX0 + lyingX(n - 1)) / 2} y={12} math="\text{deitado}" fontSize={12} />
          <SvgMath x={LX0 - CHIP_W / 2 - 6} y={midY} math="(" fontSize={22} />
          <SvgMath x={lyingEnd - 4} y={midY} math=")" fontSize={22} />
          {vector.map((v, j) => (
            <g key={`l${j}`}>
              <SvgMath x={lyingX(j)} y={midY - 26} math={`\\text{${names[j]}}`} fontSize={11} />
              <Cell x={lyingX(j) - CHIP_W / 2} y={midY - CHIP_H / 2} w={CHIP_W} h={CHIP_H} math={num(v)} tone={1} />
              {j < n - 1 && <SvgMath x={lyingX(j) + STEP_X / 2} y={midY + 8} math="," fontSize={15} />}
            </g>
          ))}

          {/* em pé */}
          <g opacity={endK}>
            <SvgMath x={EQ_X} y={midY} math="=" fontSize={18} />
            <SvgMath x={CX} y={12} math={`\\text{em pé: } ${name}`} fontSize={12} />
            <Brackets x0={CX - CHIP_W / 2 - 6} y0={TOP + 2} x1={CX + CHIP_W / 2 + 6} y1={TOP + colH - 2} />
          </g>
          {vector.map((v, j) => {
            const k = moveK(j);
            // Caminho em três trechos, por uma faixa livre abaixo de tudo: a
            // cópia desce, anda para a direita e sobe até a sua casa. Assim ela
            // não passa por cima das outras coordenadas, deitadas ou em pé.
            let x;
            let y;
            if (k < 0.25) {
              x = lyingX(j);
              y = mix(midY, LANE, k / 0.25);
            } else if (k < 0.75) {
              x = mix(lyingX(j), CX, (k - 0.25) / 0.5);
              y = LANE;
            } else {
              x = CX;
              y = mix(LANE, colY(j), (k - 0.75) / 0.25);
            }
            return (
              <g key={`c${j}`} opacity={stage(t, 0.4 + j * 0.35, 0.7 + j * 0.35)}>
                <Cell x={x - CHIP_W / 2} y={y - CHIP_H / 2} w={CHIP_W} h={CHIP_H} math={num(v)} tone={1} fill={1} solid />
                <g opacity={Math.max(0, (k - 0.8) / 0.2)}>
                  <SvgMath
                    x={x + CHIP_W / 2 + 10}
                    y={y}
                    math={`\\text{${names[j]}}`}
                    fontSize={12}
                    anchor="start"
                    space={W - (x + CHIP_W / 2 + 12)}
                  />
                </g>
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o vetor ficar em pé de novo
        </button>
      </div>
    </div>
  );
}
