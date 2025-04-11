
const express = require('express');
const router = express.Router();
const controller = require('../controllers/progressController');

router.post('/update', controller.updateProgress);
router.get('/:userId/:videoId', controller.getProgress);

module.exports = router;
