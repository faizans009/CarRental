const express = require('express');
const router = express.Router();
const image = require('../controllers/uploadsController')
const {upload} = require('../middlewares/multer');
const { isAuthenticatedUser } = require('../middlewares/auth');
router
    .post('/', upload.single('image'), image.singleUpload)
    // .post('/multipleUpload', isAuthenticatedUser,upload.array('images', 6), car.multiUpload)
 
exports.router = router   