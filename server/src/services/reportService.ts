import { Transaction } from "../models/Transaction";
import type { TransactionQueryInput } from "../validation/transactionSchema";

export async function getTransactionReport(
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

  const transactions = await Transaction.find(query)
    .populate("accountId", "name type")
    .sort({
      date: -1,
      createdAt: -1,
    })
    .lean();

  let totalIncome = 0;
  let totalExpenses = 0;

  const categoryTotals = new Map<string, number>();

  const accountTotals = new Map<
    string,
    {
      accountId: string;
      total: number;
    }
  >();

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;

      categoryTotals.set(
        transaction.category,
        (categoryTotals.get(transaction.category) ?? 0) + transaction.amount,
      );
    }

    const accountId =
      typeof transaction.accountId === "object" &&
      transaction.accountId !== null &&
      "_id" in transaction.accountId
        ? String(transaction.accountId._id)
        : String(transaction.accountId);

    const existingAccount = accountTotals.get(accountId);

    if (existingAccount) {
      existingAccount.total += transaction.amount;
    } else {
      accountTotals.set(accountId, {
        accountId,
        total: transaction.amount,
      });
    }
  }

  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, total]) => ({
      category,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  const accountBreakdown = Array.from(accountTotals.values()).sort(
    (a, b) => b.total - a.total,
  );

  return {
    transactionCount: transactions.length,
    totalIncome,
    totalExpenses,
    netAmount: totalIncome - totalExpenses,
    categoryBreakdown,
    accountBreakdown,
    transactions,
  };
}
