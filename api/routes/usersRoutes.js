const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/usersController');


// CREATE USER WITH HASH PASSWORD
router.post('/signup', UserController.users_create_user );


// USER LOG IN
router.post('/login', UserController.users_login_user);

// DELETE USER
router.delete('/:userId', checkAuth, UserController.users_delete_user_by_id);


module.exports = router