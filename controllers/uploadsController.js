const cloudinary = require('../utils/cloudinary');

exports.singleUpload = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
  
    cloudinary.uploader.upload(req.file.path, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Error uploading image" });
      }
  
      res.status(200).json({
        success: true,
        message: "Uploaded successfully!",
        data: result.secure_url,
      });
    });
  };

  
// exports.singleUpload = async (req, res) => {
//   try {
//     if (!req.file) {
//       return new ResponseHandler(res, 400, true, "image not uploaded");
//     }
//     // const images = req.files.map((file) => file.path);
//     const image = req.file.path;
//     return new ResponseHandler(
//       res,
//       200,
//       true,
//       "image uploaded successfully",
//       image
//     );
//   } catch (error) {
//     return new ResponseHandler(res, 500, false, error.message);
//   }
// };



// exports.multiUpload = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return new ResponseHandler(res, 400, false, "No images uploaded");
//     }
//     const images = req.files.map((file) => file.path);
//     return new ResponseHandler(
//       res,
//       200,
//       true,
//       "Images uploaded successfully",
//       images
//     );
//   } catch (error) {
//     console.error("Error in multiUpload:", error);
//     return new ResponseHandler(res, 500, false, "Internal server error");
//   }
// };
