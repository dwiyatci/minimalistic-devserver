/**
 * Created by glenn on 07.10.19.
 */

module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 versions',
        useBuiltIns: 'entry',
        corejs: 3,
        modules: false,
        debug: false,
      },
    ],
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: 3,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-lodash',
  ];

  return {
    presets,
    plugins,
  };
};
