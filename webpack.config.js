const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const outputPath = path.resolve(__dirname, 'lib');

const getEntries = () => {
  const entriesRootDir = path.resolve(__dirname, 'src', 'entries');

  try {
    if (fs.existsSync(entriesRootDir)) {
      return fs.readdirSync(entriesRootDir)
        .reduce((acc, file) => {
          const name = file.replace(/\.[tj]sx?$/, '');
          acc[name] = path.resolve(entriesRootDir, file);
          return acc;
        }, {});
    }
    return path.resolve(__dirname, 'src', 'index.ts');
  } catch (err) {
    console.error('Failed to get webpack entries!', err);
  }
};

module.exports = (env) => {
  const isDev = env.dev;

  return {
    target: 'node',
    entry: getEntries(),
    output: {
      path: outputPath,
      filename: '[name].js',
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'source-map' : undefined,
    watch: !!isDev,
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: `vendors`,
            chunks: 'all',
          },
        },
      },
      minimize: !isDev,
    },
    module: {
      rules: [
        {
          test: /(?<!\.d)\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.d\.tsx?$/,
          loader: 'ignore-loader'
        },
        {
          test: /\.(icns|png|gif|jpe?g)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'icons',
                publicPath: './lib/icons',
              },
            },
            'img-loader',
          ],
          type: 'javascript/auto',
        },
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    }
  };
};
