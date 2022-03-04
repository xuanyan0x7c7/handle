import { defineConfig } from 'windicss/helpers';
import plugin from 'windicss/plugin';

export default defineConfig({
  darkMode: 'class',
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.transform-3d': {
          'transform-style': 'preserve-3d',
        },
      });
    }),
  ],
  shortcuts: {
    btn: [
      'inline-block',
      'px-4',
      'py-1',
      'rounded',
      'bg-$c-primary',
      'opacity-90',
      'text-white',
      'cursor-pointer',
      'tracking-wide',
      'hover:opacity-100',
      'disabled:(cursor-default bg-gray-600 !opacity-50 pointer-events-none)',
    ].join(' '),
    'icon-btn': [
      'opacity-75',
      'text-1.2em',
      'cursor-pointer',
      'select-none',
      'transition',
      'duration-200',
      'ease-in-out',
      'hover:(opacity-100 text-$c-primary)',
      'disabled:pointer-events-none',
    ].join(' '),
    'square-btn': [
      'relative',
      'flex',
      'gap-2',
      'items-center',
      'px-2',
      'py-1',
      'border',
      'border-gray-400/10',
      '!outline-none',
    ].join(' '),
    'square-btn-mark': 'absolute w-2 h-2 bg-$c-primary -top-0.2rem -right-0.2rem',
    'bg-base': 'bg-white dark:bg-[#121212]',
  },
});
