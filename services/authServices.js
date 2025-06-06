import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  return {
    email: newUser.email,
    subscription: newUser.subscription,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  user.token = token;
  await user.save();

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const logoutUser = async (user) => {
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  user.token = null;
  await user.save();
};

export const getCurrentUser = async (user) => {
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  return {
    email: user.email,
    subscription: user.subscription,
  };
};
