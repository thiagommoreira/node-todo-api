const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

	if(err) {
		return console.log("Problem connecting to the database.");
	}
	console.log('Connected.');

	// db.collection('Todos').insertOne({ //objeto e o callback
	// 	text: 'Something',
	// 	completed: false

	// },(err, result) => {
	// 	if(err) {
	// 		return console.log('Problem inserting',err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Thiago',
	// 	age: 29,
	// 	location: 'Brazil'
	// }, (err, result) => {

	// 	if(err) {
	// 		return console.log("Problem connecting", err);
	// 	} 

	// 	console.log(JSON.stringify(result.ops, undefined, 2));

	// });


	db.close();

});