import React, {useEffect, useMemo, useState} from 'react';
import Formula, {mathNumber} from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import MiniPlane, {Arrow, fullLine, makePlane, toneVar} from './plane';

// Combinação linear no plano com um deslizante por vetor (lição 11.5).
//
// A ponta da combinação a·u + b·v (+ c·w) é desenhada como um caminho:
// primeiro a·u a partir da origem, depois b·v a partir dali, e assim por
// diante. A seta verde (ou cinza, com três vetores) vai da origem até a ponta.
// Cada posição da ponta deixa um ponto de rastro.
//
// Ao entrar na tela, a figura testa sozinha uma grade de receitas (de meio em
// meio) e deixa o rastro de todas: com dois vetores não paralelos, os pontos
// enchem um paralelogramo inclinado; com dois paralelos, caem todos numa reta.
//
// Modos:
// - `targets`: busca com registro das receitas que acertaram cada alvo;
// - `zeroHunt`: o alvo é a origem, e só conta receita que não seja “zero de
//   tudo”; `removable` deixa tirar um dos vetores para comparar.

const near = (a, b) => Math.abs(a - b) < 1e-9;
const round = (x, step) => Math.round(x / step) * step;

export default function SpanCombo({
  vectors = [
    {v: [2, 1], name: '\\vec{u}'},
    {v: [1, 3], name: '\\vec{v}'},
  ],
  ranges,
  step = 0.1,
  initial,
  targets = [],
  zeroHunt = false,
  removable,
  window: win = {xMin: -6.5, xMax: 6.5, yMin: -8.5, yMax: 8.5},
  unit = 22,
  ticksEvery = 2,
  sweep = true,
  sweepStep = 0.5,
  lattice = true,
  caption,
}) {
  const n = vectors.length;
  const rg = ranges ?? vectors.map(() => [-2, 2]);
  const start = initial ?? vectors.map(() => 0);
  const [coef, setCoef] = useState(start);
  const [removed, setRemoved] = useState(false);
  const [trail, setTrail] = useState([]);
  const [found, setFound] = useState([]);

  const tones = n === 3 ? [1, 2, 3] : [1, 2];
  const resultTone = n === 3 ? 0 : 3;
  const letters = ['a', 'b', 'c'];
  const active = vectors.map((_, i) => !(removed && i === removable));

  // Receitas testadas pela animação de entrada: uma grade de meio em meio.
  const sweepList = useMemo(() => {
    if (!sweep || n !== 2) return [];
    const out = [];
    for (let a = rg[0][0]; a <= rg[0][1] + 1e-9; a += sweepStep)
      for (let b = rg[1][0]; b <= rg[1][1] + 1e-9; b += sweepStep) out.push([a, b]);
    // ordem embaralhada, mas sempre a mesma (o quadro final não depende dela)
    let seed = 7;
    for (let i = out.length - 1; i > 0; i -= 1) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out.map(([a, b]) => [a * vectors[0].v[0] + b * vectors[1].v[0], a * vectors[0].v[1] + b * vectors[1].v[1]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const duration = 3.2;
  const {ref, t, play, playing} = useAnimation({duration, autoplay: sweepList.length > 0});
  const shownSweep = sweepList.slice(0, Math.round((sweepList.length * Math.min(t, duration - 0.4)) / (duration - 0.4)));

  const tip = [0, 0];
  const pieces = [];
  vectors.forEach(({v}, i) => {
    if (!active[i]) return;
    const from = [...tip];
    tip[0] += coef[i] * v[0];
    tip[1] += coef[i] * v[1];
    pieces.push({from, to: [...tip], i});
  });

  const trivial = coef.every((c, i) => !active[i] || near(c, 0));
  const atOrigin = near(tip[0], 0) && near(tip[1], 0);

  useEffect(() => {
    setTrail((old) => {
      const last = old[old.length - 1];
      if (last && near(last[0], tip[0]) && near(last[1], tip[1])) return old;
      return [...old.slice(-400), [...tip]];
    });
    if (zeroHunt) {
      if (atOrigin && !trivial) {
        setFound((old) => (old.some((r) => r.every((x, i) => near(x, coef[i]))) ? old : [...old, coef.map((c, i) => (active[i] ? c : 0))]));
      }
    } else {
      targets.forEach((tg) => {
        if (near(tip[0], tg.at[0]) && near(tip[1], tg.at[1])) {
          setFound((old) =>
            old.some((r) => r.name === tg.name && r.coef.every((x, i) => near(x, coef[i]))) ? old : [...old, {name: tg.name, at: tg.at, coef: [...coef]}],
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coef[0], coef[1], coef[2], removed]);

  const pl = makePlane(win, unit);
  const cross = vectors[0].v[0] * vectors[1].v[1] - vectors[0].v[1] * vectors[1].v[0];
  const parallel = n === 2 && near(cross, 0);

  // malha das receitas inteiras (só com dois vetores não paralelos)
  const latticeLines = [];
  if (lattice && n === 2 && !parallel) {
    const [u, v] = [vectors[0].v, vectors[1].v];
    for (let k = -12; k <= 12; k += 1) {
      latticeLines.push(fullLine(pl, [k * u[0], k * u[1]], v));
      latticeLines.push(fullLine(pl, [k * v[0], k * v[1]], u));
    }
  }
  const spanLine = parallel ? fullLine(pl, [0, 0], vectors[0].v) : null;

  const clipped = (
    <>
      {latticeLines.map(([a, b], i) => (
        <line key={`l${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="var(--mv-guide)" strokeWidth={1} strokeDasharray="5 5" />
      ))}
      {spanLine && (
        <line x1={spanLine[0][0]} y1={spanLine[0][1]} x2={spanLine[1][0]} y2={spanLine[1][1]} stroke={toneVar(3)} strokeWidth={7} strokeOpacity={0.25} />
      )}
      {[...shownSweep, ...trail].map((p, i) => {
        const s = pl.P(p);
        return <circle key={`t${i}`} cx={s[0]} cy={s[1]} r={2.6} fill={toneVar(resultTone)} fillOpacity={0.45} />;
      })}
      {n === 3 &&
        vectors.map(({v}, i) => (active[i] ? <Arrow key={`g${i}`} pl={pl} from={[0, 0]} to={v} tone={tones[i]} width={1.6} opacity={0.4} /> : null))}
      {pieces.map(({from, to, i}) => (
        <Arrow key={`p${i}`} pl={pl} from={from} to={to} tone={tones[i]} />
      ))}
      {!atOrigin && <Arrow pl={pl} from={[0, 0]} to={tip} tone={resultTone} width={n === 3 ? 1.8 : 2.6} dashed={n === 3} />}
    </>
  );

  const targetHit = (tg) => near(tip[0], tg.at[0]) && near(tip[1], tg.at[1]);
  const over = (
    <>
      {targets.map((tg) => {
        const s = pl.P(tg.at);
        const hit = targetHit(tg);
        return (
          <g key={tg.name}>
            <circle cx={s[0]} cy={s[1]} r={6} fill={hit ? toneVar(3) : 'var(--ifm-background-surface-color)'} stroke={hit ? toneVar(3) : 'var(--ifm-font-color-base)'} strokeWidth={2} />
            <SvgMath x={s[0] + (tg.dx ?? 0)} y={s[1] + (tg.dy ?? -18)} math={tg.label ?? tg.name} fontSize={13} halo anchor={tg.anchor ?? 'middle'} />
          </g>
        );
      })}
      {n === 3 &&
        vectors.map(({v, name}, i) =>
          active[i] ? (
            <SvgMath key={`gl${i}`} x={pl.X(v[0]) + (v[0] >= 0 ? 14 : -14)} y={pl.Y(v[1]) + (v[1] >= 0 ? -10 : 12)} math={name} fontSize={13} tone={tones[i]} halo />
          ) : null,
        )}
      {zeroHunt && (
        <circle cx={pl.X(0)} cy={pl.Y(0)} r={6} fill={atOrigin && !trivial ? toneVar(3) : 'none'} stroke="var(--ifm-font-color-base)" strokeWidth={2} />
      )}
      {pieces.map(({from, to, i}) => {
        const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
        if (len < 0.8) return null;
        const a = pl.P(from);
        const b = pl.P(to);
        const mx = (a[0] + b[0]) / 2;
        const my = (a[1] + b[1]) / 2;
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        // rótulo do lado da seta que fica longe da seta da origem até a
        // ponta, para o fundo do rótulo não apagar um pedaço dela
        let nx = ((b[1] - a[1]) / L) * 16;
        let ny = (-(b[0] - a[0]) / L) * 16;
        const o = pl.P([0, 0]);
        const e = pl.P(tip);
        const segDist = (x, y) => {
          const dx = e[0] - o[0];
          const dy = e[1] - o[1];
          const l2 = dx * dx + dy * dy || 1;
          const k = Math.max(0, Math.min(1, ((x - o[0]) * dx + (y - o[1]) * dy) / l2));
          return Math.hypot(x - o[0] - k * dx, y - o[1] - k * dy);
        };
        if (segDist(mx - nx, my - ny) > segDist(mx + nx, my + ny)) {
          nx = -nx;
          ny = -ny;
        }
        return (
          <SvgMath key={`lb${i}`} x={mx + nx} y={my + ny} math={`${mathNumber(coef[i], 2)}${vectors[i].name}`} fontSize={13} tone={tones[i]} halo />
        );
      })}
    </>
  );

  const termTex = vectors
    .map(({name}, i) => (active[i] ? `${i && coef[i] >= 0 ? '+ ' : i ? '' : ''}${mathNumber(coef[i], 2)}${name}` : null))
    .filter(Boolean)
    .join(' ');
  const pair = (p) => {
    const a = mathNumber(p[0], 2);
    const b = mathNumber(p[1], 2);
    const sep = a.includes('{,}') || b.includes('{,}') ? ';' : ',';
    return `(${a}${sep}\\ ${b})`;
  };

  let status;
  if (zeroHunt) {
    if (atOrigin && trivial) status = 'Esta é a receita parada, zero de tudo: ela sempre volta à origem e não conta.';
    else if (atOrigin) status = 'O caminho voltou à origem, e a receita não é zero de tudo.';
    else status = 'O caminho ainda não voltou à origem.';
  } else if (targets.length) {
    const hitNow = targets.find(targetHit);
    status = hitNow ? `A ponta chegou ao alvo ${hitNow.name}.` : 'A ponta ainda não está em nenhum alvo.';
  }

  return (
    <div className={shared.wrapper} data-explorer="span-combo">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <MiniPlane pl={pl} ticksEvery={ticksEvery} clipped={clipped} over={over} ariaLabel={caption} />
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.controls}>
        {vectors.map(({name}, i) =>
          active[i] ? (
            <label key={i} className={shared.control}>
              <span>
                Quanto de <Formula math={name} />: <strong>{letters[i]} = {mathNumber(coef[i], 2).replace('{,}', ',').replace('-', '−')}</strong>
              </span>
              <input
                type="range"
                min={rg[i][0]}
                max={rg[i][1]}
                step={step}
                value={coef[i]}
                disabled={playing}
                onChange={(e) => {
                  const value = round(Number(e.target.value), step);
                  setCoef((old) => old.map((x, j) => (j === i ? value : x)));
                }}
                aria-label={`Coeficiente ${letters[i]}`}
              />
            </label>
          ) : null,
        )}
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`${termTex} = ${pair(tip)}`} />
        </p>
        {status && <p>{status}</p>}
        {!zeroHunt && found.length > 0 && (
          <p>
            Receitas que acertaram:{' '}
            {found.map((r, k) => (
              <span key={`${r.name}${r.coef.join(',')}`}>
                {k > 0 && '; '}
                <Formula math={`${pair(r.at)}:\\ ${r.coef.map((c, i) => `${letters[i]} = ${mathNumber(c, 2)}`).join(',\\ ')}`} />
              </span>
            ))}
            .
          </p>
        )}
        {zeroHunt && (
          <p>
            Receitas que voltaram à origem sem ser zero de tudo:{' '}
            {found.length === 0
              ? 'nenhuma até agora.'
              : found.map((r, k) => (
                  <span key={r.join(',')}>
                    {k > 0 && '; '}
                    <Formula math={r.map((c, i) => `${letters[i]} = ${mathNumber(c, 2)}`).join(',\\ ')} />
                  </span>
                ))}
          </p>
        )}
      </div>

      <div className={shared.buttons}>
        {removable !== undefined && (
          <button
            type="button"
            aria-pressed={removed}
            onClick={() => {
              setRemoved((old) => !old);
              setCoef((old) => old.map((x, j) => (j === removable ? 0 : x)));
              setFound([]);
            }}
          >
            {removed ? 'Pôr o terceiro vetor de volta' : 'Tirar o terceiro vetor'}
          </button>
        )}
        <button type="button" onClick={() => setTrail([])}>
          Apagar o rastro
        </button>
        {sweepList.length > 0 && (
          <button type="button" onClick={() => play()} disabled={playing}>
            Testar a grade de receitas de novo
          </button>
        )}
      </div>
    </div>
  );
}
