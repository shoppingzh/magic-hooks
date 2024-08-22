const { javascript, stylistic, typescript, } = require('@shoppingzh/eslint-config')
const globals = require('globals')

module.exports = [
  {
    ignores: ['lib']
  },
  ...javascript({
    globals: {
      ...globals.jest,
    },
  }),
  ...stylistic(),
  ...typescript(),
  {
    files: ['*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': [0],
    }
  }
]
