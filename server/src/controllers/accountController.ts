import type { Request, Response } from "express";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "../services/accountService";

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const account = await createAccount(req.user!.id, req.body);

    res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    console.error("Create account error:", error);

    if (
      error instanceof Error &&
      error.message === "An account with this name already exists"
    ) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const accounts = await getAccounts(req.user!.id);

    res.json({
      accounts,
    });
  } catch (error) {
    console.error("Get accounts error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const account = await updateAccount(
      req.user!.id,
      req.params.id as string,
      req.body,
    );

    res.json({
      message: "Account updated successfully",
      account,
    });
  } catch (error) {
    console.error("Update account error:", error);

    if (error instanceof Error) {
      if (error.message === "Account not found") {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error.message === "An account with this name already exists") {
        res.status(400).json({
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteAccount(req.user!.id, req.params.id as string);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    if (error instanceof Error) {
      if (error.message === "Account not found") {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error.message === "Cannot delete an account that has transactions") {
        res.status(400).json({
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}
