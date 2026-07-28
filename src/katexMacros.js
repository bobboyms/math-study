// Macros de KaTeX compartilhadas pelo site.
//
// O KaTeX traz \sin, \tan e \arcsin, que são os nomes em inglês. Escrever
// \operatorname{sen} em cada fórmula funcionaria, mas encheria o texto de ruído
// e daria margem a escrever "sen" em itálico por engano num lugar e reto em
// outro. Com as macros, $\sen x$ sai igual em toda página.
//
// Este arquivo é lido em dois lugares e por isso usa CommonJS:
// - docusaurus.config.js, para as fórmulas do corpo do texto (rehype-katex);
// - mathviz/SvgMath.jsx, para os rótulos dentro dos desenhos.
//
// Se as duas listas divergirem, um rótulo de figura quebra sem que nenhuma
// fórmula do texto quebre — erro difícil de achar. Por isso, uma lista só.
module.exports = {
  '\\sen': '\\operatorname{sen}',
  '\\tg': '\\operatorname{tg}',
  '\\cotg': '\\operatorname{cotg}',
  '\\cossec': '\\operatorname{cossec}',
  '\\arcsen': '\\operatorname{arcsen}',
  '\\arctg': '\\operatorname{arctg}',
};
