import { Account } from "../models/Account";
import { Transaction } from "../models/Transaction";
import { Budget } from "../models/Budget";

export async function getDashboardSummary(userId: string) {
  const accounts = await Account.find({ userId }).sort({ createdAt: 1 }).lean();

  const transactions = await Transaction.find({ userId })
    .sort({ date: -1, createdAt: -1 })
    .populate("accountId", "name type")
    .lean();

  const budgets = await Budget.find({ userId })
    .sort({ year: -1, month: -1, category: 1 })
    .lean();

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0,
  );

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const netSavings = totalIncome - totalExpenses;

  const recentTransactions = transactions.slice(0, 5);

  const monthlyData = new Map<
    string,
    {
      month: number;
      year: number;
      income: number;
      expenses: number;
    }
  >();

  for (const transaction of transactions) {
    const date = new Date(transaction.date);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const key = `${year}-${month}`;

    if (!monthlyData.has(key)) {
      monthlyData.set(key, {
        month,
        year,
        income: 0,
        expenses: 0,
      });
    }

    const current = monthlyData.get(key)!;

    if (transaction.type === "income") {
      current.income += transaction.amount;
    } else {
      current.expenses += transaction.amount;
    }
  }

  const monthlyIncomeExpenses = Array.from(monthlyData.values())
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      return a.month - b.month;
    })
    .slice(-6);

  const budgetSummary = budgets.map((budget) => {
    const spent = transactions
      .filter((transaction) => {
        if (transaction.type !== "expense") {
          return false;
        }

        const transactionDate = new Date(transaction.date);

        return (
          transaction.category === budget.category &&
          transactionDate.getMonth() + 1 === budget.month &&
          transactionDate.getFullYear() === budget.year
        );
      })
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      id: budget._id,
      category: budget.category,
      budgetAmount: budget.amount,
      spent,
      remaining: Math.max(budget.amount - spent, 0),
      percentage:
        budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0,
      month: budget.month,
      year: budget.year,
    };
  });

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    netSavings,
    accountCount: accounts.length,
    transactionCount: transactions.length,
    recentTransactions,
    monthlyIncomeExpenses,
    budgetSummary,
  };
}
