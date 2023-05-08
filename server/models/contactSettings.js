import * as mongoose from "mongoose";

const contactSettingsScheme = new mongoose.Schema({
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  street: { type: String, required: true },
  houseNumber: { type: Number, required: true, min: 0 },
  city: { type: String, required: true },
  zipCode: { type: Number, required: true, min: 0 },
  country: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true }
});

const ContactSettings = mongoose.model("ContactSettings", contactSettingsScheme);

export default ContactSettings;
