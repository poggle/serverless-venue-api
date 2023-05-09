import {pathsToModuleNameMapper} from "ts-jest";
const tsconfigPaths = require('./tsconfig.paths.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            diagnostics: false,
            tsconfig: 'tsconfig.jest.json',
        }],
    },
    moduleNameMapper: pathsToModuleNameMapper(tsconfigPaths.compilerOptions.paths),
    modulePaths: [
        '<rootDir>'
    ],
};