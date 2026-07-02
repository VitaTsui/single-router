export default {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react', esModuleInterop: true } }]
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node']
}
