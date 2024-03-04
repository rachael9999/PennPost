const express = require('express');

const postController = require('../controllers/postController');

const Router = express.Router();

Router.route('/')
  .post(postController.parseFormData, postController.createNewPost);

Router.get('/user/:userid', postController.getPostByUserId);

Router.get('/user/page/:userid', postController.getAllPostsByPage);

Router.get('/num/user/:userid', postController.getPostsNumByUserId);

Router.route('/:postid')
  .delete(postController.deletePostById)
  .get(postController.getPostByPostId)
  .patch(postController.parseFormData, postController.updatePostByPostId);

module.exports = Router;
