const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller.js');

// Create a new Branch
router.post('/login', user.login);


module.exports = router;
