const contactService = require("../services/contactService")
const ResponseHandler = require("../utils/responseHandler")

exports.createContactUs = async (req, res) => {
    // const { firstName, lastName, email, phone, message } = req.body;
    try {
        const newContact = await contactService.createContact({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,    
            phone: req.body.phone,
            message: req.body.message
        });

        return new ResponseHandler(res, 200, true, "ContactUs created successfully", newContact);
    } catch (error) {
        return new ResponseHandler(res, 500, false, error.message);
    }
};