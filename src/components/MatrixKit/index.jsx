import React from 'react';
import katex from 'katex';
import macros from '@site/src/katexMacros';
import SvgMath from '../mathviz/SvgMath';

// Peças comuns às figuras da lição 11.3 (Matrizes e o produto de matriz por
// vetor): a casa de uma tabela com número em KaTeX, os colchetes de uma
// matriz e a formatação de números na notação da casa.
//
// Não é uma figura: os componentes Matrix* importam daqui.

// Número em LaTeX: vírgula decimal e sinal de menos do KaTeX.
export const num = (n) => {
  const v = Object.is(n, -0) ? 0 : n;
  const s = Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))).replace('.', '{,}');
  return s;
};

// Fator de uma multiplicação: negativo vai entre parênteses, como em 3 × (−1).
export const factor = (n) => (n < 0 ? `(${num(n)})` : num(n));

// Número em texto comum (painéis), com o sinal de menos tipográfico.
export const plain = (n) => num(n).replace('{,}', ',').replace('-', '−');

// Vetor deitado na notação da casa: (3,\ 4).
export const pairTex = (list) => `(${list.map(num).join(',\\ ')})`;

// Soma de parcelas já com os sinais: [12, -5, 3] → "12 - 5 + 3".
export const sumTex = (parts) =>
  parts
    .map((p, i) => {
      if (i === 0) return num(p);
      return p < 0 ? `- ${num(-p)}` : `+ ${num(p)}`;
    })
    .join(' ');

// A conta de um produto escalar por extenso: "3 \times 4 + 2 \times 10".
export const dotTex = (row, x) =>
  row.map((a, j) => `${factor(a)} \\times ${factor(x[j])}`).join(' + ');

export const toneVar = (tone) =>
  tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-600)';

// Uma casa da tabela. `fill` pinta o fundo com o tom (claro); `strong`
// engrossa a borda.
export function Cell({
  x,
  y,
  w,
  h,
  math,
  tone = 0,
  fill = 0,
  strong = false,
  opacity = 1,
  fontSize = 15,
  border = true,
  dashed = false,
  halo = false,
  solid = false,
}) {
  // `solid` põe um fundo opaco por baixo: a casa vira um cartão que pode
  // passar por cima de outras sem misturar os números.
  return (
    <g opacity={opacity}>
      {solid && <rect x={x} y={y} width={w} height={h} rx={4} fill="var(--mv-paper)" />}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={fill ? `var(--mv-tone-${fill})` : 'var(--mv-paper)'}
        fillOpacity={fill ? 0.18 : 1}
        stroke={border ? toneVar(tone) : 'none'}
        strokeOpacity={tone || strong ? 1 : 0.55}
        strokeWidth={strong ? 2.4 : 1.2}
        strokeDasharray={dashed ? '4 3' : undefined}
      />
      {math !== undefined && math !== null && (
        <SvgMath x={x + w / 2} y={y + h / 2} math={math} fontSize={fontSize} halo={halo} />
      )}
    </g>
  );
}

// Colchetes de matriz em volta do retângulo (x0, y0) a (x1, y1).
export function Brackets({x0, y0, x1, y1, tone = 0, opacity = 1, arm = 6}) {
  const stroke = toneVar(tone);
  return (
    <g opacity={opacity} fill="none" stroke={stroke} strokeWidth={1.6} strokeLinecap="round">
      <path d={`M ${x0 + arm} ${y0} L ${x0} ${y0} L ${x0} ${y1} L ${x0 + arm} ${y1}`} />
      <path d={`M ${x1 - arm} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x1 - arm} ${y1}`} />
    </g>
  );
}

// Fórmula longa numa linha só, dentro do SVG. O SvgMath limita a caixa a
// 260 px, e uma conta comprida (como a de uma linha da planilha) quebrava em
// duas linhas por cima da linha de baixo. Aqui a largura é dada e o texto
// nunca quebra. Ancorado pela esquerda.
export function WideMath({x, y, math, width, fontSize = 13, tone}) {
  const h = 30;
  return (
    <foreignObject x={x} y={y - h / 2} width={width} height={h} style={{overflow: 'visible', pointerEvents: 'none'}}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          width: `${width}px`,
          height: `${h}px`,
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          color: tone ? `var(--mv-tone-${tone})` : 'var(--ifm-font-color-base)',
        }}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(String(math), {throwOnError: false, macros: {...macros}}),
        }}
      />
    </foreignObject>
  );
}

// Interpolação linear entre dois números.
export const mix = (a, b, k) => a + (b - a) * k;
