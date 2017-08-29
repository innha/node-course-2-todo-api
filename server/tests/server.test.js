const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text: 'Test todo text'})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todo) => {
          expect(todo.length).toBe(1);
          expect(todo[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
  //
  // it('should not create todo with invalid body data', (done) => {
  //   request(app)
  //     .post('/todos')
  //     .send({})
  //     .expect(200)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //
  //       Todo.find().then((todos) => {
  //         expect(todos.length).toBe(2);
  //         done();
  //       }).catch((e) => done(e));
  //     });
  // });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2)
        })
        .end(done);
    });
  });
});

const users = [{
  email: 'iharelimana@gmail.com'
}, {
  email: 'jngatera@gmail.com'
}];

describe('Users', () => {
  it('should create users for test', (done) => {
    User.remove({}).then(() => {
      return User.insertMany(users);
    }).then(() => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body.users.length).toBe(2);
        })
        .end(done);
    });
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    // console.log(JSON.stringify(todos, undefined, 2));
    // console.log(todos[0]._id.toHexString());

    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const id = new ObjectID();

    request(app)
      .get(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    const id = 12345;

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return 404 if todo not found', (done) => {
    const id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {

    request(app)
      .get(`/todos/12345`)
      .expect(404)
      .end(done);
  });
});
