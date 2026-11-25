import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import MiniPlane, {Arrow, fullLine, makePlane, toneVar} from '../SpanCombo/plane';
import {fr, sub, mul, div, texFr, isZero} from '../SystemElimination/frac';

// Um ponto, dois endereços (lição 11.10).
//
// O entregador vai da origem até o ponto escolhido duas vezes. Primeiro pelo
// mapa da prefeitura (ruas leste-oeste e norte-sul): x quarteirões para leste
// e y para norte, em cinza. Depois a malha da prefeitura apaga, entram as ruas
// do bairro (avenidas na direção b1, no tom 1; travessas na direção b2, no
// tom 2) e ele refaz a viagem: a quarteirões de avenida e b de travessa. O
// ponto não sai do lugar; só o endereço muda.
//
// Os rótulos dos trechos só aparecem quando o trecho termina, para nenhum
// quadro do meio ter rótulo atravessando o desenho.

function coordsIn(basis, p) {
  // resolve a·u + b·v = p com frações exatas (regra de Cramer)
  const [u, v] = basis;
  const det = fr(u[0] * v[1] - u[1] * v[0]);
  const a = div(sub(mul(fr(p[0]), fr(v[1])), mul(fr(p[1]), fr(v[0]))), det);
  const b = div(sub(mul(fr(u[0]), fr(p[1])), mul(fr(u[1]), fr(p[0]))), det);
  return [a, b];
}

const val = (f) => f.n / f.d;
const coefTex = (f, name) => {
  if (f.n === f.d) return name;
  if (f.n === -f.d) return `-${name}`;
  return `${texFr(f)}${name}`;
};

export default function BasisTwoGrids({
  basis = [
    [1, 1],
    [1, -1],
  ],
  names = ['\\vec{b}_1', '\\vec{b}_2'],
  presets = [
    [5, 1],
    [2, 2],
    [7, 3],
    [1, 5],
    [3, 0],
  ],
  initial = 0,
  window: win = {xMin: -1, xMax: 8, yMin: -2, yMax: 7},
  unit = 34,
  caption,
}) {
  const [idx, setIdx] = useState(initial);
  const duration = 5.2;
  const {ref, t, play, playing} = useAnimation({duration});
  const target = presets[idx];
  const [a, b] = coordsIn(basis, target);
  const [u, v] = basis;

  const pl = makePlane(win, unit);
  const fade = stage(t, 1.9, 2.6);

  // malha da prefeitura
  const canon = [];
  for (let k = Math.floor(win.xMin); k <= Math.ceil(win.xMax); k += 1) canon.push([pl.P([k, win.yMin - 1]), pl.P([k, win.yMax + 1])]);
  for (let k = Math.floor(win.yMin); k <= Math.ceil(win.yMax); k += 1) canon.push([pl.P([win.xMin - 1, k]), pl.P([win.xMax + 1, k])]);

  // ruas do bairro: avenidas (direção u) pelos múltiplos de v; travessas
  // (direção v) pelos múltiplos de u
  const avenues = [];
  const streets = [];
  for (let k = -14; k <= 14; k += 1) {
    avenues.push(fullLine(pl, [k * v[0], k * v[1]], u));
    streets.push(fullLine(pl, [k * u[0], k * u[1]], v));
  }

  // caminho pela prefeitura
  const sE = stage(t, 0.35, 1.25);
  const sN = stage(t, 1.25, 1.8);
  const east = [target[0] * sE, 0];
  const north = [target[0], target[1] * sN];
  // caminho pelo bairro
  const sA = stage(t, 2.7, 3.85);
  const sB = stage(t, 3.85, 4.8);
  const av = [val(a) * u[0] * sA, val(a) * u[1] * sA];
  const mid = [val(a) * u[0], val(a) * u[1]];
  const tr = [mid[0] + val(b) * v[0] * sB, mid[1] + val(b) * v[1] * sB];
  const done = stage(t, 4.8, 5.2);

  const lbl = (from, to, side) => {
    // rótulo no meio do trecho, deslocado para um dos lados
    const A = pl.P(from);
    const B = pl.P(to);
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1;
    const nx = ((B[1] - A[1]) / L) * 15 * side;
    const ny = (-(B[0] - A[0]) / L) * 15 * side;
    return [(A[0] + B[0]) / 2 + nx, (A[1] + B[1]) / 2 + ny];
  };

  const canonOp = 1 - 0.75 * fade;
  const clipped = (
    <>
      {canon.map(([p, q], i) => (
        <line key={`c${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="var(--mv-guide)" strokeWidth={1} opacity={0.7 * canonOp} />
      ))}
      {fade > 0 &&
        avenues.map(([p, q], i) => (
          <line key={`a${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={toneVar(1)} strokeWidth={1.1} opacity={0.4 * fade} strokeDasharray="6 4" />
        ))}
      {fade > 0 &&
        streets.map(([p, q], i) => (
          <line key={`s${i}`} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={toneVar(2)} strokeWidth={1.1} opacity={0.4 * fade} strokeDasharray="6 4" />
        ))}
      {/* caminho da prefeitura: cinza, fica tracejado depois que a malha troca */}
      {target[0] !== 0 && <Arrow pl={pl} from={[0, 0]} to={east} tone={0} width={2.4} dashed={fade > 0.5} opacity={1 - 0.5 * fade} />}
      {sN > 0 && target[1] !== 0 && <Arrow pl={pl} from={[target[0], 0]} to={north} tone={0} width={2.4} dashed={fade > 0.5} opacity={1 - 0.5 * fade} />}
      {/* caminho do bairro */}
      {sA > 0 && !isZero(a) && <Arrow pl={pl} from={[0, 0]} to={av} tone={1} width={3} />}
      {sB > 0 && !isZero(b) && <Arrow pl={pl} from={mid} to={tr} tone={2} width={3} />}
      {done > 0 && <Arrow pl={pl} from={[0, 0]} to={target} tone={3} width={2} opacity={done} />}
    </>
  );

  const tgt = pl.P(target);
  const pairTex = `(${target[0]},\\ ${target[1]})`;
  const over = (
    <>
      <circle cx={pl.X(0)} cy={pl.Y(0)} r={4} fill="var(--ifm-font-color-base)" />
      <circle cx={tgt[0]} cy={tgt[1]} r={6} fill={toneVar(3)} stroke="var(--mv-paper)" strokeWidth={1.5} />
      <SvgMath x={tgt[0] + 12} y={tgt[1] - 16} math={pairTex} fontSize={14} anchor="start" halo tone={3} space={90} />
      {target[0] !== 0 && sE > 0.99 && (
        <g opacity={1 - 0.5 * fade}>
          {(() => {
            const [x, y] = lbl([0, 0], [target[0], 0], target[1] >= 0 ? -1 : 1);
            return <SvgMath x={x + 18} y={y + (target[1] >= 0 ? 15 : -15)} math={`${target[0]}\\vec{e}_1`} fontSize={13} halo />;
          })()}
        </g>
      )}
      {target[1] !== 0 && sN > 0.99 && (
        <g opacity={1 - 0.5 * fade}>
          {(() => {
            const [x, y] = lbl([target[0], 0], target, target[1] >= 0 ? -1 : 1);
            return <SvgMath x={x + (target[0] >= 0 ? 8 : -8)} y={y} math={`${target[1]}\\vec{e}_2`} fontSize={13} halo />;
          })()}
        </g>
      )}
      {sA > 0.99 && !isZero(a) && (
        <g>
          {(() => {
            const [x, y] = lbl([0, 0], mid, 1);
            return <SvgMath x={x - 6} y={y} math={coefTex(a, names[0])} fontSize={14} tone={1} halo />;
          })()}
        </g>
      )}
      {sB > 0.99 && !isZero(b) && (
        <g>
          {(() => {
            const [x, y] = lbl(mid, target, val(b) > 0 ? 1 : -1);
            return <SvgMath x={x + 6} y={y} math={coefTex(b, names[1])} fontSize={14} tone={2} halo />;
          })()}
        </g>
      )}
    </>
  );

  const shownCanon = t >= 1.8;
  const shownBasis = t >= 4.8;
  const termTex = (f, name, first) => {
    const neg = val(f) < 0;
    const abs = neg ? fr(-f.n, f.d) : f;
    const sign = first ? (neg ? '-' : '') : neg ? ' - ' : ' + ';
    return `${sign}${texFr(abs)}${name}`;
  };

  return (
    <div className={shared.wrapper} data-explorer="basis-two-grids">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <MiniPlane pl={pl} ticksEvery={1} clipped={clipped} over={over} ariaLabel={caption} maxWidth={420} />
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          Mapa da prefeitura:{' '}
          {shownCanon ? (
            <>
              <Formula math={`${pairTex} = ${termTex(fr(target[0]), '\\vec{e}_1', true)}${termTex(fr(target[1]), '\\vec{e}_2', false)}`} />, endereço{' '}
              <strong>
                <Formula math={`${target[0]}`} /> e <Formula math={`${target[1]}`} />
              </strong>
              .
            </>
          ) : (
            'andando...'
          )}
        </p>
        <p className={shared.formula}>
          Ruas do bairro:{' '}
          {shownBasis ? (
            <>
              <Formula math={`${pairTex} = ${termTex(a, names[0], true)}${termTex(b, names[1], false)}`} />, endereço{' '}
              <strong>
                <Formula math={texFr(a)} /> e <Formula math={texFr(b)} />
              </strong>
              .
            </>
          ) : (
            'esperando a primeira viagem terminar...'
          )}
        </p>
        {shownBasis && (!Number.isInteger(val(a)) || !Number.isInteger(val(b))) && (
          <p>Aqui o endereço no bairro tem meio quarteirão: o ponto fica no meio de uma quadra, e não numa esquina.</p>
        )}
        {shownBasis && (val(a) < 0 || val(b) < 0) && <p>Um número negativo quer dizer andar na direção contrária da rua.</p>}
      </div>

      <div className={shared.buttons}>
        {presets.map((p, i) => (
          <button
            key={p.join(',')}
            type="button"
            aria-pressed={i === idx}
            disabled={playing}
            onClick={() => {
              setIdx(i);
              play();
            }}
          >
            Ir até ({String(p[0]).replace('-', '−')}, {String(p[1]).replace('-', '−')})
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
