import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import {at, dec, pairTex, signed, windowRange} from '../mathviz/lineParam';

// A reta como caminhada (lição 7.33, Retas com vetores).
//
// Ao aparecer, o ponto sai de A e dá `steps` passos iguais ao vetor diretor,
// deixando uma cópia da seta em cada passo. Depois, o deslizante escolhe o
// número de passos t, que pode ser fracionário ou negativo. Os passos para a
// frente saem em azul; os passos para trás (t negativo), em laranja.
//
// O botão "Só t ≥ 0" mostra o contraexemplo da semirreta: sem os passos
// negativos, a caminhada cobre só metade da reta.

const box = (p) => [p.xMin, p.xMax, p.yMin, p.yMax];

export default function LineWalker({
  A = [1, 2],
  d = [2, 1],
  xMin = -4,
  xMax = 10,
  yMin = -1,
  yMax = 7,
  xUnit = 30,
  tMin = -2,
  tMax = 4,
  step = 0.5,
  steps = 3,
  initial,
  marks = [-1, 0, 1, 2, 3, 4],
  caption,
}) {
  const [t, setT] = useState(initial ?? steps);
  const [half, setHalf] = useState(false);
  const duration = 0.4 + steps * 1;
  const anim = useAnimation({duration});
  const {ref, playing} = anim;

  // Durante a animação, o ponto anda de passo em passo, de 0 até `steps`,
  // com uma pequena parada em cada ponto inteiro.
  let shownT = t;
  if (playing) {
    const s = Math.max(0, anim.t - 0.4);
    const i = Math.min(steps - 1, Math.floor(s));
    shownT = i + ease(Math.min(1, (s - i) / 0.75));
  }
  const P = at(A, d, shownT);
  const range = windowRange(A, d, box({xMin, xMax, yMin, yMax}));

  const lines = [];
  const segments = [];
  if (half) {
    // Semirreta: de A até a borda, no sentido de d.
    segments.push({from: A, to: at(A, d, range[1]), muted: true, dashed: true});
  } else {
    lines.push({through: [A, at(A, d, 1)], muted: true, dashed: true});
  }

  // Os passos: uma seta por passo inteiro e um pedaço de seta para a fração.
  // Para a frente (t positivo) em azul; para trás (t negativo) em laranja, com
  // a ponta apontando para trás.
  const sign = shownT < 0 ? -1 : 1;
  const whole = Math.floor(Math.abs(shownT) + 1e-9);
  const tone = sign > 0 ? 1 : 2;
  for (let j = 0; j < whole; j += 1) {
    segments.push({from: at(A, d, sign * j), to: at(A, d, sign * (j + 1)), tone, arrow: true});
  }
  if (Math.abs(shownT) - whole > 1e-6) {
    segments.push({from: at(A, d, sign * whole), to: P, tone, arrow: true});
  }
  if (sign > 0 && whole > 0) {
    // O primeiro passo leva o nome do vetor diretor.
    const first = segments.find((seg) => seg.tone === 1);
    Object.assign(first, {label: '\\vec{d}', dx: -8, dy: -16});
  } else {
    // Sem passo inteiro para a frente, a seta d de referência aparece em cinza.
    segments.push({from: A, to: at(A, d, 1), muted: true, tone: 1, arrow: true, label: '\\vec{d}', dx: -8, dy: -16});
  }

  const shownMarks = marks.filter((m) => !half || m >= 0);
  const points = shownMarks.map((m) => ({
    at: at(A, d, m),
    tone: 1,
    r: 3,
    label: `${m}`,
    dx: 0,
    dy: 18,
    fontSize: 12,
  }));
  points.push({at: A, tone: 1, r: 4.5, label: 'A', dx: -14, dy: -12});
  points.push({at: P, tone: 2, r: 6, label: playing ? undefined : 'P', dx: 12, dy: -14});

  const tTex = dec(t, 1);
  const tip = at(A, d, t);
  const minT = half ? 0 : tMin;

  return (
    <div className={shared.wrapper} data-explorer="line-walker">
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={xUnit}
          axisLabels={['x', 'y']}
          lines={lines}
          segments={segments}
          points={points}
          caption={caption}
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {playing ? (
          <p>Cada passo é o mesmo deslocamento <Formula math={`\\vec{d} = ${pairTex(d[0], d[1])}`} />.</p>
        ) : (
          <>
            <p>
              Os números pequenos embaixo dos pontos contam os passos. Com <Formula math={`t = ${tTex}`} /> passos:
            </p>
            <p className={shared.formula}>
              <Formula
                math={`P = A + t\\vec{d} = ${pairTex(A[0], A[1])} + ${signed(t)} \\times ${pairTex(d[0], d[1])} = ${pairTex(tip[0], tip[1])}`}
              />
            </p>
            <p>
              {t < 0
                ? 'Com t negativo, os passos laranja andam ao contrário de d: o ponto fica antes da partida.'
                : t === 0
                  ? 'Com t = 0, nenhum passo foi dado: P é o próprio A.'
                  : t % 1 === 0
                    ? `${dec(t, 0)} ${t === 1 ? 'passo inteiro' : 'passos inteiros'}: ${t === 1 ? 'uma cópia' : `${dec(t, 0)} cópias`} de d, uma atrás da outra.`
                    : 'Com t fracionário, o ponto para no meio de um passo.'}
              {half && ' Só t ≥ 0: a parte da reta antes de A sumiu. Sobrou uma semirreta.'}
            </p>
          </>
        )}
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Número de passos: t = {tTex.replace('{,}', ',').replace('-', '−')}</span>
          <input
            type="range"
            min={minT}
            max={tMax}
            step={step}
            value={t}
            disabled={playing}
            onChange={(e) => setT(Number(e.target.value))}
            aria-label="Número de passos t"
          />
        </label>
      </div>
      <div className={shared.buttons}>
        <button
          type="button"
          onClick={() => {
            const next = !half;
            setHalf(next);
            if (next && t < 0) setT(0);
          }}
          disabled={playing}
        >
          {half ? 'Todos os valores de t' : 'Só t ≥ 0'}
        </button>
        <button
          type="button"
          onClick={() => {
            setT(steps);
            anim.play();
          }}
          disabled={playing}
        >
          Ver a caminhada de novo
        </button>
      </div>
    </div>
  );
}
