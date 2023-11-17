const Verification = require('../models/verificationModel')
const ResponseHandler = require("../utils/responseHandler")
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
      return new ResponseHandler(res, 200,true,'Category created successfully', newVerification)
     
    } catch (error) {
      return new ResponseHandler(res, 500,false,error.message )
      
    }
}

exports.getVerification = async (req, res) => {
    try {
      const verification = await Verification.find();
      if (verification.length === 0) {
        return new ResponseHandler(res, 404,false,"No license verification found" )
      }
      return new ResponseHandler(res, 200,true,"Get verification",verification )
    } catch (error) {
      return new ResponseHandler(res, 500,false,error.message )
    }
  };

//   update data
  exports.updateVerification = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
  
    if (req.files) {
      updateData.frontImage = req.files.frontImage[0].path; 
      updateData.backImage = req.files.backImage[0].path; 
    }
  
    try {
      // Find the verification by its ID
      const verification = await Verification.findById(id);
  
      if (!verification) {
        return new ResponseHandler(res, 404,false,"Verification not found" )
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
        return new ResponseHandler(res, 404,false,"Verification not found" )
      }
      return new ResponseHandler(res, 200,true,"Verification updated",updatedVerification )
    } catch (error) {
      return new ResponseHandler(res, 500,false, )
    }
  };

// delete data
exports.deleteVerification = async(req,res) => {
    const {id} = req.params
    try{
    await Verification.findByIdAndRemove(id)
    return new ResponseHandler(res, 200,true,"license verification deleted successfully" )
} catch (error) {
  return new ResponseHandler(res, 500,false,error.message)
}
}