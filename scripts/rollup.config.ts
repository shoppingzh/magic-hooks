import path from 'path'
import { defineConfig } from 'rollup'
import alias from '@rollup/plugin-alias'
import sizes from '@atomico/rollup-plugin-sizes'
import ts from '@rollup/plugin-typescript'
import beep from '@rollup/plugin-beep'
import { terser } from 'rollup-plugin-terser'
import pkg from '../package.json'
import clear from 'rollup-plugin-clear'
import config from './config'
import { dts } from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'

const input = config.entryList.reduce((map, o) => {
  map[o] = `src/${o}/index.ts`
  return map
}, {})

const external = Object.keys((pkg).peerDependencies || {})

const plugins = [
  alias({
    entries: [
      {
        find: '@',
        replacement: path.resolve(__dirname, '../src'),
      },
    ],
  }),
  sizes(100),
  beep(),
]

export default [
  defineConfig({
    input,
    output: [{
      dir: 'lib',
      format: 'esm',
      entryFileNames: '[name].mjs',
    }, {
      dir: 'lib',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    }],

    external,
    plugins: [
      ...plugins,
      clear({
        targets: ['lib'],
      }),
      commonjs(),
      ts({
        tsconfig: path.resolve(__dirname, '../tsconfig.json'),
      }),
      terser(),
    ],
  }),

  // 声明文件生成
  defineConfig({
    input,
    output: {
      dir: 'lib',
    },
    external,
    plugins: [
      ...plugins,
      dts({
        compilerOptions: {
          preserveSymlinks: false,
        }
      })
    ],
  })
]
