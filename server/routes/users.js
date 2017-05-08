let UsersController = require('../controllers/users');

module.exports = (app) => {
  
  let ctrl = new UsersController();

  app.get('/users', function (req, res, next) {
    return ctrl.find(req, res, next);
  });

  app.get('/users/:id', function (req, res, next) {
    return ctrl.findById(req, res, next);
  });

  app.post('/users', function (req, res, next) {
    return ctrl.create(req, res, next);
  });

  app.put('/users/:id', function (req, res, next) {
    return ctrl.update(req, res, next);
  });

  app.delete('/users/:id', function (req, res, next) {
    return ctrl.delete(req, res, next);
  });
};