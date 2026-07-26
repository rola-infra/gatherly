import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import sendResponse from "../utils/sendResponse.js";
import { generateToken, verifyToken } from "../utils/tokenUtils.js";

const createTokens = (userId) => {
  const accessToken = generateToken(
    { id: userId },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN,
  );
  const refreshToken = generateToken(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN,
  );
  return { accessToken, refreshToken };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";

  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  };

  res.cookie("accessToken", accessToken, {
    ...base,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...base,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError("Email already in use", 400));
  }

  const user = await User.create({ name, email, password });

  const { accessToken, refreshToken } = createTokens(user._id);
  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, 201, {
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const { accessToken, refreshToken } = createTokens(user._id);
  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, 200, {
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new AppError("No refresh token provided", 401));
  }

  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

  const newAccessToken = generateToken(
    { id: decoded.id },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN,
  );

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  sendResponse(res, 200, { message: "Access token refreshed" });
};

export const logout = async (req, res, next) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  sendResponse(res, 200, { message: "Logged out" });
};
