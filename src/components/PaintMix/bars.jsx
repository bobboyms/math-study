import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import {mathNumber} from '../mathviz/Formula';

// Peças comuns às figuras da loja de tintas (lição 11.5): os dados das bases
// e o desenho de uma barra empilhada por pigmento.
//
// Cada base é um vetor de gramas por litro: (ciano, magenta, amarelo). Uma
// mistura soma os pigmentos, então a barra de cada pigmento é uma pilha de
// pedaços, um por base, cada um com a altura “litros × gramas por litro”.

export const BASES = {
  P: {v: [2, 1, 0], tone: 1, tex: '\\vec{p}'},
  Q: {v: [0, 1, 2], tone: 2, tex: '\\vec{q}'},
  R: {v: [2, 3, 4], tone: 3, tex: '\\vec{r}'},
  S: {v: [1, 0, 1], tone: 3, tex: '\\vec{s}'},
};

export const PIGMENTS = ['ciano', 'magenta', 'amarelo'];

export const toneVar = (tone) => (tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)');

// Número em texto comum: vírgula decimal e sinal de menos tipográfico.
export const plain = (x, digits = 2) => mathNumber(x, digits).replace('{,}', ',').replace('-', '−');

// Terna na notação da casa: vírgula entre coordenadas inteiras, ponto e
// vírgula quando alguma tem vírgula decimal.
export function tripleMath(p, digits = 2) {
  const parts = p.map((x) => mathNumber(x, digits));
  const sep = parts.some((s) => s.includes('{,}')) ? ';\\ ' : ',\\ ';
  return `(${parts.join(sep)})`;
}

// Soma dos pigmentos de uma receita: litros[i] da base names[i].
export function mix(names, liters) {
  const out = [0, 0, 0];
  names.forEach((n, i) => {
    BASES[n].v.forEach((g, k) => {
      out[k] += liters[i] * g;
    });
  });
  return out;
}

// Eixo de gramas à esquerda, com traços a cada `every` gramas.
export function GramAxis({x, base, top, maxG, scale, every = 2}) {
  const ticks = [];
  for (let g = 0; g <= maxG + 1e-9; g += every) ticks.push(g);
  return (
    <g>
      <line x1={x} y1={base} x2={x} y2={top - 8} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
      {ticks.map((g) => (
        <g key={g}>
          <line x1={x - 4} y1={base - g * scale} x2={x} y2={base - g * scale} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.2} />
          <text
            x={x - 7}
            y={base - g * scale + 4}
            textAnchor="end"
            fontSize={11}
            fill="var(--ifm-font-color-base)"
            style={{fontFamily: 'KaTeX_Main, Georgia, serif'}}
          >
            {g}
          </text>
        </g>
      ))}
      <text
        x={x - 6}
        y={top - 16}
        textAnchor="middle"
        fontSize={11}
        fill="var(--ifm-color-emphasis-800)"
      >
        gramas
      </text>
    </g>
  );
}

// Uma barra empilhada. `pieces` é a lista [{grams, tone, y0?}] de baixo para
// cima; `y0` (em gramas) força a altura de partida do pedaço, para as
// animações que deslizam pedaços.
export function StackBar({cx, width, base, scale, pieces, opacity = 1}) {
  let acc = 0;
  return (
    <g opacity={opacity}>
      {pieces.map((pc, i) => {
        const start = pc.y0 ?? acc;
        acc = start + pc.grams;
        const h = pc.grams * scale;
        if (h < 0.3) return null;
        return (
          <rect
            key={i}
            x={cx - width / 2}
            y={base - (start + pc.grams) * scale}
            width={width}
            height={h}
            fill={toneVar(pc.tone)}
            fillOpacity={pc.fade ?? 0.85}
            stroke="var(--ifm-background-surface-color)"
            strokeWidth={1.5}
          />
        );
      })}
    </g>
  );
}

// Rótulo do total em cima da barra.
export function TotalLabel({cx, y, grams}) {
  return <SvgMath x={cx} y={y} math={`${mathNumber(grams, 2)}\\ \\text{g}`} fontSize={13} halo />;
}
