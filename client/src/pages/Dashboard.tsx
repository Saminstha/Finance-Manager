import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

import SummaryCards from "@/components/dashboard/SummaryCards";
import MonthlyChart from "@/components/dashboard/MonthlyChart";
import SpendingChart from "@/components/dashboard/SpendingChart";

import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useBudgets } from "@/hooks/useBudgets";
import { useSavings } from "@/hooks/useSavings";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const { budgets } = useBudgets();
  const { savings } = useSavings();

  const recentTransactions = transactions.slice(0, 5);

  const getAccountName = (accountId: string) => {
    return (
      accounts.find((account) => account.id === accountId)?.name ||
      "Unknown account"
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">
          Overview of your personal finances
        </p>
      </div>

      {/* Summary */}

      <SummaryCards />

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart />
        <SpendingChart />
      </div>

      {/* Accounts + Savings */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accounts */}

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Accounts</h2>

              <p className="text-sm text-muted-foreground">
                Your current account balances
              </p>
            </div>

            <Wallet className="text-muted-foreground" />
          </div>

          <div className="space-y-3">
            {accounts.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No accounts found.
              </p>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div>
                    <p className="font-medium">{account.name}</p>

                    <p className="text-xs capitalize text-muted-foreground">
                      {account.type}
                    </p>
                  </div>

                  <p className="font-semibold">
                    Rs. {account.balance.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Savings */}

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">Savings Goals</h2>

            <p className="text-sm text-muted-foreground">
              Track your financial goals
            </p>
          </div>

          <div className="space-y-4">
            {savings.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No savings goals found.
              </p>
            ) : (
              savings.slice(0, 3).map((saving) => {
                const percentage = Math.min(
                  (saving.savedAmount / saving.targetAmount) * 100,
                  100,
                );

                return (
                  <div key={saving.id}>
                    <div className="mb-2 flex justify-between">
                      <span className="font-medium">{saving.name}</span>

                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Rs. {saving.savedAmount.toLocaleString()} of Rs.{" "}
                      {saving.targetAmount.toLocaleString()}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}

      <div className="rounded-xl border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>

          <p className="text-sm text-muted-foreground">
            Your latest income and expenses
          </p>
        </div>

        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No transactions found.
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-background p-2">
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="size-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="size-4 text-red-600" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium">{transaction.title}</p>

                    <p className="text-xs text-muted-foreground">
                      {transaction.category} •{" "}
                      {getAccountName(transaction.accountId)}
                    </p>
                  </div>
                </div>

                <p
                  className={
                    transaction.type === "income"
                      ? "font-semibold text-green-600"
                      : "font-semibold text-red-600"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"} Rs.{" "}
                  {transaction.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Budget Overview */}

      <div className="rounded-xl border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Budget Overview</h2>

          <p className="text-sm text-muted-foreground">
            How you're doing with your budgets
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {budgets.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No budgets found.
            </p>
          ) : (
            budgets.slice(0, 3).map((budget) => {
              const spent = transactions
                .filter(
                  (transaction) =>
                    transaction.type === "expense" &&
                    transaction.category === budget.category &&
                    new Date(transaction.date).getMonth() + 1 ===
                      budget.month &&
                    new Date(transaction.date).getFullYear() === budget.year,
                )
                .reduce((total, transaction) => total + transaction.amount, 0);

              const percentage = Math.min((spent / budget.amount) * 100, 100);

              return (
                <div key={budget.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium">{budget.category}</span>

                    <span className="text-sm text-muted-foreground">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Rs. {spent.toLocaleString()} spent</span>

                    <span>Rs. {budget.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
