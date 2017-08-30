var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  // console.log('req', req);
  // console.log('req.headers', req.headers);
  var token = req.headers['x-auth'];
  console.log('token', token);

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    res.send(user);
  }).catch((e) => {
    res.status(401).send();
  });
}

module.exports = {authenticate};
