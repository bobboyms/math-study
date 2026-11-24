// Macros de KaTeX compartilhadas pelo site.
//
// O KaTeX traz \sin, \tan e \arcsin, que são os nomes em inglês. Escrever
// \operatorname{sen} em cada fórmula funcionaria, mas encheria o texto de ruído
// e daria margem a escrever "sen" em itálico por engano num lugar e reto em
// outro. Com as macros, $\sen x$ sai igual em toda página.
//
// Este arquivo é lido em vários lugares e por isso usa CommonJS:
// - components/Tex e rehype/formulas-como-texto.js, para as fórmulas do corpo
//   do texto;
// - mathviz/SvgMath.jsx e mathviz/Formula.jsx, para as fórmulas dos desenhos.
//
// Se cada um tivesse a sua lista, um rótulo de figura poderia quebrar sem que
// nenhuma fórmula do texto quebrasse, um erro difícil de achar. Por isso, uma
// lista só.
module.exports = {
  '\\sen': '\\operatorname{sen}',
  '\\tg': '\\operatorname{tg}',
  '\\cotg': '\\operatorname{cotg}',
  '\\cossec': '\\operatorname{cossec}',
  '\\arcsen': '\\operatorname{arcsen}',
  '\\arctg': '\\operatorname{arctg}',
  // Hiperbólicas: o KaTeX traz \sinh, \cosh e \tanh. O cosh já tem o nome
  // usado em português; seno e tangente hiperbólicos ganham a forma da casa.
  '\\senh': '\\operatorname{senh}',
  '\\tgh': '\\operatorname{tgh}',
};
