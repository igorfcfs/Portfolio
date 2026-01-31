import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      <g id="B" transform="translate(11.000000, 5.000000)">
        {/* Símbolo de Código < /> no centro (Preenchido para o Loader) */}
        <path
          d="M26,35 L12,45 L26,55 M52,35 L66,45 L52,55 M35,62 L45,28"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* Animação do Hexágono Externo */}
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 50, 5
           L 11, 27
           L 11, 72
           L 50, 95
           L 89, 73
           L 89, 28 z"
      />
    </g>
  </svg>
);

export default IconLoader;