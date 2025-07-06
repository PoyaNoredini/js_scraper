const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// POST /api/categories
router.post('/', categoryController.createCategory);

// GET /api/categories
router.get('/', categoryController.listCategories);

// DELETE /api/categories/:id
router.delete('/:id', categoryController.deleteCategory);

// GET /api/categories/active
router.get('/active', categoryController.listOnlyActiveCategories);

module.exports = router;
