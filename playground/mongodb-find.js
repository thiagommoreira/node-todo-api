const {MongoClient, ObjectID}  = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

	if(err) {
		return console.log("Problem connecting to the database.");
	}
	console.log('Connected.');

	// db.collection('Todos').find().toArray().then((docs) => {

	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));

	// }, (err) => {
	// 	console.log('Unable to fetch', err);
	// });


	// db.collection('Todos').find({completed: false}).toArray().then((docs) => {

	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));

	// }, (err) => {
	// 	console.log('Unable to fetch', err);
	// });

	// db.collection('Todos').find({
	// 	_id: new ObjectID('5a1ffa59b8dbe8907f9989d0')
	// }).toArray().then((docs) => {

	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs, undefined, 2));

	// }, (err) => {
	// 	console.log('Unable to fetch', err);
	// });

	// db.collection('Todos').find().count().then((count) => {

	// 	console.log(`Todos quantity:${count}`);


	// }, (err) => {
	// 	console.log('Unable to fetch', err);
	// });

	db.collection('Users').find({
		location: 'Brazil'
	}).count().then((user) => {

		console.log(`Quantity: ${user}`);
		

	}, (err) => {
		console.log('Unable to fetch', err);
	});


	//db.close();

});