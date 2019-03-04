const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const mode = env && env.production ? 'production' : 'development';
    console.log('Mode: ', mode);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        mode,
        stats: { modules: false },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        output: {
            filename: '[name].js',
            publicPath: 'dist/', // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                        },
                    }],
                },
                { test: /\.jsx?$/, use: 'babel-loader', include: /ClientApp/ },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
        ],
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'main-client': ['./ClientApp/index-client.jsx'] },
        module: {
            rules: [
                {
                    test: /\.less$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                    }, {
                        loader: 'css-loader', // translates CSS into CommonJS
                    }, {
                        loader: 'less-loader', // compiles Less to CSS
                    }],
                },
            ],
        },
        output: { path: path.join(__dirname, bundleOutputDir) },
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig(), {
        entry: { 'main-server': './ClientApp/index-server.jsx' },
        target: 'node',
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, bundleOutputDir),
        },
    });

    return [clientBundleConfig, serverBundleConfig];
};
