import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

export const generateToken = (payload, secret, expiresIn) => {
  if (!secret) {
    throw new Error("generateToken: secret is required");
  }

  if (!expiresIn) {
    throw new Error("generateToken: expiresIn is required");
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token, secret) => {
  if (!secret) {
    throw new Error("verifyToken: secret is required");
  }

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
};
