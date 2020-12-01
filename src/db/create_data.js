// const dbopt = require('./db/dbopt');
const fs = require('fs');

let data = fs.readFileSync('./nickname.txt');
console.log(data);