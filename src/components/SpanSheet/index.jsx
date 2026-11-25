import React, {useEffect, useMemo, useState} from 'react';
import SpaceScene, {add, times, triple} from '../SpaceScene';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Três vetores numa mesma folha não saem dela (lição 11.5).
//
// As bases da loja de tintas como setas no espaço, com um eixo por pigmento:
// x = ciano, y = magenta, z = amarelo. As setas p = (2, 1, 0) e q = (0, 1, 2)
// deitam numa folha plana pela origem (o pedaço cinza). A terceira base é
// r = (2, 3, 4) = p + 2q, que está na mesma folha, ou s = (1, 0, 1), que não
// está.
//
// A ponta da mistura a·p + b·q + c·(r ou s) é desenhada como caminho: a·p,
// depois b·q, depois c·r. Ao entrar na tela, a figura testa uma grade de
// receitas e deixa um ponto em cada ponta; depois gira a cena até ver a folha
// de perfil (ela vira uma linha, e com r todos os pontos caem nela) e volta.
// O aluno gira a cena com o deslizante e pode pedir a vista de perfil.
//
// A vista de perfil: a cena gira em torno do eixo z de um ângulo θ. O papel
// apaga a direção (1; 0,5; 0,25) da cena girada. A folha tem normal
// (1, −2, 1); girada de θ, ela fica paralela à direção apagada quando
// 2,5 sen θ + 0,25 = 0, isto é, sen θ = −0,1 e θ ≈ −5,74°.

const P = [2, 1, 0];
const Q = [0, 1, 2];
const THIRD = {R: {v: [2, 3, 4], tex: '\\vec{r}'}, S: {v: [1, 0, 1], tex: '\\vec{s}'}};
const EDGE = (Math.asin(-0.1) * 180) / Math.PI;
const VIEW0 = 40;
const MAX = 1;
const STEP = 0.25;
const VERDE = [4, 5, 6];
const LARANJA = [1, 0, 1];
const FOOT = [2 / 3, 2 / 3, 2 / 3]; // pé da perpendicular do laranja até a folha

const grid = [];
for (let a = 0; a <= MAX + 1e-9; a += STEP) for (let b = 0; b <= MAX + 1e-9; b += STEP) for (let c = 0; c <= MAX + 1e-9; c += STEP) grid.push([a, b, c]);

const combo = (coef, third) => add(add(times(coef[0], P), times(coef[1], Q)), times(coef[2], THIRD[third].v));
const VIEWS = [-30, -15, EDGE, 0, 15, 30, 45, 60, 75, 90];
const FRAME = [
  [0, 0, 0],
  times(2.2, P),
  add(times(2.2, P), times(3.2, Q)),
  times(3.2, Q),
  combo([1, 1, 1], 'R'),
  combo([1, 1, 1], 'S'),
  [0, 0, 3.6],
];

export default function SpanSheet({initialBases = 'R', initial = [1, 1, 0.5], profile = false, caption}) {
  const home = profile ? EDGE : VIEW0;
  const [third, setThird] = useState(initialBases);
  const [coef, setCoef] = useState(initial);
  const [view, setView] = useState(home);
  const [trail, setTrail] = useState([]);

  const duration = 6;
  const {ref, t, play, playing} = useAnimation({duration});
  const dotsShown = Math.round(grid.length * stage(t, 0.2, 2.2));
  const toEdge = stage(t, 2.5, 3.7);
  const back = stage(t, 4.6, 5.8);
  const animView = VIEW0 + (EDGE - VIEW0) * toEdge + (home - EDGE) * back;
  const shownView = t < duration ? animView : view;

  const sweepDots = useMemo(() => grid.map((g) => combo(g, third)), [third]);
  const tip = combo(coef, third);
  const A = times(coef[0], P);
  const B = add(A, times(coef[1], Q));

  useEffect(() => {
    setTrail((old) => [...old.slice(-200), tip]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coef[0], coef[1], coef[2], third]);

  const items = [
    {type: 'poly', pts: [[0, 0, 0], times(2.2, P), add(times(2.2, P), times(3.2, Q)), times(3.2, Q)], tone: 0, fill: 0.12, stroke: true, opacity: 0.8},
  ];
  sweepDots.slice(0, dotsShown).forEach((d) => items.push({type: 'point', at: d, tone: 0, r: 2.8, opacity: 0.7}));
  trail.forEach((d) => items.push({type: 'point', at: d, tone: 0, r: 2.8, opacity: 0.7}));
  if (third === 'R') items.push({type: 'line', from: LARANJA, to: FOOT, dashed: true, tone: 0});
  items.push(
    {type: 'arrow', from: [0, 0, 0], to: A, tone: 1},
    {type: 'arrow', from: A, to: B, tone: 2},
    {type: 'arrow', from: B, to: tip, tone: 3},
    {type: 'arrow', from: [0, 0, 0], to: tip, tone: 0, dashed: true},
    // perto do perfil, o rótulo à esquerda cobriria o rótulo do eixo do amarelo
    shownView < 15
      ? {type: 'point', at: VERDE, tone: 0, r: 5, math: '\\text{verde-musgo}', dx: 10, dy: -10, anchor: 'start'}
      : {type: 'point', at: VERDE, tone: 0, r: 5, math: '\\text{verde-musgo}', dx: -10, dy: -14, anchor: 'end'},
    {type: 'point', at: LARANJA, tone: 0, r: 5, math: '\\text{laranja}', dx: -34, dy: -10},
    {type: 'label', at: [0, 0, 0], math: 'O', dx: -10, dy: 12, size: 12},
  );
  if (coef[0] > 0.3) items.push({type: 'label', at: times(0.5, A), math: `${mathNumber(coef[0], 2)}\\vec{p}`, tone: 1, dy: 16});
  if (coef[1] > 0.3) items.push({type: 'label', at: add(A, times(0.5 * coef[1], Q)), math: `${mathNumber(coef[1], 2)}\\vec{q}`, tone: 2, dx: 26});
  if (coef[2] > 0.3) items.push({type: 'label', at: add(B, times(0.5 * coef[2], THIRD[third].v)), math: `${mathNumber(coef[2], 2)}${THIRD[third].tex}`, tone: 3, dx: -30});

  const mean = (tip[0] + tip[2]) / 2;
  const onSheet = Math.abs(mean - tip[1]) < 1e-9;
  const n = (x) => mathNumber(x, 2);
  const letters = ['a', 'b', 'c'];
  const vecTex = ['\\vec{p}', '\\vec{q}', THIRD[third].tex];

  return (
    <div className={shared.wrapper} data-explorer="span-sheet">
      <div ref={ref}>
        <SpaceScene
          items={items}
          view={shownView}
          frame={FRAME}
          frameViews={VIEWS}
          unit={30}
          axes={{max: [3, 4, 4]}}
          axisLabels={['\\text{ciano}', '\\text{magenta}', '\\text{amarelo}']}
          caption={
            caption ??
            'O pedaço cinza é parte da folha plana de p e q, que passa pela origem. Cada ponto é a ponta de uma receita testada. A seta tracejada vai da origem até a ponta da mistura escolhida nos controles.'
          }
        />
      </div>

      <div className={shared.controls}>
        {coef.map((c, i) => (
          <label key={i} className={shared.control}>
            <span>
              Litros de <Formula math={vecTex[i]} />: <strong>{letters[i]} = {n(c).replace('{,}', ',')}</strong>
            </span>
            <input
              type="range"
              min={0}
              max={MAX}
              step={STEP}
              value={c}
              disabled={playing}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCoef((old) => old.map((x, j) => (j === i ? value : x)));
              }}
              aria-label={`Coeficiente ${letters[i]}`}
            />
          </label>
        ))}
        <label className={shared.control}>
          <span>
            Girar a cena: <strong>{String(Math.round(shownView)).replace('-', '−')}°</strong>
          </span>
          <input
            type="range"
            min={-30}
            max={90}
            step={1}
            value={Math.round(view)}
            disabled={playing}
            onChange={(e) => setView(Number(e.target.value))}
            aria-label="Giro da cena em torno do eixo do amarelo"
          />
        </label>
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`${n(coef[0])}\\vec{p} + ${n(coef[1])}\\vec{q} + ${n(coef[2])}${THIRD[third].tex} = ${triple(tip)}`} />
        </p>
        <p className={shared.formula}>
          Média do ciano com o amarelo: <Formula math={`\\frac{${n(tip[0])} + ${n(tip[2])}}{2} = ${n(mean)}`} />. Magenta:{' '}
          <Formula math={n(tip[1])} />. {onSheet ? 'São iguais: a ponta está na folha.' : 'São diferentes: a ponta saiu da folha.'}
        </p>
      </div>

      <div className={shared.buttons}>
        <button type="button" disabled={playing} onClick={() => setView(EDGE)}>
          Ver a folha de perfil
        </button>
        <button type="button" disabled={playing} onClick={() => setView(VIEW0)}>
          Voltar à vista inicial
        </button>
        <button
          type="button"
          disabled={playing}
          aria-pressed={third === 'S'}
          onClick={() => {
            setThird((old) => (old === 'R' ? 'S' : 'R'));
            setTrail([]);
            setView(home);
            play();
          }}
        >
          {third === 'R' ? 'Trocar R por S = (1, 0, 1)' : 'Voltar para R = (2, 3, 4)'}
        </button>
        <button type="button" disabled={playing} onClick={() => setTrail([])}>
          Apagar o rastro
        </button>
        <button type="button" disabled={playing} onClick={() => play()}>
          Testar a grade de novo
        </button>
      </div>
    </div>
  );
}
