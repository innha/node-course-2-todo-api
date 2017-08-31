var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  // console.log('\nauthenticate:\n')
  //console.log('req', req);
  // console.log('req.headers', req.headers);
  var token = req.headers['x-auth'];
  // console.log('\ntoken:\n', token);

  User.findByToken(token).then((user) => {
    // console.log('\nuser:\n', user);
    if (!user) {
      return Promise.reject();
    }

    res.send(user);
  }).catch((e) => {
    // console.log('error', e);
    res.status(401).send();
  });
}

module.exports = {authenticate};
