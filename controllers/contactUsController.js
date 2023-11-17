const ContactUs = require("../models/contactUsModel")
const ResponseHandler = require("../utils/responseHandler")

exports.createContactUs = async (req,res) =>{
    const { firstName, lastName,email,phone, message} = req.body;
    try{
        const newContact = await ContactUs.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            phone:phone,
            message:message
        })
        return new ResponseHandler(res, 200,true,"ContactUs created successfully",newContact )
    } catch (error) {
        return new ResponseHandler(res, 500,false,error.message )
      
    }
}