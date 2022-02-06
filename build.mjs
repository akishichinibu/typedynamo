import { build } from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { esbuildDecorators } from '@anatine/esbuild-decorators';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import * as path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

build({
  platform: 'node',
  target: 'es2020',
  bundle: true,
  treeShaking: true,
  tsconfig: './tsconfig.json',
  keepNames: true,
  entryPoints: [path.join(path.dirname(__filename), 'src', 'index.ts')],
  outdir: 'dist',
  plugins: [
    nodeExternalsPlugin(),
    esbuildDecorators({
      tsconfig: './tsconfig.json',
    }),
    dtsPlugin(),
  ],
});
