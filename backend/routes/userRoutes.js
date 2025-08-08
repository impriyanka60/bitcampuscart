// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, loginUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/', getAllUsers);
router.post('/login', loginUser); // optional

module.exports = router;
