import React, {useState} from 'react';
import Formula, {mathNumber} from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import MiniPlane, {Arrow, fullLine, makePlane, toneVar} from '../SpanCombo/plane';

// O teste do subespaço (lição 11.10): as contas escapam do conjunto?
//
// O conjunto candidato aparece como faixa azul. Dois vetores dele, u e v
// (laranja), são escolhidos por deslizantes; a soma u + v e o múltiplo k·u
// (verdes) aparecem com uma bolinha cheia quando caem dentro do conjunto e
// vazada quando escapam. O painel faz as três perguntas da definição: a
// origem está nele? a soma fica? o múltiplo fica?

const near = (a, b) => Math.abs(a - b) < 1e-9;
const n = (x) => mathNumber(x, 2);
// número dentro de uma conta: negativo entre parênteses
const np = (x) => (x < 0 ? `(${n(x)})` : n(x));
// k que multiplica um vetor: 1 e −1 sem o algarismo
const kv = (k) => (Math.abs(k - 1) < 1e-9 ? '' : Math.abs(k + 1) < 1e-9 ? '-' : n(k));
const pair = (p) => {
  const a = n(p[0]);
  const b = n(p[1]);
  return `(${a}${a.includes('{,}') || b.includes('{,}') ? ';' : ','}\\ ${b})`;
};

const SETS = [
  {
    key: 'reta',
    label: 'Reta y = 2x',
    tex: 'y = 2x',
    u: (a) => [a, 2 * a],
    v: (b) => [b, 2 * b],
    has: (p) => near(p[1], 2 * p[0]),
    check: (p) => `2 \\times ${np(p[0])} = ${n(2 * p[0])}${near(p[1], 2 * p[0]) ? '' : `,\\ \\text{e não}\\ ${n(p[1])}`}`,
    lines: [{at: [0, 0], d: [1, 2]}],
    init: [1, 2, -1],
    names: ['a', 'b'],
    range: [-2, 2],
  },
  {
    key: 'deslocada',
    label: 'Reta y = 2x + 2',
    tex: 'y = 2x + 2',
    u: (a) => [a, 2 * a + 2],
    v: (b) => [b, 2 * b + 2],
    has: (p) => near(p[1], 2 * p[0] + 2),
    check: (p) => `2 \\times ${np(p[0])} + 2 = ${n(2 * p[0] + 2)}${near(p[1], 2 * p[0] + 2) ? '' : `,\\ \\text{e não}\\ ${n(p[1])}`}`,
    lines: [{at: [0, 2], d: [1, 2]}],
    init: [1, -1, -1],
    names: ['a', 'b'],
    range: [-2, 2],
  },
  {
    key: 'eixos',
    label: 'Os dois eixos juntos',
    tex: '\\text{eixo } x \\text{ ou eixo } y',
    u: (a) => [a, 0],
    v: (b) => [0, b],
    has: (p) => near(p[0], 0) || near(p[1], 0),
    check: (p) =>
      near(p[0], 0) || near(p[1], 0)
        ? `\\text{uma coordenada é}\\ 0`
        : `\\text{nenhuma coordenada é}\\ 0`,
    lines: [
      {at: [0, 0], d: [1, 0]},
      {at: [0, 0], d: [0, 1]},
    ],
    init: [2, 3, 2],
    names: ['a', 'b'],
    range: [-3, 3],
  },
];

export default function SubspaceClosure({initial = 0, caption}) {
  const [si, setSi] = useState(initial);
  const S = SETS[si];
  const [vals, setVals] = useState(SETS[initial].init);
  const [a, b, k] = vals;
  const u = S.u(a);
  const v = S.v(b);
  const sum = [u[0] + v[0], u[1] + v[1]];
  const ku = [k * u[0], k * u[1]];
  const originIn = S.has([0, 0]);
  const sumIn = S.has(sum);
  const kuIn = S.has(ku);

  const pl = makePlane({xMin: -4.5, xMax: 4.5, yMin: -4.5, yMax: 8.5}, 26);
  const inWin = (p) => p[0] >= pl.xMin && p[0] <= pl.xMax && p[1] >= pl.yMin && p[1] <= pl.yMax;

  const clipped = (
    <>
      {S.lines.map((ln, i) => {
        const [p, q] = fullLine(pl, ln.at, ln.d);
        return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={toneVar(1)} strokeWidth={8} strokeOpacity={0.28} />;
      })}
      {/* paralelogramo da soma */}
      <line x1={pl.X(u[0])} y1={pl.Y(u[1])} x2={pl.X(sum[0])} y2={pl.Y(sum[1])} stroke="var(--mv-guide)" strokeWidth={1.2} strokeDasharray="5 4" />
      <line x1={pl.X(v[0])} y1={pl.Y(v[1])} x2={pl.X(sum[0])} y2={pl.Y(sum[1])} stroke="var(--mv-guide)" strokeWidth={1.2} strokeDasharray="5 4" />
      <Arrow pl={pl} from={[0, 0]} to={ku} tone={3} width={2} dashed />
      <Arrow pl={pl} from={[0, 0]} to={sum} tone={3} width={2.6} />
      <Arrow pl={pl} from={[0, 0]} to={u} tone={2} width={2.6} />
      <Arrow pl={pl} from={[0, 0]} to={v} tone={2} width={2.6} />
    </>
  );

  const dot = (p, inside, key) =>
    inWin(p) ? (
      <circle key={key} cx={pl.X(p[0])} cy={pl.Y(p[1])} r={5.5} fill={inside ? toneVar(3) : 'var(--ifm-background-surface-color)'} stroke={toneVar(3)} strokeWidth={2.2} />
    ) : null;

  const tag = (p, math, tone, dx, dy) =>
    inWin(p) ? <SvgMath x={pl.X(p[0]) + dx} y={pl.Y(p[1]) + dy} math={math} fontSize={13} tone={tone} halo /> : null;
  const side = (p) => (p[0] >= 0 ? 22 : -22);

  const over = (
    <>
      <circle cx={pl.X(0)} cy={pl.Y(0)} r={5.5} fill={originIn ? 'var(--ifm-font-color-base)' : 'var(--ifm-background-surface-color)'} stroke="var(--ifm-font-color-base)" strokeWidth={2} />
      {dot(sum, sumIn, 's')}
      {dot(ku, kuIn, 'k')}
      {tag(u, '\\vec{u}', 2, side(u), -16)}
      {tag(v, '\\vec{v}', 2, side(v), -16)}
      {tag(sum, '\\vec{u} + \\vec{v}', 3, side(sum) * 1.6, -12)}
      {!near(k, 1) && !near(k, 0) && tag(ku, `${kv(k)}\\vec{u}`, 3, side(ku) * 1.4, 12)}
    </>
  );

  const yesNo = (ok) => <strong style={{color: ok ? toneVar(3) : toneVar(2)}}>{ok ? 'sim' : 'não'}</strong>;
  const failed = !originIn || !sumIn || !kuIn;

  return (
    <div className={shared.wrapper} data-explorer="subspace-closure">
      <figure style={{margin: '0 0 1rem'}}>
        <MiniPlane pl={pl} ticksEvery={2} clipped={clipped} over={over} ariaLabel={caption} maxWidth={320} />
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.buttons} style={{marginBottom: '0.8rem'}}>
        {SETS.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={i === si}
            onClick={() => {
              setSi(i);
              setVals(s.init);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={shared.controls}>
        {[0, 1].map((i) => (
          <label key={i} className={shared.control}>
            <span>
              Vetor <Formula math={i === 0 ? '\\vec{u}' : '\\vec{v}'} /> do conjunto:{' '}
              <Formula math={pair(i === 0 ? u : v)} />
            </span>
            <input
              type="range"
              min={S.range[0]}
              max={S.range[1]}
              step={0.5}
              value={vals[i]}
              onChange={(e) => {
                const x = Number(e.target.value);
                setVals((old) => old.map((y, j) => (j === i ? x : y)));
              }}
              aria-label={i === 0 ? 'Posição do vetor u no conjunto' : 'Posição do vetor v no conjunto'}
            />
          </label>
        ))}
        <label className={shared.control}>
          <span>
            Número <Formula math="k" /> que multiplica <Formula math="\vec{u}" />: <strong>{n(k).replace('{,}', ',').replace('-', '−')}</strong>
          </span>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.5}
            value={k}
            onChange={(e) => {
              const x = Number(e.target.value);
              setVals((old) => [old[0], old[1], x]);
            }}
            aria-label="Número k"
          />
        </label>
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Conjunto: <Formula math={S.tex} />.
        </p>
        <p>1. A origem está no conjunto? {yesNo(originIn)}.</p>
        <p className={shared.formula}>
          2. A soma <Formula math={`\\vec{u} + \\vec{v} = ${pair(sum)}`} /> fica no conjunto? {yesNo(sumIn)} (<Formula math={S.check(sum)} />).
        </p>
        <p className={shared.formula}>
          3. O múltiplo <Formula math={`${kv(k)}\\vec{u} = ${pair(ku)}`} /> fica no conjunto? {yesNo(kuIn)} (<Formula math={S.check(ku)} />).
        </p>
        <p>
          {failed
            ? 'Uma das três perguntas deu “não”: este conjunto não é um subespaço. Um único caso que escapa já derruba o conjunto.'
            : 'Com estes vetores, as três respostas deram “sim”. Para ser subespaço, isso precisa valer para quaisquer vetores do conjunto: mexa nos deslizantes e procure um caso que escapa.'}
        </p>
      </div>
    </div>
  );
}
