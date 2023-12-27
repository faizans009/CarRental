const ResponseHandler = require("../utils/responseHandler")
const ContactUs = require("../models/contactUsModel");
exports.createContactUs = async (req, res) => {
    const userId=req.user.id
    try {
        const newContact = await ContactUs.create({
            user:userId, 
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,    
            phone: req.body.phone,
            message: req.body.message
        });

        return new ResponseHandler(res, 200, true, "ContactUs created successfully", newContact);
    } catch (error) {
        console.log(error.message);
        return new ResponseHandler(res, 500, false, error.message);
    }
};

// get contact us
exports.getContactUs = async (req, res) => {
    if (
        (req.user._id && req.user.role === "admin") ||
        req.user.role === "superAdmin"
      ) {
    try {
        const contactUs = await ContactUs.find();
        return new ResponseHandler(res, 200, true, "ContactUs retrieved successfully", contactUs);
    } catch (error) {
        console.log(error.message);
        return new ResponseHandler(res, 500, false, error.message);
    }
} else {
  return new ResponseHandler(
    res,
    403,
    false,
    "Unauthorized. Only admin users can get contact info"
  );
}
};

// delete contact
exports.deleteContactUs = async (req, res) => {
    if (
        (req.user._id && req.user.role === "admin") ||
        req.user.role === "superAdmin"
      ) {
    try {
        const contactUs = await ContactUs.findByIdAndDelete(req.params.id);
        return new ResponseHandler(res, 200, true, "ContactUs deleted successfully", contactUs);
    } catch (error) {
        console.log(error.message);
        return new ResponseHandler(res, 500, false, error.message);
    }
} else {
  return new ResponseHandler(
    res,
    403,
    false,
    "Unauthorized. Only admin users can delete contact info"
  );
}
};