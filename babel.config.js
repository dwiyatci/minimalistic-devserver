/**
 * Created by glenn on 07.10.19.
 * Last updated on 11.08.21.
 */

module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 versions',
        useBuiltIns: 'entry',
        /**
         * "Warning! Recommended to specify used minor core-js version, like corejs: '3.16', instead
         * of corejs: 3, since with corejs: 3 will not be injected modules which were added in minor
         * core-js releases."
         * @see https://github.com/zloirock/core-js#babelpreset-env
         */
        corejs: { version: 3.16, proposals: true },
        modules: false,
        debug: true,
      },
    ],
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        /**
         * "Warning! If you use @babel/preset-env and @babel/runtime together, use corejs option
         * only in one place since it's duplicate functionality and will cause conflicts."
         * @see https://github.com/zloirock/core-js#babelruntime
         */
        // corejs: { version: 3.16, proposals: true },
        helpers: true,
        regenerator: true,
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
