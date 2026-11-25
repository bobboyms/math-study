import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';

// O plano de lanches do atleta como uma busca (lição 11.4, problema
// motivador).
//
// Três deslizantes escolhem as porções de cada alimento. Cada alimento traz
// os três nutrientes ao mesmo tempo, e as barras mostram o total de cada
// nutriente contra a meta (o traço vertical). Mexer num alimento mexe nas três
// barras de uma vez: acertar uma meta costuma estragar outra. A barra fica
// verde quando acerta a meta, azul quando falta e laranja quando passa. O
// botão "Anotar" guarda a tentativa numa tabela.

const W = 440;
const X0 = 116;
const SCALE = 180;
const BW = W - X0 - 24;
const TOP = 36;
const RH = 52;

export default function SystemSnackPlan({
  foods = [
    {name: 'iogurte', per: [10, 10, 5]},
    {name: 'granola', per: [5, 20, 5]},
    {name: 'castanhas', per: [5, 5, 15]},
  ],
  nutrients = ['proteína', 'carboidrato', 'gordura'],
  targets = [45, 90, 55],
  initial = [1, 1, 1],
  max = 5,
  caption,
}) {
  const [q, setQ] = useState(initial);
  const [log, setLog] = useState([]);
  const totals = nutrients.map((_, i) => foods.reduce((s, f, j) => s + f.per[i] * q[j], 0));
  const hits = totals.filter((v, i) => v === targets[i]).length;
  const X = (g) => X0 + (Math.min(g, SCALE) / SCALE) * BW;
  const H = TOP + (nutrients.length - 1) * RH + 40;

  return (
    <div className={shared.wrapper} data-explorer="system-snack-plan">
      <figure className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={`Totais: ${totals.map((v, i) => `${nutrients[i]} ${v} g, meta ${targets[i]} g`).join('; ')}.`}>
          {[0, 50, 100, 150].map((g) => (
            <g key={g}>
              <line x1={X(g)} x2={X(g)} y1={TOP - 18} y2={TOP + (nutrients.length - 1) * RH + 16} stroke="var(--mv-guide)" strokeWidth={0.8} strokeDasharray="3 4" />
              <SvgMath x={X(g)} y={H - 10} math={`${g}\\text{ g}`} fontSize={11} />
            </g>
          ))}
          {nutrients.map((nm, i) => {
            const y = TOP + i * RH;
            const v = totals[i];
            const tone = v === targets[i] ? 3 : v < targets[i] ? 1 : 2;
            return (
              <g key={nm}>
                <SvgMath x={X0 - 10} y={y} math={`\\text{${nm}}`} anchor="end" space={X0 - 12} fontSize={13} />
                <rect x={X0} y={y - 11} width={Math.max(1, X(v) - X0)} height={22} rx={3} fill={`var(--mv-tone-${tone})`} fillOpacity={0.8} />
                <line x1={X(targets[i])} x2={X(targets[i])} y1={y - 17} y2={y + 17} stroke="var(--ifm-font-color-base)" strokeWidth={2.4} />
                <SvgMath x={X(targets[i])} y={y - 24} math={`\\text{meta } ${targets[i]}`} fontSize={11} halo />
                <SvgMath x={Math.min(X(v), W - 40) + 6} y={y} math={`${v}`} anchor="start" fontSize={13} halo />
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        {foods.map((f, j) => (
          <label key={f.name} className={shared.control}>
            <span>
              Porções de {f.name}: <strong>{q[j]}</strong>
            </span>
            <input
              type="range"
              min={0}
              max={max}
              step={1}
              value={q[j]}
              onChange={(e) => {
                const next = q.slice();
                next[j] = Number(e.target.value);
                setQ(next);
              }}
              aria-label={`Porções de ${f.name}`}
            />
          </label>
        ))}
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {nutrients.map((nm, i) => {
          const v = totals[i];
          const diff = v - targets[i];
          return (
            <p key={nm} className={shared.formula}>
              <span>{nm[0].toUpperCase() + nm.slice(1)}: </span>
              <Formula math={`${foods.map((f, j) => `${f.per[i]} \\times ${q[j]}`).join(' + ')} = ${v}\\text{ g}`} />
              <span>{diff === 0 ? ', na meta.' : diff < 0 ? `, faltam ${-diff} g.` : `, passou ${diff} g.`}</span>
            </p>
          );
        })}
        <p>
          <strong>
            {hits === 3 ? 'As três metas foram atingidas ao mesmo tempo.' : `Metas atingidas: ${hits} de 3.`}
          </strong>
        </p>
        {log.length > 0 && (
          <div style={{overflowX: 'auto'}}>
          <table style={{fontSize: '0.88rem', margin: 0}}>
            <thead>
              <tr>
                {foods.map((f) => (
                  <th key={f.name}>{f.name}</th>
                ))}
                {nutrients.map((nm) => (
                  <th key={nm}>{nm} (g)</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.map((row, r) => (
                <tr key={r}>
                  {row.q.map((v, j) => (
                    <td key={`q${j}`}>{v}</td>
                  ))}
                  {row.t.map((v, i) => (
                    <td key={`t${i}`}>
                      {v === targets[i] ? <strong>{v}</strong> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => setLog([...log.slice(-7), {q: q.slice(), t: totals.slice()}])}>
          Anotar esta tentativa
        </button>
        {log.length > 0 && (
          <button type="button" onClick={() => setLog([])}>
            Limpar as anotações
          </button>
        )}
      </div>
    </div>
  );
}
