const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

// POST /api/generate
router.post('/generate', resumeController.generateResume);

// GET /api/history
router.get('/history', resumeController.getHistory);

module.exports = router;
