var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.createConnection('mongodb://localhost:27017/TodoApp'); // not working
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose
};
