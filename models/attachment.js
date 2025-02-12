'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Attachment extends Model {
      static associate(models) {
         models.Attachment.belongsTo(models.User, { as: 'user' });
      }
   }
   Attachment.init(
      {
         userId: DataTypes.INTEGER,
         originalname: DataTypes.STRING,
         filename: DataTypes.STRING,
         mimetype: DataTypes.STRING,
         size: DataTypes.STRING,
         path: DataTypes.STRING,
         fullpath: DataTypes.STRING,
         url: DataTypes.STRING,
      },
      {
         sequelize,
         modelName: 'Attachment',
      }
   );
   return Attachment;
};
