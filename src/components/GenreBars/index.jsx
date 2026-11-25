import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {GENRES, CLIENTS, dec, listTex, norm, sub, rootTex} from './clientes';

// A linha de uma planilha como vetor, desenhada em barras (lição 11.2,
// Vetores com muitas coordenadas).
//
// Um vetor de cinco coordenadas não tem seta, mas tem perfil: uma barra por
// gênero de filme, sempre na mesma ordem. Cada modo anima uma conta feita
// posição com posição:
//
// - 'clients': os quatro clientes do problema; uma cópia das barras da Paula
//   estica para o dobro e cai exatamente sobre as barras do Gustavo;
// - 'row': a linha da tabela desce e vira a lista (6, 1, 0, 4, 3); o botão
//   troca as duas primeiras posições e mostra que sai outro cliente;
// - 'sum': as barras de um vetor se encostam nas do outro, gênero por gênero
//   (soma, dobro, média e a lista com uma coordenada a menos);
// - 'diff': as barras de dois clientes lado a lado e a diferença em cada
//   gênero, com sinal; o painel faz a distância;
// - 'normalize': cada perfil é dividido pelo próprio módulo; Paula e Gustavo
//   terminam com barras idênticas.

const tone = (k) => (k ? `var(--mv-tone-${k})` : 'var(--mv-guide)');
const txt = (name) => `\\text{${name}}`;

function Bar({x, y, w, h, k, opacity = 1, dashed = false, fillOpacity = 0.3}) {
  if (w <= 0.5) return null;
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={2}
      fill={tone(k)}
      fillOpacity={fillOpacity}
      stroke={tone(k)}
      strokeWidth={1.5}
      strokeDasharray={dashed ? '5 3' : undefined}
      opacity={opacity}
    />
  );
}

// ---------------------------------------------------------------------------
// 'clients': os quatro perfis do problema motivador.

function ClientsMode({caption}) {
  const PW = 232;
  const PH = 128;
  const NAME_X = 80;
  const X0 = 86;
  const SC = 9;
  const ROW = 18;
  const TOP = 36;
  const W = 2 * PW;
  const H = 2 * PH;
  const {ref, t, play, playing} = useAnimation({duration: 4.2});
  const grow = stage(t, 0, 1.2);
  const ghostIn = stage(t, 1.6, 2.2);
  const stretch = stage(t, 2.4, 3.8);
  const done = stretch > 0.98;
  const P = CLIENTS.Paula.v;
  const panels = [
    ['Paula', 0, 0],
    ['Gustavo', 1, 0],
    ['Carla', 0, 1],
    ['Davi', 1, 1],
  ];

  return (
    <div className={shared.wrapper} data-explorer="genre-bars-clients">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="Quatro perfis de barras, um por cliente, com os filmes vistos em cada gênero. As barras do Gustavo são exatamente o dobro das barras da Paula.">
          {panels.map(([name, col, row]) => {
            const c = CLIENTS[name];
            const title = name === 'Gustavo' && done ? `${txt('Gustavo')} = 2 \\times ${txt('Paula')}` : txt(name);
            return (
              <g key={name} transform={`translate(${col * PW}, ${row * PH})`}>
                <SvgMath x={6} y={14} math={title} anchor="start" fontSize={14} tone={c.tone} space={PW - 8} />
                {GENRES.map((g, i) => {
                  const y = TOP + i * ROW;
                  const w = c.v[i] * SC * grow;
                  return (
                    <g key={g}>
                      <SvgMath x={NAME_X} y={y} math={txt(g)} anchor="end" fontSize={11} space={NAME_X - 2} />
                      <line x1={X0} x2={X0} y1={y - 8} y2={y + 8} stroke="var(--mv-guide)" strokeWidth={1} />
                      <Bar x={X0} y={y - 6} w={w} h={12} k={c.tone} />
                      {name === 'Gustavo' && ghostIn > 0 && P[i] > 0 && (
                        <rect
                          x={X0 - 2}
                          y={y - 9}
                          width={P[i] * SC * (1 + stretch) + 4}
                          height={18}
                          rx={3}
                          fill="none"
                          stroke={tone(1)}
                          strokeWidth={1.5}
                          strokeDasharray="4 3"
                          opacity={ghostIn}
                        />
                      )}
                      <g opacity={grow}>
                        <SvgMath x={X0 + c.v[i] * SC * grow + 8} y={y} math={String(c.v[i])} anchor="start" fontSize={12} space={40} />
                      </g>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p>
          {done
            ? 'O contorno tracejado é uma cópia das barras da Paula esticada para o dobro. Ele cai exatamente sobre as barras do Gustavo, em todos os gêneros: 12 = 2 × 6, 2 = 2 × 1, 0 = 2 × 0, 8 = 2 × 4 e 6 = 2 × 3.'
            : 'Uma cópia das barras da Paula vai ser esticada para o dobro.'}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 'row': a linha da tabela vira a lista em ordem.

function RowMode({caption}) {
  const W = 460;
  const H = 268;
  const COL0 = 86;
  const CW = 74;
  const cx = (i) => COL0 + CW / 2 + i * CW;
  const ROW_Y = 50;
  const BASE = 196;
  const VEC_Y = 220;
  const SC = 12;
  const [swapped, setSwapped] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: 3.8});
  const P = CLIENTS.Paula.v;
  const target = (i) => (swapped && i < 2 ? 1 - i : i);
  const shown = swapped ? [P[1], P[0], ...P.slice(2)] : P;
  const tableIn = stage(t, 0, 0.5);
  const drop = (i) => stage(t, 0.7 + i * 0.15, 1.7 + i * 0.15);
  const punct = stage(t, 2.3, 2.7);
  const bars = stage(t, 2.7, 3.7);

  return (
    <div className={shared.wrapper} data-explorer="genre-bars-row">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="A linha da Paula na tabela desce e vira a lista (6, 1, 0, 4, 3), com uma barra por posição.">
          <g opacity={tableIn}>
            {GENRES.map((g, i) => (
              <SvgMath key={g} x={cx(i)} y={20} math={txt(g)} fontSize={11} space={CW + 10} />
            ))}
            <rect x={4} y={ROW_Y - 15} width={COL0 - 8} height={30} fill="none" stroke="var(--mv-guide)" />
            <SvgMath x={COL0 / 2} y={ROW_Y} math={txt('Paula')} fontSize={14} tone={1} />
            {P.map((x, i) => (
              <g key={i}>
                <rect x={COL0 + i * CW + 2} y={ROW_Y - 15} width={CW - 4} height={30} fill="none" stroke="var(--mv-guide)" />
                <g opacity={0.35 + 0.65 * (1 - drop(i))}>
                  <SvgMath x={cx(i)} y={ROW_Y} math={String(x)} fontSize={15} />
                </g>
              </g>
            ))}
          </g>

          {/* barras, em cima da posição em que cada número caiu */}
          <line x1={COL0} x2={W - 4} y1={BASE} y2={BASE} stroke="var(--mv-guide)" strokeWidth={1} opacity={bars} />
          {shown.map((x, j) => (
            <Bar key={j} x={cx(j) - 15} y={BASE - x * SC * bars} w={30} h={x * SC * bars} k={1} />
          ))}

          {/* os números descem da tabela até a lista */}
          {P.map((x, i) => {
            const k = drop(i);
            const x0 = cx(i);
            const x1 = cx(target(i));
            return (
              <g key={i} opacity={k > 0.01 ? 1 : 0}>
                <SvgMath x={x0 + (x1 - x0) * k} y={ROW_Y + (VEC_Y - ROW_Y) * k} math={String(x)} fontSize={17} tone={1} />
              </g>
            );
          })}

          <g opacity={punct}>
            <SvgMath x={COL0 + 4} y={VEC_Y} math={swapped ? '?\\ =\\ \\Big(' : '\\vec{p} = \\Big('} anchor="end" fontSize={17} space={COL0} />
            {[0, 1, 2, 3].map((i) => (
              <SvgMath key={i} x={COL0 + (i + 1) * CW} y={VEC_Y + 3} math="," fontSize={17} />
            ))}
            <SvgMath x={W - 8} y={VEC_Y} math="\Big)" fontSize={17} anchor="end" space={20} />
            {GENRES.map((g, i) => (
              <SvgMath key={g} x={cx(i)} y={VEC_Y + 30} math={`p_${i + 1}`} fontSize={12} />
            ))}
          </g>
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        {swapped ? (
          <p>
            Os mesmos cinco números, em outra ordem, formam a lista <Formula math="(1,\ 6,\ 0,\ 4,\ 3)" />. Ela
            descreve outra cliente: 1 filme de ação e 6 de comédia. Não é a Paula.
          </p>
        ) : (
          <p>
            A linha da Paula vira o vetor <Formula math="\vec{p} = (6,\ 1,\ 0,\ 4,\ 3)" />. A primeira posição é
            sempre ação, a segunda é sempre comédia, e assim por diante: <Formula math="p_4 = 4" /> são os filmes de
            terror.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
        <button
          type="button"
          aria-pressed={swapped}
          disabled={playing}
          onClick={() => {
            setSwapped(!swapped);
            play();
          }}
        >
          {swapped ? 'Voltar à ordem da tabela' : 'Trocar as duas primeiras posições'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 'sum': as barras de um vetor se encostam nas do outro, posição com posição.

const SUM_CASES = {
  soma: {
    label: 'Paula + Carla',
    title: `${txt('Paula')} + ${txt('Carla')}`,
    a: CLIENTS.Paula.v,
    b: CLIENTS.Carla.v,
    kb: 2,
    duration: 3.6,
  },
  dobro: {
    label: '2 × Paula',
    title: `2 \\times ${txt('Paula')} = ${txt('Paula')} + ${txt('Paula')}`,
    a: CLIENTS.Paula.v,
    b: CLIENTS.Paula.v,
    kb: 1,
    copy: true,
    duration: 3.6,
  },
  media: {
    label: 'Média de Paula e Carla',
    title: `\\tfrac{1}{2}(${txt('Paula')} + ${txt('Carla')})`,
    a: CLIENTS.Paula.v,
    b: CLIENTS.Carla.v,
    kb: 2,
    half: true,
    duration: 5,
  },
  falta: {
    label: 'Uma lista com 4 números',
    title: `${txt('Paula')} + (2,\\ 5,\\ 1,\\ 0)`,
    a: CLIENTS.Paula.v,
    b: [2, 5, 1, 0],
    kb: 2,
    duration: 3.6,
  },
};

function SumMode({cases = ['soma', 'dobro', 'media', 'falta'], initial = 'soma', caption}) {
  const W = 460;
  const X0 = 104;
  const SC = 24;
  const ROW = 32;
  const TOP = 50;
  const H = TOP + 5 * ROW;
  const [key, setKey] = useState(initial);
  const c = SUM_CASES[key];
  const {ref, t, play, playing} = useAnimation({duration: SUM_CASES[initial].duration});
  const aIn = stage(t, 0, 0.7);
  const attach = (i) => stage(t, 0.9 + i * 0.35, 1.5 + i * 0.35);
  const totalsIn = stage(t, 3.0, 3.4);
  const halve = c.half ? stage(t, 3.7, 4.7) : 0;
  const missing = c.b.length !== c.a.length;
  const totals = c.a.map((x, i) => (missing ? null : x + c.b[i]));
  const factor = 1 - 0.5 * halve;

  let readout;
  if (missing) {
    readout = (
      <p>
        A quinta posição (documentário) da Paula não tem par: a outra lista tem só quatro números. A soma{' '}
        <strong>não está definida</strong>. Completar com zero inventaria um dado que ninguém mediu.
      </p>
    );
  } else if (c.half) {
    readout = (
      <p>
        Primeiro a soma, <Formula math="(9,\ 4,\ 4,\ 5,\ 5)" />. Depois cada barra encolhe para a metade:{' '}
        <Formula math="\tfrac{1}{2}(9,\ 4,\ 4,\ 5,\ 5) = (4{,}5;\ 2;\ 2;\ 2{,}5;\ 2{,}5)" />, o perfil médio das duas.
      </p>
    );
  } else if (c.copy) {
    readout = (
      <p>
        Cada barra recebe uma cópia dela mesma: <Formula math="2(6,\ 1,\ 0,\ 4,\ 3) = (12,\ 2,\ 0,\ 8,\ 6)" />. É
        exatamente o perfil do Gustavo.
      </p>
    );
  } else {
    readout = (
      <p>
        Gênero com gênero: <Formula math="(6,\ 1,\ 0,\ 4,\ 3) + (3,\ 3,\ 4,\ 1,\ 2) = (9,\ 4,\ 4,\ 5,\ 5)" />. Na
        conta da família, são 9 filmes de ação, 4 de comédia, 4 de drama, 5 de terror e 5 documentários.
      </p>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="genre-bars-sum">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="Barras de dois vetores encostadas gênero por gênero.">
          <SvgMath x={X0} y={18} math={c.title} anchor="start" fontSize={15} space={W - X0} />
          <line x1={X0} x2={X0} y1={TOP - 16} y2={H - 8} stroke="var(--mv-guide)" strokeWidth={1} />
          {GENRES.map((g, i) => {
            const y = TOP + i * ROW;
            const a = c.a[i];
            const b = c.b[i];
            const k = attach(i);
            const wa = a * SC * factor;
            const wb = b === undefined ? 0 : b * SC * factor;
            const xb = X0 + wa + (1 - k) * 50;
            const total = totals[i];
            const showTotal = !missing && totalsIn > 0 && (!c.half || halve > 0.98 || halve < 0.02);
            const value = total === null ? null : c.half && halve > 0.98 ? total / 2 : total;
            return (
              <g key={g}>
                <SvgMath x={X0 - 8} y={y} math={txt(g)} anchor="end" fontSize={13} space={X0 - 8} />
                <Bar x={X0} y={y - 9} w={wa * aIn} h={18} k={1} />
                {b !== undefined && (
                  <Bar x={xb} y={y - 9} w={wb} h={18} k={c.kb} opacity={k} dashed={c.copy} fillOpacity={c.copy ? 0.15 : 0.3} />
                )}
                {b === undefined && k > 0.01 && (
                  <g opacity={k}>
                    <rect x={X0 + wa + 4} y={y - 11} width={40} height={22} rx={3} fill="none" stroke={tone(2)} strokeWidth={1.5} strokeDasharray="4 3" />
                    <SvgMath x={X0 + wa + 24} y={y} math="?" fontSize={15} tone={2} />
                  </g>
                )}
                {showTotal && value !== null && (
                  <g opacity={totalsIn}>
                    <SvgMath x={X0 + wa + wb + 10} y={y} math={dec(value, 1)} anchor="start" fontSize={14} space={W - X0 - wa - wb - 10} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        {readout}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play({duration: c.duration})} disabled={playing}>
          Ver de novo
        </button>
      </div>
      {cases.length > 1 && (
        <div className={shared.buttons}>
          {cases.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={k === key}
              disabled={playing}
              onClick={() => {
                setKey(k);
                play({duration: SUM_CASES[k].duration});
              }}
            >
              {SUM_CASES[k].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 'diff': a diferença gênero por gênero, com sinal.

function DiffMode({pairs = [['Paula', 'Carla'], ['Paula', 'Gustavo']], caption}) {
  const W = 460;
  const X0 = 104;
  const SC = 20;
  const ROW = 42;
  const TOP = 50;
  const H = TOP + 5 * ROW - 8;
  const [idx, setIdx] = useState(0);
  const [nameA, nameB] = pairs[idx];
  const A = CLIENTS[nameA];
  const B = CLIENTS[nameB];
  const {ref, t, play, playing} = useAnimation({duration: 3.4});
  const barsIn = stage(t, 0, 0.7);
  const diffIn = (i) => stage(t, 0.9 + i * 0.4, 1.4 + i * 0.4);
  const d = sub(A.v, B.v);
  const d2 = d.reduce((s, x) => s + x * x, 0);
  const la = A.letter;
  const lb = B.letter;

  return (
    <div className={shared.wrapper} data-explorer="genre-bars-diff">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label={`Barras de ${nameA} e ${nameB} em cada gênero, com a diferença entre elas.`}>
          <SvgMath x={X0} y={16} math={`${txt(nameA)}\\ \\text{(em cima)}\\quad ${txt(nameB)}\\ \\text{(embaixo)}`} anchor="start" fontSize={13} space={W - X0} />
          <line x1={X0} x2={X0} y1={TOP - 20} y2={H - 4} stroke="var(--mv-guide)" strokeWidth={1} />
          {GENRES.map((g, i) => {
            const y = TOP + i * ROW;
            const xa = X0 + A.v[i] * SC;
            const xb = X0 + B.v[i] * SC;
            const k = diffIn(i);
            const lo = Math.min(xa, xb);
            const hi = Math.max(xa, xb);
            return (
              <g key={g}>
                <SvgMath x={X0 - 8} y={y} math={txt(g)} anchor="end" fontSize={13} space={X0 - 8} />
                <Bar x={X0} y={y - 15} w={(xa - X0) * barsIn} h={11} k={A.tone} />
                <Bar x={X0} y={y + 4} w={(xb - X0) * barsIn} h={11} k={B.tone} dashed={A.tone === B.tone} />
                <g opacity={k}>
                  {hi - lo > 0.5 && (
                    <>
                      <line x1={lo} x2={lo + (hi - lo) * k} y1={y} y2={y} stroke={tone(3)} strokeWidth={2.5} />
                      <line x1={lo} x2={lo} y1={y - 5} y2={y + 5} stroke={tone(3)} strokeWidth={2} />
                      <line x1={hi} x2={hi} y1={y - 5} y2={y + 5} stroke={tone(3)} strokeWidth={2} />
                    </>
                  )}
                  <SvgMath
                    x={W - 6}
                    y={y}
                    math={`${A.v[i]} - ${B.v[i]} = ${d[i]}`}
                    anchor="end"
                    fontSize={13}
                    tone={3}
                    space={110}
                  />
                </g>
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`\\vec{${la}} - \\vec{${lb}} = ${listTex(d)}`} />
        </p>
        <p className={shared.formula}>
          <Formula
            math={`\\lVert \\vec{${la}} - \\vec{${lb}} \\rVert = \\sqrt{${d.map((x) => x * x).join(' + ')}} = ${rootTex(d2)} \\approx ${dec(Math.sqrt(d2), 2)}`}
          />
        </p>
        {nameB === 'Gustavo' && (
          <p>
            As diferenças são grandes em quase todo gênero, embora o Gustavo tenha o mesmo gosto da Paula: ele só vê
            o dobro de filmes.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
        {pairs.length > 1 &&
          pairs.map(([a, b], j) => (
            <button
              key={`${a}-${b}`}
              type="button"
              aria-pressed={j === idx}
              disabled={playing}
              onClick={() => {
                setIdx(j);
                play();
              }}
            >
              {a} e {b}
            </button>
          ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 'normalize': cada perfil dividido pelo próprio módulo.

function NormalizeMode({clients = ['Paula', 'Gustavo', 'Carla'], caption}) {
  const NAME_R = 88;
  const COL = 122;
  const C0 = 96;
  const W = C0 + clients.length * COL;
  const ROW = 30;
  const TOP = 62;
  const H = TOP + 5 * ROW - 6;
  const SC0 = 7;
  const SC1 = 96;
  const {ref, t, play, playing} = useAnimation({duration: 3.4});
  const k = stage(t, 0.6, 2.8);
  const after = k > 0.5;

  return (
    <div className={shared.wrapper} data-explorer="genre-bars-normalize">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img"
          aria-label="Perfis de barras de três clientes antes e depois de divididos pelo próprio módulo.">
          {GENRES.map((g, i) => (
            <SvgMath key={g} x={NAME_R} y={TOP + i * ROW} math={txt(g)} anchor="end" fontSize={12} space={NAME_R} />
          ))}
          {clients.map((name, j) => {
            const c = CLIENTS[name];
            const len = norm(c.v);
            const x0 = C0 + j * COL;
            const head = after
              ? `\\lVert \\hat{${c.letter}} \\rVert = 1`
              : `\\lVert \\vec{${c.letter}} \\rVert \\approx ${dec(len, 2)}`;
            return (
              <g key={name}>
                <SvgMath x={x0} y={14} math={txt(name)} anchor="start" fontSize={14} tone={c.tone} space={COL - 4} />
                <SvgMath x={x0} y={36} math={head} anchor="start" fontSize={12} space={COL - 4} />
                <line x1={x0} x2={x0} y1={TOP - 14} y2={H - 4} stroke="var(--mv-guide)" strokeWidth={1} />
                {c.v.map((x, i) => {
                  const y = TOP + i * ROW;
                  const px = (1 - k) * x * SC0 + k * (x / len) * SC1;
                  const label = after ? (x === 0 ? '0' : (x / len).toFixed(3).replace('.', '{,}')) : String(x);
                  return (
                    <g key={i}>
                      <Bar x={x0} y={y - 8} w={px} h={16} k={c.tone} />
                      <SvgMath x={x0 + px + 5} y={y} math={label} anchor="start" fontSize={11} space={COL - px - 6} />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p>
          {after ? (
            <>
              Depois de divididos pelo próprio módulo, Paula e Gustavo ficam com as mesmas barras:{' '}
              <Formula math="\hat{p} = \hat{g} \approx (0{,}762;\ 0{,}127;\ 0;\ 0{,}508;\ 0{,}381)" />. A Carla
              continua com outro formato, porque divide o tempo de outro jeito entre os gêneros.
            </>
          ) : (
            'Antes: o Gustavo tem as barras mais compridas, porque vê mais filmes.'
          )}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}

export default function GenreBars({mode = 'clients', ...props}) {
  if (mode === 'row') return <RowMode {...props} />;
  if (mode === 'sum') return <SumMode {...props} />;
  if (mode === 'diff') return <DiffMode {...props} />;
  if (mode === 'normalize') return <NormalizeMode {...props} />;
  return <ClientsMode {...props} />;
}
