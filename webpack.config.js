/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const TsConfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')

/** @type import('webpack').Configuration */
module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    plugins: [
      new TsConfigPathsWebpackPlugin()
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
}