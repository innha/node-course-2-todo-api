var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.createConnection('mongodb://localhost:27017/TodoApp'); // not working
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
};
