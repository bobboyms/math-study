import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';
import {
  Arrow,
  Axes,
  ClipDefs,
  Dot,
  FixedGrid,
  Label,
  MovedGrid,
  frame,
  lerp,
  num,
  pair,
} from '../LinearGridMorph/plane';

// As duas condições da linearidade vistas no desenho (lição 11.6).
//
// mode="sum": à esquerda, u (azul), v (laranja) e a diagonal u + v (verde) do
// paralelogramo. À direita, o plano depois da transformação: T(u), T(v), o
// canto T(u) + T(v) do paralelogramo novo (bolinha vazada, lados tracejados)
// e a seta verde T(u + v). A condição vale quando a ponta verde cai na
// bolinha vazada.
//
// mode="scale": à esquerda, v e k·v na mesma reta. À direita, T(v), o ponto
// k·T(v) (bolinha vazada) e a seta verde T(k·v). O deslizante muda o k.
//
// Os botões trocam a transformação: a linear T(x, y) = (2x, x + y), a
// translação v + (3, 1) e a que entorta, T(x, y) = (x², y). O painel da
// direita mostra a malha se transformando aos poucos (linhas retas que
// entortam quando o mapa não é linear).

const MAPS = {
  matrix: {
    label: 'T(x, y) = (2x, x + y)',
    tex: 'T(x,\\ y) = (2x,\\ x + y)',
    f: (p) => [2 * p[0], p[0] + p[1]],
  },
  translation: {
    label: 'Translação: somar (3, 1)',
    tex: 'T(\\vec{v}) = \\vec{v} + (3,\\ 1)',
    f: (p) => [p[0] + 3, p[1] + 1],
  },
  square: {
    label: 'T(x, y) = (x², y)',
    tex: 'T(x,\\ y) = (x^2,\\ y)',
    f: (p) => [p[0] * p[0], p[1]],
    curved: true,
  },
};

// k como coeficiente em LaTeX: 1 some, −1 vira só o sinal.
const coef = (k) => (Math.abs(k - 1) < 1e-9 ? '' : Math.abs(k + 1) < 1e-9 ? '-' : num(k));

const close = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-9;

export default function LinearityCheck({
  mode = 'sum',
  maps = ['matrix', 'translation', 'square'],
  initialMap,
  u = [1, 1],
  v = mode === 'sum' ? [1, 0] : [1, 1],
  k: k0 = 2,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const [key, setKey] = useState(initialMap ?? maps[0]);
  const [k, setK] = useState(k0);
  const {ref, t, play, playing} = useAnimation({duration: 2.6});
  const s = stage(t, 0.2, 2.45);
  const T = MAPS[key];
  const Ts = (p) => {
    const q = T.f(p);
    return [lerp(p[0], q[0], s), lerp(p[1], q[1], s)];
  };
  const still = !playing;

  const winBefore = mode === 'sum' ? [-1, 3, -1, 3] : [-2, 3, -2, 3];
  const winAfter = mode === 'sum' ? [-1, 9, -1, 4] : [-5, 9, -3, 5];
  const fb = frame(winBefore, 30, 24);
  const fa = frame(winAfter, 30, 24);

  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const mul = (c, a) => [c * a[0], c * a[1]];

  let before;
  let after;
  let lines;
  if (mode === 'sum') {
    const w = add(u, v);
    const Tu = Ts(u);
    const Tv = Ts(v);
    const sumT = add(Tu, Tv);
    const Tw = Ts(w);
    const same = close(sumT, Tw);
    before = (
      <>
        <line x1={fb.X(u[0])} y1={fb.Y(u[1])} x2={fb.X(w[0])} y2={fb.Y(w[1])} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} strokeDasharray="5 4" />
        <line x1={fb.X(v[0])} y1={fb.Y(v[1])} x2={fb.X(w[0])} y2={fb.Y(w[1])} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} strokeDasharray="5 4" />
        <Arrow f={fb} to={w} tone={3} label="\vec{u} + \vec{v}" offset={[8, -4, 'start']} />
        <Arrow f={fb} to={u} tone={1} label="\vec{u}" offset={[-8, -10, 'end']} />
        <Arrow f={fb} to={v} tone={2} label="\vec{v}" offset={[0, 18]} />
      </>
    );
    after = (
      <>
        <line x1={fa.X(Tu[0])} y1={fa.Y(Tu[1])} x2={fa.X(sumT[0])} y2={fa.Y(sumT[1])} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} strokeDasharray="5 4" />
        <line x1={fa.X(Tv[0])} y1={fa.Y(Tv[1])} x2={fa.X(sumT[0])} y2={fa.Y(sumT[1])} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} strokeDasharray="5 4" />
        <Arrow f={fa} to={Tw} tone={3} label={null} />
        <Arrow f={fa} to={Tu} tone={1} label={still ? 'T(\\vec{u})' : null} offset={[-8, -10, 'end']} />
        <Arrow f={fa} to={Tv} tone={2} label={still ? 'T(\\vec{v})' : null} offset={[6, 16, 'start']} />
        <Dot f={fa} at={sumT} tone={0} r={6} open />
        {still && !same && (
          <Label f={fa} at={sumT} math="T(\vec{u}) + T(\vec{v})" dx={sumT[0] > (fa.xMin + fa.xMax) / 2 ? -10 : 10} dy={-16} anchor={sumT[0] > (fa.xMin + fa.xMax) / 2 ? 'end' : 'start'} />
        )}
        {still && <Label f={fa} at={Tw} math="T(\vec{u} + \vec{v})" tone={3} dx={same ? 0 : 10} dy={same ? -18 : 6} anchor={same ? 'middle' : 'start'} />}
      </>
    );
    const Tu1 = T.f(u);
    const Tv1 = T.f(v);
    const sum1 = add(Tu1, Tv1);
    const Tw1 = T.f(w);
    const ok = close(sum1, Tw1);
    lines = (
      <>
        <p className={shared.formula}>
          <Formula math={`T(\\vec{u} + \\vec{v}) = T${pair(w)} = ${pair(Tw1)}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`T(\\vec{u}) + T(\\vec{v}) = ${pair(Tu1)} + ${pair(Tv1)} = ${pair(sum1)}`} />
        </p>
        <p>
          {ok
            ? 'Os dois caminhos chegam ao mesmo ponto: a ponta verde cai em cima da bolinha vazada. A diagonal do paralelogramo foi para a diagonal do paralelogramo novo.'
            : 'Os dois caminhos chegam a pontos diferentes: a ponta verde não cai na bolinha vazada. Esta transformação falha na condição da soma.'}
        </p>
      </>
    );
  } else {
    const kv = mul(k, v);
    const Tv = Ts(v);
    const kTv = mul(k, Tv);
    const Tkv = Ts(kv);
    const same = close(kTv, Tkv);
    const lineB = [mul(-3, v), mul(4, v)];
    before = (
      <>
        <line x1={fb.X(lineB[0][0])} y1={fb.Y(lineB[0][1])} x2={fb.X(lineB[1][0])} y2={fb.Y(lineB[1][1])} stroke="var(--mv-guide)" strokeWidth={1.4} strokeDasharray="5 4" clipPath={`url(#b${uid})`} />
        {Math.abs(k) > 0.01 && <Arrow f={fb} to={kv} tone={3} label={`${coef(k)}\\vec{v}`} offset={[10, 12, 'start']} />}
        <Arrow f={fb} to={v} tone={1} label="\vec{v}" offset={[-8, -10, 'end']} dashed={Math.abs(k - 1) < 1e-9} />
      </>
    );
    after = (
      <>
        <line x1={fa.X(0)} y1={fa.Y(0)} x2={fa.X(kTv[0])} y2={fa.Y(kTv[1])} stroke="var(--ifm-color-emphasis-600)" strokeWidth={1.4} strokeDasharray="5 4" />
        <Arrow f={fa} to={Tkv} tone={3} label={null} />
        <Arrow f={fa} to={Tv} tone={1} label={still ? 'T(\\vec{v})' : null} offset={[-8, -12, 'end']} />
        <Dot f={fa} at={kTv} tone={0} r={6} open />
        {still && !same && <Label f={fa} at={kTv} math={`${coef(k)}\\,T(\\vec{v})`} dx={0} dy={-18} />}
        {still && <Label f={fa} at={Tkv} math={`T(${coef(k)}\\vec{v})`} tone={3} dx={14} dy={same ? -18 : 18} anchor="start" />}
      </>
    );
    const Tv1 = T.f(v);
    const kTv1 = mul(k, Tv1);
    const Tkv1 = T.f(kv);
    const ok = close(kTv1, Tkv1);
    lines = (
      <>
        <p className={shared.formula}>
          <Formula math={`T(${coef(k)}\\vec{v}) = T${pair(kv)} = ${pair(Tkv1)}`} />
        </p>
        <p className={shared.formula}>
          <Formula math={`${coef(k)}\\,T(\\vec{v}) = ${num(k)} \\times ${pair(Tv1)} = ${pair(kTv1)}`} />
        </p>
        <p>
          {ok
            ? 'Multiplicar antes ou depois de transformar dá o mesmo ponto: a ponta verde cai na bolinha vazada.'
            : 'Multiplicar antes ou depois de transformar dá pontos diferentes: a ponta verde não cai na bolinha vazada. Esta transformação falha na condição da multiplicação por número.'}
        </p>
      </>
    );
  }

  const panel = (f, id, title, content, moved) => (
    <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label={title}>
      <ClipDefs f={f} id={id} />
      <Label f={f} at={[(f.xMin + f.xMax) / 2, f.yMax]} math={`\\text{${title}}`} dy={-30} fontSize={14} />
      <FixedGrid f={f} clipId={id} />
      {moved && <MovedGrid f={f} map={Ts} extent={5} curved={T.curved} clipId={id} />}
      <Axes f={f} />
      {content}
    </svg>
  );

  return (
    <div className={shared.wrapper} data-explorer="linearity-check">
      <figure className={styles.figure} ref={ref}>
        <div className={styles.row}>
          {panel(fb, `b${uid}`, 'antes', before, false)}
          {panel(fa, `a${uid}`, 'depois', after, true)}
        </div>
        <figcaption className={styles.caption}>
          {caption ??
            (mode === 'sum'
              ? 'Antes: u, v e a diagonal u + v do paralelogramo. Depois: as setas transformadas e o paralelogramo que T(u) e T(v) formam. A condição da soma vale quando a ponta verde, T(u + v), cai na bolinha vazada, T(u) + T(v).'
              : 'Antes: v e k vezes v, na mesma reta pela origem. Depois: T(v) e a bolinha vazada k vezes T(v). A condição vale quando a ponta verde, T(kv), cai na bolinha vazada.')}
        </figcaption>
      </figure>
      <div className={shared.buttons} role="group" aria-label="Escolha a transformação">
        {maps.map((m) => (
          <button
            key={m}
            type="button"
            className={m === key ? styles.active : undefined}
            aria-pressed={m === key}
            disabled={playing}
            onClick={() => {
              setKey(m);
              play();
            }}
          >
            {MAPS[m].label}
          </button>
        ))}
      </div>
      {mode === 'scale' && (
        <div className={shared.controls} style={{marginTop: '0.8rem'}}>
          <label className={shared.control}>
            <span>
              Número k: <strong>{num(k).replace('{,}', ',').replace('-', '−')}</strong>
            </span>
            <input
              type="range"
              min={-1}
              max={2}
              step={0.5}
              value={k}
              disabled={playing}
              onChange={(e) => setK(Number(e.target.value))}
              aria-label="Número k"
            />
          </label>
        </div>
      )}
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={T.tex} />
        </p>
        {lines}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a transformação de novo
        </button>
      </div>
    </div>
  );
}
