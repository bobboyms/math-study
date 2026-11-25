import React, {useEffect, useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath, signedMath, plainNumber} from '../VectorSumKit';

// Número vezes vetor (lição 7.29): k estica, encolhe ou vira a seta, e ela
// nunca sai da reta de v.
//
// O tracejado cinza é a reta que passa pela origem na direção de v. A seta
// laranja é k·v. Ao entrar na tela, o k passeia sozinho (1 → 3 → −2 → valor
// inicial) para mostrar que a seta só desliza sobre a reta; depois o aluno
// controla o k pelo deslizante.
//
// Com `targets`, a figura vira uma busca: cada alvo é um ponto, e o painel
// guarda os alvos que a ponta de k·v já alcançou, com o k que serviu. Um alvo
// fora da reta nunca é alcançado; quando a primeira coordenada bate e a
// segunda não, o painel diz isso.

const INTRO = 4;
const EPS = 1e-9;

const kLabel = (k) => {
  if (Math.abs(k - 1) < EPS) return '\\vec{v}';
  if (Math.abs(k + 1) < EPS) return '-\\vec{v}';
  return `${mathNumber(k, 2)}\\vec{v}`;
};

const normMath = (v) => {
  const n2 = v[0] * v[0] + v[1] * v[1];
  const r = Math.sqrt(n2);
  return Number.isInteger(r) ? `${r}` : `\\sqrt{${n2}}`;
};

function describe(k) {
  if (Math.abs(k) < EPS) return 'k = 0: a seta encolheu até virar o vetor nulo, um ponto na origem.';
  if (Math.abs(k - 1) < EPS) return 'k = 1: a própria seta v.';
  if (Math.abs(k + 1) < EPS) return 'k = −1: o mesmo comprimento, sentido contrário. É o oposto de v.';
  if (k > 1) return 'k maior que 1: a seta estica e aponta para o mesmo lado de v.';
  if (k > 0) return 'k entre 0 e 1: a seta encolhe e aponta para o mesmo lado de v.';
  if (k > -1) return 'k entre −1 e 0: a seta encolhe e vira para o lado contrário.';
  return 'k menor que −1: a seta estica e vira para o lado contrário.';
}

export default function ScaleVector({
  v = [2, 1],
  initial = 2,
  kMin = -3,
  kMax = 3,
  step = 0.25,
  targets = [],
  window: win = {xMin: -7, xMax: 7, yMin: -4, yMax: 4},
  xUnit = 30,
  labelEvery = 1,
  caption,
}) {
  const [k, setK] = useState(initial);
  const [found, setFound] = useState({});

  // O passeio vai de 1 até o topo, desce até o fundo e volta ao inicial,
  // sem sair da faixa do controle (senão a seta escapa da janela).
  const top = Math.min(3, kMax);
  const bottom = Math.max(-2, kMin);
  const introK = (time) => {
    if (time <= 1.2) return 1 + (top - 1) * stage(time, 0.1, 1.2);
    if (time <= 2.8) return top - (top - bottom) * stage(time, 1.2, 2.8);
    return bottom + (initial - bottom) * stage(time, 2.8, INTRO);
  };
  const {ref, play, playing} = useAnimation({
    duration: INTRO,
    onFrame: (time) => setK(Math.round(introK(time) * 100) / 100),
  });

  const kv = [k * v[0], k * v[1]];

  // Registra os alvos alcançados (só quando é o aluno que move o k).
  useEffect(() => {
    if (playing) return;
    const hits = targets.filter((p) => Math.abs(k * v[0] - p[0]) < EPS && Math.abs(k * v[1] - p[1]) < EPS);
    if (!hits.length) return;
    setFound((old) => {
      if (hits.every((p) => old[p.join(',')] !== undefined)) return old;
      const next = {...old};
      hits.forEach((p) => {
        next[p.join(',')] = k;
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, playing]);

  // k·v primeiro e v por cima, tracejado: quando as duas setas se
  // sobrepõem, o tracejado azul continua visível.
  const segments = [];
  const labels = [];
  if (Math.abs(k) > 0.04) segments.push({from: [0, 0], to: kv, tone: 2, arrow: true});
  segments.push({from: [0, 0], to: v, tone: 1, dashed: true});
  labels.push({at: v, math: '\\vec{v}', tone: 1, dx: v[1] >= 0 ? -6 : 6, dy: -16, fontSize: 13});
  if (Math.abs(k) > 0.04 && Math.abs(k - 1) > EPS) {
    const len = Math.hypot(kv[0], kv[1]) || 1;
    // rótulo além da ponta, do lado de fora da reta
    labels.push({
      at: kv,
      math: kLabel(k),
      tone: 2,
      // Perto de um alvo, o rótulo vai para o outro lado da reta, para não
      // cair em cima do rótulo do alvo durante o passeio do k.
      ...(targets.some((p) => Math.hypot(kv[0] - p[0], kv[1] - p[1]) < 1.5 && Math.abs(p[0] * v[1] - p[1] * v[0]) > EPS)
        ? {dx: -(kv[1] / len) * 22 - 6, dy: -(kv[0] / len) * 14 - 2, anchor: 'end'}
        : {dx: (kv[0] / len) * 26 + 4, dy: -(kv[1] / len) * 18 + 14}),
      fontSize: 13,
    });
  }

  const points = targets.map((p) => ({
    at: p,
    tone: found[p.join(',')] !== undefined ? 3 : 0,
    r: 5,
    open: found[p.join(',')] === undefined,
    label: pairMath(...p),
    dx: p[0] >= 0 ? 30 : -30,
    dy: 4,
  }));
  if (Math.abs(k) <= 0.04) points.push({at: [0, 0], tone: 2, r: 5});

  const partial = targets.filter(
    (p) => Math.abs(kv[0] - p[0]) < EPS && Math.abs(kv[1] - p[1]) > EPS,
  );

  return (
    <div className={shared.wrapper} data-explorer="scale-vector">
      <div ref={ref}>
        <CartesianPlane
          {...win}
          xUnit={xUnit}
          xLabelEvery={labelEvery}
          yLabelEvery={labelEvery}
          axisLabels={['x', 'y']}
          lines={[{through: [[0, 0], v], dashed: true, muted: true}]}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'O tracejado cinza é a reta que passa pela origem na direção de v (azul). A seta laranja é k vezes v. Arraste o k: a seta estica, encolhe ou vira, mas nunca sai da reta.'
          }
        />
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Número k: <strong>{plainNumber(k)}</strong>
          </span>
          <input
            type="range"
            min={kMin}
            max={kMax}
            step={step}
            value={k}
            disabled={playing}
            onChange={(e) => setK(Number(e.target.value))}
            aria-label="Número k que multiplica o vetor v"
            aria-valuetext={plainNumber(k)}
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`${mathNumber(k, 2)}\\vec{v} = (${signedMath(k)} \\times ${signedMath(v[0])},\\ ${signedMath(k)} \\times ${signedMath(v[1])}) = ${pairMath(...kv)}`}
          />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\lVert ${mathNumber(k, 2)}\\vec{v} \\rVert = \\lvert ${mathNumber(k, 2)} \\rvert \\times ${normMath(v)} \\approx ${mathNumber(Math.abs(k) * Math.hypot(...v), 2)}`}
          />
        </p>
        <p>{describe(k)}</p>
        {targets.length > 0 && (
          <p>
            {targets.map((p) => {
              const key = p.join(',');
              const kk = found[key];
              return (
                <span key={key} style={{display: 'block'}}>
                  Alvo <Formula math={pairMath(...p)} />:{' '}
                  {kk !== undefined ? (
                    <>
                      alcançado com <Formula math={`k = ${mathNumber(kk, 2)}`} />.
                    </>
                  ) : (
                    'ainda não alcançado.'
                  )}
                </span>
              );
            })}
            {partial.map((p) => (
              <span key={`p-${p.join(',')}`} style={{display: 'block'}}>
                Com este k, a primeira coordenada bate com a do alvo <Formula math={pairMath(...p)} />, mas a segunda dá{' '}
                <Formula math={mathNumber(kv[1], 2)} />, e não <Formula math={mathNumber(p[1], 2)} />.
              </span>
            ))}
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o passeio do k de novo
        </button>
      </div>
    </div>
  );
}
