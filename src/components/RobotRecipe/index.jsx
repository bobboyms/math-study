import React, {useEffect, useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import {pairMath, signedMath} from '../VectorSumKit';

// Combinação linear como receita (lição 7.29): o robô do depósito.
//
// Um motor empurra o robô na direção u, o outro na direção v, uma seta por
// volta. O aluno escolhe quantas voltas de cada motor (a e b, inteiros, e
// negativo é girar ao contrário). A figura desenha a voltas de u, uma seta
// por volta, e depois b voltas de v a partir dali; a seta verde vai da origem
// até onde o robô parou, que é a·u + b·v. As linhas tracejadas cinza são a
// malha das receitas inteiras: cada cruzamento é um ponto alcançável com um
// número inteiro de voltas. O painel guarda as receitas que acertaram o alvo.
//
// Com `intro`, a figura monta sozinha a receita inicial ao entrar na tela
// (as voltas de u uma a uma, depois as de v).

const A_MIN = -1;
const A_MAX = 3;
const B_MIN = -1;
const B_MAX = 3;

export default function RobotRecipe({
  u = [2, 1],
  v = [1, 3],
  target = [7, 6],
  targetName = '\\text{prateleira}',
  initialA = 3,
  initialB = 1,
  intro = true,
  caption,
}) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [found, setFound] = useState([]);

  const steps = [];
  for (let i = 1; i <= Math.abs(initialA); i += 1) steps.push(['a', Math.sign(initialA) * i]);
  for (let j = 1; j <= Math.abs(initialB); j += 1) steps.push(['b', Math.sign(initialB) * j]);
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
        na = initialA;
        nb = initialB;
      }
      setA(na);
      setB(nb);
    },
  });

  const end = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
  const hit = end[0] === target[0] && end[1] === target[1];

  useEffect(() => {
    if (playing || !hit) return;
    setFound((old) => (old.some(([x, y]) => x === a && y === b) ? old : [...old, [a, b]]));
  }, [a, b, hit, playing]);

  // malha das receitas inteiras
  const lines = [];
  for (let j = -3; j <= 5; j += 1) {
    const p = [j * v[0], j * v[1]];
    lines.push({through: [p, [p[0] + u[0], p[1] + u[1]]], dashed: true, muted: true});
  }
  for (let i = -4; i <= 6; i += 1) {
    const p = [i * u[0], i * u[1]];
    lines.push({through: [p, [p[0] + v[0], p[1] + v[1]]], dashed: true, muted: true});
  }

  const segments = [];
  const sa = Math.sign(a);
  for (let i = 0; i < Math.abs(a); i += 1) {
    const from = [sa * i * u[0], sa * i * u[1]];
    segments.push({from, to: [from[0] + sa * u[0], from[1] + sa * u[1]], tone: 1, arrow: true});
  }
  const mid = [a * u[0], a * u[1]];
  const sb = Math.sign(b);
  for (let j = 0; j < Math.abs(b); j += 1) {
    const from = [mid[0] + sb * j * v[0], mid[1] + sb * j * v[1]];
    segments.push({from, to: [from[0] + sb * v[0], from[1] + sb * v[1]], tone: 2, arrow: true});
  }
  if (end[0] !== 0 || end[1] !== 0) segments.push({from: [0, 0], to: end, tone: 3, arrow: true});

  const points = [
    {
      at: target,
      tone: hit ? 3 : 0,
      r: 6,
      open: !hit,
      label: `${targetName}\\ ${pairMath(...target)}`,
      dx: target[0] > 4 ? -10 : 64,
      dy: -18,
    },
  ];
  if (!hit) points.push({at: end, tone: 3, r: 4});

  const labels = [
    {at: u, math: '\\vec{u}', tone: 1, dx: 4, dy: 16, fontSize: 13},
  ];

  const formula =
    `${signedMath(a)}${pairMath(...u)} + ${signedMath(b)}${pairMath(...v)} = ` +
    `${pairMath(a * u[0], a * u[1])} + ${pairMath(b * v[0], b * v[1])} = ${pairMath(...end)}`;

  return (
    <div className={shared.wrapper} data-explorer="robot-recipe">
      <div ref={ref}>
        <CartesianPlane
          xMin={-3.5}
          xMax={9.5}
          yMin={-4.5}
          yMax={12.5}
          xUnit={26}
          showGrid={false}
          xTicks={[-2, 2, 4, 6, 8].map((at) => ({at}))}
          yTicks={[-4, -2, 2, 4, 6, 8, 10, 12].map((at) => ({at}))}
          axisLabels={['x', 'y']}
          lines={lines}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'Cada seta azul é uma volta do motor u = (2, 1), e cada seta laranja é uma volta do motor v = (1, 3). A seta verde vai da origem até onde o robô parou. Os cruzamentos da malha tracejada são os pontos que se alcançam com um número inteiro de voltas.'
          }
        />
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Voltas do motor u: <strong>a = {String(a).replace('-', '−')}</strong>
          </span>
          <input
            type="range"
            min={A_MIN}
            max={A_MAX}
            step={1}
            value={a}
            disabled={playing}
            onChange={(e) => setA(Number(e.target.value))}
            aria-label="Voltas do motor u, o coeficiente a"
          />
        </label>
        <label className={shared.control}>
          <span>
            Voltas do motor v: <strong>b = {String(b).replace('-', '−')}</strong>
          </span>
          <input
            type="range"
            min={B_MIN}
            max={B_MAX}
            step={1}
            value={b}
            disabled={playing}
            onChange={(e) => setB(Number(e.target.value))}
            aria-label="Voltas do motor v, o coeficiente b"
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={formula} />
        </p>
        <p>
          {hit ? (
            'O robô chegou ao alvo.'
          ) : (
            <>
              Ainda não é o alvo: falta andar <Formula math={pairMath(target[0] - end[0], target[1] - end[1])} /> para chegar
              lá.
            </>
          )}
        </p>
        {found.length > 0 && (
          <p>
            Receitas que acertaram:{' '}
            {found.map(([x, y], i) => (
              <span key={`${x},${y}`}>
                {i > 0 && '; '}
                <Formula math={`a = ${x},\\ b = ${y}`} />
              </span>
            ))}
            .
          </p>
        )}
      </div>
      {intro && (
        <div className={shared.buttons}>
          <button type="button" onClick={() => play()} disabled={playing}>
            Ver a receita inicial de novo
          </button>
        </div>
      )}
    </div>
  );
}
