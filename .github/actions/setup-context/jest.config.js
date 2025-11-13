export const clearMocks = true;
export const moduleFileExtensions = ['js', 'ts'];
export const roots = ['<rootDir>/packages'];
export const testEnvironment = 'node';
export const testMatch = ['**/__tests__/*.test.ts'];
export const transform = {
    '^.+\\.ts$': 'ts-jest'
};
export const verbose = true;