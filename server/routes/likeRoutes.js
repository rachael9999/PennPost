const express = require('express');
const likeController = require('../controllers/likeController');

const router = express.Router();

router.post('/addLike', likeController.addLike);
router.delete('/removeLike', likeController.removeLike);
router.get('/like', likeController.checkUserLiked);
router.get('/like/count', likeController.getLikeCount);

module.exports = router;
