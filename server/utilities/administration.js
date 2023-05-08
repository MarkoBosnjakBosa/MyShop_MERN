import bcryptjs from "bcryptjs";
import User from "../models/user.js";

export const createAdministrator = async () => {
  const password = process.env.ADMINISTRATOR_DEFAULT_PASSWORD;
  const salt = bcryptjs.genSaltSync(Number(process.env.BCRYPTJS_COST_FACTOR));
  const hashedPassword = bcryptjs.hashSync(password, salt);
  const query = { "account.username": process.env.ADMINISTRATOR_DEFAULT_USERNAME };
  const update = { $setOnInsert: { account: { username: process.env.ADMINISTRATOR_DEFAULT_USERNAME, email: "default@default.com", password: hashedPassword, firstName: "default", lastName: "default", mobileNumber: "1", hasPermission: true }, address: { street: "default", houseNumber: 1, city: "default", zipCode: 1, country: "default" }, confirmation: { confirmed: true, confirmationToken: "", authenticationEnabled: false, authenticationToken: "", authenticationEnablingToken: "", resetPasswordToken: "" }, avatar: {}, date: new Date().getTime() } };
  const options = { upsert: true, new: true };
  await User.findOneAndUpdate(query, update, options);
};
