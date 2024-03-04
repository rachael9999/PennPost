const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'A post must have a title'],
  },
  content: {
    type: String,
    required: [true, 'A post must have content'],
  },
  postDate: Date,
  image: String,
  video: String,
});

module.exports = mongoose.model('Post', postSchema);
