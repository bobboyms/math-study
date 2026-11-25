import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';

// A matriz passa para o outro lado do ponto, transposta (lição 11.13).
//
// O aluno escolhe v e w (coordenadas inteiras de −3 a 3) nos deslizantes, e o
// painel faz três contas com a matriz A: (Av)·w, v·(Aᵀw) e, para comparar,
// v·(Aw), que esquece de transpor. As duas primeiras sempre dão o mesmo
// número; a terceira, em geral, não.

const n = (x) => (x < 0 ? `(${x})` : `${x}`);
const vec = (p) => `(${p[0]},\\ ${p[1]})`;

export default function SvdTransposeCheck({
  matrix = [
    [3, 0],
    [4, 5],
  ],
  initialV = [1, 0],
  initialW = [0, 1],
}) {
  const [v, setV] = useState(initialV);
  const [w, setW] = useState(initialW);
  const A = matrix;
  const At = [
    [A[0][0], A[1][0]],
    [A[0][1], A[1][1]],
  ];
  const ap = (M, p) => [M[0][0] * p[0] + M[0][1] * p[1], M[1][0] * p[0] + M[1][1] * p[1]];
  const Av = ap(A, v);
  const Atw = ap(At, w);
  const Aw = ap(A, w);
  const d1 = Av[0] * w[0] + Av[1] * w[1];
  const d2 = v[0] * Atw[0] + v[1] * Atw[1];
  const d3 = v[0] * Aw[0] + v[1] * Aw[1];
  const bm = (M) => `\\begin{bmatrix} ${M[0][0]} & ${M[0][1]} \\\\ ${M[1][0]} & ${M[1][1]} \\end{bmatrix}`;

  const slider = (labelText, value, onChange) => (
    <label className={shared.control}>
      <span>
        {labelText} = <strong>{String(value).replace('-', '−')}</strong>
      </span>
      <input type="range" min={-3} max={3} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={labelText} />
    </label>
  );

  return (
    <div className={shared.wrapper} data-explorer="svd-transpose-check">
      <div className={shared.parameterGrid}>
        <div className={shared.controls}>
          {slider('primeira coordenada de v', v[0], (x) => setV([x, v[1]]))}
          {slider('segunda coordenada de v', v[1], (x) => setV([v[0], x]))}
        </div>
        <div className={shared.controls}>
          {slider('primeira coordenada de w', w[0], (x) => setW([x, w[1]]))}
          {slider('segunda coordenada de w', w[1], (x) => setW([w[0], x]))}
        </div>
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`A = ${bm(A)}, \\quad A^{\\mathsf{T}} = ${bm(At)}, \\quad \\vec{v} = ${vec(v)}, \\quad \\vec{w} = ${vec(w)}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`(A\\vec{v}) \\cdot \\vec{w} = ${vec(Av)} \\cdot ${vec(w)} = ${n(Av[0])} \\times ${n(w[0])} + ${n(Av[1])} \\times ${n(w[1])} = \\mathbf{${d1}}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`\\vec{v} \\cdot (A^{\\mathsf{T}}\\vec{w}) = ${vec(v)} \\cdot ${vec(Atw)} = ${n(v[0])} \\times ${n(Atw[0])} + ${n(v[1])} \\times ${n(Atw[1])} = \\mathbf{${d2}}`} />
        </p>
        <p>
          As duas contas dão <strong>{String(d1).replace('-', '−')}</strong>. Mude v e w: elas continuam iguais.
        </p>
        <p className={shared.formula}>
          <Formula math={`\\text{Sem transpor: } \\vec{v} \\cdot (A\\vec{w}) = ${vec(v)} \\cdot ${vec(Aw)} = ${d3}`} />
        </p>
        <p className={shared.hint}>
          {d3 === d1
            ? 'Aqui a conta sem transpor também deu o mesmo número, por coincidência. Mexa em v ou w: ela logo se separa.'
            : `A conta sem transpor deu ${String(d3).replace('-', '−')}, e não ${String(d1).replace('-', '−')}: a matriz só pode mudar de lado se for transposta.`}
        </p>
      </div>
    </div>
  );
}
