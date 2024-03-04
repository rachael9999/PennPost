const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: [true, 'A like must be associated with a post'],
  },
  userId: {
    type: String,
    required: [true, 'A like must be created by a user'],
  },
});
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
