const path = require('path');
const entryFile = path.resolve(__dirname, 'client', 'src', 'index.js');
const outputDir = path.resolve(__dirname, 'client', 'dist');

const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', entryFile],
  output: {
    publicPath:"/",
    filename: 'bundle.js',
    path: outputDir
  },
  module: {
    rules: [

      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  // loaders: [
  //       {
  //           test: /\.svg$/,
  //           exclude: /node_modules/,
  //           use: {
  //               loader: 'svg-react-loader',
  //               options: {
  //                   tag: 'symbol',
  //                   attrs: {
  //                       title: 'example',
  //                   },
  //                   name: 'Clockface',
  //               },
  //           },
  //       }
  //   ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
         // test: /\.xxx$/, // may apply this only for some modules
         options: {
           loaders: [
        {
            test: /\.svg$/,
            exclude: /node_modules/,
            use: {
                loader: 'svg-react-loader',
                options: {
                    tag: 'symbol',
                    attrs: {
                        title: 'example',
                    },
                    name: 'Clockface',
                },
            },
        }
    ]
         }
       })
  ],
  devServer: {
    contentBase: './client/dist',
    hot: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/home': 'http://localhost:3000',
      '/clock': 'http://localhost:3000',
      '/profile': 'http://localhost:3000',
    }
  }
};