import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// The site reads ../level-1-learn and ../level-2-build at build time, so every number on the page is generated, never typed.
export default defineConfig({
  base: '/fleet-capstone/',
  plugins: [react()],
  server: { fs: { allow: ['..'] } },
});
