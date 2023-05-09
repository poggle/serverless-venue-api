module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    env: {
        node: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/no-unused-vars': [
            'warn',
            { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
        ],
    },
};