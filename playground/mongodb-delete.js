const {MongoClient, ObjectID}  = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

	if(err) {
		return console.log("Problem connecting to the database.");
	}
	console.log('Connected.');


	// db.collection('Todos').deleteMany({text: 'Eat'}).then((result) => {
	// 	console.log(result);
	//});

	// db.collection("Users").deleteMany({
	// 	name: 'Thiago'
	// }).then((result) => {
	// 	console.log(result);
	// }, (err) => {
	// 	console.log(`Erro: ${err}`);
	// });

	// db.collection("Users").findOneAndDelete({
	// 	_id: new ObjectID('5a1fff77b8dbe8907f998b7d')
	// }).then((result) => {
	// 	console.log(result);
	// }, (err) => {
	// 	console.log(`Erro: ${err}`);
	// });

	db.collection("Users").find().count().then((count) => {
		console.log(`Total regs: ${count}`);
	},(err) => {
		console.log(`Error: ${err}`);
	});


	//db.close();

});