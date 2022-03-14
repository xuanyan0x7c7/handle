import { defineNuxtConfig } from 'nuxt3';

const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  ssr: false,
  ...isProduction ? {
    app: {
      buildAssetsDir: '/dist/'
    },
  } : {},
  buildModules: [
    'nuxt-windicss',
  ],
  vite: {
    base: '/dist/'
  }
});
