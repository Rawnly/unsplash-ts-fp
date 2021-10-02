const { pathsToModuleNameMapper } = require( 'ts-jest/utils' );
// const { compilerOptions } = require( './tsconfig.json' );

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper( {
    "@src/*": ["src/*"],
    "@utils/*": ["src/utils/*"],
    "@api/*": ["src/api/*"],
  }, {
    prefix: '<rootDir>/'
  } )
};
