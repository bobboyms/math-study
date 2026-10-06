import React from 'react';
import GeoFigure from '../GeoFigure';
import UnitCircle from '../UnitCircle';
import CartesianPlane from '../CartesianPlane';
import styles from '../mathviz/explorer.module.css';

// O triângulo 3, 4, 5 acompanha a passagem de razões para coordenadas e gráfico.
export default function TrigBridge({stage = 'ratios'}) {
  const alpha = Math.atan2(3, 4);
  const circle = <UnitCircle
    scale={95}
    angles={[{deg: alpha * 180 / Math.PI, label: '\\alpha', showProjections: true,
      sinTone: 2, cosTone: 3, pointLabel: 'P', pointDx: 20, pointDy: -20}]}
    caption="No ciclo, o mesmo ângulo leva ao ponto P(4/5, 3/5)."
  />;

  return (
    <div className={styles.wrapper} data-trig-bridge={stage}>
      {stage === 'ratios' ? <GeoFigure
        polygons={[{points: [[0, 0], [4, 0], [4, 3]], fill: false}]}
        angles={[
          {at: [0, 0], from: [4, 0], to: [4, 3], label: '\\alpha', tone: 1, radius: 26, labelRadius: 44},
          {at: [4, 0], from: [0, 0], to: [4, 3], right: true},
        ]}
        dims={[
          {from: [0, 0], to: [4, 0], label: '4', tone: 3, offset: 24},
          {from: [4, 0], to: [4, 3], label: '3', tone: 2, offset: 24},
        ]}
        labels={[{at: [1.7, 1.7], math: '5', tone: 1}]}
        caption="O triângulo de catetos 4 e 3 e hipotenusa 5, com α oposto ao cateto 3."
      /> : <div className={styles.plots}>
        {stage === 'unit' ? <GeoFigure
          unit={155} padding={55}
          polygons={[{points: [[0, 0], [0.8, 0], [0.8, 0.6]], fill: false}]}
          angles={[
            {at: [0, 0], from: [0.8, 0], to: [0.8, 0.6], label: '\\alpha', tone: 1, radius: 24, labelRadius: 43},
            {at: [0.8, 0], from: [0, 0], to: [0.8, 0.6], right: true},
          ]}
          dims={[
            {from: [0, 0], to: [0.8, 0], label: '\\frac45', tone: 3, offset: 25},
            {from: [0.8, 0], to: [0.8, 0.6], label: '\\frac35', tone: 2, offset: 25},
          ]}
          labels={[{at: [0.35, 0.46], math: '1', tone: 1}]}
          caption="Dividir todos os lados por 5 preserva α e produz hipotenusa 1."
        /> : circle}
        {stage === 'unit' ? circle : <CartesianPlane
          xMin={-0.3} xMax={2 * Math.PI + 0.4} yMin={-1.4} yMax={1.4}
          xUnit={45} yUnit={65} xStep={Math.PI / 2} yStep={0.5}
          xTicks={[{at: Math.PI, label: '\\pi'}, {at: 2 * Math.PI, label: '2\\pi'}]}
          yTicks={[{at: -1, label: '-1'}, {at: 1, label: '1'}]}
          functions={[{f: Math.sin, tone: 2}]}
          points={[{at: [alpha, 0.6], label: 'Q', tone: 2, dx: 14, dy: -22}]}
          segments={[{from: [alpha, 0], to: [alpha, 0.6], dashed: true, tone: 2}]}
          caption="No gráfico do seno, Q tem entrada α e saída 3/5."
        />}
      </div>}
    </div>
  );
}
