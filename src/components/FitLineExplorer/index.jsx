import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {AREAS, PRICES, BEST, errorsOf, sqeOf, predict, tnum, pnum, signedText, lineTex, lineText, sqTex} from './apartamentos';

// A reta pelos apartamentos da lição 11.12 (Mínimos quadrados).
//
// Os cinco apartamentos (área em m², preço em R$ mil) e uma reta y = mx + n
// escolhida nos deslizantes. O erro de cada apartamento é o segmento vertical
// (verde) do ponto até a reta: preço observado menos preço previsto.
//
// Modos:
// - 'residuals': os erros com sinal ao lado de cada segmento e uma tabela
//   área, preço, previsão, erro;
// - 'squares': sobre cada erro, um quadrado de lado igual ao erro (desenhado
//   quadrado de verdade na tela) e a soma dos quadrados no painel;
// - 'search': os quadrados, o placar, a menor soma já vista e uma tabela de
//   tentativas registradas;
// - 'solved': a melhor reta, y = 5x + 50, fixa; o deslizante escolhe uma área
//   e o painel dá a previsão, com aviso fora da faixa de 40 a 80 m²;
// - 'train': os quadrados e a perda (soma dos quadrados dividida por 5); o
//   botão “Treinar” leva a reta, aos poucos, até a solução das equações
//   normais, e o painel mostra a perda descendo.

const X_MIN = 30;
const X_MAX = 100;
const Y_MIN = 160;
const Y_MAX = 520;
const XU = 7;
const YU = 1.2;
const M_RANGE = [0, 10, 0.5];
const N_RANGE = [-250, 400, 5];

const clampY = (y) => Math.max(Y_MIN, Math.min(Y_MAX, y));
const same = (a, b) => Math.abs(a - b) < 1e-9;

export default function FitLineExplorer({
  mode = 'search',
  initial = [8, -80],
  presets,
  sliders = true,
  initialArea = 65,
  caption,
}) {
  const fixed = mode === 'solved';
  const [mn, setMn] = useState(fixed ? [BEST.m, BEST.n] : initial);
  const [area, setArea] = useState(initialArea);
  const [best, setBest] = useState(() => ({m: initial[0], n: initial[1], s: sqeOf(initial[0], initial[1])}));
  const [tries, setTries] = useState([]);
  const [from, setFrom] = useState(initial);

  const duration = 2.6;
  const {t, play, playing} = useAnimation({duration, autoplay: false});
  const k = stage(t, 0, duration);
  const [m, n] = playing ? [from[0] + (BEST.m - from[0]) * k, from[1] + (BEST.n - from[1]) * k] : mn;

  const errs = errorsOf(m, n);
  const sqe = sqeOf(m, n);
  const showSquares = mode === 'squares' || mode === 'search' || mode === 'train';
  const showErrLabels = mode === 'residuals' || mode === 'solved';

  const choose = (nm, nn) => {
    setMn([nm, nn]);
    const s = sqeOf(nm, nn);
    setBest((b) => (s < b.s - 1e-9 ? {m: nm, n: nn, s} : b));
  };

  const segments = [];
  const polygons = [];
  const labels = [];
  AREAS.forEach((x, i) => {
    const y = PRICES[i];
    const yp = predict(m, n, x);
    const e = errs[i];
    if (Math.abs(e) > 0.5) {
      segments.push({from: [x, clampY(y)], to: [x, clampY(yp)], tone: 3, dashed: !showSquares});
    }
    if (showSquares && Math.abs(e) > 0.5) {
      const w = (Math.abs(e) * YU) / XU; // lado na tela igual à altura: quadrado de verdade
      polygons.push({points: [[x, y], [x, yp], [x + w, yp], [x + w, y]], tone: 3});
    }
    if (showErrLabels && Math.abs(e) > 0.5 && yp > Y_MIN && yp < Y_MAX) {
      // rótulo do lado direito, na altura do meio do segmento
      // rótulo do lado do ponto que fica longe da reta: acima do ponto quando
      // ele está acima da reta, abaixo quando está abaixo
      labels.push({at: [x, y], math: e > 0 ? `+${tnum(e)}` : tnum(e), tone: 3, dy: e > 0 ? -16 : 18, fontSize: 13});
    }
  });

  // número do apartamento: à esquerda quando há quadrados (eles crescem para a
  // direita); senão à direita, longe da reta, que sobe da esquerda para a
  // direita (um pouco acima do ponto quando ele está acima da reta)
  const points = AREAS.map((x, i) => ({at: [x, PRICES[i]], tone: 1, label: String(i + 1), dx: showSquares ? -12 : 13, dy: !showSquares && errs[i] > 0.5 ? -2 : 4, fontSize: 12}));
  if (fixed) {
    const yp = predict(BEST.m, BEST.n, area);
    if (yp >= Y_MIN && yp <= Y_MAX) {
      points.push({at: [area, yp], tone: 2, open: true, r: 6, label: `(${area},\\ ${tnum(yp)})`, dx: area > 85 ? -46 : -44, dy: -16});
      segments.push({from: [area, Y_MIN], to: [area, yp], muted: true, dashed: true});
    }
  }

  const record = () => {
    if (tries.some((x) => same(x.m, m) && same(x.n, n))) return;
    setTries([...tries, {m, n, s: sqe}]);
  };
  const bestTry = tries.length ? tries.reduce((a, b) => (b.s < a.s ? b : a), tries[0]) : null;

  const train = () => {
    setFrom(mn);
    setMn([BEST.m, BEST.n]);
    setBest((b) => (sqeOf(BEST.m, BEST.n) < b.s ? {m: BEST.m, n: BEST.n, s: sqeOf(BEST.m, BEST.n)} : b));
    play();
  };

  const defaultCaption = {
    residuals:
      'Os cinco apartamentos (pontos azuis, numerados) e uma reta (laranja). O tracejado verde de cada ponto até a reta é o erro daquele apartamento: preço observado menos preço previsto. Mude m e n e veja os cinco erros mudarem juntos.',
    squares:
      'Sobre cada erro (segmento verde), um quadrado com o lado do tamanho do erro. A área de cada quadrado é o erro ao quadrado, e o painel soma as cinco áreas.',
    search:
      'Procure a reta com a menor soma dos quadrados (a soma das áreas dos quadrados verdes). O painel guarda a menor soma que você já viu; registre as tentativas para comparar.',
    solved:
      'A melhor reta, y = 5x + 50, e os cinco erros. Escolha uma área no deslizante: a bolinha vazia é a previsão da reta para essa área.',
    train:
      'Treinar o modelo é achar os pesos m e n com a menor perda. O botão leva a reta da posição atual até a solução das equações normais, e a perda desce até 280.',
  }[mode];

  const tableRows = AREAS.map((x, i) => ({x, y: PRICES[i], p: predict(m, n, x), e: errs[i]}));

  return (
    <div className={shared.wrapper} data-explorer={`fit-line-${mode}`}>
      <CartesianPlane
        xMin={X_MIN}
        xMax={X_MAX}
        yMin={Y_MIN}
        yMax={Y_MAX}
        xUnit={XU}
        yUnit={YU}
        xStep={10}
        yStep={40}
        xTicks={[30, 40, 50, 60, 70, 80, 90].map((at) => ({at}))}
        yTicks={[160, 200, 240, 280, 320, 360, 400, 440, 480].map((at) => ({at}))}
        lines={[{m, n, tone: 2}]}
        polygons={polygons}
        segments={segments}
        points={points}
        labels={labels}
        axisLabels={['\\text{m}^2', '\\text{R\\$ mil}']}
        caption={caption ?? defaultCaption}
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`\\text{reta: } ${lineTex(Number(m.toFixed(2)), Number(n.toFixed(1)))}`} />
        </p>

        {mode === 'residuals' && (
          <table>
            <thead>
              <tr>
                <th>apartamento</th>
                <th>área (m²)</th>
                <th>preço</th>
                <th>previsão</th>
                <th>erro</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, i) => (
                <tr key={r.x}>
                  <td>{i + 1}</td>
                  <td>{r.x}</td>
                  <td>{r.y}</td>
                  <td>{pnum(r.p)}</td>
                  <td>
                    {pnum(r.y)} − {pnum(r.p)} = <strong>{signedText(r.e)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {(mode === 'squares' || mode === 'search' || mode === 'train') && (
          <p className={shared.formula}>
            <Formula
              math={`\\text{SQE} = ${errs.map((e) => sqTex(Number(e.toFixed(1)))).join(' + ')} = ${tnum(sqe, 1)}`}
            />
          </p>
        )}

        {mode === 'search' && (
          <p>
            Menor soma que você já viu: <strong>{pnum(best.s, 1)}</strong>, com a reta{' '}
            <Formula math={lineTex(best.m, best.n)} />.
          </p>
        )}

        {mode === 'train' && (
          <>
            <p>
              Pesos do modelo: m = {pnum(m, 2)} e n = {pnum(n, 1)}.
            </p>
            <p className={shared.formula}>
              <Formula math={`\\text{perda} = \\frac{\\text{SQE}}{5} = \\frac{${tnum(sqe, 1)}}{5} = ${tnum(sqe / 5, 1)}`} />
            </p>
            {!playing && same(m, BEST.m) && same(n, BEST.n) && (
              <p>Treinado: estes são os pesos que as equações normais dão, e nenhum outro par tem perda menor.</p>
            )}
          </>
        )}

        {mode === 'solved' && (
          <>
            <p className={shared.formula}>
              <Formula math={`\\text{SQE} = ${errs.map((e) => sqTex(e)).join(' + ')} = ${tnum(sqe)}`} />
            </p>
            <p className={shared.formula}>
              <Formula math={`\\text{previsão para } ${area}\\text{ m}^2: \\quad 5 \\times ${area} + 50 = ${tnum(predict(5, 50, area))}`} />
            </p>
            <p>
              {area >= 40 && area <= 80
                ? `Dentro da faixa dos dados (40 a 80 m²): a reta sugere R$ ${pnum(predict(5, 50, area))} mil.`
                : `Fora da faixa dos dados (40 a 80 m²). A conta sai, mas nenhuma venda observada apoia esse número: é uma extrapolação.`}
            </p>
          </>
        )}
      </div>

      {!fixed && sliders && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>
              Inclinação: <strong>m = {pnum(mn[0], 1)}</strong> (mil reais por m²)
            </span>
            <input
              type="range"
              min={M_RANGE[0]}
              max={M_RANGE[1]}
              step={M_RANGE[2]}
              value={mn[0]}
              disabled={playing}
              onChange={(e) => choose(Number(e.target.value), mn[1])}
              aria-label="Inclinação m da reta"
            />
          </label>
          <label className={shared.control}>
            <span>
              Intercepto: <strong>n = {pnum(mn[1])}</strong> (mil reais)
            </span>
            <input
              type="range"
              min={N_RANGE[0]}
              max={N_RANGE[1]}
              step={N_RANGE[2]}
              value={mn[1]}
              disabled={playing}
              onChange={(e) => choose(mn[0], Number(e.target.value))}
              aria-label="Intercepto n da reta"
            />
          </label>
        </div>
      )}

      {fixed && (
        <div className={shared.controls}>
          <label className={shared.control}>
            <span>
              Área do apartamento: <strong>{area} m²</strong>
            </span>
            <input
              type="range"
              min={X_MIN}
              max={X_MAX}
              step={5}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              aria-label="Área do apartamento, em metros quadrados"
            />
          </label>
        </div>
      )}

      {(presets?.length || mode === 'search' || mode === 'train') && (
        <div className={shared.buttons}>
          {presets?.map((p) => (
            <button
              key={`${p.m},${p.n}`}
              type="button"
              disabled={playing}
              aria-pressed={same(mn[0], p.m) && same(mn[1], p.n)}
              onClick={() => choose(p.m, p.n)}
            >
              {p.label ?? lineText(p.m, p.n)}
            </button>
          ))}
          {mode === 'search' && (
            <>
              <button type="button" onClick={record}>
                Registrar esta tentativa
              </button>
              <button type="button" onClick={() => setTries([])} disabled={!tries.length}>
                Limpar a tabela
              </button>
            </>
          )}
          {mode === 'train' && (
            <button type="button" disabled={playing} onClick={train}>
              Treinar: resolver as equações normais
            </button>
          )}
        </div>
      )}

      {mode === 'search' && tries.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>reta</th>
                <th>soma dos quadrados</th>
              </tr>
            </thead>
            <tbody>
              {tries.map((x) => (
                <tr key={`${x.m},${x.n}`} style={bestTry && x === bestTry ? {fontWeight: 700} : undefined}>
                  <td>{lineText(x.m, x.n)}</td>
                  <td>{pnum(x.s, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={shared.hint}>
            A menor soma registrada está em negrito. A tabela só compara as retas que você testou: ela não garante que
            entre duas tentativas não exista uma reta com soma ainda menor.
          </p>
        </>
      )}
    </div>
  );
}
