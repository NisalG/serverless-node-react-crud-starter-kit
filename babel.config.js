module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@functions/*': ['src/functions/*'],
          '@libs/*': ['src/libs/*'],
          '@common/*': ['src/common/*'],
          '@data/*': ['data/*'],
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
  ],
};
