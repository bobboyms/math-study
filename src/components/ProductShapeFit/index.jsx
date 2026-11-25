import React, {useEffect, useRef, useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import styles from './styles.module.css';

// Dimensões compatíveis como peças de dominó (lição 11.7).
//
// Cada matriz é uma peça com dois números, linhas | colunas, e embaixo dela o
// formato da matriz em quadradinhos. As peças deslizam uma em direção à
// outra. Encaixam quando os números que se encostam são iguais (as colunas de
// uma com as linhas da seguinte): as metades de dentro se apagam e sobra a
// peça do resultado, com os números das pontas. Quando os números de dentro
// são diferentes, as peças param separadas e o produto não existe.

const S = 40; // lado de cada metade da peça
const Q = 10; // lado do quadradinho do formato
const GAP_FAR = 54;
const GAP_BAD = 30;

function Tile({x, y, dims, name, innerL, innerR, fadeL, fadeR, tone = 0}) {
  const color = tone ? `var(--mv-tone-${tone})` : 'var(--ifm-color-emphasis-700)';
  const half = (hx, value, state, fade) => {
    const st = state === 'ok' ? 3 : state === 'bad' ? 2 : 0;
    return (
      <g opacity={1 - 0.65 * (fade ?? 0)}>
        <rect
          x={hx}
          y={y}
          width={S}
          height={S}
          rx={5}
          fill={st ? `var(--mv-tone-${st})` : 'var(--mv-paper)'}
          fillOpacity={st ? 0.2 : 1}
          stroke={st ? `var(--mv-tone-${st})` : color}
          strokeWidth={st ? 2.2 : 1.6}
          strokeDasharray={state === 'bad' ? '5 3' : undefined}
        />
        <SvgMath x={hx + S / 2} y={y + S / 2} math={String(value)} fontSize={18} />
      </g>
    );
  };
  const [r, c] = dims;
  const gx = x + S - (c * Q) / 2;
  return (
    <g>
      <SvgMath x={x + S} y={y - 14} math={name} fontSize={15} tone={tone || undefined} />
      {half(x, r, innerL, fadeL)}
      {half(x + S, c, innerR, fadeR)}
      <line x1={x + S} y1={y + 4} x2={x + S} y2={y + S - 4} stroke={color} strokeWidth={1.4} />
      {Array.from({length: r}).map((_, i) =>
        Array.from({length: c}).map((__, j) => (
          <rect key={`${i}${j}`} x={gx + j * Q} y={y + S + 10 + i * Q} width={Q - 1.5} height={Q - 1.5} rx={1.5} fill={color} fillOpacity={0.35} />
        )),
      )}
    </g>
  );
}

export default function ProductShapeFit({
  presets,
  initialPreset = 0,
  free = false,
  caption,
  label = 'Peças de dominó com as dimensões das matrizes',
  replayLabel = 'Encaixar de novo',
}) {
  const [idx, setIdx] = useState(initialPreset);
  const [dims, setDims] = useState(free ? [2, 3, 3, 4] : null);
  const {ref, t, play, playing} = useAnimation({duration: 2.6});

  const tiles = free
    ? [
        {name: 'A', dims: [dims[0], dims[1]]},
        {name: 'B', dims: [dims[2], dims[3]]},
      ]
    : presets[idx].tiles;
  const k = tiles.length;
  const joints = tiles.slice(1).map((tl, i) => tiles[i].dims[1] === tl.dims[0]);
  const ok = joints.every(Boolean);

  // re-anima quando o aluno muda um deslizante
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims ? dims.join(',') : '']);

  const slide = ease((t - 0.2) / 1.2);
  const merge = ease((t - 1.6) / 0.8);
  const tileW = 2 * S;
  const gaps = joints.map((j) => lerp(GAP_FAR, j ? 0 : GAP_BAD, slide));
  // A largura do desenho não muda durante o deslize: ela cabe as peças
  // afastadas do começo e a peça do resultado, posta depois das peças paradas.
  const finalGaps = joints.map((j) => (j ? 0 : GAP_BAD));
  const rowWfinal = k * tileW + finalGaps.reduce((a, b) => a + b, 0);
  const rowWstart = k * tileW + (k - 1) * GAP_FAR;
  const resultW = 30 + tileW;
  const x0 = 20;
  const W = Math.max(x0 + rowWstart + 20, x0 + rowWfinal + resultW + 30, 360);
  const y0 = 40;
  const xs = [];
  let cx = x0;
  tiles.forEach((_, i) => {
    xs.push(cx);
    cx += tileW + (gaps[i] ?? 0);
  });
  const rx = x0 + rowWfinal + 30;
  const shown = !playing || t > 1.6;
  const last = tiles[k - 1];
  const res = [tiles[0].dims[0], last.dims[1]];
  const maxRows = Math.max(...tiles.map((tl) => tl.dims[0]), res[0]);
  const H = y0 + S + 10 + maxRows * Q + 12;
  const resName = tiles.map((tl) => tl.name).join('');

  let verdict;
  if (ok) {
    verdict = (
      <p>
        Os números que se encostam são iguais, e as peças encaixam. O resultado é{' '}
        <Formula math={`${resName}`} />, de dimensão <Formula math={`${res[0]} \\times ${res[1]}`} />: os números das pontas.
      </p>
    );
  } else {
    const bad = joints.findIndex((j) => !j);
    const L = tiles[bad];
    const R = tiles[bad + 1];
    verdict = (
      <p>
        Na junção de <Formula math={L.name} /> com <Formula math={R.name} />, os números de dentro são{' '}
        {L.dims[1]} e {R.dims[0]}: cada linha de <Formula math={L.name} /> tem {L.dims[1]}{' '}
        {L.dims[1] === 1 ? 'entrada' : 'entradas'}, e cada coluna de <Formula math={R.name} /> tem {R.dims[0]}. As peças não
        encaixam, e o produto <Formula math={resName} /> não existe.
      </p>
    );
  }
  const machine =
    k === 2 ? (
      <p className={styles.small}>
        Leitura de máquinas: <Formula math={tiles[1].name} /> recebe vetores de {tiles[1].dims[1]}{' '}
        {tiles[1].dims[1] === 1 ? 'coordenada' : 'coordenadas'} e entrega vetores de {tiles[1].dims[0]}.{' '}
        <Formula math={tiles[0].name} /> recebe vetores de {tiles[0].dims[1]}.{' '}
        {ok ? 'A saída de uma cabe na entrada da outra.' : 'A saída de uma não cabe na entrada da outra.'}
      </p>
    ) : null;

  return (
    <div className={shared.wrapper} data-explorer="product-shape-fit">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={label}>
          {tiles.map((tl, i) => {
            const leftJ = i > 0 ? joints[i - 1] : null;
            const rightJ = i < k - 1 ? joints[i] : null;
            const state = (j) => (j === null || slide < 0.98 ? null : j ? 'ok' : 'bad');
            return (
              <Tile
                key={i}
                x={xs[i]}
                y={y0}
                dims={tl.dims}
                name={tl.name}
                innerL={state(leftJ)}
                innerR={state(rightJ)}
                fadeL={leftJ && ok ? merge : 0}
                fadeR={rightJ && ok ? merge : 0}
                tone={tl.tone}
              />
            );
          })}
          {joints.map((j, i) =>
            !j && slide > 0.98 ? (
              <SvgMath key={`ne${i}`} x={xs[i] + tileW + GAP_BAD / 2} y={y0 + S / 2} math="\neq" fontSize={20} tone={2} />
            ) : null,
          )}
          {shown && (
            <g opacity={playing ? merge : 1}>
              <SvgMath x={rx - 14} y={y0 + S / 2} math={ok ? '=' : '\\to'} fontSize={20} />
              {ok ? (
                <Tile x={rx} y={y0} dims={res} name={resName} tone={3} />
              ) : (
                <SvgMath x={rx + 6} y={y0 + S / 2} math="\text{não existe}" fontSize={15} tone={2} anchor="start" />
              )}
            </g>
          )}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        {shown ? verdict : <p>As peças estão se aproximando.</p>}
        {shown && machine}
        {!free && presets[idx].note && shown && <p className={styles.small}>{presets[idx].note}</p>}
      </div>
      {presets && !free && (
        <div className={shared.buttons} role="group" aria-label="Escolha o produto">
          {presets.map((pr, i) => (
            <button
              key={pr.label}
              type="button"
              className={i === idx ? styles.active : undefined}
              aria-pressed={i === idx}
              onClick={() => {
                setIdx(i);
                play();
              }}
            >
              {pr.label}
            </button>
          ))}
        </div>
      )}
      {free && (
        <div className={styles.sliders}>
          {[
            ['Linhas de A', 0],
            ['Colunas de A', 1],
            ['Linhas de B', 2],
            ['Colunas de B', 3],
          ].map(([lab, q]) => (
            <label key={q} className={shared.control}>
              <span>
                {lab}: <strong>{dims[q]}</strong>
              </span>
              <input
                type="range"
                min={1}
                max={4}
                step={1}
                value={dims[q]}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setDims((d) => d.map((x, z) => (z === q ? v : x)));
                }}
                aria-label={lab}
              />
            </label>
          ))}
        </div>
      )}
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {replayLabel}
        </button>
      </div>
    </div>
  );
}

function lerp(a, b, s) {
  return a + (b - a) * s;
}
