const express = require('express');
const router = express.Router();
const { User, Page } = require("../models");
const { userList, userPages } = require("../views");

router.get("/", async (req,res,next) => {
   try {
       const users = await User.findAll();
       
       res.send(userList(users));
   }
   catch(err) {
       next(err);
   }
});

router.get("/:userId", async (req,res,next) => {
   try {
       const user = await User.findAll({
          where: {
            id: req.params.userId,
          },
          include: {
             model: Page,
             where: {
                 authorId: req.params.userId,
             }
          }
       }); 

       // JSON.parse: converts a JSON string to an object
       // JSON.stringify converts an array or object into a string
       // As a shortcut, you can use user.toJSON()
       res.send(userPages(JSON.parse(JSON.stringify(user[0]))));
   }
   catch(err) {
       next(err);
   }
})

module.exports = router;