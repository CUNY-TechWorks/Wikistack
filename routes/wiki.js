const express = require('express');
const router = express.Router();

const { Page, User } = require("../models");
const { addPage } = require("../views");
const { wikiPage } = require("../views");
const { main } = require("../views");

router.get('/', async (req,res,next) => {
    const pages = await Page.findAll({
       attributes: ['title','slug'],
    });

    res.send(main(pages));
});

router.post('/', async (req,res,next) => {
    try {
      const [user, wasCreated] = await User.findOrCreate({
        where: {
             name: req.body.author,
             email: req.body.emailm
        }
      });
      
      // .create fills Page model values from req.body and replaced the
      // need for .save() method
      const page = await Page.create(req.body);

      page.setAuthor(user);

      res.redirect(`/wiki/${page.slug}`);
    }
    catch(err) { next(err); }
});

router.get(`/add`, (req,res,next) => {
    res.send(addPage());
});

router.get("/:slug", async (req,res,next) => {
    try {
       const page = await Page.findOne({
          where: { slug: req.params.slug } 
       });

       // getAuthor returns the User model object
       // so in the wikiPage html, we're going to have to dig
       // into the object to access the needed values (id, name)
       // something like user.dataValues.name
       const user = await page.getAuthor();
       
       res.send(wikiPage(page, user));
    }
    catch(err) {
       next(err);
    }
});

module.exports = router;