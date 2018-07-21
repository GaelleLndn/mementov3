const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const CatController = require('../controllers/catController');


// GET on localhost:800/categories
router.get('/', checkAuth, CatController.cat_get_all);

// POST on localhost:800/categories
router.post('/', checkAuth, CatController.cat_create_category);

// GET on localhost:800/categories/id
router.get('/:categoryId', checkAuth, CatController.cat_get_category_by_id );

// PATCH on localhost:800/categories/id
router.patch('/:categoryId', checkAuth, CatController.cat_update_category_by_id);

// DELETE on localhost:800/categories/id
router.delete('/:categoryId', checkAuth, CatController.cat_delete_category_by_id);


module.exports = router