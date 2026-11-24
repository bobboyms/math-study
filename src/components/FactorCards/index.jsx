import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Cada parcela escrita como uma fila de cartões, um cartão por fator:
// 8x³ = 2 × 2 × 2 × x × x × x. Uma linha é uma parcela (o que se soma); um
// cartão é um fator (o que se multiplica). A figura torna visível a diferença
// que a lição de fator comum mais precisa que o aluno faça.
//
// Na animação, os cartões que aparecem em TODAS as linhas se acendem, deslizam
// para a esquerda e formam a coluna do fator comum. O que fica à direita é o
// que sobra de cada parcela — o que vai para dentro do parêntese. Se numa linha
// não sobra nenhum cartão, aparece um cartão "1": a parcela dividida por ela
// mesma vale 1, não 0.
//
// Os cartões comuns são descobertos sozinhos (interseção das listas de
// fatores); a lição só informa os fatores de cada parcela e os textos finais.
//
// `still` mostra só as filas de cartões, sem animação nem coluna de fator
// comum — para a seção que apresenta parcela e fator.

const W = 440;
const CARD = 26;
const MOVING_PITCH = 34;
const STILL_PITCH = 42; // na fila parada, cabe o sinal de vezes entre os cartões
const LABEL_X = 84; // borda direita do rótulo "8x^3 ="
const START = 96; // primeiro cartão
const SPLIT_GAP = 30; // vão entre a coluna do fator comum e a sobra
const ROW_H = 58;
const TOP = 46;
const DURATION = 4.6;

// Marca, em cada parcela, quais cartões entram no fator comum: para cada
// fator, as primeiras ocorrências até o mínimo de vezes em que ele aparece
// nas parcelas.
function markCommon(terms) {
  const counts = terms.map((term) =>
    term.factors.reduce((acc, f) => ({...acc, [f]: (acc[f] ?? 0) + 1}), {}),
  );
  const keys = Object.keys(counts[0]);
  const min = Object.fromEntries(
    keys.map((key) => [key, Math.min(...counts.map((c) => c[key] ?? 0))]),
  );
  return terms.map((term) => {
    const used = {};
    return term.factors.map((f) => {
      used[f] = (used[f] ?? 0) + 1;
      return used[f] <= (min[f] ?? 0);
    });
  });
}

function Card({x, y, label, tone, fill, opacity = 1}) {
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y - CARD / 2}
        width={CARD}
        height={CARD}
        rx={5}
        fill={tone ?? 'var(--mv-paper)'}
        fillOpacity={tone ? fill : 1}
        stroke={tone ?? 'var(--ifm-color-emphasis-600)'}
        strokeWidth={1.5}
      />
      <SvgMath x={x + CARD / 2} y={y} math={label} fontSize={14} />
    </g>
  );
}

export default function FactorCards({
  terms,
  common,
  rests = [],
  result,
  still = false,
  caption,
}) {
  const {ref, t, play} = useAnimation({duration: DURATION, autoplay: !still});
  const PITCH = still ? STILL_PITCH : MOVING_PITCH;
  const marks = markCommon(terms);
  const nCommon = marks[0].filter(Boolean).length;

  const glow = still ? 0 : stage(t, 0.6, 1.4);
  const move = still ? 0 : stage(t, 1.7, 3.1);
  const show = still ? 0 : stage(t, 3.2, 4.2);

  const restX = START + nCommon * PITCH + SPLIT_GAP;
  const maxCards = Math.max(...terms.map((term) => term.factors.length));
  const rowsH = terms.length * ROW_H;
  const H = TOP + rowsH + (result && !still ? 44 : 6);

  const rowY = (i) => TOP + i * ROW_H + ROW_H / 2 - 6;

  return (
    <div className={shared.wrapper} data-explorer="factor-cards">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W}px`}}
          role="img"
          aria-label={
            still
              ? 'Cada parcela escrita como uma fila de cartões de fatores.'
              : `Os fatores presentes em todas as parcelas formam o fator comum ${common}.`
          }
        >
          {/* títulos das colunas */}
          {still ? (
            <SvgMath x={START} y={TOP - 26} math="\text{fatores (multiplicados)}" anchor="start" fontSize={12} />
          ) : (
            <g opacity={show}>
              <SvgMath x={START + (nCommon * PITCH - 8) / 2} y={TOP - 26} math={`\\text{comum: } ${common}`} tone={1} fontSize={13} />
              <SvgMath x={restX} y={TOP - 26} math="\text{sobra}" anchor="start" fontSize={13} />
              <rect
                x={START - 6}
                y={TOP - 8}
                width={nCommon * PITCH + 4}
                height={rowsH - 6}
                rx={6}
                fill="none"
                stroke="var(--mv-tone-1)"
                strokeWidth={1.5}
                strokeDasharray="5 4"
              />
            </g>
          )}

          {terms.map((term, i) => {
            const y = rowY(i);
            let c = 0;
            let r = 0;
            const cards = term.factors.map((f, j) => {
              const isCommon = marks[i][j];
              const from = START + j * PITCH;
              const to = isCommon ? START + c++ * PITCH : restX + r++ * PITCH;
              const x = from + (to - from) * move;
              return (
                <Card
                  key={j}
                  x={x}
                  y={y}
                  label={f}
                  tone={isCommon && glow > 0 ? 'var(--mv-tone-1)' : undefined}
                  fill={0.25 * glow}
                />
              );
            });
            const restEmpty = r === 0;
            const sign = i === 0 ? '' : term.sign === '-' ? '-' : '+';
            return (
              <g key={i}>
                {i > 0 && (
                  <SvgMath x={LABEL_X - 62} y={y - ROW_H / 2 + 2} math={sign} fontSize={18} />
                )}
                <SvgMath x={LABEL_X} y={y} math={`${term.tex} =`} anchor="end" space={LABEL_X - 4} fontSize={15} />
                {/* sinais de vezes entre os cartões, só na fila parada */}
                {still &&
                  term.factors.slice(1).map((_, j) => (
                    <SvgMath key={`t${j}`} x={START + (j + 1) * PITCH - (PITCH - CARD) / 2} y={y} math="\times" fontSize={10} />
                  ))}
                {cards}
                {!still && restEmpty && (
                  <Card x={restX} y={y} label="1" tone="var(--mv-tone-2)" fill={0.25} opacity={show} />
                )}
                {!still && rests[i] && (
                  <g opacity={show}>
                  <SvgMath
                    x={restX + Math.max(1, maxCards - nCommon) * PITCH + 6}
                    y={y}
                    math={`\\to ${rests[i]}`}
                    anchor="start"
                    space={W - (restX + Math.max(1, maxCards - nCommon) * PITCH + 8)}
                    fontSize={15}
                    tone={restEmpty ? 2 : undefined}
                  />
                  </g>
                )}
              </g>
            );
          })}

          {result && !still && (
            <g opacity={show}>
              <SvgMath x={W / 2} y={TOP + rowsH + 18} math={result} fontSize={16} />
            </g>
          )}
        </svg>
        {caption && <figcaption className={geo.caption}>{caption}</figcaption>}
      </figure>
      {!still && (
        <div className={shared.buttons}>
          <button type="button" onClick={() => play()}>
            Ver de novo
          </button>
        </div>
      )}
    </div>
  );
}
