import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { emailEvents } from "../events/emailEvents.js";
import { createToken, deleteToken } from "../utilities/token.js";
import { isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const credentials = async (request, response) => {
  const { email, option } = request.body;
  const query = { "account.email": email }; 
  const user = await User.findOne(query);
  if (!isEmpty(user)) {
    if (option === "password") {
      const resetPasswordToken = createToken();
      const update = { "confirmation.resetPasswordToken": resetPasswordToken };
      const options = { new: true };
      const updatedUser = await User.findOneAndUpdate(query, update, options);
      const { _id, account } = updatedUser;
      const { email, firstName, username } = account;
      emailEvents.emit(constants.RESET_PASSWORD_EMAIL_EVENT, email, _id, firstName, username, resetPasswordToken);
      setTimeout(() => deleteToken(constants.RESET_PASSWORD_TOKEN, _id), Number(process.env.TOKEN_EXPIRATION_TIME));
    } else if (option === "username") {
      const { email, firstName, username } = user.account;
      emailEvents.emit(constants.USERNAME_EMAIL_EVENT, email, firstName, username);
    } else {
      const confirmationToken = createToken();
      const update = { "confirmation.confirmationToken": confirmationToken };
      const options = { new: true };
      const updatedUser = await User.findOneAndUpdate(query, update, options);
      const { _id, account } = updatedUser;
      const { email, firstName, username } = account;
      emailEvents.emit(constants.CONFIRMATION_EMAIL_EVENT, email, _id, firstName, username, confirmationToken);
      setTimeout(() => deleteToken(constants.CONFIRMATION_TOKEN, _id), Number(process.env.TOKEN_EXPIRATION_TIME));
    }
    return response.status(200).send(true).end();
  } else {
    return response.status(401).json({ errors: "The provided email does not exist!" }).end();
  }
};

export const sendConfirmationEmail = async (request, response) => {
  const { userId } = request.body;
  const confirmationToken = createToken();
  const update = { "confirmation.confirmationToken": confirmationToken };
  const options = { new: true };
  const user = await User.findByIdAndUpdate(userId, update, options);
  if (!isEmpty(user)) {
    const { account } = user;
    const { email, firstName, username } = account;
    emailEvents.emit(constants.CONFIRMATION_EMAIL_EVENT, email, userId, firstName, username, confirmationToken);
    setTimeout(() => deleteToken(constants.CONFIRMATION_TOKEN, userId), Number(process.env.TOKEN_EXPIRATION_TIME));
    return response.status(200).send(true).end();
  } else {
    return response.status(401).send(false).end();
  }
};

export const resetPasswordLoggedIn = async (request, response) => {
  const { userId, password } = request.body;
  const salt = bcryptjs.genSaltSync(Number(process.env.BCRYPTJS_COST_FACTOR));
  const hashedPassword = bcryptjs.hashSync(password, salt);
  const update = { "account.password": hashedPassword };
  const options = { new: true };
  const user = await User.findByIdAndUpdate(userId, update, options);
  if (!isEmpty(user)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const resetPasswordLoggedOut = async (request, response) => {
  const { userId, password, resetPasswordToken } = request.body;
  const query = { _id: userId, "confirmation.resetPasswordToken": resetPasswordToken };
  const salt = bcryptjs.genSaltSync(Number(process.env.BCRYPTJS_COST_FACTOR));
  const hashedPassword = bcryptjs.hashSync(password, salt);
  const update = { "account.password": hashedPassword, "confirmation.resetPasswordToken": "" };
  const options = { new: true };
  const user = await User.findOneAndUpdate(query, update, options);
  if (!isEmpty(user)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};
