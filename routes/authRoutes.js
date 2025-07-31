const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authValidation } = require('../validations/authValidation');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;