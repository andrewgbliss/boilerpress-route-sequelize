# boilerpress-route-sequelize
Boilerpress route resources for sequelize

```
npm install --save boilerpress-route-sequelize
```

## Restful API Design

We will be using these techonologies.

* Node.js
* Express.js
* Sequelize.js
* Postgres

Our requirements:

Create a docker container that runs an express server. The server will create resource endpoints that create and return relational data in a Postgres database. It will be authenticated with a jwt, have caching, middleware, and have one config file.

Data Structure:

```
{
  prefix: '/api/v1',
  models, // The object of all sequelize models
}
```

## Example url

```
http://localhost:3000/api/v1/users?attributes=id,accountId&where={"id":3}&include=[{"model":"accounts", "attributes": ["id","name"], "where":{"id":1}}]&order=[["id", "desc"]]
```


