import { join } from 'path';

import { buildAppConfig } from '../src/config/config.server';
import { commonExports } from './webpack.common';

const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

module.exports = Object.assign({}, commonExports, {
  target: 'web',
  node: {
    module: 'empty'
  },
  plugins: [
    ...commonExports.plugins,
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  devServer: {
    before(app, server) {
      buildAppConfig(join(process.cwd(), 'src/assets/config.json'));
    }
  }
});
