require("./config/config.js");

const port = process.env.PORT;
const _ = require ('lodash');

var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req, res) => {

	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		//console.log(`Error: ${e}`);
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
		return res.status(404).send();
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

app.delete('/todos/:id',(req, res) => {

	let id = req.params.id;

	if(!ObjectID(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {

		if(!todo) {
			return res.status(404).send();
		}

		res.send(todo);

	}, (e) => {

		res.status(400).send(e);

	});



});

app.patch('/todos/:id', (req, res) => {

	let id = req.params.id;
	let body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		//console.log('not valid');
		return res.status(404).send();

	}

	if(_.isBoolean(body.completed) && body.completed) {

		body.completedAt = new Date().getTime();

	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {

		if(!todo) {
			//console.log('erro n encontrado');
			return res.status(404).send();

		}

		res.send({todo});

	}).catch((e) => {
		res.status(400).send();
	})

});

app.get('/users', (req, res) => {

	User.find().then((users) => {

		return res.status(200).send({users});

	}).catch((e) => {
		return res.status(400).send(e);
	})

});

app.post('/users', (req, res) => {

	let body = _.pick(req.body, ['email', 'password']);
	let user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		return res.header('x-auth', token).send(user);
	}).catch((e) => {
		return res.status(400).send(e);
	});

});

app.post('/users/login', (req, res) => {

	let body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		user.generateAuthToken().then((token) => {
			return res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send();
	})

});

app.get('/users/me', authenticate, (req, res) => {

		res.send(req.user);

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
