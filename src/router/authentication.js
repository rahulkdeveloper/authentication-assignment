const express = require('express');
const router = express.Router();
const { register, verifyAccount, login, forgotPassword, resetPassword, logout } = require('../controller/authentication');
const { schemas, middlewareValidation } = require('../middleware/validate');
const { auth } = require('../middleware/auth');

router.post("/register", middlewareValidation(schemas.registerBody), register);
router.post("/verify-account", middlewareValidation(schemas.verifyAccountBody), verifyAccount);
router.post("/login", middlewareValidation(schemas.loginBody), login);
router.post("/forgot-password", middlewareValidation(schemas.forgotPasswordBody), forgotPassword);
router.post("/reset-password", middlewareValidation(schemas.resetPasswordBody), resetPassword);
router.post("/logout", auth, logout);

module.exports = router;