import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import MiniPlane, {Arrow, fullLine, makePlane, toneVar} from '../SpanCombo/plane';

// O escalonamento muda as colunas, mas não as relações entre elas
// (lição 11.10).
//
// As colunas de A = [[1, 2], [2, 4]] como setas: (1, 2) no tom 1 e (2, 4) no
// tom 2, sobre a reta y = 2x (faixa verde), que é o espaço coluna. A operação
// L2 ← L2 − 2L1 mexe na segunda coordenada de cada coluna: a seta desce até
// o eixo x. Durante todo o movimento a segunda seta continua sendo o dobro da
// primeira (a relação não muda), mas a reta das duas gira até o eixo x: o
// espaço gerado pelas colunas escalonadas é outro.

const k = -2;

export default function EchelonColumnsShift({caption}) {
  const duration = 3.6;
  const [manual, setManual] = useState(null);
  const {ref, t, play, playing} = useAnimation({
    duration,
    onFrame: () => setManual(null),
  });
  const s = manual ?? stage(t, 0.6, 3.2);

  const a1 = [1, 2 + k * 1 * s];
  const a2 = [2, 4 + k * 2 * s];
  const pl = makePlane({xMin: -1, xMax: 3.5, yMin: -1, yMax: 4.5}, 56);

  const [g0, g1] = fullLine(pl, [0, 0], [1, 2]);
  const [c0, c1] = fullLine(pl, [0, 0], a1);
  const moved = s > 0.02;

  const clipped = (
    <>
      {moved && <line x1={g0[0]} y1={g0[1]} x2={g1[0]} y2={g1[1]} stroke={toneVar(3)} strokeWidth={1.6} strokeDasharray="7 5" opacity={0.7} />}
      <line x1={c0[0]} y1={c0[1]} x2={c1[0]} y2={c1[1]} stroke={toneVar(3)} strokeWidth={8} strokeOpacity={0.25} />
      {moved && (
        <>
          <Arrow pl={pl} from={[0, 0]} to={[2, 4]} tone={2} width={1.6} dashed opacity={0.5} />
          <Arrow pl={pl} from={[0, 0]} to={[1, 2]} tone={1} width={1.6} dashed opacity={0.5} />
        </>
      )}
      <Arrow pl={pl} from={[0, 0]} to={a2} tone={2} width={3} />
      <Arrow pl={pl} from={[0, 0]} to={a1} tone={1} width={4.2} />
    </>
  );

  const pairTex = (p) => {
    const f = (x) => String(Number(x.toFixed(2))).replace('.', '{,}');
    const a = f(p[0]);
    const b = f(p[1]);
    return `(${a}${a.includes('{,}') || b.includes('{,}') ? ';' : ','}\\ ${b})`;
  };
  const still = !playing;
  const over = (
    <>
      {still && moved && <SvgMath x={pl.X(2) + 10} y={pl.Y(4) + 14} math="(2,\ 4)" fontSize={13} tone={2} anchor="start" halo space={60} />}
      {still && moved && <SvgMath x={pl.X(1) - 10} y={pl.Y(2) - 4} math="(1,\ 2)" fontSize={13} tone={1} anchor="end" halo space={60} />}
      {still && <SvgMath x={pl.X(a2[0]) + 4} y={pl.Y(a2[1]) + (s > 0.9 ? 32 : -16)} math={pairTex(a2)} fontSize={13} tone={2} anchor="start" halo space={80} />}
      {still && <SvgMath x={pl.X(a1[0]) - 4} y={pl.Y(a1[1]) + (s > 0.9 ? 32 : -16)} math={pairTex(a1)} fontSize={13} tone={1} anchor="end" halo space={80} />}
      {still && moved && <SvgMath x={pl.X(1.05)} y={pl.Y(3.9)} math="y = 2x" fontSize={13} tone={3} anchor="end" halo space={70} />}
    </>
  );

  const pct = Math.round(s * 100);
  return (
    <div className={shared.wrapper} data-explorer="echelon-columns-shift">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <MiniPlane pl={pl} ticksEvery={1} clipped={clipped} over={over} ariaLabel={caption} maxWidth={340} />
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Quanto da operação <Formula math="L_2 \leftarrow L_2 - 2L_1" /> já foi feito: <strong>{pct}%</strong>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={pct}
            disabled={playing}
            onChange={(e) => setManual(Number(e.target.value) / 100)}
            aria-label="Quanto da operação já foi feito"
          />
        </label>
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          Colunas agora: <Formula math={`${pairTex(a1)}`} /> e <Formula math={`${pairTex(a2)}`} />. A segunda é o dobro da primeira:{' '}
          <Formula math={`2 \\times ${pairTex(a1)} = ${pairTex([2 * a1[0], 2 * a1[1]])}`} />.
        </p>
        <p>
          {s < 0.02
            ? 'Antes da operação, as duas colunas estão na reta y = 2x, o espaço coluna de A.'
            : s > 0.98
              ? 'Depois da operação, as colunas estão no eixo x. A relação “segunda = 2 × primeira” continua valendo, mas a reta das colunas mudou: a coluna escalonada (1, 0) não está em y = 2x.'
              : 'A relação entre as colunas não muda em nenhum instante. A reta que elas geram, sim: ela gira junto com as setas.'}
        </p>
      </div>

      <div className={shared.buttons}>
        <button
          type="button"
          onClick={() => {
            setManual(null);
            play();
          }}
          disabled={playing}
        >
          Ver de novo
        </button>
      </div>
    </div>
  );
}
