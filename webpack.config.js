const path = require('path');

module.exports = {
    entry: {

        game: './client/scripts/entry.js'
    },
    output: {
        path: path.resolve(__dirname, './client/scripts'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    watch: true
};