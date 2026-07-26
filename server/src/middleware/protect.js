import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { verifyToken } from "../utils/tokenUtils.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new AppError("You are not logged in. Please log in.", 401));
  }

  const decoded = verifyToken(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("This user no longer exists.", 401));
  }

  req.user = user;
  next();
};
