const express = require('express');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/userRouters');
const postRouter = require('./routes/postRoutes');
const likeRouter = require('./routes/likeRoutes');
const commentRouter = require('./routes/commentRoutes');
const errorHandler = require('./controllers/errorController');
const { protect } = require('./utils/protect');

const AppError = require('./utils/appError');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/posts', protect, postRouter);
app.use('/api/like', protect, likeRouter);
app.use('/api/comments', protect, commentRouter);

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.all('*', (req, res, next) => {
  const err = new AppError(`${req.originalUrl} not found`, 404);
  next(err);
});

app.use(errorHandler);

module.exports = app;
