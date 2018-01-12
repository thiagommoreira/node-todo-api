const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const secret = 'abc123';

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: "thiagofoz@gmail.com",
  password: "123444",
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, secret).toString()
  }]
}, {
  _id: userTwoId,
  email: "thiagofozasd@gmail.com",
  password: "2222222",
}];

const todos = [ {
	text: "First todo",
	_id: new ObjectID()
}, {
	text: "Comprar maizena",
	_id: new ObjectID(),
	completed: true,
	completedAt: 333
}, {
	text: "buy another stuff",
	_id: new ObjectID()
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {
  todos, populateTodos, populateUsers, users
};
