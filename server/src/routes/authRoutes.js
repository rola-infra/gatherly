import express from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../validators/authValidator.js";

const router = express.Router();

router.route("/signup").post(validate(signupSchema), signup);
router.route("/login").post(validate(loginSchema), login);
router.route("/refresh").post(refreshAccessToken);
router.route("/logout").post(logout);

export default router;
