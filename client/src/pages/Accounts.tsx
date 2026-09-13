import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Banknote, Landmark, Pencil, Plus, Trash2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";

import { useAccounts } from "@/hooks/useAccounts";

import type { Account, AccountType } from "@/types/account";

const accountSchema = z.object({
  name: z.string().trim().min(1, "Account name is required"),

  type: z.enum(["cash", "bank", "wallet"]),

  balance: z.number().min(0, "Balance cannot be negative"),
});

type AccountFormData = z.infer<typeof accountSchema>;

export default function Accounts() {
  const {
    accounts,
    isLoading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
  } = useAccounts();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),

    defaultValues: {
      name: "",
      type: "cash",
      balance: 0,
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (editingAccount) {
      reset({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: editingAccount.balance,
      });
    } else {
      reset({
        name: "",
        type: "cash",
        balance: 0,
      });
    }
  }, [editingAccount, reset]);

  const openAddDialog = () => {
    setEditingAccount(null);

    reset({
      name: "",
      type: "cash",
      balance: 0,
    });

    setDialogOpen(true);
  };

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: AccountFormData) => {
    if (editingAccount) {
      const result = await updateAccount(editingAccount.id, {
        name: data.name,
        type: data.type,
      });

      if (result.meta.requestStatus !== "fulfilled") {
        return;
      }
    } else {
      const result = await addAccount({
        name: data.name,
        type: data.type,
        balance: data.balance,
      });

      if (result.meta.requestStatus !== "fulfilled") {
        return;
      }
    }

    setDialogOpen(false);
    setEditingAccount(null);

    reset({
      name: "",
      type: "cash",
      balance: 0,
    });
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setEditingAccount(null);

      reset({
        name: "",
        type: "cash",
        balance: 0,
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    const result = await deleteAccount(deleteId);

    if (result.meta.requestStatus === "fulfilled") {
      setDeleteId(null);
    }
  };

  const getIcon = (accountType: AccountType) => {
    if (accountType === "cash") {
      return Banknote;
    }

    if (accountType === "bank") {
      return Landmark;
    }

    return Wallet;
  };

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>

          <p className="text-muted-foreground">
            Manage your cash, bank accounts and digital wallets
          </p>
        </div>

        <Button onClick={openAddDialog} disabled={isLoading}>
          <Plus />
          Add Account
        </Button>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Total Balance */}

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total Balance</p>

          <p className="mt-1 text-3xl font-bold">
            Rs. {totalBalance.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Loading */}

      {isLoading && accounts.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          Loading accounts...
        </div>
      )}

      {/* Empty */}

      {!isLoading && accounts.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No accounts yet.</p>

            <Button className="mt-4" onClick={openAddDialog}>
              <Plus />
              Add your first account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Accounts */}

      {accounts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const Icon = getIcon(account.type);

            return (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
                        <Icon className="size-5" />
                      </div>

                      <CardTitle>{account.name}</CardTitle>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(account)}
                        disabled={isLoading}
                        aria-label={`Edit ${account.name}`}
                      >
                        <Pencil />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeleteId(account.id)}
                        disabled={isLoading}
                        aria-label={`Delete ${account.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-2xl font-bold">
                    Rs. {account.balance.toLocaleString()}
                  </p>

                  <p className="mt-1 text-sm capitalize text-muted-foreground">
                    {account.type === "wallet"
                      ? "Digital Wallet"
                      : account.type}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? "Edit Account" : "Add Account"}
            </DialogTitle>

            <DialogDescription>
              {editingAccount
                ? "Update your account name or type."
                : "Add a new account or digital wallet."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {/* Name */}

            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>

              <Input
                id="name"
                placeholder="e.g. NIC Asia"
                {...register("name")}
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Type */}

            <div className="space-y-2">
              <Label>Account Type</Label>

              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setValue("type", (value ?? "cash") as AccountType, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>

              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Balance */}

            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance</Label>

              <Input
                id="balance"
                type="number"
                min="0"
                placeholder="e.g. 15000"
                disabled={!!editingAccount}
                {...register("balance", {
                  valueAsNumber: true,
                })}
              />

              {editingAccount && (
                <p className="text-xs text-muted-foreground">
                  Balance is updated automatically through transactions.
                </p>
              )}

              {errors.balance && (
                <p className="text-sm text-destructive">
                  {errors.balance.message}
                </p>
              )}
            </div>

            {/* Submit */}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingAccount
                  ? "Update Account"
                  : "Add Account"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account?</AlertDialogTitle>

            <AlertDialogDescription>
              This account will be permanently deleted. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
