module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        strict: false,
        noImplicitAny: false,
        strictNullChecks: false,
        strictFunctionTypes: false,
        strictBindCallApply: false,
        strictPropertyInitialization: false,
        noImplicitThis: false,
        alwaysStrict: false,
      },
      isolatedModules: true // This should ignore type errors
    }],
  },
}; 