const Like = require('../models/likeModel');

exports.addLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const like = await Like.create({ postId, userId });
    res.status(200).json({
      status: 'success',
      data: like,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        status: 'fail',
        message: 'User has already liked this post',
      });
    }
  }
};

exports.removeLike = async (req, res) => {
  const { postId, userId } = req.query;
  const like = await Like.findOneAndDelete({ postId, userId });
  if (like) {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid postId or userId',
    });
  }
};

exports.checkUserLiked = async (req, res) => {
  const { postId, userId } = req.query;
  const likes = await Like.find({ postId, userId });
  res.status(200).json({
    status: 'success',
    data: likes.length > 0,
  });
};

exports.getLikeCount = async (req, res) => {
  const { postId } = req.query;
  const likes = await Like.find({ postId });
  res.status(200).json({
    status: 'success',
    data: likes.length,
  });
};
