const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false,
});

function generateSlug(title) {
  if(title === '' || title === undefined) {
     const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ';

     let randomized = '';
     for(let i=0;i<Math.floor(Math.random() * 10);i++) {
         randomized+=letters[Math.floor(Math.random() * letters.length)];
     }
     
     return randomized;
  }
  return title.replace(/\s+/, '_').replace(/\W/g, '');
}

const Page = db.define('Page', {
   title: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   slug: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   content: {
     type: Sequelize.TEXT,
     allowNull: false,
   },
   status: {
     type: Sequelize.ENUM('open', 'closed'),
   }
});

// before the title and slug is saved in the database
Page.beforeValidate(pageInstance => {
   pageInstance.slug = generateSlug(pageInstance.title);
});

const User = db.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = { Page, User, db }