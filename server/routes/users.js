import User from "../models/user.js";
import { select } from "../utilities/scripts.js";
import { isEmpty } from "../utilities/validations.js";
import constants from "../utilities/constants.js";

export const getUsers = async (request, response) => {
  const { search, orderBy } = request.body;
  const page = Number(request.body.page) - 1; 
  const limit = Number(request.body.limit) ? Number(request.body.limit) : 1;
  const skip = page * limit;
  const { query, sort } = select(constants.USERS, search, null, orderBy);
  const usersQuery = User.find(query).sort(sort).skip(skip).limit(limit);
  const totalQuery = User.find(query).countDocuments();
  const queries = [usersQuery, totalQuery];
  const results = await Promise.all(queries);
  const total = results[1];
  let pagesNumber = 1;
  if (total >= limit) pagesNumber = Math.ceil(total / limit);
  return response.status(200).json({ users: results[0], total, pagesNumber }).end();
};

export const getUser = async (request, response) => {
  const { userId } = request.params;
  const user = await User.findById(userId);
  if (!isEmpty(user)) {
    user.account.password = null;
    user.account.hasPermission = null;
    const { account, address } = user;
    return response.status(200).json({ account, address }).end();
  } else {
    return response.status(400).json({ errors: "The provided user does not exist!" }).end();
  }
};

export const deleteUser = async (request, response) => {
  const { userId } = request.params;
  const user = await User.findByIdAndDelete(userId);
  if (!isEmpty(user)) {
    return response.status(200).send(true).end();
  } else {
    return response.status(400).json({ errors: "The provided user does not exist!" }).end();
  }
};
