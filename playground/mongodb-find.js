// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
// console.log(obj.getTimestamp());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('59a3e662fef3c3096823334b')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // });

  db.collection('Users').find({name: 'Inn'}).toArray().then((users) => {
    console.log(JSON.stringify(users, undefined, 2));
  }, (err) => {
      return console.log('Unable to fetch uers', err);
  });

  db.collection('Users').find({name: 'Inn'}).count().then((count) => {
    console.log(`Users count: ${count}`);
  }, (err) => {
      return console.log('Unable to count users', err);
  });

  // db.close();
});
