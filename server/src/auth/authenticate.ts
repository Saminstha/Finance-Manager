import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

import { verifyAccessToken } from "./tokens";
import { User } from "../models/User";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Unauthorized",
    });

    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.id).select("_id").lean();

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    req.user = {
      id: user._id.toString(),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    next(error);
  }
}
