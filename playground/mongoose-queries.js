const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');



let id = '5a26e686aeb34511b0f194c4';



// Todo.find({
// 	_id: id
// }).then((todo) => {

// 	console.log(JSON.stringify(todo, undefined, 2));

// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {

// 	console.log('Todo', todo);

// });

// Todo.findById(id).then((todo) => {

// 	if(!todo) {
// 		return console.log("not found");
// 	}

// 	console.log('Todo by id',todo);

// }).catch((e) => console.log(e));
id = '5a204da48e73722b287bdbf5';

User.findById(id).then((user) => {

	if(!user) {
		return console.log("User invalid");
	}

	console.log(JSON.stringify(user, undefined, 2));


}).catch((e) => console.log(e));