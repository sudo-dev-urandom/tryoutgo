const express = require('express');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth'); // Destructure to get the auth function
const validate = require('../middleware/validate');
const { userValidation } = require('../validations/userValidation');

const router = express.Router();

// Public routes
router.get('/', userController.getAllUsers);
router.get('/:id', validate(userValidation.getUserById), userController.getUserById);

// Protected routes
router.use(auth); // Now this will work correctly
router.post('/', validate(userValidation.createUser), userController.createUser);
router.put('/:id', validate(userValidation.updateUser), userController.updateUser);
router.delete('/:id', validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;