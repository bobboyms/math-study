import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import styles from '../mathviz/explorer.module.css';

const INITIAL = {a: 1, b: 1, c: 0, d: 0};

const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));

// p/q de π, em LaTeX (\\frac{3\\pi}{4}) ou em texto (3π/4).
function piOf(p, q, tex) {
  if (p === 0) return '0';
  const g = gcd(Math.abs(p), Math.abs(q));
  let n = p / g;
  let m = q / g;
  if (m < 0) {
    n = -n;
    m = -m;
  }
  const minus = n < 0 ? (tex ? '-' : '−') : '';
  const top = Math.abs(n) === 1 ? (tex ? '\\pi' : 'π') : `${Math.abs(n)}${tex ? '\\pi' : 'π'}`;
  if (m === 1) return `${minus}${top}`;
  return tex ? `${minus}\\frac{${top}}{${m}}` : `${minus}${top}/${m}`;
}

// Os controles andam em passos de 1/2 (a, b, d) e de π/4 (c).
const quarters = (c) => Math.round(c / (Math.PI / 4));
const halves = (v) => Math.round(v * 2);

function formulaTex({a, b, c, d}) {
  const n = (v) => mathNumber(v);
  const aTex = a === 1 ? '' : a === -1 ? '-' : n(a);
  const bTex = b === 1 ? '' : b === -1 ? '-' : n(b);
  const k = quarters(c);
  const inner = b === 0 ? '' : `${bTex}x`;
  let arg;
  if (k === 0) arg = b === 1 ? ' x' : `(${b === 0 ? '0' : inner})`;
  else arg = `\\left(${inner}${inner ? (k > 0 ? ' + ' : ' - ') : k > 0 ? '' : '-'}${piOf(Math.abs(k), 4, true)}\\right)`;
  const dTex = d === 0 ? '' : d > 0 ? ` + ${n(d)}` : ` - ${n(-d)}`;
  if (a === 0) return `f(x) = 0\\sen${arg}${dTex}`;
  return `f(x) = ${aTex}\\sen${arg}${dTex}`;
}
const CONTROLS = [
  {key: 'a', label: 'Fator vertical a', min: -3, max: 3, step: 0.5,
    hint: 'Compare a distância entre máximo e mínimo. Observe também o sinal.'},
  {key: 'b', label: 'Fator da entrada b', min: -3, max: 3, step: 0.5,
    hint: 'Compare a largura de um ciclo. O valor zero produz uma constante.'},
  {key: 'c', label: 'Fase c, em radianos', min: -Math.PI, max: Math.PI, step: Math.PI / 4,
    hint: 'Mantenha b fixo e acompanhe a posição de um máximo.'},
  {key: 'd', label: 'Deslocamento vertical d', min: -2, max: 2, step: 0.5,
    hint: 'Compare a linha central da oscilação.'},
];

export default function TrigParametersExplorer() {
  const [parameters, setParameters] = useState(INITIAL);
  const {a, b, c, d} = parameters;
  const constant = a === 0 || b === 0;
  const constantValue = a * Math.sin(c) + d;
  const amplitude = Math.abs(a);
  const period = constant ? null : 2 * Math.PI / Math.abs(b);
  const shift = b === 0 ? null : -c / b;
  const f = (x) => a * Math.sin(b * x + c) + d;

  return (
    <div className={styles.wrapper} data-explorer="trig-parameters">
      <div className={styles.formula}><Formula math={formulaTex(parameters)} /></div>
      <CartesianPlane
        xMin={-2 * Math.PI - 0.5} xMax={2 * Math.PI + 0.5}
        yMin={-5.5} yMax={5.5} xUnit={36} yUnit={24}
        xStep={Math.PI / 2} yStep={1}
        xTicks={[-2, -1, 1, 2].map((k) => ({at: k * Math.PI,
          label: k === 1 ? '\\pi' : k === -1 ? '-\\pi' : `${k}\\pi`}))}
        yTicks={[-4, -2, 2, 4].map((at) => ({at, label: String(at)}))}
        functions={[{f: Math.sin, tone: 1, dashed: true}, {f, tone: 2}]}
        lines={[{m: 0, n: d, tone: 3, dashed: true}]}
        caption="Compare a curva ajustada com o seno básico. A escala dos eixos permanece fixa."
      />
      <p className={styles.legend}>Seno básico: azul tracejado. Curva ajustada: laranja contínua. Linha d: verde tracejada.</p>
      <div className={styles.readout} aria-live="polite" aria-atomic="true">
        {constant ? <>
          <div className={styles.formula}><Formula math={`f(x)=${mathNumber(constantValue)}`} /></div>
          <p>A curva é constante: amplitude zero e imagem com um único valor. Não há menor período positivo nem deslocamento horizontal observável.</p>
        </> : <>
          <div className={styles.formula}><Formula math={`\\text{amplitude}=\\lvert ${mathNumber(a)} \\rvert = ${mathNumber(amplitude)},\\quad \\text{período}=\\frac{2\\pi}{${mathNumber(Math.abs(b))}} = ${piOf(4, halves(Math.abs(b)), true)}\\approx${mathNumber(period, 2)}`} /></div>
          <div className={styles.formula}><Formula math={`\\text{imagem}=[${mathNumber(d - amplitude)},\\ ${mathNumber(d + amplitude)}],\\quad \\text{linha central } y = ${mathNumber(d)}`} /></div>
          <div className={styles.formula}><Formula math={`\\text{deslocamento}=-\\frac{c}{b} = ${piOf(-quarters(c), 2 * halves(b), true)}`} /></div>
          <p>{quarters(c) === 0
            ? 'Com c = 0, a curva não anda na horizontal em relação à curva a sen(bx).'
            : `Em relação à curva a sen(bx), sem o c, a curva andou ${piOf(Math.abs(quarters(c)), Math.abs(2 * halves(b)), false)} ${shift < 0 ? 'para a esquerda' : 'para a direita'}.`}</p>
        </>}
      </div>
      <div className={styles.parameterGrid}>
        {CONTROLS.map(({key, label, min, max, step, hint}) => <label key={key} className={styles.control}>
          <span>{label}: {key === 'c' ? piOf(quarters(parameters.c), 4, false) : mathNumber(parameters[key]).replace('{,}', ',').replace('-', '−')}</span>
          <span className={styles.hint}>{hint}</span>
          <input type="range" min={min} max={max} step={step} value={parameters[key]}
            aria-label={`Parâmetro ${key}`} aria-valuetext={String(parameters[key])}
            onChange={(event) => setParameters({...parameters, [key]: Number(event.target.value)})} />
        </label>)}
      </div>
      <div className={styles.buttons}><button type="button" onClick={() => setParameters(INITIAL)}>Restaurar seno básico</button></div>
    </div>
  );
}
