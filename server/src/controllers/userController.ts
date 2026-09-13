import type { Request, Response } from "express";
import {
  changePassword,
  deleteUser,
  getUserById,
  updateUser,
  updateProfilePhoto,
} from "../services/userService";

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await getUserById(req.user!.id);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    if (error instanceof Error && error.message === "User not found") {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Server error" });
  }
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await updateUser(req.user!.id, req.body);

    res.json({
      message: "Profile updated successfully",
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
    console.error("Update profile error:", error);

    if (error instanceof Error && error.message === "User not found") {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Server error" });
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await changePassword(req.user!.id, req.body);

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    if (error instanceof Error) {
      if (error.message === "User not found") {
        res.status(404).json({ message: error.message });
        return;
      }

      if (error.message === "Current password is incorrect") {
        res.status(401).json({ message: error.message });
        return;
      }
    }

    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteMe(req: Request, res: Response): Promise<void> {
  try {
    await deleteUser(req.user!.id);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    if (error instanceof Error && error.message === "User not found") {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Server error" });
  }
}

export async function updatePhoto(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "Profile photo is required",
      });
      return;
    }

    const user = await updateProfilePhoto(req.user!.id, req.file);

    res.json({
      message: "Profile photo updated successfully",
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.error("Profile photo update error:", error);

    if (error instanceof Error && error.message === "User not found") {
      res.status(404).json({
        message: error.message,
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "Only image files are allowed"
    ) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      message: "Failed to update profile photo",
    });
  }
}
