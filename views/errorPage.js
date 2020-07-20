const html = require('html-template-tag');
const layout = require('./layout');

module.exports = err => layout(html `
   <h5>
     ${err}
   </h5>
`);