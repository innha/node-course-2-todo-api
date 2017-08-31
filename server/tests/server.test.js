const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('GET /users', () => {
  it('should get all users', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body.users.length).toBe(2);
        })
        .end(done);
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

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var id = todos[0]._id;
    var text = 'Haaaaa!!!!';

    request(app)
      .patch(`/todos/${id}`)
      .send({text, completed: true})
      .expect(200)
      .expect((res) => {
        // console.log(res.body);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeA('boolean');
        expect(res.body.todo.completedAt).toBeA('number');
      }).end((e) => done(e));
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var id = todos[0]._id;
    var text = 'Ehhhhhhhhhhhhhh';

    request(app)
      .patch(`/todos/${id}`)
      .send({text, completed: false})
      .expect(200)
      .expect((res) => {
        // console.log(res.body);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeA('boolean');
        expect(res.body.todo.completedAt).toNotExist();
      }).end((e) => done(e));
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    // console.log('\nusers:\n', users)
    request(app)
     .get('/users/me')
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((res) => {
      //  console.log('\nres:\n', res);
       expect(res.body._id).toBe(users[0]._id.toHexString());
       expect(res.body.email).toBe(users[0].email);
     })
     .end(done);
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
    var email = 'iharelimana@example.com';
    var password  = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validate errors if request invalid', (done) => {
    var email = 'iharelimana@example';
    var password  = '1';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end((err) => {
        if (err) {
          console.log('\nerror:\n', err);
        }
        done();
      });
  });

  it('should not create user if email in use', (done) => {
    var email = 'test1@example.com';
    var password  = 'magmag12345?';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end((err) => {
        if (err) {
          console.log('\nerror:\n', err);
        }
        done();
      });
  });
});
