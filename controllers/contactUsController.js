const ContactUs = require("../models/contactUsModel")

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
        return res
        .status(200)
        .json({ message: "ContactUs created successfully", newContact });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ message: "something went wrong", error: error.message });
    }
}