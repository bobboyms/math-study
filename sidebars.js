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
          label: 'O que e matematica',
        },
      ],
    },
    {
      type: 'category',
      label: '2. Matematica basica',
      link: {
        type: 'doc',
        id: 'matematica-basica/index',
      },
      items: [
        {
          type: 'doc',
          id: 'matematica-basica/index',
          label: '2.1 Roteiro do capitulo',
        },
        {
          type: 'doc',
          id: 'matematica-basica/operacoes-basicas',
          label: '2.2 Operações básicas',
        },
        {
          type: 'doc',
          id: 'matematica-basica/numeros-negativos',
          label: '2.3 Numeros negativos',
        },
        {
          type: 'doc',
          id: 'matematica-basica/multiplos-divisores-primos',
          label: '2.4 Multiplos, divisores e primos',
        },
        {
          type: 'doc',
          id: 'matematica-basica/fracoes',
          label: '2.5 Fracoes',
        },
        {
          type: 'doc',
          id: 'matematica-basica/decimais-e-porcentagem',
          label: '2.6 Decimais e porcentagem',
        },
        {
          type: 'doc',
          id: 'matematica-basica/potencias',
          label: '2.7 Potencias',
        },
        {
          type: 'doc',
          id: 'matematica-basica/raizes',
          label: '2.8 Raizes',
        },
        {
          type: 'doc',
          id: 'matematica-basica/expoentes-fracionarios',
          label: '2.9 Expoentes fracionarios',
        },
        {
          type: 'doc',
          id: 'matematica-basica/expressoes-algebricas',
          label: '2.10 Expressões algébricas',
        },
        {
          type: 'doc',
          id: 'matematica-basica/produtos-notaveis',
          label: '2.11 Produtos notáveis',
        },
        {
          type: 'doc',
          id: 'matematica-basica/fator-comum-em-evidencia',
          label: '2.12 Fator comum em evidência',
        },
        {
          type: 'doc',
          id: 'matematica-basica/agrupamento-e-trinomios',
          label: '2.13 Agrupamento e trinômios',
        },
        {
          type: 'doc',
          id: 'matematica-basica/equacoes',
          label: '2.14 Equações',
        },
        {
          type: 'doc',
          id: 'matematica-basica/equacoes-do-segundo-grau',
          label: '2.15 Equações do 2º grau',
        },
        {
          type: 'doc',
          id: 'matematica-basica/funcoes',
          label: '2.16 Funções',
        },
        {
          type: 'doc',
          id: 'matematica-basica/revisao-geral',
          label: '2.17 Revisão geral',
        },
      ],
    },
    {
      type: 'category',
      label: '3. Funcoes',
      items: [
        {
          type: 'doc',
          id: 'funcoes/funcao-quadratica',
          label: '3.1 Funcao quadratica',
        },
      ],
    },
  ],
};

module.exports = sidebars;
