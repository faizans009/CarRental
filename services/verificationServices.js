const Verification = require("../models/verificationModel");
const fs = require('fs')
// create verification
async function createVerification(verify) {
  try {
    const newVerification = await Verification.create({
      licenseNo: verify.licenseNo,
      frontImage: verify.frontImage,
      backImage: verify.backImage,
    });
    return newVerification;
  } catch (error) {
    throw new Error(error.message);
}
}
// get verification
async function getVerification(){
    try{
        const verification = await Verification.find();
        return verification
    }
    catch(error){
        throw new Error(error.message);
    }
}

// update verification
async function updateVerification(id,updateData,files){
    try{
        const verification = await Verification.findById(id);
        if (!verification){
            throw new Error('License Verification not found')
        }
        if (files && verification.frontImage && verification.backImage) {
            // Delete the old images
            await fs.unlinkSync(verification.frontImage);
            await fs.unlinkSync(verification.backImage);
          }
          const updatedVerification = await Verification.findByIdAndUpdate(id, updateData, { new: true });
          if (!updatedVerification){
            throw new Error('License Verification not found')
          }
          return updatedVerification
    }
    catch(error){
        throw new Error(error.message);
    }
}
// delete verification
async function deleteVerification(id){
    try{
        await Verification.findByIdAndRemove(id)
    }
    catch(error){
        throw new Error(error.message);
    }
}


module.exports= {
    createVerification,
    getVerification,
    updateVerification,
    deleteVerification
}