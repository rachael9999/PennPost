const express = require('express');

const commentController = require('../controllers/commentController');

const Router = express.Router();

Router.get('/', commentController.getCommentsByPostId);
Router.get('/:id', commentController.getCommentById);
Router.post('/', commentController.createNewComment);
Router.patch('/:id', commentController.updateComment);
Router.delete('/:id', commentController.deleteCommentById);

module.exports = Router;
