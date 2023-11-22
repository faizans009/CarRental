const verificationService = require('../services/verificationServices')
const ResponseHandler = require("../utils/responseHandler")
const fs = require('fs')
// create verification
exports.createVerification = async (req,res) => {
    try{
        const {licenseNo} = req.body
      const frontImage = req.files['frontImage'][0].path;
      const backImage = req.files['backImage'][0].path;
      const newVerification = await verificationService.createVerification({
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
      const verification = await verificationService.getVerification();
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
    try {
      if (req.files) {
        updateData.frontImage = req.files.frontImage[0].path; 
        updateData.backImage = req.files.backImage[0].path; 
      }
      const updatedVerification = await verificationService.updateVerification(id, updateData, req.files);
  
      return new ResponseHandler(res, 200,true,"Verification updated",updatedVerification )
    } catch (error) {
      return new ResponseHandler(res, 500,false, )
    }
  };

// delete data
exports.deleteVerification = async(req,res) => {
    const {id} = req.params
    try{
    await verificationService.deleteVerification(id)
    return new ResponseHandler(res, 200,true,"license verification deleted successfully" )
} catch (error) {
  return new ResponseHandler(res, 500,false,error.message)
}
}