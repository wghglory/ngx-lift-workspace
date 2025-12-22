const plugin = require('tailwindcss/plugin');

// https://github.com/tailwindlabs/tailwindcss/discussions/1611#discussioncomment-3016300
// since clarity base is 20px, not 16px...
const baseFontSize = 20;

const convert = (value) => {
  return (16 * value) / baseFontSize + 'rem';
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[cds-theme="dark"]'],
  content: ['./projects/demo-application/src/**/*.{html,ts}'],
  theme: {
    screens: {
      xs: '400px', // Custom breakpoint
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1536px',
    },
    extend: {
      spacing: () => ({
        ...Array.from({length: 96}, (_, index) => index * 0.5)
          .filter((i) => i)
          .reduce((acc, i) => ({...acc, [i]: `${i / (baseFontSize / 4)}rem`}), {}),
      }),
      fontSize: {
        xs: [
          `${convert(0.75)}` /* 12px */,
          {
            lineHeight: `${convert(1)}` /* 16px */,
          },
        ],
        sm: [
          `${convert(0.875)}` /* 14px */,
          {
            lineHeight: `${convert(1.25)}` /* 20px */,
          },
        ],
        base: [
          `${convert(1)}` /* 16px */,
          {
            lineHeight: `${convert(1.5)}` /* 24px */,
          },
        ],
        lg: [
          `${convert(1.125)}` /* 18px */,
          {
            lineHeight: `${convert(1.75)}` /* 28px */,
          },
        ],
        xl: [
          `${convert(1.25)}` /* 20px */,
          {
            lineHeight: `${convert(1.75)}` /* 28px */,
          },
        ],
        '2xl': [
          `${convert(1.5)}` /* 24px */,
          {
            lineHeight: `${convert(2)}` /* 32px */,
          },
        ],
        '3xl': [
          `${convert(1.875)}` /* 30px */,
          {
            lineHeight: `${convert(2.25)}` /* 36px */,
          },
        ],
        '4xl': [
          `${convert(2.25)}` /* 36px */,
          {
            lineHeight: `${convert(2.5)}` /* 40px */,
          },
        ],
        '5xl': [
          `${convert(3)}` /* 48px */,
          {
            lineHeight: `${convert(1)}`,
          },
        ],
        '6xl': [
          `${convert(3.75)}` /* 60px */,
          {
            lineHeight: `${convert(1)}`,
          },
        ],
        '7xl': [
          `${convert(4.5)}` /* 72px */,
          {
            lineHeight: `${convert(1)}`,
          },
        ],
        '8xl': [
          `${convert(6)}` /* 96px */,
          {
            lineHeight: `${convert(1)}`,
          },
        ],
        '9xl': [
          `${convert(8)}` /* 128px */,
          {
            lineHeight: `${convert(1)}`,
          },
        ],
      },
      lineHeight: {
        3: `${convert(0.75)}` /* 12px */,
        4: `${convert(1)}` /* 16px */,
        5: `${convert(1.25)}` /* 20px */,
        6: `${convert(1.5)}` /* 24px */,
        7: `${convert(1.75)}` /* 28px */,
        8: `${convert(2)}` /* 32px */,
        9: `${convert(2.25)}` /* 36px */,
        10: `${convert(2.5)}` /* 40px */,
      },
      borderRadius: {
        sm: `${convert(0.125)}` /* 2px */,
        DEFAULT: `${convert(0.25)}` /* 4px */,
        md: `${convert(0.375)}` /* 6px */,
        lg: `${convert(0.5)}` /* 8px */,
        xl: `${convert(0.75)}` /* 12px */,
        '2xl': `${convert(1)}` /* 16px */,
        '3xl': `${convert(1.5)}` /* 24px */,
      },
      minWidth: (theme) => ({
        ...theme('spacing'),
      }),
      maxWidth: (theme) => ({
        ...theme('spacing'),
        0: '0rem',
        xs: `${convert(20)}` /* 320px */,
        sm: `${convert(24)}` /* 384px */,
        md: `${convert(28)}` /* 448px */,
        lg: `${convert(32)}` /* 512px */,
        xl: `${convert(36)}` /* 576px */,
        '2xl': `${convert(42)}` /* 672px */,
        '3xl': `${convert(48)}` /* 768px */,
        '4xl': `${convert(56)}` /* 896px */,
        '5xl': `${convert(64)}` /* 1024px */,
        '6xl': `${convert(72)}` /* 1152px */,
        '7xl': `${convert(80)}` /* 1280px */,
      }),
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    // https://tailwindcss.com/docs/adding-custom-styles#using-css-and-layer
    plugin(function ({addBase, addComponents, addUtilities, theme}) {
      addComponents({
        // grid grid-cols-[1fr_3fr] @2xl:grid-cols-[repeat(2,minmax(min-content,130px)_3fr)] @4xl:grid-cols-[repeat(3,minmax(min-content,130px)_3fr)] gap-3 items-center
        '.keyvalue-grid': {
          display: 'grid',
          'grid-template-columns': '1fr 3fr',
          gap: '0.75rem',
          'align-items': 'center',
        },
        '@container (min-width: 900px)': {
          '.keyvalue-grid': {
            'grid-template-columns': 'repeat(2, minmax(min-content, 130px) 3fr)',
          },
        },
        '@container (min-width: 1100px)': {
          '.keyvalue-grid': {
            'grid-template-columns': 'repeat(3, minmax(min-content, 130px) 3fr)',
          },
        },
      });
    }),
  ],
};
