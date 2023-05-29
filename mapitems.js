const mapFolder = require('map-folder');
 
// sync
const result = mapFolder('./public/objects');
 
const fs = require('fs');
fs.writeFileSync('map.json', JSON.stringify(result, null, 4))