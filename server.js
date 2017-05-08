'use strict';

let express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  debug = require('debug')('mean'),
  passport = require('passport'),
  logger = require('morgan');

// Get Express router module
const router = express.Router();
// Create an Express application
let app = express();

// Passport configuration
require('./server/config/passport')(passport) 
// Aplication routes configuration
require('./server/routes')(router, passport);

// Get server settings
const settings = require('./server/utilities/settings')();

// Get port from environment and store in Express.
const port = parseInt(process.env.PORT, 10) || 8080;

// Set logger device
if (settings.runMode == 'production') {
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
app.use(express.static(settings.publicPath));

// Initialize passport used by express for authentication
app.use(passport.initialize())

// Set web service routes
app.use('/api', router);

// Default home page
app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: settings.publicPath
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
mongoose.connect(settings.db, function (err) {
  
  if (err) throw err;
  
  debug('Successfully connected to MongoDB');
  
  // Finally, create the HTTP server
  app.listen(port, function () {
    debug('Listening on port ' + port);
  });
});
