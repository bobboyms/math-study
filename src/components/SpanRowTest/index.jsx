import React, {useState} from 'react';
import Formula, {mathNumber} from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import MiniPlane, {Arrow, fullLine, makePlane, toneVar} from '../SpanCombo/plane';

// O alvo é alcançável? A resposta do escalonamento (lição 11.5).
//
// Os dois vetores u e v são as colunas da matriz aumentada [u v | alvo]. A
// operação L2 ← L2 − m·L1 (m = u2/u1) zera o canto de baixo da primeira
// coluna e deixa, no canto de baixo da segunda, o número v2 − m·v1. Esse número
// só depende dos vetores. Do lado direito fica y − m·x, que depende do alvo.
//
// - Se v2 − m·v1 ≠ 0, a segunda linha sempre tem solução: o alvo é alcançável,
//   seja ele qual for, e a figura desenha a receita até ele.
// - Se v2 − m·v1 = 0 (v paralelo a u), a segunda linha vira 0 = y − m·x, e só
//   os alvos sobre a reta de u escapam da linha impossível.
//
// O aluno move o alvo com dois deslizantes e troca o par de vetores nos botões.

const PAIRS = [
  {u: [1, 2], v: [3, 1]},
  {u: [1, 2], v: [3, 6]},
];

const num = (x) => mathNumber(x, 2);
const plainNum = (x) => num(x).replace('{,}', ',').replace('-', '−');
const pair = (p) => {
  const a = num(p[0]);
  const b = num(p[1]);
  return `(${a}${a.includes('{,}') || b.includes('{,}') ? ';' : ','}\\ ${b})`;
};

export default function SpanRowTest({initialPair = 0, initialTarget = [7, -1], caption}) {
  const [index, setIndex] = useState(initialPair);
  const [target, setTarget] = useState(initialTarget);
  const {u, v} = PAIRS[index];
  const [x, y] = target;
  const m = u[1] / u[0];
  const corner = v[1] - m * v[0];
  const right = y - m * x;
  const free = Math.abs(corner) < 1e-9;
  const reachable = !free || Math.abs(right) < 1e-9;
  const c2 = free ? 0 : right / corner;
  const c1 = (x - v[0] * c2) / u[0];

  const pl = makePlane({xMin: -7.5, xMax: 7.5, yMin: -7.5, yMax: 7.5}, 20);
  const span = free ? fullLine(pl, [0, 0], u) : null;
  const mid = [c1 * u[0], c1 * u[1]];

  const clipped = (
    <>
      {span && <line x1={span[0][0]} y1={span[0][1]} x2={span[1][0]} y2={span[1][1]} stroke={toneVar(3)} strokeWidth={8} strokeOpacity={0.25} />}
      {reachable && (Math.abs(x) > 1e-9 || Math.abs(y) > 1e-9) && (
        <>
          <Arrow pl={pl} from={[0, 0]} to={mid} tone={1} width={1.8} dashed />
          <Arrow pl={pl} from={mid} to={target} tone={2} width={1.8} dashed />
        </>
      )}
      <Arrow pl={pl} from={[0, 0]} to={u} tone={1} />
      <Arrow pl={pl} from={[0, 0]} to={v} tone={2} />
    </>
  );
  const s = pl.P(target);
  const over = (
    <>
      <SvgMath x={pl.X(u[0]) - 16} y={pl.Y(u[1]) - 4} math="\vec{u}" tone={1} fontSize={14} halo />
      <SvgMath x={pl.X(v[0]) + 16} y={pl.Y(v[1]) + 2} math="\vec{v}" tone={2} fontSize={14} halo />
      <circle cx={s[0]} cy={s[1]} r={6} fill={reachable ? toneVar(3) : 'var(--ifm-background-surface-color)'} stroke={reachable ? toneVar(3) : 'var(--ifm-font-color-base)'} strokeWidth={2} />
      <SvgMath x={s[0] + (x > 1 ? -12 : 12)} y={s[1] + (y >= 0 && y <= 5 ? -16 : 18)} anchor={x > 1 ? 'end' : 'start'} math={`\\text{alvo } ${pair(target)}`} fontSize={13} halo />
    </>
  );

  const op = `L_2 \\leftarrow L_2 - ${num(m)}L_1`;
  const before = `\\left[\\begin{array}{cc|c} ${u[0]} & ${v[0]} & ${num(x)} \\\\ ${u[1]} & ${v[1]} & ${num(y)} \\end{array}\\right]`;
  const after = `\\left[\\begin{array}{cc|c} ${u[0]} & ${v[0]} & ${num(x)} \\\\ 0 & ${num(corner)} & ${num(right)} \\end{array}\\right]`;

  return (
    <div className={shared.wrapper} data-explorer="span-row-test">
      <figure style={{margin: '0 0 1rem'}}>
        <MiniPlane pl={pl} ticksEvery={2} clipped={clipped} over={over} ariaLabel={caption} maxWidth={380} />
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.controls}>
        {['x', 'y'].map((name, i) => (
          <label key={name} className={shared.control}>
            <span>
              Coordenada {name} do alvo: <strong>{plainNum(target[i])}</strong>
            </span>
            <input
              type="range"
              min={-7}
              max={7}
              step={1}
              value={target[i]}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTarget((old) => old.map((w, j) => (j === i ? value : w)));
              }}
              aria-label={`Coordenada ${name} do alvo`}
            />
          </label>
        ))}
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`{${before} \\xrightarrow{${op}} ${after}}`} />
        </p>
        <p className={shared.formula}>
          Canto de baixo da segunda coluna (só depende dos vetores): <Formula math={`${v[1]} - ${num(m)} \\times ${v[0]} = ${num(corner)}`} />.
        </p>
        <p className={shared.formula}>
          Lado direito (depende do alvo): <Formula math={`y - ${num(m)}x = ${num(y)} - ${num(m)} \\times ${x < 0 ? `(${num(x)})` : num(x)} = ${num(right)}`} />.
        </p>
        <p>
          {!free && (
            <>
              A segunda linha diz <Formula math={`${num(corner)}c_2 = ${num(right)}`} />. Como{' '}
              <Formula math={num(corner)} /> não é zero, ela sempre tem solução: <Formula math={`c_2 = ${num(c2)}`} />, e a primeira linha dá{' '}
              <Formula math={`c_1 = ${num(c1)}`} />. Receita: <Formula math={`${num(c1)}\\vec{u} ${c2 < 0 ? '' : '+ '}${num(c2)}\\vec{v} = ${pair(target)}`} />.
            </>
          )}
          {free && !reachable && (
            <>
              A segunda linha diz <Formula math={`0 = ${num(right)}`} />. Nenhum <Formula math="c_1" /> e nenhum <Formula math="c_2" /> fazem isso: o alvo está fora do
              alcance de <Formula math="\vec{u}" /> e <Formula math="\vec{v}" />.
            </>
          )}
          {free && reachable && (
            <>
              A segunda linha diz <Formula math="0 = 0" />, que não impõe nada. O alvo está na reta de <Formula math="\vec{u}" />, e há infinitas receitas; uma delas é{' '}
              <Formula math={`c_1 = ${num(c1)},\\ c_2 = 0`} />.
            </>
          )}
        </p>
      </div>

      <div className={shared.buttons}>
        {PAIRS.map((p, i) => (
          <button key={i} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>
            u = ({p.u.join(', ')}), v = ({p.v.join(', ')})
          </button>
        ))}
      </div>
    </div>
  );
}
