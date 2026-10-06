import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import styles from '../mathviz/explorer.module.css';

const INITIAL = {a: 1, b: 1, c: 0, d: 0};
const CONTROLS = [
  {key: 'a', label: 'a — fator vertical', min: -3, max: 3, step: 0.5,
    hint: 'Compare a distância entre máximo e mínimo. Observe também o sinal.'},
  {key: 'b', label: 'b — fator da entrada', min: -3, max: 3, step: 0.5,
    hint: 'Compare a largura de um ciclo. O valor zero produz uma constante.'},
  {key: 'c', label: 'c — fase, em radianos', min: -Math.PI, max: Math.PI, step: Math.PI / 4,
    hint: 'Mantenha b fixo e acompanhe a posição de um máximo.'},
  {key: 'd', label: 'd — deslocamento vertical', min: -2, max: 2, step: 0.5,
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
      <div className={styles.formula}><Formula math={`f(x)=(${mathNumber(a)})\\sen\\!\\left((${mathNumber(b)})x+(${mathNumber(c)})\\right)+(${mathNumber(d)})`} /></div>
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
          <div className={styles.formula}><Formula math={`\\text{amplitude}=${mathNumber(amplitude)},\\quad T\\approx${mathNumber(period)}`} /></div>
          <div className={styles.formula}><Formula math={`\\text{imagem}=[${mathNumber(d - amplitude)},\\ ${mathNumber(d + amplitude)}]`} /></div>
          <div className={styles.formula}><Formula math={`-\\frac{c}{b}\\approx${mathNumber(shift)}`} /></div>
          <p>Deslocamento de {mathNumber(Math.abs(shift)).replace('{,}', ',')} em relação a a sen(bx): {shift < 0 ? 'para a esquerda' : shift > 0 ? 'para a direita' : 'sem deslocamento'}. Valores em radianos, aproximados a três casas decimais.</p>
        </>}
      </div>
      <div className={styles.parameterGrid}>
        {CONTROLS.map(({key, label, min, max, step, hint}) => <label key={key} className={styles.control}>
          <span>{label}: {mathNumber(parameters[key]).replace('{,}', ',')}</span>
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
