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
      type: 'doc',
      id: 'revisao-geral',
      label: '6. Revisão geral',
    },
  ],
};

module.exports = sidebars;
