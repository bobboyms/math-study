import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {add, clipLine, dot, kOf, norm, rightAngle, sub, times, num, numText, pair, exact} from '../mathviz/projection';

// Só a direção de u importa (lição 7.32).
//
// v = (1, 4) fica parado. O deslizante escolhe c, e o vetor que marca o chão
// passa a ser c (2, 1): mais comprido, mais curto ou virado para trás, mas
// sempre sobre a mesma reta. A sombra de v (verde) não se mexe: é sempre
// (2,4; 1,2). O que muda é o número k, que conta quantas cópias do novo u
// cabem nela. Com c = 0, o vetor do chão é nulo e não há reta nenhuma.

const V = [1, 4];
const U0 = [2, 1];
const BOX = [-6.6, 6.6, -3.6, 4.8];
const GAP = [0.18, -0.36]; // meio passo abaixo da reta, na perpendicular a (2, 1)

export default function ProjectionScale({initial = 1, caption}) {
  const [c, setC] = useState(initial);
  const u = times(c, U0);
  const zero = Math.abs(c) < 1e-9;
  const k = zero ? 0 : kOf(V, u);
  const H = times(k, u);

  const line = clipLine([0, 0], U0, BOX);
  const segments = [];
  if (line && !zero) segments.push({from: line[0], to: line[1], muted: true, dashed: true});
  if (!zero) {
    segments.push({from: V, to: H, tone: 2, dashed: true});
    segments.push(...rightAngle(H, [-2, -1], sub(V, H), 0.3));
    segments.push({from: [0, 0], to: H, tone: 3, arrow: true});
    // O vetor do chão vai logo abaixo da reta, paralelo a ela, para não ficar
    // escondido embaixo da sombra.
    segments.push({from: GAP, to: add(GAP, u), tone: 1, arrow: true});
  }
  segments.push({from: [0, 0], to: V, tone: 2, arrow: true});

  const labels = [{at: V, math: '\\vec{v}', tone: 2, dx: -14, dy: -10}];
  if (!zero) {
    const name = c === 1 ? '(2,\\ 1)' : c === -1 ? '-(2,\\ 1)' : `${num(c, 1)}\\,(2,\\ 1)`;
    // O rótulo só aparece onde cabe sem encostar no eixo x nem na reta: abaixo
    // da ponta quando c vai de 1,5 a 3 (à direita dela com c = 1), e à esquerda
    // dela quando c vai de −2 a
    // −0,5. Nos outros casos, o painel diz qual é o vetor.
    if (c === 1) labels.push({at: add(GAP, u), math: name, tone: 1, anchor: 'start', dx: 10, dy: 4});
    else if (c >= 1.5) labels.push({at: add(GAP, u), math: name, tone: 1, dy: 20});
    else if (c <= -0.5 && c >= -2) labels.push({at: add(GAP, u), math: name, tone: 1, anchor: 'end', dx: -6, dy: 20});
  }

  return (
    <div className={shared.wrapper} data-explorer="projection-scale">
      <CartesianPlane
        xMin={BOX[0]}
        xMax={BOX[1]}
        yMin={BOX[2]}
        yMax={BOX[3]}
        xUnit={32}
        axisLabels={['x', 'y']}
        segments={segments}
        labels={labels}
        caption={
          caption ??
          'O vetor azul marca o chão: c vezes (2, 1). Ele está desenhado logo abaixo da reta, para não ficar escondido. Arraste c: a seta azul estica, encolhe ou vira para trás, sempre na mesma direção, e a sombra de v (verde) não sai do lugar.'
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {zero ? (
          <p>
            Com c = 0, o vetor do chão é o vetor nulo. Ele não aponta para lado nenhum, e a conta trava no denominador:{' '}
            <Formula math="\vec{u} \cdot \vec{u} = 0" />, e não existe divisão por zero.
          </p>
        ) : (
          <>
            <p className={shared.formula}>
              <Formula
                math={`\\vec{u} = ${pair(u, 1)}, \\qquad k = \\frac{\\vec{v} \\cdot \\vec{u}}{\\vec{u} \\cdot \\vec{u}} = \\frac{${num(dot(V, u), 2)}}{${num(dot(u, u), 2)}} ${exact(k, 3) ? '=' : '\\approx'} ${num(k, 3)}`}
              />
            </p>
            <p className={shared.formula}>
              <Formula math={`\\operatorname{proj}_{\\vec{u}} \\vec{v} = ${num(k, 3)} \\times ${pair(u, 1)} = (2{,}4;\\ 1{,}2)`} />
            </p>
            <p>
              {c === 1
                ? 'Com c = 1, o chão é marcado pelo próprio (2, 1), e cabe 1,2 vez na sombra. Arraste c e compare.'
                : `O vetor do chão mede ${numText(norm(u), 2)}, e o k passou de 1,2 para ${numText(k, 3)}. Mas a sombra é a mesma. ${
                    Math.abs(c) > 1
                      ? 'Um u mais comprido cabe menos vezes nela.'
                      : Math.abs(c) < 1
                        ? 'Um u mais curto cabe mais vezes nela.'
                        : 'O u tem o mesmo tamanho de (2, 1).'
                  }${c < 0 ? ' E o k ficou negativo porque u virou para trás.' : ''}`}
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>c: {numText(c, 1)}</span>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.5}
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            aria-label="Número c que multiplica (2, 1)"
          />
        </label>
      </div>
    </div>
  );
}
