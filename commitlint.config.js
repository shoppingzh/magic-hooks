/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-enum': [2, 'always', ['base', 'core', 'chart']],
    'subject-case': [0],
  }
}
