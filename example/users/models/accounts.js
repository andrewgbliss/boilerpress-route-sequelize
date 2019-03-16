'use strict';
module.exports = (sequelize, DataTypes) => {
  const accounts = sequelize.define(
    'accounts',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
      scopes: {
        get: {},
        post: {
          fields: ['name'],
        },
        put: {
          fields: ['name'],
        },
        patch: {
          fields: ['name', 'deletedAt'],
        },
        delete: {},
      },
    }
  );
  accounts.associate = models => {
    accounts.hasMany(models.users);
  };
  return accounts;
};
