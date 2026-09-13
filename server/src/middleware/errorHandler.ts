import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error);

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.issues,
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Database validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      message: "Invalid ID or value",
    });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    res.status(409).json({
      message: "A record with the same unique value already exists",
    });
    return;
  }

  if (error instanceof Error) {
    if (
      error.message === "Missing or invalid Authorization header" ||
      error.message === "Invalid access token"
    ) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
  }

  res.status(500).json({
    message: "Server error",
  });
};
