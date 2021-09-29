const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController.js');
const auth = require('../middlewares/middlewares');

//get all users
router.get('/', auth.authenticateToken, userCtrl.getUsers);

//get user by id
router.get('/:id', auth.authenticateToken, userCtrl.getUserById);

//delete user by id
router.delete('/:id', auth.authenticateToken, auth.isAdmin, userCtrl.deleteUser);

// create user
router.post('/', auth.isAdmin, userCtrl.createUser);

//login
router.post('/login', userCtrl.login);

module.exports = router;