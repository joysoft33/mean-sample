'use strict';

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import logger from 'morgan';

// Passport configuration
import auth from './server/config/passport';
let passport = auth();

// Application routes configuration function
import router from './server/routes';

// Get server settings
import settings from './server/utilities/settings';
// Get application config
let env = settings();

// Create an Express application
let app = express();

// Get port from environment and store in Express.
const port = parseInt(process.env.PORT, 10) || 8080;

// Set logger device
if (env.runMode == 'production') {
  app.use(logger('prod', {
    skip: function (req, res) {
      return res.statusCode < 400
    },
    stream: __dirname + './mean.log'
  }));
} else {
  app.use(logger('dev'));
}

// Tell express that messages bodies will be JSON formatted
app.use(bodyParser.json());
// Only parses urlencoded bodies (gzip and deflate enabled)
app.use(bodyParser.urlencoded({
  extended: false
}));

// Add cookie parsing ability
app.use(cookieParser());

// Set default static files path
app.use(express.static(env.publicPath));

// Initialize passport used by express for authentication
app.use(passport.initialize())

// Set web service routes
app.use('/api', router(app, passport));

// Default home page
app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: env.publicPath
  });
});

// Unknown route handler
app.use((req, res) => {
  res.status(404).send('The requested page doesn\'t exist!');
});

// Errors handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to database
mongoose.connect(env.db, function (err) {
  
  if (err) throw err;
  
  debug('Successfully connected to MongoDB');
  
  // Finally, create the HTTP server
  app.listen(port, function () {
    debug('Listening on port ' + port);
  });
});
