const Verification = require('../models/verificationModel')
const fs = require('fs')
// create verification
exports.createVerification = async (req,res) => {
    try{
        const {licenseNo} = req.body
        // Get the file paths for front and back images
      const frontImage = req.files['frontImage'][0].path;
      const backImage = req.files['backImage'][0].path;
      // Create a new Verification document
      const newVerification = await Verification.create({
        licenseNo: licenseNo,
        frontImage: frontImage,
        backImage: backImage,
      });
      return res.status(200).json({
        message: 'Category created successfully',
        newCategory: newVerification,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Something went wrong',
        error: error.message,
      });
    }
}
// get all verification
exports.getVerification = async (req, res) => {
    try {
      const verification = await Verification.find();
      if (verification.length === 0) {
        return res.status(404).json({ message: "No license verification found" });
      }
  
      return res.status(200).json({ verification: verification });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "unable to get license verification", error: error.message });
    }
  };

//   update data
  exports.updateVerification = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
  
    // Check if new image files are uploaded and update the image paths in updateData
    if (req.files) {
      updateData.frontImage = req.files.frontImage[0].path; // Assuming the field name is 'frontImage'
      updateData.backImage = req.files.backImage[0].path; // Assuming the field name is 'backImage'
    }
  
    try {
      // Find the verification by its ID
      const verification = await Verification.findById(id);
  
      if (!verification) {
        return res.status(404).json({ message: 'Verification not found' });
      }
  
      // Check if old images exist and if new images are uploaded
      if (req.files && verification.frontImage && verification.backImage) {
        // Delete the old images
        fs.unlinkSync(verification.frontImage);
        fs.unlinkSync(verification.backImage);
      }
  
      // Update the verification data and return the updated verification
      const updatedVerification = await Verification.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedVerification) {
        return res.status(404).json({ message: 'Verification not found' });
      }
  
      return res.status(200).json({ verification: updatedVerification });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to update verification', error: error.message });
    }
  };

// delete data
exports.deleteVerification = async(req,res) => {
    const {id} = req.params
    try{
    await Verification.findByIdAndRemove(id)
    return res.status(200).json({ message: "license verification deleted successfully" });
} catch (error) {
  return res
    .status(500)
    .json({ message: "license verification not deleted", error: error.message });
}
}