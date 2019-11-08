const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Get manifest
var normalizedPath = require('path').join(__dirname, './target/dependency');
var manifest = '';
require('fs').readdirSync(normalizedPath).forEach(function (file) {
    manifest = './target/dependency/' + file;
    console.log('use manifest ' + manifest);
});

module.exports = (env, argv) => {
    let config = {
        entry: {
            main: ['whatwg-fetch', path.resolve(__dirname, 'src/javascript/publicPath'), path.resolve(__dirname, 'src/javascript/ContentManagerApp.loader')]
        },
        output: {
            path: path.resolve(__dirname, 'src/main/resources/javascript/apps/'),
            filename: 'cmm.bundle.js',
            chunkFilename: '[name].cmm.[chunkhash:6].js'
        },
        optimization: {
            splitChunks: {
                maxSize: 400000
            }
        },
        resolve: {
            mainFields: ['module', 'main'],
            extensions: ['.mjs', '.js', '.jsx', 'json']
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: [path.join(__dirname, 'src')],
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ['@babel/preset-env', {modules: false, targets: {safari: '7', ie: '10'}}],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            'lodash',
                            ['transform-imports', {
                                '@material-ui/icons': {
                                    transform: '@material-ui/icons/${member}',
                                    preventFullImport: true
                                },
                                'mdi-material-ui': {
                                    transform: 'mdi-material-ui/${member}',
                                    preventFullImport: true
                                }
                            }],
                            '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                manifest: require(manifest)
            }),
            new CleanWebpackPlugin(path.resolve(__dirname, 'src/main/resources/javascript/apps/'), {verbose: false}),
            new webpack.HashedModuleIdsPlugin({
                hashFunction: 'sha256',
                hashDigest: 'hex',
                hashDigestLength: 20
            }),
            new CopyWebpackPlugin([{from: './package.json', to: ''}])
        ],
        mode: 'development'
    };

    config.devtool = (argv.mode === 'production') ? 'source-map' : 'eval-source-map';

    if (argv.analyze) {
        config.devtool = 'source-map';
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};
