const express = require('express');
const router = express.Router();
const branches = require('../controllers/branch.controller.js');

// Create a new Branch
router.post('/', branches.create);

// Retrieve all Branches
router.get('/', branches.findAll);

// Retrieve a single Branch with branchId
router.get('/:branchId', branches.findOne);

// Update a Branch with branchId
router.put('/:branchId', branches.update);

// Delete a Branch with branchId
router.delete('/:branchId', branches.delete);


module.exports = router;