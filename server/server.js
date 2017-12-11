const port = 3000;

var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');

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

app.get('/todos/:id', (req, res) => {

	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		res.status(404).send();
	}

	Todo.findById(req.params.id).then((todo) =>  {
		if(!todo) {
			res.status(400).send();

		}

		res.send(todo);

	}, (e) => {
		res.status(400).send(e);
	});

});

app.use((req, res) => {

	res.status(404).send();

});

app.listen(port, () => {

	console.log('Starting on port', port);

});

module.exports = {
	app
}