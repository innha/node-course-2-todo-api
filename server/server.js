var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// var newTodo = Todo({
//   text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
//   console.log('Saved todo: ', doc);
// }, (e) => {
//   console.log('Unable to sate todo');
// });

// var secondTodo = new Todo({
//   text: '  Read exercises  ',
//   completed: false,
//   completedAt: 1234567890
// });

// var secondTodo = new Todo({});

// secondTodo.save().then((doc) => {
//   console.log('Saved sceond todo', doc);
// }, (e) => {
//   console.log('Unable to save second todo', e);
// });

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

var firstUser = new User({
  email: ' iharelimana@gmail.com'
});

firstUser.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
  console.log('Unable to save user', err);
});
