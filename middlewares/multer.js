const multer = require('multer')
const path = require('path')
// const storage = multer.diskStorage({
//     destination: (req,file,callback) => {
//       callback(null, 'uploads/profileImage');
//     },
//     filename: function (req, file, cb) {
//         let ext = path.extname(file.originalname)
//           const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9)
//           cb(null, uniqueSuffix + ext)
//       }
//     }); 
//     exports.upload = multer({ storage: storage });

const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

exports.upload = multer({storage: storage});

