
import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser'

import packageJson from './package.json' assert { type: 'json' };

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      file: `dist/index.cjs`,
      format: 'cjs'
    },
    // {
    //   file: `dist/es/index.js`,
    //   format: 'es'
    // },
  ],
  plugins: [
    typescript(),
    // terser({
    //   mangle: false,
    //   compress: ,
    // }),

  ],
  watch: {
    exclude: "node_modules/**",
    include: "src/**/*.ts"
  }

})
