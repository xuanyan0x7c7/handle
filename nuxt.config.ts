import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
  ssr: false,
  buildModules: [
    'nuxt-windicss',
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            idioms: [
              './lib/idioms/all.json',
              './lib/idioms/normal.json',
            ],
            'pinyin-dict': [
              './lib/pinyin-parser/data/dict-zi.json',
              './lib/pinyin-parser/data/phrases-dict.json',
            ],
          },
        },
      },
    },
  },
});
