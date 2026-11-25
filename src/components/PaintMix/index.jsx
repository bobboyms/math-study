import React, {useEffect, useState} from 'react';
import Formula, {mathNumber} from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation from '../mathviz/useAnimation';
import {BASES, PIGMENTS, mix, plain, tripleMath, toneVar, GramAxis, StackBar, TotalLabel} from './bars';

// A loja de tintas (lição 11.5): misturar bases é somar pigmentos.
//
// Três barras, uma por pigmento (ciano, magenta, amarelo). Cada barra é uma
// pilha de pedaços, um por base: o pedaço azul é o que vem de P, o laranja o
// que vem de Q, o verde o que vem de R. A altura do pedaço é “litros daquela
// base × gramas por litro”. Por isso a altura total de cada barra é uma
// coordenada da combinação linear a·p + b·q + c·r.
//
// Com `targets`, a figura vira uma busca: os tracejados marcam a fórmula do
// alvo escolhido, e o painel guarda as receitas que acertaram. Com `pour`, a
// figura despeja a receita dada litro a litro ao entrar na tela.

const W = 470;
const H = 330;
const BASE_Y = 280;
const TOP_Y = 46;
const AXIS_X = 58;
const BAR_W = 62;
const CENTERS = [150, 262, 374];

export default function PaintMix({
  names = ['P', 'Q', 'R'],
  max = 3,
  step = 0.5,
  maxG = 20,
  initial = [0, 0, 0],
  pour,
  targets = [],
  caption,
}) {
  const [liters, setLiters] = useState(pour ?? initial);
  const [targetIndex, setTargetIndex] = useState(0);
  const [found, setFound] = useState({});

  const perLiter = 0.45;
  const total = pour ? pour.reduce((s, x) => s + Math.abs(x), 0) : 0;
  const duration = pour ? 0.4 + perLiter * total + 0.3 : 1;
  const {ref, t, play, playing} = useAnimation({
    duration,
    autoplay: Boolean(pour),
    onFrame: (time) => {
      if (pour && time >= duration) setLiters(pour);
    },
  });

  // Durante o despejo, os litros crescem continuamente, uma base de cada vez.
  let shown = liters;
  if (pour && t < duration) {
    let left = Math.max(0, t - 0.4) / perLiter;
    shown = pour.map((x) => {
      const take = Math.min(Math.abs(x), left);
      left -= take;
      return Math.sign(x) * take;
    });
  }

  const scale = (BASE_Y - TOP_Y) / maxG;
  const result = mix(names, shown);
  const target = targets[targetIndex];
  const settled = !playing && (!pour || t >= duration);
  const hit = target && result.every((g, k) => Math.abs(g - target.at[k]) < 1e-9);

  useEffect(() => {
    if (!settled || !hit) return;
    const key = target.name;
    setFound((old) => {
      const list = old[key] ?? [];
      if (list.some((r) => r.every((x, i) => Math.abs(x - liters[i]) < 1e-9))) return old;
      return {...old, [key]: [...list, liters]};
    });
  }, [hit, settled, liters, target]);

  const recipeTex = names
    .map((n, i) => `${i ? '+ ' : ''}${mathNumber(shown[i], 2)}${BASES[n].tex}`)
    .join(' ');

  const diffs = target
    ? PIGMENTS.map((pg, k) => {
        const d = target.at[k] - result[k];
        if (Math.abs(d) < 1e-9) return null;
        return d > 0 ? `faltam ${plain(d)} g de ${pg}` : `sobram ${plain(-d)} g de ${pg}`;
      }).filter(Boolean)
    : [];

  return (
    <div className={shared.wrapper} data-explorer="paint-mix">
      <figure ref={ref} style={{margin: '0 0 1rem'}}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{display: 'block', width: '100%', maxWidth: `${W}px`, height: 'auto', margin: '0 auto'}}
          role="img"
          aria-label="Três barras, uma por pigmento, empilhadas com a parte que vem de cada base."
        >
          <GramAxis x={AXIS_X} base={BASE_Y} top={TOP_Y} maxG={maxG} scale={scale} every={maxG > 12 ? 2 : 1} />
          <line x1={AXIS_X} y1={BASE_Y} x2={W - 20} y2={BASE_Y} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.3} />
          {PIGMENTS.map((pg, k) => {
            const cx = CENTERS[k];
            const pieces = names.map((n, i) => ({grams: shown[i] * BASES[n].v[k], tone: BASES[n].tone}));
            const tg = target?.at[k];
            return (
              <g key={pg}>
                <StackBar cx={cx} width={BAR_W} base={BASE_Y} scale={scale} pieces={pieces} />
                {tg !== undefined && (
                  <g>
                    <line
                      x1={cx - BAR_W / 2 - 8}
                      x2={cx + BAR_W / 2 + 8}
                      y1={BASE_Y - tg * scale}
                      y2={BASE_Y - tg * scale}
                      stroke="var(--ifm-font-color-base)"
                      strokeWidth={2}
                      strokeDasharray={hit ? undefined : '6 4'}
                    />
                  </g>
                )}
                <TotalLabel cx={cx} y={BASE_Y - result[k] * scale - 14} grams={result[k]} />
                <text x={cx} y={BASE_Y + 20} textAnchor="middle" fontSize={13} fill="var(--ifm-font-color-base)">
                  {pg}
                </text>
              </g>
            );
          })}
          {/* legenda das cores */}
          {names.map((n, i) => (
            <g key={n} transform={`translate(${150 + i * 104}, ${BASE_Y + 38})`}>
              <rect x={0} y={-9} width={14} height={12} fill={toneVar(BASES[n].tone)} fillOpacity={0.85} />
              <text x={20} y={1} fontSize={12} fill="var(--ifm-font-color-base)">
                {`base ${n}`}
              </text>
            </g>
          ))}
          {target && (
            <SvgMath
              x={W - 14}
              y={TOP_Y - 26}
              anchor="end"
              space={300}
              math={`\\text{alvo: ${target.name} } ${tripleMath(target.at)}`}
              fontSize={13}
              halo
            />
          )}
        </svg>
        <figcaption className={shared.caption} style={{textAlign: 'center'}}>
          {caption ??
            'Cada barra é um pigmento. A barra empilha a parte que vem de cada base: litros daquela base vezes os gramas por litro. A altura total é a quantidade de pigmento na lata.'}
        </figcaption>
      </figure>

      <div className={shared.controls}>
        {names.map((n, i) => (
          <label key={n} className={shared.control}>
            <span>
              Litros da base {n}: <strong>{plain(liters[i])}</strong>
            </span>
            <input
              type="range"
              min={0}
              max={max}
              step={step}
              value={liters[i]}
              disabled={playing}
              onChange={(e) => {
                const value = Number(e.target.value);
                setLiters((old) => old.map((x, j) => (j === i ? value : x)));
              }}
              aria-label={`Litros da base ${n}`}
            />
          </label>
        ))}
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`${recipeTex} = ${tripleMath(result)}`} />
        </p>
        {target && (
          <p>
            {hit
              ? `A lata saiu igual ao ${target.name}.`
              : `Ainda não é o ${target.name}: ${diffs.join('; ')}.`}
          </p>
        )}
        {targets.map((tg) =>
          found[tg.name]?.length ? (
            <p key={tg.name}>
              Receitas que deram o {tg.name}:{' '}
              {found[tg.name].map((r, i) => (
                <span key={r.join(',')}>
                  {i > 0 && '; '}
                  {names.map((n, j) => `${plain(r[j])} L de ${n}`).join(', ')}
                </span>
              ))}
              .
            </p>
          ) : null,
        )}
      </div>

      <div className={shared.buttons}>
        {targets.length > 1 &&
          targets.map((tg, i) => (
            <button
              key={tg.name}
              type="button"
              aria-pressed={i === targetIndex}
              onClick={() => setTargetIndex(i)}
            >
              Alvo: {tg.name} ({tg.at.join(', ')})
            </button>
          ))}
        {pour && (
          <button type="button" onClick={() => play()} disabled={playing}>
            Despejar a receita de novo
          </button>
        )}
      </div>
    </div>
  );
}
