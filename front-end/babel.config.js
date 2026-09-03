module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true
        },

        // The legacy decorators transform rewrites a decorated class property into an initializer that
        // the class properties transform has to finish, and preset-env would otherwise leave that
        // transform out, because every browser these targets cover supports class fields natively.
        // Forcing it on inside preset-env, rather than adding the plugin next to the decorators one,
        // is what keeps it running after preset-typescript has stripped the `declare` fields.
        include: [ 'transform-class-properties' ]
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        version: 'legacy'
      }
    ],
    [
      'module-resolver',
      {
        root: [ './' ],
        alias: {
          app: './app'
        }
      }
    ]
  ]
};
