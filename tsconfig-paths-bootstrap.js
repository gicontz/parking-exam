const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig');

const { baseUrl, paths } = tsConfig.compilerOptions;
Object.keys(paths).forEach((key) => {
  paths[key] = paths[key].map((path) => path.replace('./src', './build'));
});

tsConfigPaths.register({
  baseUrl,
  paths,
});
