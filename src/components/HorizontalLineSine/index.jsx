import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';

// O teste da reta horizontal aplicado ao seno.
//
// Uma reta horizontal y = k (deslizante) corta o gráfico do seno. O painel
// conta os cortes dentro da janela e lembra que o gráfico continua para os
// dois lados. Com `pieces`, aparecem botões de trechos candidatos: o resto do
// gráfico fica tracejado, só os cortes dentro do trecho escolhido contam, e o
// painel diz se o trecho serve para inverter o seno (não repete altura e
// alcança todas as alturas de −1 a 1).

const PI = Math.PI;
const X_MIN = -2 * PI - 0.35;
const X_MAX = 2 * PI + 0.45;

const PIECES = {
  tudo: {
    label: 'Gráfico inteiro',
    tex: '\\mathbb{R}',
    domain: null,
  },
  principal: {
    label: 'De −π/2 a π/2',
    tex: '\\left[-\\tfrac{\\pi}{2},\\ \\tfrac{\\pi}{2}\\right]',
    domain: [-PI / 2, PI / 2],
    verdict: 'Serve. Neste trecho o seno só sobe, de −1 até 1. Cada altura de −1 a 1 aparece uma vez, e nenhuma fica de fora.',
  },
  meiaVolta: {
    label: 'De 0 a π',
    tex: '[0,\\ \\pi]',
    domain: [0, PI],
    verdict: 'Não serve. O seno sobe até 1 e desce de volta: as alturas entre 0 e 1 aparecem duas vezes. E as alturas negativas não aparecem nenhuma vez.',
  },
  quarto: {
    label: 'De 0 a π/2',
    tex: '\\left[0,\\ \\tfrac{\\pi}{2}\\right]',
    domain: [0, PI / 2],
    verdict: 'Não repete nada, mas não serve: as alturas negativas não aparecem. A inversa ficaria sem resposta para sen x = −0,5.',
  },
  outro: {
    label: 'De π/2 a 3π/2',
    tex: '\\left[\\tfrac{\\pi}{2},\\ \\tfrac{3\\pi}{2}\\right]',
    domain: [PI / 2, (3 * PI) / 2],
    verdict: 'Também serve: aqui o seno só desce, de 1 até −1, sem repetir e sem deixar altura de fora. A convenção escolheu o outro trecho, que contém o zero.',
  },
};

// Todos os x da janela com sen x = k, cada um com o nome dele em função de
// α = arcsen k: α + 2nπ (mesmo lugar do ciclo) ou (2n + 1)π − α (o espelho).
function crossings(k, a, b) {
  if (Math.abs(k) > 1) return [];
  const base = Math.asin(k);
  const out = [];
  const add = (x, tex) => {
    if (x >= a - 1e-9 && x <= b + 1e-9 && !out.some((c) => Math.abs(c.x - x) < 1e-6)) out.push({x, tex});
  };
  for (let n = -3; n <= 3; n += 1) {
    const turns = n === 0 ? '' : `${n > 0 ? ' + ' : ' - '}${Math.abs(n) === 1 ? '' : Math.abs(n)}2\\pi`;
    add(base + 2 * PI * n, `\\alpha${turns}`.replace(/(\d)2\\pi/, (m, d) => `${2 * Number(d)}\\pi`));
    const odd = 2 * n + 1;
    add(PI - base + 2 * PI * n, `${odd === 1 ? '' : odd === -1 ? '-' : odd}\\pi - \\alpha`);
  }
  return out.sort((p, q) => p.x - q.x);
}

const ticks = [
  {at: -2 * PI, label: '-2\\pi'},
  {at: (-3 * PI) / 2, label: '-\\frac{3\\pi}{2}'},
  {at: -PI, label: '-\\pi'},
  {at: -PI / 2, label: '-\\frac{\\pi}{2}'},
  {at: PI / 2, label: '\\frac{\\pi}{2}'},
  {at: PI, label: '\\pi'},
  {at: (3 * PI) / 2, label: '\\frac{3\\pi}{2}'},
  {at: 2 * PI, label: '2\\pi'},
];

export default function HorizontalLineSine({
  initial = 0.5,
  labelCuts = false,
  pieces,
  initialPiece,
  caption,
}) {
  const [k, setK] = useState(initial);
  const [piece, setPiece] = useState(initialPiece ?? (pieces ? pieces[0] : 'tudo'));
  const info = PIECES[piece];
  const [a, b] = info.domain ?? [X_MIN, X_MAX];
  const cuts = crossings(k, a, b);
  const outside = Math.abs(k) > 1;

  const functions = info.domain
    ? [
        {f: Math.sin, muted: true, dashed: true, tone: 0},
        {f: Math.sin, tone: 1, domain: info.domain},
      ]
    : [{f: Math.sin, tone: 1}];

  const kTex = mathNumber(k, 2);
  const kText = kTex.replace('{,}', ',').replace('-', '\u2212');
  let count;
  if (outside) {
    count = (
      <p>
        A reta <Formula math={`y = ${kTex}`} /> não corta o gráfico em ponto nenhum. Nenhum ângulo tem
        seno {kText}, porque o seno fica sempre entre −1 e 1.
      </p>
    );
  } else if (!info.domain) {
    count = (
      <p>
        Na parte desenhada, a reta <Formula math={`y = ${kTex}`} /> corta o gráfico em{' '}
        <strong>{cuts.length} pontos</strong>. O gráfico continua para os dois lados, uma onda a cada{' '}
        <Formula math="2\pi" />, e cada onda nova traz mais cortes: são infinitos ângulos com o mesmo seno.
      </p>
    );
  } else {
    count = (
      <p>
        Dentro do trecho <Formula math={info.tex} />, a reta <Formula math={`y = ${kTex}`} /> corta o
        gráfico em <strong>{cuts.length === 1 ? '1 ponto' : `${cuts.length} pontos`}</strong>.
      </p>
    );
  }

  return (
    <div className={shared.wrapper} data-explorer="horizontal-line-sine">
      <CartesianPlane
        xMin={X_MIN}
        xMax={X_MAX}
        yMin={-1.6}
        yMax={1.6}
        xUnit={31}
        yUnit={58}
        xStep={PI / 2}
        yStep={0.5}
        xTicks={ticks}
        yTicks={[
          {at: 1, label: '1'},
          {at: -1, label: '-1'},
        ]}
        functions={functions}
        lines={[{m: 0, n: k, tone: 2, dashed: true}]}
        points={cuts.map((c, i) => ({
          at: [c.x, k],
          tone: 2,
          label: labelCuts ? c.tex : null,
          fontSize: 12,
          dy: i % 2 === 0 ? -16 : 18,
        }))}
        labels={[{at: [X_MAX, k], math: `y = ${kTex}`, tone: 2, anchor: 'end', dx: -4, dy: k > 1.25 || (k < -0.1 && k > -0.8) ? 15 : -13}]}
        caption={caption}
      />

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        {count}
        {info.verdict && <p>{info.verdict}</p>}
        {labelCuts && !outside && (
          <p>
            Aqui <Formula math={`\\alpha = \\arcsen(${kTex}) \\approx ${mathNumber(Math.asin(k), 2)}`} />. Os
            outros cortes saem dele de dois jeitos: somando voltas inteiras (<Formula math="2\pi" />) ou trocando
            pelo espelho <Formula math="\pi - \alpha" /> e somando voltas.
          </p>
        )}
      </div>

      <div className={shared.controls}>
        <label className={shared.control}>
          <span>Altura da reta: k = {kText}</span>
          <input
            type="range"
            min={-1.3}
            max={1.3}
            step={0.05}
            value={k}
            onChange={(event) => setK(Number(event.target.value))}
            aria-label="Altura da reta horizontal"
            aria-valuetext={kText}
          />
        </label>
      </div>
      {pieces && (
        <div className={shared.buttons}>
          {pieces.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPiece(p)}
              aria-pressed={p === piece}
              style={p === piece ? {borderColor: 'var(--mv-tone-1)', fontWeight: 600} : undefined}
            >
              {PIECES[p].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
