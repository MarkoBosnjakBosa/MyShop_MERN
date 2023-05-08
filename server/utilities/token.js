import User from "../models/user.js";
import constants from "./constants.js";

export const createToken = () => Math.floor(100000 + Math.random() * 900000);

export const deleteToken = async (type, userId) => {
  let update = {};
  switch (type) {
    case constants.CONFIRMATION_TOKEN:
      update = { "confirmation.confirmationToken": "" };
      break;
    case constants.AUTHENTICATION_TOKEN:
      update = { "confirmation.authenticationToken": "" };
      break;
    case constants.RESET_PASSWORD_TOKEN:
      update = { "confirmation.resetPasswordToken": "" };
      break;
    case constants.AUTHENTICATION_ENABLING_TOKEN:
      update = { "confirmation.authenticationEnablingToken": "" };
      break;
    default:
      update = {};
  }
  const options = { new: true };
  await User.findByIdAndUpdate(userId, update, options);
};
