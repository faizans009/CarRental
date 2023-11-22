const contactService = require("../services/contactService")
const ResponseHandler = require("../utils/responseHandler")

exports.createContactUs = async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;
    console.log('Request Body:', req.body);
    try {
        const newContact = await contactService.createContact({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            message: message
        });

        return new ResponseHandler(res, 200, true, "ContactUs created successfully", newContact);
    } catch (error) {
        return new ResponseHandler(res, 500, false, error.message);
    }
};