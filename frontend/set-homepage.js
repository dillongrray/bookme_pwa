const fs = require('fs');

const packageJson = require('./package.json');

packageJson.homepage = process.env.HOMEPAGE_URL;

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
