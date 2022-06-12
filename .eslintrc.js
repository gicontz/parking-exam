const fs = require('fs');

const config = JSON.parse(
  fs.readFileSync('./.eslintrc.json'),
);
config.settings['import/resolver'].typescript = {
  project: './tsconfig.json',
};

module.exports = config;
