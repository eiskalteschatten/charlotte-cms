const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'inline-source-map',
  entry: {
    main: { import: './assets/scripts/index.js', filename: 'main.[contenthash].js' },
    story: { import: './assets/scripts/story/index.js', filename: 'story.[contenthash].js' },
    account: { import: './assets/scripts/account/index.js', filename: 'account.[contenthash].js' },
    editStory: { import: './assets/scripts/editStory/index.js', filename: 'edit-story.[contenthash].js' },
    myProfile: { import: './assets/scripts/myProfile/index.js', filename: 'my-profile.[contenthash].js' },
    tags: { import: './assets/scripts/tags/index.js', filename: 'tags.[contenthash].js' },
    styles: { import: './assets/styles/index.js', filename: 'styles.[contenthash].js' },
  },
  output: {
    path: __dirname + '/public/dist',
    clean: true,//process.env.NODE_ENV !== 'development',
  },
  plugins: [
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
      publicPath: '/dist',
      generate: (seed, files) => {
        return files.reduce((manifest, { name, path: filePath }) => {
          manifest[name] = filePath;
          return manifest;
        }, seed);
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`)
      '...',
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.frontend.json',
        },
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
