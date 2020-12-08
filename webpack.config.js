/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const TsConfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  target: 'web',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'WrittenMongolKeyboard',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsConfigPathsWebpackPlugin()],
  },
}
