# boilerpress-route-sequelize
Boilerpress route resources for sequelize

```
npm install --save boilerpress-route-sequelize
```

## Restful API Design

Creates restful routes based on your sequelize models.

Data Structure:

```
{
  prefix: '/api/v1',
  models, // The object of all sequelize models
  use(req, res, next) {

    // Put any middleware requirements you need here
    if (
      req.headers['x-service-token'] &&
      req.headers['x-service-token'] === 'abc123'
    ) {
      return next();
    }

    // Lock down any records that belong to the logged in user
    if (req.bp.childModelName) {
      req.bp.childSequelizeOptions.where = {
        ...get(req, 'bp.childSequelizeOptions.where', {}),
        [req.bp.childModelName === 'accounts' ? 'id' : 'accountId']: req.user.account.id,
      };
    } else {
      req.bp.sequelizeOptions.where = {
        ...get(req, 'bp.sequelizeOptions.where', {}),
        [req.bp.modelName === 'accounts' ? 'id' : 'accountId']: req.user.account.id,
      };
    }
    return next();
  },
}
```

## Example url

```
http://localhost:3000/api/v1/users?attributes=id,accountId&where={"id":3}&include=[{"model":"accounts", "attributes": ["id","name"], "where":{"id":1}}]&order=[["id", "desc"]]
```


