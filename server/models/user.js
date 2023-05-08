import * as mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  account: {
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true, index: { unique: true } },
    hasPermission: { type: Boolean, required: true }
  },
  address: {
    street: { type: String },
    houseNumber: { type: Number, min: 0 },
    city: { type: String },
    zipCode: { type: Number, min: 0 },
    country: { type: String }
  },
  confirmation: {
    confirmed: { type: Boolean, required: true },
    confirmationToken: { type: String },
    authenticationEnabled: { type: Boolean, required: true },
    authenticationToken: { type: String },
    authenticationEnablingToken: { type: String },
    resetPasswordToken: { type: String }
  },
  avatar: { name: String, mimeType: String, buffer: Buffer },
  date: { type: Number, required: true }
});

const User = mongoose.model("User", userScheme);

export default User;
