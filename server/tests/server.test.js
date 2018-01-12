const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {

	it('should create a new todo', (done) => {

		var text = 'Test todo text';
		request(app)
		.post('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}

			Todo.find().then((todos) => {
				expect(todos.length).toBeGreaterThan(1);
				//expect(todos[0].text).toBe(text);
				done();
			}).catch((e) => {
				done(e);
			});

		});

	});


	// it('should fail the test', (done) => {

	// 	request(app)
	// 	.post('/todos')
	// 	.send({})
	// 	.expect(400)
	// 	.end((err, res) => {

	// 		if(err) {
	// 			return done(err);
	// 		}

	// 		Todo.find().then((todos) => {
	// 			expect(todos.length).toBe(0);
	// 			done();
	// 		}).catch((e) => {
	// 			done(e);
	// 		});
	// 	});

	// });

	it('should get all todos from the first user', (done) => {

		request(app)
		.get('/todos')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.end((err, res) => {

			if(err) {
				return done(err);
			}

			done();

		});

	});

	//valid 5a26e686aeb34511b0f194c4




});

describe('Get /todos/:id', () => {

	it('should test the todos/:id with valid ID', (done) => {
		//console.log('#',todos[0]._id.toHexString());

		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			 console.log("#", JSON.stringify(res.text, undefined, 4));
			// console.log("##", todos[0].text);
			expect(res.text).toBe(todos[0].text);
		})
		.end(done);

	});

	it('should not allow authentication with other user token', (done) => {
		//console.log('#',todos[0]._id.toHexString());

		request(app)
		.get(`/todos/${todos[1]._id.toHexString()}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(400)
		.end(done);

	});

	it('should test the todos/:id with not found', (done) => {
		//console.log('#',todos[0]._id.toHexString());

		request(app)
		.get(`/todos/${users[0]._id}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(400)
		.end(done);

	});

	it('should test the todos/:id with invalid object id', (done) => {
		//console.log('#',todos[0]._id.toHexString());

		request(app)
		.get(`/todos/6a26e686aeb34511b0f194c4`)
		.expect(401)
		.end(done);

	});

});

describe("Patch /todos/:id", () => {

	it('should update the todo', (done) => {

		let id = todos[0]._id;
		let body = {
			text: 'texto atualizado',
			completed: true
		}

		// console.log(id);

		// console.log(todos[0].text);

		request(app)
		.patch(`/todos/${id.toHexString()}`)
		.send(body)
		.expect(200)
		.expect((res) => {
			//console.log(res+"#");
			expect(res.body.todo.text).toEqual(body.text);
			expect(res.body.todo.completed).toBe(true);
			//expect(res.body.todo.completedAt).toBeA('number');
		})
		.end(done);

	});

	it('should clear completedAt when todo is not completed', (done) => {

		let id = todos[1]._id.toHexString();
		let completed = false;

		request(app)
			.patch(`/todos/${id}`)
			.send({completed})
			.expect(200)
			.expect((res) => {

				expect(res.body.todo.completed).toBe(false);

			})
			.end(done);

	});

});

describe('GET /users/me', () => {

	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done)
	});

	it('should return 401 if not authenticated', (done) => {

		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({});
		})
		.end(done);

	});

});

describe('POST /users', () => {

	it('should create a user', (done) => {
		let email = 'thiagofoz@gmail.com';
		let password = '1234446666';

		var body = {"email": email, "password": password};

		request(app)
		.post('/users')
		.send(body)
		.expect(200)
		// .expect((res) => {
		// 	console.log(res.email+' '+users[0].email);
		// 	expect(res.email).toBe(users[0].email);
		// })
		.end(done);

	});

	it('should return validation errors if req invalid', (done) => {
		let email = 'thiagofoz@gmail.com';
		request(app)
		.post('/users')
		.send({email})
		.expect(400)
		.end(done);

	});

	it('should not create user if email in use', (done) => {
		let email = 'thiagofoz@gmail.com';
		let password = '1234446666';

		var body = {"email": email, "password": password};

		request(app)
		.post('/users')
		.send(body)
		.expect(400)
		// .expect((res) => {
		// 	console.log(res.email+' '+users[0].email);
		// 	expect(res.email).toBe(users[0].email);
		// })
		.end(done);
	});

});

describe('POST /users/login', () => {

	it('should return a valid request', (done) => {

		let email = users[0].email;
		let password = users[0].password;

		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(200)
		// .expect((res) => {
		// 	//console.log(JSON.stringify(res.headers, undefined, 2));
		// 	expect(res.body.email).toBe(users[0].email);
		// 	expect(res.headers).toBe(res.header);
		// })
		.end(done);

	});

	it('should return an invalid request', (done) => {
		let email = users[0].email+"123";
		let password = users[0].password;
		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(400)
		.end(done);
	});

});

describe('DELETE /users/me/token', () => {
	let token = users[0].tokens[0].token;
	it('should remove auth token on logout', (done) => {
		request(app)
		.delete('/users/me/token')
		.set('x-auth', token)
		//.send()
		.expect(200)
		.end((err, res) => {
			if(err) {
				return done(err);
			}

			User.findByCredentials(token).then((user) => {
				expect(user).toBe(undefined);
				console.log('esta undefined');
				done();
			}).catch((e) => done(e));
		});
	});

});
