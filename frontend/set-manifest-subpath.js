const fs = require('fs');

const manifestData = fs.readFileSync('./public/manifest.json', 'utf-8');
const manifest = JSON.parse(manifestData);

const subpath = process.env.REACT_APP_SUBPATH || '';

manifest.start_url = `${subpath}${manifest.start_url}`;

manifest.icons.forEach(icon => {
    icon.src = `${subpath}${icon.src}`;
});

fs.writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 2));
