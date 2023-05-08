import User from "../models/user.js";
import { smsEvents } from "../events/smsEvents.js";
import { createToken, deleteToken } from "../utilities/token.js";
import { isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const getAuthentication = async (request, response) => {
  const { userId } = request.params;
  const user = await User.findById(userId);
  if (!isEmpty(user)) {
    return response.status(200).send(user.confirmation.authenticationEnabled).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const setAuthentication = async (request, response) => {
  const { userId, authenticationEnabled } = request.body;
  let update = {};
  const options = { new: true };
  if (authenticationEnabled) {
    const user = await User.findById(userId);
    if (!isEmpty(user)) {
      const authenticationEnablingToken = request.body.authenticationEnablingToken;
      if (authenticationEnablingToken === user.confirmation.authenticationEnablingToken) {
        update = { "confirmation.authenticationEnabled": authenticationEnabled, "confirmation.authenticationEnablingToken": "" };
        const updatedUser = await User.findByIdAndUpdate(userId, update, options);
        return response.status(200).send(updatedUser.confirmation.authenticationEnabled).end();
      } else {
        return response.status(400).json({ errors: ["Token"] }).end();
      }
    } else {
      return response.status(401).json({ errors: "The provided user does not exist!" }).end();
    }
  } else {
    update = { "confirmation.authenticationEnabled": authenticationEnabled };
    const user = await User.findByIdAndUpdate(userId, update, options);
    if (!isEmpty(user)) {
      return response.status(200).send(user.confirmation.authenticationEnabled).end();
    } else {
      return response.status(401).json({ errors: "The provided user does not exist!" }).end();
    }
  }
};

export const sendAuthenticationEnablingToken = async (request, response) => {
  const { userId } = request.body;
  const authenticationEnablingToken = createToken();
  const update = { "confirmation.authenticationEnablingToken": authenticationEnablingToken };
  const options = { new: true };
  const user = await User.findByIdAndUpdate(userId, update, options);
  if (!isEmpty(user)) {
    const { mobileNumber, firstName } = user.account;
    smsEvents.emit(constants.AUTHENTICATION_ENABLING_TOKEN_SMS_EVENT, mobileNumber, firstName, authenticationEnablingToken);
    setTimeout(() => deleteToken(constants.AUTHENTICATION_ENABLING_TOKEN, userId), Number(process.env.TOKEN_EXPIRATION_TIME));
    return response.status(200).send(true).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};
