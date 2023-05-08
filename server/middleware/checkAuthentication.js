import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { validUsername, validObjectId, isEmpty } from "../utilities/validations.js";

export const isLoggedIn = async (request, response, next) => {
  try {
    const token = request.headers.authentication.split(" ")[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userId, username } = verifiedToken;
    if (validObjectId(userId) && validUsername(username)) {
      const query = { _id: userId, "account.username": username };
      const user = await User.findOne(query);
      if (!isEmpty(user)) {
        return next();
      } else {
        return response.status(401).json({ errors: "No permission!" }).end();
      }
    } else {
      return response.status(401).json({ errors: "No permission!" }).end();
    }
  } catch (error) {
    return response.status(401).json({ errors: "No permission!" }).end();
  }
};
