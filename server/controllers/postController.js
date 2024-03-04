const multer = require('multer');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const GetQuery = require('../utils/getQuery');
const { uploadFile, deleteFile } = require('../utils/s3Operations');

const storage = multer.memoryStorage({
  filename: (req, file, cb) => cb(null, file.originalname),
  fileFilter: (req, file, cb) => {
    if (file.size > 1024 * 1024 * 1024) cb(new AppError('File size exceeds the limit', 400));
    else cb(null, true);
  },
});
const upload = multer({
  storage,
  limit: { fileSize: 100 * 1024 * 1024 },
});

exports.parseFormData = upload.fields([
  {
    name: 'image', maxCount: 1,
  },
  {
    name: 'video', maxCount: 1,
  },
]);

exports.getPostByUserId = catchAsync(async (req, res) => {
  let posts;
  if ('page' in req.query) {
    const query = new GetQuery(Post.find({ userId: req.params.userid }), req.query)
      .sort()
      .paginate();

    posts = await query.query;
  } else {
    posts = await Post.find({ userId: req.params.userid });
  }

  res.status(200).json({
    status: 'success',
    length: posts.length,
    data: {
      data: posts,
    },
  });
});

exports.getPostsNumByUserId = catchAsync(async (req, res) => {
  const posts = await Post.find({ userId: req.params.userid });

  res.status(200).json({
    status: 'success',
    length: posts.length,
    data: {
      data: posts,
    },
  });
});

exports.createNewPost = catchAsync(async (req, res) => {
  const newPost = { ...req.body };
  if (req.files.image) {
    const s3ImageUrl = await uploadFile(req.files.image[0]);
    newPost.image = s3ImageUrl;
  }
  if (req.files.video) {
    const s3VideoUrl = await uploadFile(req.files.video[0]);
    newPost.video = s3VideoUrl;
  }

  const post = await Post.create(newPost);

  res.status(201).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});

exports.getAllPostsByPage = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.userid);
  const { hiddenPosts } = user;

  const query = new GetQuery(Post.find({ _id: { $nin: hiddenPosts } }), req.query)
    .sort()
    .paginate();

  const posts = await query.query;

  res.status(200).json({
    status: 'success',
    data: {
      data: posts,
    },
  });
});

exports.deletePostById = catchAsync(async (req, res) => {
  const currentPost = await Post.findById(req.params.postid);

  if (currentPost.image) {
    await deleteFile(currentPost.image);
  }
  if (currentPost.video) {
    await deleteFile(currentPost.video);
  }

  await Post.findByIdAndDelete(req.params.postid);

  res.status(204).json({
    status: 'success',
  });
});

exports.getPostByPostId = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postid);

  if (!post) {
    next(new AppError('Cannot Find Post', 404));
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});

exports.updatePostByPostId = catchAsync(async (req, res) => {
  const newPost = { ...req.body };
  const currentPost = await Post.findById(req.params.postid);

  if (req.files.image) {
    const s3ImageUrl = await uploadFile(req.files.image[0]);
    newPost.image = s3ImageUrl;

    if (currentPost.image) {
      await deleteFile(currentPost.image);
    }
  }

  if (req.files.video) {
    const s3VideoUrl = await uploadFile(req.files.video[0]);
    newPost.video = s3VideoUrl;

    if (currentPost.video) {
      await deleteFile(currentPost.video);
    }
  }

  const post = await Post.findByIdAndUpdate(req.params.postid, newPost, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});
