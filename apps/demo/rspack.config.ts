import {createConfig} from '@nx/angular-rspack';

export default createConfig(
  {
    options: {
      root: __dirname,

      outputPath: {
        base: '../../dist/apps/demo',
      },
      index: './src/index.html',
      browser: './src/main.ts',
      polyfills: ['zone.js'],
      tsConfig: './tsconfig.app.json',
      inlineStyleLanguage: 'scss',
      assets: [
        {
          glob: '**/*',
          input: './public',
        },
        {
          glob: '**/*',
          input: './src/assets',
          output: '/assets',
        },
        './src/favicon.ico',
      ],
      styles: [
        '../../node_modules/@cds/core/global.min.css',
        '../../node_modules/@cds/core/styles/theme.dark.min.css',
        '../../node_modules/@clr/ui/clr-ui.min.css',
        './src/styles.scss',
      ],
      devServer: {},
    },
  },
  {
    production: {
      options: {
        budgets: [
          {
            type: 'initial',
            maximumWarning: '2mb',
            maximumError: '4mb',
          },
          {
            type: 'anyComponentStyle',
            maximumWarning: '4kb',
            maximumError: '8kb',
          },
        ],
        outputHashing: 'all',
        devServer: {},
      },
    },

    development: {
      options: {
        optimization: false,
        vendorChunk: true,
        extractLicenses: false,
        sourceMap: true,
        namedChunks: true,
        devServer: {},
      },
    },
  },
);
