import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  resolve: { alias: { vue: 'vue/dist/vue.esm-bundler.js' } },
  plugins: [ RubyPlugin(), vue() ],
})
