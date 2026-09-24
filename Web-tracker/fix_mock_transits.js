import fs from 'fs';
let data = fs.readFileSync('src/data/mockData.js', 'utf8');
data = data.replace(/status:\s*"Loading"/g, 'status: "Shifted"').replace(/status:\s*"Dispatched"/g, 'status: "Shifted"');
fs.writeFileSync('src/data/mockData.js', data);
