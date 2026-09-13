import type { Request, Response } from "express";

import { createUser, getUserById, loginUser } from "./authService";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./tokens";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Error &&
      (error.message === "User with this email already exists" ||
        error.message === "Username is already taken")
    ) {
      res.status(400).json({
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const user = await loginUser(req.body);

    const accessToken = signAccessToken(user._id.toString());

    const refreshToken = signRefreshToken(user._id.toString());

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      res.status(401).json({
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        message: "Refresh token is required",
      });

      return;
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await getUserById(payload.id);

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const accessToken = signAccessToken(user._id.toString());

    res.json({
      accessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
}
