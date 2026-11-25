import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import MiniPlane, {Arrow, makePlane, toneVar} from '../SpanCombo/plane';

// Duas receitas para o mesmo ponto viram uma volta fechada (lição 11.10).
//
// Com três direções de rua (b1, b2 e e1), o ponto (5, 1) tem dois endereços:
// a receita 1 (azul) e a receita 2 (laranja). Ir pela receita 1 e voltar
// pela receita 2 é uma volta fechada (verde), e a conta dessa volta é a
// diferença das receitas: uma receita que dá o vetor nulo sem ser "zero de
// tudo". Com só b1 e b2 (uma base), essa volta não existe, e o endereço é um
// só.

const lerp2 = (p, q, s) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s];

// ponto ao longo de uma poligonal, com s de 0 a 1 (por comprimento)
function along(pts, s) {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((x, y) => x + y, 0);
  let left = s * total;
  const out = [pts[0]];
  for (let i = 0; i < lens.length; i += 1) {
    if (left >= lens[i]) {
      out.push(pts[i + 1]);
      left -= lens[i];
    } else {
      out.push(lerp2(pts[i], pts[i + 1], left / lens[i]));
      break;
    }
  }
  return out;
}

const R1 = [
  [0, 0],
  [3, 3],
  [5, 1],
];
const R2 = [
  [0, 0],
  [4, 0],
  [5, 1],
];
const LOOP = [
  [0, 0],
  [3, 3],
  [5, 1],
  [4, 0],
  [0, 0],
];

export default function BasisAddressLoop({initialMode = 'three', caption}) {
  const [mode, setMode] = useState(initialMode);
  const three = mode === 'three';
  const duration = three ? 6 : 2.4;
  const {ref, t, play, playing} = useAnimation({duration});

  const pl = makePlane({xMin: -1, xMax: 6, yMin: -1, yMax: 4}, 44);
  const s1 = stage(t, 0.2, 1.8);
  const s2 = three ? stage(t, 1.9, 3.3) : 0;
  const s3 = three ? stage(t, 3.6, 5.6) : 0;
  const p1 = along(R1, s1);
  const p2 = along(R2, s2);
  const loop = along(LOOP, s3);

  const segs = (pts, tone, width, dashed) =>
    pts.slice(1).map((q, i) => <Arrow key={`${tone}-${i}`} pl={pl} from={pts[i]} to={q} tone={tone} width={width} dashed={dashed} />);

  const fillPts = LOOP.map((p) => pl.P(p).join(',')).join(' ');
  const clipped = (
    <>
      {s3 > 0.98 && <polygon points={fillPts} fill={toneVar(3)} fillOpacity={0.16} />}
      {s3 > 0 && <polyline points={loop.map((p) => pl.P(p).join(',')).join(' ')} fill="none" stroke={toneVar(3)} strokeWidth={7} strokeOpacity={0.35} strokeLinejoin="round" />}
      {segs(p1, 1, 3)}
      {s2 > 0 && segs(p2, 2, 3)}
    </>
  );

  const L = (x, y, math, tone, anchor = 'middle') => <SvgMath x={pl.X(x)} y={pl.Y(y)} math={math} fontSize={14} tone={tone} halo anchor={anchor} />;
  const tgt = pl.P([5, 1]);
  const over = (
    <>
      <circle cx={pl.X(0)} cy={pl.Y(0)} r={5} fill={s3 > 0.98 ? toneVar(3) : 'var(--ifm-font-color-base)'} />
      <circle cx={tgt[0]} cy={tgt[1]} r={6} fill="var(--ifm-background-surface-color)" stroke="var(--ifm-font-color-base)" strokeWidth={2} />
      <SvgMath x={tgt[0] + 10} y={tgt[1] - 16} math="(5,\ 1)" fontSize={14} anchor="start" halo space={70} />
      {s1 > 0.55 && L(1.05, 2.15, '3\\vec{b}_1', 1)}
      {s1 > 0.99 && L(4.45, 2.45, '2\\vec{b}_2', 1)}
      {s2 > 0.75 && L(1.6, 0.4, '4\\vec{e}_1', 2)}
      {s2 > 0.99 && L(4.85, 0.25, '\\vec{b}_1', 2, 'start')}
      {s3 > 0.98 && L(2.6, 1.1, '\\text{volta}', 3)}
    </>
  );

  return (
    <div className={shared.wrapper} data-explorer="basis-address-loop">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <MiniPlane pl={pl} ticksEvery={1} clipped={clipped} over={over} ariaLabel={caption} maxWidth={400} />
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <span style={{color: toneVar(1), fontWeight: 600}}>Receita 1:</span>{' '}
          <Formula math="3\vec{b}_1 + 2\vec{b}_2 + 0\vec{e}_1 = (5,\ 1)" />
        </p>
        {three ? (
          <>
            {s2 > 0.99 && (
              <p className={shared.formula}>
                <span style={{color: toneVar(2), fontWeight: 600}}>Receita 2:</span>{' '}
                <Formula math="1\vec{b}_1 + 0\vec{b}_2 + 4\vec{e}_1 = (5,\ 1)" />
              </p>
            )}
            {s3 > 0.98 && (
              <>
                <p className={shared.formula}>
                  <span style={{color: toneVar(3), fontWeight: 600}}>Ir pela 1 e voltar pela 2:</span>{' '}
                  <Formula math="(3 - 1)\vec{b}_1 + (2 - 0)\vec{b}_2 + (0 - 4)\vec{e}_1 = (0,\ 0)" />
                </p>
                <p>
                  A volta fechada é uma receita que dá o vetor nulo sem ser zero de tudo: <Formula math="2\vec{b}_1 + 2\vec{b}_2 - 4\vec{e}_1" />. Ela existe
                  porque as três direções são dependentes.
                </p>
              </>
            )}
          </>
        ) : (
          <p>
            Só com <Formula math="\vec{b}_1" /> e <Formula math="\vec{b}_2" />, uma segunda receita daria uma volta fechada{' '}
            <Formula math="c\vec{b}_1 + d\vec{b}_2 = (0,\ 0)" /> com <Formula math="c" /> ou <Formula math="d" /> diferente de zero. Como{' '}
            <Formula math="\vec{b}_1" /> e <Formula math="\vec{b}_2" /> são independentes, essa volta não existe: a receita 1 é a única.
          </p>
        )}
      </div>

      <div className={shared.buttons}>
        <button
          type="button"
          aria-pressed={three}
          disabled={playing}
          onClick={() => {
            setMode('three');
            play({duration: 6});
          }}
        >
          Três direções de rua
        </button>
        <button
          type="button"
          aria-pressed={!three}
          disabled={playing}
          onClick={() => {
            setMode('base');
            play({duration: 2.4});
          }}
        >
          Só avenidas e travessas
        </button>
        <button type="button" onClick={() => play({duration})} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
