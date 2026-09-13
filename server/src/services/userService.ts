import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import { Budget } from "../models/Budget";
import { Saving } from "../models/Saving";
import type {
  ChangePasswordInput,
  UpdateUserInput,
} from "../validation/userSchema";
import cloudinary from "../config/cloudinary";

export async function getUserById(userId: string) {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateUser(userId: string, data: UpdateUserInput) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function changePassword(
  userId: string,
  data: ChangePasswordInput,
) {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(
    data.currentPassword,
    user.password,
  );

  if (!passwordMatch) {
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(data.newPassword, 10);

  await user.save();
}

export async function deleteUser(userId: string) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new Error("User not found");
    }

    await Transaction.deleteMany({ userId }, { session });

    await Budget.deleteMany({ userId }, { session });

    await Saving.deleteMany({ userId }, { session });

    await Account.deleteMany({ userId }, { session });

    await user.deleteOne({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function updateProfilePhoto(
  userId: string,
  file: Express.Multer.File,
) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "finance-manager/profile-photos",
        public_id: userId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(file.buffer);
  });

  user.profilePhoto = uploadResult.secure_url;
  await user.save();

  return user;
}
