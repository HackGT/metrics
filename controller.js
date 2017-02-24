//db gives us access to our database
var dbModule = require('./db')(function(dbCallbackVar){
	db = dbCallbackVar;
	console.log("Successfully loaded DB");
});
var db = null;
var ObjectId = require('mongodb').ObjectId

setTimeout(function(){console.log(db);}, 12000)
function checkDB() {
	console.log(db)
	return db != null;
}

function checkDBError(req, res) {
	if (db === null){
		res.status(500).send("Database not yet initialized");
		return true;
	}

	return false;
}

//variables in module.exports can be accessed by classes that import this one
//module.exports is a dictionary
module.exports = {}

//this adds the route for adding memes
//it's a POST request where the request body is a JSON object containing the fields 'url' and 'caption'
module.exports.add = function (req, res) {


	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	
	if (!(req.body["_tag"] && req.body["_event"])) {
		return res.status(400).send("Bad request, missing _tag or _event key/value pairs");
	}

	req.body["_timestamp"] = Date.now();

	//make sure we don't have any duplicates
	db.insert(req.body, function (err, doc) {

		if (err) {
			console.log(err)
			return res.status(400).send("Something bad happened!");
		}

		return 	res.status(200).send("Successfully inserted data");
		
	})

	//todo, maybe add some validation to see if the file extension is in fact a .gif, and if it is a real image too
}

module.exports.findByEventId = function (req, res) {
	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	var query = {
		"_event": req.params.eventId
	}

	dbFind(query, function(err, docs) {
		return defaultFindCallback(err, docs, req, res);
	})
}

module.exports.findByTagId = function (req, res) {
	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	var query = {
		"_tag": req.params.tagId
	}
	dbFind(query, function(err, docs) {
		return defaultFindCallback(err, docs, req, res);
	})
}

module.exports.findByEventIdAndTagId = function (req, res) {
	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	var query = {
		"_tag": req.params.tagId,
		"_event": req.params.eventId
	}
	dbFind(query, function(err, docs) {
		return defaultFindCallback(err, docs, req, res);
	})
}

module.exports.findByLogId = function (req, res) {
	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	var query = {
		"_id": ObjectId(req.params.logId)
	}
	dbFind(query, function(err, docs) {
		return defaultFindCallback(err, docs, req, res);
	})
}


module.exports.listAll = function (req, res) {
	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	var query = {}

	dbFind(query, function(err, docs) {
		return defaultFindCallback(err, docs, req, res);
	})
}

module.exports.listEvents = function (req, res) {

	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	db.distinct("_event", function(err, events){
		if (err) {
			console.log(err);
			return res.status(400).send("Something bad happened!");
		}
		
		res.status(200).send(JSON.stringify(events));
	})
}


module.exports.listTags = function (req, res) {

	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	db.distinct("_tag", function(err, tags){
		if (err) {
			console.log(err);
			return res.status(400).send("Something bad happened!");
		}
		
		res.status(200).send(JSON.stringify(tags));
	})
}

module.exports.deleteByLogId = function (req, res) {
	if (checkDBError(req, res))
		return; //kill process if our db isn't initialized yet

	var query = {
		"_id": ObjectId(req.params.logId)
	}

	db.remove(query, false, function(err){
		if (err) {
			console.log(err);
			return res.status(400).send("Something bad happened!");
		}
		
		res.status(200).send("You deleted item " + req.params.logId);
	})
}

function dbFind(query, callback) {
	db.find(query).toArray(callback);
}

function defaultFindCallback(err, docs, req, res, returnOnlyOne) {
	if (err) {
		console.log(err);
		return res.status(400).send("Something bad happened!");
	}

	// return res.status(200).send(JSON.stringify(docs));
	docs = (returnOnlyOne) ? docs[0] : docs;
	return res.status(200).send(docs)
}
