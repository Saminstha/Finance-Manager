import bcrypt from "bcryptjs";

import { User } from "../models/User";

import type { CreateUserInput } from "../validation/userSchema";
import type { LoginInput } from "./authSchemas";

const SALT_ROUNDS = 10;

export async function createUser(input: CreateUserInput) {
  const existingEmail = await User.findOne({
    email: input.email.toLowerCase(),
  });

  if (existingEmail) {
    throw new Error("User with this email already exists");
  }

  const existingUsername = await User.findOne({
    username: input.username,
  });

  if (existingUsername) {
    throw new Error("Username is already taken");
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    username: input.username,
    name: input.name,
    email: input.email.toLowerCase(),
    password: hashedPassword,
    phone: input.phone,
    dateOfBirth: input.dateOfBirth,
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({
    email: input.email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(input.password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
}

export async function getUserById(userId: string) {
  return User.findById(userId);
}
