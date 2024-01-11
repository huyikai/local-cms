// import addShebang from 'rollup-plugin-add-shebang';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: './cms.ts',
    output: [
      {
        file: './cms.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [typescript(), terser()]
  },
  {
    input: 'bin/cli.ts',
    output: [
      {
        file: 'lib/bin/cli.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      typescript(),
      terser(),
      // addShebang({ include: 'lib/bin/cli.js' })
    ]
  }
];
