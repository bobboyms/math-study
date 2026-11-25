import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import {norm, rightAngle, sub, times, num, numText, pair} from '../mathviz/projection';

// O cabo até o galpão (lição 7.32, Projeção ortogonal).
//
// A estrada passa pelo poste O(0, 0) na direção de (4, 3); o galpão fica em
// G(2, 9). O deslizante escolhe a emenda E sobre a estrada, a s km do poste
// (medidos ao longo da estrada). O ramal é o segmento de G até E.
//
// mode="search" (motivador): o aluno testa emendas e registra cada tentativa
// numa tabela. A tabela mostra o melhor entre os testados, mas não diz se
// existe um melhor entre dois testes.
//
// mode="solved" (resolução): a emenda certa H(5,6; 4,2) fica marcada, com a
// sombra de 7 km, o ramal de 6 km e o ângulo reto. O deslizante continua
// escolhendo outra emenda Q, e o painel mostra por Pitágoras que o ramal de Q
// mede a raiz de 6² + (s − 7)², sempre mais que 6 quando s não é 7.

const G = [2, 9];
const DIR = [0.8, 0.6]; // unitário da estrada: (4, 3) dividido por 5
const COST = 15; // mil reais por km

const at = (s) => times(s, DIR);
const ramal = (s) => norm(sub(G, at(s)));

export default function CableSearch({mode = 'search', initial, caption}) {
  const solved = mode === 'solved';
  const [s, setS] = useState(initial ?? (solved ? 5 : 0));
  const [tries, setTries] = useState([]);

  const E = at(s);
  const len = ramal(s);
  const H = at(7);

  const segments = [];
  const points = [
    {at: [0, 0], label: 'O', tone: 1, dx: -14, dy: -10},
    {at: G, label: 'G(2,\\ 9)', tone: 2, dx: 40, dy: 0},
  ];
  const labels = [{at: [8, 6], math: '\\text{estrada}', tone: 1, dx: 14, dy: 30}];

  if (solved) {
    segments.push({from: [0, 0], to: H, tone: 3, arrow: true});
    segments.push({from: H, to: G, tone: 2});
    segments.push(...rightAngle(H, [-4, -3], sub(G, H), 0.4));
    labels.push({at: [2.8, 2.1], math: '7', tone: 3, dx: 10, dy: 16});
    labels.push({at: [3.8, 6.6], math: '6', tone: 2, dx: 16, dy: -12});
    points.push({at: H, label: 'H(5{,}6;\\ 4{,}2)', tone: 3, dx: 58, dy: 8});
    if (Math.abs(s - 7) > 0.01) {
      segments.push({from: E, to: G, tone: 0, dashed: true});
      points.push({at: E, label: 'Q', tone: 0, dx: s > 7 ? 14 : 12, dy: 16, r: 4});
    }
  } else {
    segments.push({from: E, to: G, tone: 2});
    points.push({at: E, label: 'E', tone: 2, dx: 14, dy: 16});
  }

  const record = () => {
    if (tries.some((x) => x.s === s)) return;
    setTries([...tries, {s, len}].sort((a, b) => a.s - b.s));
  };
  const best = tries.length ? tries.reduce((m, x) => (x.len < m.len ? x : m), tries[0]) : null;

  return (
    <div className={shared.wrapper} data-explorer="cable-search">
      <CartesianPlane
        xMin={-1}
        xMax={9}
        yMin={-1}
        yMax={10}
        xUnit={32}
        /* Sem o número −1 no eixo x: a estrada passa em cima dele. */
        xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((at) => ({at}))}
        lines={[{m: 0.75, n: 0, tone: 1}]}
        segments={segments}
        points={points}
        labels={labels}
        axisLabels={['x', 'y']}
        caption={
          caption ??
          (solved
            ? 'A emenda certa é H: o técnico anda 7 km pela estrada (seta verde) e o ramal de H até G mede 6 km, em ângulo reto com a estrada. Arraste a emenda Q para comparar: qualquer outro ramal (tracejado) é mais longo.'
            : 'A estrada passa pelo poste O na direção de (4, 3). Arraste a emenda E ao longo da estrada e veja o comprimento do ramal até o galpão G. Registre as tentativas para comparar.')
        }
      />
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {solved ? (
          Math.abs(s - 7) < 0.01 ? (
            <p>
              Q está em H: o ramal mede exatamente 6 km e custa R$ 90 mil. É o menor ramal possível.
            </p>
          ) : (
            <>
              <p className={shared.formula}>
                <Formula
                  math={`\\text{ramal de } Q = \\sqrt{6^2 + (${num(s, 1)} - 7)^2} = \\sqrt{36 + ${num((s - 7) ** 2, 2)}} \\approx ${num(len, 2)} \\text{ km}`}
                />
              </p>
              <p>
                Q fica a {numText(Math.abs(s - 7), 1)} km de H pela estrada. Esse trecho e o ramal de 6 km são os catetos de um
                triângulo retângulo, e o ramal de Q é a hipotenusa: passa de 6 km por{' '}
                {numText(len - 6, 2)} km e custa cerca de R$ {numText(len * COST, 1)} mil.
              </p>
            </>
          )
        ) : (
          <>
            <p className={shared.formula}>
              <Formula math={`E = ${pair(E, 2)}, \\qquad \\text{ramal} = \\lVert G - E \\rVert \\approx ${num(len, 2)} \\text{ km}`} />
            </p>
            <p>Custo do ramal: cerca de R$ {numText(len * COST, 1)} mil.</p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            {solved ? 'Emenda Q' : 'Emenda E'}: {numText(s, 1)} km do poste, pela estrada
          </span>
          <input
            type="range"
            min={-1}
            max={10}
            step={0.5}
            value={s}
            onChange={(e) => setS(Number(e.target.value))}
            aria-label="Distância da emenda ao poste, ao longo da estrada, em quilômetros"
          />
        </label>
      </div>
      {!solved && (
        <>
          <div className={shared.buttons}>
            <button type="button" onClick={record}>
              Registrar esta tentativa
            </button>
            <button type="button" onClick={() => setTries([])} disabled={!tries.length}>
              Limpar a tabela
            </button>
          </div>
          {tries.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>emenda (km do poste)</th>
                  <th>ramal (km)</th>
                  <th>custo (mil reais)</th>
                </tr>
              </thead>
              <tbody>
                {tries.map((x) => (
                  <tr key={x.s} style={best && x.s === best.s ? {fontWeight: 700} : undefined}>
                    <td>{numText(x.s, 1)}</td>
                    <td>{numText(x.len, 2)}</td>
                    <td>{numText(x.len * COST, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {best && (
            <p className={shared.hint}>
              O menor ramal testado (em negrito) mede {numText(best.len, 2)} km. A tabela só compara os pontos que você
              testou: ela não garante que entre dois testes não exista um ramal ainda menor.
            </p>
          )}
        </>
      )}
    </div>
  );
}
