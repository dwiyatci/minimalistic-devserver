/**
 * Created by glenn on 07.10.19.
 */

module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 versions',
        useBuiltIns: 'usage',
        corejs: 3,
        debug: false
      }
    ]
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: 3,
        helpers: true,
        regenerator: true,
        useESModules: false
      }
    ],
    '@babel/plugin-proposal-object-rest-spread',
    'lodash'
  ];

  return {
    presets,
    plugins
  };
};