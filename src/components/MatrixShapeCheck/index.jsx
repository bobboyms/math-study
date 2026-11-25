import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {Cell, Brackets, mix} from '../MatrixKit';

// Dimensões compatíveis (lição 11.3).
//
// O aluno escolhe quantas linhas e colunas tem a matriz e quantas
// coordenadas tem o vetor. A figura pega a primeira linha da matriz (azul),
// põe essa linha em pé e a encosta no vetor (laranja), entrada com
// coordenada. Se sobra entrada da linha ou coordenada do vetor sem par
// (borda tracejada), o produto não existe. Se todas fazem par, o resultado
// aparece (verde), com uma coordenada por linha da matriz.

const C = 30;
const MX = 30;
const MY = 40;
const MAX = 4;
const VX = MX + MAX * C + 92;
const RCX = VX - C - 24;
const RX = VX + C + 48;
const W = RX + C + 56;
const H = MY + MAX * C + 44;

export default function MatrixShapeCheck({
  initial = [2, 3, 2],
  presets = [
    [2, 3, 2],
    [2, 3, 3],
    [3, 4, 4],
  ],
  caption,
}) {
  const [shape, setShape] = useState(initial);
  const [m, n, k] = shape;
  const {ref, t, play, playing} = useAnimation({duration: 1.8});
  const ok = n === k;

  const moveK = stage(t, 0.2, 1.1);
  const pairK = stage(t, 1.0, 1.4);
  const endK = stage(t, 1.3, 1.8);

  const update = (next) => {
    setShape(next);
    play();
  };

  const control = (label, idx, aria) => (
    <label className={shared.control}>
      <span>
        {label}: <strong>{shape[idx]}</strong>
      </span>
      <input
        type="range"
        min={1}
        max={MAX}
        step={1}
        value={shape[idx]}
        disabled={playing}
        onChange={(e) => {
          const next = [...shape];
          next[idx] = Number(e.target.value);
          update(next);
        }}
        aria-label={aria}
      />
    </label>
  );

  const labelY = MY + Math.max(m, n, k) * C + 22;

  return (
    <div className={shared.wrapper} data-explorer="matrix-shape-check">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W + 40}px`}}
          role="img"
          aria-label={`Matriz ${m} por ${n} e vetor de ${k} coordenadas. ${ok ? 'O produto existe.' : 'O produto não existe: sobra elemento sem par.'}`}
        >
          <SvgMath x={MX + (n * C) / 2} y={16} math="\text{matriz}" fontSize={12} />
          <SvgMath x={VX + C / 2} y={16} math="\text{vetor}" fontSize={12} tone={2} />

          {/* matriz: a primeira linha em azul */}
          {Array.from({length: m}, (_, i) =>
            Array.from({length: n}, (_, j) => (
              <Cell
                key={`${i}-${j}`}
                x={MX + j * C}
                y={MY + i * C}
                w={C}
                h={C}
                fill={i === 0 ? 1 : 0}
                tone={i === 0 ? 1 : 0}
              />
            )),
          )}
          <Brackets x0={MX - 4} y0={MY - 3} x1={MX + n * C + 4} y1={MY + m * C + 3} />
          <SvgMath x={MX + (n * C) / 2} y={labelY} math={`${m} \\times ${n}`} fontSize={14} />

          {/* vetor */}
          {Array.from({length: k}, (_, j) => (
            <Cell
              key={`v${j}`}
              x={VX}
              y={MY + j * C}
              w={C}
              h={C}
              fill={2}
              tone={2}
              dashed={j >= n && pairK > 0}
            />
          ))}
          <Brackets x0={VX - 4} y0={MY - 3} x1={VX + C + 4} y1={MY + k * C + 3} />
          <SvgMath x={VX + C / 2} y={labelY} math={`${k} \\times 1`} fontSize={14} />

          {/* cópia da primeira linha, posta em pé ao lado do vetor */}
          {Array.from({length: n}, (_, j) => {
            const x = mix(MX + j * C, RCX, moveK);
            const y = mix(MY, MY + j * C, moveK);
            const lonely = j >= k;
            return (
              <g key={`c${j}`}>
                <Cell x={x} y={y} w={C} h={C} fill={1} tone={1} dashed={lonely && pairK > 0} strong={false} />
              </g>
            );
          })}
          <g opacity={pairK}>
            {Array.from({length: Math.max(n, k)}, (_, j) => {
              const cy = MY + j * C + C / 2;
              if (j < Math.min(n, k)) {
                return <SvgMath key={`p${j}`} x={(RCX + C + VX) / 2} y={cy} math="\times" fontSize={13} />;
              }
              const leftSide = j >= k; // sobra entrada da linha
              return (
                <SvgMath
                  key={`p${j}`}
                  x={leftSide ? RCX + C + 4 : VX - 4}
                  y={cy}
                  math="\text{sem par}"
                  fontSize={11}
                  anchor={leftSide ? 'start' : 'end'}
                  space={60}
                  tone={2}
                />
              );
            })}
            <SvgMath x={RCX + C / 2} y={16} math="\text{linha 1}" fontSize={12} tone={1} />
          </g>

          {/* resultado */}
          <g opacity={ok ? endK : 0}>
            <SvgMath x={(VX + C + RX) / 2 + 2} y={MY + (m * C) / 2} math="=" fontSize={16} />
            {Array.from({length: m}, (_, i) => (
              <Cell key={`r${i}`} x={RX} y={MY + i * C} w={C} h={C} fill={3} tone={3} />
            ))}
            <Brackets x0={RX - 4} y0={MY - 3} x1={RX + C + 4} y1={MY + m * C + 3} />
            <SvgMath x={RX + C / 2} y={labelY} math={`${m} \\times 1`} fontSize={14} tone={3} />
            <SvgMath x={RX + C / 2} y={16} math="\text{resultado}" fontSize={12} tone={3} />
          </g>
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        {control('Linhas da matriz', 0, 'Número de linhas da matriz')}
        {control('Colunas da matriz', 1, 'Número de colunas da matriz')}
        {control('Coordenadas do vetor', 2, 'Número de coordenadas do vetor')}
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          {ok
            ? `Cada linha tem ${n} ${n === 1 ? 'entrada' : 'entradas'}, e o vetor tem ${k} ${k === 1 ? 'coordenada' : 'coordenadas'}: todas fazem par. O produto existe e tem ${m} ${m === 1 ? 'coordenada' : 'coordenadas'}, uma por linha da matriz.`
            : n > k
              ? `Cada linha tem ${n} entradas, mas o vetor tem só ${k} ${k === 1 ? 'coordenada' : 'coordenadas'}: ${n - k} ${n - k === 1 ? 'entrada de cada linha fica' : 'entradas de cada linha ficam'} sem par. O produto não existe.`
              : `O vetor tem ${k} coordenadas, mas cada linha tem só ${n} ${n === 1 ? 'entrada' : 'entradas'}: ${k - n} ${k - n === 1 ? 'coordenada do vetor fica' : 'coordenadas do vetor ficam'} sem par. O produto não existe.`}
        </p>
      </div>
      <div className={shared.buttons}>
        {presets.map((p) => (
          <button
            key={p.join('-')}
            type="button"
            disabled={playing}
            aria-pressed={p[0] === m && p[1] === n && p[2] === k}
            onClick={() => update(p)}
          >
            {p[0]} × {p[1]} com vetor de {p[2]}
          </button>
        ))}
      </div>
    </div>
  );
}
