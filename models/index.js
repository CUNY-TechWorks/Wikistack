const { Sequelize, Op } = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false,
});

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
   },
   tags: {
     type: Sequelize.ARRAY(Sequelize.STRING),
     allowNull: false,
   }
});

// before slug is saved in the database
Page.beforeValidate(pageInstance => {
   pageInstance.slug = pageInstance.title.replace(/\s+/, '_').replace(/\W/g, '');
});

Page.beforeCreate(pageInstance => {
   pageInstance.tags = pageInstance.tags.replace(/,+/g, ' ').replace(/\s+/g,' ').split(" ");
});

Page.beforeDestroy(pageInstance => {
   return User.destroy({
      where: {
         id: pageInstance.authorId,
      }
   });
});

// Adding a class level method, which means an instance can't access this method, but a model class can (i.e Page model)
Page.findByTag = async (tag = []) => {
   const pages = await Page.findAll({
     where: {
       tags: {
         [Op.overlap]: tag, 
       }
     }
   });

   return pages;
}

const User = db.define('User', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    }
});

Page.belongsTo(User, { as: 'author' });

// Since Page already has a foreign key, there's no need to add a new one.
User.hasMany(Page, { foreignKey: 'authorId' });

module.exports = { Page, User, db }