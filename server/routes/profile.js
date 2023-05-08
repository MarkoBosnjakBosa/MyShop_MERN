import * as fs from "fs";
import User from "../models/user.js";
import { createImageObject } from "../utilities/scripts.js";
import { isEmpty } from "../utilities/validations.js";

export const getProfile = async (request, response) => {
  const { userId } = request.params;
  const user = await User.findById(userId);
  if (!isEmpty(user)) {
    user.account.password = null;
    user.account.hasPermission = null;
    const { account, address, avatar } = user;
    return response.status(200).json({ account, address, avatar }).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const editAccount = async (request, response) => {
  const { userId, account } = request.body;
  const { email, firstName, lastName, mobileNumber } = account;
  const update = { "account.email": email, "account.firstName": firstName, "account.lastName": lastName, "account.mobileNumber": mobileNumber };
  const options = { new: true };
  const user = await User.findByIdAndUpdate(userId, update, options);
  if (!isEmpty(user)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const editAddress = async (request, response) => {
  const { userId, address } = request.body;
  const update = { address };
  const options = { new: true };
  const user = await User.findByIdAndUpdate(userId, update, options);
  if (!isEmpty(user)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const getAvatar = async (request, response) => {
  const { userId } = request.params;
  const user = await User.findById(userId);
  if (!isEmpty(user)) {
    const { avatar } = user;
    return response.status(200).json(avatar).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const saveAvatar = async (request, response) => {
  const { userId } = request.body;
  const avatar = request.file;
  let update;
  if (!isEmpty(avatar)) {
    const avatarObject = createImageObject(avatar);
    try { fs.unlinkSync(avatar.path); } catch (error) {}
    update = { avatar: avatarObject };
  } else {
    update = { avatar: {} };
  }
  const options = { new: true };
  const user = await User.findByIdAndUpdate(userId, update, options);
  if (!isEmpty(user)) {
    return response.status(200).json(user.avatar).end();
  } else {
    return response.status(401).json({ errors: "The provided user does not exist!" }).end();
  }
};
