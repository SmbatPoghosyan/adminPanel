const express = require('express');
const router = express.Router();
const user = require('../controllers/user.controller.js');

// Create a new Branch
router.get('/', user.list);
router.post('/', user.create);
router.put('/:id', user.update);
router.delete('/:id', user.delete);
router.post('/login', user.login);


module.exports = router;
