const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');
const User = require('../models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const { authorization } = req.headers;
    [, token] = authorization.split(' ');
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;
    next();
    return null;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // eslint-disable-next-line no-underscore-dangle
      const newToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

      res.setHeader('Authorization', `Bearer ${newToken}`);

      return next();
    }
    // handle other possible errors
    return next(new AppError('Authentication failed', 401));
  }
});
