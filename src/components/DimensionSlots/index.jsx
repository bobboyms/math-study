import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import SpaceScene, {add, times, triple, tex, pointBox} from '../SpaceScene';

// Dimensão: quantos números bastam para dizer onde está um ponto (lição 11.10).
//
// Quatro subespaços de R³: só a origem, uma reta pela origem, o plano
// x + z = 2y da loja de tintas e o espaço inteiro. Cada um vem com uma base
// (setas nos tons 1, 2 e 3) e um deslizante por vetor da base: o número de
// deslizantes é a dimensão. O ponto é montado como caminho, um trecho por
// vetor da base, e o painel compara o endereço na base com as três
// coordenadas comuns.

const P = [2, 1, 0];
const Q = [0, 1, 2];

const MODES = [
  {
    key: 'zero',
    label: 'Só a origem',
    basis: [],
    names: [],
    init: [],
    range: [0, 0],
    region: [],
    what: '\\{\\vec{0}\\}',
  },
  {
    key: 'reta',
    label: 'Uma reta pela origem',
    basis: [P],
    names: ['\\vec{p}'],
    init: [1],
    range: [-1, 1.5],
    region: [{type: 'line', from: times(-1.2, P), to: times(1.7, P), tone: 0, width: 5, opacity: 0.35}],
    what: '\\text{a reta gerada por}\\ \\vec{p} = (2,\\ 1,\\ 0)',
  },
  {
    key: 'plano',
    label: 'O plano x + z = 2y',
    basis: [P, Q],
    names: ['\\vec{p}', '\\vec{q}'],
    init: [0.5, 0.5],
    range: [-0.5, 1.5],
    region: [
      {
        type: 'poly',
        pts: [
          add(times(-0.5, P), times(-0.5, Q)),
          add(times(1.5, P), times(-0.5, Q)),
          add(times(1.5, P), times(1.5, Q)),
          add(times(-0.5, P), times(1.5, Q)),
        ],
        tone: 0,
        fill: 0.22,
        stroke: true,
      },
    ],
    what: '\\text{o plano}\\ x + z = 2y',
  },
  {
    key: 'espaco',
    label: 'O espaço inteiro',
    basis: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    names: ['\\vec{e}_1', '\\vec{e}_2', '\\vec{e}_3'],
    init: [2, 2, 2],
    range: [0, 3],
    region: [],
    what: '\\mathbb{R}^3',
  },
];

const WORDS = ['nenhum número', 'um número', 'dois números', 'três números'];

export default function DimensionSlots({initial = 2, caption}) {
  const [mi, setMi] = useState(initial);
  const M = MODES[mi];
  const [coef, setCoef] = useState(MODES[initial].init);
  const dim = M.basis.length;
  const duration = 2.2;
  const {ref, t, play, playing} = useAnimation({duration});

  // caminho: um trecho por vetor da base, um depois do outro
  const items = [...M.region];
  let tip = [0, 0, 0];
  M.basis.forEach((b, i) => {
    const s = stage(t, 0.3 + (i * 1.6) / Math.max(dim, 1), 0.3 + ((i + 1) * 1.6) / Math.max(dim, 1));
    const step = times(coef[i] * s, b);
    const next = add(tip, step);
    if (Math.hypot(...step) > 1e-6) items.push({type: 'arrow', from: tip, to: next, tone: i + 1, opacity: 0.95});
    tip = next;
  });
  if (M.key === 'espaco' && t >= duration - 0.01) items.push(...pointBox(tip, {opacity: 0.6}));
  // a base, saindo da origem, mais fina
  M.basis.forEach((b, i) => {
    items.push({
      type: 'arrow',
      from: [0, 0, 0],
      to: b,
      tone: i + 1,
      opacity: 0.65,
      math: M.names[i],
      dx: [8, -16, -14][i],
      dy: [16, -6, -8][i],
    });
  });
  items.push({type: 'point', at: tip, tone: 0, r: 5.5});

  const done = t >= duration - 0.01;
  const point = M.basis.reduce((acc, b, i) => add(acc, times(coef[i], b)), [0, 0, 0]);

  return (
    <div className={shared.wrapper} data-explorer="dimension-slots">
      <div ref={ref}>
        <SpaceScene
          items={items}
          unit={44}
          view={35}
          axes={{max: [3, 3, 3]}}
          frame={[
            [3, 3, 3],
            [-1, -1, -1],
            [3, 1, -1],
            [-1, 1, 3],
            [-2.4, -1.2, 0],
            [3.4, 1.7, 0],
          ]}
          maxWidth={360}
          caption={caption}
        />
      </div>

      <div className={shared.buttons} style={{marginBottom: '0.8rem'}}>
        {MODES.map((m, i) => (
          <button
            key={m.key}
            type="button"
            aria-pressed={i === mi}
            disabled={playing}
            onClick={() => {
              setMi(i);
              setCoef(m.init);
              play();
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className={shared.controls}>
        {M.basis.map((b, i) => (
          <label key={`${M.key}${i}`} className={shared.control}>
            <span>
              Quanto de <Formula math={M.names[i]} />: <strong>{tex(coef[i]).replace('{,}', ',').replace('-', '−')}</strong>
            </span>
            <input
              type="range"
              min={M.range[0]}
              max={M.range[1]}
              step={M.key === 'espaco' ? 0.5 : 0.25}
              value={coef[i]}
              disabled={playing}
              onChange={(e) => {
                const x = Number(e.target.value);
                setCoef((old) => old.map((y, j) => (j === i ? x : y)));
              }}
              aria-label={`Coeficiente de ${M.names[i]}`}
            />
          </label>
        ))}
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Conjunto: <Formula math={M.what} />. Deslizantes: <strong>{dim}</strong>, um por vetor da base.
        </p>
        {dim === 0 ? (
          <p>
            O único ponto é a origem. Para dizer onde ele está, não é preciso dar {WORDS[0]}: a dimensão é <strong>0</strong>.
          </p>
        ) : (
          <>
            <p className={shared.formula}>
              Endereço na base, {WORDS[dim]}: <Formula math={dim === 1 ? tex(coef[0]) : `(${coef.map((c) => tex(c)).join(coef.some((c) => !Number.isInteger(c)) ? ';\\ ' : ',\\ ')})`} />
            </p>
            <p className={shared.formula}>
              Coordenadas comuns, três números: <Formula math={triple(point)} />
            </p>
            {done && (
              <p>
                Dimensão {dim}: com {WORDS[dim]} se chega a qualquer ponto deste conjunto, e com menos não se chega.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
