module.exports = function(dbLoadedCallback) {

	var MongoClient = require('mongodb').MongoClient
	var Db = require('mongodb').Db


	var url = process.env.MONGO_URL;
	var collectionName = "metrics"

	module.exports = null;

	MongoClient.connect(url, function(err, db) {

		if (err) {
			console.log(err);
		}


		module.exports = db.collection(collectionName)
		dbLoadedCallback(db.collection(collectionName))
		// console.log(module.exports,"AAA")


		// var collectionExists = db.collectionExists(collectionName);
	 //    if (collectionExists == false) {
	 //        db.createCollection(collectionName, null);
	 //    }

		// module.exports = db;
	});

	return module
}


