// Useful note: incoming requests always come in objects
// Useful note: returned responses from queries to the database come
// in arrays.

const express = require('express');
const app = express();
const morgan = require('morgan');
const html = require('html-template-tag');

const models = require('./models');
const notFound = require(`./views/NotFound`);
const errorPage = require('./views/errorPage');
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

// request not found
app.use((req,res,next) => {
   res.status(404).send(notFound());
});

// internal server error
app.use((err, req,res,next) => {
   console.error(err.stack);
   res.status(500).send(errorPage(err));
})

const PORT = 1337;

const init = async () => {
   // this drops all DB when you reload the server,
   // if you want to keep them, switch force to false
   await models.User.sync({force: true});
   await models.Page.sync({force: true});
   await models.db.sync({force: true});
   app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
   });
}

init();