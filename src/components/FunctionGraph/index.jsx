import React, {useEffect, useId, useMemo, useRef, useState} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import styles from './styles.module.css';

const initialBounds = [-6, 8, 6, -8];

export default function FunctionGraph() {
  const graphId = useId().replace(/:/g, '-');
  const boardRef = useRef(null);
  const curveRef = useRef(null);
  const [params, setParams] = useState({a: 1, b: 0, c: 0});

  const equation = useMemo(() => {
    const format = (value) => Number(value).toFixed(2).replace(/\.00$/, '');
    return `f(x) = ${format(params.a)}x^2 ${params.b < 0 ? '-' : '+'} ${format(Math.abs(params.b))}x ${params.c < 0 ? '-' : '+'} ${format(Math.abs(params.c))}`;
  }, [params]);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return undefined;
    }

    let board;
    let cancelled = false;

    import('jsxgraph').then((module) => {
      if (cancelled) {
        return;
      }

      const JXG = module.default || module;
      board = JXG.JSXGraph.initBoard(graphId, {
        axis: true,
        boundingbox: initialBounds,
        keepAspectRatio: false,
        showCopyright: false,
        showNavigation: true,
      });

      boardRef.current = board;
      curveRef.current = board.create('functiongraph', [
        (x) => params.a * x * x + params.b * x + params.c,
      ], {
        strokeColor: '#1f6feb',
        strokeWidth: 3,
      });
    });

    return () => {
      cancelled = true;
      if (boardRef.current) {
        boardRef.current.removeObject(curveRef.current);
        boardRef.current = null;
        curveRef.current = null;
      }
      if (board) {
        board.containerObj.innerHTML = '';
      }
    };
  }, [graphId]);

  useEffect(() => {
    if (!boardRef.current || !curveRef.current) {
      return;
    }

    curveRef.current.Y = (x) => params.a * x * x + params.b * x + params.c;
    boardRef.current.update();
  }, [params]);

  const updateParam = (name) => (event) => {
    setParams((current) => ({
      ...current,
      [name]: Number(event.target.value),
    }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.graph} id={graphId} />
      <div className={styles.controls} aria-label="Parametros da funcao">
        <div className={styles.equation}>{equation}</div>
        {[
          ['a', -3, 3, 0.1],
          ['b', -8, 8, 0.1],
          ['c', -8, 8, 0.1],
        ].map(([name, min, max, step]) => (
          <label className={styles.control} key={name}>
            <span>{name} = {params[name].toFixed(1)}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={params[name]}
              onChange={updateParam(name)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
