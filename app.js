// Useful note: incoming requests always come in objects
// Useful note: returned responses after queries to the database come
// in arrays; the rows are in the form of a row.

const express = require('express');
const app = express();
const morgan = require('morgan');
const html = require('html-template-tag');

const models = require('./models');
const layout = require(`./views/layout`);
const wikiRouter = require(`./routes/wiki`);
const userRouter = require(`./routes/user`);

// app.use: run this on all requests !
app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

// Sidenote: /wiki is the full url path; any router paths that's inside
// the route module goes after /wiki (ex: /wiki/add where add is the 
// router path)
app.use('/wiki', wikiRouter);
app.use('/users', userRouter);

app.get("/", (req, res, next) => {
   res.redirect('/wiki');
});

const PORT = 1337;

const init = async () => {
   await models.User.sync({force: true});
   await models.Page.sync({force: true});
   await models.db.sync({force: true});
   app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
   });
}

init();