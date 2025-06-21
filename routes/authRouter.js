import express from "express";
import { register, login, updateAvatar } from "../controllers/authControllers.js";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { getCurrent, logout } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/current", auth, getCurrent);
authRouter.post("/logout", auth, logout);
authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default authRouter;
