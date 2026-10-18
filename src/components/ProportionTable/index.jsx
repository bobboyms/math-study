import React, {useState} from 'react';
import shared from '../mathviz/explorer.module.css';
import styles from './styles.module.css';

// Uma linha de referência fixa e uma linha que o aluno move. As duas últimas
// colunas mostram o quociente y ÷ x e o produto x × y de cada linha, e a
// coluna que não muda é destacada.
//
// É interativo porque o teste da lição — "qual coluna fica constante?" — é um
// movimento: só mexendo no valor dá para ver uma coluna parada enquanto a
// outra muda. A conta de luz entra como terceiro caso para mostrar que pode
// não sobrar coluna constante nenhuma, e aí a regra de três não se aplica.

const SCENARIOS = [
  {
    key: 'gasolina',
    label: 'Gasolina',
    xName: 'Litros',
    yName: 'Valor (R$)',
    ref: 10,
    min: 5,
    max: 60,
    step: 5,
    initial: 20,
    f: (x) => 6.2 * x,
    money: true,
    sentence: (x) => `Abastecer ${fmt(x)} litros a R$ 6,20 o litro.`,
  },
  {
    key: 'viagem',
    label: 'Viagem de 300 km',
    xName: 'Velocidade (km/h)',
    yName: 'Tempo (h)',
    ref: 60,
    min: 40,
    max: 150,
    step: 10,
    initial: 100,
    f: (x) => 300 / x,
    sentence: (x) => `Percorrer os mesmos 300 km a ${fmt(x)} km/h.`,
  },
  {
    key: 'luz',
    label: 'Conta de luz',
    xName: 'Consumo (kWh)',
    yName: 'Conta (R$)',
    ref: 100,
    min: 50,
    max: 400,
    step: 50,
    initial: 200,
    f: (x) => 30 + 0.8 * x,
    money: true,
    sentence: (x) => `Consumir ${fmt(x)} kWh, com R$ 30 de taxa mínima mais R$ 0,80 por kWh.`,
  },
];

function fmt(value, digits = 2) {
  return value.toLocaleString('pt-BR', {maximumFractionDigits: digits});
}

function fmtMoney(value) {
  return value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Escreve o número com no máximo `digits` casas e avisa quando arredondou.
function approx(value, digits = 2) {
  const rounded = Number(value.toFixed(digits));
  const mark = Math.abs(rounded - value) > 1e-9 ? '≈ ' : '';
  return mark + fmt(rounded, digits);
}

const same = (a, b) => Math.abs(a - b) < 1e-9;

export default function ProportionTable() {
  const [index, setIndex] = useState(0);
  const scenario = SCENARIOS[index];
  const [values, setValues] = useState(SCENARIOS.map((s) => s.initial));
  const x = values[index];

  const rows = [
    {name: 'linha fixa', x: scenario.ref},
    {name: 'sua linha', x},
  ].map((row) => {
    const y = scenario.f(row.x);
    return {...row, y, quotient: y / row.x, product: row.x * y};
  });

  const moved = !same(x, scenario.ref);
  const quotientFixed = same(rows[0].quotient, rows[1].quotient);
  const productFixed = same(rows[0].product, rows[1].product);

  const cell = (fixed) => (moved ? (fixed ? styles.fixed : styles.changed) : undefined);

  let verdict;
  if (!moved) {
    verdict = 'As duas linhas estão iguais. Mova o controle para longe da linha fixa e compare as duas últimas colunas.';
  } else if (quotientFixed) {
    verdict = 'O quociente ficou igual nas duas linhas e o produto mudou: litros e valor são diretamente proporcionais. O quociente fixo, 6,2, é o preço do litro.';
  } else if (productFixed) {
    verdict = 'O produto ficou igual nas duas linhas e o quociente mudou: velocidade e tempo são inversamente proporcionais. O produto fixo, 300, é a distância da viagem.';
  } else {
    verdict = 'Nem o quociente nem o produto ficaram iguais: consumo e conta não são proporcionais, e nenhuma regra de três se aplica. O culpado é a taxa fixa: com 0 kWh, a conta ainda seria R$ 30, e não zero.';
  }

  const setX = (value) => setValues(values.map((v, i) => (i === index ? value : v)));

  return (
    <div className={shared.wrapper} data-explorer="proportion-table">
      <div role="group" aria-label="Situação">
        <span className={shared.hint}>Escolha a situação:</span>
        <div className={shared.buttons}>
          {SCENARIOS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className={i === index ? styles.active : undefined}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">{scenario.xName}</th>
              <th scope="col">{scenario.yName}</th>
              <th scope="col">Quociente</th>
              <th scope="col">Produto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>{fmt(row.x)}</td>
                <td>{scenario.money ? fmtMoney(row.y) : approx(row.y)}</td>
                <td className={cell(quotientFixed)}>{approx(row.quotient, 3)}</td>
                <td className={cell(productFixed)}>{approx(row.product)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={moved ? styles.verdict : undefined}>{verdict}</p>
      </div>

      <label className={shared.control}>
        <span>{scenario.sentence(x)}</span>
        <span className={shared.hint}>
          Quociente é {scenario.yName.split(' (')[0].toLowerCase()} ÷ {scenario.xName.split(' (')[0].toLowerCase()};
          produto é um vezes o outro.
        </span>
        <input
          type="range"
          min={scenario.min}
          max={scenario.max}
          step={scenario.step}
          value={x}
          onChange={(event) => setX(Number(event.target.value))}
          aria-label={scenario.xName}
          aria-valuetext={`${fmt(x)}; ${verdict}`}
        />
      </label>
    </div>
  );
}
