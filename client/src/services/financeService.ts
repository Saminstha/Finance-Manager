import type { Transaction } from "@/types/transaction";
import type { Account } from "@/types/account";
import type { Saving } from "@/types/saving";

export function calculateFinanceSummary(
  transactions: Transaction[],
  accounts: Account[],
  savingsGoals: Saving[],
) {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = accounts.reduce(
    (total, account) => total + account.balance,
    0,
  );

  const savings = savingsGoals.reduce(
    (total, saving) => total + saving.savedAmount,
    0,
  );

  return {
    income,
    expenses,
    balance,
    savings,
  };
}
