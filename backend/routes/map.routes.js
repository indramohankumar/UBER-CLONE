const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Added authMiddleware so that only authenticated users can access the mapping API (standard practice)
router.get('/get-coordinates', authMiddleware, mapController.getCoordinates);
router.get('/suggestions', authMiddleware, mapController.getSuggestions);

module.exports = router;
