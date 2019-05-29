module.exports = wallaby => ({
  files: [
    'src/**/*.js',
    'src/**/*.ts',
    'src/**/*.tsx',
    'tests/utils/*',
    'tsconfig.json',
    '__mocks__/**/*',
    '@types/**/*',
  ],

  tests: [
    'tests/**/*.js',
    'tests/**/*.ts',
    'tests/**/*.tsx',
    '!tests/utils/*',
  ],

  env: {
    type: 'node',
    runner: 'node',
  },

  testFramework: 'jest',

  compilers: {
    '**/*.ts?(x)': wallaby.compilers.typeScript({module: 'commonjs'}),
  },
})
