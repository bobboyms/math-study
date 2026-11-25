import React from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// Isolar a função trigonométrica como desfazer camadas.
//
// À esquerda, as contas que a fórmula faz com t, na ordem (a "ida"). À
// direita, a equação sendo desfeita de fora para dentro: cada linha nova
// desfaz a última conta da ida que ainda está de pé, e essa conta fica
// riscada. A animação para na camada do cosseno, que é destacada: ela não se
// desfaz com uma resposta só, e é o assunto do resto da lição.

const DEFAULT_FORWARD = [
  {op: '\\times \\pi', value: '\\pi t'},
  {op: '\\cos', value: '\\cos(\\pi t)'},
  {op: '\\times(-20)', value: '-20\\cos(\\pi t)'},
  {op: '+\\,25', value: '25 - 20\\cos(\\pi t)'},
];

const DEFAULT_BACK = [
  {eq: '25 - 20\\cos(\\pi t) = 35', note: 'a equação do operador'},
  {eq: '-20\\cos(\\pi t) = 10', note: 'desfaz o +25: tire 25 dos dois lados', undoes: 3},
  {eq: '\\cos(\\pi t) = -\\tfrac{1}{2}', note: 'desfaz o ×(−20): divida os dois lados por −20', undoes: 2},
];

const STOP_NOTE = 'o cosseno ficou sozinho. Desfazer o cosseno é achar os giros com cosseno −1/2, e eles são muitos.';

export default function TrigEqLayers({input = 't', forward = DEFAULT_FORWARD, back = DEFAULT_BACK, stop = 1, stopNote = STOP_NOTE, caption}) {
  const step = 0.9;
  const duration = 0.6 + step * back.length + 0.6;
  const {ref, t, play, playing} = useAnimation({duration});
  const shown = (i) => stage(t, 0.4 + step * i, 0.4 + step * i + 0.5);
  const stopOn = stage(t, 0.6 + step * back.length, duration);

  const struck = (j) => back.some((b, i) => b.undoes === j && shown(i) >= 1);
  const lineStyle = (j) => {
    if (struck(j)) return {opacity: 0.45};
    if (j === stop && stopOn > 0) {
      return {
        background: 'color-mix(in srgb, var(--mv-tone-2) 16%, transparent)',
        borderRadius: '4px',
        fontWeight: 600,
      };
    }
    return {};
  };

  return (
    <div className={shared.wrapper} data-explorer="trig-eq-layers">
      <figure ref={ref} style={{margin: 0}}>
        <div className={shared.plots} style={{alignItems: 'start'}}>
          <div>
            <p style={{margin: '0 0 0.4rem'}}><strong>Ida:</strong> a fórmula faz estas contas com <Formula math={input} />, nesta ordem.</p>
            <ol style={{margin: 0, paddingLeft: '1.4rem'}}>
              {forward.map((f, j) => (
                <li key={j} style={{margin: '0.35rem 0', padding: '0 0.25rem', transition: 'opacity 0.3s', ...lineStyle(j)}}>
                  <Formula math={f.op} /> <span aria-hidden="true">&nbsp;→&nbsp;</span> <Formula math={f.value} />
                  {struck(j) && <span className={shared.hint}> (desfeita)</span>}
                  {!struck(j) && j === stop && stopOn > 0 && <span className={shared.hint}> (aqui a volta para)</span>}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p style={{margin: '0 0 0.4rem'}}><strong>Volta:</strong> desfaça da última conta para a primeira.</p>
            {back.map((b, i) => (
              <div key={i} style={{opacity: shown(i), margin: '0.35rem 0'}}>
                <div style={{fontSize: '1.05rem'}}><Formula math={b.eq} /></div>
                <div className={shared.hint}>{b.note}</div>
              </div>
            ))}
            <div style={{opacity: stopOn, marginTop: '0.6rem', padding: '0.4rem 0.6rem', borderLeft: '3px solid var(--mv-tone-2)'}}>
              <strong>Pare aqui:</strong> {stopNote}
            </div>
          </div>
        </div>
        <figcaption className={shared.caption}>
          {caption ?? 'Cada linha da volta desfaz a última conta da ida que ainda está de pé, e essa conta fica apagada. A volta para no cosseno (destacado).'}
        </figcaption>
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
