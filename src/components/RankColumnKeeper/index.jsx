import React, {useEffect, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from './styles.module.css';
import {comboTex, recipe} from './exact';

// O problema motivador da lição 11.10: a planilha de cinco colunas.
//
// O aluno clica no nome de uma coluna para apagá-la (e de novo para trazê-la
// de volta). Para cada coluna apagada, a figura procura uma receita que a
// refaça com as colunas guardadas (conta exata, por escalonamento) e escreve
// a receita embaixo da coluna, ou avisa que a informação se perdeu. Cada
// escolha que refaz tudo vai para o registro, com o número de colunas
// guardadas: o aluno descobre que nunca dá com menos de 3, e que há várias
// escolhas de 3 que servem.

const PLANILHA = {
  columns: [
    {name: '\\vec{f}', header: 'Loja física'},
    {name: '\\vec{o}', header: 'Online'},
    {name: '\\vec{t}', header: 'Total'},
    {name: '\\vec{p}', header: 'Pontos'},
    {name: '\\vec{n}', header: 'Compras'},
  ],
  rows: [
    [1, 0, 1, 2, 1],
    [2, 1, 3, 5, 3],
    [0, 3, 3, 3, 2],
    [1, 1, 2, 3, 4],
    [3, 2, 5, 8, 2],
  ],
};

export default function RankColumnKeeper({
  columns = PLANILHA.columns,
  rows = PLANILHA.rows,
  rowHeader = 'Cliente',
  initialDeleted = [2],
  caption,
}) {
  const n = columns.length;
  const [deleted, setDeleted] = useState(() => new Set(initialDeleted));
  const [log, setLog] = useState([]);

  const kept = [...Array(n).keys()].filter((j) => !deleted.has(j));
  const names = columns.map((c) => c.name);
  const status = [...deleted]
    .sort((a, b) => a - b)
    .map((j) => {
      const coef = kept.length ? recipe(rows, kept, j) : null;
      return {j, coef, tex: coef ? `${names[j]} = ${comboTex(coef, kept.map((k) => names[k]))}` : null};
    });
  const lost = status.filter((s) => !s.coef);
  const allBack = deleted.size > 0 && lost.length === 0;
  const key = kept.join(',');

  useEffect(() => {
    if (!allBack) return;
    setLog((old) => (old.some((e) => e.key === key) ? old : [...old, {key, kept: [...kept]}]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, allBack]);

  const toggle = (j) => {
    setDeleted((old) => {
      const next = new Set(old);
      if (next.has(j)) next.delete(j);
      else next.add(j);
      return next;
    });
  };

  const minKept = log.length ? Math.min(...log.map((e) => e.kept.length)) : null;
  const setTex = (ks) => `\\{${ks.map((k) => names[k]).join(',\\ ')}\\}`;

  return (
    <div className={shared.wrapper} data-explorer="rank-column-keeper">
      <figure style={{margin: '0 0 1rem'}}>
        <div className={styles.scroll}>
          <table className={styles.table} aria-label={caption}>
            <thead>
              <tr>
                <th scope="col">{rowHeader}</th>
                {columns.map((c, j) => (
                  <th key={c.name} scope="col">
                    <button
                      type="button"
                      className={styles.toggle}
                      aria-pressed={deleted.has(j)}
                      onClick={() => toggle(j)}
                      aria-label={`${deleted.has(j) ? 'Trazer de volta' : 'Apagar'} a coluna ${c.header}`}
                    >
                      <span>{c.header}</span>
                      <Formula math={c.name} />
                      <span className={`${styles.state} ${deleted.has(j) ? styles.gone : styles.kept}`}>
                        {deleted.has(j) ? 'apagada' : 'guardada'}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  {r.map((x, j) => (
                    <td key={j} className={deleted.has(j) ? styles.deleted : undefined}>
                      {x}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className={styles.recipe}>
                  refazer?
                </th>
                {columns.map((c, j) => {
                  if (!deleted.has(j)) return <td key={j} />;
                  const s = status.find((e) => e.j === j);
                  return (
                    <td key={j} className={`${styles.recipe} ${s.coef ? styles.rebuilt : styles.lost}`}>
                      {s.coef ? 'sim' : 'não'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        {caption && (
          <figcaption className={shared.caption} style={{textAlign: 'center'}}>
            {caption}
          </figcaption>
        )}
      </figure>

      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Colunas guardadas: <strong>{kept.length}</strong>
          {kept.length > 0 && (
            <>
              {' '}
              (<Formula math={kept.map((k) => names[k]).join(',\\ ')} />)
            </>
          )}
          .
        </p>
        {deleted.size === 0 && <p>Nenhuma coluna apagada. Clique no nome de uma coluna para apagá-la.</p>}
        {status
          .filter((s) => s.coef)
          .map((s) => (
            <p key={s.j} className={shared.formula}>
              <span className={styles.rebuilt}>Refeita:</span> <Formula math={s.tex} />
            </p>
          ))}
        {lost.length > 0 && (
          <p>
            <span className={styles.lost}>Perdida:</span>{' '}
            {lost.map((s, k) => (
              <span key={s.j}>
                {k > 0 && ' e '}
                <Formula math={names[s.j]} />
              </span>
            ))}
            . Nenhuma receita com as colunas guardadas {lost.length === 1 ? 'refaz essa coluna' : 'refaz essas colunas'}: a informação
            se perdeu.
          </p>
        )}
        {allBack && <p>Todas as colunas apagadas podem ser refeitas: esta escolha não perde nada.</p>}
        <p>
          Escolhas que refazem tudo, anotadas até agora:{' '}
          {log.length === 0
            ? 'nenhuma.'
            : log.map((e, k) => (
                <span key={e.key}>
                  {k > 0 && '; '}
                  <Formula math={setTex(e.kept)} /> ({e.kept.length} colunas)
                </span>
              ))}
          {log.length > 0 && '.'}
        </p>
        {minKept !== null && (
          <p>
            Menor número de colunas guardadas que já refez tudo: <strong>{minKept}</strong>.
          </p>
        )}
      </div>

      <div className={shared.buttons}>
        <button type="button" onClick={() => setDeleted(new Set())}>
          Trazer todas de volta
        </button>
        <button type="button" onClick={() => setLog([])}>
          Apagar o registro
        </button>
      </div>
    </div>
  );
}
