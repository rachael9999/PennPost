const express = require('express');

const userController = require('../controllers/userController');
const { protect } = require('../utils/protect');

const Router = express.Router();

Router.route('/')
  .post(userController.createNewUser)
  .get(protect, userController.getAll);

Router.route('/auth')
  .post(userController.auth);

Router.route('/followers/:userid')
  .get(protect, userController.getFollowers);

Router.route('/:userid')
  .get(protect, userController.getUserProfile)
  .patch(protect, userController.parseImage, userController.updateUserProfile);

module.exports = Router;
