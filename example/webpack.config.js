const { commonBuilder } = require('../webpack.common.js');
let common = commonBuilder(__dirname);
console.log(common);
module.exports = common;
