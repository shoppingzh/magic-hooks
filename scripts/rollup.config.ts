import path from 'path'
import { defineConfig } from 'rollup'
import alias from '@rollup/plugin-alias'
import { babel } from '@rollup/plugin-babel'
import sizes from '@atomico/rollup-plugin-sizes'
import ts from '@rollup/plugin-typescript'
import beep from '@rollup/plugin-beep'
import { terser } from 'rollup-plugin-terser'
import pkg from '../package.json'
import clear from 'rollup-plugin-clear'
import glob from 'glob'

export default defineConfig({
  input: glob.sync('src/*.ts'),
  output: [{
    dir: 'lib',
    format: 'esm',
    entryFileNames: '[name].mjs',
  }, {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].cjs',
  }],
  external: Object.keys((pkg as any).peerDependencies || {}),
  plugins: [
    alias({
      entries: [
        {
          find: '@',
          replacement: 'src',
        },
      ],
    }),
    clear({
      targets: ['lib'],
    }),
    ts({
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    }),
    // babel({
    //   babelHelpers: 'runtime',
    // }),
    sizes(100),
    terser(),
    beep(),
  ],
})
