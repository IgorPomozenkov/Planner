module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ["@babel/plugin-transform-runtime",
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
                alias: {
                    '@': ['./src'],
                    '@store': ['./src/store'],
                    '@scenes': ['./src/scenes'],
                    '@routes': ['./src/routes'],
                    '@utils': ['./src/utils'],
                    '@styles': ['./src/styles'],
                    '@image': ['./src/image'],
                    '@app': ['./src/app'],
                },
            },
        ],
    ],
};
