import React, {useState} from 'react';
import UnitCircle from '../UnitCircle';
import CartesianPlane from '../CartesianPlane';
import Formula, {mathNumber} from '../mathviz/Formula';
import styles from '../mathviz/explorer.module.css';

// Um único ângulo determina o ponto do ciclo e o ponto do gráfico.
export default function CycleGraphExplorer() {
  const [degrees, setDegrees] = useState(30);
  const [coordinate, setCoordinate] = useState('sin');
  const theta = degrees * Math.PI / 180;
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const isSine = coordinate === 'sin';
  const value = isSine ? sin : cos;
  const name = isSine ? '\\sen' : '\\cos';
  const tone = isSine ? 2 : 3;

  return (
    <div className={styles.wrapper} data-explorer="cycle-graph">
      <div className={styles.plots}>
        <UnitCircle
          scale={95}
          angles={[{deg: degrees, label: '\\theta', showProjections: true,
            sinTone: 2, cosTone: 3, pointLabel: 'P', pointDx: 20, pointDy: -20}]}
          caption="No ciclo, seno é a ordenada e cosseno é a abscissa de P."
        />
        <CartesianPlane
          xMin={-2 * Math.PI - 0.4} xMax={4 * Math.PI + 0.4}
          yMin={-1.5} yMax={1.5} xUnit={23} yUnit={65}
          xStep={Math.PI / 2} yStep={0.5}
          xTicks={[-2, -1, 1, 2, 3, 4].map((k) => ({at: k * Math.PI,
            label: k === 1 ? '\\pi' : k === -1 ? '-\\pi' : `${k}\\pi`}))}
          yTicks={[{at: -1, label: '-1'}, {at: 1, label: '1'}]}
          functions={[{f: isSine ? Math.sin : Math.cos, tone}]}
          points={[{at: [theta, value], tone}]}
          segments={[{from: [theta, 0], to: [theta, value], dashed: true, tone}]}
          caption={`No gráfico, a entrada é θ em radianos; a saída é ${isSine ? 'sen θ' : 'cos θ'}.`}
        />
      </div>
      <div className={styles.readout} aria-live="polite" aria-atomic="true">
        <div className={styles.formula}><Formula math={`\\theta=${degrees}^\\circ\\approx ${mathNumber(theta)}\\text{ rad}`} /></div>
        <div className={styles.formula}><Formula math={`P\\approx(${mathNumber(cos)},\\ ${mathNumber(sin)})`} /></div>
        <div className={styles.formula}><Formula math={`(\\theta,${name}\\theta)\\approx(${mathNumber(theta)},\\ ${mathNumber(value)})`} /></div>
      </div>
      <div className={styles.controls}>
        <label className={styles.control}>
          <span>Ângulo de giro: {degrees}°</span>
          <input type="range" min={-360} max={720} step={5} value={degrees}
            aria-label="Ângulo de giro em graus" aria-valuetext={`${degrees} graus`}
            onChange={(event) => setDegrees(Number(event.target.value))} />
        </label>
        <label className={styles.control}>
          <span>Coordenada transportada para o gráfico</span>
          <select value={coordinate} onChange={(event) => setCoordinate(event.target.value)}>
            <option value="sin">Seno — ordenada de P</option>
            <option value="cos">Cosseno — abscissa de P</option>
          </select>
        </label>
      </div>
      <div className={styles.buttons}>
        {[0, 90, 180, 270, 360].map((deg) => <button key={deg} type="button"
          onClick={() => setDegrees(deg)}>{deg}°</button>)}
      </div>
      <p className={styles.caption}>Valores aproximados a três casas decimais. Ao completar uma volta, P retorna ao mesmo lugar no ciclo; a entrada do gráfico aumenta em 2π.</p>
    </div>
  );
}
