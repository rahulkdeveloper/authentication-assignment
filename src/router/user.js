const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { uploadProfileImage, loadProfile } = require('../controller/user');
const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Please upload an image file'), false);
    }
    cb(null, true);
};

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage, fileFilter: fileFilter, limits: {
        fileSize: 5 * 1024 * 1024,
    },
});


router.post("/upload-profileImage", auth, upload.single("image"), uploadProfileImage);
router.get("/load-profile", auth, loadProfile);

module.exports = router;