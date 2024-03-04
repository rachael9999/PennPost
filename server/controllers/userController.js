const bcrypt = require('bcrypt');
const multer = require('multer');

const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { uploadFile, deleteFile } = require('../utils/s3Operations');

const storage = multer.memoryStorage({
  filename: (req, file, cb) => cb(null, file.originalname),
  fileFilter: (req, file, cb) => {
    if (file.size > 1024 * 1024 * 1024) cb(new AppError('File size exceeds the limit', 400));
    else cb(null, true);
  },
});
const upload = multer({ storage });

exports.parseImage = upload.single('image');

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const newProfile = { ...req.body };
  if (req.file) {
    const s3Url = await uploadFile(req.file);
    newProfile.photo = s3Url;

    const profile = await User.findById(req.params.userid);

    if (profile.photo) {
      await deleteFile(profile.photo);
    }
  }

  const profile = await User.findByIdAndUpdate(req.params.userid, newProfile, {
    new: true,
    runValidator: true,
  });

  if (!profile) {
    next(new AppError('Profile Not Found', 404));
    return;
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const profile = await User.findById(req.params.userid, '-password');

  if (!profile) {
    next(new AppError('Profile Not Found', 404));
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: profile,
    },
  });
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        // eslint-disable-next-line no-underscore-dangle
        userId: user._id,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({
        status: 'fail',
        message: 'Please enter a valid phone number',
      });
    } if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(409).json({
        status: 'fail',
        message: 'Email already exists in the database',
      });
    }
    next(error);
  }
});

exports.auth = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(404).json({ message: 'Email does not exist' });
  }

  // Correct password/lockout has passed: reset login attempts and lock info
  const updates = {
    $set: { loginAttempts: 0, isLocked: false },
    $unset: { lockUntil: 1 },
  };

  if (user.isLocked && user.lockUntil > Date.now()) {
    // Account is still within lockout period
    return res.status(401).json({ message: 'Your account is locked due to too many failed login attempts' });
  }

  if (user.isLocked && user.lockUntil < Date.now()) {
    // Lockout period has passed, reset login attempts and lock info
    await user.updateOne(updates);
  }

  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    // Wrong password: increment login attempts
    try {
      await user.incrementLoginAttempts();
      const attemptsLeft = 5 - user.loginAttempts - 1;
      if (attemptsLeft === 0) {
        return res.status(401).json({
          message: `Incorrect email or password. You have ${attemptsLeft} more attempt(s). Your account is locked for 5 min due to too many failed login attempts`,
        });
      }
      return res.status(401).json({ message: `Incorrect email or password. You have ${attemptsLeft} more attempt(s)` });
    } catch (err) {
      return next(err);
    }
  } else {
    await user.updateOne(updates);

    // Generate token
    // eslint-disable-next-line no-underscore-dangle
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.status(200).json({
      status: 'success',
      token,
    });
  }
});

exports.getAll = catchAsync(async (req, res) => {
  const users = await User.find({}, '-password');
  res.status(200).json({
    status: 'success',
    data: {
      data: users,
    },
  });
});

exports.getFollowers = catchAsync(async (req, res) => {
  const users = await User.find({ follows: req.params.userid }, { firstName: 1, lastName: 1 });
  res.status(200).json({
    status: 'success',
    data: {
      data: users,
    },
  });
});
