'use strict';

let express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  debug = require('debug')('mean'),
  logger = require('morgan'),
  path = require('path'),
  app = express();

// Get application routes
let api = require('./server/routes/api');
// Build server public directory path
let publicPath = path.join(__dirname, 'public');
// Get port from environment and store in Express.
let port = parseInt(process.env.PORT, 10) || 8080;

// Set logger device
if (app.get('env') == 'production') {
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
app.use(express.static(publicPath));

// Set routes
app.use('/api', api);

// Default home page
app.get('/', function (req, res) {
  res.sendFile('index.html', {
    root: publicPath
  });
});

// Unknown route
app.use((req, res) => {
  res.sendStatus(404);
});

// Create HTTP server
app.listen(port, function() {
  debug('Listening on port ' + port);
});
