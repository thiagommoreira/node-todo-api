const port = 3000;

var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());



app.post('/todos',(req, res) => {

	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		console.log(`Error: ${e}`);
		res.status(400).send(e);
	});

});

app.get('/todos', (req, res) => {

	Todo.find().then((todos) => {

		res.send({todos});

	}, (e) => {
		res.status(400).send(e);
	});


});

app.use((req, res) => {

	res.status(404).send('Not found');

});

app.listen(port, () => {

	console.log('Starting on port', port);

});

module.exports = {
	app
}