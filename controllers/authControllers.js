import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // 🔐 бажано зберігати в .env

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, password } = req.body;
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

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = req.user;

    // Якщо користувача немає — токен неправильний
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    // Очистити токен
    user.token = null;
    await user.save();

    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { email, subscription } = user;

    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};
