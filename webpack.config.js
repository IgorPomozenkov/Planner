const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const FontPreloadPlugin = require('webpack-font-preload-plugin');
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (_, args) => {
  const mode = args.mode || 'development';
  const isProduction = mode === 'production';

  const default_config = {
    mode,
    target: 'web',
    entry: './src/index.tsx',
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': ['./src'],
        '@store': path.resolve(__dirname, 'src/store'),
        '@scene': path.resolve(__dirname, 'src/scene'),
      },
      extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /fonts[\\/].*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
        {
          test: /\.svg$/,
          use: [{ loader: 'url-loader' }],
        },
        {
          test: /\.tsx?$/,
          use: [
            { loader: 'babel-loader', options: { cacheCompression: false, cacheDirectory: true } },
            { loader: 'ts-loader', options: { transpileOnly: true } },
          ],
          exclude: '/node_modules/',
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true } },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: true } },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          test: /\.module\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                },
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [{ loader: 'file-loader' }],
        },
        {
          test: /\.(webp)$/i,
          use: ['file-loader', 'webp-loader'],
        },
      ],
    },
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/',
        },
      ],
      hot: true,
      port: 9001,
      historyApiFallback: true,
      // devMiddleware: {
      //   writeToDisk: true,
      // },
    },
    output: {
      hashFunction: 'xxhash64',
      filename: '[name]-[contenthash].js',
      chunkFilename: '[name]-[contenthash].js',
      path: path.resolve(__dirname, 'public', 'dist'),
      publicPath: '/',
    },
    plugins: [
      new Dotenv(),
      new FontPreloadPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        // favicon: './src/image/fav.png',
      }),
      new MiniCssExtractPlugin({
        filename: '[name]-[contenthash].css',
        chunkFilename: '[name]-[contenthash].css',
      }),
      new RobotstxtPlugin({
        filePath: './robots.txt',
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      // new BundleAnalyzerPlugin(),
    ],
  };

  const production_config = {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          parallel: true,
          extractComments: true,
          terserOptions: {
            sourceMap: true,
          },
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            sourceMap: true,
          },
        }),
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 200000,
        minRemainingSize: 0,
        maxSize: 400000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  };

  const config = isProduction
    ? {
        ...default_config,
        ...production_config,
      }
    : {
        ...default_config,
      };

  // console.log(mode);
  // console.log(config);

  return config;
};
