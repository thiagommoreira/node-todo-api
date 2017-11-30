const {MongoClient, ObjectID}  = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

	if(err) {
		return console.log("Problem connecting to the database.");
	}
	console.log('Connected.');

	db.collection("Todos").findOneAndUpdate({
		_id: new ObjectID('5a1ffa59b8dbe8907f9989d0') 
	}, {
		$set: {
			completed: false
		}
	}, {
		returnOriginal: false
	})
	.then((result) => {
		console.log(result);
	});


	//db.close();

});