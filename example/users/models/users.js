'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      accountId: {
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [7, 42],
            msg: 'The password length should be between 7 and 42 characters.',
          },
        },
      },
    },
    {
      paranoid: true,
      scopes: {
        get: {
          attributes: { exclude: ['password'] },
        },
        post: {
          fields: ['accountId', 'firstName', 'lastName', 'email', 'password'],
        },
        put: {
          fields: ['firstName', 'lastName', 'email', 'password'],
        },
        patch: {
          fields: ['firstName', 'lastName', 'email', 'password'],
        },
        delete: {},
      },
    }
  );
  users.associate = models => {
    users.belongsTo(models.accounts);
  };
  users.beforeCreate((user, options) => {
    // return hashPassword(user.password).then(hashedPw => {
    //   user.password = hashedPw;
    // });
  });
  users.afterCreate(user => {
    // sendEmail(_user);
    // runReports();
    // callWebhook(_user);
  });
  return users;
};
