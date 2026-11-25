import React, {useState} from 'react';
import SpaceScene, {add, fullBox, triple, num} from '../SpaceScene';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';

// A diagonal da caixa contra o caminho pelas arestas (lição 7.34).
//
// A caixa tem um canto em A e o canto oposto em B = A + (a, b, c). O caminho
// verde anda pelas arestas, uma de cada vez (a, depois b, depois c); a seta
// azul atravessa a caixa em linha reta. O painel compara os dois números:
// a + b + c contra √(a² + b² + c²). Os deslizantes mudam as arestas.

const isSquare = (n) => Number.isInteger(Math.sqrt(n));
const rootTex = (n) => (isSquare(n) ? `${Math.sqrt(n)}` : `\\sqrt{${n}} \\approx ${num(Math.sqrt(n), 2).replace(',', '{,}')}`);

export default function BoxDiagonalExplorer({
  from = [0, 0, 0],
  initial = [2, 3, 6],
  sliders = true,
  max = 6,
  names = ['O', 'P'],
  caption,
}) {
  const [v, setV] = useState(initial);
  const [a, b, c] = v;
  const A = from;
  const B = add(A, v);
  const C1 = add(A, [a, 0, 0]);
  const C2 = add(A, [a, b, 0]);

  const items = [
    ...fullBox(A, B, {opacity: 0.55}),
    {type: 'line', from: A, to: C2, tone: 2, dashed: true},
    {type: 'line', from: A, to: C1, tone: 3, width: 3},
    {type: 'line', from: C1, to: C2, tone: 3, width: 3},
    {type: 'line', from: C2, to: B, tone: 3, width: 3},
    {type: 'arrow', from: A, to: B, tone: 1},
  ];
  if (a) items.push({type: 'label', at: add(A, [a / 2, 0, 0]), math: String(a), dx: -14, dy: -9, tone: 3});
  if (b) items.push({type: 'label', at: add(A, [a, b / 2, 0]), math: String(b), dy: 15, tone: 3});
  if (c) items.push({type: 'label', at: add(A, [a, b, c / 2]), math: String(c), dx: 15, tone: 3});
  items.push(
    {type: 'point', at: A, tone: 0, r: 3.5, math: names[0], dx: -13, dy: -9},
    {type: 'point', at: B, tone: 1, r: 4, math: names[1], dx: 0, dy: -16},
  );

  const sq = a * a + b * b + c * c;
  const floor = a * a + b * b;
  const frameMax = sliders ? [max, max, max] : v;
  const top = add(A, frameMax);

  return (
    <div className={shared.wrapper} data-explorer="box-diagonal">
      <SpaceScene
        items={items}
        unit={sliders ? 26 : 30}
        axes={{max: [top[0] + 0.5, top[1] + 0.5, top[2] + 0.5]}}
        frame={[A, top, add(A, [frameMax[0], 0, 0]), add(A, [0, frameMax[1], 0])]}
        caption={
          caption ??
          'O caminho verde anda pelas arestas da caixa, uma de cada vez. A seta azul vai em linha reta, pela diagonal da caixa. O tracejado laranja no chão é a diagonal do chão.'
        }
      />
      {sliders && (
        <div className={shared.parameterGrid}>
          {['a (direção x)', 'b (direção y)', 'c (altura)'].map((label, i) => (
            <label key={label} className={shared.control}>
              <span>
                {label}: <strong>{v[i]}</strong>
              </span>
              <input
                type="range"
                min={0}
                max={max}
                step={1}
                value={v[i]}
                onChange={(e) => {
                  const w = [...v];
                  w[i] = Number(e.target.value);
                  setV(w);
                }}
              />
            </label>
          ))}
        </div>
      )}
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Caminho pelas arestas: <Formula math={`${a} + ${b} + ${c} = ${a + b + c}`} />
        </p>
        <p>
          Diagonal do chão: <Formula math={`\\sqrt{${a}^2 + ${b}^2} = ${rootTex(floor)}`} />
        </p>
        <p>
          Diagonal da caixa: <Formula math={`\\sqrt{${a}^2 + ${b}^2 + ${c}^2} = \\sqrt{${sq}}${isSquare(sq) ? ` = ${Math.sqrt(sq)}` : ` \\approx ${num(Math.sqrt(sq), 2).replace(',', '{,}')}`}`} />
        </p>
        <p>
          {[a, b, c].every((x) => x === 0)
            ? 'As três arestas são zero: não há caixa, e os dois números dão 0.'
            : [a, b, c].filter((x) => x !== 0).length === 1
              ? 'Só uma aresta não é zero: o caminho pelas arestas já é a linha reta, e os dois números coincidem.'
              : 'A linha reta é mais curta que o caminho pelas arestas.'}
        </p>
        {!sliders && (
          <p>
            <Formula math={`${names[1]} - ${names[0]} = ${triple(v)}`} />
          </p>
        )}
      </div>
    </div>
  );
}
