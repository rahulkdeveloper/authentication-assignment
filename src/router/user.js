const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { uploadProfileImage, loadProfile } = require('../controller/user');
const multer = require('multer');

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/upload-profileImage", auth, upload.single("image"), uploadProfileImage);
router.get("/load-profile", auth, loadProfile);

module.exports = router;