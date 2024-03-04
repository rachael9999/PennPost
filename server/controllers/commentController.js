const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/commentModel');

exports.getCommentsByPostId = catchAsync(async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.query.postId }).sort({ postDate: -1 });
    res.status(200).json({
      status: 'success',
      data: {
        data: comments,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Cannot Find Comments',
    });
  }
});

exports.getCommentById = catchAsync(async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        data: comment,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Cannot Find the Comment',
    });
  }
});

exports.createNewComment = catchAsync(async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Cannot Post A Comments',
    });
  }
});

exports.updateComment = catchAsync(async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, {
      $set: {
        content: req.body.content,
      },
    }, {
      new: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        data: comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Cannot Update the Comment',
    });
  }
});

exports.deleteCommentById = catchAsync(async (req, res) => {
  try {
    const result = await Comment.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        data: result,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Cannot Delete the Comments',
    });
  }
});
