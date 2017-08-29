var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  // console.log('POST /todos');

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    // console.log('POST /todos:save');

    res.send(doc);
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  // console.log('GET /todos');

  Todo.find().then((todos) => {
    // console.log('GET /todos: find');

    res.send({todos});
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

app.get('/users', (req, res) => {
  User.find().then((users) => {
    res.send({users});
  }, (e) => {
    console.log(e);
    res.status(200).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  // console.log('GET /todos/:id');

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    // console.log('GET /todos/:id: findById');

    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send(todo);
  }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
  console.log(`Started at port ${port}`);
});

module.exports = {app};
