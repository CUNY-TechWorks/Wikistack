const html = require('html-template-tag');
const layout = require('./layout');

module.exports = () => layout(html `
   <h4>
      404 Error not found
   </h4>
`);