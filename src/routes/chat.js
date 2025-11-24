const express = require('express');
const router = express.Router();
const { handleChatQuery } = require('../controllers/chatController');

router.post('/query', handleChatQuery);

module.exports = router;
