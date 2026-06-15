// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://backupjohnalejandro-glitch.github.io',
  base: '/noche-de-estrellas',
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