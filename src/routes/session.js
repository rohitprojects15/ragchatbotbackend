const express = require('express');
const router = express.Router();
const { getSessionHistory, clearSession } = require('../controllers/sessionController');

router.get('/:sessionId', getSessionHistory);
router.delete('/:sessionId', clearSession);

module.exports = router;
