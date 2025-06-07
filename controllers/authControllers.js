import HttpError from "../helpers/HttpError.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import * as authServices from "../services/authServices.js";

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const userData = await authServices.registerUser(req.body);

    res.status(201).json({ user: userData });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const data = await authServices.loginUser(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authServices.logoutUser(req.user);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const currentUser = await authServices.getCurrentUser(req.user);
    res.status(200).json(currentUser);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "File is required");
    }

    const avatarURL = await authServices.updateUserAvatar(req.user, req.file);

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};