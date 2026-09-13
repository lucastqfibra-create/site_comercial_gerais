import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Permite rodar facilmente no GitHub Pages sem erros de caminho
});
