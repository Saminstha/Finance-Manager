import type { Request, Response } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/transactionService";

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const transaction = await createTransaction(req.user!.id, req.body);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    if (error instanceof Error) {
      if (
        error.message === "Account not found" ||
        error.message === "Insufficient account balance"
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
    }

    res.status(500).json({ message: "Server error" });
  }
}

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const transactions = await getTransactions(req.user!.id, req.query);

    res.json({
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const transaction = await updateTransaction(
      req.user!.id,
      req.params.id as string,
      req.body,
    );

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);

    if (error instanceof Error) {
      if (error.message === "Transaction not found") {
        res.status(404).json({ message: error.message });
        return;
      }

      if (
        error.message === "Account not found" ||
        error.message === "Insufficient account balance"
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
    }

    res.status(500).json({ message: "Server error" });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteTransaction(req.user!.id, req.params.id as string);

    res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    if (error instanceof Error) {
      if (
        error.message === "Transaction not found" ||
        error.message === "Account not found"
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
    }

    res.status(500).json({ message: "Server error" });
  }
}
