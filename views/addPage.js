const html = require("html-template-tag");
const layout = require("./layout");

module.exports = () => layout(html`
  <h3>Add a Page</h3>
  <hr>
  <form method="POST" action="/wiki/">
    
    <div> <label for="author"> Author: </label> <input name="author" type="text"/> </div>
    
    <div> <label for="email"> Email: </label> <input name="email" type="text"/> </div>
    
    <div class="form-group">
      <label for="title" class="col-sm-2 control-label">Page Title</label>
      <div class="col-sm-10">
        <input id="title" name="title" type="text" class="form-control"/>
      </div>
    </div>

    <div> <label for="content"> Page Content: </label> <textarea name="content" type="text"></textarea> </div>
    
    <div> <label for="page-status"> Page Status: </label> <input name="page-status" type="text"/> </div>

    <div class="col-sm-offset-2 col-sm-10">
      <button type="submit" class="btn btn-primary">submit</button>
    </div>
  
  </form>
`);