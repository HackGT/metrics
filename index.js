
// * GET `/api/events`
//   * Get list of all event ids
// * GET `/api/event/eventid`
//   * Get all logs for this event with the id `eventid`
// * GET `/api/tag/tagid`
//   * Get all logs with the given `tagid`
// * GET `/api/event/eventid/tag/tagid`
//   * Get all logs with tag `tagid` in an event `eventid`
// * GET `/api/id/logid`
//   * Get the log that corresponds to the given `eventid`

// * POST `/api/add/`
//   * Add data to database. JSON header containing data, along with keys `_tag` and `_event` relating to the log
  
// * DELETE `/api/id`
//   * Remove the event with the id `id`
//   

//dependencies for our web server
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//requires our helpful database file from dbs.js
var controller = require('./controller')

//sets up web server
var app = express();


//some nerd stuff that sets your server port
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/listAll', controller.listAll);

app.post('/api/add', controller.add);

app.get('/api/event/:eventId', controller.findByEventId);

app.get('/api/tag/:tagId', controller.findByTagId);

app.get('/api/event/:eventId/tag/:tagId', controller.findByEventIdAndTagId)

app.get('/api/id/:logId', controller.findByLogId)

app.get('/api/events', controller.listEvents)

app.get('/api/tags', controller.listTags)

app.delete('/api/id/:logId', controller.deleteByLogId)

//starts the app
app.listen(app.get('port'), function() {
	console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env')); 
	console.log('  Press CTRL-C to stop\n');
});

module.exports = app;