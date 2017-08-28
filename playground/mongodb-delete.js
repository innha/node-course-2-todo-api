// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj.getTimestamp());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

// db.collection('Todos').deleteOne({text: 'Eat diner'}).then((result) => {
//   console.log(result);
// });

  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Inn'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteOne({
  //   _id: new ObjectID("59a3e11c81c76e28b8fd17d4")
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndDelete({name: 'Ninmah'}).then((result) => {
    console.log(result);
  });

  // db.close();
});
