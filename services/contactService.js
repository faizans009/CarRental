const ContactUs = require("../models/contactUsModel");

async function createContact(contactUs) {
  try {
    const newContact = await ContactUs.create({
        firstName: contactUs.firstName,
        lastName: contactUs.lastName,
        email: contactUs.email,
        phone: contactUs.phone,
        message: contactUs.message
    });
    return newContact
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {createContact}