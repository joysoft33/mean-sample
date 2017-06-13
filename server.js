'use strict';

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import debug from 'debug';

// Get server settings
import settings from './server/utilities/settings';
// Passport configuration
import auth from './server/config/passport';
// Logger device configuration
import logs from './server/config/logs';
// Application routes configuration function
import router from './server/routes';

// Create an Express application
let app = express();

// Configure and get passport authentication object
let passport = auth();

// Get application config
let env = settings();

// Configure logger device
logs.configure(app, env);

// Tell Express where is our favicon
app.use(favicon(env.publicPath + '/favicon.ico'));
// Tell Express that messages bodies will be JSON formatted
app.use(bodyParser.json());
// Only parses urlencoded bodies (gzip and deflate enabled)
app.use(bodyParser.urlencoded({
  extended: false
}));

// Add cookie parsing ability
app.use(cookieParser());

// Set default static files path
app.use(express.static(env.publicPath, {
  etag: false
}));

// Initialize passport used by express for authentication
app.use(passport.initialize());

// Set web service routes
app.use('/api', router(passport));

// Unknown route handler
app.use((req, res) => {
  res.status(404).send('The requested page doesn\'t exist!');
});

// Errors handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err);
});

// Connect to database
mongoose.connect(env.db, (err) => {

  if (err) {
    throw err;
  }

  debug('Successfully connected to MongoDB');

  // Get port from environment and store in Express.
  const port = parseInt(process.env.PORT, 10) || 8080;

  // Finally, create the HTTP server
  app.listen(port, () => {
    debug('Listening on port ' + port);
  });
});