import React from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {BASES, PIGMENTS, GramAxis, StackBar, TotalLabel, toneVar} from '../PaintMix/bars';

// A base que sobra (lição 11.5): trocar R por P + 2Q não muda a lata.
//
// À esquerda, a lata p + q + r, parada: três barras (ciano, magenta,
// amarelo) com a parte de cada base. À direita, a mesma lata, e a animação
// faz a troca em dois passos:
//   1. o pedaço verde de cada barra (1 litro de R) se divide no que 1 litro
//      de P e 2 litros de Q dão daquele pigmento, e muda de cor;
//   2. os pedaços da mesma cor se juntam: o pedaço novo de P desce para perto
//      do antigo, e o litro antigo de Q sobe.
// As alturas totais não mudam em nenhum quadro. No fim, a lata da direita é
// 2p + 3q, com as mesmas três alturas da esquerda.

const W = 560;
const H = 350;
const BASE_Y = 270;
const TOP_Y = 64;
const AXIS_X = 46;
const BAR_W = 42;
const LEFT = [110, 180, 250];
const RIGHT = [360, 430, 500];
const MAX_G = 6;
const DURATION = 4.4;

export default function PaintSwap({caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const split = stage(t, 0.5, 1.7);
  const regroup = stage(t, 2.1, 3.9);
  const scale = (BASE_Y - TOP_Y) / MAX_G;
  const p = BASES.P.v;
  const q = BASES.Q.v;
  const r = BASES.R.v;

  const step =
    t < 0.5 ? 0 : t < 2.0 ? 1 : t < DURATION ? 2 : 3;

  return (
    <div className={shared.wrapper} data-explorer="paint-swap">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{display: 'block', width: '100%', maxWidth: `${W}px`, height: 'auto', margin: '0 auto'}}
          role="img"
          aria-label="Duas latas com as mesmas alturas de pigmento: p + q + r à esquerda e 2p + 3q à direita."
        >
          <GramAxis x={AXIS_X} base={BASE_Y} top={TOP_Y} maxG={MAX_G} scale={scale} every={1} />
          <line x1={AXIS_X} y1={BASE_Y} x2={W - 16} y2={BASE_Y} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />

          {PIGMENTS.map((pg, k) => {
            const left = [
              {grams: p[k], tone: 1},
              {grams: q[k], tone: 2},
              {grams: r[k], tone: 3},
            ];
            const total = p[k] + q[k] + r[k];
            // Direita: P1, Q1 e o litro de R, que se divide em P' e Q'.
            const yQ1 = p[k] + regroup * p[k];
            const yP2 = p[k] + q[k] - regroup * q[k];
            const yQ2 = 2 * p[k] + q[k];
            const shift = Math.sin(Math.PI * regroup) * (BAR_W * 0.62);
            const cx = RIGHT[k];
            return (
              <g key={pg}>
                <StackBar cx={LEFT[k]} width={BAR_W} base={BASE_Y} scale={scale} pieces={left} />
                <TotalLabel cx={LEFT[k]} y={BASE_Y - total * scale - 14} grams={total} />
                <text x={LEFT[k]} y={BASE_Y + 18} textAnchor="middle" fontSize={12} fill="var(--ifm-font-color-base)">
                  {pg}
                </text>

                <StackBar cx={cx} width={BAR_W} base={BASE_Y} scale={scale} pieces={[{grams: p[k], tone: 1, y0: 0}]} />
                <StackBar cx={cx} width={BAR_W} base={BASE_Y} scale={scale} pieces={[{grams: q[k], tone: 2, y0: yQ1}]} />
                <StackBar cx={cx} width={BAR_W} base={BASE_Y} scale={scale} pieces={[{grams: 2 * q[k], tone: 2, y0: yQ2}]} opacity={split} />
                <StackBar cx={cx + shift} width={BAR_W} base={BASE_Y} scale={scale} pieces={[{grams: p[k], tone: 1, y0: yP2}]} opacity={split} />
                <StackBar
                  cx={cx}
                  width={BAR_W}
                  base={BASE_Y}
                  scale={scale}
                  pieces={[{grams: r[k], tone: 3, y0: p[k] + q[k]}]}
                  opacity={1 - split}
                />
                <TotalLabel cx={cx} y={BASE_Y - total * scale - 14} grams={total} />
                <text x={cx} y={BASE_Y + 18} textAnchor="middle" fontSize={12} fill="var(--ifm-font-color-base)">
                  {pg}
                </text>
              </g>
            );
          })}

          <SvgMath x={180} y={BASE_Y + 44} math="\vec{p} + \vec{q} + \vec{r}" fontSize={15} />
          <SvgMath
            x={430}
            y={BASE_Y + 44}
            math={regroup >= 1 ? '2\\vec{p} + 3\\vec{q}' : '\\vec{p} + \\vec{q} + (\\vec{p} + 2\\vec{q})'}
            fontSize={15}
          />
          <text x={180} y={BASE_Y + 70} textAnchor="middle" fontSize={12} fill="var(--ifm-color-emphasis-800)">
            com a base R
          </text>
          <text x={430} y={BASE_Y + 70} textAnchor="middle" fontSize={12} fill="var(--ifm-color-emphasis-800)">
            {regroup >= 1 ? 'sem a base R' : 'trocando R por P + 2Q'}
          </text>
          <line x1={305} y1={TOP_Y} x2={305} y2={BASE_Y + 60} stroke="var(--ifm-color-emphasis-300)" strokeWidth={1.2} />

          {[1, 2].map((tone, i) => (
            <g key={tone} transform={`translate(${150 + i * 150}, 16)`}>
              <rect x={0} y={-9} width={14} height={12} fill={toneVar(tone)} fillOpacity={0.85} />
              <text x={20} y={1} fontSize={12} fill="var(--ifm-font-color-base)">
                {i === 0 ? 'vem de P' : 'vem de Q'}
              </text>
            </g>
          ))}
          <g transform={`translate(450, 16)`}>
            <rect x={0} y={-9} width={14} height={12} fill={toneVar(3)} fillOpacity={0.85} />
            <text x={20} y={1} fontSize={12} fill="var(--ifm-font-color-base)">
              vem de R
            </text>
          </g>
        </svg>
        <figcaption className={shared.caption} style={{textAlign: 'center'}}>
          {caption ??
            'Cada litro de R tem o mesmo pigmento que 1 litro de P mais 2 litros de Q. A troca muda as cores dos pedaços, mas nenhuma altura: as duas latas têm 4 g de ciano, 5 g de magenta e 6 g de amarelo.'}
        </figcaption>
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          {step <= 1 && 'Passo 1: o pedaço verde de cada barra (1 litro de R) vira o pigmento de 1 litro de P e 2 litros de Q.'}
          {step === 2 && 'Passo 2: os pedaços da mesma cor se juntam. Nenhuma altura muda.'}
          {step === 3 && 'A lata da direita não usa R, e as três alturas são as mesmas da lata da esquerda.'}
        </p>
        <p className={shared.formula}>
          <Formula math="\vec{p} + \vec{q} + \vec{r} = \vec{p} + \vec{q} + (\vec{p} + 2\vec{q}) = 2\vec{p} + 3\vec{q} = (4,\ 5,\ 6)" />
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a troca de novo
        </button>
      </div>
    </div>
  );
}
