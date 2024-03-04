const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: [true, 'A comment must have content'],
  },
  postDate: Date,
});

module.exports = mongoose.model('Comment', commentSchema);
