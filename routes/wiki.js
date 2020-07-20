const express = require('express');
const router = express.Router();

const { Page, User } = require("../models");
const { addPage, wikiPage, main, editPage } = require("../views");

router.get('/', async (req,res,next) => {
    const pages = await Page.findAll({
       attributes: ['title','slug'],
    });

    res.send(main(pages));
});

// creating values
router.post('/', async (req,res,next) => {
    try {
      const [user, wasCreated] = await User.findOrCreate({
        where: {
             name: req.body.author,
             email: req.body.email,
        }
      });

      // .create fills Page model values from req.body and replaced the
      // need for .save() method
      req.body.tags = req.body.tags.replace(/,/g, ' ').split(" ");

      const page = await Page.create(req.body);

      page.setAuthor(user);

      res.redirect(`/wiki/${page.slug}`);
    }
    catch(err) { next(err); }
});

// updating values
router.post("/:slug", async (req,res,next) => {
   try {
    const page = await Page.findOne({
       where: {
          slug: req.params.slug,
       }
    });

    await page.update({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      tags: req.body.tags.replace(/,/g, ' ').split(" "),
    });
     
    // update the associated user
    const user = await page.getAuthor();
    
    // user.toJSON().name = req.body.author;
    // user.toJSON().email = req.body.email;
    await user.update({
       name: req.body.author,
       email: req.body.email,
    });

    // ensures that the values get updated
    await page.save();

    res.redirect(`/wiki/${page.slug}`);
   }
   catch(err) {
      next(err);
   }
})

router.get(`/add`, (req,res,next) => {
    res.send(addPage());
});

router.get("/search", async (req,res,next) => {
  try {
    const pages = await Page.findByTag(req.query.search.replace(/,/g, '').split(" "));

    res.send(main(pages));
  }
  catch(err) {
    next(err);
  }
});

router.get("/:slug/edit", async (req,res,next) => {
  try {
    const page = await Page.findOne({
       where: { slug: req.params.slug }
    });

    const author = await page.getAuthor();

    res.send(editPage(page, JSON.parse(JSON.stringify(author))));
  }
  catch(err) {
    next(err); 
  }
});

router.get("/:slug/delete", async (req,res,next) => {
   try {
      const page = await Page.findOne({
         where: {
           slug: req.params.slug,
         }
      });

      const user = await page.getAuthor();

      await page.destroy();
      await user.destroy();
      
      res.redirect("/");
   }
   catch(err) {
      next(err);
   }
})

router.get("/:slug", async (req,res,next) => {
    try {
       const page = await Page.findOne({
          where: { slug: req.params.slug } 
       });

       // getAuthor returns the User model object associated with the specific page
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