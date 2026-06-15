// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://TU-DOMINIO.com', // Cambia esto por tu URL real al hacer deploy
  output: 'static',

  build: {
    assets: 'assets',
  },

  server: {
    host: true,
    port: 4321,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});