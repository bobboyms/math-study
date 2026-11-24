import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';

// Um parâmetro de a sen(bx + c) + d por vez.
//
// Só o deslizante do parâmetro escolhido (`param`) fica ativo; os outros ficam
// travados nos valores de `base`. A curva de referência (tracejada, tom 1) é a
// mesma função com o parâmetro estudado no valor neutro; a curva ajustada
// (contínua, tom 2) usa o valor do deslizante. O tom 3 marca o que a lição
// quer que o aluno leia: a linha central (d), a altura do máximo (a), uma onda
// inteira (b) e o caminho do máximo (c).
//
// Ao aparecer na tela, o parâmetro desliza do valor neutro até `initial`: é a
// transformação acontecendo. Depois, o deslizante controla.
//
// Com `showWrongShift` (só faz sentido em param="c" e b diferente de 1), um
// círculo vazio mostra onde o máximo estaria pela leitura apressada "c para a
// esquerda", que esquece de dividir por b.

const PI = Math.PI;
const NEUTRAL = {a: 1, b: 1, c: 0, d: 0};

const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));

// p/q de π em LaTeX: (1, 2) → \frac{\pi}{2}; (-3, 4) → -\frac{3\pi}{4}.
function piTex(p, q) {
  if (p === 0) return '0';
  const g = gcd(Math.abs(p), Math.abs(q));
  let n = p / g;
  let m = q / g;
  if (m < 0) {
    n = -n;
    m = -m;
  }
  const sign = n < 0 ? '-' : '';
  const top = Math.abs(n) === 1 ? '\\pi' : `${Math.abs(n)}\\pi`;
  return m === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${m}}`;
}

// O mesmo número, escrito para texto corrido (fora do KaTeX).
function piText(p, q) {
  if (p === 0) return '0';
  const g = gcd(Math.abs(p), Math.abs(q));
  let n = p / g;
  let m = q / g;
  if (m < 0) {
    n = -n;
    m = -m;
  }
  const sign = n < 0 ? '−' : '';
  const top = Math.abs(n) === 1 ? 'π' : `${Math.abs(n)}π`;
  return m === 1 ? `${sign}${top}` : `${sign}${top}/${m}`;
}

const num = (v) => mathNumber(v, 2);
const plain = (v) => mathNumber(v, 2).replace('{,}', ',').replace('-', '−');

// b é sempre múltiplo de 1/2 aqui: b = m/2.
const halves = (b) => Math.round(b * 2);

function formulaTex({a, b, c, d}) {
  if (a === 0) return `f(x) = ${num(d)}`;
  const aTex = a === 1 ? '' : a === -1 ? '-' : num(a);
  const bTex = b === 1 ? '' : b === -1 ? '-' : num(b);
  const k = Math.round(c / (PI / 4));
  let arg;
  if (k === 0) arg = b === 1 ? ' x' : `(${bTex}x)`;
  else {
    const cTex = piTex(Math.abs(k), 4);
    arg = `\\left(${bTex}x ${k > 0 ? '+' : '-'} ${cTex}\\right)`;
  }
  const dTex = d === 0 ? '' : d > 0 ? ` + ${num(d)}` : ` - ${num(-d)}`;
  return `f(x) = ${aTex}\\sen${arg}${dTex}`;
}

function wavesIn2pi(b) {
  const h = halves(Math.abs(b));
  const whole = Math.floor(h / 2);
  const half = h % 2 === 1;
  if (whole === 0) return 'meia onda';
  const w = whole === 1 ? '1 onda' : `${whole} ondas`;
  return half ? `${w} e meia` : w;
}

const TICKS_POS = [
  {at: PI / 2, label: '\\frac{\\pi}{2}'},
  {at: PI, label: '\\pi'},
  {at: (3 * PI) / 2, label: '\\frac{3\\pi}{2}'},
  {at: 2 * PI, label: '2\\pi'},
];
const TICKS_NEG = [
  {at: -PI, label: '-\\pi'},
  {at: -PI / 2, label: '-\\frac{\\pi}{2}'},
];

const SETTINGS = {
  d: {min: -1, max: 3, step: 0.5, initial: 2, presets: [-1, 0, 1, 2, 3], name: 'deslocamento vertical d'},
  a: {min: -3, max: 3, step: 0.5, initial: 2, presets: [-2, -1, 0.5, 1, 2, 3], name: 'fator vertical a'},
  b: {min: 0.5, max: 4, step: 0.5, initial: 2, presets: [0.5, 1, 2, 3, 4], name: 'fator da entrada b'},
  c: {min: -4, max: 4, step: 1, initial: 2, presets: [-2, 0, 1, 2, 4], name: 'fase c'},
};

export default function WaveParameterExplorer({
  param = 'd',
  base = {},
  initial,
  presets,
  showWrongShift = false,
  duration = 2.5,
  caption,
}) {
  const cfg = SETTINGS[param];
  const fixed = {...NEUTRAL, ...base};
  // Para c, o deslizante guarda k, e c = k·π/4.
  const [value, setValue] = useState(initial ?? cfg.initial);
  const neutralValue = param === 'c' ? 0 : NEUTRAL[param];
  const {ref, t, play, playing} = useAnimation({duration});
  const progress = playing ? ease(t / duration) : 1;
  const rawShown = neutralValue + progress * (value - neutralValue);
  const shown = param === 'c' ? rawShown : rawShown;

  const paramValue = param === 'c' ? (shown * PI) / 4 : shown;
  const ref0 = {...fixed, [param]: NEUTRAL[param]};
  const cur = {...fixed, [param]: paramValue};
  const f = (p) => (x) => p.a * Math.sin(p.b * x + p.c) + p.d;

  // Janela
  const withNeg = param === 'c';
  // Sem folga à esquerda do eixo vertical (fora do caso c): a curva não
  // passa por cima dos números do eixo y.
  const xMin = withNeg ? -PI - 0.35 : -0.12;
  const xMax = 2 * PI + 0.45;
  let yMin;
  let yMax;
  let yUnit;
  if (param === 'd') {
    yMin = -2.4;
    yMax = 4.5;
    yUnit = 30;
  } else if (param === 'a') {
    yMin = -3.5;
    yMax = 3.6;
    yUnit = 28;
  } else {
    yMin = -1.6;
    yMax = 1.95;
    yUnit = 52;
  }
  const xUnit = withNeg ? 40 : 46;
  const xTicks = withNeg ? [...TICKS_NEG, ...TICKS_POS] : TICKS_POS;
  // No caso c o eixo vertical fica no meio do desenho, e o máximo cai muitas
  // vezes sobre ele: a numeração do eixo y sairia em cima do ponto laranja.
  const yTicks =
    param === 'd' || param === 'a'
      ? [-3, -2, -1, 1, 2, 3, 4].filter((v) => v > yMin && v < yMax).map((v) => ({at: v, label: String(v)}))
      : param === 'b'
        ? [{at: 1, label: '1'}, {at: -1, label: '-1'}]
        : [];

  const lines = [];
  const segments = [];
  const points = [];
  const labels = [];

  let text;

  if (param === 'd') {
    const d = shown;
    lines.push({m: 0, n: d, tone: 3, dashed: true});
    labels.push({at: [xMax - 0.1, d], math: `y = ${num(d)}`, tone: 3, anchor: 'end', dy: -14, fontSize: 13});
    points.push({at: [PI / 2, d + 1], tone: 2, label: num(d + 1), dy: -16});
    points.push({at: [(3 * PI) / 2, d - 1], tone: 2, label: num(d - 1), dy: 18});
    const dv = value;
    text =
      dv === 0
        ? 'Com d = 0 a curva ajustada coincide com o seno básico: a linha central é o próprio eixo horizontal.'
        : `Cada altura do seno ficou ${plain(Math.abs(dv))} ${dv > 0 ? 'maior' : 'menor'}: a curva inteira ${dv > 0 ? 'subiu' : 'desceu'} ${plain(Math.abs(dv))}. A linha central passou a ser y = ${plain(dv)}, e a curva vai de ${plain(dv - 1)} a ${plain(dv + 1)}. A distância do máximo até a linha central continua 1, e uma onda continua levando 2π.`;
  } else if (param === 'a') {
    const a = shown;
    [0, PI, 2 * PI].forEach((x) => points.push({at: [x, 0], tone: 3, r: 4}));
    if (Math.abs(a) > 0.05) {
      segments.push({from: [PI / 2, 0], to: [PI / 2, a], tone: 3, arrow: true});
    }
    const av = value;
    if (av === 0) {
      text = 'Com a = 0, toda altura vira 0 × sen x = 0. A curva é o próprio eixo horizontal: não há oscilação nenhuma.';
    } else {
      const size =
        Math.abs(av) > 1 ? `esticou na vertical: cada altura do seno ficou ${plain(Math.abs(av))} vezes maior` : Math.abs(av) < 1 ? `achatou: cada altura do seno foi multiplicada por ${plain(Math.abs(av))}` : 'manteve o tamanho';
      const flip =
        av < 0
          ? ` Como a é negativo, cada altura também trocou de sinal: em π/2, onde o seno básico tem o máximo 1, a curva tem o mínimo ${plain(av)}. A amplitude é a distância ${plain(Math.abs(av))}, não ${plain(av)}.`
          : '';
      text = `A curva ${size}. Amplitude |a| = ${plain(Math.abs(av))}: a curva vai de ${plain(-Math.abs(av))} a ${plain(Math.abs(av))}.${flip} Os zeros (pontos verdes em 0, π e 2π) não saíram do lugar, porque ${plain(av)} × 0 = 0. Uma onda continua levando 2π.`;
    }
  } else if (param === 'b') {
    const b = shown;
    const T = (2 * PI) / b;
    const yB = 1.5;
    const end = Math.min(T, xMax - 0.05);
    const mid = end / 2;
    segments.push({from: [mid, yB], to: [0, yB], tone: 3, arrow: true});
    segments.push({from: [mid, yB], to: [end, yB], tone: 3, arrow: true});
    if (T <= xMax) segments.push({from: [end, 1.35], to: [end, 1.65], tone: 3});
    segments.push({from: [0, 1.35], to: [0, 1.65], tone: 3});
    labels.push({at: [mid, yB], math: T > xMax ? '\\text{a onda continua além da janela}' : '\\text{uma onda}', tone: 3, dy: -16, fontSize: 13});
    lines.push({x: 2 * PI, muted: true, dashed: true});
    const h = halves(value);
    const Ttex = piTex(4, h);
    const Ttext = piText(4, h);
    const outside = (2 * PI) / value > xMax;
    text = `De 0 até 2π cabem ${wavesIn2pi(value)}. O argumento ${plain(value)}x anda ${plain(value)} vezes o que x anda. Uma onda termina quando o argumento completa 2π, ou seja, quando x = 2π ÷ ${plain(value)} = ${Ttext}.${outside ? ' Essa onda passa da janela desenhada: ela é mais longa que a do seno básico.' : ''}`;
    // guardado para o painel em fórmula
    cur.Ttex = Ttex;
  } else {
    const b = fixed.b;
    const k = Math.round(value);
    const c = (shown * PI) / 4;
    const xr = PI / (2 * b);
    const xa = (PI / 2 - c) / b;
    const yA = 1.45;
    points.push({at: [xr, 1], tone: 1, r: 4.5});
    points.push({at: [xa, 1], tone: 2});
    if (Math.abs(xa - xr) > 0.12) {
      segments.push({from: [xr, yA], to: [xa, yA], tone: 3, arrow: true});
    }
    if (showWrongShift && k !== 0) {
      const xw = xr - (k * PI) / 4;
      if (xw > xMin && xw < xMax) {
        points.push({at: [xw, 1], tone: 0, open: true, r: 6});
      }
    }
    // Deslocamento -c/b = -k/(4b) de π, com b inteiro aqui
    const shiftTex = piTex(-k, 4 * b);
    const shiftText = piText(Math.abs(k), 4 * b);
    const maxRef = piText(1, 2 * b);
    const maxNew = piText(2 - k, 4 * b);
    const dir = k > 0 ? 'para a esquerda' : 'para a direita';
    cur.shiftTex = shiftTex;
    if (k === 0) {
      text = `Com c = 0 não há deslocamento: as duas curvas coincidem, e o máximo fica em x = ${maxRef}.`;
    } else {
      const wrong =
        showWrongShift && b !== 1
          ? ` A leitura apressada, “c inteiro ${dir}”, levaria o máximo para o círculo vazio: um deslocamento de ${piText(Math.abs(k), 4)}, ${b} vezes o caminho certo.`
          : '';
      text = `O máximo saiu de x = ${maxRef} (ponto azul) para x = ${maxNew} (ponto laranja): a curva andou ${shiftText} ${dir}.${wrong}`;
    }
  }

  const display =
    param === 'c'
      ? `${formulaTex({...fixed, c: (Math.round(value) * PI) / 4})}`
      : formulaTex({...fixed, [param]: value});

  let panelMath;
  if (param === 'd') panelMath = `\\text{linha central } y = ${num(value)},\\quad \\text{imagem } [${num(value - 1)},\\ ${num(value + 1)}]`;
  else if (param === 'a') panelMath = `\\text{amplitude} = \\lvert ${num(value)} \\rvert = ${num(Math.abs(value))},\\quad \\text{imagem } [${num(-Math.abs(value))},\\ ${num(Math.abs(value))}]`;
  else if (param === 'b') panelMath = `\\text{período} = \\frac{2\\pi}{${num(value)}} = ${piTex(4, halves(value))} \\approx ${num((2 * PI) / value)}`;
  else {
    const k = Math.round(value);
    const b = fixed.b;
    panelMath =
      b === 1
        ? `\\text{deslocamento} = -c = ${piTex(-k, 4)}`
        : `\\text{deslocamento} = -\\frac{c}{b} = -\\frac{${piTex(k, 4)}}{${b}} = ${piTex(-k, 4 * b)}`;
  }

  const sliderLabel =
    param === 'c' ? `${cfg.name} = ${piText(Math.round(value), 4)}` : `${cfg.name} = ${plain(value)}`;

  return (
    <div className={shared.wrapper} data-explorer={`wave-${param}`}>
      <div className={shared.formula}>
        <Formula math={display} />
      </div>
      <div ref={ref}>
        <CartesianPlane
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          xUnit={xUnit}
          yUnit={yUnit}
          xStep={PI / 2}
          yStep={param === 'b' || param === 'c' ? 0.5 : 1}
          xTicks={xTicks}
          yTicks={yTicks}
          functions={[
            {f: f(ref0), tone: 1, dashed: true},
            {f: f(cur), tone: 2},
          ]}
          lines={lines}
          segments={segments}
          points={points}
          labels={labels}
          caption={caption}
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <div className={shared.formula}>
          <Formula math={panelMath} />
        </div>
        <p>{text}</p>
      </div>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>{sliderLabel}</span>
          <input
            type="range"
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            disabled={playing}
            aria-label={cfg.name}
            aria-valuetext={param === 'c' ? piText(Math.round(value), 4) : plain(value)}
          />
        </label>
      </div>
      <div className={shared.buttons}>
        {(presets ?? cfg.presets).map((p) => (
          <button key={p} type="button" onClick={() => setValue(p)} disabled={playing}>
            {param === 'c' ? `c = ${piText(p, 4)}` : `${param} = ${plain(p)}`}
          </button>
        ))}
        <button type="button" onClick={() => play()}>
          Ver a mudança de novo
        </button>
      </div>
    </div>
  );
}
