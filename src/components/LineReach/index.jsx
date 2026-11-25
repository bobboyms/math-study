import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {at, dec, pairTex, round} from '../mathviz/lineParam';

// O teste de pertencer (lição 7.33, Retas com vetores).
//
// O aluno move um ponto X com dois controles. A figura desenha a seta de A
// até X (laranja) e o vetor diretor d (azul) e pergunta: a seta AX é um
// múltiplo de d? Cada coordenada pede o seu número de passos t. Se os dois
// pedidos coincidem, X está na reta, no passo t. Se não coincidem, nenhum t
// serve, e X está fora da reta. É uma busca: o painel guarda os pontos já
// testados.

const txt = (v, digits = 2) => dec(v, digits).replace('{,}', ',').replace('-', '−');

// O t que uma coordenada pede: (alvo − partida) ÷ passo.
function ask(target, start, delta) {
  if (delta === 0) return target === start ? 'qualquer' : 'nenhum';
  return round((target - start) / delta);
}

function askTex(target, start, delta) {
  const diff = target - start;
  if (delta === 0) return diff === 0 ? '\\text{qualquer } t' : '\\text{nenhum } t';
  const value = round(diff / delta);
  const exact = Number.isInteger(value * 4);
  return `t = \\frac{${dec(diff, 0)}}{${dec(delta, 0)}}${exact ? ` = ${dec(value, 2)}` : ` \\approx ${dec(value, 2)}`}`;
}

export default function LineReach({
  A = [1, 2],
  d = [2, 1],
  xMin = -4,
  xMax = 10,
  yMin = -1,
  yMax = 7,
  xUnit = 30,
  initial = [7, 5],
  caption,
}) {
  const [X, setX] = useState(initial);
  const [log, setLog] = useState([]);

  const w = [X[0] - A[0], X[1] - A[1]];
  const tx = ask(X[0], A[0], d[0]);
  const ty = ask(X[1], A[1], d[1]);
  const isA = w[0] === 0 && w[1] === 0;
  let onLine;
  let tHit = null;
  if (tx === 'nenhum' || ty === 'nenhum') onLine = false;
  else if (tx === 'qualquer') {
    onLine = true;
    tHit = ty;
  } else if (ty === 'qualquer') {
    onLine = true;
    tHit = tx;
  } else {
    onLine = Math.abs(tx - ty) < 1e-9;
    tHit = onLine ? tx : null;
  }

  // A seta AX vem antes, para que o diretor d fique por cima quando os dois
  // estão na mesma reta.
  const segments = [];
  if (!isA) segments.push({from: A, to: X, tone: 2, arrow: true});
  segments.push({from: A, to: at(A, d, 1), tone: 1, arrow: true, label: '\\vec{d}', dx: -8, dy: -16});

  const points = [
    {at: A, tone: 1, r: 4.5, label: 'A', dx: -14, dy: -12},
    {at: X, tone: 2, r: 6, label: 'X', dx: 14, dy: -12},
  ];

  const record = () => {
    const key = `${X[0]},${X[1]}`;
    if (log.some((item) => item.key === key)) return;
    setLog([...log, {key, X, onLine, tHit}]);
  };

  return (
    <div className={shared.wrapper} data-explorer="line-reach">
      <CartesianPlane
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnit={xUnit}
        axisLabels={['x', 'y']}
        lines={[{through: [A, at(A, d, 1)], muted: true, dashed: true}]}
        segments={segments}
        points={points}
        caption={caption}
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`\\overrightarrow{AX} = X - A = ${pairTex(X[0], X[1])} - ${pairTex(A[0], A[1])} = ${pairTex(w[0], w[1])}`}
          />
        </p>
        {isA ? (
          <p>
            X é o próprio A. A seta AX é o vetor nulo, que é <Formula math="0\vec{d}" />: X está na reta, no passo{' '}
            <Formula math="t = 0" />.
          </p>
        ) : (
          <>
            <p>
              Para chegar a X, a primeira coordenada pede <Formula math={askTex(X[0], A[0], d[0])} />, e a segunda pede{' '}
              <Formula math={askTex(X[1], A[1], d[1])} />.
            </p>
            <p>
              {onLine ? (
                <>
                  <strong>Os dois pedidos combinam.</strong> A seta AX é <Formula math={`${dec(tHit, 2)}\\vec{d}`} />, e X está
                  na reta, no passo <Formula math={`t = ${dec(tHit, 2)}`} />.
                </>
              ) : (
                <>
                  <strong>Os pedidos não combinam.</strong> Nenhum número de passos acerta as duas coordenadas ao mesmo
                  tempo. A seta AX não é múltiplo de d, e X está fora da reta.
                </>
              )}
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Ponto X, coordenada x: {txt(X[0], 0)}</span>
          <input
            type="range"
            min={Math.ceil(xMin)}
            max={Math.floor(xMax)}
            step={1}
            value={X[0]}
            onChange={(e) => setX([Number(e.target.value), X[1]])}
            aria-label="Coordenada x do ponto X"
          />
        </label>
        <label className={shared.control}>
          <span>Ponto X, coordenada y: {txt(X[1], 0)}</span>
          <input
            type="range"
            min={Math.ceil(yMin)}
            max={Math.floor(yMax)}
            step={1}
            value={X[1]}
            onChange={(e) => setX([X[0], Number(e.target.value)])}
            aria-label="Coordenada y do ponto X"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={record}>
          Guardar este ponto
        </button>
        {log.length > 0 && (
          <button type="button" onClick={() => setLog([])}>
            Limpar a lista
          </button>
        )}
      </div>
      {log.length > 0 && (
        <ul className={shared.legend}>
          {log.map((item) => (
            <li key={item.key}>
              <Formula math={pairTex(item.X[0], item.X[1])} />:{' '}
              {item.onLine ? (
                <>
                  na reta, com <Formula math={`t = ${dec(item.tHit, 2)}`} />
                </>
              ) : (
                'fora da reta'
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
