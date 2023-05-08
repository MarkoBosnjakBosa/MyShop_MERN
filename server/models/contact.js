import * as mongoose from "mongoose";

const contactScheme = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  message: { type: String, required: true }
});

const Contact = mongoose.model("Contact", contactScheme);

export default Contact;
