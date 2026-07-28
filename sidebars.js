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
          id: 'numeros-e-operacoes/potencias',
          label: '2.7 Potências',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/raizes',
          label: '2.8 Raízes',
        },
        {
          type: 'doc',
          id: 'numeros-e-operacoes/expoentes-fracionarios',
          label: '2.9 Expoentes fracionários',
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
      ],
    },
    {
      type: 'category',
      label: '4. Equações',
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
          id: 'funcoes/funcao-quadratica',
          label: '5.3 Função quadrática',
        },
      ],
    },
    {
      type: 'category',
      label: '6. Geometria e trigonometria',
      link: {
        type: 'doc',
        id: 'geometria/index',
      },
      items: [
        {
          type: 'doc',
          id: 'geometria/index',
          label: '6.1 Roteiro do capítulo',
        },
        {
          type: 'doc',
          id: 'geometria/angulos',
          label: '6.2 Ângulos',
        },
        {
          type: 'doc',
          id: 'geometria/triangulos',
          label: '6.3 Triângulos',
        },
        {
          type: 'doc',
          id: 'geometria/semelhanca',
          label: '6.4 Semelhança',
        },
        {
          type: 'doc',
          id: 'geometria/teorema-de-pitagoras',
          label: '6.5 Teorema de Pitágoras',
        },
        {
          type: 'doc',
          id: 'geometria/areas-de-poligonos',
          label: '6.6 Áreas de polígonos',
        },
        {
          type: 'doc',
          id: 'geometria/circulo',
          label: '6.7 O círculo',
        },
        {
          type: 'doc',
          id: 'geometria/figuras-compostas',
          label: '6.8 Figuras compostas',
        },
        {
          type: 'doc',
          id: 'geometria/volumes-e-superficies',
          label: '6.9 Volumes e superfícies',
        },
        {
          type: 'doc',
          id: 'geometria/plano-cartesiano-e-distancia',
          label: '6.10 Plano cartesiano e distância',
        },
        {
          type: 'doc',
          id: 'geometria/equacao-da-reta',
          label: '6.11 Equação da reta',
        },
        {
          type: 'doc',
          id: 'geometria/paralelas-e-perpendiculares',
          label: '6.12 Paralelas e perpendiculares',
        },
        {
          type: 'doc',
          id: 'geometria/circunferencia-e-parabola',
          label: '6.13 Circunferência e parábola',
        },
        {
          type: 'doc',
          id: 'geometria/razoes-trigonometricas',
          label: '6.14 Seno, cosseno e tangente',
        },
        {
          type: 'doc',
          id: 'geometria/angulos-notaveis',
          label: '6.15 Ângulos notáveis',
        },
        {
          type: 'doc',
          id: 'geometria/resolvendo-triangulos-retangulos',
          label: '6.16 Resolvendo triângulos retângulos',
        },
        {
          type: 'doc',
          id: 'geometria/radianos',
          label: '6.17 Radianos',
        },
        {
          type: 'doc',
          id: 'geometria/ciclo-trigonometrico',
          label: '6.18 O ciclo trigonométrico',
        },
        {
          type: 'doc',
          id: 'geometria/reducao-ao-primeiro-quadrante',
          label: '6.19 Redução ao 1º quadrante',
        },
        {
          type: 'doc',
          id: 'geometria/arco-e-setor-circular',
          label: '6.20 Arco e setor circular',
        },
        {
          type: 'doc',
          id: 'geometria/graficos-seno-e-cosseno',
          label: '6.21 Gráficos do seno e do cosseno',
        },
        {
          type: 'doc',
          id: 'geometria/grafico-da-tangente',
          label: '6.22 Gráfico da tangente',
        },
        {
          type: 'doc',
          id: 'geometria/parametros-das-funcoes-trigonometricas',
          label: '6.23 Os parâmetros da onda',
        },
        {
          type: 'doc',
          id: 'geometria/funcoes-trigonometricas-inversas',
          label: '6.24 Funções inversas',
        },
        {
          type: 'doc',
          id: 'geometria/relacoes-fundamentais',
          label: '6.25 Relações fundamentais',
        },
        {
          type: 'doc',
          id: 'geometria/soma-diferenca-e-arco-duplo',
          label: '6.26 Soma, diferença e arco duplo',
        },
      ],
    },
    {
      type: 'doc',
      id: 'revisao-geral',
      label: '7. Revisão geral',
    },
  ],
};

module.exports = sidebars;
