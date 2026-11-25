import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import {num, factor, pairTex} from '../MatrixKit';

// A leitura por colunas de uma matriz 2 × 2, desenhada no plano (lição 11.3).
//
// As duas colunas da matriz são duas setas. O vetor x = (a, b) diz quantas
// vezes usar cada uma: a setas azuis (a primeira coluna), depois b setas
// laranja (a segunda coluna), ponta com cauda. A seta verde vai da origem
// até onde a caminhada parou: é Ax. O painel faz a mesma conta pelas duas
// leituras, para o aluno ver que dão o mesmo ponto. Com a matriz do robô,
// [[2, 1], [1, 3]], as colunas são os motores (2, 1) e (1, 3) da lição de
// soma de vetores.
//
// Ao entrar na tela, a figura monta o vetor inicial seta por seta. Os botões
// escolhem vetores prontos, como (1, 0) e (0, 1), que devolvem uma coluna.

export default function MatrixColumnsPlane({
  matrix = [
    [2, 1],
    [1, 3],
  ],
  name = 'B',
  initial = [3, 1],
  range = [-1, 3],
  presets = [
    [3, 1],
    [1, 0],
    [0, 1],
    [2, 2],
  ],
  intro = true,
  caption,
}) {
  const c1 = [matrix[0][0], matrix[1][0]];
  const c2 = [matrix[0][1], matrix[1][1]];
  const [a, setA] = useState(initial[0]);
  const [b, setB] = useState(initial[1]);

  const steps = [];
  for (let i = 1; i <= Math.abs(initial[0]); i += 1) steps.push(['a', Math.sign(initial[0]) * i]);
  for (let j = 1; j <= Math.abs(initial[1]); j += 1) steps.push(['b', Math.sign(initial[1]) * j]);
  const duration = 0.6 + 0.6 * steps.length;

  const {ref, play, playing} = useAnimation({
    duration,
    autoplay: intro,
    onFrame: (time) => {
      let na = 0;
      let nb = 0;
      steps.forEach(([which, value], i) => {
        if (time >= 0.4 + 0.6 * i) {
          if (which === 'a') na = value;
          else nb = value;
        }
      });
      if (time >= duration) {
        na = initial[0];
        nb = initial[1];
      }
      setA(na);
      setB(nb);
    },
  });

  // janela: cabe toda caminhada possível dentro do alcance dos controles
  const xs = [0];
  const ys = [0];
  for (let i = range[0]; i <= range[1]; i += 1) {
    for (let j = range[0]; j <= range[1]; j += 1) {
      xs.push(i * c1[0], i * c1[0] + j * c2[0]);
      ys.push(i * c1[1], i * c1[1] + j * c2[1]);
    }
  }
  const xMin = Math.min(...xs) - 0.5;
  const xMax = Math.max(...xs) + 0.5;
  const yMin = Math.min(...ys) - 0.5;
  const yMax = Math.max(...ys) + 0.5;

  const end = [a * c1[0] + b * c2[0], a * c1[1] + b * c2[1]];

  const segments = [];
  const sa = Math.sign(a);
  for (let i = 0; i < Math.abs(a); i += 1) {
    const from = [sa * i * c1[0], sa * i * c1[1]];
    segments.push({from, to: [from[0] + sa * c1[0], from[1] + sa * c1[1]], tone: 1, arrow: true});
  }
  const mid = [a * c1[0], a * c1[1]];
  const sb = Math.sign(b);
  for (let j = 0; j < Math.abs(b); j += 1) {
    const from = [mid[0] + sb * j * c2[0], mid[1] + sb * j * c2[1]];
    segments.push({from, to: [from[0] + sb * c2[0], from[1] + sb * c2[1]], tone: 2, arrow: true});
  }
  if (end[0] !== 0 || end[1] !== 0) segments.push({from: [0, 0], to: end, tone: 3, arrow: true});

  const right = end[0] > (xMin + xMax) / 2;
  const points = [
    {
      at: end,
      tone: 3,
      r: 4,
      label: `${name}\\vec{x} = ${pairTex(end)}`,
      dx: right ? -70 : 70,
      dy: -14,
    },
  ];

  const ticksX = [];
  for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v += 1) if (v !== 0 && v % 2 === 0) ticksX.push({at: v});
  const ticksY = [];
  for (let v = Math.ceil(yMin); v <= Math.floor(yMax); v += 1) if (v !== 0 && v % 2 === 0) ticksY.push({at: v});

  const colsMath = `${factor(a)}${pairTex(c1)} + ${factor(b)}${pairTex(c2)} = ${pairTex([a * c1[0], a * c1[1]])} + ${pairTex([b * c2[0], b * c2[1]])} = ${pairTex(end)}`;
  const rowsMath = `(${num(matrix[0][0])} \\times ${factor(a)} + ${num(matrix[0][1])} \\times ${factor(b)},\\ ${num(matrix[1][0])} \\times ${factor(a)} + ${num(matrix[1][1])} \\times ${factor(b)}) = ${pairTex(end)}`;

  let note = null;
  if (a === 1 && b === 0) note = 'Com x = (1, 0), a caminhada usa a primeira coluna uma vez e a segunda nenhuma: o resultado é a primeira coluna.';
  else if (a === 0 && b === 1) note = 'Com x = (0, 1), a caminhada usa só a segunda coluna, uma vez: o resultado é a segunda coluna.';
  else if (a === 0 && b === 0) note = 'Com x = (0, 0), nenhuma coluna é usada, e o resultado fica na origem.';

  return (
    <div className={shared.wrapper} data-explorer="matrix-columns-plane">
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={26}
          showGrid
          xTicks={ticksX}
          yTicks={ticksY}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          caption={
            caption ??
            `Cada seta azul é uma cópia da primeira coluna, ${pairTex(c1).replace(/\\ /g, ' ')}, e cada seta laranja é uma cópia da segunda, ${pairTex(c2).replace(/\\ /g, ' ')}. O vetor x = (a, b) diz quantas cópias de cada uma. A seta verde vai da origem até o fim da caminhada.`
          }
        />
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Peso da primeira coluna: <strong>a = {String(a).replace('-', '−')}</strong>
          </span>
          <input
            type="range"
            min={range[0]}
            max={range[1]}
            step={1}
            value={a}
            disabled={playing}
            onChange={(e) => setA(Number(e.target.value))}
            aria-label="Peso da primeira coluna, a"
          />
        </label>
        <label className={shared.control}>
          <span>
            Peso da segunda coluna: <strong>b = {String(b).replace('-', '−')}</strong>
          </span>
          <input
            type="range"
            min={range[0]}
            max={range[1]}
            step={1}
            value={b}
            disabled={playing}
            onChange={(e) => setB(Number(e.target.value))}
            aria-label="Peso da segunda coluna, b"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          Por colunas: <Formula math={colsMath} />
        </p>
        <p className={shared.formula}>
          Por linhas: <Formula math={rowsMath} />
        </p>
        {note && <p>{note}</p>}
      </div>
      <div className={shared.buttons}>
        {presets.map(([pa, pb]) => (
          <button
            key={`${pa},${pb}`}
            type="button"
            disabled={playing}
            aria-pressed={a === pa && b === pb}
            onClick={() => {
              setA(pa);
              setB(pb);
            }}
          >
            x = ({String(pa).replace('-', '−')}, {String(pb).replace('-', '−')})
          </button>
        ))}
        {intro && (
          <button type="button" onClick={() => play()} disabled={playing}>
            Ver a caminhada inicial de novo
          </button>
        )}
      </div>
    </div>
  );
}
