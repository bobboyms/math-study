// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  studySidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Roteiro de estudo',
    },
    {
      type: 'category',
      label: '1. Antes das contas',
      items: [
        {
          type: 'doc',
          id: 'historia/o-que-e-matematica',
          label: '1.1 O que é matemática',
        },
      ],
    },
    {
      type: 'category',
      label: '2. Números e operações',
      link: {
        type: 'doc',
        id: 'numeros-e-operacoes/index',
      },
      items: [
        {
          type: 'doc',
          id: 'numeros-e-operacoes/index',
          label: '2.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/operacoes-basicas',
          label: '2.2 Operações básicas',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/numeros-negativos',
          label: '2.3 Números negativos',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/multiplos-divisores-primos',
          label: '2.4 Múltiplos, divisores e primos',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/fracoes',
          label: '2.5 Frações',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/decimais-e-porcentagem',
          label: '2.6 Decimais e porcentagem',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/razao-e-proporcao',
          label: '2.7 Razão e proporção',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/potencias',
          label: '2.8 Potências',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/raizes',
          label: '2.9 Raízes',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/expoentes-fracionarios',
          label: '2.10 Expoentes fracionários',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/valor-absoluto',
          label: '2.11 Valor absoluto',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/conjuntos-numericos',
          label: '2.12 Conjuntos numéricos',
        },
      ],
    },
    {
      type: 'category',
      label: '3. Álgebra',
      link: {
        type: 'doc',
        id: 'algebra/index',
      },
      items: [
        {
          type: 'doc',
          id: 'algebra/index',
          label: '3.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'algebra/expressoes-algebricas',
          label: '3.2 Expressões algébricas',
        },
        {
          type: 'doc',
          id: 'algebra/produtos-notaveis',
          label: '3.3 Produtos notáveis',
        },
        {
          type: 'doc',
          id: 'algebra/fator-comum-em-evidencia',
          label: '3.4 Fator comum em evidência',
        },
        {
          type: 'doc',
          id: 'algebra/agrupamento-e-trinomios',
          label: '3.5 Agrupamento e trinômios',
        },
        {
          type: 'doc',
          id: 'algebra/fatorar-comparando-coeficientes',
          label: '3.6 Fatorar comparando coeficientes',
        },
        {
          type: 'doc',
          id: 'algebra/fracoes-algebricas',
          label: '3.7 Frações algébricas',
        },
        {
          type: 'doc',
          id: 'algebra/operacoes-com-fracoes-algebricas',
          label: '3.8 Somar e multiplicar frações',
        },
        {
          type: 'doc',
          id: 'algebra/racionalizacao',
          label: '3.9 Racionalizar denominadores',
        },
      ],
    },
    {
      type: 'category',
      label: '4. Equações e inequações',
      link: {
        type: 'doc',
        id: 'equacoes/index',
      },
      items: [
        {
          type: 'doc',
          id: 'equacoes/index',
          label: '4.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'equacoes/equacoes-do-primeiro-grau',
          label: '4.2 Equações do 1º grau',
        },
        {
          type: 'doc',
          id: 'equacoes/equacoes-do-segundo-grau',
          label: '4.3 Equações do 2º grau',
        },
        {
          type: 'doc',
          id: 'equacoes/completar-o-quadrado',
          label: '4.4 Completar o quadrado',
        },
        {
          type: 'doc',
          id: 'equacoes/formula-de-bhaskara',
          label: '4.5 Fórmula de Bhaskara',
        },
        {
          type: 'doc',
          id: 'equacoes/plano-cartesiano',
          label: '4.6 Plano cartesiano',
        },
        {
          type: 'doc',
          id: 'equacoes/numeros-complexos',
          label: '4.7 Números complexos',
        },
        {
          type: 'doc',
          id: 'equacoes/equacoes-com-radical',
          label: '4.8 Equações com radical',
        },
        {
          type: 'doc',
          id: 'equacoes/sistemas-de-duas-equacoes',
          label: '4.9 Sistemas de duas equações',
        },
        {
          type: 'doc',
          id: 'equacoes/intervalos',
          label: '4.10 Intervalos',
        },
        {
          type: 'doc',
          id: 'equacoes/inequacoes-do-primeiro-grau',
          label: '4.11 Inequações do 1º grau',
        },
        {
          type: 'doc',
          id: 'equacoes/inequacoes-do-segundo-grau',
          label: '4.12 Inequações do 2º grau',
        },
        {
          type: 'doc',
          id: 'equacoes/inequacoes-racionais-e-modulares',
          label: '4.13 Inequações com fração e módulo',
        },
      ],
    },
    {
      type: 'category',
      label: '5. Funções',
      link: {
        type: 'doc',
        id: 'funcoes/index',
      },
      items: [
        {
          type: 'doc',
          id: 'funcoes/index',
          label: '5.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'funcoes/funcoes',
          label: '5.2 Funções',
        },
        {
          type: 'doc',
          id: 'funcoes/dominio-e-imagem',
          label: '5.3 Domínio e imagem',
        },
        {
          type: 'doc',
          id: 'funcoes/crescimento-sinal-e-simetria',
          label: '5.4 Crescimento, sinal e simetria',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-afim',
          label: '5.5 Função afim',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-quadratica',
          label: '5.6 Função quadrática',
        },
        {
          type: 'doc',
          id: 'funcoes/transformacoes-de-graficos',
          label: '5.7 Transformações de gráficos',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-modular-e-por-partes',
          label: '5.8 Função modular e por partes',
        },
        {
          type: 'doc',
          id: 'funcoes/composicao-de-funcoes',
          label: '5.9 Composição de funções',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-inversa',
          label: '5.10 Função inversa',
        },
        {
          type: 'doc',
          id: 'funcoes/funcoes-potencia-e-radicais',
          label: '5.11 Funções potência e radicais',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-polinomial',
          label: '5.12 Função polinomial',
        },
        {
          type: 'doc',
          id: 'funcoes/divisao-de-polinomios',
          label: '5.13 Divisão de polinômios',
        },
        {
          type: 'doc',
          id: 'funcoes/raizes-racionais',
          label: '5.14 Raízes racionais',
        },
        {
          type: 'doc',
          id: 'funcoes/funcoes-racionais',
          label: '5.15 Funções racionais',
        },
        {
          type: 'doc',
          id: 'funcoes/taxa-media-de-variacao',
          label: '5.16 Taxa média de variação',
        },
      ],
    },
    {
      type: 'category',
      label: '6. Exponenciais e logaritmos',
      link: {
        type: 'doc',
        id: 'exponenciais-e-logaritmos/index',
      },
      items: [
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/index',
          label: '6.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/funcao-exponencial',
          label: '6.2 Função exponencial',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/decaimento-e-o-numero-e',
          label: '6.3 Decaimento e o número e',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/misturas-e-trocas-sucessivas',
          label: '6.4 Misturas e trocas sucessivas',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/logaritmo',
          label: '6.5 O logaritmo',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/propriedades-do-logaritmo',
          label: '6.6 Propriedades do logaritmo',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/funcao-logaritmica',
          label: '6.7 Função logarítmica',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/equacoes-exponenciais-e-logaritmicas',
          label: '6.8 Equações exponenciais e logarítmicas',
        },
      ],
    },
    {
      type: 'category',
      label: '7. Geometria e trigonometria',
      link: {
        type: 'doc',
        id: 'geometria/index',
      },
      items: [
        {
          type: 'doc',
          id: 'geometria/index',
          label: '7.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'geometria/angulos',
          label: '7.2 Ângulos',
        },
        {
          type: 'doc',
          id: 'geometria/triangulos',
          label: '7.3 Triângulos',
        },
        {
          type: 'doc',
          id: 'geometria/semelhanca',
          label: '7.4 Semelhança',
        },
        {
          type: 'doc',
          id: 'geometria/teorema-de-pitagoras',
          label: '7.5 Teorema de Pitágoras',
        },
        {
          type: 'doc',
          id: 'geometria/areas-de-poligonos',
          label: '7.6 Áreas de polígonos',
        },
        {
          type: 'doc',
          id: 'geometria/circulo',
          label: '7.7 O círculo',
        },
        {
          type: 'doc',
          id: 'geometria/figuras-compostas',
          label: '7.8 Figuras compostas',
        },
        {
          type: 'doc',
          id: 'geometria/volumes-e-superficies',
          label: '7.9 Volumes e superfícies',
        },
        {
          type: 'doc',
          id: 'geometria/plano-cartesiano-e-distancia',
          label: '7.10 Plano cartesiano e distância',
        },
        {
          type: 'doc',
          id: 'geometria/equacao-da-reta',
          label: '7.11 Equação da reta',
        },
        {
          type: 'doc',
          id: 'geometria/paralelas-e-perpendiculares',
          label: '7.12 Paralelas e perpendiculares',
        },
        {
          type: 'doc',
          id: 'geometria/circunferencia-e-parabola',
          label: '7.13 Circunferência e parábola',
        },
        {
          type: 'doc',
          id: 'geometria/razoes-trigonometricas',
          label: '7.14 Seno, cosseno e tangente',
        },
        {
          type: 'doc',
          id: 'geometria/angulos-notaveis',
          label: '7.15 Ângulos notáveis',
        },
        {
          type: 'doc',
          id: 'geometria/resolvendo-triangulos-retangulos',
          label: '7.16 Resolvendo triângulos retângulos',
        },
        {
          type: 'doc',
          id: 'geometria/radianos',
          label: '7.17 Radianos',
        },
        {
          type: 'doc',
          id: 'geometria/ciclo-trigonometrico',
          label: '7.18 O ciclo trigonométrico',
        },
        {
          type: 'doc',
          id: 'geometria/reducao-ao-primeiro-quadrante',
          label: '7.19 Redução ao 1º quadrante',
        },
        {
          type: 'doc',
          id: 'geometria/arco-e-setor-circular',
          label: '7.20 Arco e setor circular',
        },
        {
          type: 'doc',
          id: 'geometria/graficos-seno-e-cosseno',
          label: '7.21 Gráficos do seno e do cosseno',
        },
        {
          type: 'doc',
          id: 'geometria/grafico-da-tangente',
          label: '7.22 Gráfico da tangente',
        },
        {
          type: 'doc',
          id: 'geometria/parametros-das-funcoes-trigonometricas',
          label: '7.23 Os parâmetros da onda',
        },
        {
          type: 'doc',
          id: 'geometria/funcoes-trigonometricas-inversas',
          label: '7.24 Funções inversas',
        },
        {
          type: 'doc',
          id: 'geometria/relacoes-fundamentais',
          label: '7.25 Relações fundamentais',
        },
        {
          type: 'doc',
          id: 'geometria/soma-diferenca-e-arco-duplo',
          label: '7.26 Soma, diferença e arco duplo',
        },
        {
          type: 'doc',
          id: 'geometria/equacoes-trigonometricas',
          label: '7.27 Equações trigonométricas',
        },
      ],
    },
    {
      type: 'doc',
      id: 'revisao-geral',
      label: '8. Revisão geral',
    },
    {
      type: 'category',
      label: '9. Cálculo 1',
      link: {
        type: 'doc',
        id: 'calculo/index',
      },
      items: [
        {
          type: 'doc',
          id: 'calculo/index',
          label: '9.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'calculo/limite-de-uma-funcao',
          label: '9.2 Limite de uma função',
        },
        {
          type: 'doc',
          id: 'calculo/calculo-de-limites',
          label: '9.3 Calculando limites',
        },
        {
          type: 'doc',
          id: 'calculo/limites-infinitos-e-no-infinito',
          label: '9.4 Limites infinitos e no infinito',
        },
        {
          type: 'doc',
          id: 'calculo/continuidade',
          label: '9.5 Continuidade',
        },
        {
          type: 'doc',
          id: 'calculo/teorema-do-confronto',
          label: '9.6 Teorema do confronto',
        },
        {
          type: 'doc',
          id: 'calculo/a-derivada',
          label: '9.7 A derivada',
        },
        {
          type: 'doc',
          id: 'calculo/quando-a-derivada-nao-existe',
          label: '9.8 Quando a derivada não existe',
        },
        {
          type: 'doc',
          id: 'calculo/regras-de-derivacao',
          label: '9.9 Regras de derivação',
        },
        {
          type: 'doc',
          id: 'calculo/regras-do-produto-e-do-quociente',
          label: '9.10 Produto e quociente',
        },
        {
          type: 'doc',
          id: 'calculo/regra-da-cadeia',
          label: '9.11 Regra da cadeia',
        },
        {
          type: 'doc',
          id: 'calculo/derivadas-de-seno-e-cosseno',
          label: '9.12 Derivadas de seno e cosseno',
        },
        {
          type: 'doc',
          id: 'calculo/derivadas-de-exponencial-e-logaritmo',
          label: '9.13 Exponencial e logaritmo',
        },
        {
          type: 'doc',
          id: 'calculo/derivacao-implicita',
          label: '9.14 Derivação implícita',
        },
        {
          type: 'doc',
          id: 'calculo/taxas-relacionadas',
          label: '9.15 Taxas relacionadas',
        },
        {
          type: 'doc',
          id: 'calculo/sinal-da-derivada',
          label: '9.16 O sinal da derivada',
        },
        {
          type: 'doc',
          id: 'calculo/maximos-e-minimos',
          label: '9.17 Máximos e mínimos',
        },
        {
          type: 'doc',
          id: 'calculo/teorema-do-valor-medio',
          label: '9.18 Teorema do valor médio',
        },
        {
          type: 'doc',
          id: 'calculo/problemas-de-otimizacao',
          label: '9.19 Problemas de otimização',
        },
        {
          type: 'doc',
          id: 'calculo/segunda-derivada-e-concavidade',
          label: '9.20 Segunda derivada e concavidade',
        },
        {
          type: 'doc',
          id: 'calculo/esboco-de-graficos',
          label: '9.21 Esboço de gráficos',
        },
        {
          type: 'doc',
          id: 'calculo/regra-de-lhopital',
          label: "9.22 Regra de L'Hôpital",
        },
        {
          type: 'doc',
          id: 'calculo/a-integral-como-area',
          label: '9.23 A integral como área',
        },
        {
          type: 'doc',
          id: 'calculo/a-integral-definida',
          label: '9.24 A integral definida',
        },
        {
          type: 'doc',
          id: 'calculo/teorema-fundamental-do-calculo',
          label: '9.25 Teorema fundamental',
        },
        {
          type: 'doc',
          id: 'calculo/primitivas-e-substituicao',
          label: '9.26 Primitivas e substituição',
        },
        {
          type: 'doc',
          id: 'calculo/area-entre-curvas',
          label: '9.27 Área entre curvas',
        },
      ],
    },
  ],
};

module.exports = sidebars;
