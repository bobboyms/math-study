import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';

// Animação das figuras das lições.
//
// Toda animação do curso precisa das mesmas três coisas, e elas moram aqui
// para não serem reescritas (e esquecidas) em cada componente:
//
// 1. Começar só quando a figura entra na tela. Uma animação que roda enquanto
//    o aluno ainda está lendo o parágrafo de cima termina sem ninguém ver.
// 2. Poder ser vista de novo: o componente chama `play()` num botão.
// 3. Respeitar quem pediu ao sistema menos movimento
//    (`prefers-reduced-motion`): para essa pessoa, a figura já aparece no
//    quadro final, que é o quadro que ensina.
//
// O tempo `t` vai de 0 até `duration`, em segundos. No build (sem janela) e no
// modo de menos movimento, `t` já começa em `duration`: o HTML estático e a
// captura de tela mostram a figura completa.
//
// Uso:
//   const {ref, t, play, playing} = useAnimation({duration: 4});
//   <figure ref={ref}> ... desenho em função de t ... </figure>
//   <button onClick={() => play()}>Ver de novo</button>

const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function useAnimation({
  duration,
  autoplay = true,
  threshold = 0.45,
  onFrame,
} = {}) {
  const ref = useRef(null);
  const raf = useRef(0);
  const reduced = useRef(false);
  const current = useRef(duration);
  const [t, setT] = useState(duration);
  const [total, setTotal] = useState(duration);
  const [playing, setPlaying] = useState(false);
  const frameCb = useRef(onFrame);
  frameCb.current = onFrame;

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setPlaying(false);
  }, []);

  // `play()` repete a animação inteira; `play({duration: 3})` troca a duração
  // desta vez (útil quando o destino muda, como meia volta ou volta inteira).
  const play = useCallback(
    (options = {}) => {
      const d = options.duration ?? duration;
      cancelAnimationFrame(raf.current);
      setTotal(d);
      if (reduced.current) {
        setT(d);
        frameCb.current?.(d, d);
        return;
      }
      let start = null;
      setPlaying(true);
      setT(0);
      frameCb.current?.(0, d);
      const step = (now) => {
        if (start === null) start = now;
        const elapsed = (now - start) / 1000;
        const value = Math.min(elapsed, d);
        current.current = value;
        setT(value);
        frameCb.current?.(value, d);
        if (elapsed < d) raf.current = requestAnimationFrame(step);
        else setPlaying(false);
      };
      raf.current = requestAnimationFrame(step);
    },
    [duration],
  );

  useIsoLayoutEffect(() => {
    reduced.current = prefersReducedMotion();
    if (reduced.current || !autoplay) return undefined;
    // Antes da primeira pintura: a figura espera parada no quadro inicial.
    setT(0);
    frameCb.current?.(0, duration);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      play();
      return () => cancelAnimationFrame(raf.current);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      {threshold},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // A animação automática acontece uma vez, na montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {ref, t, total, playing, play, stop};
}

// ---------------------------------------------------------------------------
// Ferramentas de desenho comuns às figuras animadas.

// Suaviza o começo e o fim de um movimento (0 → 1).
export const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

// Progresso suavizado de uma etapa que vai de `a` a `b` segundos.
export const stage = (t, a, b) => ease((t - a) / (b - a));

// Ponto da circunferência no ângulo `a` (radianos, anti-horário, y para cima
// na matemática — por isso o sinal de menos no y do SVG).
export const onCircle = (cx, cy, r, a) => [
  cx + r * Math.cos(a),
  cy - r * Math.sin(a),
];

// Arco de `a0` a `a1` (radianos, anti-horário), como caminho SVG.
export function arcPath(cx, cy, r, a0, a1) {
  const [x1, y1] = onCircle(cx, cy, r, a0);
  const [x2, y2] = onCircle(cx, cy, r, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// Número com vírgula decimal.
export const fmt = (value, digits = 2) =>
  Number(value).toFixed(digits).replace('.', ',');

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// Um ângulo inteiro em graus escrito como fração de π, em LaTeX:
// 135 → '\\frac{3\\pi}{4}', 180 → '\\pi', 0 → '0'.
export function piFraction(deg) {
  if (deg === 0) return '0';
  const g = gcd(Math.abs(deg), 180);
  const n = deg / g;
  const m = 180 / g;
  const top = n === 1 ? '\\pi' : `${n}\\pi`;
  return m === 1 ? top : `\\frac{${top}}{${m}}`;
}

// A mesma razão graus/180 como fração simplificada, em LaTeX: 135 → '\\frac{3}{4}'.
export function fractionOf180(deg) {
  const g = gcd(Math.abs(deg), 180) || 1;
  const n = deg / g;
  const m = 180 / g;
  return m === 1 ? String(n) : `\\frac{${n}}{${m}}`;
}
