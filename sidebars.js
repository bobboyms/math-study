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
          id: 'algebra/fracoes-algebricas',
          label: '3.6 Frações algébricas',
        },
        {
          type: 'doc',
          id: 'algebra/operacoes-com-fracoes-algebricas',
          label: '3.7 Somar e multiplicar frações',
        },
        {
          type: 'doc',
          id: 'algebra/racionalizacao',
          label: '3.8 Racionalizar denominadores',
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
          id: 'equacoes/numeros-complexos',
          label: '4.6 Números complexos',
        },
        {
          type: 'doc',
          id: 'equacoes/equacoes-com-radical',
          label: '4.7 Equações com radical',
        },
        {
          type: 'doc',
          id: 'equacoes/sistemas-de-duas-equacoes',
          label: '4.8 Sistemas de duas equações',
        },
        {
          type: 'doc',
          id: 'equacoes/intervalos',
          label: '4.9 Intervalos',
        },
        {
          type: 'doc',
          id: 'equacoes/inequacoes-do-primeiro-grau',
          label: '4.10 Inequações do 1º grau',
        },
        {
          type: 'doc',
          id: 'equacoes/inequacoes-do-segundo-grau',
          label: '4.11 Inequações do 2º grau',
        },
        {
          type: 'doc',
          id: 'equacoes/inequacoes-racionais-e-modulares',
          label: '4.12 Inequações com fração e módulo',
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
          id: 'funcoes/funcao-quadratica',
          label: '5.5 Função quadrática',
        },
        {
          type: 'doc',
          id: 'funcoes/transformacoes-de-graficos',
          label: '5.6 Transformações de gráficos',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-modular-e-por-partes',
          label: '5.7 Função modular e por partes',
        },
        {
          type: 'doc',
          id: 'funcoes/composicao-de-funcoes',
          label: '5.8 Composição de funções',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-inversa',
          label: '5.9 Função inversa',
        },
        {
          type: 'doc',
          id: 'funcoes/funcao-polinomial',
          label: '5.10 Função polinomial',
        },
        {
          type: 'doc',
          id: 'funcoes/divisao-de-polinomios',
          label: '5.11 Divisão de polinômios',
        },
        {
          type: 'doc',
          id: 'funcoes/raizes-racionais',
          label: '5.12 Raízes racionais',
        },
        {
          type: 'doc',
          id: 'funcoes/funcoes-racionais',
          label: '5.13 Funções racionais',
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
          id: 'exponenciais-e-logaritmos/logaritmo',
          label: '6.4 O logaritmo',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/propriedades-do-logaritmo',
          label: '6.5 Propriedades do logaritmo',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/funcao-logaritmica',
          label: '6.6 Função logarítmica',
        },
        {
          type: 'doc',
          id: 'exponenciais-e-logaritmos/equacoes-exponenciais-e-logaritmicas',
          label: '6.7 Equações exponenciais e logarítmicas',
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
  ],
};

module.exports = sidebars;
