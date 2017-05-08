'use strict';

let express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  debug = require('debug')('mean'),
  logger = require('morgan'),
  path = require('path');

// Get Express router module
const router = express.Router();
// Create an Express application
let app = express();

// Get application routes
require('./server/routes/users')(router);

// Get server launch mode
const launchMode = app.get('env') || 'development';
// Get server settings
const settings = require('./config/env')[launchMode]
// Build server public directory path
const publicPath = path.join(__dirname, 'public');
// Get port from environment and store in Express.
const port = parseInt(process.env.PORT, 10) || 8080;

// Set logger device
if (launchMode == 'production') {
  app.use(logger('prod', {
    skip: function (req, res) {
      return res.statusCode < 400
    },
    stream: __dirname + './mean.log'
  }));
} else {
  app.use(logger('dev'));
}

// Connect to database
mongoose.connect(settings.db);

// Tell express that messages bodies will be JSON formatted
app.use(bodyParser.json());
// Only parses urlencoded bodies (gzip and deflate enabled)
app.use(bodyParser.urlencoded({
  extended: false
}));

// Add cookie parsing ability
app.use(cookieParser());

// Set default static files path
app.use(express.static(publicPath));

// Set web service routes
app.use('/api', router);

// Default home page
app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: publicPath
  });
});

// Unknown route
app.use((req, res) => {
  res.status(404).send('The requested page doesn\'t exist!');
});

// Errors processing
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Create HTTP server
app.listen(port, function () {
  debug('Listening on port ' + port);
});