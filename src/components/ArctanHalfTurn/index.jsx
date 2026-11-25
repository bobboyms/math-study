import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {wedge, polar, dec, angleOf, edgePoint} from '../mathviz/vectorArc';

// A tangente enxerga a reta, não o lado (lição 7.30).
//
// Dois deslizantes dão as coordenadas a e b do vetor (seta azul). A reta
// cinza tracejada passa pela origem com inclinação b/a: é tudo o que a divisão
// guarda. O arco tangente devolve um ângulo entre −90° e 90°, e a seta laranja
// tracejada, do mesmo tamanho, aponta nesse ângulo. Quando a é negativo, a
// laranja fica na mesma reta, do outro lado: é o vetor oposto. O botão "Girar
// meia volta" faz a laranja girar 180° até cair sobre a azul.
//
// Com `record`, o painel ganha uma tabela: cada vetor anotado vira uma linha
// com b/a, o arco tangente, o sinal de a e o ângulo certo. O aluno descobre
// sozinho em que casos a meia volta foi necessária.

const DURATION = 2;
const PRESETS = [
  [-3, 4],
  [3, -4],
  [4, 3],
  [-4, -3],
  [0, 5],
];

const num = (n) => String(n).replace('-', '−');

function analyse(a, b) {
  if (a === 0 && b === 0) return {kind: 'zero'};
  if (a === 0) return {kind: 'vertical', theta: b > 0 ? 90 : 270};
  const alpha = (Math.atan(b / a) * 180) / Math.PI;
  return {kind: 'ok', alpha, turn: a < 0, theta: angleOf(a, b)};
}

export default function ArctanHalfTurn({initialA = -3, initialB = 4, record = false, presets = PRESETS, caption}) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [rows, setRows] = useState([]);
  const {ref, t, play, playing} = useAnimation({duration: DURATION, autoplay: false});
  const [turned, setTurned] = useState(false);

  const info = analyse(a, b);
  const len = Math.hypot(a, b);
  const segments = [];
  const labels = [];
  const polygons = [];

  // A reta que a divisão b/a enxerga.
  if (info.kind !== 'zero') {
    const far = edgePoint(a, b, 7);
    segments.push({from: [-far[0], -far[1]], to: far, muted: true, dashed: true});
  }

  if (info.kind === 'ok') {
    const k = turned ? stage(t, 0, DURATION) : 0;
    const shown = info.alpha + (info.turn ? 180 * k : 0);
    if (Math.abs(info.alpha) > 0.5) polygons.push(wedge(1.3, 0, info.alpha, 2));
    if (info.turn && k > 0.02) polygons.push(wedge(1.9, info.alpha, shown, 2));
    segments.push({from: [0, 0], to: [a, b], tone: 1, arrow: true});
    segments.push({from: [0, 0], to: polar(len, shown), tone: 2, arrow: true, dashed: true});
    const m = polar(1.3, info.alpha / 2);
    if (Math.abs(info.alpha) > 6) labels.push({at: m, math: `${dec(info.alpha, 1)}^\\circ`, dx: 34, dy: info.alpha >= 0 ? -6 : 8, tone: 2});
    if (info.turn && k > 0.98) {
      const mm = polar(1.9, info.alpha + 90);
      labels.push({at: mm, math: '+180^\\circ', dx: mm[0] >= 0 ? 34 : -34, dy: mm[1] >= 0 ? -8 : 10, tone: 2});
    }
  } else if (info.kind === 'vertical') {
    segments.push({from: [0, 0], to: [a, b], tone: 1, arrow: true});
  }
  if (info.kind !== 'zero') {
    labels.push({at: [a, b], math: `(${a},\\ ${b})`, dx: a >= 0 ? 34 : -34, dy: b >= 0 ? -12 : 16, tone: 1});
  }

  const reset = (p, q) => {
    setA(p);
    setB(q);
    setTurned(false);
  };

  const note = () => {
    const key = `${a},${b}`;
    if (rows.some((row) => row.key === key) || info.kind === 'zero') return;
    setRows([...rows, {key, a, b, info}].slice(-6));
  };

  let text;
  if (info.kind === 'zero') {
    text = <>O vetor nulo não tem seta, e por isso não tem ângulo.</>;
  } else if (info.kind === 'vertical') {
    text = (
      <>
        Com <Formula math="a = 0" />, a divisão <Formula math="\tfrac{b}{a}" /> não existe, e o arco tangente não tem
        o que receber. A seta está sobre o eixo y: <Formula math={`\\theta = ${info.theta}^\\circ`} />.
      </>
    );
  } else {
    const frac = `\\tfrac{${b}}{${a}} \\approx ${dec(b / a, 3)}`;
    text = (
      <>
        <Formula math={frac} />, e <Formula math={`\\arctg\\left(${dec(b / a, 3)}\\right) \\approx ${dec(info.alpha, 1)}^\\circ`} />: a seta
        laranja.{' '}
        {info.turn ? (
          <>
            Como <Formula math={`a = ${a}`} /> é negativo, a azul está na metade esquerda, e a laranja ficou do outro lado
            da mesma reta. Meia volta corrige:{' '}
            <Formula math={`\\theta = ${dec(info.alpha, 1)}^\\circ + 180^\\circ = ${dec(info.alpha + 180, 1)}^\\circ`} />.
          </>
        ) : (
          <>
            Como <Formula math={`a = ${a}`} /> é positivo, a azul já está na metade direita, e a laranja cai sobre ela:{' '}
            <Formula math={`\\theta \\approx ${dec(info.alpha, 1)}^\\circ`} />
            {info.alpha < 0 ? (
              <>
                {' '}(ou <Formula math={`${dec(info.alpha + 360, 1)}^\\circ`} />, somando uma volta)
              </>
            ) : null}
            .
          </>
        )}
      </>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="arctan-half-turn">
      <div ref={ref}>
        <CartesianPlane
          xMin={-7}
          xMax={7}
          yMin={-7}
          yMax={7}
          xUnit={24}
          showNumbers={false}
          axisLabels={['x', 'y']}
          segments={segments}
          labels={labels}
          polygons={polygons}
          caption={
            caption ??
            'A seta azul é o vetor (a, b). A reta cinza tracejada tem inclinação b/a: é tudo o que a divisão guarda. A seta laranja tracejada aponta no ângulo que o arco tangente devolve, sempre na metade direita do plano.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>{text}</p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Coordenada a: {num(a)}</span>
          <input type="range" min={-6} max={6} step={1} value={a} onChange={(e) => reset(Number(e.target.value), b)} disabled={playing} aria-label="Coordenada a do vetor" />
        </label>
        <label className={shared.control}>
          <span>Coordenada b: {num(b)}</span>
          <input type="range" min={-6} max={6} step={1} value={b} onChange={(e) => reset(a, Number(e.target.value))} disabled={playing} aria-label="Coordenada b do vetor" />
        </label>
      </div>
      <div className={shared.buttons}>
        {info.kind === 'ok' && info.turn && (
          <button
            type="button"
            disabled={playing}
            onClick={() => {
              setTurned(true);
              play();
            }}
          >
            Girar a seta laranja meia volta
          </button>
        )}
        {record && (
          <button type="button" onClick={note} disabled={info.kind === 'zero'}>
            Anotar este vetor na tabela
          </button>
        )}
      </div>
      <div className={shared.buttons}>
        {presets.map(([p, q]) => (
          <button key={`${p},${q}`} type="button" aria-pressed={p === a && q === b} disabled={playing} onClick={() => reset(p, q)}>
            ({num(p)}, {num(q)})
          </button>
        ))}
      </div>
      {record && rows.length > 0 && (
        <div className={shared.formula}>
          <table>
            <thead>
              <tr>
                <th>vetor</th>
                <th>b/a</th>
                <th>arctg</th>
                <th>a é negativo?</th>
                <th>ângulo θ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>
                    ({num(row.a)}, {num(row.b)})
                  </td>
                  <td>{row.info.kind === 'ok' ? dec(row.b / row.a, 3).replace('{,}', ',').replace('-', '−') : 'não existe'}</td>
                  <td>{row.info.kind === 'ok' ? `${dec(row.info.alpha, 1).replace('{,}', ',').replace('-', '−')}°` : 'não existe'}</td>
                  <td>{row.a < 0 ? 'sim: meia volta' : row.a === 0 ? 'a = 0' : 'não'}</td>
                  <td>{`${dec(row.info.theta, 1).replace('{,}', ',')}°`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
