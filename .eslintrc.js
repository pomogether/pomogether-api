/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@adonisjs/eslint-config/app'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
}
