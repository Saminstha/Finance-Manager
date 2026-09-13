import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { TRANSACTION_CATEGORIES } from "@/constants/finance";
import AddTransactionForm from "@/components/transactions/AddTransactionForm";

import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";

import type { Transaction, TransactionType } from "@/types/transaction";

export default function Transactions() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
    error,
  } = useTransactions();

  const { accounts } = useAccounts();

  // Add dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Edit dialog
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Filters
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [accountFilter, setAccountFilter] = useState("all");

  const [monthFilter, setMonthFilter] = useState("all");

  /*
   * ADD TRANSACTION
   */
  const handleAddTransaction = async (data: Omit<Transaction, "id">) => {
    const result = await addTransaction(data);

    if (result.meta.requestStatus === "fulfilled") {
      setAddDialogOpen(false);
    }
  };

  /*
   * EDIT TRANSACTION
   */
  const handleEditTransaction = async (data: Omit<Transaction, "id">) => {
    if (!editingTransaction) {
      return;
    }

    const result = await updateTransaction(editingTransaction.id, data);

    if (result.meta.requestStatus === "fulfilled") {
      setEditingTransaction(null);
    }
  };

  /*
   * GET ACCOUNT NAME
   */
  const getAccountName = (accountId: string) => {
    return (
      accounts.find((account) => account.id === accountId)?.name ||
      "Unknown account"
    );
  };

  /*
   * GET AVAILABLE MONTHS
   */
  const months = useMemo(() => {
    return Array.from(
      new Set(transactions.map((transaction) => transaction.date.slice(0, 7))),
    )
      .sort()
      .reverse();
  }, [transactions]);

  /*
   * FILTER TRANSACTIONS
   */
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const accountName = getAccountName(transaction.accountId);

      const searchText = search.toLowerCase();

      const matchesSearch =
        transaction.title.toLowerCase().includes(searchText) ||
        transaction.category.toLowerCase().includes(searchText) ||
        accountName.toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" || transaction.category === categoryFilter;

      const matchesAccount =
        accountFilter === "all" || transaction.accountId === accountFilter;

      const matchesMonth =
        monthFilter === "all" || transaction.date.startsWith(monthFilter);

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesAccount &&
        matchesMonth
      );
    });
  }, [
    transactions,
    accounts,
    search,
    typeFilter,
    categoryFilter,
    accountFilter,
    monthFilter,
  ]);

  /*
   * RESET FILTERS
   */
  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setAccountFilter("all");
    setMonthFilter("all");
  };

  const hasFilters =
    search !== "" ||
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    accountFilter !== "all" ||
    monthFilter !== "all";

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>

          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>

        {/* ADD TRANSACTION DIALOG */}

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger
            render={
              <Button disabled={isLoading}>
                <Plus />
                Add Transaction
              </Button>
            }
          />

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>

              <DialogDescription>
                Add your income or expense details below.
              </DialogDescription>
            </DialogHeader>

            <AddTransactionForm onSubmit={handleAddTransaction} />
          </DialogContent>
        </Dialog>
      </div>

      {/* =====================================================
          EDIT TRANSACTION DIALOG

          IMPORTANT:
          There is ONLY ONE edit dialog.
          It is outside the transactions.map().
      ====================================================== */}

      <Dialog
        open={editingTransaction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTransaction(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>

            <DialogDescription>
              Update your transaction details below.
            </DialogDescription>
          </DialogHeader>

          {editingTransaction && (
            <AddTransactionForm
              initialData={{
                title: editingTransaction.title,
                amount: editingTransaction.amount,
                type: editingTransaction.type,
                category: editingTransaction.category,
                accountId: editingTransaction.accountId,
                date: editingTransaction.date,
                description: editingTransaction.description,
              }}
              submitLabel="Update Transaction"
              onSubmit={handleEditTransaction}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="rounded-xl border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {/* SEARCH */}

          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-9"
              placeholder="Search transactions..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {/* TYPE */}

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as "all" | TransactionType)
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All Types</option>

            <option value="income">Income</option>

            <option value="expense">Expense</option>
          </select>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All Categories</option>

            {TRANSACTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* ACCOUNT */}

          <select
            value={accountFilter}
            onChange={(event) => setAccountFilter(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All Accounts</option>

            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {/* MONTH */}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All Months</option>

            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {hasFilters && (
            <Button variant="ghost" onClick={resetFilters}>
              <X />
              Reset Filters
            </Button>
          )}

          <span className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </span>
        </div>
      </div>

      {/* =====================================================
          LOADING
      ====================================================== */}

      {isLoading && transactions.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          Loading transactions...
        </div>
      )}

      {/* =====================================================
          TRANSACTION LIST
      ====================================================== */}

      <div className="space-y-3">
        {!isLoading && filteredTransactions.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <p className="font-medium">No transactions found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const accountName = getAccountName(transaction.accountId);

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-xl border bg-card p-4"
              >
                {/* TRANSACTION INFO */}

                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-3">
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="text-green-600" />
                    ) : (
                      <ArrowDownRight className="text-red-600" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium">{transaction.title}</h3>

                    <p className="text-sm text-muted-foreground">
                      {transaction.category} • {accountName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                {/* AMOUNT + ACTIONS */}

                <div className="flex items-center gap-3">
                  {/* AMOUNT */}

                  <div
                    className={
                      transaction.type === "income"
                        ? "font-semibold text-green-600"
                        : "font-semibold text-red-600"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"} Rs.{" "}
                    {transaction.amount.toLocaleString()}
                  </div>

                  {/* EDIT */}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTransaction(transaction)}
                  >
                    <Pencil />
                  </Button>

                  {/* DELETE */}

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      }
                    />

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>

                        <AlertDialogDescription>
                          This will permanently delete "{transaction.title}".
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => deleteTransaction(transaction.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
