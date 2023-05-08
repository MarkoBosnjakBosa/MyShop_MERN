import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { emailEvents } from "../events/emailEvents.js";
import { createToken, deleteToken } from "../utilities/token.js";
import { isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const registration = async (request, response) => {
  let { account } = request.body;
  const { username, email, mobileNumber } = account;
  const query = { $or: [{ "account.username": username }, { "account.email": email }, { "account.mobileNumber": mobileNumber }] };
  const user = await User.findOne(query);
  if (!isEmpty(user)) {
    let errors;
    if (user.account.username === username) {
      errors = "Username";
    } else if (user.account.email === email) {
      errors = "Email";
    } else {
      errors = "Mobile number";
    }
    return response.status(409).json({ errors }).end();
  } else {
    const address = { street: "", houseNumber: 0, city: "", zipCode: 0, country: "" };
    const confirmationToken = createToken();
    const confirmation = { confirmed: false, confirmationToken, authenticationEnabled: true, authenticationToken: "", authenticationEnablingToken: "", resetPasswordToken: "" };
    account.hasPermission = false;
    const salt = bcryptjs.genSaltSync(Number(process.env.BCRYPTJS_COST_FACTOR));
    const hashedPassword = bcryptjs.hashSync(account.password, salt);
    account.password = hashedPassword;
    const avatar = {};
    const date = new Date().getTime();
    const newUser = new User({ account, address, confirmation, avatar, date });
    const savedUser = await newUser.save();
    const { _id } = savedUser;
    emailEvents.emit(constants.CONFIRMATION_EMAIL_EVENT, email, _id, savedUser.account.firstName, username, confirmationToken);
    setTimeout(() => deleteToken(constants.CONFIRMATION_TOKEN, _id), Number(process.env.TOKEN_EXPIRATION_TIME));
    return response.status(200).send(true).end();
  }
};

export const confirmation = async (request, response) => {
  const { userId, confirmationToken } = request.query;
  const query = { _id: userId, "confirmation.confirmationToken": confirmationToken };
  const update = { "confirmation.confirmed": true, "confirmation.confirmationToken": "" };
  const options = { new: true };
  const user = await User.findOneAndUpdate(query, update, options);
  if (!isEmpty(user)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(401).send(false).end();
  }
};
