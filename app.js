'use strict';
// Module Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const http = require('http');
const path = require('path');
const request = require('request'); // Note: 'request' package is deprecated
const routes = require('./routes');
const activity = require('./routes/activity');

// EXPRESS CONFIGURATION
const app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({ type: 'application/jwt' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express in Development Mode
if (app.get('env') === 'development') {
  app.use(errorhandler());
}

// Setup Routes
app.get('/', routes.index);
app.post('/login', routes.login);
app.post('/logout', routes.logout);

// Custom Routes for Marketing Cloud
app.post('/journeybuilder/save/', activity.save);
app.post('/journeybuilder/validate/', activity.validate);
app.post('/journeybuilder/publish/', activity.publish);
app.post('/journeybuilder/execute/', activity.execute);

// Start Server
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
