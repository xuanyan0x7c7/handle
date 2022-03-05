import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
  ssr: false,
  buildModules: [
    '@vueuse/nuxt',
    'nuxt-windicss',
  ],
});
