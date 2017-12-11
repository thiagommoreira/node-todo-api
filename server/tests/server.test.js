const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos = [ {
	text: "First todo",
	_id: new ObjectID()
}, {
	text: "Comprar maizena",
	_id: new ObjectID()
}, {
	text: "buy another stuff",
	_id: new ObjectID()
}];

beforeEach((done) => {

	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());

});


describe('POST /todos',() => {


	it('should create a new todo', (done) => {

		var text = 'Test todo text';
		request(app)
		.post('/todos')
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

	it('should get all todos', (done) => {

		request(app)
		.get('/todos')
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
		.expect(200)
		.expect((res) => {
			//console.log("#",res.body);
			expect(res.body.text).toBe(todos[0].text);
		})
		.end(done);

	});

	it('should test the todos/:id with not found', (done) => {
		//console.log('#',todos[0]._id.toHexString());

		request(app)
		.get(`/todos/123`)
		.expect(404)
		.end(done);

	});

	it('should test the todos/:id with invalid object id', (done) => {
		//console.log('#',todos[0]._id.toHexString());

		request(app)
		.get(`/todos/6a26e686aeb34511b0f194c4`)
		.expect(400)
		.end(done);

	});

});