import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from "../validation/accountSchema";

export async function createAccount(userId: string, input: CreateAccountInput) {
  const existingAccount = await Account.findOne({
    userId,
    name: input.name,
  });

  if (existingAccount) {
    throw new Error("An account with this name already exists");
  }

  return Account.create({
    userId,
    name: input.name,
    type: input.type,
    balance: input.balance,
  });
}

export async function getAccounts(userId: string) {
  return Account.find({ userId }).sort({
    createdAt: 1,
  });
}

export async function getAccountById(userId: string, accountId: string) {
  const account = await Account.findOne({
    _id: accountId,
    userId,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
}

export async function updateAccount(
  userId: string,
  accountId: string,
  input: UpdateAccountInput,
) {
  if (input.name) {
    const existingAccount = await Account.findOne({
      _id: { $ne: accountId },
      userId,
      name: input.name,
    });

    if (existingAccount) {
      throw new Error("An account with this name already exists");
    }
  }

  const account = await Account.findOneAndUpdate(
    {
      _id: accountId,
      userId,
    },
    {
      $set: input,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
}

export async function deleteAccount(userId: string, accountId: string) {
  const account = await Account.findOne({
    _id: accountId,
    userId,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  const transactionCount = await Transaction.countDocuments({
    userId,
    accountId,
  });

  if (transactionCount > 0) {
    throw new Error("Cannot delete an account that has transactions");
  }

  await account.deleteOne();
}
