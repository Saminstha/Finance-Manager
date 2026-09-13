import mongoose from "mongoose";
import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import type {
  CreateTransactionInput,
  TransactionQueryInput,
  UpdateTransactionInput,
} from "../validation/transactionSchema";

function getBalanceChange(amount: number, type: "income" | "expense") {
  return type === "income" ? amount : -amount;
}

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
) {
  const account = await Account.findOne({
    _id: input.accountId,
    userId,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  const balanceChange = getBalanceChange(input.amount, input.type);

  if (account.balance + balanceChange < 0) {
    throw new Error("Insufficient account balance");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [transaction] = await Transaction.create(
      [
        {
          userId,
          accountId: input.accountId,
          title: input.title,
          amount: input.amount,
          type: input.type,
          category: input.category,
          date: input.date,
          description: input.description,
        },
      ],
      { session },
    );

    await Account.updateOne(
      {
        _id: input.accountId,
        userId,
      },
      {
        $inc: {
          balance: balanceChange,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function getTransactions(
  userId: string,
  filters: TransactionQueryInput = {},
) {
  const query: Record<string, unknown> = {
    userId,
  };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.accountId) {
    query.accountId = filters.accountId;
  }

  if (filters.startDate || filters.endDate) {
    const dateFilter: Record<string, Date> = {};

    if (filters.startDate) {
      dateFilter.$gte = filters.startDate;
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);

      dateFilter.$lte = endDate;
    }

    query.date = dateFilter;
  }

  return Transaction.find(query).populate("accountId", "name type").sort({
    date: -1,
    createdAt: -1,
  });
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  input: UpdateTransactionInput,
) {
  const existingTransaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  const newAccountId =
    input.accountId ?? existingTransaction.accountId.toString();

  const newAmount = input.amount ?? existingTransaction.amount;

  const newType = input.type ?? existingTransaction.type;

  const oldBalanceChange = getBalanceChange(
    existingTransaction.amount,
    existingTransaction.type,
  );

  const newBalanceChange = getBalanceChange(newAmount, newType);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const oldAccount = await Account.findOne({
      _id: existingTransaction.accountId,
      userId,
    }).session(session);

    const newAccount = await Account.findOne({
      _id: newAccountId,
      userId,
    }).session(session);

    if (!oldAccount || !newAccount) {
      throw new Error("Account not found");
    }

    if (oldAccount._id.toString() === newAccount._id.toString()) {
      const finalBalance =
        oldAccount.balance - oldBalanceChange + newBalanceChange;

      if (finalBalance < 0) {
        throw new Error("Insufficient account balance");
      }

      oldAccount.balance = finalBalance;

      await oldAccount.save({ session });
    } else {
      const oldAccountFinalBalance = oldAccount.balance - oldBalanceChange;

      if (oldAccountFinalBalance < 0) {
        throw new Error("Insufficient account balance");
      }

      const newAccountFinalBalance = newAccount.balance + newBalanceChange;

      if (newAccountFinalBalance < 0) {
        throw new Error("Insufficient account balance");
      }

      oldAccount.balance = oldAccountFinalBalance;

      newAccount.balance = newAccountFinalBalance;

      await oldAccount.save({ session });
      await newAccount.save({ session });
    }

    Object.assign(existingTransaction, input);

    existingTransaction.accountId = new mongoose.Types.ObjectId(newAccountId);

    await existingTransaction.save({ session });

    await session.commitTransaction();

    return existingTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const transaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    }).session(session);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const account = await Account.findOne({
      _id: transaction.accountId,
      userId,
    }).session(session);

    if (!account) {
      throw new Error("Account not found");
    }

    const balanceChange = getBalanceChange(
      transaction.amount,
      transaction.type,
    );

    account.balance -= balanceChange;

    await account.save({ session });

    await transaction.deleteOne({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}
