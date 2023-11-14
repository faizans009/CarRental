const express = require('express');
const router = express.Router();
const verification = require('../controllers/verificationController')
const {upload} = require('../middlewares/multer');
const { isAuthenticatedUser } = require('../middlewares/auth');
router
    .post('/createVerification', isAuthenticatedUser,
     upload.fields([
        { name: 'frontImage', maxCount: 1 },
        { name: 'backImage', maxCount: 1 },
      ]), 
      verification.createVerification)
    .get('/getVerification', verification.getVerification)
    .put('/updateVerification/:id', isAuthenticatedUser,
    upload.fields([
      { name: 'frontImage', maxCount: 1 },
      { name: 'backImage', maxCount: 1 },
    ]),
     verification.updateVerification)
    .delete('/deleteVerification/:id', isAuthenticatedUser, verification.deleteVerification)
 
exports.router = router 