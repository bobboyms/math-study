import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from './styles.module.css';

// Trocar a letra por um número e comparar expressões.
//
// O aluno arrasta o valor da letra e vê, linha a linha, quanto cada expressão
// vale. Serve para três perguntas que voltam em toda a álgebra:
//
// - duas escritas são a MESMA expressão? (fatoração conferida, simplificação
//   legítima): com `compare`, cada linha ganha ✓ quando vale o mesmo que a
//   primeira e ✗ quando não vale. Uma escrita errada pode acertar por
//   coincidência num valor — o deslizante mostra que ela erra nos outros;
// - quando uma expressão vale zero? com `zero`, a linha que vale 0 se acende;
// - uma divisão por zero aparece como "não existe", e não como um número.
//
// As funções de cada linha vêm da própria lição, em JavaScript:
//   rows={[{tex: '6x + 9', f: (x) => 6 * x + 9}, ...]}

const fmtNumber = (value) => {
  const rounded = Math.round(value * 1000) / 1000;
  const text = String(Object.is(rounded, -0) ? 0 : rounded).replace('.', '{,}');
  return text.replace(/^-/, '-');
};

export default function SubstituteExplorer({
  letter = 'x',
  rows,
  min = -5,
  max = 10,
  step = 1,
  initial = 2,
  compare = false,
  zero = false,
  caption,
}) {
  const [value, setValue] = useState(initial);
  const values = rows.map((row) => {
    const v = row.f(value);
    return Number.isFinite(v) ? v : null;
  });
  // Cada linha pode ser comparada com outra (`compareTo`); `compare` liga a
  // comparação de todas as linhas com a primeira.
  const refs = rows.map((row, i) => row.compareTo ?? (compare && i > 0 ? 0 : undefined));
  const showCompare = refs.some((r) => r !== undefined);
  const valueTex = fmtNumber(value);

  return (
    <div className={shared.wrapper} data-explorer="substitute">
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Expressão</th>
            <th>
              Com <Formula math={`${letter} = ${valueTex}`} />
            </th>
            {showCompare && <th>Comparação</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const v = values[i];
            const ref = refs[i] === undefined ? undefined : values[refs[i]];
            const comparable = refs[i] !== undefined && v !== null && ref !== null;
            const same = comparable && Math.abs(v - ref) < 1e-9;
            const isZero = zero && v !== null && Math.abs(v) < 1e-9;
            return (
              <tr key={i} className={isZero ? styles.zero : undefined}>
                <td>
                  <Formula math={row.tex} />
                </td>
                <td className={styles.value}>
                  {v === null ? (
                    <span>não existe (divisão por zero)</span>
                  ) : (
                    <Formula math={fmtNumber(v)} />
                  )}
                </td>
                {showCompare && (
                  <td className={comparable ? (same ? styles.same : styles.diff) : undefined}>
                    {!comparable ? '' : same ? `✓ igual à linha ${refs[i] + 1}` : `✗ diferente da linha ${refs[i] + 1}`}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {caption && <p className={shared.caption}>{caption}</p>}
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Valor de {letter}: {valueTex.replace('{,}', ',')}
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            aria-label={`Valor de ${letter}`}
          />
        </label>
      </div>
    </div>
  );
}
