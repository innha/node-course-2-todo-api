const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove('59a540113e6042749ee45c88').then((todo) => {
//
// });

Todo.findByIdAndRemove('59a540113e6042749ee45c88').then((todo) => {
  console.log(todo);
});
