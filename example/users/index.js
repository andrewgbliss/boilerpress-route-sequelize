const { app, start } = require('boilerpress');
const routeLoader = require('boilerpress-route-loader');
const resources = require('boilerpress-route-sequelize');
const os = require('os');
const path = require('path');
const resourcesConfig = require(path.join(__dirname, 'resources'));
const map = require('lodash/map');

// Add any middleware you need
app.use((req, res, next) => {
  res.locals = {
    host: os.hostname(),
    title: 'Express',
  };
  next();
});

app.use('/', routeLoader(path.join(__dirname, 'routes')));
app.use('/', resources(resourcesConfig));

app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  if (err.name === 'SequelizeValidationError') {
    res.json({
      error: {
        message: map(err.errors, 'message'),
      },
    });
  } else {
    res.json({
      error: {
        message: err.message,
      },
    });
  }
});

// Start the Express server
start();