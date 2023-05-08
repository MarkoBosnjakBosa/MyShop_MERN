import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { smsEvents } from "../events/smsEvents.js";
import { createToken, deleteToken } from "../utilities/token.js";
import { isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const login = async (request, response) => {
  const { username, password } = request.body;
  const query = { "account.username": username };
  const user = await User.findOne(query);
  if (!isEmpty(user)) {
    if (user.confirmation.confirmed) {
      const match = bcryptjs.compareSync(password, user.account.password);
      if (match) {
        if (user.confirmation.authenticationEnabled) {
          const authenticationToken = createToken();
          const update = { "confirmation.authenticationToken": authenticationToken };
          const options = { new: true };
          const updatedUser = await User.findOneAndUpdate(query, update, options);
          const { _id, account } = updatedUser;
          const { mobileNumber, firstName } = account;
          smsEvents.emit(constants.AUTHENTICATION_TOKEN_SMS_EVENT, mobileNumber, firstName, authenticationToken);
          setTimeout(() => deleteToken(constants.AUTHENTICATION_TOKEN, _id), Number(process.env.TOKEN_EXPIRATION_TIME));
          return response.status(200).json({ authentication: true, userId: _id }).end();
        } else {
          const { _id, account } = user;
          const { username } = account;
          const token = jwt.sign({ userId: _id, username }, process.env.JWT_SECRET_KEY);
          return response.status(200).json({ authentication: false, token, userId: _id, username }).end();
        }
      } else {
        return response.status(401).json({ errors: "Password does not match!" }).end();
      }
    } else {
      return response.status(401).json({ errors: "You have to confirm the registration!" }).end();
    }
  } else {
    return response.status(400).json({ errors: ["Username"] }).end();
  }
};

export const authenticate = async (request, response) => {
  const { userId } = request.body;
  const user = await User.findById(userId);
  if (!isEmpty(user)) {
    if (request.headers["x-otp"]) {
      const authenticationToken = request.headers["x-otp"];
      if (authenticationToken === user.confirmation.authenticationToken) {
        const token = jwt.sign({ userId, username: user.account.username }, process.env.JWT_SECRET_KEY);
        const update = { "confirmation.authenticationToken": "" };
        const options = { new: true };
        await User.findByIdAndUpdate(userId, update, options);
        return response.status(200).json({ token, username: user.account.username }).end();
      } else {
        return response.status(401).json({ errors: "The provided authentication token is not valid!" }).end();
      }
    } else {
      return response.status(401).json({ errors: "The provided authentication token is not valid!" }).end();
    }
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const sendAuthenticationToken = async (request, response) => {
  const { userId } = request.body;
  const user = await User.findById(userId);
  if (!isEmpty(user)) {
    if (user.confirmation.authenticationEnabled) {
      const authenticationToken = createToken();
      const update = { "confirmation.authenticationToken": authenticationToken };
      const options = { new: true };
      const updatedUser = await User.findByIdAndUpdate(userId, update, options);
      const { mobileNumber, firstName } = updatedUser.account;
      smsEvents.emit(constants.AUTHENTICATION_TOKEN_SMS_EVENT, mobileNumber, firstName, authenticationToken);
      setTimeout(() => deleteToken(constants.AUTHENTICATION_TOKEN, userId), Number(process.env.TOKEN_EXPIRATION_TIME));
      return response.status(200).send(true).end();
    }
  } else {
    return response.status(401).send(false).end();
  }
};
