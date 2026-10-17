import React, {useState} from 'react';
import GeoFigure from '../GeoFigure';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from './styles.module.css';

// Um retângulo com um entalhe retangular recortado do lado de cima, no canto
// (vira um L) ou no meio (vira um U). Dois deslizantes mudam a largura e a
// profundidade do entalhe; dois botões trocam o desenho entre a decomposição
// por soma e a por diferença.
//
// É interativo porque mexer no entalhe É a ideia: ver que as duas
// decomposições dão sempre o mesmo número, que a área e o perímetro mudam de
// forma independente, e que somar os perímetros dos pedaços erra sempre pelo
// dobro da linha de corte.
//
// Todos os números vêm das medidas atuais — o painel não tem como discordar
// do desenho.

const STEP = 0.5;
const n = (value) => mathNumber(value, 2);
const t = (value) => n(value).replace('{,}', ',');

export default function CompositeAreaExplorer({
  width = 6,
  height = 4,
  initialNotchWidth = 2,
  initialNotchDepth = 1.5,
  initialPosition = 'corner',
}) {
  const [w, setW] = useState(initialNotchWidth);
  const [h, setH] = useState(initialNotchDepth);
  const [position, setPosition] = useState(initialPosition);
  const [view, setView] = useState('sum');

  const W = width;
  const H = height;
  const middle = position === 'middle';
  // No meio, cada perna precisa de pelo menos meio metro.
  const maxW = middle ? W - 2 * STEP : W - STEP;
  const notchW = Math.min(w, maxW);
  const leg = middle ? (W - notchW) / 2 : W - notchW;
  const low = H - h;

  const x0 = middle ? leg : W - notchW;
  const x1 = x0 + notchW;
  const notch = [[x0, low], [x1, low], [x1, H], [x0, H]];

  const shape = middle
    ? [[0, 0], [W, 0], [W, H], [x1, H], [x1, low], [x0, low], [x0, H], [0, H]]
    : [[0, 0], [W, 0], [W, low], [x0, low], [x0, H], [0, H]];

  const bottom = [[0, 0], [W, 0], [W, low], [0, low]];
  const legs = middle
    ? [
        [[0, low], [leg, low], [leg, H], [0, H]],
        [[x1, low], [W, low], [W, H], [x1, H]],
      ]
    : [[[0, low], [leg, low], [leg, H], [0, H]]];
  const cuts = middle
    ? [{from: [0, low], to: [leg, low]}, {from: [x1, low], to: [W, low]}]
    : [{from: [0, low], to: [leg, low]}];
  const cutLength = middle ? 2 * leg : leg;

  const polygons =
    view === 'sum'
      ? [
          {points: bottom, tone: 1},
          ...legs.map((points) => ({points, tone: 2})),
        ]
      : [
          {points: shape, tone: 1},
          {points: notch, tone: 2, fill: false},
        ];

  const segments =
    view === 'sum'
      ? cuts.map((cut) => ({...cut, tone: 3, dashed: true}))
      : [];

  const dims = [
    {from: [0, 0], to: [W, 0], label: `${n(W)}\\text{ m}`, offset: 22, tone: 0},
    {from: [0, H], to: [0, 0], label: `${n(H)}\\text{ m}`, offset: 22, tone: 0},
    {from: [x0, H], to: [x1, H], label: n(notchW), offset: -20, tone: 2},
    {from: [x1, H], to: [x1, low], label: n(h), offset: 20, tone: 2},
  ];

  const bigArea = W * H;
  const notchArea = notchW * h;
  const area = bigArea - notchArea;
  const bottomArea = W * low;
  const legArea = leg * h;

  const sumFormula = middle
    ? `${n(W)} \\times ${n(low)} + 2 \\times (${n(leg)} \\times ${n(h)}) = ${n(bottomArea)} + ${n(2 * legArea)} = ${n(area)}`
    : `${n(W)} \\times ${n(low)} + ${n(leg)} \\times ${n(h)} = ${n(bottomArea)} + ${n(legArea)} = ${n(area)}`;
  const diffFormula = `${n(W)} \\times ${n(H)} - ${n(notchW)} \\times ${n(h)} = ${n(bigArea)} - ${n(notchArea)} = ${n(area)}`;

  // Perímetro percorrendo a borda, lado a lado, no sentido anti-horário a
  // partir do canto de baixo à esquerda.
  const sides = middle
    ? [W, H, leg, h, notchW, h, leg, H]
    : [W, low, notchW, h, leg, H];
  const perimeter = sides.reduce((s, x) => s + x, 0);
  const pieces = middle
    ? [2 * (W + low), 2 * (leg + h), 2 * (leg + h)]
    : [2 * (W + low), 2 * (leg + h)];
  const piecesSum = pieces.reduce((s, x) => s + x, 0);
  const fullPerimeter = 2 * (W + H);

  return (
    <div className={shared.wrapper} data-explorer="composite-area">
      <div className={styles.toggles}>
        <div className={shared.buttons} role="group" aria-label="Posição do entalhe">
          <button
            type="button"
            className={!middle ? styles.active : undefined}
            aria-pressed={!middle}
            onClick={() => setPosition('corner')}
          >
            Entalhe no canto (L)
          </button>
          <button
            type="button"
            className={middle ? styles.active : undefined}
            aria-pressed={middle}
            onClick={() => setPosition('middle')}
          >
            Entalhe no meio (U)
          </button>
        </div>
        <div className={shared.buttons} role="group" aria-label="Decomposição desenhada">
          <button
            type="button"
            className={view === 'sum' ? styles.active : undefined}
            aria-pressed={view === 'sum'}
            onClick={() => setView('sum')}
          >
            Desenhar a soma
          </button>
          <button
            type="button"
            className={view === 'diff' ? styles.active : undefined}
            aria-pressed={view === 'diff'}
            onClick={() => setView('diff')}
          >
            Desenhar a diferença
          </button>
        </div>
      </div>

      <GeoFigure
        unit={44}
        padding={50}
        bounds={[0, 0, W, H]}
        polygons={polygons}
        segments={segments}
        dims={dims}
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          <strong>Área por soma</strong> (pedaços sem sobreposição):
        </p>
        <div className={shared.formula}>
          <Formula math={sumFormula} />
        </div>
        <p>
          <strong>Área por diferença</strong> (retângulo cheio menos o entalhe):
        </p>
        <div className={shared.formula}>
          <Formula math={diffFormula} />
        </div>
        <p>
          <strong>Perímetro</strong>, percorrendo a borda lado a lado:
        </p>
        <div className={shared.formula}>
          <Formula math={`${sides.map(n).join(' + ')} = ${n(perimeter)}`} />
        </div>
        <p className={styles.note}>
          {middle
            ? `O retângulo cheio tem perímetro ${t(fullPerimeter)} m. No meio do lado, o fundo do entalhe repõe o trecho de borda retirado de cima, mas as duas paredes de ${t(h)} m são borda nova: ${t(fullPerimeter)} + 2 × ${t(h)} = ${t(perimeter)} m.`
            : `O retângulo cheio também tem perímetro ${t(fullPerimeter)} m. No canto, os dois lados novos do entalhe repõem exatamente os dois trechos de borda retirados.`}
        </p>
        <p className={styles.warning}>
          Somar os perímetros dos pedaços daria {t(piecesSum)} m: {t(piecesSum - perimeter)} m a
          mais, o dobro da linha de corte, que mede {t(cutLength)} m e não é borda.
        </p>
      </div>

      <div className={shared.parameterGrid}>
        <label className={shared.control}>
          <span>Largura do entalhe: {t(notchW)} m</span>
          <input
            type="range"
            min={STEP}
            max={maxW}
            step={STEP}
            value={notchW}
            onChange={(event) => setW(Number(event.target.value))}
            aria-label="Largura do entalhe"
          />
        </label>
        <label className={shared.control}>
          <span>Profundidade do entalhe: {t(h)} m</span>
          <input
            type="range"
            min={STEP}
            max={H - STEP}
            step={STEP}
            value={h}
            onChange={(event) => setH(Number(event.target.value))}
            aria-label="Profundidade do entalhe"
          />
        </label>
      </div>
    </div>
  );
}
